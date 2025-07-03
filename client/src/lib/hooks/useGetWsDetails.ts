import { useQuery } from "@tanstack/react-query";
import api from "../axios";
import { currentWs } from "../store/userStore";

const useGetWsDetails = () => {
  const { wsId } = currentWs((state) => state);
  const { data: currentWsData, isSuccess: getCurrentWsSuccess, isPending } = useQuery({
    queryKey: ["get-ws-details"],
    queryFn: async () => {
      const res = await api.get(`/workspaces/${wsId}`);
      return res.data?.data;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
  return { currentWsData, getCurrentWsSuccess, isPending };
};

export default useGetWsDetails;
