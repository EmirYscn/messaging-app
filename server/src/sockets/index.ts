import { User } from "@prisma/client";
import jwt from "jsonwebtoken";

import { TypedIO, TypedSocket } from "./types";
import AppError from "../utils/appError";

import * as socketController from "../controllers/socket.controller";
import { userSocketMap } from "./socketRegistry";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const registerSocketHandlers = (io: TypedIO) => {
  io.use((socket: TypedSocket, next) => {
    const { token } = socket.handshake.auth;
    if (!token) {
      console.log("❌ No token provided");
      return next(new AppError("Unauthorized: No token provided", 401));
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      socket.data.user = decoded; // Attach user info to socket
      next();
    } catch (err) {
      console.error("JWT Error:", err);
      next(new AppError("Unauthorized: Invalid token", 401));
    }
  });

  io.on("connection", (socket) => {
    const user = socket.data.user as User;
    const userId = user.id;

    if (!userSocketMap.has(userId)) {
      userSocketMap.set(userId, new Set());
    }
    userSocketMap.get(userId)?.add(socket.id);
    console.log("Current socket map:", Array.from(userSocketMap.entries()));
    console.log("User", user);
    console.log(`User ${user.username} connected with socket ID ${socket.id}`);

    socket.on("join_room", async (data) =>
      socketController.joinRoom(socket, io, data)
    );

    socket.on("leave_room", (data) =>
      socketController.leaveRoom(socket, io, data)
    );

    socket.on("send_message", (data) =>
      socketController.sendMessage(socket, io, data)
    );

    socket.on("disconnect", () =>
      socketController.disconnect(socket, io, user)
    );
  });
};
