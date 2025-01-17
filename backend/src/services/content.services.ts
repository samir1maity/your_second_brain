import axios from "axios";
import { Request, Response } from "express";
import { load } from "cheerio";
import { formatDataForEmbedding } from "../utils/formatContentForEmbedding.js";
import { pipeline } from "@xenova/transformers";
import { prisma } from "../db.js";

const generateEmbeddings = await pipeline(
  "feature-extraction",
  "Xenova/all-MiniLM-L6-v2"
);

const getEmbedding = async (text: string) => {
  const output1 = await generateEmbeddings(text, {
    pooling: "mean",
    normalize: true,
  });

  return Array.from(output1.data);
};

function formatArrayForVector(arr: number[]): string {
  return `[${arr.join(",")}]`;
}

export const post = async (req: Request, res: Response) => {
  console.log('request reached')
  try {
    const { url, title, contentText, tags } = req.body;
    // scraping
    const response = await axios.get(url);
    const html = response.data;
    if (!html) throw new Error("Empty HTML response");
    const $ = load(html);
    if (!$) throw new Error("Failed to parse HTML");

    const metadata = {
      title: $("title").text() || "",
      description: $('meta[name="description"]').attr("content") || "",
      ogTitle: $('meta[property="og:title"]').attr("content") || "",
      ogDescription: $('meta[property="og:description"]').attr("content") || "",
      ogImage: $('meta[property="og:image"]').attr("content") || "",
    };

    const formattedData = formatDataForEmbedding(req.body, metadata);

    //  console.log('formattedData', formattedData)

    const temp = await getEmbedding(formattedData.formattedData);
    const data = formatArrayForVector(temp);

    console.log("data", data);

    const result = await prisma.$executeRaw`
    INSERT INTO "Content" (
      "id", 
      "userId", 
      "createdAt", 
      "updatedAt", 
      "isArchived"
    ) 
    VALUES (
      gen_random_uuid(),              -- Automatically generate UUID
      '2e058585-8136-4d30-a385-fd737c2a0476',  -- Replace with a valid userId
      NOW(),                         -- Automatically set current timestamp for createdAt
      NOW(),                         -- Automatically set current timestamp for updatedAt
      false                          -- Set isArchived to false
    );
  `;
  
  console.log('Result:', result);
  

    console.log("result", result);
  } catch (error) {}
};

export const getContent = async () => {};

export const getAllContent = async () => {};
