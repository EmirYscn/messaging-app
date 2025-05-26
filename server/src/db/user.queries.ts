import { prisma } from "./prismaClient";
import { Prisma, Profile, User } from "@prisma/client";

import { UserQuery } from "../controllers/user.controller";

import AppError from "../utils/appError";

export const getUsers = async (query?: UserQuery) => {
  const where: Prisma.UserWhereInput = {};
  if (query && query.username) {
    where.username = {
      contains: query.username,
      mode: "insensitive",
    };
  }
  const users = await prisma.user.findMany({
    where,
    select: { id: true, username: true, avatar: true, role: true },
  });
  return users;
};

export const getUser = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  return user;
};

export const findUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  return user;
};

export const findUserById = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  return user;
};

export const createUser = async (body: User) => {
  return await prisma.$transaction(async (prisma) => {
    const user = await prisma.user.create({ data: body });
    await prisma.profile.create({
      data: {
        userId: user.id,
      },
    });

    return user;
  });
};

export const getProfile = async (id: string) => {
  const profile = await prisma.profile.findUnique({
    where: { userId: id },
    include: {
      user: {
        select: {
          avatar: true,
          email: true,
          id: true,
          role: true,
          username: true,
        },
      },
    },
  });
  return profile;
};

export const updateUser = async (
  id: string,
  body: Partial<User & { profile: Partial<Profile> }>
) => {
  // Destructure profile fields if present
  const { profile, ...userFields } = body;

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      ...userFields,
      ...(profile && {
        profile: {
          update: profile,
        },
      }),
    },
    include: {
      profile: true, // Optional: if you want updated profile data returned
    },
  });

  return updatedUser;
};

export const findUserByResetToken = async (token: string) => {
  const user = await prisma.user.findUnique({
    where: { resetPasswordToken: token },
  });
  return user;
};

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

export const addUser = async (senderId: string, receiverId: string) => {
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
      senderId,
      receiverId,
    },
  });
};
