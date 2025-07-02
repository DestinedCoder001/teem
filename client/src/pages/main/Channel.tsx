import { useUserWorkspaces } from "@/lib/store/uiStore";
import New from "./New";
import { toast } from "sonner";
import { useUserStore } from "@/lib/store/userStore";

const Channel = () => {
  const { workspaces } = useUserWorkspaces((state) => state);
  const { user } = useUserStore((state) => state);
  if (!workspaces.length) {
    toast.warning("You're not in a workspace")
    return <New />
  }

  return (
        <>
      <div>
        {user?.firstName} {user?.email} {user?.lastName} {user?.id}
      </div>
      <img src={user?.profilePicture} width={1000} height={1000} className="mt-[500px]" />
    </>
  );
};

export default Channel;
