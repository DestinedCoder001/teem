import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";

export const useLogin = () =>
  useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      const { data } = await api.post("/auth/login", payload);
      return data;
    },
  });