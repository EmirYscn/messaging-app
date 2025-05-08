import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import * as messageQueries from "../db/message.queries";
import AppError from "../utils/appError";
import { notifyUsers } from "../sockets/socketNotifier";
import { User } from "@prisma/client";
import { uploadImage } from "../middlewares/supabase";

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
    if (notifiedUserId) notifyUsers([notifiedUserId], "messages_updated");

    res.status(200).json({ status: "success", message: "Messages deleted" });
  }
);

export const uploadImageMessage = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { chatId } = req.params;
    const { id: userId } = req.user as User;

    const image = req.file as Express.Multer.File;

    if (!image) {
      return next(new AppError("Image not found", 400));
    }

    const publicUrl = await uploadImage(image, chatId, userId);
    if (!publicUrl) {
      return next(new AppError("Couldn't upload image", 500));
    }

    const message = await messageQueries.createImageMessage(
      chatId,
      userId,
      publicUrl
    );

    if (!message) {
      return next(new AppError("Couldn't send image", 500));
    }

    const io = req.app.locals.io;

    io.to(chatId).emit("receive_message", message);

    // res.status(200).json({ status: "success" });
    res.status(200).json({ status: "success", message });
  }
);
