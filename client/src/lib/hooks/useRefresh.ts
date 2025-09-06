import { useQuery } from "@tanstack/react-query";
import api from "../axios";
import { useAuthStore } from "../store/authStore";

export const useRefresh = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useQuery({
    queryKey: ["refresh-token"],
    queryFn: async () => {
      const res = await api.post(
        "/auth/refresh",
        {},
        { withCredentials: true }
      );
      return res.data;
    },
    enabled: !accessToken,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
