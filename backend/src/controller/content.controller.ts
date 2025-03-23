import { NextFunction, Request, Response } from "express";
import {
  post,
  get,
  getOne,
  getWithPagination,
  getContentByTagservice,
} from "../services/content.services.js";
import { ResponseHandler } from "../utils/responseBuilder.js";

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    //@ts-ignore
    const result = await post(req.body, req.user);
    ResponseHandler.success(res, result, 201);
  } catch (error: unknown) {
    console.log("error", error);
    next(error);
  }
}

export async function find(req: Request, res: Response, next: NextFunction) {
  try {
    const { searchQuery, page, limit } = req.query;
    const data = { searchQuery, page, limit };
    //@ts-ignore
    const result = await get(data, req.user);
    ResponseHandler.success(res, result, 200);
  } catch (error: unknown) {
    console.log("error while find content", error);
    next(error);
  }
}

export async function findOne(req: Request, res: Response, next: NextFunction) {
  try {
    //@ts-ignore
    const result = await getOne(req.params.id, req.user);
    ResponseHandler.success(res, result, 200);
  } catch (error: unknown) {
    console.log("error while get one content process", error);
    next(error);
  }
}

export async function fetchWithPagination(
  req: Request,
  res: Response,
  next: NextFunction
) {
  //@ts-ignore
  try {
    //@ts-ignore
    const result = await getWithPagination(req.query, req.user.id);
    ResponseHandler.success(res, result, 200);
  } catch (error: unknown) {
    console.log("error while get content process", error);
    next(error);
  }
}

export async function getContentByTags(req: Request, res: Response, next: NextFunction) {
  try {
    const { tags } = req.body;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    if (!Array.isArray(tags) || tags.length === 0) {
      ResponseHandler.error(res, 400, "Tags array is required");
      return;
    }

    // @ts-ignore
    const result = await getContentByTagservice(req.user, tags, page, limit);
    ResponseHandler.success(res, result, 200);
  } catch (error) {
    console.error("Error in getContentByTags controller:", error);
    next(error);
  }
}
