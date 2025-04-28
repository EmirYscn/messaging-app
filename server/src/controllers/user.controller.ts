import { NextFunction, Request, Response } from "express";
import * as userQueries from "../db/user.queries";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import { uploadAvatar } from "../middlewares/supabase";
import { User } from "@prisma/client";

export const getProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const profile = await userQueries.getProfile(id);

    res.status(200).json({ status: "success", profile });
  }
);

export const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const body = req.body;

    const updatedUser = await userQueries.updateUser(id, body);

    res.status(200).json({ status: "success", updatedUser });
  }
);

export const updateUserAvatar = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const file = req.file as Express.Multer.File;

    if (!file) {
      return next(new AppError("No file uploaded", 400));
    }

    console.log(file);

    // const updatedUser = await userQueries.updateUser(id, body);
    const publicUrl = await uploadAvatar(file, id);
    const user = await userQueries.updateUser(id, {
      avatar: publicUrl,
    });

    res.status(200).json({ status: "success", user });
  }
);

export const getFriends = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const friends = await userQueries.getFriends(id);

    res.status(200).json({ status: "success", friends });
  }
);

export const getReceivedFriendsRequests = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const friendRequests = await userQueries.getReceivedFriendRequests(id);

    res.status(200).json({ status: "success", friendRequests });
  }
);

export const getSentFriendsRequests = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const friendRequests = await userQueries.getSentFriendRequests(id);

    res.status(200).json({ status: "success", friendRequests });
  }
);

export type UserQuery = {
  id?: string;
  username?: string;
  email?: string;
  role?: string;
};

export const getUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query as UserQuery;

    const users = await userQueries.getUsers(query);

    res.status(200).json({ status: "success", users });
  }
);

export const addUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { receiverId } = req.params;
    const { id: senderId } = req.user as User;

    await userQueries.addUser(senderId, receiverId);

    res.status(200).json({ status: "success", message: "Friend request sent" });
  }
);
