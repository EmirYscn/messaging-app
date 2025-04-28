import { Router } from "express";

import * as userController from "../controllers/user.controller";
import { uploadUserAvatar } from "../middlewares/multer";
import { resizeUserPhoto } from "../middlewares/sharp";
import { requireAuth } from "../controllers/auth.controller";

const router = Router();

router.get("/", userController.getUsers);
router.patch("/:id", userController.updateUser);
router.patch(
  "/:id/avatar",
  uploadUserAvatar,
  resizeUserPhoto,
  userController.updateUserAvatar
);
router.get("/:id/profile", userController.getProfile);

export { router };
