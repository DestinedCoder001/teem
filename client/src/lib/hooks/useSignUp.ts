import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { SignUpDetails } from "../types";

export const useSignUp = () =>
  useMutation({
    mutationFn: async (payload: SignUpDetails) => {
      const { data } = await api.post("/auth/sign-up", payload);
      return data;
    },
  });
