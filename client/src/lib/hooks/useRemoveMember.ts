import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../axios";
import { toast } from "sonner";
import { currentChannelDetails, currentWsDetails } from "../store/userStore";

const useRemoveMember = () => {
  const wsId = currentWsDetails.getState()._id;
  const channelId = currentChannelDetails.getState()._id;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { userId: string }) => {
      const { data } = await api.post(
        `/${wsId}/channels/${channelId}/remove-member`,
        payload
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Member removed", { position: "top-center" });
      queryClient.invalidateQueries({ queryKey: ["get-channel-details"] });
    },
    onError: () => {
      toast.error("Couldn't remove member", { position: "top-center" });
    },
  });
};

export default useRemoveMember;