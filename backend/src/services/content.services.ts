import axios from "axios";
import { Request, Response } from "express";
import { load } from "cheerio";
import { formatDataForEmbedding } from "../utils/formatContentForEmbedding.js";
import { prisma } from "../db.js";
import { getEmbedding } from "../utils/generateEmbeddings.js";
import { formatArrayAsVectorString } from "../utils/formatArrayAsVectorString.js";

export const post = async (req: Request, res: Response) => {
  try {
    let metadata;
    const { url } = req.body;
    const response = await axios.get(url);
    console.log("reponse", response);
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

    const {formattedData} = formatDataForEmbedding(req.body, metadata);

    console.log("formattedData", formattedData);

    const temp = await getEmbedding(formattedData);
    const data = formatArrayAsVectorString(temp);

    console.log("data", data);

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
        gen_random_uuid(),
        '2e058585-8136-4d30-a385-fd737c2a0476',
        NOW(),
        NOW(),
        false ,
        ${formattedData},
        ${data}::vector
      );
    `;

    console.log("result", result);
  } catch (error) {
    //@ts-ignore
    console.log("error", error.message);
  }
};

export const getContent = async (req: Request, res: Response) => {
  const { searchQuery } = req.body;

  const embedding = await getEmbedding(searchQuery)
  const arrayLiteral = formatArrayAsVectorString(embedding)
    const results = await prisma.$queryRaw`

    SELECT 
      "id", 
      "summary", 
      1 - ("embedding" <=> ${arrayLiteral}::vector(384)) AS similarity
    FROM "Content"
    WHERE "embedding" IS NOT NULL 
      AND 1 - ("embedding" <=> ${arrayLiteral}::vector(384)) > 0.2
    ORDER BY similarity DESC
    LIMIT 5
  `;
};

export const getAllContent = async () => {};
