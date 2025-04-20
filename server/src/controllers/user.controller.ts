import { NextFunction, Request, Response } from "express";
import * as userQueries from "../db/user.queries";
import catchAsync from "../utils/catchAsync";

export const getChats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const { chats, count } = await userQueries.getChats(id);

    res.status(200).json({ status: "success", chats, count });
  }
);

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
