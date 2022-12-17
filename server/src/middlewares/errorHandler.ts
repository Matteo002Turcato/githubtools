import type { NextFunction, Request, Response } from 'express';

import logger from '@lib/logger';
import { ValidationError } from '@lib/validation';

export default (
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error instanceof ValidationError) {
    return res.status(400).json({
      message: 'Uno o più campi contengono errori',
      errors: error.errors,
    });
  } else {
    logger.error(error);
    console.error(error);
    // Global error handling
    return res.status(500).end(`Something went wrong`);
  }
};
