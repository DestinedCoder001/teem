import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const createSocket = (token: string) => {
  if (socket) {
    socket.disconnect();
  }
  
  socket = io(`${import.meta.env.VITE_BACKEND_URL}`, {
    auth: {
      token,
    },
    withCredentials: true,
  });

  return socket;
};

export const getSocket = () => socket;
