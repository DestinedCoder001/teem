import { Link, Outlet } from "react-router-dom";
import logo from "@/assets/teem.png";
import {
  currentWsDetails,
  useUserStore,
  useUserWorkspaces,
} from "@/lib/store/userStore";
import { useEffect } from "react";
import { UserIconDropdown } from "../UserIconDropdown";
import DesktopSidebar from "@/components/custom/DesktopSidebar";
import MobileSideBar from "../MobileSidebar";
import { PanelLeft } from "lucide-react";
import {
  useActiveUsers,
  useSidebarOpen,
  useUserOnline,
} from "@/lib/store/uiStore";
import useGetMe from "@/lib/hooks/useGetMe";
import useGetWsDetails from "@/lib/hooks/useGetWsDetails";
import CreateChannelDialog from "../CreateChannelDialog";
import CreateWorkspaceDialog from "../CreateWorkspaceDialog";
import { useAuthStore } from "@/lib/store/authStore";
import { createSocket, getSocket } from "@/lib/socket";
import PhotoViewer from "../PhotoViewer";

const AppLayout = () => {
  const { setUser } = useUserStore((state) => state);
  const { setWorkspaces } = useUserWorkspaces((state) => state);
  const { isOpen, setOpen } = useSidebarOpen((state) => state);
  const { setWorkspaceDetails, _id } = currentWsDetails();
  const { currentWsData, getCurrentWsSuccess } = useGetWsDetails();
  const { user, workspaces, isSuccess } = useGetMe();
  const token = useAuthStore((state) => state.accessToken);
  const authSocket = getSocket()!;
  const { setIsOnline } = useUserOnline((state) => state);

  useEffect(() => {
    if (isSuccess) {
      setUser(user);
      setWorkspaces(workspaces);
    }
  }, [user, isSuccess, setUser, workspaces, setWorkspaces]);

  useEffect(() => {
    if (isSuccess && getCurrentWsSuccess) {
      setWorkspaceDetails(currentWsData);
    }

    if (authSocket) {
      setIsOnline(true);
      authSocket.emit("connect_ws", _id);
    }

  }, [
    currentWsData,
    getCurrentWsSuccess,
    setWorkspaceDetails,
    isSuccess,
    authSocket,
    _id,
    setIsOnline,
  ]);

  useEffect(() => {
    if (token && _id) {
      const socket = createSocket(token);

      const onConnect = () => {
        if (_id) {
          socket.emit("connect_ws", _id);
          setIsOnline(true);
        }
        console.log("Connected to socket");
      };

      const onDisconnect = () => {
        socket.emit("disconnect_ws", _id);
        setIsOnline(false);
        console.log("Disconnected from socket");
      };

      const handleBeforeUnload = () => {
        socket.emit("disconnect_ws", _id);
      };

      const handleActiveUsers = (data: string[]) => {
        useActiveUsers.getState().setActiveUsers(data);
      }

      socket.on("connect", onConnect);
      socket.on("disconnect", onDisconnect);
      socket.on("active_users", handleActiveUsers);

      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        socket.off("connect", onConnect);
        socket.off("disconnect", onDisconnect);
        socket.off("active_users", handleActiveUsers);

        window.removeEventListener("beforeunload", handleBeforeUnload);

        socket.disconnect();
      };
    }
  }, [token, _id, setIsOnline]);

  const toggleSidebar = () => {
    if (isOpen) return;
    setOpen(true);
  };

  return (
    <>
      <nav className="h-[50px] w-full flex px-4 md:px-8 lg:px-16 items-center justify-between sticky top-0 z-50 border-b border-slate-300 dark:border-neutral-700">
        <PanelLeft
          onClick={toggleSidebar}
          className={`text-black/50 dark:text-slate-100 lg:hidden ${
            isOpen ? "opacity-0 cursor-default" : "cursor-pointer"
          }`}
        />
        <Link to="/">
          <img src={logo} className="w-10 h-10" />
        </Link>
        <UserIconDropdown />
      </nav>
      <div className="flex h-[calc(100dvh-50px)]">
        <DesktopSidebar />
        <MobileSideBar />

        <main className="flex-1 overflow-y-auto relative">
          <CreateWorkspaceDialog />
          <CreateChannelDialog />
          <Outlet />
          <PhotoViewer />
        </main>
      </div>
    </>
  );
};

export default AppLayout;
