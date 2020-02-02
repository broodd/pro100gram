import { Request, Response, NextFunction } from 'express';
import { User, IUser } from '../models/User';
import { Card, ICard } from '../models/Card';
import { Order, IOrder } from '../models/Order';
import { Poll, IPoll } from '../models/Poll';
import { isEmpty, isLength } from 'validator';
import { SLACK_CLIENT_ID, SLACK_CLIENT_SECRET } from '../util/secrets';
import { AppError } from '../util/error-handler';
import asyncWrapper from '../util/error-handler';
import logger from '../util/logger';
import { WebClient } from '@slack/web-api';
import passport from 'passport';
import passportSlack from 'passport-slack';

passport.use(
  new passportSlack.Strategy(
    {
      clientID: SLACK_CLIENT_ID,
      clientSecret: SLACK_CLIENT_SECRET
    },
    async (accessToken: string, refreshToken: string, profile: any, done: Function) => {
      try {
				console.log('--- profile.user', profile.user);

        const user: IUser = await User.findOne({
          slackID: profile.id
        }, {
          profile: 1,
          role: 1,
          email: 1,
          slackID: 1,
          accessToken: 1
        });

        if (!user) {
          const newUser: IUser = await User.create({
            email: profile.user.email,
            password: 'none',
            accessToken,
            profile: {
              name: profile.user.name,
              img: profile.user.image_512
            },
            slackID: profile.id
          });

          done(undefined, newUser);
        } else {
          done(undefined, user);
        }
      } catch (error) {
        throw new AppError(error, 500);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(undefined, user);
});

passport.deserializeUser((id, done) => {
  logger.debug('-- deseriUser', id);

  User.findById(id, function(err, user) {
    err ? done(err) : done(undefined, user.id);
  });
});

export default passport;