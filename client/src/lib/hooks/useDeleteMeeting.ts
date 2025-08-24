import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../axios";
import { toast } from "sonner";
import type { CustomAxiosError } from "../types";

const useDeleteMeeting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { meetingId: string; wsId: string }) => {
      const { data } = await api.delete(
        `/${payload.wsId}/meetings/delete-meeting/${payload.meetingId}`
      );
      return data;
    },
    onSuccess: () => {
      toast.success("Meeting deleted successfully", {
        position: "top-center",
      });
      queryClient.invalidateQueries({ queryKey: ["get-meetings"] });
    },
    onError: (err) => {
      const error = err as CustomAxiosError;
      console.log(error);
      let msg = "";
      if (error.status !== 500) {
        msg = error.response?.data.message as string;
      } else {
        msg = "Couldn't delete meeting";
      }
      toast.error(msg || "Couldn't delete meeting", {
        position: "top-center",
      });
    },
  });
};

export default useDeleteMeeting;
