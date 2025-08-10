import { create } from "zustand";
import type { EditingMessageProps } from "../types";
import { persist } from "zustand/middleware";

const useSidebarOpen = create<{
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}>()(
  persist(
    (set) => ({
      isOpen: false,
      setOpen: (open) => set({ isOpen: open }),
    }),
    {
      name: "teem-sidebar",
    }
  )
);

const useCreateWsDialogOpen = create<{
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}>((set) => ({
  isOpen: false,
  setOpen: (open) => set({ isOpen: open }),
}));

const useCreateChannelDialogOpen = create<{
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}>((set) => ({
  isOpen: false,
  setOpen: (open) => set({ isOpen: open }),
}));

const useCreateTaskDialogOpen = create<{
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}>((set) => ({
  isOpen: false,
  setOpen: (open) => set({ isOpen: open }),
}));

const useEditTaskDialogOpen = create<{
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}>((set) => ({
  isOpen: false,
  setOpen: (open) => set({ isOpen: open }),
}));

const useRemoveAlertOpen = create<{
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}>((set) => ({
  isOpen: false,
  setOpen: (open) => set({ isOpen: open }),
}));
const useWsDeleteAlertOpen = create<{
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}>((set) => ({
  isOpen: false,
  setOpen: (open) => set({ isOpen: open }),
}));

const useTaskSheetOpen = create<{
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}>((set) => ({
  isOpen: false,
  setOpen: (open) => set({ isOpen: open }),
}));

const useSendInviteOpen = create<{
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}>((set) => ({
  isOpen: false,
  setOpen: (open) => set({ isOpen: open }),
}));

const photoViewer = create<{
  image: string;
  isOpen: boolean;
  setOpen: (open: boolean, image: string) => void;
}>((set) => ({
  image: "",
  isOpen: false,
  setOpen: (open, image) => set({ isOpen: open, image }),
}));

const useActiveUsers = create<{
  activeUsers: string[];
  setActiveUsers: (users: string[]) => void;
}>((set) => ({
  activeUsers: [],
  setActiveUsers: (users: string[]) => set({ activeUsers: users }),
}));

const useUserOnline = create<{
  isOnline: boolean;
  setIsOnline: (open: boolean) => void;
}>((set) => ({
  isOnline: false,
  setIsOnline: (open) => set({ isOnline: open }),
}));

const useEditingMessage = create<{
  isEditing: boolean;
  setEditing: (editing: boolean) => void;
  message: EditingMessageProps;
  setMessage: (msg: EditingMessageProps) => void;
}>((set) => ({
  isEditing: false,
  setEditing: (editing) => set({ isEditing: editing }),
  setMessage: (msg) => set({ message: { ...msg } }),
  message: { content: "", _id: "", channel: "" },
}));

const useDeleteAccountOpen = create<{
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}>((set) => ({
  isOpen: false,
  setOpen: (open) => set({ isOpen: open }),
}));

export {
  useSidebarOpen,
  useCreateWsDialogOpen,
  useCreateChannelDialogOpen,
  useCreateTaskDialogOpen,
  useEditTaskDialogOpen,
  useTaskSheetOpen,
  useRemoveAlertOpen,
  useWsDeleteAlertOpen,
  useSendInviteOpen,
  useActiveUsers,
  useUserOnline,
  photoViewer,
  useEditingMessage,
  useDeleteAccountOpen,
};
