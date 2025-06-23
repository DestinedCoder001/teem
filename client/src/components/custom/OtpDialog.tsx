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
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";

interface OTPDialogProps {
  open: boolean;
  email: string;
  onOpenChange: (open: boolean) => void;
}

export default function OTPDialog({ open, onOpenChange, email }: OTPDialogProps) {
  const [otp, setOtp] = useState("");
  const {mutate, isPending} = useVerifySignupOtp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({code: otp, email}, {
      onSuccess: () => navigate("/"),
      onError(err) {
        const error = err as AxiosError<{ message: string }>;
        console.log(error)
        toast(error.response?.data?.message || "Counldn't sign up. Try again", {
          position: "top-center",
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/10 backdrop-blur-[0.75px]" />
      <DialogContent className="max-w-md mx-auto w-5/6 md:w-3/6 lg:w-[20rem]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-center">Enter OTP</DialogTitle>
          <DialogDescription className="text-center text-black/70">
            Enter the 6-digit code sent to <span className="font-semibold">{email}</span>
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={(e) => handleSubmit(e)}>
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
            disabled={otp.length !== 6 || isPending}
          >
            {isPending ? <LoaderCircle  className="animate-spin"/> : "Verify"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
