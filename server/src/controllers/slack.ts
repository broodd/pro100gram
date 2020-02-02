import { Request, Response, NextFunction } from 'express';
import { SLACK_TOKEN, ServerURL, ClientURL } from '../util/secrets';
import { User, IUser } from '../models/User';
import { AppError } from '../util/error-handler';
import { WebClient } from '@slack/web-api';
import { JWT_SECRET } from '../util/secrets';
import jwt from 'jsonwebtoken';

// path to start the OAuth flow
export const slackAuthCallback = async (req: Request, res: Response, next: NextFunction) => {
  const user: any = req.user;
  res.redirect(`${ClientURL}auth/slack/${user.accessToken}`);
};

/**
 * GET /slack/user/accessToken
 * Get slack user.
 */
export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const { accessToken } = req.params;

  const user: IUser = await User.findOne({
    accessToken: accessToken
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email
    },
    JWT_SECRET,
    { expiresIn: '10y' }
  );

  return res.status(200).send({
    token: `Bearer ${token}`,
    data: user
  });
};

/**
 * GET /slack/channels/list
 * Get slack channels.
 */
export const getChannels = async (req: Request, res: Response, next: NextFunction) => {
  const { cursor, limit = 10 } = req.query;
  const bot = new WebClient(SLACK_TOKEN);

  const data: any = await bot.conversations.list({
    // limit
  });

  if (!data.ok) {
    throw new AppError('Channels not valid', 401);
  }

  const channels = data.channels.map((channel: any) => {
    return {
      id: channel.id,
      name: channel.name,
    };
  });

  return res.json({
    length: channels.length,
    data: channels
  });
};