import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import AppError from "../utils/appError";
// import { sanitizeFilename } from "../utils/sanitizeFilename";

export const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

export const supabase = createClient(supabaseUrl!, supabaseKey!);

// export const uploadFile = async (file: Express.Multer.File, userId: number) => {
//   const { originalname, buffer, mimetype } = file;
//   const uniqueFileName = `${uuidv4()}-${sanitizeFilename(originalname)}`;
//   const { data, error } = await supabase.storage
//     .from("files")
//     .upload(`uploads/user-${userId}/${uniqueFileName}`, buffer, {
//       contentType: mimetype,
//     });
//   if (error) {
//     console.log(error);
//     throw error;
//   }
//   console.log("Uploaded file", data);
//   const fileUrl = data.path;
//   console.log("File Url", fileUrl);
//   return fileUrl;
// };

export const uploadAvatar = async (
  file: Express.Multer.File,
  userId: string
) => {
  const { buffer } = file;
  const timestamp = Date.now();
  const folderPath = `user-${userId}`;
  const filePath = `${folderPath}/avatar-${timestamp}.jpeg`; // Ensure only one file per user

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
  const filePath = `${folderPath}/avatar-${timestamp}.jpeg`; // Ensure only one file per user

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

    const publicUrl = `${data.publicUrl}?t=${Date.now()}`;
    return publicUrl;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw new AppError("Failed to upload group image", 500);
  }
};

// export const deleteFile = async (fileUrl: string) => {
//   const { data, error } = await supabase.storage
//     .from("files")
//     .remove([fileUrl]);
//   if (error) {
//     console.log(error);
//     throw error;
//   }
//   console.log("Deleted File with url: ", fileUrl);
// };

// export const downloadFile = async (fileUrl: string) => {
//   const { data, error } = await supabase.storage
//     .from("files")
//     .download(fileUrl);
//   if (error) {
//     console.log(error);
//     throw error;
//   }
//   console.log("Downloaded File with url: ", fileUrl);
//   return data;
// };
