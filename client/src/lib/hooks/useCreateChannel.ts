import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { currentWs } from "../store/userStore";

export const useCreateChannel = () => {
  const { wsId } = currentWs((state) => state);

  return useMutation({
    mutationFn: async (payload: { name: string, description: string }) => {
      const { data } = await api.post(`/${wsId}/channels/create`, payload);
      return data;
    },
  });
};
