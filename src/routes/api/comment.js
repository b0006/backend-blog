import express from 'express';

import commentController from '../../controllers/api/comment';

const router = express.Router();

router.get('/comment', commentController.getList);

router.put('/comment', commentController.addComment);

export default router;
