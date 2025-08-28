import { useMutation } from "@tanstack/react-query";
import api from "../axios";
import { currentChannelDetails, currentWsDetails } from "../store/userStore";
import { toast } from "sonner";
import { getSocket } from "../socket";

const useEditMessage = () => {
  const wsId = currentWsDetails((state) => state._id);
  const channelId = currentChannelDetails((state) => state._id);
  const authSocket = getSocket()!;
  return useMutation({
    mutationFn: async (payload: { messageId: string; message: string }) => {
      const { data } = await api.patch(
        `/${wsId}/${channelId}/edit-message`,
        payload
      );
      return data.message;
    },
    onSuccess: (data) => {
      authSocket?.emit("edit_message", { wsId, id: channelId, message: data });
    },
    onError: () => {
      toast.error("Couldn't edit message", { position: "top-center" });
    },
    retry: false,
  });
};

export default useEditMessage;
