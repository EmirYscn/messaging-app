import { CHAT_TYPE, User } from "@prisma/client";

import * as messageQueries from "../db/message.queries";
import {
  catchAsyncSocket,
  SocketMessageType,
  TypedIO,
  TypedSocket,
} from "../sockets/types";
import { userSocketMap } from "../sockets/socketRegistry";
import { encryptText } from "../utils/crypto";

export const sendMessage = catchAsyncSocket(
  async (socket: TypedSocket, io: TypedIO, data: SocketMessageType) => {
    const user = socket.data.user as User;
    // 0.5) Encrypt message content
    if (typeof data.content !== "string") {
      throw new Error("Invalid message content: must be a string");
    }

    let encryptedContent = data.content;
    if (data.content.length > 0) {
      encryptedContent = encryptText(data.content);
    }

    // 1) Store message in database
    const dataToStore = {
      ...data,
      content: encryptedContent,
    };
    const { newMsg: createdMessage, updatedChat } =
      await messageQueries.createMessage(dataToStore, user.id);

    // 2) Emit message
    if (createdMessage)
      io.to(data.chatId).emit("receive_message", createdMessage);
    // 3) Emit chat updated
    if (updatedChat.type !== "PUBLIC") {
      for (const user of updatedChat.users) {
        const sockets = userSocketMap.get(user.id);
        if (sockets) {
          sockets.forEach((socketId) => {
            io.to(socketId).emit("chat_updated");
          });
        }
      }
    }
  }
);

export const joinRoom = async (
  socket: TypedSocket,
  io: TypedIO,
  data: { chatId: string; chatType: CHAT_TYPE }
) => {
  const user = socket.data.user as User;

  if (!socket.data.joinedRooms) socket.data.joinedRooms = [];
  socket.data.joinedRooms.push({
    chatId: data.chatId,
    chatType: data.chatType,
  });

  socket.join(data.chatId);
  socket.emit("room_joined", { chatId: data.chatId });
  // Fetch all sockets in the room
  const roomSockets = await io.in(data.chatId).fetchSockets(); // gets all sockets in the room
  // Map each socket to its user data
  const activeUsers = roomSockets.map((s) => s.data.user);

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

  // 👇 Clean up from all rooms
  const sockets = userSocketMap.get(userId);

  // Leave all joined rooms
  const joinedRooms = socket.data.joinedRooms || [];

  for (const room of joinedRooms) {
    await leaveRoom(socket, io, {
      chatId: room.chatId,
      chatType: room.chatType,
    });
  }

  if (sockets) {
    sockets.delete(socket.id);
    if (sockets.size === 0) {
      userSocketMap.delete(userId);
    }
  }
};
