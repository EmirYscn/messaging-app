import { Router } from "express";

import * as authController from "../controllers/auth.controller";

import { validateSignup } from "../middlewares/validate";

import passport from "../strategies/passport";

const router = Router();

router.post("/signup", validateSignup, authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get(
  "/getCurrentUser",
  authController.requireAuth,
  authController.getCurrentUser
);
router.post("/refresh-token", authController.refreshToken);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/callback", authController.googleCallback);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get("/github/callback", authController.githubCallback);

export { router };
