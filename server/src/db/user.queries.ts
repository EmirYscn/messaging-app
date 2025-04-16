import { User } from "@prisma/client";
import { prisma } from "./prismaClient";
import { count } from "console";

export const getUsers = async () => {
  const users = await prisma.user.findMany();
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

// export const getProfile = async (id: string) => {
//   const profile = await prisma.profile.findUnique({
//     where: { userId: id },
//     include: {
//       user: {
//         select: {
//           avatar: true,
//           email: true,
//           id: true,
//           role: true,
//           username: true,
//           posts: true,
//         },
//       },
//     },
//   });
//   return profile;
// };

// export const updateUser = async (id: string, body: Partial<User & Profile>) => {
//   let updatedUser = {} as Prisma.UserUpdateInput;
//   let updatedProfile = {} as Prisma.ProfileUpdateInput;

//   // Extract profile-specific fields
//   if (body.bio !== undefined) {
//     updatedProfile.bio = body.bio;
//   }

//   // Everything else is assumed to be a user field
//   const userFields = [
//     "email",
//     "username",
//     "password",
//     "resetPasswordToken",
//     "resetPasswordExpires",
//   ];
//   for (const key of userFields) {
//     if (key in body) {
//       (updatedUser as any)[key] = (body as any)[key];
//     }
//   }

//   const hasUserUpdates = Object.keys(updatedUser).length > 0;
//   const hasProfileUpdates = Object.keys(updatedProfile).length > 0;

//   // If no known fields matched, fallback to directly updating user table with the entire body
//   if (!hasUserUpdates && !hasProfileUpdates) {
//     return prisma.user.update({
//       where: { id },
//       data: body,
//     });
//   }

//   const updatedData = await prisma.$transaction(async (prisma) => {
//     let userUpdate, profileUpdate;

//     if (Object.keys(updatedUser).length > 0) {
//       userUpdate = await prisma.user.update({
//         where: { id },
//         data: updatedUser,
//       });
//     }

//     if (Object.keys(updatedProfile).length > 0) {
//       profileUpdate = await prisma.profile.update({
//         where: { userId: id },
//         data: updatedProfile,
//       });
//     }

//     return { user: userUpdate, profile: profileUpdate };
//   });
//   return updatedData;
// };

export const findUserByResetToken = async (token: string) => {
  const user = await prisma.user.findUnique({
    where: { resetPasswordToken: token },
  });
  return user;
};

export const getChats = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      chats: {
        include: {
          users: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
      },
    },
  });

  return { chats: user?.chats ?? [], count: user?.chats.length ?? 0 };
};
