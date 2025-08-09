import { Skeleton } from "@/components/ui/skeleton";
const UserSkeleton = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-md overflow-hidden p-6">
        <div className="flex flex-col items-center py-6">

          <div>
            <Skeleton className="h-24 w-24 rounded-full" />
          </div>

          <Skeleton className="h-5 w-16 mt-4 rounded-full" />

          <Skeleton className="h-10 w-48 mt-4 rounded-md" />

          <Skeleton className="h-4 w-52 mt-2 rounded-md" />
          <Skeleton className="h-4 w-72 mt-4 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default UserSkeleton;
