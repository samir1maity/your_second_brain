import { Router } from 'express'
import { createTag, getAllTags } from '../controller/tag.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const tagRoute = Router()

tagRoute.post('/', authMiddleware, createTag)
tagRoute.get('/', authMiddleware, getAllTags)

export default tagRoute;