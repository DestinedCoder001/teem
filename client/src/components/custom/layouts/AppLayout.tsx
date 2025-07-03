import { Link, Outlet } from "react-router-dom";
import logo from "@/assets/teem.png";
import { currentWsDetails, useUserStore, useUserWorkspaces } from "@/lib/store/userStore";
import { useEffect } from "react";
import { UserIconDropdown } from "../UserIconDropdown";
import DesktopSidebar from "@/components/custom/DesktopSidebar";
import MobileSideBar from "../MobileSidebar";
import { PanelLeft } from "lucide-react";
import { useSidebarOpen } from "@/lib/store/uiStore";
import useGetWs from "@/lib/hooks/useGetWs";
import useGetMe from "@/lib/hooks/useGetMe";
import useGetWsDetails from "@/lib/hooks/useGetWsDetails";
import CreateChannelDialog from "../CreateChannelDialog";

const AppLayout = () => {
  const { setUser } = useUserStore((state) => state);
  const { setWorkspaces } = useUserWorkspaces((state) => state);
  const { isOpen, setOpen } = useSidebarOpen((state) => state);
  const { wsData, getWsSuccess } = useGetWs();
  const { setWorkspaceDetails } = currentWsDetails();
  const { currentWsData, getCurrentWsSuccess } = useGetWsDetails();
  const { data, isSuccess } = useGetMe();


  useEffect(() => {
    if (isSuccess) {
      setUser(data);
    }
  }, [data, isSuccess, setUser]);

  useEffect(() => {
    if (getWsSuccess) {
      setWorkspaces(wsData);
    }
  }, [getWsSuccess, wsData, setWorkspaces]);

  useEffect(() => {
    if (getWsSuccess && getCurrentWsSuccess) {
      setWorkspaceDetails(currentWsData);
    }
  }, [currentWsData, getCurrentWsSuccess, setWorkspaceDetails, getWsSuccess]);

  const toggleSidebar = () => {
    if (isOpen) return;
    setOpen(true);
  };

  return (
    <>
      <nav className="h-[50px] w-full flex px-4 md:px-8 lg:px-16 items-center justify-between sticky top-0 bg-white z-50 border-b border-slate-300">
        <PanelLeft
          onClick={toggleSidebar}
          className={`text-black/50 lg:hidden ${
            isOpen ? "opacity-0 cursor-default" : "cursor-pointer"
          }`}
        />
        <Link to="/">
          <img src={logo} className="w-10 h-10" />
        </Link>
        <UserIconDropdown />
      </nav>
      <div className="flex h-[calc(100vh-50px)]">
        <DesktopSidebar />
        <MobileSideBar />

        <main className="flex-1 overflow-y-auto relative">
          <CreateChannelDialog />
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default AppLayout;
