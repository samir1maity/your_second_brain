import { NextFunction, Request, Response } from "express";
import { post, get, getOne, getWithPagination } from "../services/content.services.js";
import { ResponseHandler } from "../utils/responseBuilder.js";

export async function create(req: Request, res: Response) {
  try {
    //@ts-ignore
    const create = await post(req.body, req.user);
    console.log('create', create)
    res.status(201).json({
        is_error: false,
        data: create,
        message: "content uploaded successfully",
    });
  } catch (error:unknown) {
        console.log('error', error)
  }
}

export async function find(req: Request, res: Response) {
 try {
    const {searchQuery, page, limit} = req.query
    const data = {searchQuery, page, limit}
    //@ts-ignore
    const create = await get(data, req.user);
    res.status(201).json({
        is_error: false,
        data: create,
        message: "contents fetched successfully",
    });
    } catch (error:unknown) {
        console.log('error', error)
    }
}

export async function findOne(req: Request, res: Response, next: NextFunction) {
    try {
        //@ts-ignore
        const result = await getOne(req.params.id , req.userId);
        ResponseHandler.success(res, result, 200);
    } catch (error:unknown) {
        console.log("error while get one content process", error);
        next(error);
    }
}

export async function fetchWithPagination(req: Request, res: Response, next: NextFunction) {
    //@ts-ignore
    console.log('code reached', req.user.id)
    try {
        //@ts-ignore
        const result = await getWithPagination(req.query , req.user.id);
        ResponseHandler.success(res, result, 200);
    } catch (error:unknown) {
        console.log("error while get content process", error);
        next(error);
    }
}
