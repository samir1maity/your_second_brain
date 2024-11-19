import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { SECRET_USER_PASSWORD } from "../config";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"];
  const decode = jwt.verify(token as string, SECRET_USER_PASSWORD);

  if (decode) {
    //@ts-ignore
    req.userId = decode.id;
    next()
  } else {
    res.status(403).json({
      msg: "you are not logged in",
      successful: false,
    });
  }
};
