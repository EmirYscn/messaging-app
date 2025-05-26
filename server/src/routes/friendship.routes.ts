import { Router } from "express";

import * as friendshipController from "../controllers/friendship.controller";
import { requireAuth } from "../controllers/auth.controller";

const router = Router();

router.get("/", requireAuth, friendshipController.getFriends);
router.delete("/:friendId", requireAuth, friendshipController.deleteFriend);

export { router };
