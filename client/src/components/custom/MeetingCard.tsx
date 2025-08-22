import type { MeetingCardProps } from "@/lib/types";
import { Button } from "../ui/button";
import { Phone, Trash } from "lucide-react";
import { useUserStore } from "@/lib/store/userStore";

const MeetingCard = ({ title, ongoing, host, _id }: MeetingCardProps) => {
  const me = useUserStore((state) => state.user);
  const handleWindowOpen = () => {
    const meetingUrl = "meeting/" + _id;
    window.open(meetingUrl)
  }
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
        Hosted by: {host?.firstName} {host?.lastName}
      </p>

      <div className="flex gap-4">
        <Button
          disabled={!ongoing}
          onClick={handleWindowOpen}
          className="rounded-md px-4 w-[4rem] bg-green-600 hover:bg-green-700 text-white"
          title="Join Call"
        >
          <Phone className="rotate-135" />
        </Button>
        {host._id === me?._id && (
          <Button
            className="rounded-md px-4 w-[4rem] bg-red-600 hover:bg-red-700 text-white"
            title="Delete"
          >
            <Trash />
          </Button>
        )}
      </div>
    </div>
  );
};
export default MeetingCard;
