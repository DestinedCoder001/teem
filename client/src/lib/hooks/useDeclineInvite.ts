import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../axios";
import { toast } from "sonner";
import type { CustomAxiosError } from "../types";

const useDeclineInvite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { inviteId: string }) => {
      const { data } = await api.post("/workspaces/decline-invite", payload);
      return data;
    },
    onSuccess: (data: { message: string }) => {
      toast.success(data.message, { position: "top-center" });
      queryClient.invalidateQueries({ queryKey: ["get-invites"] });
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

export default useDeclineInvite;
