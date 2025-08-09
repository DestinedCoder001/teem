import { useSidebarOpen } from "@/lib/store/uiStore";
import { navlinks } from "@/utils/constants";
import { PanelLeftClose } from "lucide-react";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import { NavLink, useLocation } from "react-router-dom";
import WsSwitch from "./WsSwitch";
import ChannelsCollapsible from "./ChannelsCollapsible";
import useGetMe from "@/lib/hooks/useGetMe";
import { Skeleton } from "../ui/skeleton";
import { useEffect } from "react";
import { useTheme } from "./ThemeProvider";

const MobileSideBar = () => {
  const { isOpen, setOpen } = useSidebarOpen((state) => state);
  const { isPending } = useGetMe();
  const { pathname } = useLocation();
  const {theme} = useTheme()

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setOpen(false);
    }
  }, [setOpen]);

  return (
    <Drawer
      open={isOpen}
      onClose={() => setOpen(false)}
      direction="left"
      className="z-50 lg:hidden border-r border-slate-300 dark:border-neutral-700 transition-all duration-300"
      enableOverlay={false}
      style={{
        height: "calc(100dvh - 50px)",
        top: "50px",
        boxShadow: "none",
        zIndex: 50,
        background: theme === "light" ? "#f8fafc" : "#171717",
      }}
    >
      <PanelLeftClose
        onClick={() => setOpen(false)}
        className="text-slate-500 dark:text-slate-100 absolute right-4 top-4 cursor-pointer"
      />
      <div className="flex flex-col h-full justify-between w-full overflow-y-auto px-4 no-scrollbar">
        <div className="flex flex-col gap-y-4 mt-24">
          <ChannelsCollapsible />
          {navlinks.map((link, id) => (
            <NavLink
              to={link.link}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-x-3 w-full px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-slate-700 dark:text-slate-100 dark:hover:text-slate-50 transition-colors ${
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
              <span>{link.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="my-8">
          {isPending ? (
            <Skeleton className={`${isOpen ? "h-12" : "h-9"} w-full`} />
          ) : (
            <WsSwitch />
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default MobileSideBar;
