import { Request, Response, NextFunction } from 'express';
import { User, IUser } from '../models/User';
import { Card, ICard } from '../models/Card';
import { Order, IOrder } from '../models/Order';
import { isEmpty, isLength } from 'validator';
import { TypeOfCard } from '../util/secrets';
import { AppError } from '../util/error-handler';
import logger from '../util/logger';
import IO from '../socket';


/**
 * POST /cards/:id/order
 * Create order.
 */
export const postOrder = async (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user;
  const { text } = req.body;
  const { id } = req.params;
  const errors = [];

  const card: ICard = await Card.findById(id);

  if (!card || card.type !== 'order') {
    errors.push('Card not found');
  }
  if (card.closed) {
    errors.push('Card is closed');
  }
  if (isEmpty(text)) {
    errors.push('Text is not valid');
  }

  if (!!errors.length) {
    throw new AppError(errors[0], 400);
  }

  let order: IOrder = await Order.create({
    author: user._id,
    card: card._id,
    text,
    price: 0,
    closed: false
  });

  order = await order.populate('author').execPopulate();

  await Card.updateOne({
    _id: id
  }, {
    $push: {
      orders: order._id
    }
  });

  IO.getIO().emit('newOrder', {
    _id: card._id,
    order
  });

  return res.json({
    data: order
  });
};


/**
 * PUT /cards/:id/order
 * Update order.
 */
export const putOrder = async (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user;
  const { text, price, closed } = req.body;
  const { id } = req.params;

  let order: IOrder = await Order.findById(id);
  const card: ICard = await Card.findById(order.card);

  if (!order) {
    throw new AppError('Order not found', 404);
  }
  if (!card) {
    throw new AppError('Card not found', 404);
  }
  if (card.closed) {
    throw new AppError('Card is closed', 400);
  }
  if (order.closed) {
    throw new AppError('Order is closed', 400);
  }
	if (order.author.toString() != user._id && card.author._id.toString() != user._id && user.role !== 'ADMIN') {
    throw new AppError('Don`t have permissions', 403);
  }

  /*
    Who & What can change:

    text -> all if not closed
    price, closed -> card.author OR ADMIN && if not closed
  */

  if (!order.closed) {
    if (text) {
      order.text = text;
    }
  }

	if (card.author._id.toString() == user._id.toString() || user.role === 'ADMIN') {
    if (!order.closed) {
      if (!!price && +price > 0) {
        order.price = price;
      }
    }

    if (!!closed) {
      order.closed = true;
    }
  }

  await order.save();

  order = await order.populate('author').execPopulate();

  IO.getIO().emit('updateOrder', {
    _id: card._id,
    order
  });

  return res.json({
    data: order
  });
};


/**
 * DELETE /cards/order/:id
 * Delete order.
 */
export const deleteOrder =  async (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user;
  const { id } = req.params;

  const order: IOrder = await Order.findById(id);

  if (!order) {
    throw new AppError('Order not found', 404);
  }
  if (order.author != user._id && user.role != 'ADMIN') {
    throw new AppError('Dont have permission', 403);
  }

  const isDeleted = await Card.updateOne({
    _id: order.card,
    closed: false
  },
  {
    $pull: {
      orders: order._id
    } as ICard
  });

  if (isDeleted && isDeleted.n) {
    await order.remove();
    order.closed = true;

    IO.getIO().emit('updateOrder', {
      _id: order.card,
      order
    });
  } else {
    throw new AppError('Card is closed', 400);
  }


  return res.json({
    data: order
  });
};