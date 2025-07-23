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
  activeUsers[socket.id] = user!._id;
  io.emit("active_users", Object.values(activeUsers));

  socket.on("disconnect", () => {
    delete activeUsers[socket.id];
    io.emit("active_users", Object.values(activeUsers));
  });
});

export { io, server, app };
