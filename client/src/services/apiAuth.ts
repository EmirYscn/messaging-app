import axios from "axios";
import { User } from "../types/types";
import { connectSocket, socket } from "./socket";
import { api, bareApi } from "./axios";

export type ExternalUser = {
  sub: string;
  userId: string;
  email: string;
  username: string;
  displayName: string;
  profileId: string;
  avatar?: string;
  password?: string;
  iat: number;
  exp: number;
  aud: string;
  iss: string;
};

type Status = "linked" | "not_linked" | "not_found";
type Accounts = { externalUser: ExternalUser; internalUser?: User } | null;

export type AccountStatus = {
  status: Status;
  accounts: Accounts;
};

export const checkAccountStatus = async (
  decodedData: string
): Promise<AccountStatus> => {
  try {
    const res = await bareApi.post("/api/v1/auth/checkAccountStatus", {
      data: decodedData,
    });

    return { status: res.data.status, accounts: res.data.accounts };
  } catch (error: unknown) {
    // Handle error if needed
    if (axios.isAxiosError(error)) {
      const serverMessage =
        error.response?.data?.message || "Couldn't get call link";
      throw new Error(serverMessage);
    }
    throw new Error("An unexpected error occurred.");
  }
};

export const linkAccounts = async (
  externalUser: Partial<User>,
  internalUser: Partial<User>
) => {
  try {
    const data = {
      externalUser,
      internalUser,
    };
    const res = await bareApi.post("/api/v1/auth/link-accounts", data);
    // Save JWT tokens to localStorage
    localStorage.setItem("accessToken", res.data.accessToken);
    localStorage.setItem("refreshToken", res.data.refreshToken);
    socket.disconnect();
    // connect socket
    connectSocket();

    return res.data.user;
  } catch (error) {
    // Extract error message from response
    if (axios.isAxiosError(error)) {
      const serverMessage =
        error.response?.data?.message ||
        error.response?.data.error[0].msg ||
        "Couldn't link accounts";
      throw new Error(serverMessage);
    }

    throw new Error("An unexpected error occurred.");
  }
};

export const continueWithThisAccount = async (user: Partial<User>) => {
  try {
    const res = await bareApi.post("/api/v1/auth/get-tokens", { user });
    // Save JWT tokens to localStorage
    localStorage.setItem("accessToken", res.data.accessToken);
    localStorage.setItem("refreshToken", res.data.refreshToken);

    socket.disconnect();
    // connect socket
    connectSocket();

    return res.data.user;
  } catch (error) {
    // Extract error message from response
    if (axios.isAxiosError(error)) {
      const serverMessage =
        error.response?.data?.message ||
        error.response?.data.error[0].msg ||
        "Couldn't link accounts";
      throw new Error(serverMessage);
    }

    throw new Error("An unexpected error occurred.");
  }
};

export const createAndContinueWithThisAccount = async (user: Partial<User>) => {
  try {
    const res = await bareApi.post("/api/v1/auth/create-and-continue", {
      user,
    });
    // Save JWT tokens to localStorage
    localStorage.setItem("accessToken", res.data.accessToken);
    localStorage.setItem("refreshToken", res.data.refreshToken);

    socket.disconnect();
    // connect socket
    connectSocket();

    return res.data.user;
  } catch (error) {
    // Extract error message from response
    if (axios.isAxiosError(error)) {
      const serverMessage =
        error.response?.data?.message ||
        error.response?.data.error[0].msg ||
        "Couldn't create and continue";
      throw new Error(serverMessage);
    }

    throw new Error("An unexpected error occurred.");
  }
};

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
    console.log("Login response:", res.data);
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
  await api.post("/api/v1/auth/logout"); // This should clear the cookie on the server
  localStorage.removeItem("accessToken"); // Clear access token from localStorage
  localStorage.removeItem("refreshToken"); // Clear refresh token from localStorage
  socket.disconnect();
};

export const refreshToken = async (): Promise<{
  accessToken: string;
  refreshToken: string;
}> => {
  const res = await bareApi.post("/api/v1/auth/refresh-token", {
    refreshToken: localStorage.getItem("refreshToken"),
  });

  return res.data;
};
