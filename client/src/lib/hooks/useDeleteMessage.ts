import { useMutation } from "@tanstack/react-query";
import api from "../axios";
import { currentWsDetails } from "../store/userStore";
import { toast } from "sonner";

const useDeleteMessage = () => {
  const wsId = currentWsDetails((state) => state._id);
  return useMutation({
    mutationFn: async (payload: { messageId: string; channelId: string }) => {
      const { data } = await api.post(
        `/${wsId}/${payload.channelId}/delete-message`,
        { messageId: payload.messageId }
      );
      return data.message;
    },
    onError: () => {
      toast.error("Couldn't delete message", { position: "top-center" });
    },
  });
};

export default useDeleteMessage;
