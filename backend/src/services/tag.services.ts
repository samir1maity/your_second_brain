import { prisma } from "../db.js";
import { AppError } from "../utils/errors.js";

export async function createMany(data: any[], user: any) {
  try {
    if (!user || !user.id) {
      throw new AppError(400, "User ID is required");
    }
    const tagsWithUserId = data.map(tag => ({
      ...tag,
      userId: user.id
    }));

    try {
      const tag = await prisma.tag.createMany({
        data: tagsWithUserId
      });
      return tag;
    } catch (error) {
      throw error;
    }
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(500, "Tags creation failed");
  }
}

export async function getAll(user: any) {
  try {
    const allTags = await prisma.tag.findMany({
      where: {
        userId: user.id,
      },
    });
    return allTags;
  } catch (error: unknown) {
    console.log("error", error);
    throw error;
  }
}

export async function findMany(ids:string[], user: any){
  try {
    const tags = await prisma.tag.findMany({
      where : {
        id: {
          in: ids
        }
      }
    })
    return tags
  } catch (error) {
    console.log('error while get find many tags --->', error)
  }
}

export async function handleTags(tags: string[], user: any) {
  try {
    if (!user || !user.id) {
      throw new AppError(400, "User ID is required");
    }

    // Find existing tags for this user
    const existingTags = await prisma.tag.findMany({
      where: {
        userId: user.id
      }
    });

    // Get names of existing tags in lowercase for case-insensitive comparison
    const existingTagNames = existingTags.map(tag => tag.name.toLowerCase());

    // Find which tags are new and need to be created (case-insensitive)
    const newTagNames = tags.filter(tag => !existingTagNames.includes(tag.toLowerCase()));

    // Create any new tags that don't exist yet
    if (newTagNames.length > 0) {
      const newTagsData = newTagNames.map(name => ({
        name,
        userId: user.id
      }));

      await prisma.tag.createMany({
        data: newTagsData,
        skipDuplicates: true
      });
    }

    // Now get all tags (both existing and newly created)
    const allTags = await prisma.tag.findMany({
      where: {
        name: {
          in: tags
        },
        userId: user.id
      }
    });

    return allTags;
  } catch (error) {
    console.error("Error handling tags:", error);
    throw error;
  }
}



