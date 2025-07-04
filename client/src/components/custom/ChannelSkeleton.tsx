import { Skeleton } from "@/components/ui/skeleton";

const ChannelSkeleton = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <Skeleton className="h-6" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 flex justify-between flex-col no-scrollbar">
        <div className="flex items-start space-x-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-24 w-64 rounded-lg" />
        </div>

        <div className="flex items-start justify-end space-x-3">
          <Skeleton className="h-24 w-64 rounded-lg" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        
        <div className="flex items-start space-x-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-24 w-64 rounded-lg" />
        </div>

        <div className="flex items-start justify-end space-x-3">
          <Skeleton className="h-24 w-64 rounded-lg" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>

      </div>

      <div className="p-4 border-t">
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </div>
  );
};

export default ChannelSkeleton;
