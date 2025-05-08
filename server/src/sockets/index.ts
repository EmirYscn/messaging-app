import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import cookie from "cookie";

import { TypedIO, TypedSocket } from "./types";

import * as socketController from "../controllers/socket.controller";

import { userSocketMap } from "./socketRegistry";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not defined.");
}

const JWT_SECRET = process.env.JWT_SECRET;

type SocketNextFunction = (err?: Error) => void;

export const handleVerifyToken = (
  socket: TypedSocket,
  next: SocketNextFunction
) => {
  const cookieHeader = socket.handshake.headers.cookie;
  if (!cookieHeader) return next(new Error("No cookie header found"));

  const { jwt: token } = cookie.parse(cookieHeader);

  if (!token) {
    console.log("❌ No token provided");
    return next(new Error("Unauthorized, please re-login."));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    socket.data.user = decoded; // Attach user info to socket
    next();
  } catch (err) {
    console.error("JWT Error:", err);
    return next(new Error("Unauthorized, please re-login."));
  }
};
// export const handleVerifyToken = (
//   socket: TypedSocket,
//   next: SocketNextFunction
// ) => {
//   const { token } = socket.handshake.auth;
//   if (!token) {
//     console.log("❌ No token provided");
//     return next(new Error("Unauthorized, please re-login."));
//   }

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     socket.data.user = decoded; // Attach user info to socket
//     next();
//   } catch (err) {
//     console.error("JWT Error:", err);
//     return next(new Error("Unauthorized, please re-login."));
//   }
// };

export const handleUserSocketMapping = (socket: TypedSocket, user: User) => {
  // handle user socket mapping
  if (!userSocketMap.has(user.id)) {
    userSocketMap.set(user.id, new Set());
  }
  userSocketMap.get(user.id)?.add(socket.id);
  console.log("Current socket map:", Array.from(userSocketMap.entries()));
  console.log("Connected User: ", user);
  console.log(
    `User with DBID: ${user.id} connected with socket ID ${socket.id}`
  );
};

export const registerSocketHandlers = (io: TypedIO) => {
  io.use(handleVerifyToken);

  io.on("connection", (socket) => {
    const user = socket.data.user as User;

    // handle user socket mapping
    handleUserSocketMapping(socket, user);

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
