import express from 'express';
import { saveArticle, favoriteArticle, unfavoriteArticle, getArticleByCompositeKey } from '../controllers/articleController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const articleRoutes = express.Router();

articleRoutes.post('/articles', saveArticle);
articleRoutes.get('/:compositeKey', authMiddleware, getArticleByCompositeKey);



articleRoutes.post('/favorite/:compositeKey', authMiddleware, favoriteArticle);

articleRoutes.delete('/favorite/:compositeKey', authMiddleware, unfavoriteArticle);

export default articleRoutes;
