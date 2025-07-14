import { useSidebarOpen } from "@/lib/store/uiStore";
import { navlinks } from "@/utils/constants";
import { PanelLeftClose } from "lucide-react";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import { NavLink } from "react-router-dom";
import WsSwitch from "./WsSwitch";
import ChannelsCollapsible from "./ChannelsCollapsible";
import useGetMe from "@/lib/hooks/useGetMe";
import { Skeleton } from "../ui/skeleton";

const MobileSideBar = () => {
  const { isOpen, setOpen } = useSidebarOpen((state) => state);
    const { isFetching } = useGetMe();

  return (
    <Drawer
      open={isOpen}
      onClose={() => setOpen(false)}
      direction="left"
      className="z-50 lg:hidden border-r border-slate-300"
      enableOverlay={false}
      style={{ height: "calc(100vh - 50px)", top: "50px", boxShadow: "none", zIndex: 50 }}
    >
      <PanelLeftClose
        onClick={() => setOpen(false)}
        className="text-black/50 absolute right-4 top-4 cursor-pointer"
      />
      <div className="flex flex-col h-full justify-between w-full overflow-y-auto px-4 no-scrollbar">
        <div className="flex flex-col gap-y-4 mt-24">
          <ChannelsCollapsible />
          {navlinks.map((link, id) => (
            <NavLink
              to={link.link}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-x-3 w-full px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-slate-700 transition-colors ${
                  isActive
                    ? "bg-gradient-to-r from-primary/10 to-secondary/10"
                    : "hover:bg-slate-100"
                }`
              }
              key={id}
            >
              <span className="group-hover:text-secondary">{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="my-8">
          {isFetching ? <Skeleton className="h-12 w-full" /> : <WsSwitch />}
        </div>
      </div>
    </Drawer>
  );
};

export default MobileSideBar;
