import express from "express";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { ChannelUser, JwtPayload } from "../../utils/types";
import { channelSocketHandler } from "./channelSocketHandler";
import { chatSocketHandler } from "./chatSocketHandler";
import { tasksSocketHandler } from "./tasksSocketHandler";
import { notificationSocketHandler } from "./notificationSocketHandler";
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
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
const activeChannelUsers: Record<string, Set<ChannelUser>> = {};

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

  channelSocketHandler(socket, user!, activeChannelUsers);
  chatSocketHandler(socket);
  tasksSocketHandler(socket);
  notificationSocketHandler(socket);

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
      activeChannelUsers[channelId]?.delete(user!);
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
