import { currentWs, useUserWorkspaces } from "@/lib/store/uiStore";
import { toast } from "sonner";
import New from "./New";

const DMs = () => {
  const { workspaces } = useUserWorkspaces((state) => state);
  const { wsId } = currentWs((state) => state);

  if (!workspaces.length || !wsId) {
    toast.warning("You're not in a workspace");
    return <New />;
  }
  return <div>DMs</div>;
};
export default DMs;
