import { Server } from "socket.io";
import * as socketController from "../controllers/socket.controller";

export const registerSocketHandlers = (io: Server) => {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join_room", (data) => {
      console.log(`User with ID: ${socket.id} joined room: ${data.chatId}`);
      socket.join(data.chatId);
    });

    socket.on("send_message", (data) =>
      socketController.sendMessage(socket, io, data)
    );

    // socket.on("typing", (data) => {
    //   console.log(`${data.senderId} is typing...`);
    //   socket.to(data.chatId).emit("typing", data);
    // });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};
