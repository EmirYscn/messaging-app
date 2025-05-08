import { Router } from "express";
import { User } from "@prisma/client";

import { validateSignup } from "../middlewares/validate";
import * as authController from "../controllers/auth.controller";
import passport, { generateToken } from "../strategies/passport";

const router = Router();

const CLIENT_URL = process.env.CLIENT_URL;

router.post("/signup", validateSignup, authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get(
  "/getCurrentUser",
  authController.requireAuth,
  authController.getCurrentUser
);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/callback", (req, res, next) => {
  passport.authenticate(
    "google",
    { session: false },
    (err: any, user: User) => {
      if (err) return next(err);

      if (!user) return res.redirect(`${CLIENT_URL}/login?error=auth_failed`);

      // Generate a JWT token
      const token = generateToken(user);

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
      });

      // Include user data
      const userData = {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        role: user.role,
      };

      // Encode as base64 to avoid URL issues
      const payload = Buffer.from(
        JSON.stringify({
          user: userData,
          provider: "Google",
        })
      ).toString("base64");
      // Redirect to frontend with token
      return res.redirect(`${CLIENT_URL}/auth-success?data=${payload}`);
    }
  )(req, res, next);
});

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get("/github/callback", (req, res, next) => {
  passport.authenticate(
    "github",
    { session: false },
    (err: any, user: User) => {
      if (err) return next(err);

      if (!user) return res.redirect(`${CLIENT_URL}/login?error=auth_failed`);

      // Generate a JWT token
      const token = generateToken(user);

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
      });

      // Include user data
      const userData = {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        role: user.role,
      };

      // Encode as base64 to avoid URL issues
      const payload = Buffer.from(
        JSON.stringify({
          user: userData,
          provider: "GitHub",
        })
      ).toString("base64");

      // Redirect to frontend with token
      return res.redirect(`${CLIENT_URL}/auth-success?data=${payload}`);
    }
  )(req, res, next);
});

export { router };
