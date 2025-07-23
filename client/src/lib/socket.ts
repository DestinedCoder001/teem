import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const createSocket = (token: string) => {
  if (socket) {
    socket.disconnect();
  }
  
  socket = io("http://localhost:3001", {
    auth: {
      token,
    },
    withCredentials: true,
  });

  return socket;
};

export const getSocket = () => socket;
