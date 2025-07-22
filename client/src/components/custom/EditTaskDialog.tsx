import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import type { CustomAxiosError } from "@/lib/types";
import { useForm } from "react-hook-form";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import DateTimePicker from "./DateTimePicker";
import AssignesDropdown from "./AssignesDropdown";
import { useEditTaskDialogOpen } from "@/lib/store/uiStore";
import { useEditTask } from "@/lib/hooks/useEditTask";
import { currentEditingTask } from "@/lib/store/userStore";
import GuidelinesEditor from "./GuidlinesEditor";

type FormValues = {
  taskTitle: string;
  guidelines: string;
  dueDate: Date;
};

const EditTaskDialog = () => {
  const { isOpen, setOpen } = useEditTaskDialogOpen((state) => state);
  const { isPending, mutate } = useEditTask();
  const { task } = currentEditingTask((state) => state);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    trigger,
    watch,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      taskTitle: task?.title || "",
      guidelines: task?.guidelines || "",
      dueDate: task?.dueDate ? new Date(task.dueDate) : undefined,
    },
  });

  const dueDate = watch("dueDate");
  const [assignee, setAssignee] = useState<string>("");

  useEffect(() => {
    if (task) {
      reset({
        taskTitle: task.title,
        guidelines: task.guidelines,
        dueDate: new Date(task.dueDate),
      });
    }
  }, [task, reset])

  useEffect(() => {
    register("dueDate", {
      required: "Due date is required",
      validate: (value) =>
        value instanceof Date && value > new Date()
          ? true
          : "Date must be in the future",
    });
  }, [register]);

  useEffect(() => {
    if (dueDate !== undefined) {
      trigger("dueDate");
    }
  }, [dueDate, trigger]);

  useEffect(() => {
    if (task) {
      setAssignee(task.assignedTo._id);
    }
  }, [task]);
  
  const onSubmit = (data: FormValues) => {
    if (!task) return;
    mutate(
      {
        taskId: task._id,
        title: data.taskTitle,
        guidelines: data.guidelines,
        dueDate: data.dueDate,
        assignedTo: assignee,
      },
      {
        onSuccess: () => {
          toast.success("Task updated successfully", { position: "top-center" });
          reset();
          setOpen(false);
        },
        onError: (err) => {
          const error = err as CustomAxiosError;
          toast.error(error.response?.data.message || "Couldn't edit task", {
            position: "top-center",
          });
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogOverlay className="bg-black/10 backdrop-blur-[0.75px]" />
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] no-scrollbar overflow-y-auto bg-white text-gray-900">
        <DialogHeader>
          <DialogTitle className="text-xl theme-text-gradient w-max">
            Edit Task
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="taskTitle" className="text-base text-gray-700">
                Task Title
              </Label>
              <Input
                id="taskTitle"
                placeholder="Task title"
                {...register("taskTitle", {
                  required: "Task title is required",
                })}
              />
              {errors.taskTitle && (
                <span className="text-xs text-red-500">
                  {errors.taskTitle.message}
                </span>
              )}
            </div>

            <div className="grid gap-2">
              <DateTimePicker
                date={dueDate}
                setDate={(d) => setValue("dueDate", d as Date)}
              />
              {errors.dueDate && (
                <span className="text-xs text-red-500">
                  {errors.dueDate.message}
                </span>
              )}
            </div>

            <AssignesDropdown
              user={assignee}
              setUser={setAssignee}
            />

            {!task?.assignedTo._id && (
              <span className="text-xs text-red-500">Assignee is required</span>
            )}

                        <div className="grid gap-2">
              <Label htmlFor="guidelines" className="text-base text-gray-700">
                Guidelines
              </Label>
              <GuidelinesEditor
                name="guidelines"
                control={control}
                minCharacters={10}
                maxCharacters={1000}
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={isPending}
              className="min-w-[10rem]"
            >
              {isPending ? (
                <Loader className="animate-spin" />
              ) : (
                "Edit Task"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTaskDialog;
