import { MEDIA_TYPE } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

import AppError from "../utils/appError";
import config from "../config/config";

const SUPABASE_URL = config.supabaseUrl;
const SUPABASE_KEY = config.supabaseKey;

export const supabase = createClient(SUPABASE_URL!, SUPABASE_KEY!);

export const uploadAvatar = async (
  file: Express.Multer.File,
  userId: string
) => {
  const { buffer } = file;
  const timestamp = Date.now();
  const folderPath = `user-${userId}`;
  const ext = file.mimetype.split("/")[1];
  const filePath = `${folderPath}/avatar-${timestamp}.${ext}`; // Ensure only one file per user

  try {
    // Delete existing file first (if it exists)
    const { data: files, error } = await supabase.storage
      .from("avatars")
      .list(folderPath);

    if (error) {
      throw error;
    }

    if (files && files.length > 0) {
      const filePaths = files.map((file) => `${folderPath}/${file.name}`);
      await supabase.storage.from("avatars").remove(filePaths);
    }

    // Upload the new file (ensuring the same file path)
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, buffer, { contentType: "image/jpeg", upsert: true });

    if (uploadError) throw uploadError;

    // Get Public URL
    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

    if (!data?.publicUrl) {
      throw new Error("Could not generate public URL");
    }

    const publicUrl = `${data.publicUrl}?t=${Date.now()}`;
    return publicUrl;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw new AppError("Failed to upload user avatar", 500);
  }
};

export const uploadGroupAvatar = async (
  file: Express.Multer.File,
  userId: string
) => {
  const { buffer } = file;
  const timestamp = Date.now();
  const folderPath = `group-${userId}`;
  const ext = file.mimetype.split("/")[1];
  const filePath = `${folderPath}/avatar-${timestamp}.${ext}`; // Ensure only one file per user

  try {
    // Delete existing file first (if it exists)
    const { data: files, error } = await supabase.storage
      .from("avatars")
      .list(folderPath);

    if (error) {
      throw error;
    }

    if (files && files.length > 0) {
      const filePaths = files.map((file) => `${folderPath}/${file.name}`);
      await supabase.storage.from("avatars").remove(filePaths);
    }

    // Upload the new file (ensuring the same file path)
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, buffer, { contentType: "image/jpeg", upsert: true });

    if (uploadError) throw uploadError;

    // Get Public URL
    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

    if (!data?.publicUrl) {
      throw new Error("Could not generate public URL");
    }

    const publicUrl = `${data.publicUrl}?t=${Date.now()}`;
    return publicUrl;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw new AppError("Failed to upload group image", 500);
  }
};

export const uploadMediaToBucket = async (
  mediaType: MEDIA_TYPE,
  file: Express.Multer.File,
  userId: string
): Promise<{ publicUrl: string; filePath: string }> => {
  const { buffer, mimetype } = file;
  const ext = mimetype.split("/")[1] || "bin";
  const fileName = `${userId}-${uuidv4()}.${ext}`;
  const filePath = `${mediaType}/${fileName}`;

  try {
    // Upload the new file (ensuring the same file path)
    const { error: uploadError } = await supabase.storage
      .from("medias")
      .upload(filePath, buffer, { contentType: mimetype, upsert: true });
    if (uploadError) throw uploadError;
    // Get Public URL
    const { data } = supabase.storage.from("medias").getPublicUrl(filePath);

    if (!data?.publicUrl) {
      throw new Error("Could not generate public URL");
    }

    const publicUrl = `${data.publicUrl}?t=${Date.now()}`;
    return { publicUrl, filePath };
  } catch (error) {
    console.error("Error uploading media:", error);
    throw new AppError("Failed to upload media", 500);
  }
};

export const deleteMediasFromBucket = async (filePaths: string[]) => {
  try {
    const { error } = await supabase.storage.from("medias").remove(filePaths);
    if (error) {
      console.error("Error deleting media:", error);
      throw error;
    }
  } catch (err) {
    throw new AppError("Failed to delete media", 500);
  }
};
