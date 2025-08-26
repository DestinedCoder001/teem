import { Socket } from "socket.io";
import { ChannelUser } from "../../utils/types";
import { io } from "./socket";

export const channelSocketHandler = (
  socket: Socket,
  user: ChannelUser,
  activeChannelUsers: Record<string, Set<ChannelUser>>
) => {
  const channelTypingUsers: Record<string, Set<ChannelUser>> = {};

  socket.on("connect_channel", (payload) => {
    const { wsId, id } = payload;
    const channelId = `${wsId}-${id}`;

    socket.join(channelId);
    socket.data.channelId = channelId;
    if (!activeChannelUsers[channelId]) {
      activeChannelUsers[channelId] = new Set();
    }
    activeChannelUsers[channelId].add(user!);
    io.to(channelId).emit(
      "active_channel_users",
      Array.from(activeChannelUsers[channelId] || [])
    );
  });

  socket.on("disconnect_channel", (payload) => {
    const data = `${payload.wsId}-${payload.id}`;
    const channelId = socket.data.channelId;
    if (data === channelId) {
      socket.leave(channelId);
      activeChannelUsers[channelId].delete(user!);
      if (activeChannelUsers[channelId].size === 0) {
        delete activeChannelUsers[channelId];
      }

      io.to(channelId).emit(
        "active_channel_users",
        Array.from(activeChannelUsers[channelId] || [])
      );
    }
  });

  socket.on("send_message", (payload) => {
    const { wsId, id, message } = payload;
    const channelId = `${wsId}-${id}`;
    if (channelId !== socket.data.channelId) return;
    socket.broadcast.to(channelId).emit("new_message", message);
  });

  socket.on("delete_message", (messageId) => {
    const channelId = socket.data.channelId;
    if (channelId) {
      socket.broadcast.to(channelId).emit("message_deleted", messageId);
    }
  });

  socket.on("edit_message", (payload) => {
    const { wsId, id, message } = payload;
    const channelId = `${wsId}-${id}`;
    if (channelId !== socket.data.channelId) return;
    io.to(channelId).emit("edited_message", message);
  });

  socket.on("typing", (payload) => {
    const { wsId, id } = payload;
    const channelId = `${wsId}-${id}`;

    if (!channelTypingUsers[channelId]) {
      channelTypingUsers[channelId] = new Set();
    }

    channelTypingUsers[channelId].add(user!);
    socket.broadcast
      .to(channelId)
      .emit("typing_users", Array.from(channelTypingUsers[channelId] || []));
  });

  socket.on("stopped_typing", (payload) => {
    const data = `${payload.wsId}-${payload.id}`;
    const channelId = socket.data.channelId;
    if (data === channelId) {
      channelTypingUsers[channelId].delete(user!);
      if (channelTypingUsers[channelId].size === 0) {
        delete channelTypingUsers[channelId];
      }

      socket
        .to(channelId)
        .emit("typing_users", Array.from(channelTypingUsers[channelId] || []));
    }
  });
};
