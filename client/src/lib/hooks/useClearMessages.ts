import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../axios";
import { currentChannelDetails, currentWsDetails } from "../store/userStore";
import { toast } from "sonner";

const useClearMessages = () => {
  const wsId = currentWsDetails.getState()._id;
  const channelId = currentChannelDetails.getState()._id;
  const querclient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.delete(
        `/${wsId}/channels/${channelId}/clear-messages`
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Messages cleared successfully", {
        position: "top-center",
      });
      querclient.invalidateQueries({ queryKey: ["get-channel-details"] });
    },
    onError: () => {
      toast.error("An error occurred", { position: "top-center" });
    },
  });
};

export default useClearMessages;
