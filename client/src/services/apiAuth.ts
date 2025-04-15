import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

// Create axios instance with base URL
export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add authorization header
api.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem("jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);
