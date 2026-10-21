export type AuthUser = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};
