import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { SECRET_USER_PASSWORD } from "../config.js";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"];
  console.log('token', token)
  const decode = jwt.verify(token as string, SECRET_USER_PASSWORD);

  if (decode) {
    //@ts-ignore
    req.user = {
    //@ts-ignore
      id: decode.id ,
    //@ts-ignore
      email: decode.email 
    };
    next()
  } else {
    res.status(403).json({
      msg: "you are not logged in",
      successful: false,
    });
  }
};
