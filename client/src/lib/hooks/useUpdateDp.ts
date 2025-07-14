import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { CustomAxiosError } from "../types";
import { toast } from "sonner";

export const useUpdateDp = () => {
  return useMutation({
    mutationFn: async (payload: { file: string}) => {
      const { data } = await api.post("/uploads/update-dp", payload);
      return data;
    },
    onSuccess: () => {
      toast.success("Profile picture updated successfully", { position: "top-center" });
    },
    onError: (err) => {
      const error = err as CustomAxiosError;
      toast.error(error.response?.data.message || "Couldn't update profile picture", { position: "top-center" });
    },
  });
};
