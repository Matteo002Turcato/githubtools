import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError
} from '@reduxjs/toolkit/query/react';
import { sleepUntil } from '@utils/promises';

import { RootState } from '@app/store';

import env from '@config/env';

import { logout, setCredentials } from '@slices/authSlice';

const BASE_URL = env.API_URL;
const LOGIN_PATH = env.API_LOGIN_PATH;
const REFRESH_PATH = env.API_REFRESH_PATH;

let isRefreshing = false;

export const defaultPrepareHeaders = (
  headers: Headers,
  { getState }: { getState: any }
) => {
  // By default, if we have a token in the store, let's use that for authenticated requests
  const accessToken = (getState() as RootState).auth.accessToken;

  if (accessToken) {
    headers.set('authorization', `Bearer ${accessToken}`);
  }

  return headers;
};

const baseQueryFn = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    // By default, if we have a token in the store, let's use that for authenticated requests
    const accessToken = (getState() as RootState).auth.accessToken;

    if (accessToken) {
      headers.set('authorization', `Bearer ${accessToken}`);
    }

    return headers;
  },
});

export const baseQuery: BaseQueryFn<
  FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQueryFn(args, api, extraOptions);

  if (
    args.url !== LOGIN_PATH &&
    args.url !== REFRESH_PATH &&
    result.error?.status === 401
  ) {
    if (!isRefreshing) {
      isRefreshing = true;

      // Try refresh token
      const refreshResult = await baseQueryFn(
        { url: '/auth/refresh', method: 'POST' },
        api,
        extraOptions
      );

      if (refreshResult.error) {
        api.dispatch(logout());

        return result;
      } else {
        const { accessToken, userId } = refreshResult.data as any;

        api.dispatch(
          setCredentials({
            accessToken: accessToken,
            user: { id: userId },
          })
        );

        isRefreshing = false;
      }
    }

    // Retry the initial query
    await sleepUntil(() => !isRefreshing, 15000);

    result = await baseQueryFn(args, api, extraOptions);
  }

  return result;
};
