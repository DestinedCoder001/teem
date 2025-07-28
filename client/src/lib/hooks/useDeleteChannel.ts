import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../axios";
import { currentWsDetails } from "../store/userStore";

const useDeleteChannel = () => {
  const navigate = useNavigate();
  const wsId = currentWsDetails.getState()._id;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ channelId }: { channelId: string }) => {
      const { data } = await api.delete(`/${wsId}/channels/${channelId}/delete`);
      return data;
    },
    onSuccess: () => {
      toast.success("Channel deleted successfully", { position: "top-center" });
      queryClient.invalidateQueries({ queryKey: ["get-ws-details"] });
      navigate("/", { replace: true });
    },
    onError: () => {
      toast.error("Couldn't delete channel", { position: "top-center" });
    },
  });
};

export default useDeleteChannel;
