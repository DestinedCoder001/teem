import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import googleIcon from "@/assets/google.png";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import type { SignUpDetails } from "@/lib/types";
import { LoaderCircle } from "lucide-react";
import { useSignUp } from "@/lib/hooks/useSignUp";
import OTPDialog from "@/components/custom/OtpDialog";
import { useOtpDialogStore } from "@/lib/store/dialogStore";
import type { AxiosError } from "axios";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate, isPending } = useSignUp();
  const { isOpen, setOpen, setEmail: setOtpEmail } = useOtpDialogStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpDetails>();

  const onSubmit = ({
    email,
    password,
    firstName,
    lastName,
  }: SignUpDetails) => {
    const obj = { email, password, firstName, lastName };
    mutate(obj, {
      onSuccess: () => {
        setOtpEmail(email);
        setOpen();
      },
      onError: (error) => {
        const err = error as AxiosError<{ message: string }>;
        let message = "";
        if (err.code === "ERR_NETWORK") {
          message = "Network error";
        } else if (err.status !== 500) {
          message = err.response?.data.message as string;
        } else {
          message = "Couldn't sign up. Try again";
        }
        toast(message, {
          position: "top-center",
        });
      },
    });
  };

  return (
    <>
      <OTPDialog action="signup" onOpenChange={setOpen} open={isOpen} />
      <div className="px-4">
        <div className="min-h-[calc(100vh-100px)] flex justify-center items-center sm:pb-4">
          <div className="flex justify-center items-center h-full w-full">
            <div className="w-full md:w-1/2 lg:w-1/3">
              <div className="mb-6">
                <h1 className="text-2xl text-primary font-[500] text-center">
                  Create an account
                </h1>

                <span className="text-[0.8rem] block text-center text-[#333333]">
                  Already have an account?{" "}
                  <Link to="/login" className="text-sm underline text-black">
                    login
                  </Link>
                </span>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <div className="space-y-2">
                  <Label
                    htmlFor="firstName"
                    className="text-[#666666] font-normal"
                  >
                    First name
                  </Label>
                  <Input
                    type="text"
                    id="firstName"
                    className={`border ${
                      errors.firstName ? "border-red-500" : "border-[#bbb]"
                    }`}
                    {...register("firstName", {
                      required: "First name is required",
                    })}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm">
                      {errors.firstName.message as string}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="lastName"
                    className="text-[#666666] font-normal"
                  >
                    Last name
                  </Label>
                  <Input
                    type="text"
                    id="lastName"
                    className={`border ${
                      errors.lastName ? "border-red-500" : "border-[#bbb]"
                    }`}
                    {...register("lastName", {
                      required: "Last name is required",
                    })}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm">
                      {errors.lastName.message as string}
                    </p>
                  )}
                </div>

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
                    autoComplete="off"
                    id="pwd"
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
                </div>

                <Button
                  type="submit"
                  disabled={isPending}
                  className="rounded-full py-6 font-normal text-md"
                >
                  {isPending ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    "Create account"
                  )}
                </Button>

                <div className="flex items-center gap-4">
                  <div className="w-full h-[1px] bg-[#D9D9D9]" />
                  <span className="text-[#666666]">OR</span>
                  <div className="w-full h-[1px] bg-[#D9D9D9]" />
                </div>

                <Button
                  variant="outline"
                  type="button"
                  className="text-[#333333] border border-black rounded-full py-5 font-normal text-md"
                >
                  <img src={googleIcon} className="w-4 h-4 mr-2" />
                  Sign up with Google
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
