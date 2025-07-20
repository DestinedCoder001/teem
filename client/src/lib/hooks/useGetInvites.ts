import { useQuery } from "@tanstack/react-query";
import api from "../axios";

const useGetInvites = () => {
  return useQuery({
    queryKey: ["get-invites"],
    queryFn: async () => {
      const { data } = await api.get("/users/get-invites");
      return data.invites;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export default useGetInvites;