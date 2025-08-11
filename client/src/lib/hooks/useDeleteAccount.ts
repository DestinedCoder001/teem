import { useMutation } from "@tanstack/react-query";
import api from "../axios";
import { toast } from "sonner";
import { useAuthStore } from "../store/authStore";
import { useUserStore } from "../store/userStore";
import type { CustomAxiosError } from "../types";

const useDeleteAccount = () => {
  const { setAccessToken } = useAuthStore((state) => state);
  const { user } = useUserStore((state) => state);
  return useMutation({
    mutationFn: async (payload: { password?: string, code?: string }) => {
      const { data } = await api.delete(`/users/${user?._id}/delete`, {
        data: { password: payload.password, code: payload.code },
      });
      return data;
    },
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
    onSuccess: () => {
      toast.success("Account deleted successfully", { position: "top-center" });
      setAccessToken(null);
      window.location.href = "/signup";
    },
  });
};

export default useDeleteAccount;
