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
  AlertDialogOverlay,
} from "@/components/ui/alert-dialog";

const MessagesTip = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const showTip = JSON.parse(localStorage.getItem("teem-show-tip") || "true");
    if (showTip) setOpen(true);
  }, []);

  const handleClose = () => {
    localStorage.setItem("teem-show-tip", "false");
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogOverlay className="bg-black/10 backdrop-blur-[0.75px]" />
      <AlertDialogContent>
        <AlertDialogHeader className="flex items-center gap-2">
          <Info strokeWidth={1.5} className="size-8 text-secondary" />
          <AlertDialogTitle>Tip!</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription className="text-center dark:text-slate-200">
          Long press or right-click on a message for options.
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleClose} className="text-white">
            Got it
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MessagesTip;
