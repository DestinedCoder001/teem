import { currentWs, useUserWorkspaces } from "@/lib/store/userStore";
import CreateNewWs from "./CreateNewWs";

const DMs = () => {
  const { workspaces } = useUserWorkspaces((state) => state);
  const { wsId } = currentWs((state) => state);

  if (!workspaces.length || !wsId) {
    return <CreateNewWs />;
  }
  return <div>DMs</div>;
};
export default DMs;
