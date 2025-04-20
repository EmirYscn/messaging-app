import { CHAT_TYPE, Message, User } from "@prisma/client";
import * as messageQueries from "../db/message.queries";
import { v4 as uuidv4 } from "uuid";
import { TypedIO, TypedSocket } from "../sockets/types";
import { userSocketMap } from "../sockets/socketRegistry";

export const sendMessage = async (
  socket: TypedSocket,
  io: TypedIO,
  data: Message
) => {
  const user = socket.data.user as User;
  console.log(
    `User with DBID: ${user.id} sent message: ${data.content} to chat: ${data.chatId}`
  );
  // 1) Store message in database
  const createdMessage = await messageQueries.createMessage(data);
  // 2) Emit message
  io.to(data.chatId).emit("receive_message", createdMessage);
};

export const joinRoom = async (
  socket: TypedSocket,
  io: TypedIO,
  data: { chatId: string; chatType: CHAT_TYPE }
) => {
  const user = socket.data.user as User;

  console.log(`User with DBID: ${user.id} joined room: ${data.chatId}`);

  socket.join(data.chatId);
  socket.emit("room_joined", { chatId: data.chatId });
  // Fetch all sockets in the room
  const roomSockets = await io.in(data.chatId).fetchSockets(); // gets all sockets in the room
  // Map each socket to its user data
  const activeUsers = roomSockets.map((s) => s.data.user);
  // Deduplicate active users based on user.id
  // const userMap = new Map<string, User>();
  // roomSockets.forEach((s) => {
  //   const socketUser = s.data.user as User;
  //   if (!userMap.has(socketUser.id)) {
  //     userMap.set(socketUser.id, socketUser);
  //   }
  // });

  // const activeUsers = Array.from(userMap.values());

  if (data.chatType === "GROUP" || data.chatType === "PUBLIC") {
    // Send active users to the newly joined user
    socket.emit("active_users_list", activeUsers);

    // Notify others in the room about the new user
    socket.to(data.chatId).emit("add_to_active_users", user);
  }
};

export const leaveRoom = async (
  socket: TypedSocket,
  io: TypedIO,
  data: { chatId: string; chatType: CHAT_TYPE }
) => {
  const user = socket.data.user as User;
  console.log(`User with DBID: ${user.id} left room: ${data.chatId}`);

  socket.leave(data.chatId);
  if (data.chatType === "GROUP" || data.chatType === "PUBLIC") {
    // Fetch all sockets currently in the room
    const roomSockets = await io.in(data.chatId).fetchSockets();

    // Check if any other socket for this user is still in the room
    const stillInRoom = roomSockets.some(
      (s) => s.data.user?.id === user.id && s.id !== socket.id
    );

    if (!stillInRoom) {
      socket.to(data.chatId).emit("remove_from_active_users", user);
    }
  }
};

export const disconnect = async (
  socket: TypedSocket,
  io: TypedIO,
  user: User
) => {
  const userId = user?.id;

  const sockets = userSocketMap.get(userId);
  if (sockets) {
    sockets.delete(socket.id);
    if (sockets.size === 0) {
      userSocketMap.delete(userId);
    }
  }
  console.log(`User ${user.username} disconnected from socket ID ${socket.id}`);
};
