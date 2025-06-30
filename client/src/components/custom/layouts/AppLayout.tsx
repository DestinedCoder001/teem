import { Link, Outlet } from "react-router-dom";
import logo from "@/assets/teem.png";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@/lib/types";
import { useUserStore } from "@/lib/store/userStore";
import { useEffect } from "react";
import { UserIconDropdown } from "../UserIconDropdown";
import DesktopSidebar from "@/components/custom/DesktopSidebar";
import MobileSideBar from "../MobileSidebar";
import { PanelLeft } from "lucide-react";
import { useSidebarOpen } from "@/lib/store/uiStore";

const AppLayout = () => {
  const { setUser } = useUserStore((state) => state);
  const { isOpen, setOpen } = useSidebarOpen((state) => state);

  const { data, isSuccess } = useQuery({
    queryKey: ["get-me"],
    queryFn: async () => {
      const res = await api.get("/users/me");
      return res.data.user as User;
    },
    retry: false,
  });

  useEffect(() => {
    if (isSuccess) {
      setUser(data);
    }
  }, [data, isSuccess, setUser]);

  const toggleSidebar = () => {
    if (isOpen) return;
    setOpen(true)
  }

  return (
    <>
      <nav className="h-[50px] w-full flex px-4 md:px-8 lg:px-16 items-center justify-between sticky top-0 bg-white z-50 border-b border-slate-300">
        <PanelLeft onClick={toggleSidebar} className={`text-black/50 lg:hidden ${isOpen && "opacity-0"}`} />
        <Link to="/">
          <img src={logo} className="w-10 h-10" />
        </Link>
        <UserIconDropdown />
      </nav>
      <div className="flex h-[calc(100vh-50px)]">
        <DesktopSidebar />
        <MobileSideBar />

        <main className="flex-1 overflow-y-auto relative">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default AppLayout;
