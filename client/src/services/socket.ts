import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "../types/types";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  API_BASE_URL,
  {
    autoConnect: false,
    transports: ["websocket"],
  }
);

export const connectSocket = () => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    socket.auth = { token };
  }
  socket.connect();
};
