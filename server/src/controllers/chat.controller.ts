import { NextFunction, Request, Response } from "express";
import { User } from "@prisma/client";

import catchAsync from "../utils/catchAsync";

import * as messageQueries from "../db/message.queries";

// export const createComment = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { postId } = req.params;
//     const { id: authorId } = req.user as User;
//     const { comment, parentCommentId } = req.body;

//     await commentQueries.createPostComment(
//       postId,
//       authorId,
//       comment,
//       parentCommentId
//     );

//     res.status(201).json({ status: "success" });
//   }
// );

export const getChat = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { chatId } = req.params;

    const chat = await messageQueries.getChat(chatId);

    res.status(200).json({ status: "success", chat });
  }
);

export const getMessages = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { chatId } = req.params;

    const { messages, count } = await messageQueries.getMessages(chatId);

    res.status(200).json({ status: "success", messages, count });
  }
);
