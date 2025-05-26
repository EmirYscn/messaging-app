import { User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

import * as friendshipQueries from "../db/friendship.queries";

import catchAsync from "../utils/catchAsync";

import { notifyUsers } from "../sockets/socketNotifier";

export const getFriends = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.user as User;

    const friends = await friendshipQueries.getFriends(id);

    res.status(200).json({ status: "success", friends });
  }
);

export const deleteFriend = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id: userId } = req.user as User;
    const { friendId } = req.params;

    await friendshipQueries.deleteFriend(userId, friendId);

    notifyUsers([friendId], "friends_updated");

    res.status(200).json({ status: "success" });
  }
);
