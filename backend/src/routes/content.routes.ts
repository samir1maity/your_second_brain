import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { transpileModule } from "typescript";
import { getAllContent, getContent, post } from "../services/content.services";

const contentRoute = Router();

contentRoute.post('/', post)
contentRoute.get('/', getContent)
contentRoute.get('/all', getAllContent)

export default contentRoute;
