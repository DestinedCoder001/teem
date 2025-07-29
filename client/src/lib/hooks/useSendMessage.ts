import { useMutation } from "@tanstack/react-query";
import api from "../axios";
import { currentWsDetails } from "../store/userStore";
import { toast } from "sonner";

const useSendMessage = () => {
  const wsId = currentWsDetails((state) => state._id);
  return useMutation({
    mutationFn: async (payload: { message: string; channelId: string, attachment: { type: string; url: string } }) => {
      const { data } = await api.post(
        `/${wsId}/${payload.channelId}/send-message`,
        { message: payload.message, attachment: payload.attachment }
      );
      return data.message;
    },
    onError: () => {
      toast.error("Couldn't send message", { position: "top-center" });
    },
  });
};

export default useSendMessage;
