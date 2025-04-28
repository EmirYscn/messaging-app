import express, { Request, Response, Application, NextFunction } from "express";
import path from "node:path";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import { rateLimit } from "express-rate-limit";

import config from "./config/config";

import { router as chatRouter } from "./routes/chat.routes";
import { router as authRouter } from "./routes/auth.routes";
import { router as userRouter } from "./routes/user.routes";
import { router as friendRouter } from "./routes/friendship.routes";
import { router as friendRequestRouter } from "./routes/friendRequests.routes";

import AppError from "./utils/appError";
import { globalErrorHandler } from "./controllers/error.controller";

const app: Application = express();

app.use(cors({ origin: "http://localhost:5173" }));

// Set security HTTP headers
app.use(helmet());

if (config.nodeEnv === "development") {
  app.use(morgan("dev"));
}

// Limit requests from same API
if (config.nodeEnv === "production") {
  const limiter = rateLimit({
    max: 1000,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from this IP, please try again in an hour!",
  });
  app.use("/api", limiter);
}

// app middleware to use form body in post router
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/chats", chatRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/friends", friendRouter);
app.use("/api/v1/friendRequests", friendRequestRouter);

// Handle undefined routes

app.all("/{*any}", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// // Global error handler
app.use(globalErrorHandler);

export default app;
