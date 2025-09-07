import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CameraIcon, Loader, Pencil, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useUserStore } from "@/lib/store/userStore";
import CircleGradientWrapper from "@/components/custom/GradientWrapper";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "sonner";
import type { CustomAxiosError, User } from "@/lib/types";
import { AvatarImage } from "@radix-ui/react-avatar";
import useGetMe from "@/lib/hooks/useGetMe";
import ProfileSkeleton from "@/components/custom/ProfileSkeleton";
import { useUpdateDp } from "@/lib/hooks/useUpdateDp";
import { useUserOnline } from "@/lib/store/uiStore";
import { useMeta } from "@/lib/hooks/useMeta";

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
};

const UserProfile = () => {
  const { user, setUser } = useUserStore((state) => state);
  const { isPending: getMePending } = useGetMe();
  const [isEditing, setIsEditing] = useState(false);
  const [img, setImg] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { mutate: updateImg, isPending: imgUpdatePending } = useUpdateDp();

  const isOnline = useUserOnline((state) => state.isOnline);
  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: { firstName: string; lastName: string }) => {
      const { data } = await api.patch("/users/edit", payload);
      return data;
    },
    onSuccess: ({ data }: { data: User }) => {
      setIsEditing(false);
      toast.success("Profile updated successfully", {
        position: "top-center",
      });

      const updatedUser: User = {
        _id: data?._id,
        email: data?.email,
        firstName: data?.firstName,
        lastName: data?.lastName,
        profilePicture: data?.profilePicture,
        authProvider: data?.authProvider
      };

      setUser(updatedUser);
    },
    onError: (err) => {
      const error = err as CustomAxiosError;
      toast.error(error.response?.data.message || "Couldn't edit profile", {
        position: "top-center",
      });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      });
    }
  }, [user, reset]);

  const handleCamClick = () => {
    if (imgUpdatePending) {
      return;
    }
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImg(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

    useMeta({
      title: "Profile | Teem",
      description: "Teem Profile page",
      ogTitle: "Teem Profile",
      ogDescription: "Teem Profile page",
    })

  useEffect(() => {
    if (img) {
      updateImg({ file: img });
    }
  }, [img]);

  const onSubmit = (data: FormValues) => {
    mutate(data);
  };

  const handleCancel = () => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    }
    setIsEditing(false);
  };

  if (getMePending) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-md overflow-hidden p-6">
        <div className="flex flex-col items-center py-6">
          <div className={`${isEditing && "relative"}`}>
            <CircleGradientWrapper
              className={`p-0.5 relative rounded-full ${
                !isOnline && "bg-none bg-slate-500 dark:bg-neutral-500"
              }`}
            >
              <Avatar className="h-24 w-24">
                <AvatarImage
                  className={`bg-white object-cover object-center w-full ${
                    imgUpdatePending && "grayscale-75"
                  }`}
                  src={img || user?.profilePicture}
                  alt={user?.firstName}
                />
                {imgUpdatePending && (
                  <Loader className="animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
                )}
                <AvatarFallback className="text-slate-600 dark:text-slate-100 text-3xl font-bold">
                  {user?.firstName?.[0]?.toUpperCase()}
                  {user?.lastName?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isOnline && !isEditing ? (
                <span
                  className="absolute bottom-2 right-1/15 w-4 h-4 border-2 border-white rounded-full
                  bg-secondary
                "
                />
              ) : null}
            </CircleGradientWrapper>

            {isEditing ? (
              <>
                <div
                  className="p-2 absolute -right-1 bottom-1 bg-primary rounded-full cursor-pointer hover:scale-[105%] transition-all"
                  onClick={handleCamClick}
                >
                  <CameraIcon className="text-white size-4" />
                </div>
                <input
                  className="hidden"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={inputRef}
                />
              </>
            ) : null}
          </div>

          <div
            className={`text-xs font-semibold px-3 py-1 rounded-full mb-4 mt-2 ${
              isOnline
                ? "text-secondary bg-gradient-to-tr from-primary/10 to-secondary/10 dark:from-primary/30 dark:to-secondary/30"
                : "text-slate-500 dark:text-slate-100 bg-slate-300 dark:bg-neutral-700"
            }`}
          >
            {isOnline ? "online" : "offline"}
          </div>
          <h1 className="text-2xl font-bold theme-text-gradient">
            {user?.firstName} {user?.lastName}
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-200">{user?.email}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="py-6 space-y-6">
          <div className="grid gap-1.5">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              {...register("firstName", { required: "First name is required" })}
              disabled={!isEditing}
            />
            {isEditing && errors.firstName && (
              <span className="text-xs text-red-500 mt-1">
                {errors.firstName.message}
              </span>
            )}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              {...register("lastName", { required: "Last name is required" })}
              disabled={!isEditing}
            />
            {isEditing && errors.lastName && (
              <span className="text-xs text-red-500 mt-1">
                {errors.lastName.message}
              </span>
            )}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              {...register("email")}
              readOnly
              disabled
              className="border-gray-300 bg-gray-100 cursor-not-allowed text-gray-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            {isEditing ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="text-gray-600 dark:text-slate-100 hover:bg-gray-100 hover:text-gray-700 border-gray-300"
                >
                  <X className="mr-2 h-4 w-4" /> Cancel
                </Button>
                <Button
                  type="submit"
                  variant="outline"
                  className={`min-w-[5rem] ${
                    isPending ? "text-secondary/80 dark:text-secondary" : "theme-text-gradient"
                  }`}
                  disabled={isPending || imgUpdatePending}
                >
                  {isPending ? <Loader className="animate-spin" /> : "Save"}
                </Button>
              </>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="text-gray-600 dark:text-slate-100 hover:text-gray-700 hover:bg-gray-100 border-gray-300"
              >
                <Pencil className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
