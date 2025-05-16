import { Media, Message, Prisma } from "@prisma/client";
import { prisma } from "./prismaClient";
import { decryptMessageContent } from "../utils/crypto";
import { SocketMessageType } from "../sockets/types";
import { deleteMediasFromBucket } from "../middlewares/supabase";

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
      media: {
        select: { id: true, url: true, type: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const orderedMessages = messages.reverse();

  const decryptedMessages = orderedMessages.map((msg) =>
    decryptMessageContent(msg)
  );

  return { messages: decryptedMessages, count: totalCount };
};

export const createMessage = async (
  data: SocketMessageType,
  senderId: string
) => {
  const { chatId, content, media: mediaData } = data;
  const [newMsg, updatedChat] = await prisma.$transaction(async (tx) => {
    const messageType = mediaData?.type || "TEXT";

    const newMsg = await tx.message.create({
      data: {
        chatId,
        senderId,
        content,
        type: messageType,
      },
      include: {
        sender: {
          select: { id: true, username: true, avatar: true, role: true },
        },
        media: {
          select: { id: true, url: true, type: true },
        },
      },
    });

    if (mediaData?.id) {
      await tx.media.update({
        where: { id: mediaData.id },
        data: { messageId: newMsg.id },
      });
    }

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

    const fullMessage = await tx.message.findUnique({
      where: { id: newMsg.id },
      include: {
        sender: {
          select: { id: true, username: true, avatar: true, role: true },
        },
        media: {
          select: { id: true, url: true, type: true },
        },
      },
    });

    return [fullMessage, updatedChat];
  });

  const decryptedContent = decryptMessageContent(newMsg);

  return {
    newMsg: decryptedContent,
    updatedChat,
  };
};

export const deleteMessages = async (messageIds: string[]) => {
  const messagesToDelete = await prisma.$transaction(async (tx) => {
    const messages = await tx.message.findMany({
      where: { id: { in: messageIds } },
      select: {
        chatId: true,
        chat: {
          include: {
            users: { select: { id: true } },
          },
        },
        media: {
          select: { filePath: true },
        },
      },
    });

    await tx.message.deleteMany({
      where: { id: { in: messageIds } },
    });

    return messages;
  });

  const mediasToDelete = messagesToDelete
    .map(
      (msg) => msg.media?.map((media) => media.filePath).filter(Boolean) ?? []
    )
    .flat();

  if (mediasToDelete.length > 0) {
    await deleteMediasFromBucket(mediasToDelete);
  }

  const chatUsers = messagesToDelete.flatMap((msg) => msg.chat.users);
  const chatId = messagesToDelete[0]?.chatId ?? null;

  return {
    chatUsers,
    chatId,
  };
};

export const createImageMessage = async (
  chatId: string,
  senderId: string,
  image: string
) => {
  const newMsg = prisma.message.create({
    data: {
      chatId,
      senderId,
      content: image,
      type: "IMAGE",
    },
    include: {
      sender: {
        select: { id: true, username: true, avatar: true, role: true },
      },
    },
  });

  return newMsg;
};
