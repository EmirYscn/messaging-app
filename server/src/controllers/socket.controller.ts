import { Message } from "@prisma/client";
import * as messageQueries from "../db/message.queries";
import { Server, Socket } from "socket.io";
import { TypedIO, TypedSocket } from "../sockets/types";

export const sendMessage = async (
  socket: TypedSocket,
  io: TypedIO,
  data: Message
) => {
  // 1) Store message in database
  await messageQueries.createMessage(data);
  // 2) Emit message
  io.to(data.chatId).emit("receive_message", data);
};
