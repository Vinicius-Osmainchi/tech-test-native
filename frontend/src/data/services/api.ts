import axios from "axios";
import { clearAuthToken, getAuthToken } from "./authStorage";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isLoginRequest = error.config?.url?.includes("/login");

      if (!isLoginRequest) {
        clearAuthToken();

        if (window.location.pathname !== "/login") {
          window.location.replace("/login");
        }
      }
    }

    return Promise.reject(error);
  },
);
