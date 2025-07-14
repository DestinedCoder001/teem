import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { toast } from "sonner";
import type { CustomAxiosError } from "@/lib/types";
import { useCreateTaskDialogOpen } from "@/lib/store/uiStore";
import { useForm } from "react-hook-form";
import { Loader } from "lucide-react";
import { useCreateTask } from "@/lib/hooks/useCreateTask";
import DateTimePicker from "./DateTimePicker";
import { useEffect, useState } from "react";
import AssignesDropdown from "./AssignesDropdown";

type FormValues = {
  taskTitle: string;
  guidelines: string;
  dueDate: Date;
};

const CreateTaskDialog = () => {
  const { isOpen, setOpen } = useCreateTaskDialogOpen((state) => state);
  const { isPending, mutate } = useCreateTask();
  const [assignee, setAssignee] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      dueDate: undefined,
    },
  });

  const dueDate = watch("dueDate");

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

  const onSubmit = (data: FormValues) => {
    mutate(
      {
        title: data.taskTitle,
        guidelines: data.guidelines,
        dueDate: data.dueDate,
        assignedTo: assignee
      },
      {
        onSuccess: () => {
          toast.success("Task created successfully", { position: "top-center" });
          reset();
          setOpen(false);
        },
        onError: (err) => {
          const error = err as CustomAxiosError;
          toast.error(error.response?.data.message || "Couldn't create task", {
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
            New Task
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

            <AssignesDropdown user={assignee} setUser={setAssignee} />
            {!assignee && (
              <span className="text-xs text-red-500">Assignee is required</span>
            )}

            <div className="grid gap-2">
              <Label htmlFor="description" className="text-base text-gray-700">
                Guidelines
              </Label>
              <Textarea
                id="description"
                placeholder="Guidelines for this task"
                {...register("guidelines", {
                  required: "Guidelines is required",
                  minLength: {
                    value: 10,
                    message: "Guidelines must be at least 10 characters",
                  },
                  maxLength: {
                    value: 1000,
                    message: "Guidelines must be less than 1000 characters",
                  },
                })}
              />
              {errors.guidelines && (
                <span className="text-xs text-red-500">
                  {errors.guidelines.message}
                </span>
              )}
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
                "Create Task"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDialog;
