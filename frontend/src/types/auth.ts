export type AuthUser = {
  _id: string;
  email: string;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};
