const express = require('express');
const router = express.Router();
const articleController = require('../../controllers/api/article');

router.get('/articles', articleController.getList);

router.post('/articles', articleController.getSortList);

router.get('/articles/:value', articleController.getArticleByValue);

router.put('/articles', articleController.addArticle);

router.delete('/articles', articleController.deleteArticle);

router.post('/images', articleController.saveImage);

router.post('/articles/:id', articleController.updateArticle);

module.exports = router;

