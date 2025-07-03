import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCreateChannelDialogOpen } from "@/lib/store/uiStore";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import type { CustomAxiosError } from "@/lib/types";
import { useCreateChannel } from "@/lib/hooks/useCreateChannel";

type FormValues = {
  channelName: string;
  description: string;
};

const CreateChannelDialog = () => {
  const { isOpen, setOpen } = useCreateChannelDialogOpen((state) => state);
  const { isPending, mutate } = useCreateChannel();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    mutate(
      {
        name: data.channelName,
        description: data.description,
      },
      {
        onSuccess: () => {
          toast("Channel created successfully", {
            position: "top-center",
          });
          setOpen(false);
          queryClient.invalidateQueries({ queryKey: ["get-ws-details"] });
        },
        onError: (err) => {
          const error = err as CustomAxiosError;
          toast(error.response?.data.message || "Couldn't create channel", {
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
      <DialogContent className="sm:max-w-[425px] bg-white text-gray-900">
        <DialogHeader>
          <DialogTitle className="text-xl theme-text-gradient w-max">
            New channel
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="channelName" className="text-base text-gray-700">
                Channel Name
              </Label>
              <Input
                autoComplete="off"
                id="channelName"
                placeholder="Design Team"
                className="col-span-3 border-gray-300 text-gray-900 placeholder:text-gray-400"
                {...register("channelName", { required: "Name is required" })}
              />
              {errors.channelName && (
                <span className="text-sm text-red-500">
                  {errors.channelName.message}
                </span>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-base text-gray-700">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe this channel"
                className="col-span-3 border-gray-300 text-gray-900 placeholder:text-gray-400"
                {...register("description", { required: "Description is required" })}
              />
              {errors.description && (
                <span className="text-sm text-red-500">
                  {errors.description.message}
                </span>
              )}
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSubmit(onSubmit)}
              type="submit"
              disabled={isPending}
              className="min-w-[10rem]"
            >
              {isPending ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                "Create channel"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChannelDialog;