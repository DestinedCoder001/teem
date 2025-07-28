"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import useEditChannel from "@/lib/hooks/useEditChannel";
import type { Dispatch, SetStateAction } from "react";
import { Loader } from "lucide-react";

type FormData = {
  name: string;
  description: string;
};

interface EditChannelDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  defaultValues?: FormData;
}

const EditChannelDialog = ({
  open,
  setOpen,
  defaultValues,
}: EditChannelDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues,
  });

  const { mutate, isPending } = useEditChannel();

  const onSubmit = (data: FormData) => {
    mutate(data, {
      onSuccess: () => {
        setOpen(false);
        reset();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogOverlay className="bg-black/10 backdrop-blur-[0.75px]" />
      <DialogContent className="sm:max-w-[425px] bg-white text-gray-900">
        <DialogHeader>
          <DialogTitle className="text-xl theme-text-gradient w-max">
            Edit channel
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-base text-gray-700">
                Channel Name
              </Label>
              <Input
                autoComplete="off"
                id="name"
                placeholder="Design Team"
                className="col-span-3 border-gray-300 text-gray-900 placeholder:text-gray-400"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <span className="text-sm text-red-500">
                  {errors.name.message}
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
                {...register("description", {
                  required: "Description is required",
                })}
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
                <Loader className="animate-spin" />
              ) : (
                "Edit channel"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditChannelDialog;
