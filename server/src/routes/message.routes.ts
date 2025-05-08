import { Router } from "express";
import * as messageController from "../controllers/message.controller";
import { requireAuth } from "../controllers/auth.controller";
import { uploadImageMessage } from "../middlewares/multer";

const router = Router();

router.post(
  "/:chatId/image",
  requireAuth,
  uploadImageMessage,
  messageController.uploadImageMessage
);
router.delete("/", requireAuth, messageController.deleteMessages);

export { router };
