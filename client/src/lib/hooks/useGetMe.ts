import { useQuery } from "@tanstack/react-query";
import type { User } from "../types";
import api from "../axios";

const useGetMe = () => {
  const { data, isSuccess } = useQuery({
    queryKey: ["get-me"],
    queryFn: async () => {
      const res = await api.get("/users/me");
      return res.data.user as User;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  return { data: data as User, isSuccess };
};

export default useGetMe;
