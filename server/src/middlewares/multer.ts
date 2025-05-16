import { MEDIA_TYPE } from "@prisma/client";
import { NextFunction, Request } from "express";
import multer from "multer";

declare module "express-serve-static-core" {
  interface Request {
    mediaType?: MEDIA_TYPE | "other";
  }
}

const storage = multer.memoryStorage();

const photoFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimeTypes = [
    "image/jpg",
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const inferMediaType = (
  req: Request,
  file: Express.Multer.File,
  next: NextFunction
) => {
  const mimeType = file.mimetype;

  if (mimeType.startsWith("image/")) {
    req.mediaType = "IMAGE";
  } else if (mimeType.startsWith("video/")) {
    req.mediaType = "VIDEO";
  } else if (mimeType.startsWith("audio/")) {
    req.mediaType = "AUDIO";
  } else {
    req.mediaType = "other";
  }

  next();
};

const uploadUserAvatarMulter = multer({
  storage: storage,
  fileFilter: photoFilter,
  limits: { fileSize: 0.7 * 1024 * 1024 }, // 700KB limit
});

const uploadGroupImageMulter = multer({
  storage: storage,
  fileFilter: photoFilter,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB limit
});

const uploadImageMessageMulter = multer({
  storage: storage,
  fileFilter: photoFilter,
  limits: { fileSize: 0.5 * 1024 * 1024 }, // 500kb limit
});

const uploadMediaMulter = multer({
  storage,
  fileFilter: (req, file, cb) => {
    inferMediaType(req, file, () => {});
    if (req.mediaType === "other") {
      return cb(null, false);
    }
    cb(null, true);
  },
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB limit
});

export const uploadUserAvatar = uploadUserAvatarMulter.single("avatar");
export const uploadGroupImage = uploadGroupImageMulter.single("groupImage");
export const uploadImageMessage =
  uploadImageMessageMulter.single("imageMessage");
export const uploadMedia = uploadMediaMulter.single("media");
