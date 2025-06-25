import { create } from "zustand";

const useOtpDialogStore = create<{
  isOpen: boolean;
  setOpen: () => void;
  setEmail: (email: string) => void;
  email: string;
}>((set) => ({
  isOpen: false,
  email: "",
  setOpen: () => set((state) => ({ ...state, isOpen: !state.isOpen })),
  setEmail: (email: string) => set((state) => ({ ...state, email })),
}));

const useReqResetDialogStore = create<{
  isOpen: boolean;
  setOpen: () => void;
}>((set) => ({
  isOpen: false,
  setOpen: () => set((state) => ({ ...state, isOpen: !state.isOpen })),
}));

const useNewPwdDialogStore = create<{
  isOpen: boolean;
  setOpen: () => void;
  setEmail: (email: string) => void;
  email: string;
}>((set) => ({
  isOpen: false,
  email: "",
  setOpen: () => set((state) => ({ ...state, isOpen: !state.isOpen })),
  setEmail: (email: string) => set((state) => ({ ...state, email })),
}));

export { useOtpDialogStore, useReqResetDialogStore, useNewPwdDialogStore };
