import mongoose from 'mongoose';
import { NextFunction } from 'express';

export type IPoll = mongoose.Document & {
	card: string;
  text: string;
	votes: [string];
	index: number;
};

const pollSchema = new mongoose.Schema({
  card: {
    type: String,
    ref: 'Card',
    required: '{PATH} is required!',
  },
  text: {
		type: String,
    required: '{PATH} is required!',
	},
	votes: [{
		type: String,
		ref: 'User',
	}],
	index: Number
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  },
  versionKey: false,
  timestamps: true
});

pollSchema.virtual('votesCount', {
  ref: 'User',
  localField: 'votes',
  foreignField: '_id',
  count: true
});

const autoPopulate = function(next: NextFunction) {
  this.populate('votes');
  this.populate('votesCount');
  next();
};

pollSchema.pre('find', autoPopulate);

export const Poll = mongoose.model<IPoll>('Poll', pollSchema);