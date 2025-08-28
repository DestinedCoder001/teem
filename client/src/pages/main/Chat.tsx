import ChannelSkeleton from "@/components/custom/ChannelSkeleton";
import { currentWsDetails, useUserStore } from "@/lib/store/userStore";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useParams } from "react-router-dom";
import type { MessageProps, User } from "@/lib/types";
import { getSocket } from "@/lib/socket";
import messageTone from "@/assets/incoming-msg.mp3";
import { useInView } from "react-intersection-observer";
import MessageInput from "@/components/custom/MessageInput";
import { ChevronDown } from "lucide-react";
import { useActiveUsers, useSidebarOpen } from "@/lib/store/uiStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useGetChat from "@/lib/hooks/useGetChat";
import useSendChat from "@/lib/hooks/useSendChat";
import MessageBubble from "@/components/custom/MessageBubble";
import NoMessages from "@/components/custom/NoMessages";
import type { AxiosError } from "axios";
import NotFound from "@/components/custom/NotFound";
import AppError from "@/components/custom/AppError";
import TypingIndicator from "@/components/custom/TypingIndicator";
import MessagesTip from "@/components/custom/MessagesTip";

const Chat = () => {
  const { chatId } = useParams();
  const wsId = currentWsDetails.getState()._id;
  const isSidebarOpen = useSidebarOpen((state) => state.isOpen);
  const [messagesList, setMessagesList] = useState<MessageProps[]>([]);
  const [newMessage, setNewMessage] = useState({
    message: "",
    attachment: {
      type: "",
      url: "",
      fileName: "",
    },
  });
  const [currentChat, setCurrentChat] = useState<User>();
  const [isTyping, setIsTyping] = useState(false);
  const [isRecieverTyping, setIsRecieverTyping] = useState(false);
  const { activeUsers } = useActiveUsers((state) => state);
  const { users: wsUsers } = currentWsDetails((state) => state);
  const me = useUserStore((state) => state.user);
  const { isSuccess, data, isPending, error } = useGetChat(chatId as string);
  const { mutate: sendChat, data: msg, isPending: isSending } = useSendChat();
  const authSocket = getSocket()!;
  const divRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { ref: inViewRef, inView: isNearBottom } = useInView({
    threshold: 0.1,
  });

  if (audioRef.current) {
    audioRef.current.volume = 0.1; // reduced volume to avoid scare lol
  }

  if (inputRef.current) {
    inputRef.current.onblur = () => setIsTyping(false);
  }

  const wsIdRef = useRef(wsId);
  useEffect(() => {
    // make ws id available before unload
    wsIdRef.current = wsId;
  }, [wsId]);

  const handleAutoScroll = () => {
    if (divRef.current) {
      divRef.current.scrollTo({
        top: divRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setMessagesList(data);
    }
  }, [chatId, isSuccess, data]);

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
    authSocket?.emit("chat_typing", { chatId, wsid: wsId });
    return () => {
      authSocket?.emit("chat_stopped_typing", { chatId, wsid: wsId });
    };
  }, [isTyping]);

  useEffect(() => {
    const arr = chatId?.split("-");
    const receiverId = arr?.filter((item) => item !== me?._id);
    const receiverData = wsUsers.find((user) => user._id === receiverId![0]);
    if (receiverData) {
      setCurrentChat(receiverData);
    }
    return () => {
      setCurrentChat(undefined);
    };
  }, [chatId, wsUsers, me]);

  useEffect(() => {
    if (authSocket && wsId && chatId) {
      const audio = audioRef.current;

      const handleReceiverTyping = (data: {
        isTyping: boolean;
        wsId: string;
        chatId: string;
      }) => {
        if (wsId !== data.wsId || chatId !== data.chatId) return;
        setIsRecieverTyping(data.isTyping);
      };

      const handleSocketDisconnect = () => {
        authSocket?.emit("chat_stopped_typing", {
          chatId,
          wsid: wsIdRef.current,
        });
      };

      const handleBeforeUnload = () => {
        authSocket?.emit("chat_stopped_typing", {
          chatId,
          wsid: wsIdRef.current,
        });
      };

      const handleNewMessage = (data: {
        wsId: string;
        chatId: string;
        message: MessageProps;
      }) => {
        if (data.wsId !== wsId || data.chatId !== chatId) return;
        if (audio) {
          audio.play();
        }
        setMessagesList((prev) => [...prev, { ...data.message }]);
      };

      authSocket?.on("receiver_typing", handleReceiverTyping);
      authSocket?.on("new_chat_message", handleNewMessage);
      authSocket?.on("disconnect", handleSocketDisconnect);
      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        authSocket?.emit("chat_stopped_typing", {
          chatId,
          wsid: wsIdRef.current,
        });
        authSocket?.off("new_chat_message", handleNewMessage);
        authSocket?.off("receiver_typing", handleReceiverTyping);
        authSocket?.off("disconnect", handleSocketDisconnect);
        window.removeEventListener("beforeunload", handleBeforeUnload);

        setNewMessage({
          message: "",
          attachment: { type: "", url: "", fileName: "" },
        });
      };
    }
  }, [authSocket, chatId, wsId]);

  useEffect(() => {
    if (msg) {
      setMessagesList((prev) => [...prev, { ...msg }]);
      if (authSocket) {
        authSocket?.emit("send_chat_message", { wsId, chatId, msg });
      }
    }
  }, [msg]);

  useEffect(() => {
    if (isNearBottom && isRecieverTyping) {
      handleAutoScroll();
    }
  }, [isRecieverTyping]);

  const handleSendMessage = () => {
    if (!currentChat) return;
    sendChat({
      message: newMessage.message,
      attachment: newMessage.attachment,
      receiverId: currentChat._id,
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

  if (isPending) return <ChannelSkeleton />;

  if (error) {
    const err = error as AxiosError;
    if (err.status === 404) {
      return <NotFound text="Chat not found" />;
    }
    return <AppError />;
  }

  console.log(currentChat);

  return (
    <>
      <MessagesTip />
      <div className="h-[calc(100dvh-50px)] overflow-hidden">
        <div className="flex flex-col relative h-full">
          <div
            className={`p-4 border-b dark:border-neutral-700 fixed top-[49px] w-full lg:transition-[width] duration-300 ${
              isSidebarOpen
                ? "lg:w-[calc(100%-220px)]"
                : "lg:w-[calc(100%-4.5rem)]"
            } bg-white/80 dark:bg-black/80 backdrop-blur-sm z-40`}
          >
            {currentChat ? (
              <div className="flex items-center gap-x-4 w-max mx-auto">
                <Avatar
                  className={`size-8 rounded-full border border-slate-200 dark:border-neutral-600 ${
                    activeUsers.includes(currentChat._id)
                      ? "ring ring-secondary"
                      : ""
                  }`}
                >
                  <AvatarImage
                    className="object-cover object-center w-full"
                    src={currentChat?.profilePicture}
                    alt={currentChat?.firstName}
                  />
                  <AvatarFallback className="text-slate-600 dark:text-slate-100 font-medium text-sm">
                    {currentChat?.firstName[0]?.toUpperCase()}
                    {currentChat?.lastName[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h1 className="text-xl theme-text-gradient font-medium w-max text-center mx-auto">
                  {currentChat?.firstName + " " + currentChat?.lastName}
                </h1>
              </div>
            ) : (
              <div className="flex items-center gap-x-4 w-max mx-auto">
                <div className="size-8 lg:h-6 lg:w-6 rounded-full font-bold sticky bottom-2 flex justify-center items-center bg-gray-200 text-gray-500">
                  !
                </div>
                <h1>User unavailable</h1>
              </div>
            )}
          </div>

          <div
            ref={divRef}
            className="flex-1 overflow-y-auto no-scrollbar pt-[120px] pb-[90px] px-4"
          >
            <audio
              ref={audioRef}
              src={messageTone}
              controls
              className="hidden"
            />

            {!isPending && !messagesList.length && !isRecieverTyping && (
              <NoMessages />
            )}
            {!isPending && (
              <div className="flex flex-col gap-y-4">
                {messagesList.length > 0 &&
                  messagesList.map((message: MessageProps) => (
                    <MessageBubble message={message} key={message._id} isChat />
                  ))}
                {isRecieverTyping && currentChat && (
                  <TypingIndicator
                    users={[
                      {
                        _id: currentChat._id,
                        firstName: currentChat.firstName,
                        lastName: currentChat.lastName,
                        profilePicture: currentChat.profilePicture,
                      },
                    ]}
                  />
                )}
                <div ref={inViewRef} className="h-0" />
              </div>
            )}
          </div>

          {!isNearBottom && (
            <div
              onClick={handleAutoScroll}
              className={`bg-white/80 dark:bg-black/60 backdrop-blur-sm fixed bottom-[100px] border w-max left-1/2 lg:transition-transform lg:duration-300 ${
                isSidebarOpen ? "lg:translate-x-[110px]" : "lg:translate-x-0"
              } -translate-x-1/2 rounded-full p-1 cursor-pointer`}
            >
              <ChevronDown strokeWidth={1.5} className="text-slate-600 dark:text-slate-100 translate-y-[0.08rem]" />
            </div>
          )}

          <div
            className={`bg-white/80 dark:bg-black/80 backdrop-blur-sm dark:border-t fixed -bottom-1 w-full lg:transition-[width] duration-300 ${
              isSidebarOpen
                ? "lg:w-[calc(100%-220px)]"
                : "lg:w-[calc(100%-4.5rem)]"
            } z-40`}
          >
            <MessageInput
              message={newMessage}
              setMessage={setNewMessage}
              inputRef={inputRef}
              isSending={isSending}
              handleInputChange={handleInputChange}
              handleSendMessage={handleSendMessage}
              authSocket={authSocket}
              isChat
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
