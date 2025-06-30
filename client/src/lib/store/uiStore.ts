import { create } from "zustand";

const useSidebarOpen = create<{
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}>((set) => ({
  isOpen: false,
  setOpen: (open) => set({ isOpen: open }),
}));

export { useSidebarOpen };
