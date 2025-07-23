import ChannelSkeleton from "@/components/custom/ChannelSkeleton";
import { currentChannelDetails } from "@/lib/store/userStore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import type { AxiosError } from "axios";
import ChannelNotFound from "@/components/custom/ChannelNotFound";
import AppError from "@/components/custom/AppError";
import useSendMessage from "@/lib/hooks/useSendMessage";
import useGetChannelDetails from "@/lib/hooks/useGetChannelDetails";
import MessageBubble from "@/components/custom/MessageBubble";
import type { MessageProps } from "@/lib/types";
import { Paperclip, SendHorizonal } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";

const Channel = () => {
  const { channelId } = useParams();
  const {
    name,
    setChannelDetails,
    _id: channelID,
    createdBy,
    members,
  } = currentChannelDetails((state) => state);
  const { mutate } = useSendMessage();
  const { data, isSuccess, isPending, error } = useGetChannelDetails(
    channelId as string
  );
  const [messagesList, setMessagesList] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (isSuccess) {
      const payload = {
        _id: data?.channel._id,
        name: data?.channel.name,
        description: data?.channel.description,
        members: data?.channel.members,
        createdBy: data?.channel.createdBy,
      };
      setChannelDetails(payload);
      setMessagesList(data?.messages);
    }
  }, [isSuccess, data, setChannelDetails]);

  const handleSendMessage = () => {
    mutate({ message: newMessage, channelId: channelID });
  };

  if (isPending) return <ChannelSkeleton />;

  if (error) {
    const err = error as AxiosError;
    if (err.status === 404) {
      return <ChannelNotFound />;
    }
    return <AppError />;
  }

  const parseMembers = () => {
    if (members.length === 0) return "";
    const names = members
      .sort((a, b) => {
        if (a._id === createdBy._id) return -1;
        if (b._id === createdBy._id) return 1;
        return 0;
      })
      .map((m) => `${m.firstName} ${m.lastName}`);
    if (members.length === 1) {
      return names[0];
    }
    if (members.length === 2) {
      return `${names[0]} and ${names[1]}`;
    }
    const othersCount = members.length - 2;
    return `${names[0]}, ${names[1]} and ${othersCount} ${
      othersCount === 1 ? "other" : "others"
    }`;
  };

  const membersList = parseMembers();

  return (
    <div className="h-[calc(100vh-50px)] overflow-hidden">
      <div className="flex flex-col relative h-full">
        <div className="p-4 border-b fixed top-[49px] w-full lg:w-[calc(100%-220px)] bg-white z-40">
          <h1 className="text-xl theme-text-gradient font-medium w-max">
            {name}
          </h1>
          <p className="text-xs text-slate-600 text-nowrap text-ellipsis">
            {membersList}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar pt-[120px] pb-[110px] px-4">
          {!isPending && messagesList.length > 0 && (
            <div className="flex flex-col gap-y-4">
              {messagesList.map((message: MessageProps) => (
                <MessageBubble message={message} key={message._id} />
              ))}
            </div>
          )}
        </div>

        <div className="p-4 bg-white/80 backdrop-blur-sm fixed bottom-0 w-full lg:w-[calc(100%-220px)] z-40">
          <div className="flex items-center space-x-4">
            <Tooltip>
              <TooltipTrigger>
                <Paperclip
                  size={20}
                  className="text-slate-500 shrink-0 cursor-pointer"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Attach files</p>
              </TooltipContent>
            </Tooltip>
            <Textarea
              cols={1}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              autoComplete="off"
              className="flex-1 rounded-lg resize-none"
            />
            <Button
              type="button"
              className="rounded-full size-10"
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              <SendHorizonal />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Channel;
