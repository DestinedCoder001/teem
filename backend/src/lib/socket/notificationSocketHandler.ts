import { Socket } from "socket.io";

export const notificationSocketHandler = (socket: Socket) => {
  socket.on("send_channel_notif", (payload) => {
    const wsId = socket.data.wsId;
    socket.to(wsId).emit("new_channel_msg", { ...payload, workspace: wsId });
  });
  socket.on("send_chat_notif", (payload) => {
    const wsId = socket.data.wsId;
    socket.to(wsId).emit("new_chat_msg", { ...payload, workspace: wsId });
  });
};
