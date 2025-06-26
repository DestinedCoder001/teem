import type { AxiosError } from "axios";

export type LoginDetails = { email: string; password: string };
export type SignUpDetails = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type User = {
  firstName: string;
  lastName: string;
  id: string;
  email: string;
  profilePicture: string;
};

export type UserState = {
  user: User | null;
  setUser: (user: User) => void;
};

export type CustomAxiosError = AxiosError<{ message: string }>
