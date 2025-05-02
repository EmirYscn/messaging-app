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
