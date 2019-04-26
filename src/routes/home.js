const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home');

router.get('/', homeController.home);

router.get('/images/:name', homeController.getImage);

module.exports = router;
