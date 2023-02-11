import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '@app/store';

import { User } from '@api/authApi';

type AuthState = {
  user: User | null;
  accessToken: string | null;
};

const slice = createSlice({
  name: 'auth',
  initialState: { user: null, accessToken: null } as AuthState,
  reducers: {
    setCredentials: (
      state,
      { payload: { user, accessToken } }: PayloadAction<AuthState>
    ) => {
      state.user = user;
      state.accessToken = accessToken;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
    },
  },
});

export const { setCredentials, logout } = slice.actions;
export const selectCurrentUser = (state: RootState) => state.auth.user;

export default slice.reducer;
