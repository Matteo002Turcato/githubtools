import logger from '@lib/logger';
import { NextFunction, Request, Response } from 'express';

export default (req: Request, _res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.baseUrl}${req.url}`);

  next();
};
