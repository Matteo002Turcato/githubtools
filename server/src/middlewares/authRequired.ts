import type { NextFunction, Request, Response } from 'express';
import { decodeJWT, verifyJWT } from '@lib/jwt';

export default async (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({ message: 'Missing authorization header' });
  }

  const authorizationArray = authorization.split(' ');

  if (authorizationArray[0] !== 'Bearer') {
    return res
      .status(401)
      .json({ message: 'Invalid authorization header. Bearer token required' });
  }

  const token = authorizationArray[1];
  const refresh = req.cookies.refreshToken;

  if (!(await verifyJWT(token)) || !refresh) {
    return res.status(401).json({ message: 'Token is not valid' });
  }

  req.userId = decodeJWT(token).userId;

  next();
};
