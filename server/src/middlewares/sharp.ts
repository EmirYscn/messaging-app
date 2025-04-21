import { NextFunction, Request, Response } from "express";
import sharp from "sharp";

export const resizeUserPhoto = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) return next();

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
