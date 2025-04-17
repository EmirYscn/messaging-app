import { Server } from "socket.io";
import * as socketController from "../controllers/socket.controller";

export const registerSocketHandlers = (io: Server) => {
  io.on("connection", (socket) => {
    console.log(`User with socket id ${socket.id} connected`);

    socket.on("join_room", (data) => {
      console.log(`User with ID: ${socket.id} joined room: ${data.chatId}`);
      socket.join(data.chatId);
      socket.emit("add_to_active_users", {
        id: socket.id,
        username: data.username,
        avatar: data.avatar,
        role: data.role,
      });
    });

    socket.on("leave_room", (data) => {
      console.log(`User with ID: ${socket.id} left room: ${data.chatId}`);
      socket.emit("remove_from_active_users", {
        id: socket.id,
        username: data.username,
        avatar: data.avatar,
        role: data.role,
      });
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
