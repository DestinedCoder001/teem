import express from "express";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../utils/types";
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
  pingTimeout: 3000,
  pingInterval: 2000,
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  const secret = process.env.JWT_ACCESS_SECRET!;

  if (!token) return next(new Error("Unauthorized token"));

  try {
    const decoded = jwt.verify(token, secret);
    socket.user = decoded as JwtPayload;
    next();
  } catch (err) {
    next(new Error("Unauthorized err"));
  }
});

const activeUsers: { [key: string]: string } = {};
const activeChannelUsers: Record<string, Set<string>> = {};
const channelTypingUsers: Record<string, Set<string>> = {};

io.on("connection", (socket) => {
  const user = socket.user?.UserInfo;

  socket.on("connect_ws", (wsId) => {
    const prevWsId = socket.data.wsId;
    if (prevWsId && prevWsId !== wsId) {
      socket.leave(prevWsId);
    }

    socket.join(wsId);
    socket.data.wsId = wsId;

    activeUsers[socket.id] = user!._id;
    io.to(wsId).emit("active_users", Object.values(activeUsers));
  });

  socket.on("connect_channel", (payload) => {
    const { wsId, id } = payload;
    const channelId = `${wsId}-${id}`;

    socket.join(channelId);
    socket.data.channelId = channelId;
    if (!activeChannelUsers[channelId]) {
      activeChannelUsers[channelId] = new Set();
    }
    activeChannelUsers[channelId].add(user!._id);
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
      activeChannelUsers[channelId].delete(user!._id);
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
    socket.to(channelId).emit("new_message", message);
  });

  socket.on("typing", (payload) => {
    const { wsId, id } = payload;
    const channelId = `${wsId}-${id}`;

    if (!channelTypingUsers[channelId]) {
      channelTypingUsers[channelId] = new Set();
    }

    channelTypingUsers[channelId].add(user!.profilePicture);
    socket
      .to(channelId)
      .emit("typing_users", Array.from(channelTypingUsers[channelId] || []));
  });

  socket.on("stopped_typing", (payload) => {
    const data = `${payload.wsId}-${payload.id}`;
    const channelId = socket.data.channelId;
    if (data === channelId) {
      channelTypingUsers[channelId].delete(user!.profilePicture);
      if (channelTypingUsers[channelId].size === 0) {
        delete channelTypingUsers[channelId];
      }

      socket
        .to(channelId)
        .emit("typing_users", Array.from(channelTypingUsers[channelId] || []));
    }
  });

  // socket.onAny((event, ...args) => {
  //   console.log(event, ...args);
  // });

  socket.on("disconnect", () => {
    const wsId = socket.data.wsId;
    const channelId = socket.data.channelId;
    if (wsId) {
      socket.leave(wsId);
      delete activeUsers[socket.id];
      io.to(wsId).emit("active_users", Object.values(activeUsers));
    }
    if (channelId) {
      socket.leave(channelId);
      activeChannelUsers[channelId]?.delete(user!._id);
      if (activeChannelUsers[channelId]?.size === 0) {
        delete activeChannelUsers[channelId];
      }

      io.to(channelId).emit(
        "active_channel_users",
        Array.from(activeChannelUsers[channelId] || [])
      );
    }
  });
});

export { io, server, app };
