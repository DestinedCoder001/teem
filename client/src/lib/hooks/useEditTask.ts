import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { currentWs } from "../store/userStore";
import type { CustomAxiosError } from "../types";
import { toast } from "sonner";

export const useEditTask = () => {
  const { wsId } = currentWs((state) => state);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { title: string; guidelines: string; dueDate: Date; taskId: string; assignedTo: string }) => {
      const { data } = await api.patch(`/${wsId}/tasks/edit`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-user-tasks"] });
    },
    onError: (err) => {
      const error = err as CustomAxiosError;
      toast.error(error.response?.data.message || "Couldn't edit task", { position: "top-center" });
    },
  });
};
