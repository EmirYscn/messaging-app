import { Router } from "express";

import * as userController from "../controllers/user.controller";

const router = Router();

router.patch("/:id", userController.updateUser);
router.get("/:id/chats", userController.getChats);
router.get("/:id/profile", userController.getProfile);

export { router };
