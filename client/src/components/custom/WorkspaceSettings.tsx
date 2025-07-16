import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { currentWs, currentWsDetails } from "@/lib/store/userStore";
import { Checkbox } from "../ui/checkbox";
import { Loader, Trash, XIcon } from "lucide-react";
import { useUpdateWsDp } from "@/lib/hooks/useUpdateWsDp";

const WorkspaceSettings = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    users,
    name: currentWsName,
    profilePicture,
  } = currentWsDetails((state) => state);
  const { wsId } = currentWs((state) => state);
  const [workspaceImage, setWorkspaceImage] = useState("");
  const [usersToRemove, setUsersToRemove] = useState<string[]>([]);
  const [isManagingUsers, setIsManagingUsers] = useState(false);
  const { mutate, isPending } = useUpdateWsDp();

  const handleRemoveUser = (userId: string) => {
    if (usersToRemove.includes(userId)) {
      setUsersToRemove((prevUsers) => prevUsers.filter((id) => id !== userId));
      return;
    }
    setUsersToRemove((prevUsers) => [...prevUsers, userId]);
  };

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
    if (workspaceImage) {
      mutate({ file: workspaceImage, workspaceId: wsId as string });
    }
  }, [workspaceImage]);

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
            <Input
              id="workspaceName"
              value={currentWsName}
              // onChange={(e) => setWorkspaceName(e.target.value)}
              placeholder="Enter workspace name"
            />
          </div>
        </div>

        <div className="md:col-span-1 xl:col-span-3 border border-slate-300 rounded-lg overflow-hidden h-[20rem] lg:h-auto">
          <div className="border-b border-slate-300 p-4 flex justify-between items-center">
            <h2 className="font-medium text-gray-700">Members</h2>
            {!isManagingUsers && (
              <Button
                variant="outline"
                size="sm"
                className={!isManagingUsers ? "theme-text-gradient" : ""}
                onClick={() => setIsManagingUsers(!isManagingUsers)}
              >
                {isManagingUsers ? <Trash /> : "Manage"}
              </Button>
            )}
            {isManagingUsers && (
              <div className="flex items-center gap-x-1">
                <Button variant="destructive" size="sm">
                  <Trash />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setUsersToRemove([]);
                    setIsManagingUsers(false);
                  }}
                >
                  <XIcon />
                </Button>
              </div>
            )}
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
                  <div className="flex items-center gap-2">
                    {isManagingUsers && (
                      <Checkbox
                        checked={usersToRemove.includes(user._id)}
                        onCheckedChange={() => handleRemoveUser(user._id)}
                      />
                    )}
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
