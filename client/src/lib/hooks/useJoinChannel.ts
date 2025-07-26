import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../axios";
import { currentChannelDetails, currentWsDetails } from "../store/userStore";
import type { CustomAxiosError } from "../types";
import { toast } from "sonner";

const useJoinChannel = () => {
  const wsId = currentWsDetails.getState()._id;
  const channelId = currentChannelDetails.getState()._id;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post(`/${wsId}/channels/${channelId}/join`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-channel-details"] });
      toast.success("Joined channel successfully", { position: "top-center" });
    },
    onError: (err) => {
      const error = err as CustomAxiosError;
      let msg = "";
      if (error.status !== 500) {
        msg = error.response?.data.message as string;
      } else {
        msg = "Couldn't join channel";
      }
      toast.error(msg || "Couldn't join channel", {
        position: "top-center",
      });
    },
  });
};

export default useJoinChannel;
