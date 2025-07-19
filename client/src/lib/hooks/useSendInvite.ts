import { useMutation } from "@tanstack/react-query";
import api from "../axios";
import type { CustomAxiosError } from "../types";
import { toast } from "sonner";
import { currentWsDetails } from "../store/userStore";

const useSendInvite = () => {
  const id = currentWsDetails((state) => state._id);
  return useMutation({
    
    mutationFn: async (payload: { email: string }) => {
      const { data } = await api.post(`/workspaces/${id}/send-invite`, payload);
      return data;
    },

    onSuccess: () => {
      toast.success("Invite sent successfully", {
        position: "top-center",
      });
    },

    onError: (err) => {
      const error = err as CustomAxiosError;
      let msg = "";
      if (error.status === 500) {
        msg = "Server error";
      } else {
        msg = error.response?.data.message as string;
      }
      toast.error(msg, {
        position: "top-center",
      });
    },
  });
};

export default useSendInvite;
