import AppError from "@/components/custom/AppError";
import NotificationItem from "@/components/custom/NotificationItem";
import { Skeleton } from "@/components/ui/skeleton";
import useGetInvites from "@/lib/hooks/useGetInvites";
import type { Invite } from "@/lib/types";

const Notifications = () => {
  const { data, isPending, error, isSuccess } = useGetInvites();

  if (error) {
    return <AppError />;
  }

  return (
    <div className="h-full p-4">
      <h2 className="text-2xl font-bold theme-text-gradient w-max">
        Notifications
      </h2>
      {isPending && (
        <div className="flex flex-col gap-y-4 mt-6">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="w-full h-16" />
          ))}
        </div>
      )}

      {isSuccess && !isPending && data?.length === 0 && (
        <div className="flex mt-6 h-[calc(100vh-200px)] justify-center items-center">
          <p className="text-slate-600 dark:text-slate-100">No notifications</p>
        </div>
      )}

      {isSuccess && !isPending && data?.length > 0 && (
        <div className="flex flex-col gap-y-4 mt-6">
          {data?.map((invite: Invite) => (
            <NotificationItem key={invite._id} invite={invite} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
