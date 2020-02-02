import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});
const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: '100gram',
  allowedFormats: ['jpg', 'png', 'svg'],
  transformation: [{ width: 1024, height: 400, crop: 'limit' }]
});

// const storage = multer.diskStorage({
// 	destination: (req: Request, file: any, cb: CallableFunction) => {
// 		cb(undefined, 'static/images');
// 	},
// 	filename: (req: Request, file: any, cb: CallableFunction) => {
// 		const date = new Date().toISOString().replace(/:/g, '_');
// 		const name = file.originalname.toLowerCase().replace(/[\s]/g, '_');
// 		cb(undefined, `${date}-${name}`);
// 	}
// });

// const fileFilter = (req: Request, file: any, cb: CallableFunction) => {
// 	if (file.mimetype.includes('image')) {
// 		cb(undefined, true);
// 	} else {
// 		cb(undefined, false);
// 	}
// };

export default multer({ storage }).array('filesImages');
