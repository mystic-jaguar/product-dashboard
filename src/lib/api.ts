import axios, { AxiosError } from "axios";
import { clearToken, getToken } from "./token";

// The one shared Axios instance. Every service file uses it.
export const api = axios.create({
  baseURL: "https://dummyjson.com",
  timeout: 15000,
});

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
  }
}

// Add the login token to every request.
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Turn every failure into an ApiError with a readable message, in one place.
api.interceptors.response.use(
  (res) => res,
  (err: AxiosError<{ message?: string }>) => {
    // Cancelled requests (old searches) pass through so callers can ignore them.
    if (axios.isCancel(err)) return Promise.reject(err);

    const status = err.response?.status;
    const isLogin = err.config?.url?.includes("/auth/login");

    // Session expired: log out and go to the login page.
    if (status === 401 && !isLogin && typeof window !== "undefined") {
      clearToken();
      // Outside React there is no router; a full page load to /login is fine here.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = "/login";
    }

    const message =
      err.response?.data?.message ||
      (err.code === "ECONNABORTED" ? "Request timed out" : "") ||
      (err.response ? `Request failed (${status})` : "Network error, check your connection");
    return Promise.reject(new ApiError(message, status));
  }
);
