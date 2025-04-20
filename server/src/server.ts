import { Server } from "socket.io";
import { createServer } from "node:http";

import config from "./config/config";
import app from "./index";
import { registerSocketHandlers } from "./sockets";

import AppError from "./utils/appError";
import { globalErrorHandler } from "./controllers/error.controller";
import { NextFunction, Request, Response } from "express";

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

app.locals.io = io; // Make io available in app locals

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
