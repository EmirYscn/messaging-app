import { NextFunction, Request, Response } from "express";
import { User } from "@prisma/client";

import catchAsync from "../utils/catchAsync";

import * as chatQueries from "../db/chat.queries";
import * as messageQueries from "../db/message.queries";

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
