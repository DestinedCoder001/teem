import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../axios";
import { toast } from "sonner";
import { currentChannelDetails, currentWsDetails } from "../store/userStore";

const useEditChannel = () => {
  const wsId = currentWsDetails.getState()._id;
  const channelId = currentChannelDetails.getState()._id;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { name: string; description: string }) => {
      const { data } = await api.patch(
        `/${wsId}/channels/${channelId}/edit`,
        payload
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Channel details edited successfully", { position: "top-center" });
      queryClient.invalidateQueries({ queryKey: ["get-channel-details"] });
      queryClient.invalidateQueries({ queryKey: ["get-ws-details"] });
    },
    onError: () => {
      toast.error("Couldn't edit channel details", { position: "top-center" });
    },
  });
};

export default useEditChannel;
