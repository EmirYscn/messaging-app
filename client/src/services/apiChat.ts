import axios from "axios";
import { api } from "./apiAuth";
import { Chat, Message } from "../types/types";

export const getChats = async (): Promise<{ chats: Chat[]; count: number }> => {
  try {
    const res = await api.get("/api/v1/chats/");
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

export const getChat = async (chatId: string): Promise<Chat> => {
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

export const getPublicChats = async (): Promise<Chat[]> => {
  try {
    const res = await api.get("/api/v1/chats/public-chats");
    return res.data.chats;
  } catch (error: unknown) {
    // Extract error message from response
    if (axios.isAxiosError(error)) {
      const serverMessage =
        error.response?.data?.message || "Couldn't fetch public chats";
      throw new Error(serverMessage);
    }
    throw new Error("An unexpected error occurred.");
  }
};

export const getMessages = async (
  chatId: string
): Promise<{ messages: Message[]; count: number }> => {
  try {
    const res = await api.get(`/api/v1/chats/${chatId}/messages`);
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

export const createChat = async (body: string): Promise<string> => {
  try {
    const res = await api.post("/api/v1/chats", { userId: body });
    return (res.data.chat as Chat).id;
  } catch (error: unknown) {
    // Extract error message from response
    if (axios.isAxiosError(error)) {
      const serverMessage =
        error.response?.data?.message || "Couldn't create chat";
      throw new Error(serverMessage);
    }

    throw new Error("An unexpected error occurred.");
  }
};
