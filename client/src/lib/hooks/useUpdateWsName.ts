import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "sonner";
import { useUserWorkspaces } from "../store/userStore";

export const useUpdateWsName = () => {
  const queryClient = useQueryClient();
  const { workspaces, setWorkspaces } = useUserWorkspaces((state) => state);
  return useMutation({
    mutationFn: async (payload: { name: string; workspaceId: string }) => {
      const { data } = await api.patch("/workspaces/edit-name", payload);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["get-ws-details"] });
      toast.success("Workspace name updated successfully", {
        position: "top-center",
      });
      const newWorkSpaces = workspaces.map((ws) => {
        if (ws._id === data.workspace._id) {
          return data.workspace;
        } else {
          return ws;
        }
      });
      setWorkspaces(newWorkSpaces);
    },
    onError: () => {
      toast.error("Couldn't update workspace name", { position: "top-center" });
    },
  });
};
