import { Response, Request } from "express";
import { createMany, getAll } from "../services/tag.services.js";
import { ResponseHandler } from "../utils/responseBuilder.js";

export async function createManyTag(req: Request, res: Response) {
  try {
    //@ts-ignore
    const tag = await createMany(req.body, req.user);
    ResponseHandler.success(res, "Tag created successfully", 201);
  } catch (error: unknown) {
    console.log("error", error);
  }
}

export async function getAllTags(req: Request, res: Response) {
  try {
      //@ts-ignore
    const allTags = await getAll(req.user)
    ResponseHandler.success(res, allTags, 200);
  } catch (error) {
    console.log("error", error);
  }
}
