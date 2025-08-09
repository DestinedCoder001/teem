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
      className="w-full border border-[#aaa] dark:border-slate-600 p-2 rounded-md text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
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
