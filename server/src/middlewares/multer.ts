import { Request } from "express";
import multer from "multer";

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

export const uploadUserAvatar = uploadUserAvatarMulter.single("avatar");
export const uploadGroupImage = uploadGroupImageMulter.single("groupImage");
export const uploadImageMessage =
  uploadImageMessageMulter.single("imageMessage");
