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
  authController.requireAuth(),
  authController.getCurrentUser
);
router.post("/refresh-token", authController.refreshToken);

router.get("/google", (req, res, next) => {
  const { redirect } = req.query;
  // Save redirect in session or pass as state param
  const authenticator = passport.authenticate("google", {
    scope: ["profile", "email"],
    state: redirect ? encodeURIComponent(redirect as string) : undefined,
  });
  authenticator(req, res, next);
});

router.get("/google/callback", authController.googleCallback);

router.get("/github", (req, res, next) => {
  const { redirect } = req.query;
  // Save redirect in session or pass as state param
  const authenticator = passport.authenticate("github", {
    scope: ["user:email"],
    state: redirect ? encodeURIComponent(redirect as string) : undefined,
  });
  authenticator(req, res, next);
});

router.get("/github/callback", authController.githubCallback);

router.post("/checkAccountStatus", authController.checkAccountStatus);
router.post(
  "/link-accounts",
  authController.requireAuth({
    message: "You must be logged in to link accounts",
  }),
  authController.linkAccounts
);
router.post("/get-tokens", authController.getTokens);
router.post("/create-and-continue", authController.createAndContinue);

export { router };
