import UserRemoveAlert from "@/components/custom/UserRemoveAlert";
import WorkspaceSettings from "@/components/custom/WorkspaceSettings";
import WsDeleteAlert from "@/components/custom/WsDeleteAlert";

const Settings = () => {
  return (
    <div className="p-4 h-auto">
      <WorkspaceSettings />
      <UserRemoveAlert />
      <WsDeleteAlert />
    </div>
  );
};

export default Settings;
