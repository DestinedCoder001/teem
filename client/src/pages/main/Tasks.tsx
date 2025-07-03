import { currentWs, useUserWorkspaces } from "@/lib/store/userStore";
import CreateNewWs from "./CreateNewWs";

const Tasks = () => {
  const { workspaces } = useUserWorkspaces((state) => state);
  const { wsId } = currentWs((state) => state);

  if (!workspaces.length || !wsId) {
    return <CreateNewWs />;
  }
  return <div>Hello Tasks</div>;
};

export default Tasks;
