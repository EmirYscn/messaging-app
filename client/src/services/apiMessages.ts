import axios from "axios";
import { api } from "./apiAuth";

export const getChat = async (chatId: string) => {
  try {
    const res = await api.get(`/api/v1/chats/${chatId}`);
    return res.data.chat;
  } catch (error: unknown) {
    // Extract error message from response
    if (axios.isAxiosError(error)) {
      const serverMessage =
        error.response?.data?.message || "Couldn't fetch chat";
      throw new Error(serverMessage);
    }

    throw new Error("An unexpected error occurred.");
  }
};

export const getMessages = async (chatId: string) => {
  try {
    const res = await api.get(`/api/v1/chats/${chatId}/messages`);
    console.log({ messages: res.data.messages, count: res.data.count });
    return { messages: res.data.messages, count: res.data.count };
  } catch (error: unknown) {
    // Extract error message from response
    if (axios.isAxiosError(error)) {
      const serverMessage =
        error.response?.data?.message || "Couldn't fetch messages";
      throw new Error(serverMessage);
    }

    throw new Error("An unexpected error occurred.");
  }
};
