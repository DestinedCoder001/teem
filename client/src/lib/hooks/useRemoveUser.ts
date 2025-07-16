import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../axios";
import { currentWs } from "../store/userStore";
import { useRemoveAlertOpen } from "../store/uiStore";

const useRemoveUser = () => {
  const queryClient = useQueryClient();
  const { wsId } = currentWs((state) => state);
  const { setOpen } = useRemoveAlertOpen((state) => state);

  return useMutation({
    mutationFn: async (payload: { userId: string }) => {
      const { data } = await api.post(
        `workspaces/${wsId}/remove-user`,
        payload
      );
      return data;
    },
    onSuccess: () => {
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["get-ws-details"] });
      toast.success("User removed successfully", { position: "top-center" });
    },
    onError: () => {
      toast.error("Couldn't remove user", { position: "top-center" });
    },
  });
};

export default useRemoveUser;
