import { useCreateChannelDialogOpen } from "@/lib/store/uiStore";
import { Button } from "../ui/button";
import { currentWs, useUserWorkspaces } from "@/lib/store/userStore";

const CreateChannelBtn = () => {
  const { setOpen } = useCreateChannelDialogOpen((state) => state);
  const { wsId } = currentWs((state) => state);
    const { workspaces } = useUserWorkspaces((state) => state);

  return (
    <Button
      variant="ghost"
      className="w-full border border-[#aaa] p-2 rounded-md text-slate-600"
      onClick={() => {
        if (!wsId || !workspaces.length) return;
        setOpen(true);
      }}
    >
      Create
    </Button>
  );
};

export default CreateChannelBtn;
