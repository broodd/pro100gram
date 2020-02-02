import { Request, Response, NextFunction } from 'express';
import { Poll, IPoll } from '../models/Poll';
import { Card, ICard } from '../models/Card';
import { AppError } from '../util/error-handler';
import IO from '../socket';

/**
 * POST /cards/poll/:id
 * To vote.
 */
export const postPoll = async (req: Request, res: Response, next: NextFunction) => {
	const user = res.locals.user;
	const { id } = req.params;

	if (!id) {
    throw new AppError('ID is not valid', 403);
	}

	const existingVote: IPoll = await Poll.findOneAndUpdate({
		votes: user._id
	}, {
		$pull: {
			votes: user._id
		}
	});

	const vote: IPoll = await Poll.findOneAndUpdate({
		_id: id
	}, {
		$addToSet: {
			votes: user._id
		}
  });

  if (!vote) {
    throw new AppError('Vote not found', 404);
	}

	const card: ICard = await Card.findById(vote.card);

	const userInVote = !!card.anonime ? user._id : user;

	IO.getIO().emit('toVote', {
		_id: vote.card,
		existingVote: existingVote && existingVote._id,
		existingIndex: existingVote && existingVote.index,
    vote: userInVote,
    voteIndex: vote.index
  });

  return res.json({
    existingVote: existingVote && existingVote._id,
    existingIndex: existingVote && existingVote.index,
    vote: userInVote,
    voteIndex: vote.index
  });
};