import { Server } from "socket.io";
import { createServer } from "node:http";
import { instrument } from "@socket.io/admin-ui";

import config from "./config/config";
import app from "./index";
import { registerSocketHandlers } from "./sockets";

const server = createServer(app);

export const io = new Server(server, {
  cors: {
    origin: [config.clientUrl!, config.socketAdminIoUrl!],
    credentials: true,
  },
});

instrument(io, {
  auth: {
    type: "basic",
    username: config.socketAdminUsername!,
    password: config.socketAdminPassword!,
  },
  mode: config.nodeEnv === "production" ? "production" : "development",
});

app.locals.io = io; // Make io available in app locals

registerSocketHandlers(io);

server.listen(config.port, () => {
  console.log(`Server is Fire at http://${config.serverUrl}:${config.port}`);
});

// Handle unexpected crashes
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! Shutting down...");
  console.error(err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED PROMISE REJECTION! Shutting down...");
  console.error(err);
  server.close(() => process.exit(1));
});
