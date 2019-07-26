import express from 'express';

import articleController from '../../controllers/api/article';

const router = express.Router();

router.get('/articles', articleController.getList);

router.post('/articles', articleController.getSortList);

router.get('/articles/:value', articleController.getArticleByValue);

router.put('/articles', articleController.addArticle);

router.delete('/articles', articleController.deleteArticle);

router.post('/images', articleController.saveImage);

router.post('/articles/:id', articleController.updateArticle);

export default router;
