import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  PlayCircle,
  Trash2,
  MoveRight,
  ClipboardCheck,
  CircleCheck,
  PenLine,
  Loader,
  TimerOff,
  CirclePlay,
} from "lucide-react";
import type { TaskPayload, User } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useUpdateTaskStatus } from "@/lib/hooks/useUpdateTaskStatus";
import { useDeleteTask } from "@/lib/hooks/useDeleteTask";
import { useEditTaskDialogOpen, useTaskSheetOpen } from "@/lib/store/uiStore";
import { currentEditingTask, useUserStore } from "@/lib/store/userStore";
import { formatTaskDueDate } from "@/utils/formatDueDate";
import { useTheme } from "next-themes";
import { getSocket } from "@/lib/socket";

interface TaskCardProps {
  id: string;
  title: string;
  guidelines: string;
  status: string;
  dueDate: Date;
  assignedTo: User;
  assignedBy: User;
  createdAt: Date;
  isDue: boolean;
}
const TaskCard = ({
  id,
  title,
  guidelines,
  status,
  dueDate,
  assignedTo,
  assignedBy,
  createdAt,
  isDue,
}: TaskCardProps) => {
  const { mutate, isPending } = useUpdateTaskStatus();
  const { mutate: deleteTask, isPending: deletePending } = useDeleteTask();
  const { setOpen } = useEditTaskDialogOpen((state) => state);
  const { setTask } = currentEditingTask((state) => state);
  const { setOpen: setTaskDrawerOpen } = useTaskSheetOpen((state) => state);
  const user = useUserStore((state) => state.user);
  const theme = useTheme().theme;
  const authSocket = getSocket()!;

  const handleTaskUpdate = (taskStatus: "pending" | "completed") => {
    /* 
    wrapped in timeout to allow dropdown menu unmount completely before 
    triggering these functions to prevent a weird flickering issue.
    */
    setTimeout(() => {
      if (status === taskStatus) return;
      mutate(
        { taskId: id, status: taskStatus },
        {
          onSuccess: () => {
            authSocket?.emit("update_task_status", { id, taskStatus });
          },
        }
      );
    }, 100);
  };

  const handleDelete = () => {
    /* 
    wrapped in timeout to allow dropdown menu unmount completely before 
    triggering these functions to prevent a weird flickering issue.
    */
    setTimeout(() => {
      deleteTask(
        { taskId: id },
        {
          onSuccess: () => {
            authSocket?.emit("delete_task", id);
          },
        }
      );
    }, 100);
  };

  const taskDetails: TaskPayload = {
    _id: id,
    title,
    guidelines,
    status,
    dueDate,
    assignedTo,
    assignedBy,
    createdAt,
    isDue,
  };

  const isAssigneeAvailable = assignedTo !== null;
  const isAssigedByAvailable = assignedBy !== null;
  const deletedAccAvatar = (
    <div className="size-8 rounded-full flex items-center justify-center bg-gray-200 text-gray-500 font-semibold">
      !
    </div>
  );

  return (
    <>
      <div
        className="flex flex-col justify-between bg-white dark:bg-neutral-900 rounded-xl border border-slate-300 dark:border-neutral-700 p-4 w-full mx-auto cursor-pointer h-[16rem] lg:h-[19rem] xl:h-[17rem]"
        title={title}
        onClick={() => {
          setTask(taskDetails);
          setTaskDrawerOpen(true);
        }}
      >
        <div className="flex flex-col gap-y-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold theme-text-gradient truncate">
              {title}
            </h2>
            {user &&
              (user._id === assignedBy._id || user._id === assignedTo._id) && (
                <DropdownMenu>
                  {isPending || deletePending ? (
                    <Loader className="h-5 w-5 mr-2 translate-y-[2px] text-slate-500 dark:text-slate-200 animate-spin" />
                  ) : (
                    <>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4 text-slate-500 dark:text-slate-200" />
                        </Button>
                      </DropdownMenuTrigger>
                    </>
                  )}
                  <DropdownMenuContent
                    className="text-slate-700 dark:text-slate-200 -translate-x-6 lg:-translate-x-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {user && user._id === assignedBy._id && (
                      <DropdownMenuItem
                        onSelect={() => {
                          setOpen(true);
                          setTask(taskDetails);
                        }}
                        className="cursor-pointer group"
                      >
                        <PenLine className="mr-2 h-4 w-4 group-hover:text-primary group-focus:text-primary" />
                        Edit
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onSelect={() => handleTaskUpdate("completed")}
                      className="cursor-pointer group"
                      disabled={status === "completed"}
                    >
                      <CircleCheck className="mr-2 h-4 w-4 group-hover:text-green-500 group-focus:text-green-500" />
                      Mark Complete
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => handleTaskUpdate("pending")}
                      disabled={status === "pending"}
                      className="cursor-pointer group"
                    >
                      <PlayCircle className="mr-2 h-4 w-4 group-hover:text-orange-500 group-focus:text-orange-500" />
                      Mark In Progress
                    </DropdownMenuItem>
                    {user && user._id === assignedBy._id && (
                      <DropdownMenuItem
                        onSelect={handleDelete}
                        className="cursor-pointer group"
                      >
                        <Trash2 className="mr-2 h-4 w-4 group-hover:text-red-500 group-focus:text-red-500" />
                        Delete Task
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
          </div>

          <div className="mb-2 space-y-2">
            {dueDate && (
              <div className="flex items-center text-sm text-slate-500 dark:text-slate-50 font-[500]">
                <ClipboardCheck className="h-4 w-4 mr-1" />
                <span>Due {formatTaskDueDate(dueDate.toString())}</span>
              </div>
            )}

            <div
              dangerouslySetInnerHTML={{ __html: guidelines }}
              className="text-sm text-slate-800 dark:text-white/80 custom-ellipsis"
            />
          </div>
        </div>

        <div className="space-y-2 lg:space-y-4 mt-4">
          <div className="flex items-center gap-x-3">
            {isAssigedByAvailable ? (
              <Avatar className="h-8 w-8 rounded-full border border-slate-200 dark:border-neutral-600">
                <AvatarImage
                  className="object-cover object-center w-full"
                  src={assignedBy?.profilePicture}
                  alt={assignedBy?.firstName}
                />
                <AvatarFallback className="text-slate-600 dark:text-slate-100 font-medium text-sm">
                  {assignedBy?.firstName[0]?.toUpperCase()}
                  {assignedBy?.lastName[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ) : (
              deletedAccAvatar
            )}
            <MoveRight className="text-slate-500 dark:text-slate-100" />
            {isAssigneeAvailable ? (
              <Avatar className="h-8 w-8 rounded-full border border-slate-200 dark:border-neutral-600">
                <AvatarImage
                  className="object-cover object-center w-full"
                  src={assignedTo?.profilePicture}
                  alt={assignedTo?.firstName}
                />
                <AvatarFallback className="text-slate-600 dark:text-slate-100 font-medium text-sm">
                  {assignedTo?.firstName[0]?.toUpperCase()}
                  {assignedTo?.lastName[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ) : (
              deletedAccAvatar
            )}
          </div>
          {status === "completed" ? (
            <div className="flex gap-x-1 items-center w-max text-xs bg-green-100 dark:bg-green-500 rounded-full px-4 py-1 text-green-600 dark:text-green-50 font-[500]">
              <CircleCheck
                className="w-4 h-4 shrink-0"
                fill={theme === "dark" ? "#14532d" : "#7bf1a8"}
              />
              Completed
            </div>
          ) : isDue ? (
            <div className="flex gap-x-1 items-center w-max text-xs bg-red-100 dark:bg-red-500 rounded-full px-4 py-1 text-red-600 dark:text-red-50 font-[500]">
              <TimerOff
                className="w-4 h-4 shrink-0"
                fill={theme === "dark" ? "#7f1d1d" : "#fca5a5"}
              />
              Due
            </div>
          ) : status === "pending" ? (
            <div className="flex gap-x-1 items-center w-max text-xs bg-orange-100 dark:bg-orange-500 rounded-full px-4 py-1 text-orange-600 dark:text-orange-50 font-[500]">
              <CirclePlay
                className="w-4 h-4 shrink-0"
                fill={theme === "dark" ? "#7c2d12" : "#fdba74"}
              />
              In progress
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default TaskCard;
