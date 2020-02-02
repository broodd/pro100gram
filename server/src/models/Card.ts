import mongoose from 'mongoose';
import { NextFunction } from 'express';
import { IOrder } from './Order';
import { IPoll } from './Poll';
import { IUser } from './User';
import { TypeOfCard } from '../util/secrets';

// enum ETypeOfCard {
// 	// ...ETypeOfCard
// 	info, poll, order
// }

export type ICard = mongoose.Document & {
  title: string;
  type: string;
  author: IUser;
  images: string[];
  closed: boolean;
  slackChannels: string[];

  orders: IOrder[] | string[];
  delivery: number;

  polls: IPoll[] | string[];
  anonime: boolean;

  pollSelected: Number;
};

const cardSchema = new mongoose.Schema({
  title: {
    type: String,
		required: '{PATH} is required!'
  },
  type: {
		type: String,
		enum: TypeOfCard,
    required: '{PATH} is required!',
	},
  author: {
    type: String,
    ref: 'User',
    required: '{PATH} is required!',
	},
	images: {
		type: [String],
		// get: (v:string) => `${root}${v}`
  },
	closed: {
    type: Boolean,
    default: false
  },
  slackChannels: {
    type: [String],
    select: false
  },

	// if type `order`
	orders: [{
    type: String,
    ref: 'Order'
  }],
	delivery: {
		type: Number,
		min: 0
	},

	// if type `poll`
	polls: [{
    type: String,
    ref: 'Poll'
	}],
	pollSelected: Number,
  anonime: Boolean
}, {
  // toObject: {
	// 	virtuals: true
  // },
  // toJSON: {
	// 	virtuals: true
  // },
  versionKey: false,
  timestamps: true
});

const autoPopulate = function (next: NextFunction) {
  this.populate('author');
	this.populate('orders');
	// console.log('--- this.getQuery().anonime', this.getQuery());
	// const anonimeSelect = !!this.getQuery().anonime ? '-votes' : '';
	// console.log('--- anonimeSelect, this.anonime', this['anonime']);
	// this.populate({
	// 	path: 'polls',
	// 	select: anonimeSelect
	// })
  this.populate('polls');
  next();
};

cardSchema.pre('find', autoPopulate);
cardSchema.pre('findOne', autoPopulate);


// cardSchema.query.checkAnonime = function() {
//   if (user.isAdmin) {
//     return this;
//   }
//   return this.find({ ownerId: user._id });
// };

export const Card = mongoose.model<ICard>('Card', cardSchema);