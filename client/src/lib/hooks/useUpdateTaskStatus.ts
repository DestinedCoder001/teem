import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { currentWs } from "../store/userStore";
import type { CustomAxiosError } from "../types";
import { toast } from "sonner";

export const useUpdateTaskStatus = () => {
  const { wsId } = currentWs((state) => state);
  return useMutation({
    mutationFn: async (payload: {
      taskId: string;
      status: "pending" | "completed";
    }) => {
      const { data } = await api.patch(`/${wsId}/tasks/update-status`, payload);
      return data;
    },
    onSuccess: () => {
      toast.success("Task status updated successfully", {
        position: "top-center",
      });
    },
    onError: (err) => {
      const error = err as CustomAxiosError;
      toast.error(
        error.response?.data.message || "Couldn't update task status",
        {
          position: "top-center",
        }
      );
    },
  });
};
