import { prisma } from "../db.js";

export async function create(data: any, user: any) {
  console.log("data", data);
  console.log("user", user);
  try {
    const { name, description } = data;
    const tag = await prisma.tag.create({
      data: {
        name,
        userId: user.id,
        description,
        isSystem: true,
      },
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
