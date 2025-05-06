import { NextFunction, Request, Response } from "express";
import * as friendRequestQueries from "../db/friendRequest.queries";
import { User } from "@prisma/client";
import catchAsync from "../utils/catchAsync";
import { notifyUsers } from "../sockets/socketNotifier";

export const sendFriendRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { receiverId } = req.params;
    const { id: senderId } = req.user as User;

    await friendRequestQueries.sendFriendRequest(senderId, receiverId);

    notifyUsers([receiverId], "friend_requests_updated");

    res.status(200).json({ status: "success" });
  }
);

export const acceptFriendRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { requestId } = req.params;
    const { id: userId } = req.user as User;

    const userIds = await friendRequestQueries.acceptFriendRequest(requestId);

    const notifiedUserId = userIds.find((id) => id !== userId);
    if (notifiedUserId)
      notifyUsers([notifiedUserId], "friend_requests_updated");

    res.status(200).json({ status: "success" });
  }
);

export const declineFriendRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { requestId } = req.params;
    const { id: userId } = req.user as User;

    const userIds = await friendRequestQueries.declineFriendRequest(requestId);

    const notifiedUserId = userIds.find((id) => id !== userId);
    if (notifiedUserId)
      notifyUsers([notifiedUserId], "friend_requests_updated");

    res.status(200).json({ status: "success" });
  }
);

export const deleteFriendRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { requestId } = req.params;
    const { id: userId } = req.user as User;

    const userIds = await friendRequestQueries.deleteFriendRequest(requestId);

    const notifiedUserId = userIds.find((id) => id !== userId);
    if (notifiedUserId)
      notifyUsers([notifiedUserId], "friend_requests_updated");

    res.status(200).json({ status: "success" });
  }
);

export const getSentFriendRequests = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id: userId } = req.user as User;

    const friendRequests = await friendRequestQueries.getSentFriendRequests(
      userId
    );

    res.status(200).json({ status: "success", friendRequests });
  }
);

export const getReceivedFriendRequests = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id: userId } = req.user as User;

    const friendRequests = await friendRequestQueries.getReceivedFriendRequests(
      userId
    );

    res.status(200).json({ status: "success", friendRequests });
  }
);
