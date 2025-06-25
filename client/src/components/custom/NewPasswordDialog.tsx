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
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { useNewPwdDialogStore } from "@/lib/store/dialogStore";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewPasswordDialog({ open, onOpenChange }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ password: string; confirmPassword: string }>();

  const [showPassword, setShowPassword] = useState(false);
  const { email } = useNewPwdDialogStore();

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: { email: string; newPassword: string }) => {
      const { data } = await api.post("/auth/change-password", payload);
      return data;
    },
    onSuccess() {
      toast("Password reset successfully. Log in with your new password", {
        position: "top-center",
      });
      onOpenChange(false);
    },
    onError() {
      toast("Password reset failed", {
        position: "top-center",
      });
    },
  });

  const onSubmit = (data: { password: string; confirmPassword: string }) => {
    if (data.password !== data.confirmPassword) {
      toast("Passwords do not match", { position: "top-center" });
      return;
    }

    if (email) {
      mutate({ email, newPassword: data.confirmPassword });
    } else {
      toast("Email not provided", { position: "top-center" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/10 backdrop-blur-[0.75px]" />
      <form>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-center">
              Set New Password
            </DialogTitle>
            <DialogDescription className="text-center text-black/70">
              Enter your new password to complete the reset process.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                autoComplete="off"
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                autoComplete="off"
                type={showPassword ? "text" : "password"}
                {...register("confirmPassword", {
                  required: "Confirm your password",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="showPasswordReset"
                checked={showPassword}
                onCheckedChange={() => setShowPassword(!showPassword)}
              />
              <label
                htmlFor="showPasswordReset"
                className="text-sm text-[#666666] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Show password
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isPending}
              className="min-w-[6rem]"
              onClick={handleSubmit(onSubmit)}
            >
              {isPending ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                "Reset Password"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
