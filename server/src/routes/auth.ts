import { Router } from 'express';

import env from '@config/env';
import validate, { isEmail, isRequired, isString } from '@lib/validation';
//import { authRequired, recaptchaVerification } from '@middlewares';
import { authRequired } from '@middlewares';

import {
  authenticate,
  logout,
  logoutByRefreshToken,
  refreshToken,
} from '@services/authentication';

const router = Router();

router.post('/auth/login', async (req, res, next) => {
  try {
    await validate(req.body, {
      email: [isRequired, isString, isEmail],
      password: [isRequired, isString],
    });

    const { email, password } = req.body;

    const authInfo = await authenticate(email, password);

    if (!authInfo) {
      return res.status(401).json({ message: 'Email o password non corretti' });
    }

    const expireDate = new Date(
      (new Date().getTime() / 1000 + authInfo.refreshLifetime + 100000) * 1000
    ).toUTCString();

    return res
      .setHeader(
        'Set-Cookie',
        `refreshToken=${authInfo.refreshToken}; HttpOnly; Domain=${
          env.COOKIES_DOMAIN
        }; Path=/; Expires=${expireDate};${
          env.NODE_ENV === 'production' ? 'secure; SameSite=Strict; ' : ''
        }`
      )
      .json(authInfo);
  } catch (e) {
    next(e);
  }
});

// TODO: fix refresh server error when logged in in a browser and the try refresh in other
router.post('/auth/refresh', async (req, res, next) => {
  try {
    if (!req.cookies.refreshToken) {
      return res.status(400).json({ message: 'refreshToken is required' });
    }

    const token = req.cookies.refreshToken;

    const authInfo = await refreshToken(token);

    if (!authInfo) {
      // Logout user
      await logoutByRefreshToken(token);

      return res
        .status(401)
        .setHeader(
          'Set-Cookie',
          `refreshToken=; HttpOnly; Domain=${
            env.COOKIES_DOMAIN
          }; Path=/; Max-Age=0;${
            env.NODE_ENV === 'production' ? 'secure; SameSite=Strict; ' : ''
          }`
        )
        .json({ message: 'refreshToken is not valid' });
    }

    const expireDate = new Date(
      (new Date().getTime() / 1000 + authInfo.refreshLifetime) * 1000
    ).toUTCString();

    return res
      .setHeader(
        'Set-Cookie',
        `refreshToken=${authInfo.refreshToken}; HttpOnly; Domain=${
          env.COOKIES_DOMAIN
        }; Path=/; Expires=${expireDate};${
          env.NODE_ENV === 'production' ? 'secure; SameSite=Strict; ' : ''
        }`
      )
      .json(authInfo);
  } catch (e) {
    next(e);
  }
});

router.post(
  '/auth/logout',
  authRequired,
  async (req: any, res: any, next: any) => {
    // imposto valore req:any come in authRequired
    try {
      const { userId } = req;

      await logout(userId!);

      return res
        .setHeader(
          'Set-Cookie',
          `refreshToken=; HttpOnly; Domain=${
            env.COOKIES_DOMAIN
          }; Path=/; Max-Age=0;${
            env.NODE_ENV === 'production' ? 'secure; SameSite=Strict; ' : ''
          }`
        )
        .json({ message: 'Success' });
    } catch (e) {
      next(e);
    }
  }
);

export default router;
