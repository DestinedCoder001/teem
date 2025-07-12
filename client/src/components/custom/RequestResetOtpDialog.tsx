import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { Loader } from "lucide-react";
import { useOtpDialogStore } from "@/lib/store/dialogStore";
import type { CustomAxiosError } from "@/lib/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RequestResetOtpDialog({ open, onOpenChange }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>();
  const { setEmail, setOpen: setOtpOpen } = useOtpDialogStore();

  const { isPending, mutate } = useMutation({
    mutationFn: async (payload: { email: string }) => {
      const { data } = await api.post("/auth/forgot-password", payload);
      return data;
    },

    onSuccess: (data: { email: string; message: string }) => {
      setEmail(data.email);
      onOpenChange(false);
      setOtpOpen();
      toast("Code has been sent to your email.", {
        position: "top-center",
      });
    },
    onError(err: CustomAxiosError) {
      toast(err.response?.data.message || "Couldn't request code.", {
        position: "top-center",
      });
    },
  });

  const onSubmit = (data: { email: string }) => {
    mutate(data);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogOverlay className="bg-black/10 backdrop-blur-[0.75px]" />
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-center">
                Reset Password
              </DialogTitle>
              <DialogDescription className="text-center text-black/70">
                Enter your email address to reset your password.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs">
                    {errors.email.message as string}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleSubmit(onSubmit)}
                type="submit"
                disabled={isPending}
                className="min-w-[8rem]"
              >
                {isPending ? (
                  <Loader className="animate-spin" />
                ) : (
                  "Send request"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
}
