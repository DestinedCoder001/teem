import { useMutation } from "@tanstack/react-query";
import api from "../axios";
import { toast } from "sonner";
import type { CustomAxiosError } from "../types";

const useJoinMeeting = () => {
  return useMutation({
    mutationFn: async (payload: { meetingId: string; wsId: string }) => {
      const { data } = await api.post(
        `/${payload.wsId}/meetings/join-meeting/${payload.meetingId}`
      );

      return data;
    },
    onError: (err) => {
      const error = err as CustomAxiosError;
      console.log(error)
      let msg = "";
      if (error.status !== 500) {
        msg = error.response?.data.message as string;
      } else {
        msg = "Couldn't join meeting";
      }
      toast.error(msg || "Couldn't join meeting", {
        position: "top-center",
      });
    },
  });
};

export default useJoinMeeting;
