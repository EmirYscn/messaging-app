import axios from "axios";
import { User } from "../types/types";
import { connectSocket, socket } from "./socket";
import { api } from "./axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const getCurrentUser = async (): Promise<User> => {
  try {
    const res = await api.get("/api/v1/auth/getCurrentUser");
    return res.data.user;
  } catch (error: unknown) {
    // If the token is invalid or expired, clear it
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // socket.disconnect();
    }
    throw error;
  }
};

export type SignupType = {
  email: string;
  username: string;
  password: string;
  passwordConfirm?: string;
};

export const signup = async (data: SignupType) => {
  try {
    const res = await api.post("/api/v1/auth/signup", data);
    return res.data;
  } catch (error: unknown) {
    console.log();
    // Extract error message from response
    if (axios.isAxiosError(error)) {
      const serverMessage =
        error.response?.data?.message ||
        error.response?.data.error[0].msg ||
        "Couldn't signup";
      throw new Error(serverMessage);
    }

    throw new Error("An unexpected error occurred.");
  }
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export const login = async (data: LoginCredentials): Promise<User> => {
  try {
    const res = await api.post("/api/v1/auth/login", data);
    // Save JWT tokens to localStorage
    localStorage.setItem("accessToken", res.data.accessToken);
    localStorage.setItem("refreshToken", res.data.refreshToken);
    // connect socket
    connectSocket();

    return res.data.user;
  } catch (error: unknown) {
    // Extract error message from response
    if (axios.isAxiosError(error)) {
      const serverMessage =
        error.response?.data?.message ||
        error.response?.data.error[0].msg ||
        "Couldn't login";
      throw new Error(serverMessage);
    }

    throw new Error("An unexpected error occurred.");
  }
};

export const logout = async (): Promise<void> => {
  try {
    await api.post("/api/v1/auth/logout"); // This should clear the cookie on the server
    localStorage.removeItem("accessToken"); // Clear access token from localStorage
    localStorage.removeItem("refreshToken"); // Clear refresh token from localStorage
    socket.disconnect();
  } catch (error) {
    console.error("Logout failed", error);
  }
};

// Create axios instance with base URL
export const bareApi = axios.create({
  baseURL: API_BASE_URL,
});

export const refreshToken = async (): Promise<{
  accessToken: string;
  refreshToken: string;
}> => {
  try {
    const res = await bareApi.post("/api/v1/auth/refresh-token", {
      refreshToken: localStorage.getItem("refreshToken"),
    });

    return res.data;
  } catch (error) {
    console.log("Error refreshing token:", error);
    throw error;
  }
};
