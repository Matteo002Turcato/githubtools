import * as jwt from 'jsonwebtoken';

import env from '@config/env';

export async function createJWT(
  payload: object,
  expirationTime: number
): Promise<string> {
  const privateKey = env.JWT_PRIVATE_KEY;

  return jwt.sign(payload, privateKey, {
    algorithm: 'ES256',
    expiresIn: expirationTime,
    issuer: env.JWT_ISSUER,
  });
}

export async function verifyJWT(token: string): Promise<boolean> {
  const publicKey = env.JWT_PUBLIC_KEY;

  try {
    jwt.verify(token, publicKey, {
      algorithms: ['ES256'],
      issuer: env.JWT_ISSUER,
    });

    return true;
  } catch (e) {
    return false;
  }
}

export function decodeJWT(token: string): any {
  return jwt.decode(token);
}
