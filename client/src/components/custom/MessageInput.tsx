import { Loader, Paperclip, SendHorizonal, X } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useRef, type ChangeEvent, type RefObject } from "react";
import type { Socket } from "socket.io-client";
import { useAttachFile } from "@/lib/hooks/useAttachFile";
import { currentChannelDetails } from "@/lib/store/userStore";

type Props = {
  message: { message: string; attachment: { type: string; url: string } };
  setMessage: React.Dispatch<
    React.SetStateAction<{
      message: string;
      attachment: { type: string; url: string };
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
}: Props) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const channelName = currentChannelDetails((state) => state.name);
  const { mutate, isPending: attachPending } = useAttachFile();

  const handleAttachClick = () => {
    if (message.attachment.url) return;
    if (fileRef.current) {
      fileRef.current.click();
    }
  };

  const handleAttach = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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
                  type: data.format,
                  url: data.secure_url,
                },
              }));
              e.target.value = "";
            },
          }
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAttachment = () => {
    setMessage((prev) => ({
      ...prev,
      attachment: { type: "", url: "" },
    }));
  };

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
        <div className="absolute bottom-full left-4 size-28 rounded-md">
          <div
            className="absolute -top-2 -right-2 cursor-pointer bg-white rounded-full border p-1"
            onClick={handleRemoveAttachment}
          >
            <X size={12} className="text-slate-800" />
          </div>
          {message.attachment && (
            <img
              src={message.attachment.url}
              className="w-full h-full object-cover object-center rounded-sm"
            />
          )}
        </div>
      )}

      {attachPending ? (
        <Loader className="animate-spin text-slate-500" />
      ) : (
        <Paperclip
          onClick={handleAttachClick}
          size={20}
          className="text-slate-500 shrink-0 cursor-pointer"
        />
      )}

      <Textarea
        value={message.message}
        ref={inputRef}
        onChange={handleInputChange}
        placeholder="Type a message"
        autoComplete="off"
        className="flex-1 rounded-lg resize-none max-h-[60px]"
      />
      <Button
        type="button"
        className="rounded-full size-10"
        onClick={handleSendMessage}
        disabled={
          (!message.message.trim().length && !message.attachment.url) ||
          isSending ||
          !authSocket?.connected ||
          attachPending
        }
      >
        {isSending ? <Loader className="animate-spin" /> : <SendHorizonal />}
      </Button>
    </div>
  );
};

export default MessageInput;
