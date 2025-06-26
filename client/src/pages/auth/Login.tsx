import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { useLogin } from "@/lib/hooks/useLogin";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import type { LoginDetails } from "@/lib/types";
import {
  useNewPwdDialogStore,
  useOtpDialogStore,
  useReqResetDialogStore,
} from "@/lib/store/dialogStore";
import { NewPasswordDialog } from "@/components/custom/NewPasswordDialog";
import OTPDialog from "@/components/custom/OtpDialog";
import { RequestResetOtpDialog } from "@/components/custom/RequestResetOtpDialog";
import type { AxiosError } from "axios";
import { useAuthStore } from "@/lib/store/authStore";
import GoogleLoginBtn from "@/components/custom/GoogleLoginBtn";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { isOpen: newPasswordDialogOpen, setOpen: setNewPasswordDialogOpen } =
    useNewPwdDialogStore();
  const { isOpen: isOtpDialogOpen, setOpen: setOtpDialogOpen } =
    useOtpDialogStore();
  const { isOpen: isResetOtpDialogOpen, setOpen: setisResetOtpDialogOpen } =
    useReqResetDialogStore();
  const { setAccessToken } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDetails>();

  const { mutate, isPending } = useLogin();

  const onSubmit = ({ email, password }: LoginDetails) => {
    mutate(
      { email, password },
      {
        onSuccess: (data: { accessToken: string }) => {
          setAccessToken(data.accessToken);
        },
        onError: (error) => {
          const err = error as AxiosError<{ message: string }>;
          let message = "";
          if (err.code === "ERR_NETWORK") {
            message = "Network error";
          } else if (err.status !== 500) {
            message = err.response?.data.message as string;
          } else {
            message = "Couldn't log in. Try again";
          }
          toast(message, {
            position: "top-center",
          });
        },
      }
    );
  };

  return (
    <>
      <RequestResetOtpDialog
        open={isResetOtpDialogOpen}
        onOpenChange={setisResetOtpDialogOpen}
      />
      <NewPasswordDialog
        open={newPasswordDialogOpen}
        onOpenChange={setNewPasswordDialogOpen}
      />
      <OTPDialog
        action="reset"
        open={isOtpDialogOpen}
        onOpenChange={setOtpDialogOpen}
      />
      <div className="px-4">
        <div className="h-[calc(100vh-100px)] lg:h-full lg:pb-8">
          <div className="flex justify-center items-center h-full w-full">
            <div className="w-full md:w-1/2 lg:w-1/3">
              <div className="mb-6">
                <h1 className="text-2xl text-primary font-[500] text-center">
                  Log in to your account
                </h1>

                <span className="text-[0.8rem] block text-center text-[#333333]">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-sm underline text-black">
                    sign up
                  </Link>
                </span>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#666666] font-normal">
                    Email
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    className={`border ${
                      errors.email ? "border-red-500" : "border-[#bbb]"
                    }`}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">
                      {errors.email.message as string}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pwd" className="text-[#666666] font-normal">
                    Password
                  </Label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="pwd"
                    autoComplete="off"
                    className={`border ${
                      errors.password ? "border-red-500" : "border-[#bbb]"
                    }`}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm">
                      {errors.password.message as string}
                    </p>
                  )}

                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                      id="showPassword"
                      onCheckedChange={() => setShowPassword(!showPassword)}
                    />
                    <label
                      htmlFor="showPassword"
                      className="text-sm text-[#666666] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Show password
                    </label>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      variant="link"
                      type="button"
                      onClick={() => setisResetOtpDialogOpen()}
                    >
                      I forgot my password
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isPending}
                  className="rounded-full py-6 font-normal text-md"
                >
                  {isPending ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    "Log in"
                  )}
                </Button>

                <div className="flex items-center gap-4">
                  <div className="w-full h-[1px] bg-[#D9D9D9]" />
                  <span className="text-[#666666]">OR</span>
                  <div className="w-full h-[1px] bg-[#D9D9D9]" />
                </div>

                <GoogleLoginBtn />
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
