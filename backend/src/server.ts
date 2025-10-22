import express from "express";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route.js";
import usersRoute from "./routes/user.route.js";
import workspacesRoute from "./routes/workspace.route.js";
import channelsRoute from "./routes/channel.route.js";
import messagesRoute from "./routes/message.route.js";
import tasksRoute from "./routes/tasks.route.js";
import uploadsRoute from "./routes/uploads.route.js";
import chatRoute from "./routes/chat.route.js";
import meetingRoute from "./routes/meeting.route.js";
import dotenv from "dotenv";
import { verifyToken } from "./middleware/auth.middleware.js";
import cors from "cors";
import { app, server } from "./lib/socket/socket.js";
import path from "path";

dotenv.config();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

const dirname = path.resolve();

const isProd = process.env.NODE_ENV === "production";
if (isProd) {
  app.use(express.static(path.join(dirname, "..", "client", "dist")));

  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(dirname, "..", "client", "dist", "index.html"));
  });
}

app.use("/api/health", (_, res) => {
  res.send("Ping " + new Date());
});

app.use("/api/auth", authRoute);

app.use("/api", verifyToken);

app.use("/api/users", usersRoute);
app.use("/api/workspaces", workspacesRoute);
app.use("/api/:workspaceId/channels", channelsRoute);
app.use("/api/:workspaceId/:channelId", messagesRoute);
app.use("/api/:workspaceId/tasks", tasksRoute);
app.use("/api/uploads", uploadsRoute);
app.use("/api/:workspaceId/chat", chatRoute);
app.use("/api/:workspaceId/meetings", meetingRoute);

server.listen(3001, "0.0.0.0", () => {
  console.log("Server is running on port 3001");
});
