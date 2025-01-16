import axios from "axios";
import { Request, Response } from "express";
import { load } from "cheerio";
import { formatDataForEmbedding } from "../utils/formatContentForEmbedding";

const userData = {
  link: "https://example.com/artificial-intelligence",
  title: "My AI Resource",
  tags: ["AI", "machine-learning", "tech"],
};

const scrapedData = {
  title: "Understanding AI - Complete Guide",
  description: "Comprehensive guide to artificial intelligence...",
  ogTitle: "AI Guide 2024",
  ogDescription: "Learn everything about AI...",
  ogImage: "https://example.com/ai-image.jpg",
};

export const post = async (req: Request, res: Response) => {
  try {
    const { url, title, summary, tags } = req.body;
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

   const formattedData = await formatDataForEmbedding(req.body, metadata);
   console.log('formattedData', formattedData)
  } catch (error) {}
};

export const getContent = async () => {};

export const getAllContent = async () => {};
