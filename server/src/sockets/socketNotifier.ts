import { io } from "../server";
import { userSocketMap } from "./socketRegistry";
import { ServerToClientEvents, TypedIO } from "./types";

export const notifyUsers = (
  userIds: string[],
  event: keyof ServerToClientEvents,
  data?: any
) => {
  userIds.forEach((userId) => {
    const sockets = userSocketMap.get(userId);
    if (sockets) {
      sockets.forEach((socketId) => {
        (io as TypedIO).to(socketId).emit(event, data);
      });
    }
  });
};
