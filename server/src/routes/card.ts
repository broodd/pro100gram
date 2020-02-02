import { Router } from 'express';
import asyncWrapper from '../util/error-handler';
const card = Router();

import authGuard from '../middlewares/authGuard';
import checkAdmin from '../middlewares/checkAdmin';

/**
 * Controllers (route handlers)
 */
import * as cardController from '../controllers/card';

card.get('/:id', authGuard, asyncWrapper(cardController.getCard));
card.get('/', authGuard, asyncWrapper(cardController.getCards));

card.post('/', authGuard, asyncWrapper(cardController.postCard));

card.put('/:id', authGuard, asyncWrapper(cardController.putCard));

card.delete('/:id', authGuard, asyncWrapper(cardController.deleteCard));

export default card;