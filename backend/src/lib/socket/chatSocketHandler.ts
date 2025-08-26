import { Socket } from "socket.io";
import { io } from "./socket";

export const chatSocketHandler = (socket: Socket) => {
  socket.on("chat_typing", (payload) => {
    const wsId = socket.data.wsId;
    const { chatId, wsid } = payload;
    if (wsId !== wsid) return;
    socket.to(wsId).emit("receiver_typing", {
      isTyping: true,
      wsId: socket.data.wsId,
      chatId,
    });
  });

  socket.on("chat_stopped_typing", (payload) => {
    const wsId = socket.data.wsId;
    const { chatId, wsid } = payload;
    if (wsId !== wsid) return;
    socket.to(wsId).emit("receiver_typing", {
      isTyping: false,
      wsId: socket.data.wsId,
      chatId,
    });
  });

  socket.on("send_chat_message", (payload) => {
    const { wsId, chatId, msg } = payload;
    if (socket.data.wsId !== wsId) return;
    socket.to(wsId).emit("new_chat_message", {
      wsId: socket.data.wsId,
      chatId,
      message: msg,
    });
  });

  socket.on("delete_chat_message", (payload) => {
    const { wsId, chatId, messageId } = payload;
    if (socket.data.wsId !== wsId) return;
    socket.to(wsId).emit("chat_message_deleted", {
      wsId: socket.data.wsId,
      chatId,
      messageId,
    });
  });

  socket.on("edit_chat_message", (payload) => {
    const { wsId, chatId, message } = payload;
    if (socket.data.wsId !== wsId) return;
    io.to(wsId).emit("edited_chat_message", {
      wsId: socket.data.wsId,
      chatId,
      message,
    });
  });
};