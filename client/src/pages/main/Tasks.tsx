import {
  currentWs,
  useUserStore,
  useUserTasks,
  useUserWorkspaces,
} from "@/lib/store/userStore";
import TaskCard from "@/components/custom/TaskCard";
import { Button } from "@/components/ui/button";
import { useCreateTaskDialogOpen } from "@/lib/store/uiStore";
import CreateTaskDialog from "@/components/custom/CreateTaskDialog";
import { useEffect, useState } from "react";
import useGetTasks from "@/lib/hooks/useGetTasks";
import TasksLoading from "@/components/custom/TasksLoading";
import EditTaskDialog from "@/components/custom/EditTaskDialog";
import TaskSheet from "@/components/custom/TaskSheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TaskPayload } from "@/lib/types";
import TaskStatusFilter from "@/components/custom/TaskStatusFilter";
import AppError from "@/components/custom/AppError";
import { getSocket } from "@/lib/socket";

const Tasks = () => {
  const { workspaces } = useUserWorkspaces((state) => state);
  const { wsId } = currentWs((state) => state);
  const { setOpen } = useCreateTaskDialogOpen((state) => state);
  const { tasksData, getTasksSuccess, isPending, error } = useGetTasks();
  const { tasks, setTasks } = useUserTasks((state) => state);
  const { user } = useUserStore((state) => state);
  const authSocket = getSocket()!;
  const [filter, setFilter] = useState("all");
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<TaskPayload[]>([]);

  useEffect(() => {
    if (getTasksSuccess) {
      setTasks(tasksData);
    }
  }, [getTasksSuccess, setTasks, tasksData]);

  const filterTasks = () => {
    let res = tasks;

    if (filter === "to_me") {
      res = res.filter((task) => task?.assignedTo?._id === user?._id);
    } else if (filter === "by_me") {
      res = res.filter((task) => task?.assignedBy?._id === user?._id);
    }

    if (statusFilters.length > 0) {
      res = res.filter((task) => {
        if (task.status === "pending" && task.isDue) {
          return statusFilters.includes("due");
        }
        return statusFilters.includes(task.status);
      });
    }

    setFilteredTasks(res);
  };

  useEffect(() => {
    const handleNewtask = (data: TaskPayload) => {
      setTasks([...tasks, data]);
    };
    const handleDeletetask = (data: string) => {
      setTasks(tasks.filter((task) => task._id !== data));
    };
    const handleTaskStatusUpdate = (data: {
      taskStatus: string;
      id: string;
    }) => {
      const updatedTasks = tasks.map((task) => {
        if (data.id !== task._id) return task;
        return { ...task, status: data.taskStatus };
      });
      setTasks(updatedTasks);
    };
    authSocket?.on("task_status_update", handleTaskStatusUpdate);
    authSocket?.on("new_task", handleNewtask);
    authSocket?.on("task_deleted", handleDeletetask);

    return () => {
      authSocket?.off("task_status_update", handleTaskStatusUpdate);
      authSocket?.off("new_task", handleNewtask);
      authSocket?.off("task_deleted", handleDeletetask);
    };
  }, [authSocket, tasks, setTasks]);

  useEffect(() => {
    filterTasks();
  }, [filter, statusFilters, tasks]);

  if (wsId && isPending) {
    return <TasksLoading />;
  }

  if (error) {
    return <AppError />;
  }

  return (
    <>
      <div className="p-4 h-auto">
        <div className="flex gap-x-4 justify-end">
          <Button
            variant="ghost"
            disabled={!wsId || !workspaces.length}
            onClick={() => setOpen(true)}
            className="border border-[#aaa] dark:border-neutral-700 px-4 py-2 rounded-lg text-md theme-text-gradient"
          >
            Create Task
          </Button>
        </div>

        <div className="flex justify-between md:justify-end md:gap-x-4 my-4">
          <TaskStatusFilter
            filters={statusFilters}
            setFilters={setStatusFilters}
          />
          <Select
            onValueChange={(value) => setFilter(value)}
            defaultValue="all"
          >
            <SelectTrigger className="w-[180px] text-slate-700 dark:text-slate-100">
              <SelectValue placeholder="Assigned by" />
            </SelectTrigger>
            <SelectContent className="text-slate-700 dark:text-slate-100">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="to_me">Assigned to me</SelectItem>
              <SelectItem value="by_me">Assigned by me</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredTasks?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks?.map(
              ({
                title,
                _id,
                guidelines,
                assignedBy,
                assignedTo,
                status,
                dueDate,
                createdAt,
                isDue,
              }) => (
                <TaskCard
                  isDue={isDue}
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
        ) : getTasksSuccess ? (
          <div className="text-center text-slate-600 dark:text-slate-100 h-[calc(100dvh-200px)] w-full flex justify-center items-center">
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
