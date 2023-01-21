import authRequired from './authRequired';
import errorHandler from './errorHandler';
import recaptchaVerification from './recaptchaVerification';

export { errorHandler, authRequired, recaptchaVerification };

export const defaultResponseMiddlewares = [errorHandler];

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}
