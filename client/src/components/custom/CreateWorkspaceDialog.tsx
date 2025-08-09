import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateWsDialogOpen } from "@/lib/store/uiStore";
import { useForm } from "react-hook-form";
import { useCreateWorkspace } from "@/lib/hooks/useCreateWorkspace";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import type { CustomAxiosError } from "@/lib/types";

type FormValues = {
  workspaceName: string;
};

const CreateWorkspaceDialog = () => {
  const { isOpen, setOpen } = useCreateWsDialogOpen((state) => state);
  const { data: wsData, isPending, mutate } = useCreateWorkspace();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const workspaceName = watch("workspaceName") || "New Workspace";

  const onSubmit = (data: FormValues) => {
    console.log("Form data:", data);
    mutate(
      {
        name: data.workspaceName,
      },
      {
        onSuccess: () => {
          console.log(wsData)
          toast.success("Workspace created successfully", {
            position: "top-center",
          });
          setOpen(false);
          queryClient.invalidateQueries({ queryKey: ["get-me"] });
        },
        onError: (err) => {
          const error = err as CustomAxiosError;
          toast.error(error.response?.data.message || "Couldn't create workspace", {
            position: "top-center",
          });
        },
      }
    );
    reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogOverlay className="bg-black/10 backdrop-blur-[0.75px]" />
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-neutral-950 text-gray-900 dark:text-gray-100">
        <DialogHeader>
          <DialogTitle className="text-xl theme-text-gradient w-max text-ellipsis">
            {workspaceName.length > 20
              ? workspaceName.slice(0, 20) + "..."
              : workspaceName}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label
                htmlFor="workspaceName"
                className="text-base text-gray-700 dark:text-gray-100"
              >
                Workspace name
              </Label>
              <Input
                autoComplete="off"
                id="workspaceName"
                placeholder="Acme Workspace"
                className="col-span-3 border-gray-300 text-gray-900 placeholder:text-gray-400"
                {...register("workspaceName", { required: true })}
              />
              {errors.workspaceName && (
                <span className="text-sm text-red-500">
                  Workspace name is required
                </span>
              )}
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button
                onClick={handleSubmit(onSubmit)}
                type="submit"
                disabled={isPending}
                className="min-w-[10rem] dark:text-white"
              >
                {isPending ? (
                  <Loader className="animate-spin" />
                ) : (
                  "Create Workspace"
                )}
              </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkspaceDialog;
