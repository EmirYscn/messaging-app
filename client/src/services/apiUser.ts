import axios from "axios";
import { api } from "./apiAuth";
import {
  Chat,
  FriendRequest,
  Profile,
  UpdateUserDTO,
  User,
} from "../types/types";

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

export const getProfile = async (userId: string): Promise<Profile> => {
  try {
    const res = await api.get(`/api/v1/users/${userId}/profile`);
    return res.data.profile;
  } catch (error: unknown) {
    // Extract error message from response
    if (axios.isAxiosError(error)) {
      const serverMessage =
        error.response?.data?.message || "Couldn't fetch profile";
      throw new Error(serverMessage);
    }

    throw new Error("An unexpected error occurred.");
  }
};

export const updateUser = async (userId: string, body: UpdateUserDTO) => {
  try {
    await api.patch(`/api/v1/users/${userId}`, body);
  } catch (error: unknown) {
    // Extract error message from response
    if (axios.isAxiosError(error)) {
      const serverMessage =
        error.response?.data?.message || "Couldn't update profile";
      throw new Error(serverMessage);
    }

    throw new Error("An unexpected error occurred.");
  }
};

export const updateUserAvatar = async (body: FormData, userId: string) => {
  try {
    await api.patch(`/api/v1/users/${userId}/avatar`, body);
  } catch (error: unknown) {
    // Extract error message from response
    if (axios.isAxiosError(error)) {
      const serverMessage =
        error.response?.data?.message || "Couldn't update profile";
      throw new Error(serverMessage);
    }

    throw new Error("An unexpected error occurred.");
  }
};

export const getFriends = async (userId: string): Promise<User[]> => {
  try {
    const res = await api.get(`/api/v1/users/${userId}/friends`);
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

export const getReceivedFriendRequests = async (
  userId: string
): Promise<FriendRequest[]> => {
  try {
    const res = await api.get(
      `/api/v1/users/${userId}/received-friend-requests`
    );
    return res.data.friendRequests;
  } catch (error: unknown) {
    // Extract error message from response
    if (axios.isAxiosError(error)) {
      const serverMessage =
        error.response?.data?.message ||
        "Couldn't fetch received friends requests";
      throw new Error(serverMessage);
    }

    throw new Error("An unexpected error occurred.");
  }
};

export const getSentFriendRequests = async (
  userId: string
): Promise<FriendRequest[]> => {
  try {
    const res = await api.get(`/api/v1/users/${userId}/sent-friend-requests`);
    return res.data.friendRequests;
  } catch (error: unknown) {
    // Extract error message from response
    if (axios.isAxiosError(error)) {
      const serverMessage =
        error.response?.data?.message || "Couldn't fetch sent friend requests";
      throw new Error(serverMessage);
    }

    throw new Error("An unexpected error occurred.");
  }
};
