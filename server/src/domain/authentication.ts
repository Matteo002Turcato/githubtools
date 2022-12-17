export type AuthInfo = {
  userId: number;
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  refreshToken: string;
  refreshLifetime: number;
};
