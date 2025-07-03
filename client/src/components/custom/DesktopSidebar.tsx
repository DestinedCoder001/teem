import { navlinks } from "@/utils/constants";
import { NavLink } from "react-router-dom";
import WsSwitch from "./WsSwitch";
import ChannelsCollapsible from "./ChannelsCollapsible";

const DesktopSidebar = () => {
  return (
    <aside className="hidden lg:block w-[220px] min-w-[220px] border-r border-slate-300 bg-slate-50/50">
      <div className="flex flex-col h-full justify-between w-full overflow-y-auto px-4 pb-4 no-scrollbar">
        <div className="flex flex-col gap-y-6 mt-24 mb-8">
          <ChannelsCollapsible />
          {navlinks.map((link, id) => (
            <NavLink
              to={link.link}
              className={({ isActive }) =>
                `group flex items-center gap-x-6 w-full p-2 rounded-md text-sm font-medium text-slate-600 hover:text-slate-700 transition-colors ${
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
        <div className="my-4">
          <WsSwitch />
        </div>
      </div>
    </aside>
  );
};

export default DesktopSidebar;
