import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    ChevronsUpDown,
    Sparkles,
    User,
    CreditCard,
    Bell,
    LogOut,
} from "lucide-react";
import { useUserStore } from "@/lib/store/userStore";

const WsSwitch = () => {
  const { user } = useUserStore((state) => state);
  const currentUser = {
    name: "shadcn",
    email: "m@example.com",
    avatarUrl:
      user?.profilePicture ||
      "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?semt=ais_hybrid&w=740",
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full flex justify-between items-center px-4 py-6 text-slate-600 hover:bg-slate-100 rounded-md"
        >
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8 rounded-md border border-slate-200">
              <AvatarImage src={currentUser.avatarUrl} alt="@shadcn" />
              <AvatarFallback>{user?.firstName[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">{currentUser.name}</span>
              <span className="text-xs text-slate-500">{currentUser.email}</span>
            </div>
          </div>
          <ChevronsUpDown className="h-4 w-4 text-slate-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white text-slate-600 border-slate-200 ml-4 z-[120]">
        <DropdownMenuLabel>
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8 rounded-md border border-slate-200">
              <AvatarImage src={currentUser.avatarUrl} alt="@shadcn" />
              <AvatarFallback>{user?.firstName[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{currentUser.name}</span>
              <span className="text-xs text-slate-500">{currentUser.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-200" />

        <DropdownMenuGroup>
          <DropdownMenuItem className="focus:bg-slate-100 cursor-pointer">
            <Sparkles className="mr-2 h-4 w-4" />
            <span>Upgrade to Pro</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="focus:bg-slate-100 cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Account</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="focus:bg-slate-100 cursor-pointer">
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="focus:bg-slate-100 cursor-pointer">
            <Bell className="mr-2 h-4 w-4" />
            <span>Notifications</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-slate-200" />
        <DropdownMenuItem className="focus:bg-slate-100 cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WsSwitch;