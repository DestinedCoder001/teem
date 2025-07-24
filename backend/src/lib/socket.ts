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
  pingTimeout: 5000,
  pingInterval: 2500,
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
    console.log(user?.firstName, "Connected to ws", wsId);
  });

  socket.on("disconnect", () => {
    const wsId = socket.data.wsId;
    if (wsId) {
      socket.leave(wsId);
      delete activeUsers[socket.id];
      io.to(wsId).emit("active_users", Object.values(activeUsers));
      console.log(user?.firstName, "Auto disconnected from ws", wsId);
    }
  });
});

export { io, server, app };
