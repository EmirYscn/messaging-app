// socket/types.ts
import { Server, Socket } from "socket.io";

export interface ServerToClientEvents {
  receive_message: (message: any) => void;
}

export interface ClientToServerEvents {
  join_room: (data: { chatId: string }) => void;
  send_message: (data: any) => void;
}

export type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents>;
export type TypedIO = Server<ClientToServerEvents, ServerToClientEvents>;
