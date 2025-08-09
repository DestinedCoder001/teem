import SendInviteDialog from "@/components/custom/SendInviteDialog";
import ThemeToggle from "@/components/custom/ThemeToggle";
import UserRemoveAlert from "@/components/custom/UserRemoveAlert";
import WorkspaceSettings from "@/components/custom/WorkspaceSettings";
import WsDeleteAlert from "@/components/custom/WsDeleteAlert";

const Settings = () => {
  return (
    <div className="p-4 h-auto">
      <WorkspaceSettings />
      <ThemeToggle />
      <UserRemoveAlert />
      <WsDeleteAlert />
      <SendInviteDialog />
    </div>
  );
};

export default Settings;
