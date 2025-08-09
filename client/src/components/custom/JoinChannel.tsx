import useJoinChannel from "@/lib/hooks/useJoinChannel";
import { Button } from "../ui/button";
import { Loader } from "lucide-react";

const JoinChannel = () => {
  const { mutate: join, isPending: joinPending } = useJoinChannel();

  return (
    <div className="flex justify-center items-center py-4 border-t border-e-slate-300 dark:bg-neutral-900">
      <div className="gap-y-2 flex flex-col items-center">
        <p className="text-slate-800 dark:text-slate-100">Join to send messages</p>
        <Button
          size="sm"
          disabled={joinPending}
          variant="outline"
          className={`min-w-[4rem] ${!joinPending && "theme-text-gradient"}`}
          onClick={() => join()}
        >
          {joinPending ? <Loader className="animate-spin dark:text-white" /> : "Join"}
        </Button>
      </div>
    </div>
  );
};

export default JoinChannel;
