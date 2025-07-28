import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../axios";
import { currentWsDetails } from "../store/userStore";

const useExitChannel = () => {
  const navigate = useNavigate();
    const wsId = currentWsDetails.getState()._id;
  return useMutation({
    mutationFn: async ({channelId}: { channelId: string }) => {
     const { data } = await api.post(`/${wsId}/channels/${channelId}/leave`);
      return data;
    },
    onSuccess: () => {
      toast.success("Left channel successfully", { position: "top-center" });
      navigate("/", { replace: true });
    },
    onError: () => {
      toast.error("Couldn't exit channel", { position: "top-center" });
    },
  });
};

export default useExitChannel;
