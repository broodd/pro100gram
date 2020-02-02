import mongoose from 'mongoose';
import { NextFunction } from 'express';

export type IOrder = mongoose.Document & {
  author: string;
  card: string;
  text: string;
  price: number;
  closed: boolean;
};

const orderSchema = new mongoose.Schema({
  author: {
    type: String,
    ref: 'User',
    required: '{PATH} is required!',
  },
  card: {
    type: String,
    ref: 'Card',
    required: '{PATH} is required!',
  },
  text: {
		type: String,
    required: '{PATH} is required!',
  },
  price: {
    type: Number,
    min: 0
  },
	closed: Boolean
}, {
  // toObject: {
  //   virtuals: true
  // },
  // toJSON: {
  //   virtuals: true
  // },
  versionKey: false,
  timestamps: true
});

const autoPopulate = function(next: NextFunction) {
  this.populate('author');
  next();
};

orderSchema.pre('find', autoPopulate);

export const Order = mongoose.model<IOrder>('Order', orderSchema);