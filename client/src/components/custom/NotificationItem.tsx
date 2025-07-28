import { useState, useRef, useEffect } from "react";
import { ChevronDown, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import type { Invite } from "@/lib/types";
import { useUserStore } from "@/lib/store/userStore";
import useAcceptInvite from "@/lib/hooks/useAcceptInvite";
import useDeclineInvite from "@/lib/hooks/useDeclineInvite";

const NotificationItem = ({ invite }: { invite: Invite }) => {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const { isPending: acceptPending, mutate: accept } = useAcceptInvite();
  const { isPending: declinePending, mutate: decline } = useDeclineInvite();
  const { user } = useUserStore((state) => state);

  useEffect(() => {
    if (open && contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [open]);

  const isReceiver = user?._id === invite.receiver._id;

  return (
    <div className="rounded-lg border border-slate-300 overflow-hidden transition-all">
      <div
        className="flex justify-between items-center p-4 cursor-pointer text-slate-600 active:bg-slate-50 rounded-b-lg"
        onClick={() => setOpen((prev) => !prev)}
      >
        {isReceiver ? (
          <p>
            You have been invited to join{" "}
            <span className="font-semibold text-slate-800">
              {invite.workspace.name}
            </span>
            !
          </p>
        ) : (
          <p>
            You sent a join invite for{" "}
            <span className="font-semibold text-slate-800">
              {invite.workspace.name}
            </span>
            !
          </p>
        )}
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
          {isReceiver ? (
            <>
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
            </>
          ) : (
            <>
              <p>
                <span className="font-medium">Reveiver:</span>{" "}
                {invite.receiver.firstName} {invite.receiver.lastName}
              </p>
              <p className="text-slate-500">
                <span>Sent</span>{" "}
                {formatDistanceToNow(new Date(invite.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </>
          )}

          <div className="flex gap-2 pt-2">
            {isReceiver ? (
              <>
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
              </>
            ) : (
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
                  "Cancel"
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
