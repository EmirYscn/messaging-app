import AppError from "../utils/appError";
import { prisma } from "./prismaClient";

export const sendFriendRequest = async (
  senderId: string,
  receiverId: string
) => {
  const existingRequest = await prisma.friendRequest.findFirst({
    where: {
      OR: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    },
  });
  if (existingRequest) {
    throw new AppError("Friend request already sent", 400);
  }
  await prisma.friendRequest.create({
    data: {
      sender: { connect: { id: senderId } },
      receiver: { connect: { id: receiverId } },
    },
  });
};

export const acceptFriendRequest = async (friendRequestId: string) => {
  const request = await prisma.friendRequest.findUnique({
    where: { id: friendRequestId },
  });

  if (!request) {
    throw new AppError("Friend request not found.", 400);
  }

  // Ensure there's no existing friendship (optional safety)
  const existingFriendship = await prisma.friendship.findFirst({
    where: {
      OR: [
        { user1Id: request.senderId, user2Id: request.receiverId },
        { user1Id: request.receiverId, user2Id: request.senderId },
      ],
    },
  });

  if (existingFriendship) {
    throw new AppError("Friendship already exists.", 400);
  }

  // Delete the friend request
  await prisma.friendRequest.delete({
    where: { id: friendRequestId },
  });

  // Create the friendship
  await prisma.friendship.create({
    data: {
      user1: { connect: { id: request.senderId } },
      user2: { connect: { id: request.receiverId } },
    },
  });

  return [request.senderId, request.receiverId];
};

export const declineFriendRequest = async (friendRequestId: string) => {
  const request = await prisma.friendRequest.findUnique({
    where: { id: friendRequestId },
  });

  if (!request) {
    throw new AppError("Friend request not found.", 400);
  }

  await prisma.friendRequest.delete({
    where: { id: friendRequestId },
  });

  return [request.senderId, request.receiverId];
};

export const deleteFriendRequest = async (friendRequestId: string) => {
  const request = await prisma.friendRequest.findUnique({
    where: { id: friendRequestId },
  });

  if (!request) {
    throw new AppError("Friend request not found.", 400);
  }

  await prisma.friendRequest.delete({
    where: { id: friendRequestId },
  });

  return [request.senderId, request.receiverId];
};

export const getReceivedFriendRequests = async (userId: string) => {
  const friendRequests = await prisma.friendRequest.findMany({
    where: { receiverId: userId },
    include: {
      sender: {
        select: { id: true, username: true, avatar: true, role: true },
      },
    },
  });

  return friendRequests;
};
export const getSentFriendRequests = async (userId: string) => {
  const friendRequests = await prisma.friendRequest.findMany({
    where: { senderId: userId },
    include: {
      receiver: {
        select: { id: true, username: true, avatar: true, role: true },
      },
    },
  });

  return friendRequests;
};
