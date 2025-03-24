import axios from "axios";
import { load } from "cheerio";
import { formatDataForEmbedding } from "../utils/formatContentForEmbedding.js";
import { prisma } from "../db.js";
import { getEmbedding } from "../utils/generateEmbeddings.js";
import { formatArrayAsVectorString } from "../utils/formatArrayAsVectorString.js";
import { v4 as uuidv4 } from "uuid";
import { handleTags } from "./tag.services.js";
import { AppError } from "../utils/errors.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function analyzeSearchResultsWithGemini(searchQuery: string, results: any[]) {
  try {
    if (!results || results.length === 0) return [];
    
    const formattedResults = results.map((item, index) => {
      return `Result ${index + 1}:
        Title: ${item.title}
        Content: ${item.contentText}
        Similarity Score: ${item.similarity}
        Context: ${item.metadata.description}
        Description: ${item.metadata.ogDescription}
        metaData Title: ${item.metadata.title}`;
    }).join('\n\n');

    const prompt = `
        I have a search query: "${searchQuery}"

        And these are the search results with their vector similarity scores:
        ${formattedResults}

        Please analyze these results and determine which ones are most relevant to the search query.
        Return a JSON array of indices (starting from 0) of the most relevant results, ordered by relevance.
        Only include results that are truly relevant to the query.
        Format your response as a valid JSON array like [0, 3, 1] with no other text.`;

    // Get response from Gemini
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Clean the response text to extract just the JSON array
    const cleanedText = text.replace(/```json|```|\[|\]/g, '').trim();
    const jsonArrayText = `[${cleanedText}]`;
    console.log('jsonArrayText -->', jsonArrayText)
    
    // Parse the JSON response
    try {
      const relevantIndices = JSON.parse(jsonArrayText);
      if (Array.isArray(relevantIndices)) {
        // Return the filtered and reordered results
        return relevantIndices.map(index => results[index]).filter(Boolean);
      }
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      
      // Alternative parsing approach
      try {
        // Try to extract numbers directly using regex
        const numbersArray = text.match(/\d+/g);
        if (numbersArray && numbersArray.length > 0) {
          const indices = numbersArray.map(Number);
          return indices.map(index => results[index]).filter(Boolean);
        }
      } catch (regexError) {
        console.error("Error with regex parsing:", regexError);
      }
    }
    
    return results;
  } catch (error) {
    console.error("Error analyzing results with Gemini:", error);
    // Fallback to original results
    return results;
  }
}

export const post = async (data: any, user: any) => {
  try {
    const { url, title, contentText, tags } = data;
    let metadata = {
      title: "",
      description: "",
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
    };
    
    // Try to fetch and parse metadata from URL
    try {
      const response = await axios.get(url, {
        timeout: 10000, // 10 second timeout
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      if (response && response.data) {
        const html = response.data;
        const $ = load(html);
        
        metadata = {
          title: $("title").text() || "",
          description: $('meta[name="description"]').attr("content") || "",
          ogTitle: $('meta[property="og:title"]').attr("content") || "",
          ogDescription: $('meta[property="og:description"]').attr("content") || "",
          ogImage: $('meta[property="og:image"]').attr("content") || "",
        };
        
        console.log("Successfully scraped metadata:", metadata);
      }
    } catch (scrapingError) {
      //@ts-ignore
      console.error("Error scraping URL:", scrapingError.message);
    }

    const userTitle = title || "Untitled";
    const userContent = contentText || "No content provided";
    
    if (!metadata.title && !metadata.description && !metadata.ogTitle && !metadata.ogDescription) {
      metadata = {
        ...metadata,
        title: userTitle,
        description: userContent
      };
    }

    const { formattedData } = formatDataForEmbedding(
      { 
        link: url, 
        title: userTitle, 
        contentText: userContent, 
        tags 
      }, 
      metadata
    );

    let embedding;
    try {
      embedding = await getEmbedding(formattedData);
    } catch (embeddingError) {
      console.error("Error generating embedding:", embeddingError);
      const fallbackData = `${userTitle} | ${userContent}`;
      embedding = await getEmbedding(fallbackData);
    }
    
    const arrayLiteral = formatArrayAsVectorString(embedding);
    const randomUuid = uuidv4();

    if (!randomUuid) {
      throw new Error("Failed to generate UUID");
    }

    const result = await prisma.$executeRaw`
      INSERT INTO "Content" (
        "id",
        "userId",
        "title",
        "url",
        "contentText",
        "metadata",
        "createdAt",
        "updatedAt",
        "isArchived",
        "summary",
        "embedding"
      )
      VALUES (
        ${randomUuid},
        ${user.id},
        ${userTitle},
        ${url},
        ${userContent},
        ${metadata},
        NOW(),
        NOW(),
        false,
        ${formattedData},
        ${arrayLiteral}::vector
      );
    `;

    if (result && tags && tags.length > 0) {
      const allTags = await handleTags(tags, user);
      
      if (allTags.length > 0) {
        const contentTagsData = allTags.map((tag) => ({
          contentId: randomUuid,
          tagId: tag.id,
          isAuto: false,
        }));
        
        await prisma.contentTag.createMany({
          data: contentTagsData
        });
      }
    }
    
    return { success: true, contentId: randomUuid };
  } catch (error) {
    console.error("Error in post content service:", error);
    throw error;
  }
};

export const get = async (data: any, user: any) => {
  try {
    const { searchQuery } = data;

    // Get vector embedding for the search query
    const embedding = await getEmbedding(searchQuery);
    const arrayLiteral = formatArrayAsVectorString(embedding);
    
    // Get initial results based on vector similarity
    const initialResults = await prisma.$queryRaw`
      SELECT 
        c."id", 
        c."summary",
        c."contentText",
        c."createdAt",
        c."isArchived",
        c."metadata",
        c."title",
        c."url",
        c."summary", 
        1 - (c."embedding" <=> ${arrayLiteral}::vector(384)) AS similarity
      FROM "Content" c
      WHERE c."embedding" IS NOT NULL 
      AND c."userId" = ${user?.id} 
      AND 1 - (c."embedding" <=> ${arrayLiteral}::vector(384)) > 0.3
      ORDER BY similarity DESC
      LIMIT 10
    `;
    
    // Process results with Gemini
    const enhancedResults = await analyzeSearchResultsWithGemini(
      searchQuery, 
      Array.isArray(initialResults) ? initialResults : []
    );
    
    // Fetch tags for each content item
    const resultsWithTags = await Promise.all(
      enhancedResults.map(async (content) => {
        const contentTags = await prisma.contentTag.findMany({
          where: { contentId: content.id },
          include: { tag: true }
        });
        
        // Extract just the tag names
        const tags = contentTags.map(ct => ct.tag.name);
        return {
          ...content,
          tags
        };
      })
    );
    
    return resultsWithTags;
  } catch (error) {
    console.error("Error in get content service:", error);
    throw error;
  }
};

export const getWithPagination = async (
  query: { page: string; limit: string },
  userId: string
) => {
  try {
    const { page = 1, limit = 10 } = query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    // Fetch content with tags included
    const posts = await prisma.content.findMany({
      where: { userId },
      include: {
        tags: {
          include: {
            tag: true
          }
        }
      },
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });

    // Format the posts to include tags as a simple array of names
    const formattedPosts = posts.map(post => ({
      ...post,
      tags: post.tags.map(contentTag => contentTag.tag.name)
    }));

    // Get total count for pagination
    const totalPosts = await prisma.content.count({ where: { userId } });

    return {
      posts: formattedPosts,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(totalPosts / Number(limit)),
    };
  } catch (error) {
    console.log('error while get content process -->', error);
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
        url: true,
        title: true,
        contentText: true,
        createdAt: true,
        updatedAt: true,
        isArchived: true,
        tags: true,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export async function getContentByTagservice(user: any, tagNames: string[], page: number = 1, limit: number = 10) {
  try {
    if (!user || !user.id) {
      throw new AppError(400, "User ID is required");
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Get content with any of the specified tags (OR condition)
    const content = await prisma.content.findMany({
      where: {
        userId: user.id,
        tags: {
          some: {
            tag: {
              name: {
                in: tagNames
              }
            }
          }
        }
      },
      include: {
        tags: {
          include: {
            tag: true
          }
        },
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    });

    // Count total matching records for pagination info
    const totalCount = await prisma.content.count({
      where: {
        userId: user.id,
        tags: {
          some: {
            tag: {
              name: {
                in: tagNames
              }
            }
          }
        }
      }
    });

    // Format the response
    const formattedContent = content.map(item => ({
      ...item,
      tags: item.tags.map(t => t.tag.name)
    }));

    return {
      data: formattedContent,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit)
      }
    };
  } catch (error) {
    console.error("Error fetching content by tags:", error);
    throw error;
  }
}
