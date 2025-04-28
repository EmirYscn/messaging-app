import { Message, Prisma } from "@prisma/client";
import { prisma } from "./prismaClient";

export const getMessages = async (chatId: string) => {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    select: { type: true }, // assuming you have a `type` field like 'public' or 'private'
  });

  if (!chat) {
    throw new Error("Chat not found");
  }
  const where: Prisma.MessageWhereInput = { chatId };

  if (chat.type === "PUBLIC") {
    where.createdAt = { gte: twentyFourHoursAgo };
  }

  const totalCount = await prisma.message.count({ where: { chatId } });

  const messages = await prisma.message.findMany({
    where,
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
      include: {
        users: {
          select: {
            id: true,
          },
        },
      },
    });

    return [newMsg, updatedChat];
  });

  return { newMsg, updatedChat };
};
