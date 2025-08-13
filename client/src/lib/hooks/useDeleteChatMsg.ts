import { useMutation } from "@tanstack/react-query";
import api from "../axios";
import { currentWsDetails } from "../store/userStore";
import { toast } from "sonner";

const useDeleteChatmsg = () => {
  const wsId = currentWsDetails((state) => state._id);
  return useMutation({
    mutationFn: async (payload: { messageId: string }) => {
      const { data } = await api.post(
        `/${wsId}/chat/delete-chat-message`,
        payload
      );
      return data.message;
    },
    onError: () => {
      toast.error("Couldn't delete message", { position: "top-center" });
    },
  });
};

export default useDeleteChatmsg;
