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
  _id: string;
  name: string;
  users: User[];
  createdBy: string;
  channels: { name: string; description: string; _id: string }[];
  profilePicture: string;
};

export type ChannelPayload = {
  _id: string;
  name: string;
  description: string;
  members: { _id: string; firstName: string; lastName: string, profilePicture: string }[];
  createdBy: { _id: string; firstName: string; lastName: string, profilePicture: string };
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

export type Invite = {
  _id: string;
  workspace: {
    _id: string;
    name: string;
  };
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  receiver: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
};

export type MessageProps = {
  _id: string;
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePicture: string;
  };
  attachment: { type: string; url: string };
  content: string;
  createdAt: Date;
  channel: string
}

export type ChannelUser = {
  _id: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
};

export type CustomAxiosError = AxiosError<{ message: string }>;
