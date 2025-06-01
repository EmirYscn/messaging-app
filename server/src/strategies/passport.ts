import { Request } from "express";
import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Profile as GoogleProfile } from "passport-google-oauth20";
import { Strategy as GithubStrategy } from "passport-github2";
import { Profile as GithubProfile } from "passport-github2";
import { Strategy as JwtStrategy } from "passport-jwt";

import * as db from "../db/user.queries";
import { prisma } from "../db/prismaClient";

import config from "../config/config";

const SERVER_URL = config.serverUrl;
const JWT_SECRET = config.jwtSecret;

const GOOGLE_CLIENT_ID = config.googleClientId;
const GOOGLE_CLIENT_SECRET = config.googleClientSecret;
const GITHUB_CLIENT_ID = config.githubClientId;
const GITHUB_CLIENT_SECRET = config.githubClientSecret;

export const generateToken = (user: User) => {
  const payload = {
    id: user.id,
    email: user.email,
    username: user.username,
  };

  return jwt.sign(payload, JWT_SECRET!, { expiresIn: "1d" });
};

const verifyCallback = async (email: string, password: string, done: any) => {
  try {
    const user = await db.findUserByEmail(email);
    if (!user) return done(null, false, { message: "No user with that email" });

    const isValid = await bcrypt.compare(password, user.password!.toString());

    if (!isValid) return done(null, false, { message: "Password incorrect" });

    done(null, user);
  } catch (error) {
    return done(error);
  }
};

const localStrategy = new LocalStrategy(
  { usernameField: "email" },
  verifyCallback
);

const googleStrategy = new GoogleStrategy(
  {
    clientID: GOOGLE_CLIENT_ID!,
    clientSecret: GOOGLE_CLIENT_SECRET!,
    callbackURL: `${SERVER_URL}/api/v1/auth/google/callback`,
  },
  async function (
    accessToken: string,
    refreshToken: string,
    profile: GoogleProfile,
    done: (error: any, user?: any) => void
  ) {
    let findUser;

    try {
      findUser = await prisma.user.findUnique({
        where: { email: profile.emails?.[0]?.value },
      });
    } catch (error) {
      return done(error);
    }

    try {
      if (!findUser) {
        const newUser = await prisma.$transaction(async (prisma) => {
          const user = await prisma.user.create({
            data: {
              email: profile.emails![0].value,
              username: profile.displayName,
              avatar: profile.photos?.[0]?.value,
            },
          });
          await prisma.profile.create({
            data: { userId: user.id },
          });
          return user;
        });

        return done(null, newUser);
      }
      return done(null, findUser);
    } catch (error) {
      console.log(error);
      return done(error);
    }
  }
);

const githubStrategy = new GithubStrategy(
  {
    clientID: GITHUB_CLIENT_ID!,
    clientSecret: GITHUB_CLIENT_SECRET!,
    callbackURL: `${SERVER_URL}/api/v1/auth/github/callback`,
    scope: ["user:email"],
  },
  async function (
    accessToken: string,
    refreshToken: string,
    profile: GithubProfile,
    done: (error: any, user?: any) => void
  ) {
    let findUser;

    try {
      findUser = await prisma.user.findUnique({
        where: { email: profile.emails?.[0]?.value },
      });
    } catch (error) {
      return done(error);
    }

    try {
      if (!findUser) {
        const newUser = await prisma.$transaction(async (prisma) => {
          const user = await prisma.user.create({
            data: {
              email: profile.emails![0].value,
              username: profile.displayName,
              avatar: profile.photos?.[0]?.value,
            },
          });
          await prisma.profile.create({
            data: { userId: user.id },
          });
          return user;
        });

        return done(null, newUser);
      }
      return done(null, findUser);
    } catch (error) {
      console.log(error);
      return done(error);
    }
  }
);

// JWT Strategy configuration
const cookieExtractor = (req: Request): string | null => {
  return req.cookies?.jwt || null;
};

const jwtOptions = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: JWT_SECRET!,
};

const jwtStrategy = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await db.findUserById(payload.id);
    console.log("JWT Strategy user:", user);
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
});

passport.use("local", localStrategy);
passport.use("google", googleStrategy);
passport.use("github", githubStrategy);
passport.use("jwt", jwtStrategy);

export default passport;
