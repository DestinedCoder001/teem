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

const currentWs = create<{
  wsId: string | null;
  name: string;
  setWsId: ({ id, name }: { id: string; name: string }) => void;
  signOut: () => void;
}>((set) => ({
  wsId: localStorage.getItem("wsId") || null,
  name: localStorage.getItem("wsName") || "",
  setWsId: ({ id, name }) => {
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

export { useSidebarOpen, useCreateWsDialogOpen, useUserWorkspaces, currentWs };
