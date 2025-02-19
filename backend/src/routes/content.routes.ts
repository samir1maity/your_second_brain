import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { create, fetchWithPagination, find, findOne } from "../controller/content.controller.js";

const contentRoute = Router();


contentRoute.get("/all", authMiddleware, fetchWithPagination);
contentRoute.post("/", authMiddleware, create);
contentRoute.get("/", authMiddleware, find);
contentRoute.get("/:id", authMiddleware, findOne);

export default contentRoute;
