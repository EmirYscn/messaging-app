import { Router } from "express";

import { requireAuth } from "../controllers/auth.controller";
import * as friendRequestController from "../controllers/friendRequest.controller";

const router = Router();

router.post(
  "/:receiverId",
  requireAuth,
  friendRequestController.sendFriendRequest
);

router.patch(
  "/:requestId/accept",
  requireAuth,
  friendRequestController.acceptFriendRequest
);
router.patch(
  "/:requestId/decline",
  requireAuth,
  friendRequestController.declineFriendRequest
);
router.delete(
  "/:requestId",
  requireAuth,
  friendRequestController.deleteFriendRequest
);

router.get("/sent", requireAuth, friendRequestController.getSentFriendRequests);
router.get(
  "/received",
  requireAuth,
  friendRequestController.getReceivedFriendRequests
);

export { router };
