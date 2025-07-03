import { NavLink, useLocation } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { ChevronDown, Rss } from "lucide-react";
import { currentWsDetails } from "@/lib/store/userStore";
import CreateChannelBtn from "./CreateChannelBtn";
import useGetWsDetails from "@/lib/hooks/useGetWsDetails";
import { Skeleton } from "../ui/skeleton";

const ChannelsCollapsible = () => {
  const location = useLocation();
  const isActive = location.pathname.includes("channels");
  const [open, setOpen] = useState(false);
  const { channels } = currentWsDetails((state) => state);
  const { isPending } = useGetWsDetails();

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="w-full rounded-md">
        <div
          className={`group flex items-center justify-between w-full px-3 py-2 lg:p-2 cursor-pointer rounded-md text-sm font-medium text-slate-600 hover:text-slate-700 transition-colors ${
            isActive
              ? "bg-gradient-to-r from-primary/10 to-secondary/10"
              : "hover:bg-slate-100"
          }`}
        >
          <div className="flex items-center gap-x-3 lg:gap-x-6">
            <span className="group-hover:text-secondary">
              <Rss />
            </span>
            <span>Channels</span>
          </div>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </CollapsibleTrigger>
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
                  ? "block text-sm text-slate-500 bg-slate-100 font-medium p-2 rounded-md"
                  : "block text-sm text-slate-500 hover:bg-slate-100 font-medium p-2 rounded-md";
              }}
            >
              {channel?.name.length > 15
                ? channel?.name.slice(0, 15) + "..."
                : channel?.name}
            </NavLink>
          ))}
        <CreateChannelBtn />
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ChannelsCollapsible;
