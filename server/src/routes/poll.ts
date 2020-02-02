import { Router } from 'express';
import asyncWrapper from '../util/error-handler';
const poll = Router();

import authGuard from '../middlewares/authGuard';
import checkAdmin from '../middlewares/checkAdmin';

/**
 * Controllers (route handlers)
 */
import * as pollController from '../controllers/poll';

poll.post('/cards/poll/:id', authGuard, asyncWrapper(pollController.postPoll));

export default poll;