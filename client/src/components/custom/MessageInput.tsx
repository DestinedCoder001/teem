import { Loader, Paperclip, SendHorizonal, XIcon } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type RefObject,
} from "react";
import type { Socket } from "socket.io-client";
import { useAttachFile } from "@/lib/hooks/useAttachFile";
import { currentChannelDetails } from "@/lib/store/userStore";
import AttachmentPreview from "./AttachmentPreview";
import { useEditingMessage } from "@/lib/store/uiStore";
import useEditMessage from "@/lib/hooks/useEditMessage";
import useEditChatMsg from "@/lib/hooks/useEditChatMsg";

type Props = {
  isChat?: boolean;
  message: {
    message: string;
    attachment: { type: string; url: string; fileName: string };
  };
  setMessage: React.Dispatch<
    React.SetStateAction<{
      message: string;
      attachment: { type: string; url: string; fileName: string };
    }>
  >;
  inputRef: RefObject<HTMLTextAreaElement | null>;
  isSending: boolean;
  handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleSendMessage: () => void;
  authSocket: Socket | null;
};

const MessageInput = ({
  message,
  setMessage,
  inputRef,
  isSending,
  handleInputChange,
  handleSendMessage,
  authSocket,
  isChat,
}: Props) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const channelName = currentChannelDetails((state) => state.name);
  const {
    isEditing,
    message: msg,
    setMessage: setMsg,
    setEditing,
  } = useEditingMessage((state) => state);
  const [newEditingMessage, setNewEditingMessage] = useState({ value: "" });
  const { mutate, isPending: attachPending } = useAttachFile();
  const { mutate: edit, isPending: editPending } = useEditMessage();
  const { mutate: editChatMsg, isPending: editChatMsgPending } =
    useEditChatMsg();

  const handleMsgChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (isEditing) {
      setNewEditingMessage((prev) => ({ ...prev, value: val }));
    } else {
      handleInputChange(e);
    }
  };

  const handleAttachClick = () => {
    if (message.attachment.url || isEditing) return;
    if (fileRef.current) {
      fileRef.current.click();
    }
  };

  const handleAttach = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const extension = file?.name.split(".").pop()?.toLowerCase();
    const fileName = file?.name.split(".")[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        mutate(
          { file: reader.result as string, channelName },
          {
            onSuccess: (data) => {
              setMessage((prev) => ({
                ...prev,
                attachment: {
                  type: extension || data.format || "file",
                  url: data.secure_url,
                  fileName: fileName || "upload",
                },
              }));
            },
          }
        );
        e.target.value = "";
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAttachment = () => {
    setMessage((prev) => ({
      ...prev,
      attachment: { type: "", url: "", fileName: "" },
    }));
  };

  const handleMsgSend = () => {
    if (isEditing) {
      if (isChat) {
        editChatMsg({ messageId: msg._id, message: newEditingMessage.value });
      } else {
        edit({ messageId: msg._id, message: newEditingMessage.value });
      }
      setMsg({ _id: "", content: "", channel: "" });
      setNewEditingMessage({ value: "" });
      setEditing(false);
    } else {
      handleSendMessage();
    }
  };

  const cancelEditing = () => {
    setEditing(false);
    setMsg({ _id: "", content: "", channel: "" });
  };

  useEffect(() => {
    setNewEditingMessage({ value: msg.content });
    handleRemoveAttachment();
  }, [msg]);

  const sendingDisableConditions =
    (!message.message.trim().length &&
      !message.attachment.url &&
      (!newEditingMessage.value.trim().length ||
        newEditingMessage.value === msg.content)) ||
    isSending ||
    !authSocket?.connected ||
    attachPending;

  return (
    <div className="flex items-center space-x-4 p-4 relative">
      <input
        ref={fileRef}
        type="file"
        accept=".jpg,.jpeg,.png,.pdf,.txt,.docx"
        className="hidden"
        onChange={handleAttach}
      />
      {message.attachment.url && (
        <AttachmentPreview
          attachment={message.attachment}
          handleRemoveAttachment={handleRemoveAttachment}
        />
      )}
      {isEditing && (
        <div className="absolute bottom-full left-[3.3rem] w-max px-4 py-1 bg-white dark:bg-neutral-800 border border-slate-300 dark:border-slate-700 rounded-t-lg rounded-bl-lg text-sm max-w-52">
          <div
            className="absolute bottom-0 left-[110%] cursor-pointer bg-white dark:bg-neutral-700 rounded-full border p-1"
            onClick={cancelEditing}
          >
            <XIcon size={14} className="text-slate-800 dark:text-slate-300" />
          </div>
          <p className="theme-text-gradient w-max">Editing </p>
          <p className="font-medium text-slate-600 dark:text-slate-100 truncate">
            {msg.content}
          </p>
        </div>
      )}

      {attachPending ? (
        <Loader className="animate-spin text-slate-500 dark:text-slate-50 size-5" />
      ) : (
        <Paperclip
          size={20}
          className="text-slate-500 dark:text-slate-50 shrink-0 cursor-pointer"
          onClick={handleAttachClick}
        />
      )}

      <Textarea
        value={isEditing ? newEditingMessage.value : message.message}
        ref={inputRef}
        onChange={handleMsgChange}
        placeholder="Type a message"
        autoComplete="off"
        className="flex-1 rounded-lg resize-none max-h-[60px]"
      />
      <Button
        type="button"
        className="rounded-full size-10 dark:text-white"
        onClick={handleMsgSend}
        disabled={sendingDisableConditions}
      >
        {isSending || editPending || editChatMsgPending ? (
          <Loader className="animate-spin" />
        ) : (
          <SendHorizonal />
        )}
      </Button>
    </div>
  );
};

export default MessageInput;
