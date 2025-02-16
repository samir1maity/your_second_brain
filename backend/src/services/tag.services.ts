import { prisma } from "../db.js";

export async function createMany(data: any [], user: any) {
  try {
    const tag = await prisma.tag.createMany({
      data
    });
    return tag;
  } catch (error: unknown) {
    //@ts-ignore
    console.log("error", error.message);
    throw error;
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



