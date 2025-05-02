import { Router } from "express";
import * as messageController from "../controllers/message.controller";
import { requireAuth } from "../controllers/auth.controller";

const router = Router();

router.delete("/", requireAuth, messageController.deleteMessages);

export { router };
