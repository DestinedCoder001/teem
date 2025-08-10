import DeleteAccountDialog from "@/components/custom/DeleteAccountDialog";
import SendInviteDialog from "@/components/custom/SendInviteDialog";
import ThemeToggle from "@/components/custom/ThemeToggle";
import UserRemoveAlert from "@/components/custom/UserRemoveAlert";
import WorkspaceSettings from "@/components/custom/WorkspaceSettings";
import WsDeleteAlert from "@/components/custom/WsDeleteAlert";
import { Button } from "@/components/ui/button";
import { useDeleteAccountOpen } from "@/lib/store/uiStore";
import { Trash2 } from "lucide-react";

const Settings = () => {
  const { setOpen } = useDeleteAccountOpen((state) => state);
  return (
    <div className="p-4 h-auto">
      <WorkspaceSettings />
      <ThemeToggle />
      <section className="space-y-4 mt-8">
        <div>
          <h3 className="text-xl font-medium">Delete Account</h3>
          <p className="text-slate-600 dark:text-slate-200 my-1 text-sm">
            Permanently remove your account and all associated data.
          </p>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-slate-300 dark:border-neutral-700 p-4">
          <div className="flex items-center gap-3">
            <Trash2 className="h-6 w-6 text-destructive" />
            <span>Delete Account</span>
          </div>
          <Button
            variant="destructive"
            className="min-w-[4rem] dark:bg-red-500"
            onClick={() => setOpen(true)}
          >
            Delete
          </Button>
        </div>
      </section>
      <UserRemoveAlert />
      <WsDeleteAlert />
      <SendInviteDialog />
      <DeleteAccountDialog />
    </div>
  );
};

export default Settings;
