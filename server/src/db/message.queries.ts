import { Message } from "@prisma/client";
import { prisma } from "./prismaClient";

export const getChat = async (chatId: string) => {
  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    include: {
      users: {
        select: {
          id: true,
          username: true,
          avatar: true,
          role: true,
        },
      },
      _count: {
        select: { messages: true, users: true },
      },
    },
  });
  return chat;
};

export const getMessages = async (chatId: string) => {
  const totalCount = await prisma.message.count({ where: { chatId } });
  const messages = await prisma.message.findMany({
    where: { chatId },
    include: {
      sender: {
        select: { id: true, username: true, avatar: true, role: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });
  return { messages, count: totalCount };
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
