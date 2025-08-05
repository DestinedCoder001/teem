import { useUserStore } from "@/lib/store/userStore";
import type { MessageProps } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatMessageTime } from "@/utils/formatMsgTime";
import Attachment from "./Attachment";
import { photoViewer, useEditingMessage } from "@/lib/store/uiStore";
import { MoreVertical, PenLine, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useEffect, useState } from "react";
import useDeleteMessage from "@/lib/hooks/useDeleteMessage";
import { getSocket } from "@/lib/socket";

const MessageBubble = ({ message }: { message: MessageProps }) => {
  const [isDeleted, setIsDeleted] = useState(false);
  const [edited, setEdited] = useState(message.edited);
  const [msgContent, setMsgContent] = useState(message.content);
  const userId = useUserStore((state) => state.user?._id);
  const { setOpen } = photoViewer((state) => state);
  const { mutate: deleteMessage, isPending: isDeleting } = useDeleteMessage();
  const { setEditing, setMessage } = useEditingMessage((state) => state);
  const [editOpen, setEditOpen] = useState(false);
  const isSender = userId === message.sender._id;
  const sentTime = formatMessageTime(message.createdAt);
  const extensions = ["pdf", "txt", "docx"];
  const isDoc = extensions
    .map((ext) => message.attachment.type === ext)
    .some(Boolean);
  const authSocket = getSocket()!;

  useEffect(() => {
    if (message.deleted) {
      setIsDeleted(true);
    }
  }, [message]);

  const handleEdit = () => {
    setEditing(true);
    setMessage({
      _id: message._id,
      content: msgContent,
      channel: message.channel,
    });
  };

  const handleDelete = () => {
    deleteMessage(
      { messageId: message._id, channelId: message.channel },
      {
        onSuccess: () => {
          setIsDeleted(true);
          authSocket.emit("delete_message", message._id);
        },
      }
    );
  };

  useEffect(() => {
    authSocket.on("message_deleted", (messageId: string) => {
      if (messageId === message._id) {
        setIsDeleted(true);
      }
    });
    authSocket.on("edited_message", (msg: MessageProps) => {
      if (message._id === msg._id) {
        setMsgContent(msg.content);
        setEdited(msg.edited);
      }
    });
    return () => {
      authSocket.off("edited_message");
      authSocket.off("message_deleted");
    };
  }, [authSocket, message._id]);

  return (
    <div className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex items-end gap-x-1 max-w-5/6 md:max-w-2/3 lg:max-w-1/2 ${
          isSender ? "flex-row-reverse" : ""
        }`}
      >
        <Avatar className="h-7 w-7 lg:h-6 lg:w-6 rounded-full border border-slate-200 sticky bottom-2 mb-5">
          <AvatarImage
            className="object-cover object-center w-full"
            src={message.sender?.profilePicture}
            alt={message.sender?.firstName}
          />
          <AvatarFallback className="text-slate-600 font-medium text-sm">
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
              <Attachment
                fileName={message.attachment.fileName}
                type={message.attachment.type}
                url={message.attachment.url}
              />
            ) : (
              <div
                className="size-52 rounded-lg overflow-hidden cursor-pointer"
                onClick={() => setOpen(true, message.attachment.url)}
              >
                <img
                  src={message.attachment.url}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            ))}
          {message.content && !isDeleted && (
            <div
              className={`px-4 py-2 text-[0.9rem] break-words relative ${
                isSender
                  ? "rounded-t-lg rounded-bl-lg bg-primary text-white"
                  : "rounded-t-lg rounded-br-lg border border-slate-300 text-slate-700"
              }`}
            >
              {!isDeleted && message.sender._id === userId && (
                <DropdownMenu open={editOpen} onOpenChange={setEditOpen}>
                  <DropdownMenuTrigger asChild disabled={isDeleting}>
                    <MoreVertical className="absolute text-slate-500 hover:bg-slate-50 hover:border rounded-full p-1 size-6 cursor-pointer top-1/2 -translate-y-1/2 -left-7" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    onClick={(e) => e.stopPropagation()}
                    className="z-50 bg-white/90 backdrop-blur-sm"
                  >
                    {message.content && (
                      <>
                        <DropdownMenuItem
                          className="cursor-pointer group py-1"
                          onClick={handleEdit}
                        >
                          <PenLine className="mr-2 h-4 w-4 group-hover:text-primary group-focus:text-primary" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem
                      className="cursor-pointer group py-1"
                      onClick={handleDelete}
                    >
                      <Trash2 className="mr-2 h-4 w-4 group-hover:text-red-500 group-focus:text-red-500" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              {msgContent}
            </div>
          )}
          {isDeleted && (
            <div
              className={`px-4 py-2 text-[0.9rem] italic break-words  border border-slate-300 text-slate-600 ${
                isSender
                  ? "rounded-t-lg rounded-bl-lg"
                  : "rounded-t-lg rounded-br-lg"
              }`}
            >
              This message was deleted
            </div>
          )}
          <span className="text-slate-500 text-[0.7rem]">{sentTime}</span>
          {edited && !isDeleted && (
            <span className="text-slate-500 text-[0.7rem] -mt-1">Edited</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
