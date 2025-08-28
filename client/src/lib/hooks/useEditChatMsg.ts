import { useMutation } from "@tanstack/react-query";
import api from "../axios";
import { currentWsDetails } from "../store/userStore";
import { toast } from "sonner";
import { getSocket } from "../socket";

const useEditChatMsg = () => {
  const wsId = currentWsDetails((state) => state._id);
  const authSocket = getSocket()!;

  return useMutation({
    mutationFn: async (payload: { message: string; messageId: string }) => {
      const { data } = await api.patch(
        `/${wsId}/chat/edit-chat-message`,
        payload
      );
      return data.message;
    },
    onSuccess: (data) => {
      authSocket?.emit("edit_chat_message", {
        wsId,
        chatId: data.chatId,
        message: data,
      });
    },
    onError: () => {
      toast.error("Couldn't edit message", { position: "top-center" });
    },
  });
};

export default useEditChatMsg;
