import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../axios";
import { currentWsDetails } from "../store/userStore";
import { useRemoveAlertOpen } from "../store/uiStore";

const useRemoveUser = () => {
  const queryClient = useQueryClient();
  const { _id } = currentWsDetails((state) => state);
  const { setOpen } = useRemoveAlertOpen((state) => state);

  return useMutation({
    mutationFn: async (payload: { userId: string }) => {
      const { data } = await api.post(`workspaces/${_id}/remove-user`, payload);
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
