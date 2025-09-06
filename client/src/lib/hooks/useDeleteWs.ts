import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../axios";
import { currentChannelDetails, currentWsDetails } from "../store/userStore";
import { useWsDeleteAlertOpen } from "../store/uiStore";
import { toast } from "sonner";
import type { CustomAxiosError } from "../types";
import { useNavigate } from "react-router-dom";

const useDeleteWs = () => {
  const { _id, setWorkspaceDetails } = currentWsDetails((state) => state);
  const { setOpen } = useWsDeleteAlertOpen((state) => state);
  const { setChannelDetails } = currentChannelDetails((state) => state);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const resetAndRedirect = () => {
    setWorkspaceDetails({
      _id: "",
      name: "",
      users: [],
      createdBy: "",
      channels: [],
      profilePicture: "",
    });
    setChannelDetails({
      _id: "",
      name: "",
      description: "",
      createdBy: { _id: "", firstName: "", lastName: "", profilePicture: "" },
      members: [],
    });
    navigate("/", { replace: true });
  };

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.delete(`workspaces/${_id}/delete`);
      return data;
    },
    onSuccess: () => {
      setOpen(false);
      toast.success("Workspace deleted successfully", {
        position: "top-center",
      });
      resetAndRedirect();
      queryClient.invalidateQueries({ queryKey: ["get-me"] });
    },
    onError: (err) => {
      const error = err as CustomAxiosError;
      toast.error(error.response?.data.message || "Couldn't delete workspace", {
        position: "top-center",
      });
    },
  });
};

export default useDeleteWs;
