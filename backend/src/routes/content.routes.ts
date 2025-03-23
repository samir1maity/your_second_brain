import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { create, fetchWithPagination, find, findOne, getContentByTags } from "../controller/content.controller.js";

const contentRoute = Router();


contentRoute.get("/all", authMiddleware, fetchWithPagination);
contentRoute.post("/", authMiddleware, create);
contentRoute.get("/", authMiddleware, find);
contentRoute.get("/:id", authMiddleware, findOne);
contentRoute.post('/filter-by-tags', authMiddleware, getContentByTags);

export default contentRoute;
