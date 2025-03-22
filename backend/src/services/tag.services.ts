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



