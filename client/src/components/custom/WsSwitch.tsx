import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, LogOut } from "lucide-react";
import {
  currentChannelDetails,
  currentWs,
  currentWsDetails,
  useUserTasks,
  useUserWorkspaces,
} from "@/lib/store/userStore";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const WsSwitch = () => {
  const { workspaces } = useUserWorkspaces((state) => state);
  const {
    wsId,
    name: currentWsName,
    setCurrentWs,
    signOut,
  } = currentWs((state) => state);
  const queryClient = useQueryClient();
  const { setWorkspaceDetails } = currentWsDetails((state) => state);
  const { setChannelDetails } = currentChannelDetails((state) => state);
  const { setTasks } = useUserTasks((state) => state);
  const navigate = useNavigate();
  if (!workspaces.length) return null;

  const resetAndRedirect = () => {
    setWorkspaceDetails({
      name: "",
      users: [],
      createdBy: "",
      channels: [],
    });
    setChannelDetails({
      name: "",
      description: "",
    });
    setTasks([]);
    navigate("/", { replace: true });
  };

  const handleToggle = (id: string, name: string) => {
    if (id === wsId) return;
    setCurrentWs({ id, name });
    setChannelDetails({
      name: "",
      description: "",
    });
    setTasks([]);
    navigate("/", { replace: true });
    queryClient.invalidateQueries({ queryKey: ["get-ws-details", id] });
  };

  const handleSignOut = () => {
    signOut();
    resetAndRedirect();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          title={currentWsName}
          variant="ghost"
          className="w-full flex justify-between items-center px-4 py-6 text-slate-600 hover:bg-slate-100 rounded-md"
        >
          <div className="flex items-center space-x-2">
            {wsId && (
              <Avatar className="h-8 w-8 rounded-md border border-primary">
                <AvatarFallback className="rounded-none">
                  {currentWsName[0]?.toUpperCase() || "W"}
                </AvatarFallback>
              </Avatar>
            )}
            <span className="text-xs font-medium">
              {currentWsName?.length > 10
                ? currentWsName.slice(0, 10) + "..."
                : currentWsName || "Select"}
            </span>
          </div>
          <ChevronsUpDown className="h-4 w-4 text-slate-400" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 bg-white text-slate-600 border-slate-200 ml-4 z-[120]">
        {workspaces?.map((ws) => (
          <DropdownMenuItem
            key={ws._id}
            onClick={() => handleToggle(ws._id, ws.name)}
            className="focus:bg-slate-100 cursor-pointer flex items-center space-x-2"
          >
            <Avatar
              className={`h-8 w-8 rounded-md border ${
                ws._id === wsId ? "border-primary" : "border-slate-200"
              }`}
            >
              <AvatarFallback className="rounded-none">
                {ws.name[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span
              className={`text-sm ${
                ws._id === wsId ? "font-bold text-slate-600" : "font-normal"
              }`}
            >
              {ws.name}
            </span>
          </DropdownMenuItem>
        ))}

        {wsId && (
          <>
            <DropdownMenuSeparator className="bg-slate-200 my-2" />
            <DropdownMenuItem
              className="focus:bg-slate-100 cursor-pointer flex items-center space-x-2 group"
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
