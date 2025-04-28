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

// export const sendFriendRequest = async (
//   senderId: string,
//   receiverId: string
// ) => {
//   const friendRequest = await prisma.friendRequest.create({
//     data: {
//       sender: { connect: { id: senderId } },
//       receiver: { connect: { id: receiverId } },
//     },
//   });

//   return friendRequest;
// };

export const acceptFriendRequest = async (friendRequestId: string) => {
  const request = await prisma.friendRequest.update({
    where: { id: friendRequestId },
    data: { status: "ACCEPTED" },
  });
  if (!request) {
    throw new AppError("Friend request not found", 404);
  }
  await prisma.friendship.create({
    data: {
      user1: { connect: { id: request.senderId } },
      user2: { connect: { id: request.receiverId } },
    },
  });
  await prisma.friendRequest.delete({
    where: { id: friendRequestId },
  });
};

export const declineFriendRequest = async (friendRequestId: string) => {
  await prisma.friendRequest.update({
    where: { id: friendRequestId },
    data: { status: "DECLINED" },
  });
  await prisma.friendRequest.delete({
    where: { id: friendRequestId },
  });
};

export const deleteFriendRequest = async (friendRequestId: string) => {
  await prisma.friendRequest.delete({
    where: {
      id: friendRequestId,
    },
  });
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
