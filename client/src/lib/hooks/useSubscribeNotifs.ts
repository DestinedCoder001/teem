// hook for subscribing to channel and chat notifications
import { useEffect } from "react";
import { getSocket } from "../socket";
import { useSendNotification } from "@/lib/hooks/useSendNotification";
import { currentWsDetails, useUserStore } from "../store/userStore";

const useSubscribeNotifs = () => {
  type IncomingMessage = {
    workspace: string;
    content: string;
    route: string;
  };
  const { send, requestPermission } = useSendNotification();
  const authSocket = getSocket()!;
  const { _id } = currentWsDetails();
  const me = useUserStore((state) => state.user);

  /* request notification permission in order
   to display channel and chat notifications */
  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  useEffect(() => {
    const handleNewChannelMessage = (
      data: IncomingMessage & { channel: string }
    ) => {
      if (data.workspace !== _id) return;
      send({ title: data.channel, body: data.content, route: data.route });
    };
    const handleNewChatMessage = (
      data: IncomingMessage & { sender: string; receiver: string; icon: string }
    ) => {
      if (data.workspace !== _id || data.receiver !== me?._id) return;
      send({
        title: data.sender,
        body: data.content,
        route: data.route,
        icon: data.icon,
      });
    };
    authSocket?.on("new_channel_msg", handleNewChannelMessage);
    authSocket?.on("new_chat_msg", handleNewChatMessage);
    return () => {
      authSocket?.off("new_channel_msg", handleNewChannelMessage);
      authSocket?.off("new_chat_msg", handleNewChatMessage);
    };
  }, [authSocket, send, _id, me?._id]);
};

export default useSubscribeNotifs;
