import AppError from "@/components/custom/AppError";
import InvitationItem from "@/components/custom/InvitationItem";
import { Skeleton } from "@/components/ui/skeleton";
import useGetInvites from "@/lib/hooks/useGetInvites";
import { useMeta } from "@/lib/hooks/useMeta";
import type { Invite } from "@/lib/types";

const Invitations = () => {
  const { data, isPending, error, isSuccess } = useGetInvites();

  useMeta({
    title: "Invitations | Teem",
    description: "Teem Invitations page",
    ogTitle: "Teem Invitations",
    ogDescription: "Teem Invitations page",
  });

  if (error) {
    return <AppError />;
  }

  return (
    <div className="h-full p-4">
      <h2 className="text-2xl font-bold theme-text-gradient w-max">
        Invitations
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
          <p className="text-slate-600 dark:text-slate-100">No Invitations</p>
        </div>
      )}

      {isSuccess && !isPending && data?.length > 0 && (
        <div className="flex flex-col gap-y-4 mt-6">
          {data?.map((invite: Invite) => (
            <InvitationItem key={invite._id} invite={invite} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Invitations;
