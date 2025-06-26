import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import api from "@/lib/axios";
import { useAuthStore } from "@/lib/store/authStore";
import { useUserStore } from "@/lib/store/userStore";

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
            className="w-8 h-8 rounded-full object-cover outline outline-secondary outline-offset-2 cursor-pointer"
          />
        ) : (
          <div className="rounded-full w-8 h-8 flex items-center justify-center outline-primary outline-offset-2 outline bg-gray-200 font-bold text-sm text-secondary cursor-pointer">
            {user?.firstName[0]}
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className=" -translate-x-2" align="start">
        <DropdownMenuItem className="cursor-pointer hover:bg-red-200">
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer hover:bg-red-200">
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer hover:bg-red-200"
          onClick={handleLogout}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
