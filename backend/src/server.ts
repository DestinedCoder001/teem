import express from "express";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route";
import usersRoute from "./routes/users.route";
import workspacesRoute from "./routes/workspace.route";
import channelsRoute from "./routes/channel.route";
import dotenv from "dotenv";
import { verifyToken } from "./middleware/auth.middleware";

dotenv.config();
const app = express();

app.use(cookieParser());
app.use(express.json());

// ROUTES
app.use("/api/auth", authRoute);

app.use((req, res, next) => {
  verifyToken(req, res, next);
});

app.use("/api/users", usersRoute);

app.use("/api/workspaces", workspacesRoute);
app.use("/api/:workspaceId/channels", channelsRoute);

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
