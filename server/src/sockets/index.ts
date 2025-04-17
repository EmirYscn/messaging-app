import { Server } from "socket.io";
import * as socketController from "../controllers/socket.controller";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const registerSocketHandlers = (io: Server) => {
  io.use((socket, next) => {
    const authHeader = socket.handshake.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new Error("Unauthorized: No token provided"));
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      socket.data.user = decoded; // Attach user info to socket
      next();
    } catch (err) {
      console.error("JWT Error:", err);
      next(new Error("Unauthorized: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log("User", socket.data.user);
    console.log(`User with socket id ${socket.id} connected`);

    socket.on("join_room", async (data) => {
      console.log(`User with ID: ${socket.id} joined room: ${data.chatId}`);
      socket.join(data.chatId);
      const roomSockets = await io.in(data.chatId).fetchSockets(); // gets all sockets in the room
      console.log(roomSockets);
      // Map each socket to its user data
      const activeUsers = roomSockets.map((s) => s.data.user);
      console.log("active users: ", activeUsers);

      if (data.chatType === "GROUP" || data.chatType === "PUBLIC") {
        // Send active users to the newly joined user
        socket.emit("active_users_list", activeUsers);

        // Notify others in the room about the new user
        socket.to(data.chatId).emit("add_to_active_users", socket.data.user);
      }
    });

    socket.on("leave_room", (data) => {
      console.log(`User with ID: ${socket.id} left room: ${data.chatId}`);
      if (data.chatType === "GROUP" || data.chatType === "PUBLIC") {
        socket
          .to(data.chatId)
          .emit("remove_from_active_users", socket.data.user);
      }
      socket.leave(data.chatId);
    });

    socket.on("send_message", (data) =>
      socketController.sendMessage(socket, io, data)
    );

    // socket.on("typing", (data) => {
    //   console.log(`${data.senderId} is typing...`);
    //   socket.to(data.chatId).emit("typing", data);
    // });

    socket.on("disconnect", () => {
      console.log(`User with socket id ${socket.id} disconnected`);
    });
  });
};
