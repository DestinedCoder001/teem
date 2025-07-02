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
import { useUserWorkspaces } from "@/lib/store/uiStore";

const WsSwitch = () => {
  const { workspaces } = useUserWorkspaces((state) => state);

  if (!workspaces.length) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          title={workspaces[0]?.name}
          variant="ghost"
          className="w-full flex justify-between items-center px-4 py-6 text-slate-600 hover:bg-slate-100 rounded-md"
        >
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8 rounded-md border border-slate-200">
              <AvatarFallback className="rounded-none">
                {workspaces[0]?.name[0]?.toUpperCase() || "W"}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium">
              {workspaces[0]?.name.length > 10
                ? workspaces[0]?.name.slice(0, 10) + "..."
                : workspaces[0]?.name}
            </span>
          </div>
          <ChevronsUpDown className="h-4 w-4 text-slate-400" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 bg-white text-slate-600 border-slate-200 ml-4 z-[120]">
        {workspaces?.map((ws) => (
          <DropdownMenuItem
            key={ws._id}
            className="focus:bg-slate-100 cursor-pointer flex items-center space-x-2"
          >
            <Avatar className="h-8 w-8 rounded-md border border-slate-200">
              <AvatarFallback className="rounded-none">
                {ws.name[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{ws.name}</span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator className="bg-slate-200 my-2" />
        <DropdownMenuItem className="focus:bg-slate-100 cursor-pointer flex items-center space-x-2 group">
          <LogOut className="h-4 w-4 text-red-400 group-hover:translate-x-1 transition-transform duration-200" />
          <span>Sign out of workspace</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WsSwitch;
