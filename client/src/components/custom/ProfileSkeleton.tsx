import { Skeleton } from "@/components/ui/skeleton";
const ProfileSkeleton = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-md overflow-hidden p-6">
        <div className="flex flex-col items-center py-6">

          <div>
            <Skeleton className="h-24 w-24 rounded-full" />
          </div>

          <Skeleton className="h-5 w-16 mt-4 rounded-full" />

          <Skeleton className="h-6 w-40 mt-4 rounded-md" />

          <Skeleton className="h-4 w-52 mt-2 rounded-md" />
        </div>

        <div className="py-6 space-y-6">
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          <div className="space-y-1.5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          <div className="space-y-1.5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          <div className="flex justify-end gap-2">
            <Skeleton className="h-10 w-28 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
