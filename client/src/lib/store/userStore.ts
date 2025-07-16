import { create } from "zustand";
import {
  type WorkspacePayload,
  type UserState,
  type ChannelPayload,
  type TaskPayload,
} from "../types";

const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

const useUserWorkspaces = create<{
  workspaces: { _id: string; name: string; profilePicture: string }[];
  setWorkspaces: (
    workspaces: { _id: string; name: string; profilePicture: string }[]
  ) => void;
}>((set) => ({
  workspaces: [],
  setWorkspaces: (workspaces) => set({ workspaces }),
}));

const currentWs = create<{
  wsId: string | null;
  name: string;
  setCurrentWs: ({ id, name }: { id: string; name: string }) => void;
  signOut: () => void;
}>((set) => ({
  wsId: localStorage.getItem("wsId") || null,
  name: localStorage.getItem("wsName") || "",
  setCurrentWs: ({ id, name }) => {
    localStorage.setItem("wsId", id);
    localStorage.setItem("wsName", name);
    set({ wsId: id, name });
  },
  signOut: () => {
    localStorage.removeItem("wsId");
    localStorage.removeItem("wsName");
    set({ wsId: null, name: "" });
  },
}));

const currentWsDetails = create<
  WorkspacePayload & {
    setWorkspaceDetails: (details: WorkspacePayload) => void;
  }
>((set) => ({
  name: "",
  users: [],
  createdBy: "",
  channels: [],
  profilePicture: "",
  setWorkspaceDetails: (details: WorkspacePayload) => set(details),
}));

const currentChannelDetails = create<
  ChannelPayload & {
    setChannelDetails: (details: ChannelPayload) => void;
  }
>((set) => ({
  name: "",
  description: "",
  setChannelDetails: (details: ChannelPayload) => set(details),
}));

const useUserTasks = create<{
  tasks: TaskPayload[] | [];
  setTasks: (tasks: TaskPayload[] | []) => void;
}>((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
}));

const currentEditingTask = create<{
  task: TaskPayload | null;
  setTask: (task: TaskPayload | null) => void;
}>((set) => ({
  task: null,
  setTask: (task) => set({ task }),
}));

export {
  useUserWorkspaces,
  currentWs,
  useUserStore,
  currentWsDetails,
  currentChannelDetails,
  useUserTasks,
  currentEditingTask,
};
