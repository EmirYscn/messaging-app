import { Message } from "@prisma/client";
import { prisma } from "./prismaClient";

export const createMessage = async (message: Message) => {
  const { chatId, senderId, content, type } = message;
  const [newMsg, updatedChat] = await prisma.$transaction(async (tx) => {
    const newMsg = await tx.message.create({
      data: {
        chatId,
        senderId,
        content,
        type,
      },
    });

    const updatedChat = await tx.chat.update({
      where: { id: newMsg.chatId },
      data: {
        lastMessage: {
          connect: { id: newMsg.id },
        },
      },
    });

    return [newMsg, updatedChat];
  });
};
