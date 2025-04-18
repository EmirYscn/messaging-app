import { prisma } from "./prismaClient";

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
    avatar: null,
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
