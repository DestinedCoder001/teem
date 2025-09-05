import type { MeetingCardProps } from "@/lib/types";
import { Button } from "../ui/button";
import { currentWsDetails, useUserStore } from "@/lib/store/userStore";
import useDeleteMeeting from "@/lib/hooks/useDeleteMeeting";
import { Loader, PhoneOff, PhoneOutgoingIcon, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const MeetingCard = ({ title, host, _id, allowedUsers }: MeetingCardProps) => {
  const me = useUserStore((state) => state.user);
  const { createdBy, _id: wsId } = currentWsDetails((state) => state);
  const { mutate, isPending } = useDeleteMeeting();
  const handleWindowOpen = () => {
    const meetingUrl = "meeting/" + _id;
    window.open(meetingUrl);
  };
  const isHost = host._id === me?._id;
  const isWsOwner = me?._id === createdBy;
  const isAllowed =
    allowedUsers.map((m) => m._id).includes(me?._id as string) || isHost;

  const handleDelete = () => {
    if (isWsOwner || isHost) {
      mutate({ wsId, meetingId: _id });
    }
  };

  return (
    <div
      className="flex flex-col gap-y-4 justify-between bg-white dark:bg-neutral-900 rounded-xl border border-slate-300 dark:border-neutral-700 p-4 w-full mx-auto overflow-hidden"
      title={title}
    >
      <h2 className="text-lg font-semibold theme-text-gradient w-max truncate max-w-full">
        {title}
      </h2>
      <p className="text-slate-700 dark:text-slate-200 text-sm truncate">
        {isHost
          ? "You hosted this meeting"
          : <>Hosted by <span className="font-medium">{host?.firstName} {host?.lastName}</span></>}
      </p>
      <div className="flex items-center gap-2">
        {[host, ...allowedUsers].slice(0, 5).map((user, i) => (
          <>
          <Avatar className="size-8 rounded-full border border-slate-200 dark:border-neutral-600 relative">
            {i === 0 && <Star className="text-yellow-300 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 size-4 z-10 rounded-full" />}
            <AvatarImage
              className="object-cover object-center w-full"
              src={user?.profilePicture}
              alt={user?.firstName}
            />
            <AvatarFallback className="text-slate-600 dark:text-slate-100 font-medium text-sm">
              {user?.firstName[0]?.toUpperCase()}
              {user?.lastName[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          </>
        ))}
        {allowedUsers.length > 4 && (
          <div className="size-8 flex items-center justify-center text-slate-600 dark:text-slate-100 border border-slate-400 dark:border-neutral-500 rounded-full font-medium text-sm">
            {`+${allowedUsers.length - 4}`}
          </div>
        )}
      </div>
      <div className="flex gap-4">
        <Button
          disabled={isPending || !isAllowed}
          onClick={handleWindowOpen}
          className="rounded-md px-4 w-[4rem] bg-green-600 hover:bg-green-700 text-white"
        >
          <PhoneOutgoingIcon />
        </Button>
        {(isHost || isWsOwner) && (
          <Button
            disabled={isPending}
            onClick={handleDelete}
            className="rounded-md px-4 w-[4rem] bg-red-600 hover:bg-red-700 text-white"
          >
            {isPending ? <Loader className="animate-spin" /> : <PhoneOff />}
          </Button>
        )}
      </div>
    </div>
  );
};
export default MeetingCard;
