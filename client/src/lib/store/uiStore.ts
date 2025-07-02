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

const useUserWorkspaces = create<{
  workspaces: { _id: string; name: string }[];
  setWorkspaces: (workspaces: { _id: string; name: string }[]) => void;
}>((set) => ({
  workspaces: [],
  setWorkspaces: (workspaces) => set({ workspaces }),
}));

export { useSidebarOpen, useCreateWsDialogOpen, useUserWorkspaces };
