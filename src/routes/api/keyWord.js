const express = require('express');
const router = express.Router();
const keyWordController = require('../../controllers/api/keyWord');

router.put('/keyWords',keyWordController.addKeyWord);

router.get('/keyWords',keyWordController.getKeyWords);

router.delete('/keyWords',keyWordController.deleteKeyWord);

router.post('/keyWords/:id',keyWordController.updateKeyWord);

module.exports = router;