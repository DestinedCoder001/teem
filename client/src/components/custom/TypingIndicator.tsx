import { useUserStore } from "@/lib/store/userStore";
import type { ChannelUser } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const TypingIndicator = ({ users }: { users: ChannelUser[] }) => {
  const user = useUserStore((state) => state.user);
  const excludeMe = users.filter((u) => u._id !== user?._id);
  // const images = excludeMe.map((u) => u.profilePicture);
  let usersMap = [];
  if (excludeMe.length > 4) {
    usersMap = excludeMe.slice(-4);
  } else {
    usersMap = excludeMe;
  }
  if (!usersMap.length) return null;
  return (
    <div className="flex">
      <div className="flex items-end gap-x-1">
        {excludeMe.length >= 4 && (
          <div className="h-7 w-7 lg:h-6 lg:w-6 rounded-full bg-slate-400 text-white font-bold text-xs flex justify-center items-center">
            {excludeMe.length - 4}
          </div>
        )}
        <div className="flex -space-x-2 items-center opacity-50">
          {usersMap.map((user, index) => (
            <Avatar
              key={index}
              className="h-7 w-7 lg:h-6 lg:w-6 rounded-full border border-slate-200"
            >
              <AvatarImage
                className="object-cover object-center w-full"
                src={user.profilePicture}
                alt={user?.firstName}
              />
              <AvatarFallback className="text-slate-600 font-medium text-sm">
                {user?.firstName[0]?.toUpperCase()}
                {user?.lastName[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
        <div className="flex gap-x-1 px-4 py-2 rounded-t-lg rounded-br-lg border border-slate-300 opacity-50">
          <span className="block size-3 rounded-full bg-slate-500 animate-pulse" />
          <span className="block size-3 rounded-full bg-slate-500 animate-pulse" />
          <span className="block size-3 rounded-full bg-slate-500 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
