import express from 'express';

import authController from '../controllers/auth';

const router = express.Router();

router.post('/login', authController.signIn);
router.get('/logout', authController.logout);

router.post('/signup', authController.signUp);
router.get('/verify', authController.verify);

export default router;
