import axios from "axios";
import { api } from "./apiAuth";
import { FriendRequest } from "../types/types";

export const sendFriendRequest = async (receiverId: string) => {
  try {
    await api.post(`/api/v1/friendRequests/${receiverId}`);
  } catch (error: unknown) {
    // Extract error message from response
    if (axios.isAxiosError(error)) {
      const serverMessage =
        error.response?.data?.message || "Couldn't send friend request";
      throw new Error(serverMessage);
    }

    throw new Error("An unexpected error occurred.");
  }
};

export const acceptFriendRequest = async (requestId: string) => {
  try {
    await api.patch(`/api/v1/friendRequests/${requestId}/accept`);
  } catch (error: unknown) {
    // Extract error message from response
    if (axios.isAxiosError(error)) {
      const serverMessage =
        error.response?.data?.message || "Couldn't accept friend request";
      throw new Error(serverMessage);
    }

    throw new Error("An unexpected error occurred.");
  }
};
export const declineFriendRequest = async (requestId: string) => {
  try {
    await api.patch(`/api/v1/friendRequests/${requestId}/decline`);
  } catch (error: unknown) {
    // Extract error message from response
    if (axios.isAxiosError(error)) {
      const serverMessage =
        error.response?.data?.message || "Couldn't decline friend request";
      throw new Error(serverMessage);
    }

    throw new Error("An unexpected error occurred.");
  }
};

export const deleteFriendRequest = async (requestId: string) => {
  try {
    await api.delete(`/api/v1/friendRequests/${requestId}`);
  } catch (error: unknown) {
    // Extract error message from response
    if (axios.isAxiosError(error)) {
      const serverMessage =
        error.response?.data?.message || "Couldn't delete friend request";
      throw new Error(serverMessage);
    }

    throw new Error("An unexpected error occurred.");
  }
};

export const getSentFriendRequests = async (): Promise<FriendRequest[]> => {
  try {
    const res = await api.get("/api/v1/friendRequests/sent");
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

export const getReceivedFriendRequests = async (): Promise<FriendRequest[]> => {
  try {
    const res = await api.get("/api/v1/friendRequests/received");
    return res.data.friendRequests;
  } catch (error: unknown) {
    // Extract error message from response
    if (axios.isAxiosError(error)) {
      const serverMessage =
        error.response?.data?.message ||
        "Couldn't fetch received friend requests";
      throw new Error(serverMessage);
    }

    throw new Error("An unexpected error occurred.");
  }
};
