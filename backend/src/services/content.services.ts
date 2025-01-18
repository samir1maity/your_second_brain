import axios from "axios";
import { load } from "cheerio";
import { formatDataForEmbedding } from "../utils/formatContentForEmbedding.js";
import { prisma } from "../db.js";
import { getEmbedding } from "../utils/generateEmbeddings.js";
import { formatArrayAsVectorString } from "../utils/formatArrayAsVectorString.js";
import { v4 as uuidv4 } from 'uuid';

export const post = async (data: any, user: any) => {
  console.log('call reached')
  console.log('user', user)
  try {
    let metadata;
    const { url } = data;
    const response = await axios.get(url);

    if (response) {
      const html = response?.data;
      if (!html) throw new Error("Empty HTML response");
      const $ = load(html);
      if (!$) throw new Error("Failed to parse HTML");

      metadata = {
        title: $("title").text() || "",
        description: $('meta[name="description"]').attr("content") || "",
        ogTitle: $('meta[property="og:title"]').attr("content") || "",
        ogDescription:
          $('meta[property="og:description"]').attr("content") || "",
        ogImage: $('meta[property="og:image"]').attr("content") || "",
      };
    }

    const { formattedData } = formatDataForEmbedding(data, metadata);

    const temp = await getEmbedding(formattedData);
    const arrayLiteral = formatArrayAsVectorString(temp);

    const randomUuid = uuidv4();

  console.log('uuid', typeof randomUuid)

  if (!randomUuid) {
    throw new Error('ID is undefined');
  }

  console.log('formattedData', formattedData)
  console.log('arrayLiteral', arrayLiteral)
  // console.log('NOW(', NOW())
  

    const result = await prisma.$executeRaw`
      INSERT INTO "Content" (
        "id",
        "userId",
        "createdAt",
        "updatedAt",
        "isArchived",
        "summary",
        "embedding"
      )
      VALUES (
        ${randomUuid},
        ${user},
        NOW(),
        NOW(),
        false ,
        ${formattedData},
        ${arrayLiteral}::vector
      );
    `;

    return result;
  } catch (error) {
    throw error;
  }
};

export const get = async (data: any, user: any) => {
  try {
    const { searchQuery } = data;

    const embedding = await getEmbedding(searchQuery);
    const arrayLiteral = formatArrayAsVectorString(embedding);
    const results = await prisma.$queryRaw`
      SELECT 
        "id", 
        "summary", 
        1 - ("embedding" <=> ${arrayLiteral}::vector(384)) AS similarity
      FROM "Content"
      WHERE "embedding" IS NOT NULL 
      AND "userId" = ${user} 
        AND 1 - ("embedding" <=> ${arrayLiteral}::vector(384)) > 0.2
      ORDER BY similarity DESC
      LIMIT 5
    `;
    return results
  } catch (error) {
    throw error;
  }
};

export const getOne = async (id: string, user: any) => {
  try {
    const data = await prisma.content.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        userId: true,
        title: true,
        contentText: true,
        createdAt: true,
        updatedAt: true,
        isArchived: true,
        tags: true
      }
    });
    return data
  } catch (error) {
    throw error
  }
};
