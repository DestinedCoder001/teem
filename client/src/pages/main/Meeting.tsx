import AppError from "@/components/custom/AppError";
import CreateMeetingDialog from "@/components/custom/CreateMeetDialog";
import MeetingCard from "@/components/custom/MeetingCard";
import MeetingLoading from "@/components/custom/MeetingsLoading";
import { Button } from "@/components/ui/button";
import useGetMeetings from "@/lib/hooks/useGetMeetings";
import { useCreateMeetingOpen } from "@/lib/store/uiStore";
import { currentWsDetails, useUserWorkspaces } from "@/lib/store/userStore";
import type { MeetingCardProps } from "@/lib/types";
import { useEffect, useState } from "react";

const Meeting = () => {
  const { workspaces } = useUserWorkspaces((state) => state);
  const { _id: wsId } = currentWsDetails((state) => state);
  const { setOpen } = useCreateMeetingOpen((state) => state);
  const [meetings, setMeetings] = useState<MeetingCardProps[]>([]);

  const { data, isSuccess, isPending, error } = useGetMeetings();

  useEffect(() => {
    if (isSuccess) {
      setMeetings(data);
    }
  }, [isSuccess, setMeetings, data]);

  if (wsId && isPending) {
    return <MeetingLoading />;
  }

  if (error) {
    return <AppError />;
  }

  return (
    <div className="h-full p-4">
      {!isPending && isSuccess && (
        <div className="flex gap-x-4 justify-end">
          <Button
            onClick={() => setOpen(true)}
            variant="ghost"
            disabled={!wsId || !workspaces.length}
            className="border border-[#aaa] dark:border-neutral-700 px-4 py-2 rounded-lg text-md theme-text-gradient"
          >
            New Meeting
          </Button>
        </div>
      )}

      {meetings?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
          {meetings?.map((meeting) => (
            <MeetingCard
              allowedUsers={meeting.allowedUsers}
              _id={meeting._id}
              key={meeting._id}
              title={meeting.title}
              host={meeting.host}
            />
          ))}
        </div>
      ) : isSuccess ? (
        <div className="text-center text-slate-600 dark:text-slate-100 h-[calc(100dvh-200px)] w-full flex justify-center items-center">
          No meetings found
        </div>
      ) : null}

      <CreateMeetingDialog />
    </div>
  );
};

export default Meeting;
