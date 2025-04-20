import { Message } from "@prisma/client";
import { prisma } from "./prismaClient";

export const getMessages = async (chatId: string) => {
  const totalCount = await prisma.message.count({ where: { chatId } });
  const messages = await prisma.message.findMany({
    where: { chatId },
    include: {
      sender: {
        select: { id: true, username: true, avatar: true, role: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const orderedMessages = messages.reverse();

  return { messages: orderedMessages, count: totalCount };
};

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
      include: {
        sender: {
          select: { id: true, username: true, avatar: true, role: true },
        },
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

  return newMsg;
};
