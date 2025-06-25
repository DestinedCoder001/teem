import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";

export const useVerifyResetOtp = () =>
  useMutation({
    mutationFn: async (payload: {code: string; email: string }) => {
      const { data } = await api.post("/auth/verify-reset", payload);
      return data;
    },
  });
