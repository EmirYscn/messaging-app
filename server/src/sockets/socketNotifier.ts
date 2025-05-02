import { io } from "../server";
import { userSocketMap } from "./socketRegistry";
import { ServerToClientEvents, TypedIO } from "./types";

export const notifyUser = (
  userId: string,
  event: keyof ServerToClientEvents,
  data?: any
) => {
  const sockets = userSocketMap.get(userId);
  if (sockets) {
    sockets.forEach((socketId) => {
      (io as TypedIO).to(socketId).emit(event, data);
    });
  }
};
