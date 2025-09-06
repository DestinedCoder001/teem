import { Skeleton } from "@/components/ui/skeleton";

const ChatSkeleton = ({ usage }: { usage?: "chat" | "channel" }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="p-2 border-b flex justify-between items-center">
        {usage === "chat" ? <></> : <Skeleton className="size-8 rounded-full" />}
        <Skeleton className={`${usage === "chat" ? "h-9" : "h-12"} w-64 rounded-md mx-auto`} />
        <Skeleton className="size-8 rounded-full" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-4 no-scrollbar">
        <div className="flex items-end gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-10 w-[180px] rounded-xl" />
        </div>

        <div className="flex items-end gap-2 justify-end">
          <Skeleton className="h-10 w-[180px] rounded-xl" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>

        <div className="flex items-end gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-10 w-[180px] rounded-xl" />
        </div>

        <div className="flex items-end gap-2 justify-end">
          <Skeleton className="h-10 w-[180px] rounded-xl" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>

        <div className="flex items-end gap-2 justify-end">
          <Skeleton className="h-10 w-[180px] rounded-xl" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <div className="flex items-end gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-10 w-[180px] rounded-xl" />
        </div>

        <div className="flex items-end gap-2 justify-end">
          <Skeleton className="h-10 w-[180px] rounded-xl" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>

        <div className="flex items-end gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-10 w-[180px] rounded-xl" />
        </div>

        <div className="flex items-end gap-2 justify-end">
          <Skeleton className="h-10 w-[180px] rounded-xl" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>

        <div className="flex items-end gap-2 justify-end">
          <Skeleton className="h-10 w-[180px] rounded-xl" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>

      <div className="p-4 border-t flex items-center gap-4">
        <Skeleton className="h-6 w-6 rounded-full shrink-0" />
        <Skeleton className="h-16 w-full rounded-md" />
        <Skeleton className="h-10 w-10 rounded-full shrink-0" />
      </div>
    </div>
  );
};

export default ChatSkeleton;
