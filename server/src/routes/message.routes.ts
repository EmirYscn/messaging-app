import { Router } from "express";

import * as messageController from "../controllers/message.controller";
import { requireAuth } from "../controllers/auth.controller";

import { uploadMedia } from "../middlewares/multer";
import { compressMedia } from "../middlewares/sharp";

const router = Router();

router.post(
  "/media",
  requireAuth,
  uploadMedia,
  compressMedia,
  messageController.createMedia
);

router.delete("/", requireAuth, messageController.deleteMessages);

export { router };
