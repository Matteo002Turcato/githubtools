import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import { URLSearchParams } from 'url';

import env from '@config/env';

import logger from '@lib/logger';

export default async (req: Request, res: Response, next: NextFunction) => {
  if (env.NODE_ENV === 'production') {
    // Get recaptcha token
    const { recaptchaToken } = req.body;
    if (!recaptchaToken) {
      return res.status(400).json({ message: 'Token recaptcha mancante' });
    }

    try {
      const params = new URLSearchParams({
        secret: env.RECAPTCHA_PRIVATE_KEY,
        response: recaptchaToken,
        remoteip:
          req.headers['x-forwarded-for'] || req.socket.remoteAddress || '',
      });

      const response = await axios.post(
        'https://www.google.com/recaptcha/api/siteverify',
        params.toString()
      );

      if (!response.data.success) {
        throw response.data;
      } else if (response.data.score < 0.5) {
        return res.status(429).json({ message: 'Spam rilevata' });
      }
    } catch (e: any) {
      logger.error(e);
      console.error(e);
      // Global error handling
      return res.status(500).end('Errore del server');
    }
  }

  next();
};
