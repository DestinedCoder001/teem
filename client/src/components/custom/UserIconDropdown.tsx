import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import api from "@/lib/axios";
import { useAuthStore } from "@/lib/store/authStore";
import { useUserStore } from "@/lib/store/userStore";
import { LogOut, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useNavigate } from "react-router-dom";
import { useUserOnline } from "@/lib/store/uiStore";

export const UserIconDropdown = () => {
  const { user } = useUserStore((state) => state);
  const { setAccessToken } = useAuthStore((state) => state);
  const navigate = useNavigate();
  const handleLogout = () => {
    api.get("/auth/logout").then(() => {
      setAccessToken(null);
      window.location.href = "/login";
    });
  };
  const isOnline = useUserOnline.getState().isOnline;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className={`h-8 w-8 rounded-full cursor-pointer border border-slate-200 ${isOnline && "ring ring-offset-1 ring-secondary"}`}>
          <AvatarImage
            src={user?.profilePicture}
            alt={user?.firstName}
            className="object-cover object-center w-full"
          />
          <AvatarFallback className="text-slate-600">
            {user?.firstName[0].toUpperCase() || ""}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-2 lg:mr-4 bg-white/80 backdrop-blur-sm" align="start">
        <DropdownMenuItem
          className="cursor-pointer text-slate-600 font-medium gap-2"
          onClick={() => navigate("/profile")}
        >
          <User className="w-4 h-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-slate-600 font-medium gap-2"
          onClick={() => navigate("/settings")}
        >
          <Settings className="w-4 h-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-slate-600 font-medium gap-2"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
