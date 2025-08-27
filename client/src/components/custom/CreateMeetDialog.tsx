import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { currentWsDetails, useUserStore } from "@/lib/store/userStore";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { useCreateMeetingOpen } from "@/lib/store/uiStore";
import useCreateMeeting from "@/lib/hooks/useCreateMeeting";
import { Loader } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type FormValues = {
  title: string;
  allowedUsers: string[];
};

const CreateMeetingDialog = () => {
  const { isOpen, setOpen } = useCreateMeetingOpen((state) => state);
  let users = currentWsDetails((state) => state.users);
  const me = useUserStore((state) => state.user);
  users = users.filter((u) => u._id !== me?._id);

  const { mutate: createMeeting, isPending } = useCreateMeeting();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<FormValues>({
    defaultValues: { title: "", allowedUsers: [] },
  });

  const onSubmit = (values: FormValues) => {
    if (!values.allowedUsers || values.allowedUsers.length === 0) {
      setError("allowedUsers", { message: "Select at least one participant" });
      return;
    }
    createMeeting(
      { title: values.title, allowedUsers: values.allowedUsers },
      {
        onSuccess: () => {
          setOpen(false);
        },
      }
    );
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        setOpen(false);
        reset();
      }}
    >
      <DialogOverlay className="bg-black/10 backdrop-blur-[0.75px]" />
      <DialogContent  className="sm:max-w-[425px] max-h-[90vh] no-scrollbar overflow-y-auto bg-white dark:bg-neutral-950">
        <DialogHeader>
          <DialogTitle>Create a Meeting</DialogTitle>
          <DialogDescription>
            Add a title and select at least one participant
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              placeholder="Meeting title"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-md font-semibold">Participants</h3>
            <div className="max-h-40 overflow-y-auto no-scrollbar rounded p-2">
              <Controller
                name="allowedUsers"
                control={control}
                render={({ field }) => (
                  <div className="space-y-4">
                    {users.map((u) => {
                      const isChecked = field.value?.includes(u._id);
                      return (
                        <Label
                          key={u._id}
                          className="flex items-center gap-2 w-max cursor-pointer"
                        >
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([...(field.value || []), u._id]);
                              } else {
                                field.onChange(
                                  field.value.filter(
                                    (id: string) => id !== u._id
                                  )
                                );
                              }
                            }}
                          />

                          <Avatar className="size-8 rounded-full cursor-pointer border border-slate-200 dark:border-slate-500">
                            <AvatarImage
                              src={u?.profilePicture}
                              alt={u?.firstName}
                              className="object-cover object-center w-full"
                            />
                            <AvatarFallback className="text-slate-600 dark:text-slate-100">
                              {u?.firstName[0].toUpperCase() || ""}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-slate-700 dark:text-slate-100">
                            {u.firstName + " " + u.lastName}
                          </span>
                        </Label>
                      );
                    })}
                  </div>
                )}
              />
            </div>
          </div>

          {errors.allowedUsers && (
            <p className="text-sm text-red-500">
              {errors.allowedUsers.message as string}
            </p>
          )}

          <DialogFooter>
            <Button
              type="submit"
              className="text-white min-w-[9rem]"
              disabled={isPending}
            >
              {isPending ? (
                <Loader className="animate-spin" />
              ) : (
                "Create Meeting"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMeetingDialog;
