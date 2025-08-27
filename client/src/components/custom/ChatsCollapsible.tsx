import { NavLink, useLocation } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useEffect, useState } from "react";
import { ChevronDown, MessagesSquare } from "lucide-react";
import {
  currentWsDetails,
  useUserStore,
  useUserWorkspaces,
} from "@/lib/store/userStore";
import useGetWsDetails from "@/lib/hooks/useGetWsDetails";
import { Skeleton } from "../ui/skeleton";
import { useActiveUsers, useSidebarOpen } from "@/lib/store/uiStore";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { clsx } from "clsx";

const ChatsCollapsible = () => {
  const location = useLocation();
  const isActive = location.pathname.includes("chat");
  const [open, setOpen] = useState(false);
  const { users, _id } = currentWsDetails((state) => state);
  const { isPending } = useGetWsDetails();
  const { workspaces } = useUserWorkspaces((state) => state);
  const isSidebarOpen = useSidebarOpen((state) => state.isOpen);
  const activeWsUsers = useActiveUsers((state) => state.activeUsers);
  const me = useUserStore((state) => state.user);

  useEffect(() => {
    setOpen(false);
  }, [_id]);

  const filteredUsers = users.filter((u) => u._id !== me?._id);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      disabled={!_id || !workspaces?.length || !isSidebarOpen}
    >
      <CollapsibleTrigger className="w-full rounded-md">
        <div
          className={`group flex items-center justify-between ${
            isSidebarOpen ? "w-full" : "w-max"
          } px-3 py-2 lg:p-2 cursor-pointer rounded-md text-sm font-medium text-slate-600 hover:text-slate-700 dark:text-slate-100 dark:hover:text-slate-50 transition-colors ${
            isActive
              ? "bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/50 dark:to-secondary/50"
              : "hover:bg-slate-100 dark:hover:bg-neutral-800"
          }`}
        >
          <div className="flex items-center gap-x-3 lg:gap-x-6">
            <span
              className={`group-hover:text-secondary ${
                isActive && "text-secondary"
              }`}
            >
              <MessagesSquare strokeWidth={1.5} />
            </span>
            <span className={`${!isSidebarOpen && "lg:hidden"}`}>Chat</span>
          </div>
          {isSidebarOpen && (
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                open ? "rotate-180" : ""
              }`}
            />
          )}
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent className="pl-4 space-y-2 mt-2">
        {isPending &&
          [1, 2, 3, 4].map((val) => (
            <Skeleton className="h-8 w-full rounded-md" key={val} />
          ))}
        {!isPending &&
          filteredUsers?.map((user) => {
            const isOnline = activeWsUsers.includes(user._id);
            const name = user.firstName + " " + user.lastName;
            const arr = [me?._id, user._id].sort();
            const chatId = `${arr[0]}-${arr[1]}`;

            return (
              <NavLink
                to={`/chat/${chatId}`}
                key={user._id}
                title={name}
                className={({ isActive }) =>
                  clsx(
                    "flex items-center gap-x-2 text-sm font-medium p-2 rounded-md overflow-hidden",
                    "text-slate-500 dark:text-slate-200",
                    "hover:text-slate-600 dark:hover:text-slate-50",
                    !isSidebarOpen ? "lg:hidden" : "",
                    isActive
                      ? "bg-slate-100 dark:bg-neutral-700 dark:hover:bg-slate-800"
                      : "hover:bg-slate-100 dark:hover:bg-neutral-800"
                  )
                }
              >
                <Avatar
                  className={`h-6 w-6 rounded-full border border-slate-200 dark:border-neutral-600 ${
                    isOnline ? "ring ring-secondary" : ""
                  }`}
                >
                  <AvatarImage
                    className="object-cover object-center w-full"
                    src={user?.profilePicture}
                    alt={user?.firstName}
                  />
                  <AvatarFallback className="text-slate-600 dark:text-slate-100 font-medium text-sm">
                    {user?.firstName[0]?.toUpperCase()}
                    {user?.lastName[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="shrink-0 w-5/6 truncate">
                  {name}
                </span>
              </NavLink>
            );
          })}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ChatsCollapsible;
