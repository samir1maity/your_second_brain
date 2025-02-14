import { NextFunction, Request, Response } from "express";
import { userLogin, userSignup } from "../services/user.services.js";
import { ResponseHandler } from "../utils/responseBuilder.js";
import { userAuth } from "../types/user.js";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = userAuth.parse(req.body);
    const result = await userSignup(data);
    ResponseHandler.success(res, result, 201);
  } catch (error) {
    console.log("error while signup process", error);
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = userAuth.parse(req.body);
    const result = await userLogin(data);
    ResponseHandler.success(res, result, 200);
  } catch (error) {
    console.log("error while login process", error);
    next(error);
  }
};
