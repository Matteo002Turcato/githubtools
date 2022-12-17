const env = {
  NODE_ENV: process.env.NODE_ENV,
  JWT_ISSUER: process.env.JWT_ISSUER || 'issuer',
  JWT_LIFETIME: +(process.env.JWT_LIFETIME || 3600),
  JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY || '',
  JWT_PUBLIC_KEY: process.env.JWT_PUBLIC_KEY || '',
  REFRESH_TOKEN_LIFETIME: +(process.env.REFRESH_TOKEN_LIFETIME || 7200),
  API_KEY: process.env.API_KEY,
  API_ALLOWED_IP: process.env.API_ALLOWED_IP,
  COOKIES_DOMAIN: process.env.COOKIES_DOMAIN,
  BASE_URL: process.env.BASE_URL,
  PASSWORD_RESET_EXPIRE_TIME: +(process.env.PASSWORD_RESET_EXPIRE_TIME || 3600),
  RECAPTCHA_PRIVATE_KEY: process.env.RECAPTCHA_PRIVATE_KEY,
};

export default env;
