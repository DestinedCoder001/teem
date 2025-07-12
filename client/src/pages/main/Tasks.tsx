import {
  currentWs,
  useUserTasks,
  useUserWorkspaces,
} from "@/lib/store/userStore";
import TaskCard from "@/components/custom/TaskCard";
import { Button } from "@/components/ui/button";
import { useCreateTaskDialogOpen } from "@/lib/store/uiStore";
import CreateTaskDialog from "@/components/custom/CreateTaskDialog";
import { useEffect } from "react";
import useGetWsDetails from "@/lib/hooks/useGetWsDetails";
import useGetTasks from "@/lib/hooks/useGetTasks";
import TasksLoading from "@/components/custom/TasksLoading";
import EditTaskDialog from "@/components/custom/EditTaskDialog";
import TaskSheet from "@/components/custom/TaskSheet";

const Tasks = () => {
  const { workspaces } = useUserWorkspaces((state) => state);
  const { wsId } = currentWs((state) => state);
  const { setOpen } = useCreateTaskDialogOpen((state) => state);
  const { getCurrentWsSuccess } = useGetWsDetails();
  const { tasksData, getTasksSuccess, isPending } = useGetTasks();
  const { tasks, setTasks } = useUserTasks((state) => state);

  useEffect(() => {
    if (getCurrentWsSuccess && getTasksSuccess) {
      setTasks(tasksData);
    }
  }, [getCurrentWsSuccess, getTasksSuccess, setTasks, tasksData]);

  if (wsId && isPending) {
    return <TasksLoading />;
  }

  return (
    <>
      <div className="p-4 h-auto">
        <div className="flex justify-end mb-4">
          <Button
            variant="ghost"
            disabled={!wsId || !workspaces.length}
            onClick={() => setOpen(true)}
            className="border border-[#aaa] px-4 py-2 rounded-lg text-md theme-text-gradient"
          >
            Create Task
          </Button>
        </div>

        {tasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map(
              ({
                title,
                _id,
                guidelines,
                assignedBy,
                assignedTo,
                status,
                dueDate,
                createdAt
              }) => (
                <TaskCard
                  key={_id}
                  id={_id}
                  title={title}
                  guidelines={guidelines}
                  status={status}
                  dueDate={dueDate}
                  assignedTo={assignedTo}
                  assignedBy={assignedBy}
                  createdAt={createdAt}
                />
              )
            )}
          </div>
        ) : getCurrentWsSuccess && getTasksSuccess ? (
          <div className="text-center text-slate-600 h-full w-full flex justify-center items-center">
            No tasks found
          </div>
        ) : null}
      </div>

      <CreateTaskDialog />
      <EditTaskDialog />
      <TaskSheet />
    </>
  );
};

export default Tasks;
