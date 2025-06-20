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

interface OTPDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function OTPDialog({ open, onOpenChange }: OTPDialogProps) {
  const [otp, setOtp] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(otp);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/10 backdrop-blur-[0.75px]" />
      <DialogContent className="max-w-md mx-auto w-5/6 md:w-3/6 lg:w-[20rem]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-center">Enter OTP</DialogTitle>
          <DialogDescription className="text-center">
            Enter the 6-digit code sent to johndoe@example.com
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
            disabled={otp.length !== 6}
          >
            Verify
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
