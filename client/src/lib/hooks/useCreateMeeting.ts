import { useMutation } from "@tanstack/react-query";
import api from "../axios";
import { currentWsDetails } from "../store/userStore";
import { toast } from "sonner";

const useCreateMeeting = () => {
    const { _id } = currentWsDetails((state) => state);
    return useMutation({
      mutationFn: async (payload: { title: string; allowedUsers: string[] }) => {
        const { data } = await api.post(`/${_id}/meetings/create-meeting`, payload);
        return data;
      },
      onSuccess: () => {
        toast.success("Meeting created successfully", { position: "top-center" });
      },
      onError: () => {
        toast.error("Couldn't create meeting", { position: "top-center" });
      }
    });
}

export default useCreateMeeting;
