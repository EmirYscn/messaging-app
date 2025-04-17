import { Message } from "@prisma/client";
import * as messageQueries from "../db/message.queries";
import { v4 as uuidv4 } from "uuid";
import { Server, Socket } from "socket.io";
import { TypedIO, TypedSocket } from "../sockets/types";

export const sendMessage = async (
  socket: TypedSocket,
  io: TypedIO,
  data: Message
) => {
  console.log(
    `User with ID: ${socket.id} sent message: ${data.content} to chat: ${data.chatId}`
  );
  // 1) Store message in database
  await messageQueries.createMessage(data);
  // 2) Emit message
  io.to(data.chatId).emit("receive_message", {
    ...data,
    id: uuidv4(),
    sender: socket.data.user,
  });
};
