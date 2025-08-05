import express from "express";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route";
import usersRoute from "./routes/user.route";
import workspacesRoute from "./routes/workspace.route";
import channelsRoute from "./routes/channel.route";
import messagesRoute from "./routes/message.route";
import tasksRoute from "./routes/tasks.route";
import uploadsRoute from "./routes/uploads.route";
import dotenv from "dotenv";
import { verifyToken } from "./middleware/auth.middleware";
import cors from "cors";
import { app, server } from "./lib/socket";
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

// ROUTES
app.use("/api/auth", authRoute);

app.use("/api/users", verifyToken, usersRoute);
app.use("/api/workspaces", verifyToken, workspacesRoute);
app.use("/api/:workspaceId/channels", verifyToken, channelsRoute);
app.use("/api/:workspaceId/:channelId", verifyToken, messagesRoute);
app.use("/api/:workspaceId/tasks", verifyToken, tasksRoute);
app.use("/api/uploads", verifyToken, uploadsRoute);

server.listen(3001, "0.0.0.0", () => {
  console.log("Server is running on port 3001");
});
