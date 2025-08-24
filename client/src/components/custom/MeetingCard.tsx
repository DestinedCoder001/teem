import type { MeetingCardProps } from "@/lib/types";
import { Button } from "../ui/button";
import { currentWsDetails, useUserStore } from "@/lib/store/userStore";
import useDeleteMeeting from "@/lib/hooks/useDeleteMeeting";
import { Loader } from "lucide-react";

const MeetingCard = ({
  title,
  ongoing,
  host,
  _id,
  allowedUsers,
}: MeetingCardProps) => {
  const me = useUserStore((state) => state.user);
  const { createdBy, _id: wsId } = currentWsDetails((state) => state);
  const { mutate, isPending } = useDeleteMeeting();
  const handleWindowOpen = () => {
    const meetingUrl = "meeting/" + _id;
    window.open(meetingUrl);
  };
  const isHost = host._id === me?._id;
  const isWsOwner = me?._id === createdBy;
  const isAllowed = allowedUsers.map((m) => m._id).includes(me?._id as string) || isHost;

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
      <h2 className="text-lg font-semibold theme-text-gradient w-max">
        {title?.length > 15 ? title.slice(0, 15) + "..." : title}
      </h2>
      <p className="text-slate-600 dark:text-slate-200">
        Status:{" "}
        <span className="font-medium">
          {ongoing ? "Ongoing" : "Meeting ended"}
        </span>
      </p>
      <p className="text-slate-600 dark:text-slate-200 text-sm truncate">
        {isHost
          ? "You hosted this meeting"
          : `Hosted by: ${host?.firstName} ${host?.lastName}`}
      </p>

      <div className="flex gap-4">
        <Button
          disabled={!ongoing || isPending || !isAllowed}
          onClick={handleWindowOpen}
          className="rounded-md px-4 w-[4rem] bg-green-600 hover:bg-green-700 text-white"
        >
          {isHost ? "Start" : "Join"}
        </Button>
        {(isHost || isWsOwner) && (
          <Button
            disabled={isPending}
            onClick={handleDelete}
            className="rounded-md px-4 w-[4rem] bg-red-600 hover:bg-red-700 text-white"
          >
            {isPending ? <Loader className="animate-spin" /> : "Delete"}
          </Button>
        )}
      </div>
    </div>
  );
};
export default MeetingCard;
