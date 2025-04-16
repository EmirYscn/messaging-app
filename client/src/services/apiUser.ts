import axios from "axios";
import { api } from "./apiAuth";
import { Chat } from "../types/types";

export const getChats = async (
  userId: string
): Promise<{ chats: Chat[]; count: number }> => {
  try {
    const res = await api.get(`/api/v1/users/${userId}/chats`);
    return { chats: res.data.chats, count: res.data.count };
  } catch (error: unknown) {
    // Extract error message from response
    if (axios.isAxiosError(error)) {
      const serverMessage =
        error.response?.data?.message || "Couldn't fetch chats";
      throw new Error(serverMessage);
    }

    throw new Error("An unexpected error occurred.");
  }
};
