const env = {
  NODE_ENV: process.env.NODE_ENV,
  API_URL:
    process.env.REACT_APP_API_URL !== ''
      ? process.env.REACT_APP_API_URL
      : `${window.location.protocol}//${window.location.hostname}:5000/api`,
  API_LOGIN_PATH: process.env.REACT_API_LOGIN_PATH || 'auth/login',
  API_REFRESH_PATH: process.env.REACT_API_LOGIN_PATH || 'auth/refresh',
  // RECAPTCHA_PUBLIC_KEY: process.env.REACT_APP_RECAPTCHA_PUBLIC_KEY,
  // STRIPE_PUBLIC_KEY: process.env.REACT_APP_STRIPE_PUBLIC_KEY || '',
  BASE_URL: process.env.REACT_APP_BASE_URL || '',
};

export default env;
