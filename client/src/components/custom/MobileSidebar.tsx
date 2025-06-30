import { useSidebarOpen } from "@/lib/store/uiStore";
import { PanelLeftClose } from "lucide-react";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import { NavLink } from "react-router-dom";

const MobileSideBar = () => {
  const { isOpen, setOpen } = useSidebarOpen((state) => state);
  return (
    <Drawer
      open={isOpen}
      onClose={() => setOpen(false)}
      direction="left"
      className="z-50 lg:hidden border-r border-slate-300"
      enableOverlay={false}
      style={{height: "calc(100vh - 50px)", top: "50px", boxShadow: "none"}}
    >
      <PanelLeftClose onClick={() => setOpen(false)} className="text-black/50 absolute right-4 top-4" />
      <div className="flex flex-col gap-y-4 mt-24">
        <NavLink
          to="c"
          className={({ isActive }) =>
            `flex items-center justify-between w-full px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors ${
              isActive ? "bg-slate-100 text-primary" : ""
            }`
          }
        >
          Channels
        </NavLink>
        <NavLink
          to="c"
          className={({ isActive }) =>
            `flex items-center justify-between w-full px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors ${
              isActive ? "bg-slate-100 text-primary" : ""
            }`
          }
        >
          Channels
        </NavLink>
        <NavLink
          to="c"
          className={({ isActive }) =>
            `flex items-center justify-between w-full px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors ${
              isActive ? "bg-slate-100 text-primary" : ""
            }`
          }
        >
          Channels
        </NavLink>
      </div>
    </Drawer>
  );
};

export default MobileSideBar;
