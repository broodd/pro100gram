import { Request, Response, NextFunction } from 'express';
import { User, IUser } from '../models/User';
import { Card, ICard } from '../models/Card';
import { Order, IOrder } from '../models/Order';
import { Poll, IPoll } from '../models/Poll';
import { isEmpty, isLength } from 'validator';
import { TypeOfCard, SLACK_TOKEN, ServerURL, ClientURL } from '../util/secrets';
import { AppError } from '../util/error-handler';
import logger from '../util/logger';
import { WebClient } from '@slack/web-api';
import IO from '../socket';
import { Types } from 'mongoose';


/**
 * GET /card/:id
 * Get card.
 */
export const getCard = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const card: ICard = await Card.findById(id);

  if (!card) {
    throw new AppError('Card not found', 404);
  }

  return res.json({
    data: card
  });
};


/**
 * GET /cards
 * Get cards.
 */
export const getCards = async (req: Request, res: Response, next: NextFunction) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const user = res.locals.user;

  const cards: ICard[] = await Card.find()
    .sort({
      createdAt: -1
    })
    .skip(+skip)
		.limit(+limit);

	cards.forEach((card: ICard) => {
    if (card.type != 'poll') return card;

    const pollSelected = card.polls.findIndex((poll: any) => {
      const index = poll.votes.findIndex((vote: any) => {
				return vote._id.toString() == user._id.toString();
			});

			return index == -1 ? 0 : 1;
		});


    card.pollSelected = pollSelected;

    if (card.anonime) {
      card.polls.forEach((poll: any) => {
        const anonimeVotes = poll.votes.map((vote: any) => {
          return vote._id;
        });
        poll.votes = [];
        poll.votes = anonimeVotes;
      });
    }
  });

  return res.json({
		data: cards
  });
};


/**
 * POST /cards
 * Create cards.
 */
export const postCard = async (req: Request, res: Response, next: NextFunction) => {
	const user = res.locals.user;
	const { title, type, slackChannels } = req.body;
	const errors = [];

	if (isEmpty(title)) {
		errors.push('Title is not valid');
	}
	if (isEmpty(type) || !TypeOfCard.includes(type)) {
    errors.push('Type is not valid');
  }

	if (!!errors.length) {
		throw new AppError(errors[0], 400);
  }

  let images: any[] = req.body.images || [];
  const files = req.files as any;
  if (files && files.length) {
    const filesImages = files.map(((file: any) => {
      return file.filename;
		}));
		images = images.concat(filesImages);
  }

	const card: ICard = new Card({
		title,
    type,
		author: Types.ObjectId(user._id),
    images
	});

	if (type === 'order') {
		const { delivery = 0 } = req.body;
		card.delivery = delivery;
	}

	if (type === 'poll') {
    const { anonime, polls } = req.body;

    card.anonime = !!anonime;

    if (!polls || !polls.length) {
      throw new AppError('Polls not valid', 400);
		}

		const pollsArray: IPoll[] = polls.map((text: string, index: number) => {
      return {
        card: card._id,
        text,
				votes: [] as any,
				index
      };
		});

		const DBPolls: IPoll[] = await Poll.create(pollsArray);
		const CardPolls: string[] = DBPolls.map((poll: IPoll) => {
			return poll._id;
		});

		card.polls = CardPolls;
	}

  await card.save();

  const bot = new WebClient(SLACK_TOKEN);

  const text = [
    `<!here> ${card.title}`,
    card.type == 'order' ? 'Встигни замовити' : card.type == 'poll' ? 'Проголосуй' : '',
    `Link: ${ClientURL}card/${card._id}`
  ];

  if (slackChannels && slackChannels.length) {
		const messages: any[] = [];

		const attachments = card.images.map((img: string) => {
			return {
				title: '',
				title_link: `${ClientURL}card/${card._id}`,
				text: '',
				image_url: `${ServerURL}static/images/${img}`,
				color: '#ffc107'
			};
		});

    slackChannels.forEach((channel: any) => {
      const message = bot.chat.postMessage({
        text: ``,
        username: 'GramBot',
        icon_url: 'https://image.flaticon.com/icons/svg/1046/1046784.svg',
        channel: channel.id,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: text.join('\n')
            }
          }
				],
				attachments
      });

      messages.push(message);
    });

    await Promise.all(messages);
  }

  return res.json({
    data: card
  });
};


/**
 * PUT /cards/:id/order
 * Update order.
 */
export const putCard = async (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user;
  const { title, closed, delivery, anonime, images } = req.body;
  const { id } = req.params;

  const card: ICard = await Card.findById(id);

  if (!card) {
    throw new AppError('Card not found', 404);
  }
  if (card.closed) {
    throw new AppError('Card is closed', 400);
	}
	if (card.author._id.toString() != user._id.toString() && user.role !== 'ADMIN') {
    throw new AppError('Don`t have permissions', 403);
  }

	// const files = req.files as any;
  // if (files && files.length) {
  //   const filesImages = files.map((file: any) => {
  //     return file.filename;
  //   });

  //   card.images = card.images.concat(filesImages);
  // }

  if (title) {
    card.title = title;
  }
	if (images && images.length) {
    card.images = images;
  } else if (images === false) {
    card.images = [];
  }
  if (card.type === 'order') {
    if (delivery) {
      card.delivery = delivery;
    }
  }
  if (card.type === 'poll') {
    if (anonime) {
      card.anonime = anonime;
    }
  }
  if (!!closed) {
    card.closed = true;
  }

  IO.getIO().emit('updateCard', {
    _id: card._id,
    title: card.title,
    closed: card.closed,
    delivery: card.delivery,
    images: card.images
  });

  await card.save();

  return res.json({
    data: card
  });
};


/**
 * DELETE /cards/:id
 * Delete card.
 */
export const deleteCard = async (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user;
  const { id } = req.params;

  const card: ICard = await Card.findById(id);

  if (!card) {
    throw new AppError('Card not found', 404);
	}
	if (card.author._id.toString() != user._id.toString()) {
    throw new AppError('Dont have permission', 403);
  }

	if (card.type == 'order') {
		await Order.deleteMany({
			card: card._id
		});
	}
	if (card.type == 'poll') {
		await Poll.deleteMany({
			card: card._id
		});
  }

  await card.remove();

  IO.getIO().emit('updateCard', {
    _id: card._id,
    closed: true
  });

  return res.json({
    data: card
  });
};
