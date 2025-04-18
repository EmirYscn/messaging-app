import express, {
  Express,
  Request,
  Response,
  Application,
  NextFunction,
} from "express";
import path from "node:path";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import { rateLimit } from "express-rate-limit";

import config from "./config/config";

import { router as chatRouter } from "./routes/chat.routes";
import { router as authRouter } from "./routes/auth.routes";
import { router as userRouter } from "./routes/user.routes";

// import AppError from "./utils/appError";
// import { globalErrorHandler } from "./controllers/error.controller";

const app: Application = express();

// // Implement CORS
// const allowedOrigins = [
//   process.env.CLIENT_URL,
//   process.env.CLIENT_AUTHOR_URL,
// ].filter(Boolean); // remove undefined/null values

// const corsOptions = {
//   origin: (origin: string | undefined, callback: Function) => {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
// };

// app.use(cors(corsOptions));

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

// Handle undefined routes

// app.all("*", (req: Request, res: Response, next: NextFunction) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
// });

// // Global error handler
// app.use(globalErrorHandler);

export default app;
