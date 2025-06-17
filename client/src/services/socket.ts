import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "../types/types";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  API_BASE_URL,
  {
    autoConnect: false,
    withCredentials: true,
    transports: ["websocket"],
  }
);

export const connectSocket = () => {
  socket.connect();
};
