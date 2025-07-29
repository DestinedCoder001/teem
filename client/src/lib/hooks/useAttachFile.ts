import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "sonner";

export const useAttachFile = () => {
  return useMutation({
    mutationFn: async (payload: { file: string, channelName: string}) => {
      const { data } = await api.post("/uploads/attach-file", payload);
      return data.data;
    },

    onError: () => {
      toast.error("Couldn't attach file", { position: "top-center" });
    },
  });
};
