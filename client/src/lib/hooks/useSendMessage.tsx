import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { currentWs } from "../store/userStore";

export const useSendMessage = () => {
  const { wsId } = currentWs((state) => state);

  return useMutation({
    mutationFn: async (payload: { message: string; channelId: string }) => {
      const { data } = await api.post(
        `/${wsId}/${payload.channelId}/send-message`,
        { message: payload.message }
      );
      return data;
    },
  });
};
