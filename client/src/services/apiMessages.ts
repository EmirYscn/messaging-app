import axios from "axios";
import { api } from "./apiAuth";

export const deleteMessages = async (messageIds: string[]) => {
  try {
    await api.delete(`/api/v1/messages/`, { data: { messageIds } });
  } catch (error: unknown) {
    // Extract error message from response
    if (axios.isAxiosError(error)) {
      const serverMessage =
        error.response?.data?.message || "Couldn't delete messages";
      throw new Error(serverMessage);
    }

    throw new Error("An unexpected error occurred.");
  }
};

export const uploadMedia = async (media: File) => {
  try {
    const formData = new FormData();
    formData.append("media", media);
    const res = await api.post(`/api/v1/messages/media`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data.data.media;
  } catch (error: unknown) {
    // Extract error message from response
    if (axios.isAxiosError(error)) {
      const serverMessage =
        error.response?.data?.message || "Couldn't send media message";
      throw new Error(serverMessage);
    }

    throw new Error("An unexpected error occurred.");
  }
};

export const uploadImageMessage = async (chatId: string, image: File) => {
  try {
    const formData = new FormData();
    formData.append("imageMessage", image);
    const res = await api.post(`/api/v1/messages/${chatId}/image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error: unknown) {
    // Extract error message from response
    if (axios.isAxiosError(error)) {
      const serverMessage =
        error.response?.data?.message || "Couldn't send image";
      throw new Error(serverMessage);
    }

    throw new Error("An unexpected error occurred.");
  }
};
