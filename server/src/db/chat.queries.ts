import { decryptMessageContent, decryptText } from "../utils/crypto";
import { prisma } from "./prismaClient";

export const getChats = async (userId: string) => {
  const chats = await prisma.chat.findMany({
    where: {
      users: {
        some: { id: userId },
      },
    },
    include: {
      users: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
      lastMessage: {
        include: {
          sender: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  // Format the chats to use the opposite user for private chats
  const formattedChats = chats.map((chat) => {
    const decryptedLastMessage = decryptMessageContent(chat.lastMessage);

    if (chat.type === "PRIVATE") {
      const otherUser = chat.users.find((u) => u.id !== userId);

      return {
        ...chat,
        id: chat.id,
        type: chat.type,
        name: otherUser?.username || "Unknown",
        avatar: otherUser?.avatar || null,
        lastMessage: decryptedLastMessage,
        updatedAt: chat.updatedAt,
      };
    } else {
      return {
        ...chat,
        id: chat.id,
        type: chat.type,
        name: chat.name || "Unnamed Group",
        avatar: chat.avatar || null, // or use a group avatar if you implement one
        lastMessage: decryptedLastMessage,
        updatedAt: chat.updatedAt,
      };
    }
  });

  return { chats: formattedChats ?? [], count: formattedChats.length ?? 0 };
};

export const getChat = async (chatId: string, userId: string) => {
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

  if (!chat) return null;

  // Format for private chat (opposite user as name/avatar)
  if (chat.type === "PRIVATE") {
    const otherUser = chat.users.find((u) => u.id !== userId);

    return {
      id: chat.id,
      type: chat.type,
      name: otherUser?.username || "Unknown",
      avatar: otherUser?.avatar || null,
      users: chat.users,
      _count: chat._count,
    };
  }

  // For group chats, use group name and avatar (if you implement one)
  return {
    id: chat.id,
    type: chat.type,
    name: chat.name || "Unnamed Group",
    avatar: chat.avatar || null,
    users: chat.users,
    _count: chat._count,
  };
};

export const getPublicChats = async () => {
  const chats = await prisma.chat.findMany({
    where: { type: "PUBLIC" },
  });

  return chats;
};

export const createChat = async (userIds: string[]) => {
  const sortedIds = [...userIds].sort();
  const existingChat = await prisma.chat.findFirst({
    where: { type: "PRIVATE", users: { every: { id: { in: sortedIds } } } },
    include: { users: true },
  });

  if (existingChat) return existingChat;

  const newChat = await prisma.chat.create({
    data: {
      type: "PRIVATE",
      users: {
        connect: sortedIds.map((userId) => ({ id: userId })),
      },
    },
    include: {
      users: true,
    },
  });
  return newChat;
};

export const createGroupchat = async (
  userIds: string[],
  groupName: string,
  avatar: string
) => {
  const sortedIds = userIds.sort();

  console.log("NAME: ", groupName);
  console.log("USERIDS: ", userIds);
  console.log("AVATAR: ", avatar);

  const newChat = await prisma.chat.create({
    data: {
      type: "GROUP",
      name: groupName,
      avatar,
      users: {
        connect: sortedIds.map((userId) => ({ id: userId })),
      },
    },
    include: {
      users: true,
    },
  });
  return newChat;
};
