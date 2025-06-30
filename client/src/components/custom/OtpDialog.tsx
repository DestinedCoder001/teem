import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useVerifySignupOtp } from "@/lib/hooks/useVerifySignupOtp";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import type { CustomAxiosError } from "@/lib/types";
import {
  useNewPwdDialogStore,
  useOtpDialogStore,
} from "@/lib/store/dialogStore";
import { useVerifyResetOtp } from "@/lib/hooks/useVerifyResetOtp";
import { useAuthStore } from "@/lib/store/authStore";

interface OTPDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: "signup" | "reset";
}

export default function OTPDialog({
  open,
  onOpenChange,
  action,
}: OTPDialogProps) {
  const [otp, setOtp] = useState("");
  const { mutate, isPending } = useVerifySignupOtp();
  const { setEmail, setOpen: setNewPwdOpen } = useNewPwdDialogStore();
  const { mutate: resetMutate, isPending: resetPending } = useVerifyResetOtp();
  const { setAccessToken } = useAuthStore();
  const { email } = useOtpDialogStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (action === "signup") {
      mutate(
        { code: otp, email },
        {
          onSuccess: (data: { accessToken: string }) => {
            toast("Welcome to Teem", {
              position: "top-center",
            });
            setAccessToken(data.accessToken);
          },
          onError(err) {
            const error = err as CustomAxiosError;
            console.log(error);
            toast("Counldn't sign up. Try again", {
              position: "top-center",
            });
          },
        }
      );
    } else if (action === "reset") {
      resetMutate(
        { code: otp, email },
        {
          onSuccess: (data: { message: string; email: string }) => {
            toast("OTP verification successful", {
              position: "top-center",
            });
            setEmail(data.email);
            onOpenChange(false);
            setNewPwdOpen();
          },
          onError(err) {
            const error = err as CustomAxiosError;
            toast(error.response?.data.message || "Counldn't log in. Try again", {
              position: "top-center",
            });
          },
        }
      );
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
        <DialogOverlay className="bg-black/10 backdrop-blur-[0.75px]" />
        <DialogContent
          className="max-w-md mx-auto w-5/6 md:w-3/6 lg:w-[20rem]"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-center">
              Enter OTP
            </DialogTitle>
            <DialogDescription className="text-center text-black/70">
              Enter the 6-digit code sent to{" "}
              <span className="font-semibold">{email}</span>
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4">
            <div className="w-max mx-auto">
              <InputOTP
                maxLength={6}
                onChange={(value) => {
                  setOtp(value);
                }}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <Button
              className="w-full rounded-full"
              onClick={handleSubmit}
              disabled={otp.length !== 6 || isPending || resetPending}
            >
              {isPending || resetPending ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                "Verify"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
