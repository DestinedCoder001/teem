import { navlinks } from "@/utils/constants";
import { NavLink, useLocation } from "react-router-dom";
import WsSwitch from "./WsSwitch";
import ChannelsCollapsible from "./ChannelsCollapsible";
import useGetMe from "@/lib/hooks/useGetMe";
import { Skeleton } from "../ui/skeleton";
import { useSidebarOpen } from "@/lib/store/uiStore";
import { PanelLeft } from "lucide-react";

const DesktopSidebar = () => {
  const { isPending } = useGetMe();
  const { pathname } = useLocation();
  const { isOpen, setOpen } = useSidebarOpen((state) => state);

  return (
    <aside
      className={`hidden lg:block border-r border-slate-300 dark:border-neutral-700 bg-slate-50/50 dark:bg-neutral-900 relative transition-all duration-300 ${
        isOpen ? " w-[220px]" : "w-[4.5rem]"
      }`}
    >
      <div
        className={`absolute group text-slate-500 dark:text-slate-100 rounded-md p-2 hover:bg-slate-100 dark:hover:bg-neutral-800 cursor-pointer ${
          isOpen ? " top-4 right-4" : "top-4 left-1/2 -translate-x-1/2"
        }`}
        onClick={() => setOpen(!isOpen)}
      >
        <PanelLeft className="group-hover:text-primary" />
      </div>
      <div className="flex flex-col h-full justify-between w-full overflow-y-auto px-4 pb-4 no-scrollbar">
        <div className="flex flex-col gap-y-6 mt-24 mb-8">
          <ChannelsCollapsible />
          {navlinks.map((link, id) => (
            <NavLink
              to={link.link}
              className={({ isActive }) =>
                `group flex items-center gap-x-6 ${
                  isOpen ? "w-full" : "w-max"
                } p-2 rounded-md text-sm font-medium text-slate-600 hover:text-slate-700 dark:text-slate-100 dark:hover:text-slate-50 transition-colors ${
                  isActive
                    ? "bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/50 dark:to-secondary/50"
                    : "hover:bg-slate-100 dark:hover:bg-neutral-800"
                }`
              }
              key={id}
            >
              <span
                className={`group-hover:text-secondary ${
                  pathname === link.link && "text-secondary"
                }`}
              >
                {link.icon}
              </span>
              {isOpen && <span>{link.label}</span>}
            </NavLink>
          ))}
        </div>
        <div className="my-4">
          {isPending ? <Skeleton className={`${isOpen ? "h-12" : "h-9"} w-full`} /> : <WsSwitch />}
        </div>
      </div>
    </aside>
  );
};

export default DesktopSidebar;
