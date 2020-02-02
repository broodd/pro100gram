import { Router } from 'express';
import asyncWrapper from '../util/error-handler';
const user = Router();

import authGuard from '../middlewares/authGuard';
import checkAdmin from '../middlewares/checkAdmin';

/**
 * Controllers (route handlers)
 */
import * as imageController from '../controllers/image';

user.post('/upload', authGuard, asyncWrapper(imageController.uploadImages));

export default user;