import { create } from "zustand";

const useSidebarOpen = create<{
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}>((set) => ({
  isOpen: false,
  setOpen: (open) => set({ isOpen: open }),
}));

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

const useActiveUsers = create<{
  activeUsers: string[];
  setActiveUsers: (users: string[]) => void;
}>((set) => ({
  activeUsers: [],
  setActiveUsers: (users: string[]) =>
    set({ activeUsers: users }),
}));

const useUserOnline= create<{
  isOnline: boolean;
  setIsOnline: (open: boolean) => void;
}>((set) => ({
  isOnline: false,
  setIsOnline: (open) => set({ isOnline: open }),
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
  useUserOnline
};
