import { decodeJWT, verifyJWT } from '@lib/jwt';

export default async (req: any, res: any, next: any) => {
  // Get bearer token
  // const authorization = req.headers.authorization;

  // if (!authorization) {
  //   return res.status(401).json({ message: 'Missing authorization header' });
  // }

  // const authorizationArray = authorization.split(' ');

  // if (authorizationArray[0] !== 'Bearer') {
  //   return res
  //     .status(401)
  //     .json({ message: 'Invalid authorization header. Bearer token required' });
  // }

  // const token = authorizationArray[1];

  // // Check if refresh token is present to prevent valid tokens after logout
  // if (!(await verifyJWT(token)) || !req.cookies.refreshToken) {
  //   return res.status(401).json({ message: 'Token is not valid' });
  // }

  // req.userId = decodeJWT(token).userId;

  next();
};
