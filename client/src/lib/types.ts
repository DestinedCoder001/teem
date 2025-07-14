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
  _id: string;
  email: string;
  profilePicture: string;
};

export type UserState = {
  user: User | null;
  setUser: (user: User) => void;
};

export type WorkspacePayload = {
  name: string;
  users: User[];
  createdBy: string;
  channels: { name: string; description: string; _id: string }[];
};

export type ChannelPayload = {
  name: string;
  description: string;
};

export type TaskPayload = {
  _id: string;
  title: string;
  guidelines: string;
  status: string;
  dueDate: Date;
  assignedTo: User;
  assignedBy: User;
  createdAt: Date;
  isDue: boolean;
};

export type CustomAxiosError = AxiosError<{ message: string }>;
