// socket/types.ts
import { CHAT_TYPE, Message, User } from "@prisma/client";
import { Server, Socket } from "socket.io";

export interface ServerToClientEvents {
  receive_message: (data: Message) => void;
  add_to_active_users: (data: User) => void;
  remove_from_active_users: (data: User) => void;
  active_users_list: (users: User[]) => void;
  room_joined: (data: { chatId: string }) => void;
  chat_created: () => void;
  chat_updated: () => void;
  error_occurred: (message: { message: string }) => void;
  connect_error: (error: Error) => void;
  friend_requests_updated: () => void;
  friends_updated: () => void;
  messages_updated: () => void;
}

export interface ClientToServerEvents {
  send_message: (data: Message) => void;
  join_room: (data: { chatId: string; chatType: CHAT_TYPE }) => void;
  leave_room: (data: { chatId: string; chatType: CHAT_TYPE }) => void;
  add_to_active_users: (data: User) => void;
  remove_from_active_users: (data: User) => void;
  active_users_list: (users: User[]) => void;
}

export type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents>;
export type TypedIO = Server<ClientToServerEvents, ServerToClientEvents>;

type SocketHandler<T = any> = (
  socket: TypedSocket,
  io: TypedIO,
  data: T
) => Promise<void>;

export const catchAsyncSocket =
  <T = any>(handler: SocketHandler<T>): SocketHandler<T> =>
  async (socket, io, data) => {
    try {
      await handler(socket, io, data);
    } catch (err) {
      console.error("Socket error:", err);
      socket.emit("error_occurred", {
        message: "An internal error occurred.",
      });
    }
  };
