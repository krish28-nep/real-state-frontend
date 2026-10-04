import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

function decodeJwt(token: string): { exp: number } | null {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

function isExpiringSoon(token: string, bufferSeconds = 30): boolean {
  const payload = decodeJwt(token);
  if (!payload?.exp) return true;
  return Date.now() > payload.exp * 1000 - bufferSeconds * 1000;
}

export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

async function refreshAccessToken(): Promise<string | null> {
  if (isRefreshing) {
    return new Promise((resolve) => {
      refreshQueue.push(resolve);
    });
  }

  isRefreshing = true;

  try {
    const response = await apiClient.post<{ accessToken: string }>("/auth/refresh");
    const newToken = response.data.accessToken;
    setAccessToken(newToken);

    refreshQueue.forEach((resolve) => resolve(newToken));
    refreshQueue = [];

    return newToken;
  } catch {
    setAccessToken(null);

    refreshQueue.forEach((resolve) => resolve(null));
    refreshQueue = [];

    return null;
  } finally {
    isRefreshing = false;
  }
}

apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  if (config.url?.includes("/auth/refresh")) {
    return config;
  }

  if (accessToken && isExpiringSoon(accessToken)) {
    const newToken = await refreshAccessToken();
    if (newToken) accessToken = newToken;
  }

  if (accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isAuthEndpoint = originalRequest.url?.includes("/auth/");

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      const newToken = await refreshAccessToken();

      if (newToken) {
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      }

      if (typeof window !== "undefined") {
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  },
);

export async function restoreSession(): Promise<string | null> {
  return refreshAccessToken();
}