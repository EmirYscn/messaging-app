import { ROLE, User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";

import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";

import * as userQueries from "../db/user.queries";

import passport, { generateToken } from "../strategies/passport";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config/config";

const CLIENT_URL = config.clientUrl;
const JWT_SECRET = config.jwtSecret;
const SERVER_JWT_SECRET = config.server.jwtSecret;
const SERVER_JWT_EXPIRESIN = config.server.jwtExpiresIn;

export interface DecodedJwt {
  sub: string;
  userId: string;
  email: string;
  username: string;
  displayName: string;
  profileId: string;
  avatar: string;
  iat: number;
  exp: number;
  aud: string;
  iss: string;
}

export const checkAccountStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { data: token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Encoded data is required" });
    }

    let data: DecodedJwt;
    try {
      data = jwt.verify(token, SERVER_JWT_SECRET) as DecodedJwt;
    } catch (error) {
      return res.status(400).json({ message: "Invalid token" });
    }

    // 1. Check if already linked by mainAppUserId
    const linkedUser = await userQueries.findUserByMainAppUserId(data.userId);

    if (linkedUser) {
      return res.json({
        status: "linked",
        accounts: {
          externalUser: data,
          internalUser: linkedUser,
        },
      });
    }
    // 2. Optionally, check if a user exists with the same email (not yet linked)
    const userByEmail = await userQueries.findUserByEmail(data.email);

    if (userByEmail) {
      return res.json({
        status: "not_linked",
        accounts: {
          externalUser: data,
          internalUser: userByEmail,
        },
      });
    }

    return res.json({
      status: "not_found",
      accounts: {
        externalUser: data,
      },
    });
  }
);

export const linkAccounts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { externalUser, internalUser } = req.body;

    const authenticatedUser = req.user as User;

    if (!authenticatedUser) {
      return res.status(401).json({
        message: "Please log in to your messaging app account to link",
      });
    }

    if (internalUser.id !== authenticatedUser.id) {
      return res.status(403).json({
        message: "Cannot link another user's account",
      });
    }

    // link accounts
    const updatedInternalUser = await userQueries.linkAccounts(
      externalUser,
      internalUser
    );
    // Generate a JWT token
    const { accessToken, refreshToken } = await generateToken(
      updatedInternalUser
    );

    return res.json({
      user: {
        id: updatedInternalUser.id,
        email: updatedInternalUser.email,
        username: updatedInternalUser.username,
        avatar: updatedInternalUser.avatar,
        role: updatedInternalUser.role,
      },
      accessToken,
      refreshToken,
    });
  }
);

export const getTokens = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req.body;

    // Generate a JWT token
    const { accessToken, refreshToken } = await generateToken(user);

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  }
);

export const createAndContinue = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req.body;
    const { password } = user;

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = { ...user, password: hashedPassword };

    const newUser = await userQueries.createUserAndLink(userData);

    // Generate a JWT token
    const { accessToken, refreshToken } = await generateToken(newUser);

    return res.json({
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        avatar: newUser.avatar,
        role: newUser.role,
      },
      accessToken,
      refreshToken,
    });
  }
);

export const getCurrentUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // The user is already attached to req by the requireAuth middleware
  // Just return the user data from req.user
  try {
    if (!req.user) {
      res.status(401).json({
        status: "fail",
        message: "No authenticated user found",
      });
      return;
    }

    const user = req.user as User;

    res.status(200).json({
      status: "success",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(403).json({
        body: { ...req.body, password: null },
        error: result.array(),
      });
    }

    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = { ...req.body, password: hashedPassword };

    const newUser = await userQueries.createUser(user);

    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
  }
);

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "local",
    { session: false },
    async (
      err: Error | null,
      user: User | false,
      info: { message: string }
    ) => {
      if (err) {
        return res.status(500).json({ error: "Internal server error" });
      }
      if (!user) {
        return next(new AppError("Invalid email or password", 401));
      }
      // Generate a JWT token
      const { accessToken, refreshToken } = await generateToken(user);

      return res.json({
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          avatar: user.avatar,
          role: user.role,
        },
        accessToken,
        refreshToken,
      });
    }
  )(req, res, next);
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });
  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};

// Middleware to protect routes with JWT authentication
export const requireAuth =
  (options?: { message?: string }) =>
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "jwt",
      { session: false },
      (err: any, user: any, info: any) => {
        if (err) return next(err);

        if (!user) {
          return res.status(401).json({
            message: options?.message || "Unauthorized",
            details: info ? info.message : "JWT authentication failed",
          });
        }

        req.user = user;
        return next();
      }
    )(req, res, next);
  };

export const refreshToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    // Verify the refresh token
    jwt.verify(refreshToken, JWT_SECRET, async (err: any, decoded: any) => {
      if (err || !decoded) {
        return res.status(401).json({ message: "Invalid refresh token" });
      }

      // Find the user by ID from the decoded token
      const user = await userQueries.findUserById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Generate new tokens
      const { accessToken, refreshToken: newRefreshToken } =
        await generateToken(user);

      res.status(200).json({
        accessToken,
        refreshToken: newRefreshToken,
      });
    });
  }
);

export const restrictTo = (...roles: ROLE[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;

    if (!roles.includes(user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};

export const googleCallback = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "google",
    { session: false },
    async (err: any, user: User) => {
      if (err) return next(err);

      if (!user) return res.redirect(`${CLIENT_URL}/login?error=auth_failed`);

      // Generate a JWT token
      const { accessToken, refreshToken } = await generateToken(user);

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
          accessToken,
          refreshToken,
        })
      ).toString("base64");

      // Build redirect URL
      let redirectUrl = `${CLIENT_URL}/auth-success?data=${payload}`;
      if (req.query.state) {
        const redirectParam = decodeURIComponent(req.query.state as string);
        redirectUrl = `${CLIENT_URL}/auth-success?redirect=${encodeURIComponent(
          redirectParam
        )}&data=${payload}`;
      }

      return res.redirect(redirectUrl);
    }
  )(req, res, next);
};

export const githubCallback = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "github",
    { session: false },
    async (err: any, user: User) => {
      if (err) return next(err);

      if (!user) return res.redirect(`${CLIENT_URL}/login?error=auth_failed`);

      // Generate a JWT token
      const { accessToken, refreshToken } = await generateToken(user);

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
          accessToken,
          refreshToken,
        })
      ).toString("base64");

      // Redirect to frontend with token
      return res.redirect(`${CLIENT_URL}/auth-success?data=${payload}`);
    }
  )(req, res, next);
};
