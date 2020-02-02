import { Request, Response, NextFunction } from 'express';
import { User, IUser } from '../models/User';
import { isEmail, isEmpty, isLength } from 'validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt-nodejs';
import { JWT_SECRET } from '../util/secrets';
import { AppError } from '../util/error-handler';
import logger from '../util/logger';

/**
 * GET /user/:id
 * Get user info.
 */
export const getUserInfo = async (req: Request, res: Response, next: NextFunction) => {
	const { id } = req.params;
	const user: IUser = await User.findById(id);

	if (!user) {
		throw new AppError('User not found', 404);
	}

	return res.json({
		data: user
	});
};


/**
 * GET /users
 * Get user info.
 */
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
	const users: IUser[] = await User.find();

	return res.json({
		data: users
	});
};


/**
 * POST /login
 * Sign in using email and password.
 */
export const postLogin = async (req: Request, res: Response, next: NextFunction) => {
	const { email, password } = req.body;
	const errors = [];

	if (!email || !isEmail(email)) {
		errors.push({
			field: 'email',
			message: 'Email is not valid'
		});
	}
	if (!password || isEmpty(password) || !isLength(password, { min: 5 })) {
		errors.push({
			field: 'password',
      message: 'Password to short'
    });
	}

	if (!!errors.length) {
		throw new AppError(errors, 400);
	}

	const user = await User.findOne({ email }, {
		password: 1,
		profile: 1,
		role: 1,
		email: 1,
		slackID: 1,
		accessToken: 1
	});

	if (!user) {
		throw new AppError('User not found', 404);
	}

	const passwordCheck = bcrypt.compareSync(password, user.password);

	if (passwordCheck) {
		const token = jwt.sign({
			userId: user._id,
			email: user.email
		}, JWT_SECRET, {
			expiresIn: '10y'
		});

		return res.status(200).send({
			token: `Bearer ${token}`,
			data: user
		});
	} else {
		throw new AppError('Account not found.', 404);
	}
};

/**
 * POST /signup
 * Create a new account.
 */
export const postSignup = async (req: Request, res: Response, next: NextFunction) => {
	const { name, email, password } = req.body;
	const errors = [];

	if (!name || isEmpty(name)) {
		errors.push({
      field: 'name',
      message: 'Name is not valid'
    });
	}
	if (!email || !isEmail(email)) {
		errors.push({
      field: 'email',
      message: 'Email is not valid'
    });
	}
	if (!password || isEmpty(password) || !isLength(password, { min: 5 })) {
		errors.push({
      field: 'password',
      message: 'Password to short'
    });
	}

	if (!!errors.length) {
		throw new AppError(errors, 400);
	}

	const existingUser = await User.findOne({ email: req.body.email });

	if (existingUser) {
		throw new AppError('Account with that email address already exists.', 403);
	}

	const user: IUser = await User.create({
		email,
		password,
		profile: {
			name
		},
		role: 'CLIENT'
	});

	const token = jwt.sign({
		userId: user._id,
		email: user.email
	}, JWT_SECRET, {
		expiresIn: '10y'
	});

	return res.json({
		token: `Bearer ${token}`,
		data: user
	});
};