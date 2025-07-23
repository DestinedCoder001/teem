import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CircleGradientWrapper from "@/components/custom/GradientWrapper";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useParams } from "react-router-dom";
import AppError from "@/components/custom/AppError";
import NotFound from "@/components/custom/NotFound";
import type { AxiosError } from "axios";
import { formatDates } from "@/utils/formatDates";
import UserSkeleton from "@/components/custom/UserSkeleton";
import { useActiveUsers } from "@/lib/store/uiStore";

const User = () => {
  const { userId } = useParams();
  const { activeUsers } = useActiveUsers((state) => state);

  const isOnline = activeUsers.includes(userId as string);

  const { data, isFetching, error } = useQuery({
    queryKey: ["get-user"],
    queryFn: async () => {
      const { data } = await api.get(`/users/${userId}`);
      return data;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  if (isFetching) {
    return <UserSkeleton />;
  }

  if (error) {
    const err = error as AxiosError;
    if (err.status === 404) {
      return <NotFound text="User not found" />;
    }
    return <AppError />;
  }
  const user = data.user;

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-md bg-white overflow-hidden p-6">
        <div className="flex flex-col items-center py-6">
          <div className="relative">
            <CircleGradientWrapper
              className={`p-0.5 relative rounded-full ${
                !isOnline && "bg-none bg-slate-500"
              }`}
            >
              <Avatar className="h-24 w-24">
                <AvatarImage
                  className="bg-white object-cover object-center w-full"
                  src={user?.profilePicture}
                  alt={user?.firstName}
                />
                <AvatarFallback className="text-slate-600 text-3xl font-bold">
                  {user?.firstName?.[0]?.toUpperCase()}
                  {user?.lastName?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isOnline ? (
                <span className="absolute bottom-2 right-1/15 w-4 h-4 border-2 border-white rounded-full bg-secondary" />
              ) : null}
            </CircleGradientWrapper>
          </div>

          <div
            className={`text-xs font-semibold px-3 py-1 rounded-full mb-4 mt-2 ${
              isOnline
                ? "text-secondary bg-gradient-to-tr from-primary/10 to-secondary/10"
                : "text-slate-500 bg-slate-300"
            }`}
          >
            {isOnline ? "online" : "offline"}
          </div>

          <h1 className="text-2xl font-bold theme-text-gradient">
            {user?.firstName} {user?.lastName}
          </h1>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
        {user.createdAt && (
          <p className="text-center font-bold text-slate-700">
            Account created {formatDates(user?.createdAt)}
          </p>
        )}
      </div>
    </div>
  );
};

export default User;
