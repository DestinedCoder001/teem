import ChannelSkeleton from "@/components/custom/ChannelSkeleton";
import api from "@/lib/axios";
import useGetWsDetails from "@/lib/hooks/useGetWsDetails";
import { currentChannelDetails, currentWs } from "@/lib/store/userStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { AxiosError } from "axios";
import ChannelNotFound from "@/components/custom/ChannelNotFound";
import AppError from "@/components/custom/AppError";

const Channel = () => {
  const { wsId } = currentWs((state) => state);
  const { getCurrentWsSuccess } = useGetWsDetails();
  const { channelId } = useParams();
  const { name, setChannelDetails } = currentChannelDetails((state) => state);

  const { data, isSuccess, isFetching, error } = useQuery({
    queryKey: ["get-channel-details", channelId],
    queryFn: async () => {
      const { data } = await api.get(`/${wsId}/channels/${channelId}/`);
      return data;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (getCurrentWsSuccess && isSuccess) {
      const payload = {
        name: data?.data.name,
        description: data?.data.description,
      };
      setChannelDetails(payload);
    }
  }, [getCurrentWsSuccess, isSuccess, data, setChannelDetails]);

  if (isFetching) return <ChannelSkeleton />;

  if (error) {
    const err = error as AxiosError;
    if (err.status === 404) {
      return <ChannelNotFound />;
    }
    return <AppError />;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h1 className="text-xl text-slate-600 font-medium w-max">{name}</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        <div className="flex items-start space-x-3">
          <div className="h-10 w-10 rounded-full bg-gray-200" />
          <div className="space-y-2">
            <div className="h-4 w-64 rounded-full bg-gray-200" />
            <div className="h-4 w-40 rounded-full bg-gray-200" />
          </div>
        </div>

        <div className="flex items-start justify-end space-x-3">
          <div className="space-y-2 text-right">
            <div className="h-4 w-64 rounded-full bg-gray-200 ml-auto" />
            <div className="h-4 w-40 rounded-full bg-gray-200 ml-auto" />
          </div>
          <div className="h-10 w-10 rounded-full bg-gray-200" />
        </div>

        <div className="flex items-start space-x-3">
          <div className="h-10 w-10 rounded-full bg-gray-200" />
          <div className="space-y-2">
            <div className="h-4 w-56 rounded-full bg-gray-200" />
            <div className="h-4 w-36 rounded-full bg-gray-200" />
          </div>
        </div>

        <div className="flex items-start justify-end space-x-3">
          <div className="space-y-2 text-right">
            <div className="h-4 w-64 rounded-full bg-gray-200 ml-auto" />
            <div className="h-4 w-40 rounded-full bg-gray-200 ml-auto" />
          </div>
          <div className="h-10 w-10 rounded-full bg-gray-200" />
        </div>

        <div className="flex items-start space-x-3">
          <div className="h-10 w-10 rounded-full bg-gray-200" />
          <div className="space-y-2">
            <div className="h-4 w-56 rounded-full bg-gray-200" />
            <div className="h-4 w-36 rounded-full bg-gray-200" />
          </div>
        </div>
      </div>

      <div className="p-4 border-t bg-white/80 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <Input placeholder="Type a message..." className="flex-1" />
          <Button type="button">Send</Button>
        </div>
      </div>
    </div>
  );
};

export default Channel;
