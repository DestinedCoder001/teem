import { NavLink, useLocation } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useEffect, useState } from "react";
import { ChevronDown, Rss } from "lucide-react";
import { currentWsDetails, useUserWorkspaces } from "@/lib/store/userStore";
import CreateChannelBtn from "./CreateChannelBtn";
import useGetWsDetails from "@/lib/hooks/useGetWsDetails";
import { Skeleton } from "../ui/skeleton";
import { useSidebarOpen } from "@/lib/store/uiStore";

const ChannelsCollapsible = () => {
  const location = useLocation();
  const isActive = location.pathname.includes("channels");
  const [open, setOpen] = useState(false);
  const { channels, _id } = currentWsDetails((state) => state);
  const { isPending } = useGetWsDetails();
  const { workspaces } = useUserWorkspaces((state) => state);
  const isSidebarOpen = useSidebarOpen((state) => state.isOpen);

  useEffect(() => {
    setOpen(false);
  }, [_id]);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      disabled={!_id || !workspaces?.length || !isSidebarOpen}
    >
      <CollapsibleTrigger className="w-full rounded-md">
        <div
          className={`group flex items-center justify-between ${isSidebarOpen ? "w-full":"w-max"} px-3 py-2 lg:p-2 cursor-pointer rounded-md text-base lg:text-sm font-medium text-slate-600 hover:text-slate-700 dark:text-slate-100 dark:hover:text-slate-50 transition-colors ${
            isActive
              ? "bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/50 dark:to-secondary/50"
              : "hover:bg-slate-100 dark:hover:bg-neutral-800"
          }`}
        >
          <div className="flex items-center gap-x-3 lg:gap-x-6">
            <span className={`group-hover:text-secondary ${isActive && "text-secondary"}`}>
              <Rss strokeWidth={1.5} />
            </span>
            <span className={`${!isSidebarOpen && "lg:hidden"}`}>Channels</span>
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
      {
        isSidebarOpen && 
      <CollapsibleContent className="pl-4 space-y-2 mt-2">
        {isPending &&
          [1, 2, 3, 4].map((val) => (
            <Skeleton className="h-8 w-full rounded-md" key={val} />
          ))}
        {!isPending &&
          channels?.map((channel) => (
            <NavLink
              to={`/channels/${channel?._id}`}
              key={channel?._id}
              title={channel?.name}
              className={({ isActive }) => {
                return isActive
                  ? "block truncate text-base lg:text-sm text-slate-500 bg-slate-100 dark:bg-neutral-700 hover:text-slate-600 dark:text-slate-200 dark:hover:text-slate-50 dark:hover:bg-slate-800 font-medium p-2 rounded-md"
                  : "block truncate text-base lg:text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-600 dark:text-slate-200 dark:hover:text-slate-50 dark:hover:bg-neutral-800 font-medium p-2 rounded-md";
              }}
            >
                {channel?.name}
            </NavLink>
          ))}
        <CreateChannelBtn />
      </CollapsibleContent>
      }
    </Collapsible>
  );
};

export default ChannelsCollapsible;
