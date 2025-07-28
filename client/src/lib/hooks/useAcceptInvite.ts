import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../axios";
import { toast } from "sonner";
import type { CustomAxiosError } from "../types";

const useAcceptInvite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { workspaceId: string }) => {
      const { data } = await api.post("/workspaces/accept-invite", payload);
      return data;
    },
    onSuccess: () => {
      toast.success("Invite accepted successfully", { position: "top-center" });
      queryClient.invalidateQueries({ queryKey: ["get-invites"] });
      queryClient.invalidateQueries({ queryKey: ["get-me"] });
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

export default useAcceptInvite;
