import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../util/secrets';
import { AppError } from '../util/error-handler';
import { User, IUser } from '../models/User';
import logger from '../util/logger';

export default (req: Request, res: Response, next: NextFunction) => {
	try {
		let token: string = req.headers['authorization'];

		if (token) {
			if (token.includes('Bearer ')) {
				token = token.split(' ')[1];
			}

			jwt.verify(token, JWT_SECRET, async (err,  decoded: any) => {
				if (err) {
					const error = new AppError('Token is not valid', 401);
					return next(error);
				} else {
					res.locals.token = decoded;

					const user: IUser = await User.findOne({
						_id: decoded.userId
					});
					if (!user) {
						const err = new AppError('User not found', 401);
						return next(err);
					}
					res.locals.user = user;
					return next();
				}
			});

		} else {
			throw new AppError('Auth token is not supplied', 401);
		}
	} catch (err) {
		throw err;
	}
};