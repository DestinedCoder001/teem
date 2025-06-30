import { NavLink } from "react-router-dom";

const DesktopSidebar = () => {
  return (
    <aside className="hidden lg:block w-[220px] min-w-[220px] px-4 pb-4 border-r border-slate-300">
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
    </aside>
  );
};

export default DesktopSidebar;
