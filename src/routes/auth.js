const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.post('/login', authController.signIn);
router.get('/logout', authController.logout);

router.post('/signup', authController.signUp);
router.get('/verify', authController.verify);

module.exports = router;
