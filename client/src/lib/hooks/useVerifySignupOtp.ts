import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";

export const useVerifySignupOtp = () =>
  useMutation({
    mutationFn: async (payload: {code: string; email: string }) => {
      const { data } = await api.post("/auth/verify-otp", payload);
      localStorage.setItem("access_token", data.accessToken);
      return data;
    },
  });
