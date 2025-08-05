import ChannelSkeleton from "@/components/custom/ChannelSkeleton";
import {
  currentChannelDetails,
  currentWsDetails,
  useUserStore,
} from "@/lib/store/userStore";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useParams } from "react-router-dom";
import type { AxiosError } from "axios";
import ChannelNotFound from "@/components/custom/ChannelNotFound";
import AppError from "@/components/custom/AppError";
import useSendMessage from "@/lib/hooks/useSendMessage";
import useGetChannelDetails from "@/lib/hooks/useGetChannelDetails";
import MessageBubble from "@/components/custom/MessageBubble";
import type { ChannelPayload, ChannelUser, MessageProps } from "@/lib/types";
import { getSocket } from "@/lib/socket";
import messageTone from "@/assets/incoming-msg.mp3";
import { useQueryClient } from "@tanstack/react-query";
import TypingIndicator from "@/components/custom/TypingIndicator";
import NoMessages from "@/components/custom/NoMessages";
import JoinChannel from "@/components/custom/JoinChannel";
import { parseMembers } from "@/utils/parseMembers";
import { useInView } from "react-intersection-observer";
import ChannelDrawer from "@/components/custom/ChannelDrawer";
import MessageInput from "@/components/custom/MessageInput";
import { ChevronDown } from "lucide-react";
import { useEditingMessage } from "@/lib/store/uiStore";

const Channel = () => {
  const { channelId } = useParams();
  const wsId = currentWsDetails.getState()._id;
  const {
    name,
    setChannelDetails,
    _id: channelID,
    members,
    description,
    createdBy,
  } = currentChannelDetails((state) => state);
  const channel: ChannelPayload = {
    name,
    _id: channelID,
    members,
    description,
    createdBy,
  };
  const [activeChannelUsers, setActiveChannelUsers] = useState<ChannelUser[]>(
    []
  );
  const [typingUsers, setTypingUsers] = useState<ChannelUser[]>([]);
  const { mutate, data: msg, isPending: isSending } = useSendMessage();
  const { setEditing } = useEditingMessage((state) => state);
  const { data, isSuccess, isPending, error } = useGetChannelDetails(
    channelId as string
  );
  const [messagesList, setMessagesList] = useState<MessageProps[]>([]);
  const [newMessage, setNewMessage] = useState({
    message: "",
    attachment: {
      type: "",
      url: "",
      fileName: "",
    },
  });
  const [isTyping, setIsTyping] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const authSocket = getSocket()!;
  const divRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { ref: inViewRef, inView: isNearBottom } = useInView({
    threshold: 0.1,
  });

  const queryClient = useQueryClient();

  const membersList = parseMembers({ members: activeChannelUsers });

  if (audioRef.current) {
    audioRef.current.volume = 0.1; // reduced volume to avoid scare lol
  }

  if (inputRef.current) {
    inputRef.current.onblur = () => setIsTyping(false);
  }

  const handleAutoScroll = () => {
    if (divRef.current) {
      divRef.current.scrollTo({
        top: divRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const user = useUserStore.getState().user?._id;
    const isMember = !!members.find((member) => member._id === user);
    if (user) {
      if (isMember) {
        setIsMember(true);
      }
    }
  }, [members]);

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

  useEffect(() => {
    if (authSocket && wsId && channelID && isMember) {
      const audio = audioRef.current;
      authSocket.emit("connect_channel", { wsId, id: channelID });

      const handleActiveUsers = (data: ChannelUser[]) => {
        setActiveChannelUsers(data);
      };

      const handleTypingUsers = (data: ChannelUser[]) => {
        setTypingUsers(data);
      };

      const handleSocketDisconnect = () => {
        authSocket.emit("stopped_typing", { wsId, id: channelID });
        authSocket.emit("disconnect_channel", { wsId, id: channelID });
      };

      const handleMessageSend = (data: MessageProps) => {
        if (data.channel !== channelId) return;
        if (audio) {
          audio.play();
        }
        setMessagesList((prev) => [...prev, { ...data }]);
      };

      const handleBeforeUnload = () => {
        authSocket.emit("disconnect_channel", { wsId, id: channelID });
      };

      authSocket.on("connect", () => {
        authSocket.emit("connect_channel", { wsId, id: channelID });
        queryClient.invalidateQueries({ queryKey: ["get-channel-details"] });
      });

      authSocket.on("active_channel_users", handleActiveUsers);
      authSocket.on("typing_users", handleTypingUsers);
      authSocket.on("new_message", handleMessageSend);

      authSocket.on("disconnect", handleSocketDisconnect);
      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        authSocket.emit("disconnect_channel", { wsId, id: channelID });
        authSocket.off("new_message", handleMessageSend);
        authSocket.off("active_channel_users", handleActiveUsers);
        audio?.pause();
        authSocket.off("disconnect", handleSocketDisconnect);
        window.removeEventListener("beforeunload", handleBeforeUnload);

        setActiveChannelUsers([]);
        setDrawerOpen(false);
        setNewMessage({
          message: "",
          attachment: { type: "", url: "", fileName: "" },
        });
        setEditing(false);
      };
    }
  }, [authSocket, channelID, wsId, setActiveChannelUsers, isMember]);

  useEffect(() => {
    if (msg) {
      setMessagesList((prev) => [...prev, { ...msg }]);
      if (authSocket) {
        authSocket.emit("send_message", { wsId, id: channelID, message: msg });
      }
    }
  }, [msg]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleAutoScroll();
    }, 50);
    // ensure all messagebubble components are rendered before scrolling.
    // Avoids messages not scrolling all the way to the bottom.
    return () => clearTimeout(timeout);
  }, [messagesList]);

  useEffect(() => {
    if (!isTyping) return;
    authSocket.emit("typing", { wsId, id: channelID });
    return () => {
      authSocket.emit("stopped_typing", { wsId, id: channelID });
    };
  }, [isTyping]);

  useEffect(() => {
    if (isNearBottom) {
      handleAutoScroll();
    }
  }, [typingUsers]);

  const handleSendMessage = () => {
    mutate({
      message: newMessage.message,
      channelId: channelID,
      attachment: newMessage.attachment,
    });
    setNewMessage({
      message: "",
      attachment: { type: "", url: "", fileName: "" },
    });
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNewMessage((prev) => ({ ...prev, message: val }));
    if (!val.trim().length) return;
    setIsTyping(true);
  };

  const handleOpenDrawer = () => {
    if (!isMember) return;
    setDrawerOpen(true);
  };

  if (isPending) return <ChannelSkeleton />;

  if (error) {
    const err = error as AxiosError;
    if (err.status === 404) {
      return <ChannelNotFound />;
    }
    return <AppError />;
  }

  return (
    <div className="h-[calc(100dvh-50px)] overflow-hidden">
      <div className="flex flex-col relative h-full">
        <div
          className="p-4 border-b fixed top-[49px] w-full lg:w-[calc(100%-220px)] bg-white/80 backdrop-blur-sm z-40 cursor-pointer"
          onClick={handleOpenDrawer}
        >
          <h1 className="text-xl theme-text-gradient font-medium w-max text-center mx-auto">
            {name}
          </h1>
          {activeChannelUsers.length > 0 && (
            <div className="flex items-center gap-x-1 justify-center">
              <p className="text-slate-600 text-xs flex items-center gap-x-0.5">
                <span className="text-sm font-medium text-secondary">
                  {activeChannelUsers.length}
                </span>{" "}
                active
              </p>
              <div className="size-1 bg-slate-600 rounded-full" />
              <p className="text-xs text-slate-600 text-nowrap text-ellipsis">
                {membersList}
              </p>
            </div>
          )}
          {isMember && (
            <p className="text-slate-600 text-xs text-center">
              Click to view details &raquo;
            </p>
          )}
        </div>

        <div
          ref={divRef}
          className="flex-1 overflow-y-auto no-scrollbar pt-[120px] pb-[90px] px-4"
        >
          <audio ref={audioRef} src={messageTone} controls className="hidden" />
          {!isPending && !messagesList.length && !typingUsers.length && (
            <NoMessages />
          )}
          {!isPending && (
            <div className="flex flex-col gap-y-4">
              {messagesList.length > 0 &&
                messagesList.map((message: MessageProps) => (
                  <MessageBubble message={message} key={message._id} />
                ))}
              <TypingIndicator users={typingUsers} />
              <div ref={inViewRef} className="h-0" />
            </div>
          )}
          <ChannelDrawer
            open={drawerOpen}
            setOpen={setDrawerOpen}
            activeUsers={activeChannelUsers}
            channel={channel}
          />
        </div>

        {!isNearBottom && (
          <div
            onClick={handleAutoScroll}
            className="bg-white/80 backdrop-blur-sm fixed bottom-[100px] border w-max left-1/2 lg:left-[60%] xl:left-[58%] -translate-x-1/2 rounded-full p-1 cursor-pointer"
          >
            <ChevronDown className="text-slate-600 translate-y-[0.08rem]" />
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-sm fixed bottom-0 w-full lg:w-[calc(100%-220px)] z-40">
          {isMember ? (
            <MessageInput
              message={newMessage}
              setMessage={setNewMessage}
              inputRef={inputRef}
              isSending={isSending}
              handleInputChange={handleInputChange}
              handleSendMessage={handleSendMessage}
              authSocket={authSocket}
            />
          ) : (
            <JoinChannel />
          )}
        </div>
      </div>
    </div>
  );
};

export default Channel;
