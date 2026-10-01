
// lib/axios.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const BASE_URL = 'http://localhost:4000';

// ---------------------------------------------------------------------------
// In-memory access token store
// ---------------------------------------------------------------------------
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

// ---------------------------------------------------------------------------
// JWT decoding helper (no external library needed)
// ---------------------------------------------------------------------------
function decodeJwt(token: string): { exp: number } | null {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

function isExpiringSoon(token: string, bufferSeconds = 30): boolean {
  const payload = decodeJwt(token);
  if (!payload?.exp) return true;
  const expiresAtMs = payload.exp * 1000;
  return Date.now() > expiresAtMs - bufferSeconds * 1000;
}

// ---------------------------------------------------------------------------
// Axios instance
// ---------------------------------------------------------------------------
export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // sends the httpOnly refresh cookie on every request
});

// ---------------------------------------------------------------------------
// Refresh logic with request queueing
// (prevents multiple simultaneous /auth/refresh calls)
// ---------------------------------------------------------------------------
let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

async function refreshAccessToken(): Promise<string | null> {
  if (isRefreshing) {
    // Another refresh is already in flight — wait for it instead of
    // starting a second one.
    return new Promise((resolve) => {
      refreshQueue.push(resolve);
    });
  }

  isRefreshing = true;

  try {
    const res = await axios.post(
      `${BASE_URL}/auth/refresh`,
      {},
      { withCredentials: true },
    );

    const newToken: string = res.data.accessToken;
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

// ---------------------------------------------------------------------------
// REQUEST interceptor — proactive refresh
// Runs before every request. If the current access token is about to
// expire, refresh it first so the request goes out with a valid token.
// ---------------------------------------------------------------------------
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  // Don't try to refresh while calling the refresh endpoint itself
  if (config.url?.includes('/auth/refresh')) {
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

// ---------------------------------------------------------------------------
// RESPONSE interceptor — reactive fallback
// Catches any 401 the proactive check missed (clock drift, laptop was
// asleep, token revoked server-side, etc) and retries once.
// ---------------------------------------------------------------------------
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isAuthEndpoint = originalRequest.url?.includes('/auth/');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true; // prevents infinite retry loops

      const newToken = await refreshAccessToken();

      if (newToken) {
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest); // retry the original request
      }

      // Refresh failed — session is truly dead, send to login
      if (typeof window !== 'undefined') {
        window.location.replace('/login');
      }
    }

    return Promise.reject(error);
  },
);

// ---------------------------------------------------------------------------
// Call this once on app startup (e.g. in a root layout/provider) to
// silently restore a session from the httpOnly refresh cookie after a
// hard page reload, since the in-memory accessToken resets to null.
// ---------------------------------------------------------------------------
export async function restoreSession(): Promise<string | null> {
  return refreshAccessToken();
}
