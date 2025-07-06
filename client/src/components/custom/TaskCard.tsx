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
import { format, isToday, isTomorrow, isYesterday, parseISO } from "date-fns";
import { useUpdateTaskStatus } from "@/lib/hooks/useUpdateTaskStatus";
import { useDeleteTask } from "@/lib/hooks/useDeleteTask";
import { useEditTaskDialogOpen } from "@/lib/store/uiStore";
import { currentEditingTask } from "@/lib/store/userStore";

interface TaskCardProps {
  id: string;
  title: string;
  guidelines: string;
  status: string;
  dueDate: Date;
  assignedTo: User;
  assignedBy: User;
}
const TaskCard = ({
  id,
  title,
  guidelines,
  status,
  dueDate,
  assignedTo,
  assignedBy,
}: TaskCardProps) => {
  const { mutate, isPending } = useUpdateTaskStatus();
  const { mutate: deleteTask, isPending: deletePending } = useDeleteTask();
  const { setOpen } = useEditTaskDialogOpen((state) => state);
  const { setTask } = currentEditingTask((state) => state);

  const handleTaskUpdate = (taskStatus: "pending" | "completed") => {
    setTimeout(() => {
      if (status === taskStatus) return;
      mutate({ taskId: id, status: taskStatus });
    }, 100); // wrapped in timeout to allow dropdown menu unmount completely before triggering these functions to prevent a weird flickering issue.
  };

  const handleDelete = () => {
    setTimeout(() => {
      deleteTask({ taskId: id });
    }, 100); // wrapped in timeout to allow dropdown menu unmount completely before triggering these functions to prevent a weird flickering issue.
  };

  const formatDateTime = (isoString: string): string => {
    const date = parseISO(isoString);
    const time = format(date, "h:mm a");

    if (isToday(date)) {
      return `today at ${time}`;
    }

    if (isTomorrow(date)) {
      return `tomorrow at ${time}`;
    }

    if (isYesterday(date)) {
      return `yesterday at ${time}`;
    }

    return `${format(date, "MMM d")} at ${time}`;
  };

  const taskDetails: TaskPayload = {
    _id: id,
    title,
    guidelines,
    status,
    dueDate,
    assignedTo,
    assignedBy,
  };

  return (
    <>
      <div
        className="flex flex-col justify-between bg-white rounded-xl border border-slate-300 p-4 w-full mx-auto cursor-pointer"
        title={title}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold theme-text-gradient">
            {title?.length > 20 ? title.slice(0, 20) + "..." : title}
          </h2>
          <DropdownMenu>
            {isPending || deletePending ? (
              <Loader className="h-5 w-5 mr-2 mb-1 text-slate-500 animate-spin" />
            ) : (
              <>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4 text-slate-500" />
                  </Button>
                </DropdownMenuTrigger>
              </>
            )}
            <DropdownMenuContent className="text-slate-600">
              <DropdownMenuItem
                onSelect={() => {
                  setOpen(true);
                  setTask(taskDetails);
                }}
                className="cursor-pointer group"
              >
                <PenLine className="mr-2 h-4 w-4 group-hover:text-primary" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => handleTaskUpdate("completed")}
                className="cursor-pointer group"
              >
                <CircleCheck className="mr-2 h-4 w-4 group-hover:text-green-500" />
                Mark Complete
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => handleTaskUpdate("pending")}
                className="cursor-pointer group"
              >
                <PlayCircle className="mr-2 h-4 w-4 group-hover:text-orange-500" />
                Mark In Progress
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={handleDelete}
                className="cursor-pointer group"
              >
                <Trash2 className="mr-2 h-4 w-4 group-hover:text-red-500" />
                Delete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mb-2 space-y-2">
          <div className="flex items-center text-sm text-slate-500 font-[500]">
            <ClipboardCheck className="h-4 w-4 mr-1" />
            <span>Due {formatDateTime(dueDate.toString())}</span>
          </div>

          <p className="text-gray-700 text-xs font-[500] tracking-wide break-all">
            {guidelines?.length > 100
              ? guidelines.slice(0, 100) + "..."
              : guidelines}
          </p>
        </div>
        <div className="space-y-2 mt-4">
          <div className="flex items-center gap-x-3">
            <Avatar>
              <AvatarImage
                className="h-8 w-8 rounded-full border border-slate-200"
                src={assignedBy?.profilePicture}
                alt={assignedBy?.firstName}
              />
              <AvatarFallback className="text-slate-600 font-medium text-sm">
                {assignedBy?.firstName[0]?.toUpperCase()}
                {assignedBy?.lastName[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <MoveRight className="text-slate-500" />
            <Avatar>
              <AvatarImage
                className="h-8 w-8 rounded-full border border-slate-200"
                src={assignedTo?.profilePicture}
                alt={assignedTo?.firstName}
              />
              <AvatarFallback className="text-slate-600 font-medium text-sm">
                {assignedTo?.firstName[0]?.toUpperCase()}
                {assignedTo?.lastName[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          {status === "completed" ? (
            <div className="flex gap-x-1 items-center w-max text-xs bg-green-100 rounded-full px-4 py-1 text-green-600 font-[500]">
              <CircleCheck className="w-4 h-4 shrink-0" fill="#7bf1a8" />
              Completed
            </div>
          ) : new Date(dueDate).getTime() < Date.now() ? (
            <div className="flex gap-x-1 items-center w-max text-xs bg-red-100 rounded-full px-4 py-1 text-red-600 font-[500]">
              <TimerOff className="w-4 h-4 shrink-0" fill="#fca5a5" />
              Due
            </div>
          ) : status === "pending" ? (
            <div className="flex gap-x-1 items-center w-max text-xs bg-orange-100 rounded-full px-4 py-1 text-orange-600 font-[500]">
              <CirclePlay className="w-4 h-4 shrink-0" fill="#fdba74" />
              In progress
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default TaskCard;
