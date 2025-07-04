import { currentWs, useUserWorkspaces } from "@/lib/store/userStore";
import CreateNewWs from "./CreateNewWs";
import TaskCard from "@/components/custom/TaskCard";

const Tasks = () => {
  const { workspaces } = useUserWorkspaces((state) => state);
  const { wsId } = currentWs((state) => state);

  if (!workspaces.length || !wsId) {
    return <CreateNewWs />;
  }
  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
    {
      [1, 2, 3, 4].map((task) => <TaskCard key={task} />)
    }
  </div>;
};

export default Tasks;
