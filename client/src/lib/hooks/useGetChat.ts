import { useQuery } from "@tanstack/react-query"
import api from "../axios";
import { currentWsDetails } from "../store/userStore";

const useGetChat = (chatId: string) => {
    const wsId = currentWsDetails((state) => state._id);
    return useQuery({
        queryKey: ["get-chat", chatId],
        queryFn: async () => {
            const res = await api.get(`/${wsId}/chat/get-chats/${chatId}`);
            return res.data.chat;
        },
        enabled: !!wsId,
        retry: false,
        refetchOnWindowFocus: false,
    });
}

export default useGetChat