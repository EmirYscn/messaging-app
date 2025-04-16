import { Router } from "express";

import * as userController from "../controllers/user.controller";

const router = Router();

router.get("/:id/chats", userController.getChats);

export { router };
