import { useGoogleLogin } from "@react-oauth/google";
import { useAuthStore } from "@/lib/store/authStore";
import api from "@/lib/axios";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Button } from "../ui/button";
import googleIcon from "@/assets/google.png";
import { useState } from "react";
import { Loader } from "lucide-react";

const GoogleLoginBtn = () => {
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const [isPending, setIsPending] = useState(false);

  const login = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (response: { code: string }) => {
      if (!response?.code) return toast.error("Missing Google auth code");

      try {
        setIsPending(true);
        const { data } = await api.post("/auth/google-login", {
          code: response.code,
        });
        setAccessToken(data.data.accessToken);
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        toast.error(error.response?.data?.message || "Login failed", {
          position: "top-center",
        });
      } finally {
        setIsPending(false);
      }
    },
    onError: () =>
      toast.error("Google login failed", { position: "top-center" }),
  });

  return (
    <Button
      variant="outline"
      onClick={() => login()}
      type="button"
      className="text-[#333333] dark:text-slate-200 border border-black rounded-full py-5 font-normal text-md"
    >
      {isPending ? (
        <Loader className="animate-spin dark:text-white" />
      ) : (
        <>
          <img src={googleIcon} className="w-4 h-4 mr-2" />
          Log in with Google
        </>
      )}
    </Button>
  );
};

export default GoogleLoginBtn;
