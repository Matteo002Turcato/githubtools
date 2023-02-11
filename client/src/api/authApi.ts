import { createApi } from '@reduxjs/toolkit/query/react';

import env from '@config/env';

import { baseQuery } from './';

export interface User {
  id: number;
}

interface LoginResponse {
  userId: number;
  accessToken: string;
}

interface LoginRequest {
  email: string;
  password: string;
  otp?: string;
  recaptchaToken: string;
}

interface LogoutResponse {
  message: string;
}

const api = createApi({
  baseQuery: baseQuery,
  reducerPath: 'api/auth',
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: env.API_LOGIN_PATH,
        method: 'POST',
        body,
      }),
    }),
    refresh: builder.mutation<LoginResponse, void>({
      query: () => ({ url: env.API_REFRESH_PATH, method: 'POST' }),
    }),
    logout: builder.mutation<LogoutResponse, void>({
      query: () => ({ url: 'auth/logout', method: 'POST' }),
    }),
  }),
});

export const { useLoginMutation, useRefreshMutation, useLogoutMutation } = api;
export default api;
