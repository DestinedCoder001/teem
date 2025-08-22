import { useQuery } from "@tanstack/react-query";
import api from "../axios";
import { currentWsDetails } from "../store/userStore";

const useGetMeetings = () => {
  const { _id } = currentWsDetails((state) => state);
  return useQuery({
    queryKey: ["get-meetings"],
    queryFn: async () => {
      const { data } = await api.get(`/${_id}/meetings/get-meetings`);
      return data.meetings;
    },
    enabled: !!_id,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export default useGetMeetings;
