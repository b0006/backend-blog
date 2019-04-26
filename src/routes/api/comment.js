const express = require('express');
const router = express.Router();
const commentController = require('../../controllers/api/comment');

router.get('/comment', commentController.getList);

router.put('/comment', commentController.addComment);

module.exports = router;
