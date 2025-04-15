import { Router } from "express";

import * as chatController from "../controllers/chat.controller";

const router = Router();

router.get("/:chatId", chatController.getChat);
router.get("/:chatId/messages", chatController.getMessages);

export { router };
