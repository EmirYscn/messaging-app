import express, { Express, Request, Response, Application } from "express";
import path from "node:path";
import morgan from "morgan";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

import config from "./config/config";

const app: Application = express();

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

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Express & TypeScript Server");
});

export default app;
