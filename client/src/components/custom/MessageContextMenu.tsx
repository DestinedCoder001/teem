import React from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "../ui/context-menu";
import type { MessageProps } from "@/lib/types";
import { PenLine, Trash2 } from "lucide-react";
import { useUserStore } from "@/lib/store/userStore";

type Props = {
  message: MessageProps;
  isDeleting: boolean;
  children: React.ReactNode;
  handleDelete: () => void;
  handleEdit: () => void;
};

const MessageContextMenu = ({
  message,
  isDeleting,
  children,
  handleDelete,
  handleEdit,
}: Props) => {
  const user = useUserStore((state) => state.user);
  const isSender = user?._id === message.sender?._id;

  if (!isSender) return <>{children}</>;

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="w-full h-full">{children}</div>
      </ContextMenuTrigger>
      <ContextMenuContent
        onClick={(e) => e.stopPropagation()}
        className="z-50 bg-white/90 dark:bg-neutral-950 backdrop-blur-sm dark:backdrop-blur-none"
      >
        {message.content && (
          <>
            <ContextMenuItem
              className="cursor-pointer group py-1"
              disabled={isDeleting}
              onClick={handleEdit}
            >
              <PenLine className="mr-2 h-4 w-4 group-hover:text-primary group-focus:text-primary" />
              Edit
            </ContextMenuItem>
            <ContextMenuSeparator />
          </>
        )}
        <ContextMenuItem
          className="cursor-pointer group py-1"
          disabled={isDeleting}
          onClick={handleDelete}
        >
          <Trash2 className="mr-2 h-4 w-4 group-hover:text-red-500 group-focus:text-red-500" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default MessageContextMenu;
