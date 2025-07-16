import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { CustomAxiosError } from "../types";
import { toast } from "sonner";

export const useUpdateWsDp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { file: string; workspaceId: string }) => {
      const { data } = await api.post("/uploads/update-ws-dp", payload);
      return data;
    },
    onSuccess: () => {
      toast.success("Workspace profile picture updated successfully", { position: "top-center" });
      queryClient.invalidateQueries({ queryKey: ["get-ws-details"] });
    },
    onError: (err) => {
      const error = err as CustomAxiosError;
      toast.error(error.response?.data.message || "Couldn't update profile picture", { position: "top-center" });
    },
  });
};
