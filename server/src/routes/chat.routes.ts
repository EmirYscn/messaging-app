import { Router } from "express";

import * as chatController from "../controllers/chat.controller";

import { uploadGroupImage } from "../middlewares/multer";
import { resizePhoto } from "../middlewares/sharp";
import { requireAuth } from "../controllers/auth.controller";

const router = Router();

router.get("/", requireAuth(), chatController.getChats);
router.post("/", requireAuth(), chatController.createChat);
router.post(
  "/group",
  requireAuth(),
  uploadGroupImage,
  resizePhoto,
  chatController.createGroupChat
);
router.patch("/:id/leave", requireAuth(), chatController.leaveChat);
router.post("/:id/add-users", requireAuth(), chatController.addUserToChat);
router.get("/public-chats", chatController.getPublicChats);
router.get("/:id", requireAuth(), chatController.getChat);

router.get("/:id/messages", requireAuth(), chatController.getMessages);

export { router };
