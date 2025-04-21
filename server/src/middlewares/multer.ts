import { Request } from "express";
import multer from "multer";

const storage = multer.memoryStorage();

const userPhotoFilter = (
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

const uploadUserAvatarMulter = multer({
  storage: storage,
  fileFilter: userPhotoFilter,
  limits: { fileSize: 0.7 * 1024 * 1024 }, // 700KB limit
});

export const uploadUserAvatar = uploadUserAvatarMulter.single("avatar");
