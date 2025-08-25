import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreVertical } from "lucide-react";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

type Props = {
  showSignal: boolean;
  setShowSignal: React.Dispatch<React.SetStateAction<boolean>>;
};

const MeetingOptions = ({ showSignal, setShowSignal }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="lg"
          className="p-3 rounded-md bg-[#181A1C] hover:bg-[#080808] text-white"
        >
          <MoreVertical size={28} strokeWidth={2.5} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top">
        <DropdownMenuItem className="flex justify-between items-center">
          <Label>
            Show Network Strength
            <Switch checked={showSignal} onCheckedChange={setShowSignal} />
          </Label>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MeetingOptions;
