import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { currentWsDetails, userToBeRemoved } from "@/lib/store/userStore";
import { Loader, MoreHorizontal } from "lucide-react";
import { useUpdateWsDp } from "@/lib/hooks/useUpdateWsDp";
import { useUpdateWsName } from "@/lib/hooks/useUpdateWsName";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRemoveAlertOpen } from "@/lib/store/uiStore";

const WorkspaceSettings = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    users,
    name: currentWsName,
    profilePicture,
    _id,
  } = currentWsDetails((state) => state);
  const [workspaceImage, setWorkspaceImage] = useState("");
  const { mutate, isPending } = useUpdateWsDp();
  const { mutate: updateWsName, isPending: nameUpdatePending } =
    useUpdateWsName();
  const [newWsName, setNewWsName] = useState("");
  const { setOpen } = useRemoveAlertOpen((state) => state);
  const { setUser } = userToBeRemoved((state) => state);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setWorkspaceImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    if (isPending) {
      return;
    }
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    setNewWsName(currentWsName);
  }, [currentWsName]);

  useEffect(() => {
    if (workspaceImage) {
      mutate({ file: workspaceImage, workspaceId: _id as string });
    }
  }, [workspaceImage]);

  const handleNameChange = () => {
    if (newWsName && newWsName.trim().length > 0) {
      updateWsName({ name: newWsName, workspaceId: _id as string });
    }
  };

  return (
    <>
      <h2 className="text-xl font-medium">Workspace</h2>
      <p className="text-slate-600 my-1 text-sm">
        Manage your workspace settings and members.
      </p>
      <div className="flex flex-col gap-y-4 md:grid md:grid-cols-2 xl:grid-cols-8 md:gap-x-4 my-4 lg:h-[18rem]">
        <div className="space-y-10 md:col-span-1 xl:col-span-5 border border-slate-300 p-4 rounded-lg">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="size-18 rounded-md border font-bold text-lg">
              <AvatarImage
                src={workspaceImage || profilePicture}
                alt={currentWsName}
                className={`object-cover object-center w-full ${
                  isPending && "grayscale-75"
                }`}
              />
              {isPending && (
                <Loader className="animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
              )}
              <AvatarFallback className="rounded-md">
                {currentWsName[0]?.toUpperCase() || "W"}
              </AvatarFallback>
            </Avatar>

            <p className="tracking-wide text-lg">{currentWsName}</p>

            <div className="flex flex-col items-center gap-2">
              <Button
                variant="outline"
                className="theme-text-gradient"
                onClick={triggerFileInput}
                disabled={isPending || nameUpdatePending}
              >
                Upload New Image
              </Button>
              <Input
                id="imageUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                ref={fileInputRef}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="workspaceName">Workspace Name</Label>
            <div className="flex items-center gap-x-4">
              <Input
                id="workspaceName"
                value={newWsName}
                onChange={(e) => setNewWsName(e.target.value)}
                placeholder="Enter workspace name"
              />
              <Button
                variant="default"
                onClick={handleNameChange}
                className="min-w-[5rem]"
                disabled={nameUpdatePending || isPending}
              >
                {nameUpdatePending ? (
                  <Loader className="animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="md:col-span-1 xl:col-span-3 border border-slate-300 rounded-lg overflow-hidden h-[20rem] lg:h-auto">
          <div className="border-b border-slate-300 p-4 flex justify-between items-center">
            <h2 className="font-medium text-gray-700">Members</h2>
          </div>
          <div className="overflow-auto no-scrollbar px-4 pt-4 pb-20 bg-gray-50/50 flex flex-col gap-y-2 h-full">
            {users?.map((user) => {
              let name = user.firstName + " " + user.lastName;
              if (name.length > 25) {
                name = name.slice(0, 25) + "...";
              }
              return (
                <div
                  key={user._id}
                  className="bg-white p-4 rounded-md border border-slate-300"
                  title={user.firstName + " " + user.lastName}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6 rounded-full cursor-pointer border border-slate-200">
                        <AvatarImage
                          src={user?.profilePicture}
                          alt={user?.firstName}
                          className="object-cover object-center w-full"
                        />
                        <AvatarFallback className="text-slate-600">
                          {user?.firstName[0].toUpperCase() || ""}
                        </AvatarFallback>
                      </Avatar>
                      <p>{name}</p>
                    </div>

                    <DropdownMenu>
                      <>
                        <DropdownMenuTrigger asChild disabled={isPending || nameUpdatePending}>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4 text-slate-700" />
                          </Button>
                        </DropdownMenuTrigger>
                      </>
                      <DropdownMenuContent
                        className="-translate-x-8
                      "
                      >
                        <DropdownMenuItem
                          onClick={() => {
                            setUser(user);
                            setOpen(true);
                          }}
                          className="cursor-pointer text-red-500"
                        >
                          Remove User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkspaceSettings;
