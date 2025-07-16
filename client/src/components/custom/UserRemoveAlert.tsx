import {
  AlertDialog, AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import useRemoveUser from "@/lib/hooks/useRemoveUser";
import { useRemoveAlertOpen } from "@/lib/store/uiStore";
import { userToBeRemoved } from "@/lib/store/userStore";
import { Loader, TriangleAlert } from "lucide-react";
import { Button } from "../ui/button";

const UserRemoveAlert = () => {
  const { isOpen, setOpen } = useRemoveAlertOpen((state) => state);
  const { user, setUser } = userToBeRemoved((state) => state);
  const { mutate, isPending } = useRemoveUser();

  const handleRemove = () => {
    mutate({ userId: user?._id as string });
  };

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={() => {
        setOpen(false);
        setUser(null);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-x-2 text-red-500">
            <TriangleAlert />
            Caution!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-800 text-left">
            <span className="font-semibold text-black">
              {user?.firstName} {user?.lastName}
            </span>{" "}
            will be removed from this workspace and will no longer be able to
            access channels, tasks and messages.<br /><br />
            All tasks related to this user will also be deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <Button disabled={isPending} className="md:min-w-[6rem]" variant="destructive" onClick={handleRemove}>{isPending ?<Loader className="text-white animate-spin" /> : "Proceed"}</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UserRemoveAlert;
