import { Router } from "express";

import * as userController from "../controllers/user.controller";
import { uploadUserAvatar } from "../middlewares/multer";
import { resizeUserPhoto } from "../middlewares/sharp";

const router = Router();

router.patch("/:id", userController.updateUser);
router.patch(
  "/:id/avatar",
  uploadUserAvatar,
  resizeUserPhoto,
  userController.updateUserAvatar
);
router.get("/:id/chats", userController.getChats);
router.get("/:id/profile", userController.getProfile);

// Friends routes
router.get("/:id/friends", userController.getFriends);

router.get(
  "/:id/received-friend-requests",
  userController.getReceivedFriendsRequests
);
router.get("/:id/sent-friend-requests", userController.getSentFriendsRequests);
// router.post("/:id/friend-requests", userController.sendFriendRequest);

// router.patch(
//   "/:id/friend-requests/:requestId",
//   userController.acceptFriendRequest
// );
// router.delete(
//   "/:id/friend-requests/:requestId",
//   userController.declineFriendRequest
// );

// router.delete("/:id/friends/:friendId", userController.removeFriend);

export { router };
