import { useMutation } from "@tanstack/react-query";
import api from "../axios";
import { toast } from "sonner";
import type { CustomAxiosError } from "../types";

const useFindUserByEmail = () => {
  return useMutation({
    mutationFn: async (payload: { email: string }) => {
      const res = await api.post(`/users/email-check`, payload);
      return res.data.user;
    },
    retry: false,
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

export default useFindUserByEmail;
