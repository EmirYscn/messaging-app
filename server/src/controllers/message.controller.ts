import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import * as messageQueries from "../db/message.queries";
import AppError from "../utils/appError";
import { notifyUser } from "../sockets/socketNotifier";
import { User } from "@prisma/client";

export const deleteMessages = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { messageIds } = req.body;
    const { id: userId } = req.user as User;
    console.log(messageIds);

    if (!messageIds || !Array.isArray(messageIds)) {
      return next(new AppError("Invalid request", 400));
    }

    const chatUsers = await messageQueries.deleteMessages(messageIds);
    const notifiedUserId = chatUsers?.find((user) => user.id !== userId)?.id;
    if (notifiedUserId) notifyUser(notifiedUserId, "messages_updated");

    res.status(200).json({ status: "success", message: "Messages deleted" });
  }
);
