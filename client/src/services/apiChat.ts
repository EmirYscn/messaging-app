import axios from "axios";
import { Chat, Message } from "../types/types";
import { api } from "./axios";

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
  chatId: string,
  cursor?: string | null
): Promise<{
  messages: Message[];
  count: number;
  nextCursor: string | null;
}> => {
  try {
    const res = await api.get(`/api/v1/chats/${chatId}/messages`, {
      params: cursor ? { cursor } : {},
    });
    return {
      messages: res.data.messages,
      count: res.data.count,
      nextCursor: res.data.nextCursor,
    };
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

export const createGroupChat = async (body: {
  name: string;
  userIds: string[];
  imageFile?: File | null;
}) => {
  try {
    const formData = new FormData();
    formData.append("name", body.name);
    formData.append("userIds", JSON.stringify(body.userIds));
    if (body.imageFile) {
      formData.append("groupImage", body.imageFile);
    }

    const res = await api.post("/api/v1/chats/group", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data.chat;
  } catch (error: unknown) {
    // Extract error message from response
    if (axios.isAxiosError(error)) {
      const serverMessage =
        error.response?.data?.message || "Couldn't create group chat";
      throw new Error(serverMessage);
    }

    throw new Error("An unexpected error occurred.");
  }
};

export const leaveGroupChat = async (chatId: string) => {
  try {
    await api.patch(`/api/v1/chats/${chatId}/leave`);
  } catch (error: unknown) {
    // Extract error message from response
    if (axios.isAxiosError(error)) {
      const serverMessage =
        error.response?.data?.message || "Couldn't leave group chat";
      throw new Error(serverMessage);
    }

    throw new Error("An unexpected error occurred.");
  }
};

export const addUsersToGroup = async (chatId: string, userIds: string[]) => {
  try {
    const res = await api.post(`/api/v1/chats/${chatId}/add-users`, {
      userIds,
    });
    return res.data.chatId;
  } catch (error: unknown) {
    // Extract error message from response
    if (axios.isAxiosError(error)) {
      const serverMessage =
        error.response?.data?.message || "Couldn't add users to group";
      throw new Error(serverMessage);
    }

    throw new Error("An unexpected error occurred.");
  }
};
