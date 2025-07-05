import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { currentWs } from "../store/userStore";
import type { CustomAxiosError } from "../types";
import { toast } from "sonner";

export const useDeleteTask = () => {
  const { wsId } = currentWs((state) => state);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      taskId: string;
    }) => {
      const { data } = await api.delete(`/${wsId}/tasks/delete`, {data: payload});
      return data;
    },
    onSuccess: () => {
      toast.success("Task deleted successfully", {
        position: "top-center",
      });
      queryClient.invalidateQueries({ queryKey: ["get-user-tasks"] });
    },
    onError: (err) => {
      const error = err as CustomAxiosError;
      toast.error(
        error.response?.data.message || "Couldn't delete task",
        {
          position: "top-center",
        }
      );
    },
  });
};
