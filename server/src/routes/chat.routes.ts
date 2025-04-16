import { Router } from "express";

import * as chatController from "../controllers/chat.controller";

const router = Router();

router.get("/:id", chatController.getChat);
router.get("/:id/messages", chatController.getMessages);

export { router };
