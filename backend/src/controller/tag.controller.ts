import { Response, Request } from "express";
import { createMany, getAll } from "../services/tag.services.js";

export async function createManyTag(req: Request, res: Response) {
  try {
    //@ts-ignore
    const tag = await createMany(req.body, req.user);
    res.status(201).json({
      is_error: false,
      message: "tag created successfully",
      data: tag,
    });
  } catch (error: unknown) {
    console.log("error", error);
  }
}

export async function getAllTags(req: Request, res: Response) {
    try {
        //@ts-ignore
        const allTags = await getAll(req.user)
        res.status(201).json({
            is_error: false,
            message: "tag fetched successfully",
            data: allTags,
          });
    } catch (error) {
        console.log('error', error)
    }
}
