import {
  Sheet, SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { useTaskSheetOpen } from "@/lib/store/uiStore";
import { Button } from "../ui/button";
import { currentEditingTask } from "@/lib/store/userStore";
import {
  CircleCheck,
  CirclePlay,
  ClipboardCheckIcon,
  TimerOff,
} from "lucide-react";
import { formatTaskDueDate } from "@/utils/formatDueDate";

const TaskSheet = () => {
  const { isOpen, setOpen } = useTaskSheetOpen((state) => state);
  const { task } = currentEditingTask((state) => state);

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="py-6 overflow-auto no-scrollbar w-full dark:bg-neutral-900">
        <SheetHeader className="text-center">
          <SheetTitle className="theme-text-gradient text-2xl w-max mx-auto">
            {task?.title}
          </SheetTitle>
          <SheetDescription className="hidden">
            Task description
          </SheetDescription>

          {task?.status === "completed" ? (
            <div className="flex gap-x-1 items-center mx-auto mt-2 w-max bg-green-100 dark:bg-green-500 rounded-full px-4 py-1 text-green-600 dark:text-green-50 font-[500]">
              <CircleCheck className="w-5 h-5 shrink-0" fill="#7bf1a8" />
              Completed
            </div>
          ) : task?.isDue ? (
            <div className="flex gap-x-1 items-center mx-auto mt-2 w-max bg-red-100 dark:bg-red-500 rounded-full px-4 py-1 text-red-600 dark:text-red-50 font-[500]">
              <TimerOff className="w-5 h-5 shrink-0" fill="#fca5a5" />
              Due
            </div>
          ) : task?.status === "pending" ? (
            <div className="flex gap-x-1 items-center mx-auto mt-2 w-max bg-orange-100 dark:bg-orange-500 rounded-full px-4 py-1 text-orange-600 dark:text-orange-50 font-[500] animate-pulse">
              <CirclePlay className="w-5 h-5 shrink-0" fill="#fdba74" />
              In progress
            </div>
          ) : null}

          {task?.dueDate && (
            <div className="flex items-center justify-center text-slate-700 dark:text-slate-100 w-full">
              <ClipboardCheckIcon className="h-4 w-4 mr-1" />
              <p>Due {formatTaskDueDate(task.dueDate.toString() as string)}</p>
            </div>
          )}
        </SheetHeader>

        {task?.createdAt && (
          <div className="my-4 text-slate-600 dark:text-slate-200 font-medium break-words text-left p-4 text-sm">
            <p className="bg-slate-100 dark:bg-neutral-700 rounded-md text-center p-2">
              Assigned by{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-100">
                {task?.assignedBy.firstName} {task?.assignedBy.lastName}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-100">
                {" "}
                {task?.assignedTo.firstName} {task?.assignedTo.lastName}
              </span>{" "}
              {formatTaskDueDate(task?.createdAt?.toString() as string)}
            </p>
          </div>
        )}

        <div className="break-words text-left p-4">
          <div dangerouslySetInnerHTML={{ __html: task?.guidelines as string }} className="space-y-3 text-slate-700 dark:text-slate-100" />
        </div>
        <SheetFooter>
          <Button
            onClick={() => setOpen(false)}
            variant="ghost"
            className="border border-slate-300 dark:border-neutral-700"
          >
            <span className="theme-text-gradient">Close</span>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default TaskSheet;
