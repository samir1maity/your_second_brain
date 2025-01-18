import { Request, Response } from "express";
import { post, get, getOne } from "../services/content.services.js";

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

export async function findOne(req: Request, res: Response) {
    try {
    //@ts-ignore
    const create = await getOne(req.params.id , req.userId);
    res.status(201).json({
        is_error: false,
        data: create,
        message: "content fetched successfully",
    });
    } catch (error:unknown) {
        console.log('error', error)
    }
}
