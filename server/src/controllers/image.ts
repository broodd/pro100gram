import { Request, Response, NextFunction } from 'express';
import { AppError } from '../util/error-handler';
import logger from '../util/logger';

export const uploadImages = (req: Request, res: Response, next: NextFunction) => {
  const files: any = req.files;
  if (!files && !files.length) {
    throw new AppError('Files are empty');
  }

  const filesUrls: string[] = files.map((file: any) => {
    return file.url;
  });

  return res.json({
    data: filesUrls
  });
};
