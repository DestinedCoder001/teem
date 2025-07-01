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

export const UserIconDropdown = () => {
  const { user } = useUserStore((state) => state);
  const { setAccessToken } = useAuthStore((state) => state);
  const handleLogout = () => {
    api.get("/auth/logout").then(() => {
      setAccessToken(null);
      window.location.href = "/login";
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {user?.profilePicture && user?.profilePicture !== "" ? (
          <img
            src={user?.profilePicture}
            className="w-8 h-8 rounded-full object-cover cursor-pointer hover:opacity-90"
          />
        ) : (
          <div className="rounded-full w-8 h-8 flex items-center justify-center bg-gray-200 font-bold text-sm text-primary cursor-pointer">
            {user?.firstName[0]}
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-2 lg:mr-4" align="start">
        <DropdownMenuItem className="cursor-pointer hover:bg-red-200 gap-2">
          <User className="w-4 h-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer hover:bg-red-200 gap-2">
          <Settings className="w-4 h-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer hover:bg-red-200 gap-2"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
