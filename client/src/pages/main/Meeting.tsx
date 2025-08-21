import CreateMeetingDialog from "@/components/custom/CreateMeetDialog";
import { Button } from "@/components/ui/button";
import { useCreateMeetingOpen } from "@/lib/store/uiStore";
import { currentWsDetails, useUserWorkspaces } from "@/lib/store/userStore";

const Meeting = () => {
  const { workspaces } = useUserWorkspaces((state) => state);
  const { _id: wsId } = currentWsDetails((state) => state);
    const { setOpen } = useCreateMeetingOpen((state) => state);

  return (
    <div className="h-full p-4">
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
      <CreateMeetingDialog />
    </div>
  );
};

export default Meeting;
