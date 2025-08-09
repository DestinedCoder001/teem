import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useWsDeleteAlertOpen } from "@/lib/store/uiStore";
import { Loader, TriangleAlert } from "lucide-react";
import { Button } from "../ui/button";
import { currentWsDetails, useUserStore } from "@/lib/store/userStore";
import useDeleteWs from "@/lib/hooks/useDeleteWs";

const WsDeleteAlert = () => {
  const { isOpen, setOpen } = useWsDeleteAlertOpen((state) => state);
  const { name, createdBy } = currentWsDetails((state) => state);
  const { user } = useUserStore((state) => state);
    const { mutate, isPending } = useDeleteWs();

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={() => {
        setOpen(false);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-x-2 text-red-500">
            <TriangleAlert />
            Caution!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-800 dark:text-slate-100 text-left">
            <span className="font-semibold text-black dark:text-white">{name}</span> will be
            deleted and you will no longer be able to access channels, tasks and
            messages.
            <br />
            <br />
            All data except user accounts in this workspace will be deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <Button
            disabled={isPending || user?._id !== createdBy}
            className="md:min-w-[6rem] dark:bg-red-500"
            variant="destructive"
            onClick={()=>mutate()}
          >
            {isPending ? (
              <Loader className="text-white animate-spin" />
            ) : (
              "Proceed"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default WsDeleteAlert;
