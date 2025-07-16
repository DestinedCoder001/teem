import UserRemoveAlert from "@/components/custom/UserRemoveAlert"
import WorkspaceSettings from "@/components/custom/WorkspaceSettings"

const Settings = () => {
  return (
    <div className="p-4 h-auto">
        <WorkspaceSettings />
        <UserRemoveAlert />
    </div>
  )
}

export default Settings