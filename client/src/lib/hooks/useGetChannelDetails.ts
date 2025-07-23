import { useQuery } from "@tanstack/react-query";
import api from "../axios";
import { currentWsDetails } from "../store/userStore";

const useGetChannelDetails = (channelId: string) => {
  const wsId = currentWsDetails((state) => state._id);


  return useQuery({
    queryKey: ["get-channel-details", channelId],
    queryFn: async () => {
      const { data } = await api.get(`/${wsId}/channels/${channelId}`);
      return data;
    },
    enabled: !!wsId,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export default useGetChannelDetails;
