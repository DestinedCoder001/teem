import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import type { MessageProps } from "@/lib/types";
import { MoreVertical, PenLine, Trash2 } from "lucide-react";
import { useUserStore } from "@/lib/store/userStore";

type Props = {
  message: MessageProps;
  isDeleting: boolean;
  setEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editOpen: boolean;
  handleDelete: () => void;
  handleEdit: () => void;
};
const MsgOptionsDropdown = ({
  message,
  isDeleting,
  setEditOpen,
  editOpen,
  handleDelete,
  handleEdit,
}: Props) => {
  const user = useUserStore((state) => state.user);
  const isSender = user?._id === message.sender._id;
  if (!isSender) return null;
  return (
    <DropdownMenu open={editOpen} onOpenChange={setEditOpen}>
      <DropdownMenuTrigger asChild disabled={isDeleting}>
        <MoreVertical
          className={`absolute text-slate-500 hover:bg-slate-50 hover:border rounded-full p-1 size-6 cursor-pointer top-1/2 -translate-y-1/2 ${
            isSender ? "-left-7" : "-right-7"
          }`}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        onClick={(e) => e.stopPropagation()}
        className="z-50 bg-white/90 backdrop-blur-sm"
      >
        {message.content && (
          <>
            <DropdownMenuItem
              className="cursor-pointer group py-1"
              onClick={handleEdit}
            >
              <PenLine className="mr-2 h-4 w-4 group-hover:text-primary group-focus:text-primary" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem
          className="cursor-pointer group py-1"
          onClick={handleDelete}
        >
          <Trash2 className="mr-2 h-4 w-4 group-hover:text-red-500 group-focus:text-red-500" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MsgOptionsDropdown;
