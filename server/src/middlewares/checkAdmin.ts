import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../util/secrets';
import { AppError } from '../util/error-handler';
import { User, IUser } from '../models/User';
import logger from '../util/logger';

export default (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user;

  if (user.role === 'ADMIN') {
    return next();
  }

  throw new AppError('User not admin', 403);
};