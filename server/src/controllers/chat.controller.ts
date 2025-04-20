import { NextFunction, Request, Response } from "express";
import { User } from "@prisma/client";

import catchAsync from "../utils/catchAsync";

import * as chatQueries from "../db/chat.queries";
import * as messageQueries from "../db/message.queries";
import { TypedIO } from "../sockets/types";
import { userSocketMap } from "../sockets/socketRegistry";

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
