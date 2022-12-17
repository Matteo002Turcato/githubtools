import { v4 as uuidv4 } from 'uuid'; // creazione token casuale

import env from '@config/env';
import { createJWT } from '@lib/jwt';
import { verifyPassword } from '@lib/passwordHashing';
import prisma from '@lib/prisma';

import type { AuthInfo } from '@domain/authentication';

export async function authenticate(
  email: string,
  password: string
): Promise<AuthInfo | null> {
  const user = await prisma.user.findFirst({ where: { email } });

  if (!user) {
    return null;
  }

  if (!(await verifyPassword(password, user.password))) {
    return null;
  }

  // Create access and refresh token
  const jwt = await createJWT({ userId: user.id }, env.JWT_LIFETIME);

  const refreshToken = uuidv4();

  const authInfo: AuthInfo = {
    userId: user.id,
    accessToken: jwt,
    tokenType: 'Bearer',
    expiresIn: env.JWT_LIFETIME,
    refreshToken,
    refreshLifetime: env.REFRESH_TOKEN_LIFETIME,
  };

  // Insert token in db
  await prisma.refreshTokens.upsert({
    where: {
      userId: user.id,
    },
    update: { token: refreshToken },
    create: {
      token: refreshToken,
      userId: user.id,
    },
  });

  return authInfo;
}

export async function refreshToken(
  refreshToken: string
): Promise<AuthInfo | null> {
  // Check if token exists
  const token = await prisma.refreshTokens.findFirst({
    where: { token: refreshToken },
    select: { userId: true, updatedAt: true },
  });

  if (!token) {
    return null;
  }

  // Check if token has expired
  const now = new Date().getTime() / 1000;

  // TODO: check timezones

  if (now - token.updatedAt.getTime() / 1000 > env.REFRESH_TOKEN_LIFETIME) {
    // Delete token
    await prisma.refreshTokens.delete({ where: { token: refreshToken } });

    return null;
  }

  // Create access and refresh token
  const jwt = await createJWT({ userId: token.userId }, env.JWT_LIFETIME);

  const newRefreshToken = uuidv4();

  const authInfo: AuthInfo = {
    userId: token.userId,
    accessToken: jwt,
    tokenType: 'Bearer',
    expiresIn: env.JWT_LIFETIME,
    refreshToken: newRefreshToken,
    refreshLifetime: env.REFRESH_TOKEN_LIFETIME,
  };

  // Insert token in db
  await prisma.refreshTokens.update({
    where: {
      token: refreshToken,
    },
    data: { token: newRefreshToken },
  });

  return authInfo;
}

export async function logout(userId: number) {
  await prisma.refreshTokens.delete({ where: { userId } });
}

export async function logoutByRefreshToken(token: string) {
  try {
    await prisma.refreshTokens.delete({ where: { token } });
  } catch (e) {
    // Nothing to do
  }
}
