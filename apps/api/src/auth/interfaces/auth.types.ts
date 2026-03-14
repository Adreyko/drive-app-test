export type JwtPayload = {
  sub: string;
};

export type AuthenticatedUser = {
  id: string;
  email: string;
  createdAt: string;
};

export type AuthResponse = {
  accessToken: string;
  user: AuthenticatedUser;
};
