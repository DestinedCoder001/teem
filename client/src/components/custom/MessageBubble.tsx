import { useUserStore } from "@/lib/store/userStore";
import type { MessageProps } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatMessageTime } from "@/utils/formatMsgTime";

const MessageBubble = ({ message }: { message: MessageProps }) => {
  const userId = useUserStore((state) => state.user?._id);
  const isSender = userId === message.sender._id;
  const sentTime = formatMessageTime(message.createdAt);
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
        <div className={`flex flex-col gap-y-1 ${isSender ? "items-end" : "items-start"}`}>
          <div
            className={`px-4 py-2 text-[0.9rem] break-words ${
              isSender
                ? "rounded-t-lg rounded-bl-lg bg-primary text-white"
                : "rounded-t-lg rounded-br-lg border border-slate-300 text-slate-700"
            }`}
          >
            {message.content}
          </div>
          <span className="text-slate-500 text-[0.7rem]">{sentTime}</span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
