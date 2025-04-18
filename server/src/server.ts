import { Server } from "socket.io";
import { createServer } from "node:http";

import config from "./config/config";
import app from "./index";
import { registerSocketHandlers } from "./sockets";

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

registerSocketHandlers(io);

server.listen(config.port, () => {
  console.log(`Server is Fire at http://localhost:${config.port}`);
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
