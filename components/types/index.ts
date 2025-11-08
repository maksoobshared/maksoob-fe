// Types for auth endpoints

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type ForgotPayload = {
  email: string;
};

export type ResetPayload = {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
};

export type User = {
  id: number | string;
  name: string;
  email: string;
  // add other user fields your API returns
  [key: string]: any;
};

export type AuthSuccessResponse = {
  user?: User;
  token?: string;
  message?: string;
  body?: {
    user?: User;
    token?: string;
    message?: string;
  };
};

export type LoginResponse = AuthSuccessResponse;

export type RegisterResponse = AuthSuccessResponse;

export type MessageResponse = {
  message?: string;
};

export type ApiError = {
  message?: string;
  errors?: Record<string, any>;
};

export default {} as const;
