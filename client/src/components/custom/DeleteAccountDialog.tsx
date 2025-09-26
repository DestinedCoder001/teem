import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useDeleteAccountOpen } from "@/lib/store/uiStore";
import { Label } from "../ui/label";
import useDeleteAccount from "@/lib/hooks/useDeleteAccount";
import { Loader } from "lucide-react";

const DeleteAccountDialog = () => {
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const { isOpen, setOpen } = useDeleteAccountOpen((state) => state);
  const { mutate, isPending } = useDeleteAccount();
  const handleClose = () => {
    setOpen(false);
    setPassword("");
    setShowPassword(false);
  };

  const handleDelete = () => {
    mutate({ password });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogOverlay className="bg-black/10 backdrop-blur-[0.75px]" />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Account</DialogTitle>
        </DialogHeader>

        <Input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />

        <div className="flex items-center space-x-2">
          <Checkbox
            id="show-password"
            checked={showPassword}
            onCheckedChange={(checked) => setShowPassword(!!checked)}
          />
          <Label
            htmlFor="show-password"
            className="font-normal text-sm dark:text-slate-200"
          >
            Show password
          </Label>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={!password.trim() || isPending}
            className="min-w-[6rem] dark:bg-red-500"
            onClick={handleDelete}
          >
            {isPending ? <Loader className="animate-spin" /> : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAccountDialog;
