"use client";

import { Info } from "lucide-react";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const MessagesTip = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dismissed = JSON.parse(localStorage.getItem("teem-show-tip") || "false");
    if (!dismissed) setOpen(true);
  }, []);

  const handleClose = () => {
    localStorage.setItem("teem-show-tip", "true");
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader className="flex items-center gap-2">
          <Info strokeWidth={1.5} className="size-8 text-secondary" />
          <AlertDialogTitle>Tip!</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription className="text-center dark:text-slate-200">
          Long press or right-click on a message for options.
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleClose} className="text-white">Got it</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MessagesTip;