import { Router } from "express";

import * as chatController from "../controllers/chat.controller";
import { requireAuth } from "../controllers/auth.controller";

const router = Router();

router.get("/", requireAuth, chatController.getChats);
router.post("/", requireAuth, chatController.createChat);
router.get("/public-chats", chatController.getPublicChats);
router.get("/:id", requireAuth, chatController.getChat);
router.get("/:id/messages", requireAuth, chatController.getMessages);

export { router };
