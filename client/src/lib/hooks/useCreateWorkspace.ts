import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";

export const useCreateWorkspace = () =>
  useMutation({
    mutationFn: async (payload: { name: string; }) => {
      const { data } = await api.post("/workspaces/create", payload);
      return data;
    },
  });
