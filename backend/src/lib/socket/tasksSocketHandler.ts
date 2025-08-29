import { Socket } from "socket.io";
import { io } from "./socket";

export const tasksSocketHandler = (socket: Socket) => {
  socket.on("create_task", (payload: any) => {
    const wsId = socket.data.wsId;
    if (wsId) {
      io.to(wsId).emit("new_task", payload);
    }
  });

  socket.on("edit_task", (payload: any) => {
    const wsId = socket.data.wsId;
    if (wsId) {
      io.to(wsId).emit("task_edited", payload);
    }
  });

  socket.on("update_task_status", (payload: { taskStatus: string; id: string }) => {
    const wsId = socket.data.wsId;
    if (wsId) {
      io.to(wsId).emit("task_status_update", payload);
    }
  });

  socket.on("delete_task", (payload: string) => {
    const wsId = socket.data.wsId;
    if (wsId) {
      io.to(wsId).emit("task_deleted", payload);
    }
  });
};
