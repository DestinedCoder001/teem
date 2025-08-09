import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, LogOut, Plus } from "lucide-react";
import {
  currentChannelDetails,
  currentWs,
  currentWsDetails,
  useUserTasks,
  useUserWorkspaces,
} from "@/lib/store/userStore";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useCreateWsDialogOpen, useSidebarOpen } from "@/lib/store/uiStore";
import { getSocket } from "@/lib/socket";

const WsSwitch = () => {
  const { workspaces } = useUserWorkspaces((state) => state);
  const { wsId, setCurrentWs, signOut } = currentWs((state) => state);
  const queryClient = useQueryClient();
  const {
    setWorkspaceDetails,
    profilePicture,
    name: currentWsName,
    _id,
  } = currentWsDetails((state) => state);
  const { setChannelDetails } = currentChannelDetails((state) => state);
  const { setTasks } = useUserTasks((state) => state);
  const navigate = useNavigate();
  const { setOpen } = useCreateWsDialogOpen((state) => state);
  const isSidebarOpen = useSidebarOpen((state) => state.isOpen);
  const authSocket = getSocket()!;

  // if (!workspaces?.length) return null;

  const resetAndRedirect = () => {
    setWorkspaceDetails({
      _id: "",
      name: "",
      users: [],
      createdBy: "",
      channels: [],
      profilePicture: "",
    });
    setChannelDetails({
      _id: "",
      name: "",
      createdBy: { _id: "", firstName: "", lastName: "", profilePicture: "" },
      members: [],
      description: "",
    });
    setTasks([]);
    navigate("/", { replace: true });
  };

  const handleToggle = (id: string, name: string) => {
    if (id === wsId) return;
    setCurrentWs({ id, name });
    setChannelDetails({
      _id: "",
      name: "",
      createdBy: { _id: "", firstName: "", lastName: "", profilePicture: "" },
      members: [],
      description: "",
    });
    setTasks([]);
    navigate("/", { replace: true });
    queryClient.invalidateQueries({ queryKey: ["get-ws-details", id] });
  };

  const handleSignOut = () => {
    authSocket.disconnect();
    signOut();
    resetAndRedirect();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          title={currentWsName}
          style={!isSidebarOpen ? { padding: 0 } : {}}
          variant="ghost"
          className={`flex justify-between items-center ${
            isSidebarOpen ? "px-4 py-6 w-full" : "w-max p-0 mx-auto"
          }  text-slate-600 hover:bg-slate-100 dark:hover:bg-neutral-800 dark:text-slate-100 rounded-md`}
        >
          <div className={`flex items-center ${isSidebarOpen && "space-x-2"}`}>
            {wsId && (
              <Avatar className="h-8 w-8 rounded-md border border-primary">
                <AvatarImage
                  src={profilePicture}
                  alt={currentWsName}
                  className="object-cover object-center w-full"
                />
                <AvatarFallback className="rounded-none">
                  {currentWsName[0]?.toUpperCase() || "W"}
                </AvatarFallback>
              </Avatar>
            )}
            <span
              className={`text-xs font-medium ${!isSidebarOpen && "lg:hidden"}`}
            >
              {currentWsName?.length > 10
                ? currentWsName.slice(0, 10) + "..."
                : currentWsName || "Select"}
            </span>
          </div>
          <ChevronsUpDown
            className={`h-4 w-4 text-slate-400 dark:text-slate-100 ${
              !isSidebarOpen && "lg:hidden"
            }`}
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 bg-white/80 dark:bg-neutral-900 backdrop-blur-sm dark:backdrop-blur-none text-slate-600 ml-4 z-[120]">
        {workspaces.length > 0 &&
          workspaces?.map((ws) => (
            <div key={ws._id}>
              <DropdownMenuItem
                onClick={() => handleToggle(ws._id, ws.name)}
                className="focus:bg-slate-100 cursor-pointer flex items-center space-x-2 dark:hover:bg-neutral-950"
              >
                <Avatar
                  className={`h-8 w-8 rounded-md border ${
                    ws._id === _id ? "border-primary" : "border-slate-200 dark:border-slate-500"
                  }`}
                >
                  <AvatarImage
                    src={ws.profilePicture}
                    alt={ws.name}
                    className="object-cover object-center w-full"
                  />
                  <AvatarFallback className="rounded-none dark:text-slate-100">
                    {ws.name[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span
                  className={`text-sm text-slate-600 dark:text-slate-100 ${
                    ws._id === wsId ? "font-bold" : "font-normal"
                  }`}
                >
                  {ws.name.length > 20 ? ws.name.slice(0, 20) + "..." : ws.name}
                </span>
              </DropdownMenuItem>
            </div>
          ))}

        {workspaces.length < 3 && (
          <DropdownMenuItem
            onClick={() => setOpen(true)}
            className="focus:bg-slate-100 dark:hover:bg-neutral-950 dark:text-slate-100 cursor-pointer flex items-center justify-center space-x-2"
          >
            <Plus strokeWidth={3} />
            <span>New workspace</span>
          </DropdownMenuItem>
        )}

        {_id && (
          <>
            <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
            <DropdownMenuItem
              id="sign-out"
              className="focus:bg-slate-100 dark:text-slate-100 dark:hover:bg-neutral-950 cursor-pointer flex items-center space-x-2 group"
              onClick={() => handleSignOut()}
            >
              <LogOut className="h-4 w-4 text-red-400 group-hover:translate-x-1 transition-transform duration-200" />
              <span>Sign out of workspace</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WsSwitch;
