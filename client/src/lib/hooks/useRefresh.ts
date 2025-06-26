import { useQuery } from "@tanstack/react-query";
import api from "../axios";

export const useRefresh = () => {
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
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
