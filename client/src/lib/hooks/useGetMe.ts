import { useQuery } from "@tanstack/react-query";
import type { User } from "../types";
import api from "../axios";

const useGetMe = () => {
  const { data, isSuccess, isPending } = useQuery({
    queryKey: ["get-me"],
    queryFn: async () => {
      const res = await api.get("/users/me");
      return res.data;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  return { user: data?.user as User, workspaces: data?.workspaces, isSuccess, isPending };
};

export default useGetMe;
