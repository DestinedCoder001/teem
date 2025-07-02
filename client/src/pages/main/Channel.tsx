import { currentWs, useUserWorkspaces } from "@/lib/store/uiStore";
import New from "./New";
import { toast } from "sonner";
import { useUserStore } from "@/lib/store/userStore";

const Channel = () => {
  const { workspaces } = useUserWorkspaces((state) => state);
  const { user } = useUserStore((state) => state);
  const { wsId, name } = currentWs((state) => state);

  if (!workspaces.length || !wsId) {
    toast.warning("You're not in a workspace")
    return <New />
  }

  return (
        <>
      <div>
        {user?.firstName} {user?.email} {user?.lastName} {user?.id} workspace {name}
      </div>
      <img src={user?.profilePicture} width={1000} height={1000} className="mt-[500px]" />
    </>
  );
};

export default Channel;
