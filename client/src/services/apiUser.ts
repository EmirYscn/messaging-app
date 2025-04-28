import axios from "axios";
import { api } from "./apiAuth";
import { Profile, UpdateUserDTO, User } from "../types/types";

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

export const getSearchedUsers = async (username: string): Promise<User[]> => {
  try {
    const res = await api.get(`/api/v1/users?username=${username}`);
    return res.data.users;
  } catch (error: unknown) {
    // Extract error message from response
    if (axios.isAxiosError(error)) {
      const serverMessage =
        error.response?.data?.message || "Couldn't fetch users";
      throw new Error(serverMessage);
    }

    throw new Error("An unexpected error occurred.");
  }
};
