import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { currentWsDetails } from "@/lib/store/userStore";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useEffect, useState } from "react";

interface Props {
  user: string;
  setUser: (name: string) => void;
}
const AssignesDropdown = ({ user, setUser }: Props) => {
  const { users } = currentWsDetails((state) => state);
  const [name, setName] = useState("");

  useEffect(() => {
    const name = users.find((item) => user === item._id);
    if (name) {
      setName(name?.firstName + " " + name?.lastName);
    } else {
      setName("Select");
    }
  }, [user, users]);

  return (
    <DropdownMenu>
      <DropdownMenuLabel className="-mb-3">Assign to</DropdownMenuLabel>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{name}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[18rem]  md:w-[23rem]">
        <DropdownMenuRadioGroup value={user || ""} onValueChange={setUser}>
          {users?.map((user) => (
            <DropdownMenuRadioItem
              value={user?._id}
              key={user?._id}
              className="font-medium text-slate-600"
            >
              <Avatar className="h-6 w-6 rounded-full cursor-pointer border border-slate-200">
                <AvatarImage src={user?.profilePicture} alt={user?.firstName} />
                <AvatarFallback className="text-slate-600">
                  {user?.firstName[0].toUpperCase() || ""}
                </AvatarFallback>
              </Avatar>
              {user?.firstName} {user?.lastName}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AssignesDropdown;
