import { Message, Prisma } from "@prisma/client";
import { prisma } from "./prismaClient";
import { decryptMessageContent, decryptText } from "../utils/crypto";

export const getMessages = async (chatId: string) => {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    select: { type: true },
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

  const decryptedMessages = orderedMessages.map((msg) => ({
    ...msg,
    content: decryptText(msg.content),
  }));

  return { messages: decryptedMessages, count: totalCount };
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

  const decryptedContent = decryptMessageContent(newMsg);

  return {
    newMsg: decryptedContent,
    updatedChat,
  };
};

export const deleteMessages = async (messageIds: string[]) => {
  const messagesToDelete = await prisma.message.findFirst({
    where: { id: { in: messageIds } },
    select: { chat: { include: { users: { select: { id: true } } } } },
  });

  await prisma.message.deleteMany({
    where: { id: { in: messageIds } },
  });

  return messagesToDelete?.chat.users;
};
