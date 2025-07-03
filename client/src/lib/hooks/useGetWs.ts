import { useQuery } from "@tanstack/react-query";
import api from "../axios";

const useGetWs = () => {
  const { data: wsData, isSuccess: getWsSuccess } = useQuery({
    queryKey: ["get-user-ws"],
    queryFn: async () => {
      const res = await api.get("/workspaces");
      return res.data?.data;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
  return { wsData, getWsSuccess };
};

export default useGetWs;
