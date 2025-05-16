import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import * as messageQueries from "../db/message.queries";
import AppError from "../utils/appError";
import { notifyUsers } from "../sockets/socketNotifier";
import { MEDIA_TYPE, User } from "@prisma/client";
import { uploadMediaToBucket } from "../middlewares/supabase";
import * as mediaQueries from "../db/media.queries";

export const deleteMessages = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { messageIds } = req.body;
    const { id: userId } = req.user as User;

    if (!messageIds || !Array.isArray(messageIds)) {
      return next(new AppError("Invalid request", 400));
    }

    const { chatUsers, chatId } = await messageQueries.deleteMessages(
      messageIds
    );

    const notifiedUserIds = chatUsers
      ?.map((user) => user.id)
      .filter((id) => id !== userId);
    if (notifiedUserIds)
      notifyUsers(notifiedUserIds, "messages_updated", { chatId });

    res.status(200).json({ status: "success", message: "Messages deleted" });
  }
);

// export const uploadImageMessage = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { chatId } = req.params;
//     const { id: userId } = req.user as User;

//     const image = req.file as Express.Multer.File;

//     if (!image) {
//       return next(new AppError("Image not found", 400));
//     }

//     const publicUrl = await uploadImage(image, chatId, userId);
//     if (!publicUrl) {
//       return next(new AppError("Couldn't upload image", 500));
//     }

//     const message = await messageQueries.createImageMessage(
//       chatId,
//       userId,
//       publicUrl
//     );

//     if (!message) {
//       return next(new AppError("Couldn't send image", 500));
//     }

//     const io = req.app.locals.io;

//     io.to(chatId).emit("receive_message", message);

//     // res.status(200).json({ status: "success" });
//     res.status(200).json({ status: "success", message });
//   }
// );

export const createMedia = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id: userId } = req.user as User;
    const mediaType = req.mediaType as MEDIA_TYPE;
    const mediaFile = req.file as Express.Multer.File;

    if (!mediaFile) {
      return next(new AppError("Media file not found", 400));
    }

    const { publicUrl, filePath } = await uploadMediaToBucket(
      mediaType,
      mediaFile,
      userId
    );
    if (!publicUrl) {
      return next(new AppError("Couldn't upload media to bucket", 500));
    }

    const media = await mediaQueries.uploadMedia(
      publicUrl,
      filePath,
      mediaType
    );

    res.status(200).json({
      status: "success",
      data: { media },
    });
  }
);
