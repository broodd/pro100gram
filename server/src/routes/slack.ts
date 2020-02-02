import { Router } from 'express';
import asyncWrapper from '../util/error-handler';
import passport from 'passport';
const slack = Router();

import authGuard from '../middlewares/authGuard';
import checkAdmin from '../middlewares/checkAdmin';

/**
 * Controllers (route handlers)
 */
import * as slackController from '../controllers/slack';

slack.get(
  '/auth',
  passport.authenticate('slack', {
    scope: ['identity.basic', 'identity.email', 'identity.avatar']
  })
);
slack.get('/auth/callback',
  passport.authenticate('slack', { failureRedirect: '/slack/auth' }),
  asyncWrapper(slackController.slackAuthCallback)
);

slack.get('/user/:accessToken', asyncWrapper(slackController.getUser));
slack.get('/channels/list', authGuard, asyncWrapper(slackController.getChannels));

export default slack;