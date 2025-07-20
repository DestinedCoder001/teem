import { useState, useRef, useEffect } from "react";
import { ChevronDown, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import type { Invite } from "@/lib/types";
import useAcceptInvite from "@/lib/hooks/useAcceptInvite";
import useDeclineInvite from "@/lib/hooks/useDeclineInvite";

const NotificationItem = ({ invite }: { invite: Invite }) => {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const { isPending: acceptPending, mutate: accept } = useAcceptInvite();
  const { isPending: declinePending, mutate: decline } = useDeclineInvite();

  useEffect(() => {
    if (open && contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [open]);

  return (
    <div className="rounded-lg border border-slate-300 overflow-hidden transition-all">
      <div
        className="flex justify-between items-center p-4 cursor-pointer text-slate-600 active:bg-slate-50 rounded-b-lg"
        onClick={() => setOpen((prev) => !prev)}
      >
        <p>
          You have been invited to join{" "}
          <span className="font-semibold text-slate-800">
            {invite.workspace.name}
          </span>
          !
        </p>
        <ChevronDown
          className={`h-4 w-4 transition-transform shrink-0 ${
            open && "rotate-180"
          }`}
        />
      </div>

      <div
        className="transition-all duration-200 px-4 overflow-hidden bg-white"
        style={{ height: `${height}px` }}
      >
        <div ref={contentRef} className="py-4 space-y-2 text-sm text-slate-700">
          <p>
            <span className="font-medium">Sender:</span>{" "}
            {invite.sender.firstName} {invite.sender.lastName}
          </p>
          <p className="text-slate-500">
            <span>Sent</span>{" "}
            {formatDistanceToNow(new Date(invite.createdAt), {
              addSuffix: true,
            })}
          </p>

          <div className="flex gap-2 pt-2">
            <Button
              disabled={acceptPending || declinePending}
              variant="outline"
              className="theme-text-gradient min-w-[5rem]"
              size="sm"
              onClick={() => {
                accept({ workspaceId: invite.workspace._id });
              }}
            >
              {acceptPending ? (
                <Loader className="animate-spin text-slate-700" />
              ) : (
                "Accept"
              )}
            </Button>
            <Button
              disabled={acceptPending || declinePending}
              variant="outline"
              size="sm"
              className="min-w-[5rem]"
              onClick={() => decline({ inviteId: invite._id })}
            >
              {declinePending ? (
                <Loader className="animate-spin text-slate-700" />
              ) : (
                "Decline"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
