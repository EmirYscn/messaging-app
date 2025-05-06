import { NextFunction, Request, Response } from "express";
import { User } from "@prisma/client";

import catchAsync from "../utils/catchAsync";

import * as chatQueries from "../db/chat.queries";
import * as messageQueries from "../db/message.queries";
import { TypedIO } from "../sockets/types";
import { userSocketMap } from "../sockets/socketRegistry";
import AppError from "../utils/appError";
import { uploadAvatar, uploadGroupAvatar } from "../middlewares/supabase";
import { notifyUsers } from "../sockets/socketNotifier";

export const getChats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id: userId } = req.user as User;

    const { chats, count } = await chatQueries.getChats(userId);

    res.status(200).json({ status: "success", chats, count });
  }
);

export const getChat = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { id: userId } = req.user as User;

    const chat = await chatQueries.getChat(id, userId);

    res.status(200).json({ status: "success", chat });
  }
);

export const getPublicChats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const chats = await chatQueries.getPublicChats();
    res.status(200).json({ status: "success", chats });
  }
);

export const getMessages = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const { messages, count } = await messageQueries.getMessages(id);

    res.status(200).json({ status: "success", messages, count });
  }
);

export const createChat = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const oppositeUserId = req.body.userId as string;
    const { id: userId } = req.user as User;

    const chat = await chatQueries.createChat([userId, oppositeUserId]);

    const io = req.app.locals.io as TypedIO;
    const sockets = userSocketMap.get(oppositeUserId);
    if (sockets) {
      sockets.forEach((socketId) => {
        io.to(socketId).emit("chat_created");
      });
    }

    res.status(200).json({ status: "success", chat });
  }
);

export const createGroupChat = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id: userId } = req.user as User;
    const { name } = req.body;

    if (!name || !req.body.userIds) {
      return next(new AppError("Group name and user IDs are required", 400));
    }

    let userIds: string[];
    try {
      userIds = JSON.parse(req.body.userIds);
      if (!Array.isArray(userIds) || userIds.length === 0) {
        throw new Error();
      }
    } catch {
      return next(new AppError("Invalid userIds format", 400));
    }

    const file = req.file as Express.Multer.File;

    if (!file) {
      return next(new AppError("No file uploaded", 400));
    }

    const publicUrl = await uploadGroupAvatar(file, userId);
    const chat = await chatQueries.createGroupchat(
      [userId, ...userIds],
      name,
      publicUrl
    );

    notifyUsers(userIds, "chat_created");

    res.status(200).json({ status: "success", chat });
  }
);
