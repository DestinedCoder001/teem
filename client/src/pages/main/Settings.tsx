import DeleteAccountDialog from "@/components/custom/DeleteAccountDialog";
import SendInviteDialog from "@/components/custom/SendInviteDialog";
import ThemeToggle from "@/components/custom/ThemeToggle";
import UserRemoveAlert from "@/components/custom/UserRemoveAlert";
import WorkspaceSettings from "@/components/custom/WorkspaceSettings";
import WsDeleteAlert from "@/components/custom/WsDeleteAlert";
import { Button } from "@/components/ui/button";
import useDeleteAccount from "@/lib/hooks/useDeleteAccount";
import { useAuthStore } from "@/lib/store/authStore";
import { useDeleteAccountOpen } from "@/lib/store/uiStore";
import { useUserStore } from "@/lib/store/userStore";
import { useGoogleLogin } from "@react-oauth/google";
import type { AxiosError } from "axios";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Settings = () => {
  const { setOpen } = useDeleteAccountOpen((state) => state);
  const user = useUserStore((state) => state.user);
  const { setAccessToken } = useAuthStore((state) => state);
  const { mutate } = useDeleteAccount();
  const navigate = useNavigate();

  const googleAuth = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (response: { code: string }) => {
      if (!response?.code) return toast.error("Missing Google auth code");

      try {
        mutate({ code: response.code });
        setAccessToken(null);
        navigate("/signup", { replace: true });
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        toast.error(error.response?.data?.message || "Google auth failed", {
          position: "top-center",
        });
      }
    },
    onError: () =>
      toast.error("Google auth failed", { position: "top-center" }),
  });

  const handleDelete = () => {
    if (user?.authProvider === "google") {
      googleAuth();
    } else if (user?.authProvider === "local") {
      setOpen(true);
    } else return;
  };
  return (
    <div className="p-4 h-auto">
      <WorkspaceSettings />
      <ThemeToggle />
      <section className="space-y-4 mt-8">
        <div>
          <h3 className="text-xl font-medium">Delete Account</h3>
          <p className="text-slate-600 dark:text-slate-200 my-1 text-sm">
            Permanently remove your account and all associated data.
          </p>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-slate-300 dark:border-neutral-700 p-4">
          <div className="flex items-center gap-3">
            <Trash2 strokeWidth={1.5} className="h-6 w-6 text-destructive" />
            <span>Delete Account</span>
          </div>
          <Button
            variant="destructive"
            className="min-w-[4rem] dark:bg-red-500"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </section>
      <UserRemoveAlert />
      <WsDeleteAlert />
      <SendInviteDialog />
      <DeleteAccountDialog />
    </div>
  );
};

export default Settings;
