import { Router } from 'express'
import { createManyTag, getAllTags } from '../controller/tag.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const tagRoute = Router()

tagRoute.post('/', authMiddleware, createManyTag)
tagRoute.get('/', authMiddleware, getAllTags)

export default tagRoute;