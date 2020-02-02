import { Router } from 'express';
import asyncWrapper from '../util/error-handler';
const order = Router();

import authGuard from '../middlewares/authGuard';
import checkAdmin from '../middlewares/checkAdmin';

/**
 * Controllers (route handlers)
 */
import * as orderController from '../controllers/order';

order.post('/cards/:id/order', authGuard, asyncWrapper(orderController.postOrder));

order.put('/cards/order/:id', authGuard, asyncWrapper(orderController.putOrder));

order.delete('/cards/order/:id', authGuard, asyncWrapper(orderController.deleteOrder));

export default order;