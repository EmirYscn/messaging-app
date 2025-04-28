import { prisma } from "./prismaClient";

export const getFriends = async (userId: string) => {
  // Fetch friendships where the user is user1
  const friendshipsAsUser1 = await prisma.friendship.findMany({
    where: { user1Id: userId },
    select: {
      createdAt: true,
      user2: {
        select: {
          id: true,
          username: true,
          avatar: true,
          role: true,
        },
      },
    },
  });

  // Fetch friendships where the user is user2
  const friendshipsAsUser2 = await prisma.friendship.findMany({
    where: { user2Id: userId },
    select: {
      createdAt: true,
      user1: {
        select: {
          id: true,
          username: true,
          avatar: true,
          role: true,
        },
      },
    },
  });

  // Normalize and combine both lists
  const allFriends = [
    ...friendshipsAsUser1.map((f) => ({
      ...f.user2,
      friendshipCreatedAt: f.createdAt,
    })),
    ...friendshipsAsUser2.map((f) => ({
      ...f.user1,
      friendshipCreatedAt: f.createdAt,
    })),
  ];

  // Sort by newest first
  const sortedFriends = allFriends.sort(
    (a, b) => b.friendshipCreatedAt.getTime() - a.friendshipCreatedAt.getTime()
  );

  return sortedFriends;
};

export const deleteFriend = async (userId: string, friendId: string) => {
  // Delete the friendship where the user is user1
  await prisma.friendship.deleteMany({
    where: {
      user1Id: userId,
      user2Id: friendId,
    },
  });

  // Delete the friendship where the user is user2
  await prisma.friendship.deleteMany({
    where: {
      user1Id: friendId,
      user2Id: userId,
    },
  });
};
