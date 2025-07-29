import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerOverlay,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { useState, type Dispatch, type SetStateAction } from "react";
import type { ChannelPayload, ChannelUser } from "@/lib/types";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Loader, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useUserStore } from "@/lib/store/userStore";
import useExitChannel from "@/lib/hooks/useExitChannel";
import useDeleteChannel from "@/lib/hooks/useDeleteChannel";
import EditChannelDialog from "./EditChannelDialog";
import useRemoveMember from "@/lib/hooks/useRemoveMember";

type DrawerProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  channel: ChannelPayload;
  activeUsers: ChannelUser[];
};

const ChannelDrawer = ({
  open,
  setOpen,
  activeUsers,
  channel,
}: DrawerProps) => {
  const navigate = useNavigate();
  const me = useUserStore((state) => state.user);
  const { mutate: exit, isPending: isExitPending } = useExitChannel();
  const { mutate: remove, isPending: removePending } = useRemoveMember();
  const { mutate: deleteChannel, isPending: isDeletePending } =
    useDeleteChannel();
  const [editOpen, setEditOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerOverlay className="bg-black/10 backdrop-blur-[0.75px]" />
      <DrawerContent className="h-[calc(100dvh-100px)] outline-none">
        <DrawerHeader>
          <div className="bg-slate-100 border-2 border-slate-500 rounded-full size-14 flex items-center justify-center mx-auto text-slate-600 font-bold text-xl">
            {channel?.name[0]?.toUpperCase()}
          </div>
          <DrawerTitle className="text-xl theme-text-gradient font-medium w-max text-center mx-auto">
            {channel?.name}
          </DrawerTitle>
          <DrawerDescription className="text-slate-800">
            {channel?.description}
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 py-8 flex flex-col gap-y-4 h-full overflow-auto no-scrollbar">
          <h3 className="text-lg text-slate-600 font-semibold">Members</h3>
          {channel?.members?.map((user) => {
            let name = user.firstName + " " + user.lastName;
            if (name.length > 25) {
              name = name.slice(0, 25) + "...";
            }
            const isOnline = activeUsers.find(
              (activeuser) => activeuser._id === user._id
            );
            return (
              <div
                key={user._id}
                className="bg-white p-4 rounded-md cursor-pointer border"
                title={user.firstName + " " + user.lastName}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Avatar
                      onClick={() => navigate(`/users/${user._id}`)}
                      className={`size-10 rounded-full cursor-pointer border border-slate-200 ${
                        isOnline && "ring ring-offset-1 ring-secondary"
                      }`}
                    >
                      <AvatarImage
                        src={user?.profilePicture}
                        alt={user?.firstName}
                        className="object-cover object-center w-full"
                      />
                      <AvatarFallback className="text-slate-600">
                        {user?.firstName[0].toUpperCase() || ""}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-sm">{name}</p>
                  </div>
                  {me?._id === channel?.createdBy._id &&
                    user._id !== me?._id && (
                      <DropdownMenu>
                        <>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4 text-slate-700" />
                            </Button>
                          </DropdownMenuTrigger>
                        </>
                        <DropdownMenuContent className="-translate-x-8">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              if (removePending) return;
                              remove({ userId: user._id });
                            }}
                            className="cursor-pointer text-red-500 min-w-[8rem]"
                          >
                            {removePending ? (
                              <Loader className="animate-spin mx-auto" />
                            ) : (
                              "Remove member"
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                </div>
              </div>
            );
          })}
          <div className="mt-12 space-y-4">
            <h3 className="text-lg text-slate-600 font-semibold">Actions</h3>
            <div className="rounded-md flex flex-col md:flex-row gap-y-4 items-center justify-between p-4 border">
              <div className="space-y-1">
                <p className="text-lg text-primary font-medium">
                  Edit channel details
                </p>
              </div>
              <Button
                variant="outline"
                disabled={isExitPending || isDeletePending}
                className="w-full sm:w-max theme-text-gradient"
                onClick={() => setEditOpen(true)}
              >
                {isExitPending ? <Loader className="animate-spin" /> : "Edit"}
              </Button>
            </div>
            <div className="rounded-md flex flex-col md:flex-row gap-y-4 items-center justify-between p-4 bg-gradient-to-br from-red-50 to-red-50/50 border">
              <div className="space-y-1">
                <p className="text-lg text-red-500 font-medium">Exit channel</p>
                <p className="text-slate-700 text-sm text-center md:text-left">
                  Exit {channel?.name} and stop participating in discussions.
                  You can rejoin at any time.
                </p>
              </div>
              <Button
                variant="destructive"
                disabled={isExitPending}
                className="w-full sm:w-max"
                onClick={() => exit({ channelId: channel?._id })}
              >
                {isExitPending ? <Loader className="animate-spin" /> : "Exit"}
              </Button>
            </div>
            {me?._id === channel?.createdBy._id && (
              <div className="rounded-md flex flex-col md:flex-row gap-y-4 items-center justify-between p-4 bg-gradient-to-br from-red-50 to-red-50/50 border">
                <div className="space-y-1">
                  <p className="text-lg text-red-500 font-medium">
                    Delete channel
                  </p>
                  <p className="text-slate-700 text-sm text-center md:text-left">
                    Delete {channel?.name} and remove all discussions. This
                    action cannot be undone.
                  </p>
                </div>
                <Button
                  variant="destructive"
                  disabled={isDeletePending}
                  className="w-full sm:w-max"
                  onClick={() => deleteChannel({ channelId: channel?._id })}
                >
                  {isDeletePending ? (
                    <Loader className="animate-spin" />
                  ) : (
                    "Delete"
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
        <EditChannelDialog
          open={editOpen}
          setOpen={setEditOpen}
          defaultValues={{
            name: channel?.name,
            description: channel?.description,
          }}
        />
      </DrawerContent>
    </Drawer>
  );
};

export default ChannelDrawer;
