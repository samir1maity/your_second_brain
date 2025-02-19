import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { SECRET_USER_PASSWORD } from "../config.js";
import { ResponseHandler } from "../utils/responseBuilder.js";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers["authorization"];

    if (!token) {
      ResponseHandler.error(res, 401, "No authorization token provided");
      return ;
    }
    const cleanToken = token.startsWith("Bearer ") ? token.slice(7) : token;

    try {
      const decode = jwt.verify(cleanToken, SECRET_USER_PASSWORD);

      if (!decode) {
        ResponseHandler.error(res, 403, "Invalid token");
        return
      }
      const decodedToken = decode as jwt.JwtPayload;
      //@ts-ignore
      req.user = {
        id: decodedToken.id,
        email: decodedToken.email,
      };

      next();
    } catch (jwtError) {
      ResponseHandler.error(res, 401, "Invalid or expired token");
      return
    }
  } catch (error) {
    ResponseHandler.error(res, 500, "Authentication error");
    return
  }
};
