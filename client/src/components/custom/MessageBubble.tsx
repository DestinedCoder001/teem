import { currentWsDetails, useUserStore } from "@/lib/store/userStore";
import type { MessageProps } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatMessageTime } from "@/utils/formatMsgTime";
import Attachment from "./Attachment";
import { photoViewer, useEditingMessage } from "@/lib/store/uiStore";
import { useEffect, useState } from "react";
import useDeleteMessage from "@/lib/hooks/useDeleteMessage";
import { getSocket } from "@/lib/socket";
import useDeleteChatmsg from "@/lib/hooks/useDeleteChatMsg";
import { useParams } from "react-router-dom";
import MessageContextMenu from "./MessageContextMenu";
import ShimmerImage from "./ShimmerImage";
import { toast } from "sonner";

type MessageBubbleProps = {
  message: MessageProps;
  isChat?: boolean;
};

const MessageBubble = ({ message, isChat }: MessageBubbleProps) => {
  const [isDeleted, setIsDeleted] = useState(false);
  const [edited, setEdited] = useState(message.edited);
  const [msgContent, setMsgContent] = useState(message.content);
  const userId = useUserStore((state) => state.user?._id);
  const { setOpen } = photoViewer((state) => state);
  const { mutate: deleteMessage, isPending: isDeleting } = useDeleteMessage();
  const { mutate: deleteChatMsg, isPending: isChatDeleting } =
    useDeleteChatmsg();
  const { setEditing, setMessage } = useEditingMessage((state) => state);
  const senderNotAvailable = message.sender === null;
  const isSender = userId === message.sender?._id;
  const sentTime = formatMessageTime(message.createdAt);
  const extensions = ["pdf", "txt", "docx"];
  const isDoc = extensions
    .map((ext) => message.attachment.type === ext)
    .some(Boolean);
  const authSocket = getSocket()!;
  const disableDropdown = isDeleting || isChatDeleting;
  const { chatId } = useParams();
  const wsId = currentWsDetails.getState()._id;

  useEffect(() => {
    if (message.deleted) {
      setIsDeleted(true);
    }
  }, [message]);

  const handleCopy = () => {
    if (msgContent) navigator.clipboard.writeText(msgContent);
    toast("Text copied to clipboard", { position: "top-center" });
  };

  const handleEdit = () => {
    setEditing(true);
    if (isChat) {
      setMessage({
        _id: message._id,
        content: msgContent,
        chatId: message.chatId,
      });
    } else {
      setMessage({
        _id: message._id,
        content: msgContent,
        channel: message.channel,
      });
    }
  };

  const handleDelete = () => {
    if (isChat) {
      deleteChatMsg(
        { messageId: message._id },
        {
          onSuccess: () => {
            setIsDeleted(true);
            authSocket?.emit("delete_chat_message", {
              wsId,
              chatId,
              messageId: message._id,
            });
          },
        }
      );
    } else {
      deleteMessage(
        { messageId: message._id, channelId: message.channel! },
        {
          onSuccess: () => {
            setIsDeleted(true);
            authSocket?.emit("delete_message", message._id);
          },
        }
      );
    }
  };

  useEffect(() => {
    authSocket?.on("message_deleted", (messageId: string) => {
      if (messageId === message._id) {
        setIsDeleted(true);
      }
    });
    authSocket?.on("edited_message", (msg: MessageProps) => {
      if (message._id === msg._id) {
        setMsgContent(msg.content);
        setEdited(msg.edited);
      }
    });
    authSocket?.on(
      "edited_chat_message",
      (data: { wsId: string; chatId: string; message: MessageProps }) => {
        if (data.wsId !== wsId || data.chatId !== chatId) return;
        if (data.message._id === message._id) {
          setMsgContent(data.message.content);
          setEdited(data.message.edited);
        }
      }
    );
    authSocket?.on(
      "chat_message_deleted",
      (data: { wsId: string; chatId: string; messageId: string }) => {
        if (
          data.messageId === message._id &&
          data.chatId === chatId &&
          wsId === data.wsId
        ) {
          setIsDeleted(true);
        }
      }
    );
    return () => {
      authSocket?.off("edited_message");
      authSocket?.off("message_deleted");
      authSocket?.off("edited_chat_message");
      authSocket?.off("chat_message_deleted");
    };
  }, [authSocket, message._id, wsId, chatId]);

  if (senderNotAvailable) {
    return (
      <div className="flex justify-start">
        <div className="flex items-end gap-x-1 max-w-5/6 md:max-w-2/3 lg:max-w-1/2">
          <div
            className={`h-7 w-7 lg:h-6 lg:w-6 rounded-full font-bold sticky bottom-2 flex justify-center items-center bg-gray-200 text-gray-500 ${
              edited && !isDeleted ? "mb-9" : "mb-5"
            }`}
          >
            !
          </div>
          <div className="flex flex-col gap-y-1 items-start ">
            {message.attachment?.url &&
              !isDeleted &&
              (isDoc ? (
                !message.content && (
                  <MessageContextMenu
                    message={message}
                    isDeleting={disableDropdown}
                    handleCopy={handleCopy}
                    handleDelete={handleDelete}
                    handleEdit={handleEdit}
                  >
                    <Attachment
                      fileName={message.attachment.fileName}
                      type={message.attachment.type}
                      url={message.attachment.url}
                    />
                  </MessageContextMenu>
                )
              ) : (
                <MessageContextMenu
                  message={message}
                  isDeleting={disableDropdown}
                  handleCopy={handleCopy}
                  handleDelete={handleDelete}
                  handleEdit={handleEdit}
                >
                  <div
                    className="size-52 cursor-pointer"
                    onClick={() => setOpen(true, message.attachment.url)}
                  >
                    <ShimmerImage
                      src={message.attachment.url}
                      className="w-full h-full rounded-lg"
                    />
                  </div>
                </MessageContextMenu>
              ))}
            {message.content && !isDeleted && (
              <div className="px-4 py-2 text-[0.9rem] break-words relative rounded-t-lg rounded-br-lg border border-slate-300 dark:border-neutral-600 text-slate-700 dark:text-slate-200 dark:bg-neutral-900">
                {msgContent}
              </div>
            )}
            {isDeleted && (
              <div
                className={`px-4 py-2 text-[0.9rem] italic break-words border border-slate-300 dark:border-neutral-600 text-slate-600 dark:text-slate-200 ${
                  isSender
                    ? "rounded-t-lg rounded-bl-lg"
                    : "rounded-t-lg rounded-br-lg"
                }`}
              >
                This message was deleted
              </div>
            )}
            <span className="text-slate-500 text-[0.7rem] dark:text-slate-300">
              {sentTime}
            </span>
            {edited && !isDeleted && (
              <span className="text-slate-500 text-[0.7rem] dark:text-slate-300 -mt-1">
                Edited
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex items-end gap-x-1 max-w-5/6 md:max-w-2/3 lg:max-w-1/2 ${
          isSender ? "flex-row-reverse" : ""
        }`}
      >
        <Avatar
          className={`h-7 w-7 lg:h-6 lg:w-6 rounded-full border border-slate-200 sticky bottom-2 ${
            edited && !isDeleted ? "mb-9" : "mb-5"
          }`}
        >
          <AvatarImage
            className="object-cover object-center w-full"
            src={message.sender?.profilePicture}
            alt={message.sender?.firstName}
          />
          <AvatarFallback className="text-slate-600 dark:text-slate-100 font-medium text-sm">
            {message.sender?.firstName[0]?.toUpperCase()}
            {message.sender?.lastName[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div
          className={`flex flex-col gap-y-1 ${
            isSender ? "items-end" : "items-start"
          }`}
        >
          {message.attachment?.url &&
            !isDeleted &&
            (isDoc ? (
              <MessageContextMenu
                message={message}
                isDeleting={disableDropdown}
                handleCopy={handleCopy}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
              >
                <Attachment
                  fileName={message.attachment.fileName}
                  type={message.attachment.type}
                  url={message.attachment.url}
                />
              </MessageContextMenu>
            ) : (
              <MessageContextMenu
                message={message}
                isDeleting={disableDropdown}
                handleCopy={handleCopy}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
              >
                <div
                  className="size-52"
                  onClick={() => setOpen(true, message.attachment.url)}
                >
                  <ShimmerImage
                    className="rounded-lg w-full h-full"
                    src={message.attachment.url}
                  />
                </div>
              </MessageContextMenu>
            ))}

          {message.content && !isDeleted && (
            <MessageContextMenu
              message={message}
              isDeleting={disableDropdown}
              handleCopy={handleCopy}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
            >
              <div
                className={`px-4 py-2 text-base lg:text-[0.9rem] break-words select-none ${
                  isSender
                    ? "rounded-t-lg rounded-bl-lg bg-primary text-white"
                    : "rounded-t-lg rounded-br-lg border border-slate-300 dark:border-neutral-600 text-slate-700 dark:text-slate-200 dark:bg-neutral-900"
                }`}
              >
                {msgContent}
              </div>
            </MessageContextMenu>
          )}

          {isDeleted && (
            <div
              className={`px-4 py-2 lg:text-[0.9rem] italic break- border border-slate-300 dark:border-neutral-600 text-slate-600 dark:text-slate-200 select-none ${
                isSender
                  ? "rounded-t-lg rounded-bl-lg"
                  : "rounded-t-lg rounded-br-lg"
              }`}
            >
              This message was deleted
            </div>
          )}
          <span className="text-slate-500 text-[0.7rem] dark:text-slate-300">
            {sentTime}
          </span>
          {edited && !isDeleted && (
            <span className="text-slate-500 text-[0.7rem] dark:text-slate-300 -mt-1">
              Edited
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
