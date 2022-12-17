import requestLogger from './requestLogger';
import authRequired from './authRequired';
import errorHandler from './errorHandler';

export { requestLogger, errorHandler, authRequired };

export const defaultRequestMiddlewares = [requestLogger];
export const defaultResponseMiddlewares = [errorHandler];
