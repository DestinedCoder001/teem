import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { currentWs } from "../store/userStore";
import type { CustomAxiosError } from "../types";
import { toast } from "sonner";

export const useCreateTask = () => {
  const { wsId } = currentWs((state) => state);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { title: string; guidelines: string; dueDate: Date; assignedTo: string }) => {
      const { data } = await api.post(`/${wsId}/tasks/create`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-user-tasks"] });
    },
    onError: (err) => {
      const error = err as CustomAxiosError;
      toast.error(error.response?.data.message || "Couldn't create task", { position: "top-center" });
    },
  });
};
