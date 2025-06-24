import axios from "axios";

import { User } from "../types/types";
import { api } from "./axios";

export const getFriends = async (): Promise<User[]> => {
  try {
    const res = await api.get("/api/v1/friends/");
    return res.data.friends;
  } catch (error: unknown) {
    // Extract error message from response
    if (axios.isAxiosError(error)) {
      const serverMessage =
        error.response?.data?.message || "Couldn't fetch friends";
      throw new Error(serverMessage);
    }

    throw new Error("An unexpected error occurred.");
  }
};

export const removeFriend = async (friendId: string) => {
  try {
    await api.delete(`/api/v1/friends/${friendId}`);
  } catch (error: unknown) {
    // Extract error message from response
    if (axios.isAxiosError(error)) {
      const serverMessage =
        error.response?.data?.message || "Couldn't delete friend";
      throw new Error(serverMessage);
    }

    throw new Error("An unexpected error occurred.");
  }
};
