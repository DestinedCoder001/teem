import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { useSendInviteOpen } from "@/lib/store/uiStore";
import useFindUserByEmail from "@/lib/hooks/useFindUserByEmail";
import type { User } from "@/lib/types";
import { Loader, XIcon } from "lucide-react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import GradientWrapper from "./GradientWrapper";
import useSendInvite from "@/lib/hooks/useSendInvite";

type FormValues = {
  email: string;
};

const SendInviteDialog = () => {
  const { isOpen, setOpen } = useSendInviteOpen((state) => state);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  const [user, setUser] = useState<User | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);

  const {
    mutate,
    data,
    isSuccess,
    isPending: emailCheckPending,
  } = useFindUserByEmail();
  const {
    mutate: send,
    isSuccess: inviteSuccess,
    isPending: invitePending,
  } = useSendInvite();

  const actionRef = useRef<"search" | "send" | null>(null);

  useEffect(() => {
    if (isSuccess && data) {
      setUser(data);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (inviteSuccess) {
      handleClose();
    }
  }, [inviteSuccess]);

  const onSubmit = (formData: FormValues) => {
    if (actionRef.current === "search") {
      mutate({ email: formData.email });
    } else if (actionRef.current === "send") {
      if (!selectedEmail) return;
      send({ email: selectedEmail });
    }
  };

  const handleClose = () => {
    setUser(null);
    setSelectedEmail(null);
    setOpen(false);
    reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="theme-text-gradient w-max">
            Send Invite
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-slate-600 dark:text-slate-100 font-normal"
            >
              Email
            </Label>
            <Input
              id="email"
              disabled={emailCheckPending || !!user}
              type="email"
              className={cn(
                "border",
                errors.email ? "border-red-500" : "border-slate-300"
              )}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {user && (
            <RadioGroup
              onValueChange={(val) => setSelectedEmail(val)}
              value={selectedEmail || ""}
            >
              <Label>Select User</Label>
              <GradientWrapper
                className={`p-[2px] rounded-lg ${
                  selectedEmail !== user.email
                    ? "bg-none bg-slate-300 dark:bg-neutral-600"
                    : ""
                }`}
              >
                <div
                  className="flex items-center space-x-2 p-3 border rounded-md cursor-pointer bg-white dark:bg-neutral-900"
                  onClick={() => setSelectedEmail(user.email)}
                >
                  <RadioGroupItem
                    value={user.email}
                    id={user.email}
                    checked={selectedEmail === user.email}
                  />
                  
                  <Avatar className="h-8 w-8 rounded-full cursor-pointer border border-slate-200">
                    <AvatarImage
                      src={user?.profilePicture}
                      alt={user?.firstName}
                      className="object-cover object-center w-full h-full"
                    />
                    <AvatarFallback className="flex items-center justify-center h-full w-full text-slate-600 dark:text-slate-100">
                      {user?.firstName?.[0]?.toUpperCase() || ""}
                    </AvatarFallback>
                  </Avatar>

                  <p className="text-slate-600  dark:text-slate-200 font-medium">
                    {user?.firstName} {user?.lastName}
                  </p>
                </div>
              </GradientWrapper>
            </RadioGroup>
          )}

          <div className="flex justify-end items-center pt-2 gap-3">
            {!user && (
              <Button
                type="submit"
                disabled={emailCheckPending}
                className="min-w-[8rem] dark:text-white"
                onClick={() => (actionRef.current = "search")}
              >
                {emailCheckPending ? (
                  <Loader className="animate-spin" />
                ) : (
                  "Search User"
                )}
              </Button>
            )}

            {user && (
              <div className="flex items-center gap-x-2">
                <Button
                  variant="outline"
                  disabled={invitePending}
                  onClick={() => {
                    setUser(null);
                    setSelectedEmail(null);
                  }}
                >
                  <XIcon />
                </Button>

                <Button
                  type="submit"
                  variant="default"
                  className="min-w-[8rem] dark:text-white"
                  disabled={!selectedEmail || invitePending}
                  onClick={() => (actionRef.current = "send")}
                >
                  {invitePending ? (
                    <Loader className="animate-spin" />
                  ) : (
                    "Send Invite"
                  )}
                </Button>
              </div>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SendInviteDialog;
