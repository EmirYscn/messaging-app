import { NextFunction, Request, Response } from "express";
import sharp from "sharp";

export const resizePhoto = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.file?.buffer) return next();

  try {
    const resizedBuffer = await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 50 })
      .toBuffer();

    req.file.buffer = resizedBuffer;
    req.file.mimetype = "image/jpeg";

    next();
  } catch (error) {
    console.log("Error resizing image: ", error);
    res.status(500).json({ message: "Error processing image", error });
  }
};

export const compressImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.file?.buffer) return next();
  try {
    const compressedBuffer = await sharp(req.file.buffer)
      .toFormat("jpeg")
      .jpeg({ quality: 50 })
      .toBuffer();
    req.file.buffer = compressedBuffer;
    req.file.mimetype = "image/jpeg";
    next();
  } catch (error) {
    console.log("Error compressing image: ", error);
    res.status(500).json({ message: "Error processing image", error });
  }
};

export const compressMedia = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { mediaType } = req;
  if (mediaType === "IMAGE") {
    return compressImage(req, res, next);
  }

  next();
};
