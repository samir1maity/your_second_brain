import { prisma } from "../db.js";
import { AppError } from "../utils/errors.js";

export async function createMany(data: any[], user: any) {
  try {
    if (!user || !user.id) {
      throw new AppError(400, "User ID is required");
    }

    const tagNames = data.map(tag => tag.name.toLowerCase());
    console.log('tagNames', tagNames)
    const duplicateNames = tagNames.filter((name, index) => tagNames.indexOf(name) !== index);
    console.log('duplicateNames', duplicateNames)
    if (duplicateNames.length > 0) {
      throw new AppError(409, "Duplicate tag names found in request", [
        { field: 'name', message: `Duplicate tags: ${duplicateNames.join(', ')}` }
      ]);
    }

    const existingTags = await prisma.tag.findMany({
      where: {
        userId: user.id,
        name: {
          in: tagNames
        }
      },
      select: {
        name: true
      }
    });

    if (existingTags.length > 0) {
      const existingNames = existingTags.map(tag => tag.name);
      throw new AppError(409, "Some tags already exist for this user", [
        { field: 'name', message: `Existing tags: ${existingNames.join(', ')}` }
      ]);
    }

    const tagsWithUserId = data.map(tag => ({
      ...tag,
      userId: user.id
    }));

    const tag = await prisma.tag.createMany({
      data: tagsWithUserId
    });

    return tag;
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



