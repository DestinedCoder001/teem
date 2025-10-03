import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";

export const useGuestLogin = () =>
  useMutation({
    mutationFn: async () => {
      const { data } = await api.post("/auth/login", {
        email: "destinybstman@gmail.com",
        password: "123456",
      });
      return data;
    },
  });
