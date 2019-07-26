import express from 'express';

import keyWordController from '../../controllers/api/keyWord';

const router = express.Router();

router.put('/keyWords',keyWordController.addKeyWord);

router.get('/keyWords',keyWordController.getKeyWords);

router.delete('/keyWords',keyWordController.deleteKeyWord);

router.post('/keyWords/:id',keyWordController.updateKeyWord);

export default router;