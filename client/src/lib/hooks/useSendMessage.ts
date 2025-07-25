import { useMutation } from "@tanstack/react-query";
import api from "../axios";
import { currentWsDetails } from "../store/userStore";

const useSendMessage = () => {
    const wsId = currentWsDetails((state) => state._id);
    return useMutation({
        mutationFn: async (payload: { message: string; channelId: string }) => {
            const { data } = await api.post(
                `/${wsId}/${payload.channelId}/send-message`,
                { message: payload.message }
            );
            return data.message;
        },
    });
};

export default useSendMessage;