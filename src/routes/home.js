import express from 'express';

import homeController from '../controllers/home';

const router = express.Router();

router.get('/', homeController.home);

router.get('/images/:name', homeController.getImage);

export default router;
