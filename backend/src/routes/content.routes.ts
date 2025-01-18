import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { create, find, findOne } from "../controller/content.controller.js";

const contentRoute = Router();

//@ts-ignore
contentRoute.post("/", authMiddleware, create);
contentRoute.get("/", authMiddleware, find);
contentRoute.get("/all", authMiddleware, findOne);

export default contentRoute;
