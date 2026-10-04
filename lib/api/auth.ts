import { apiClient, setAccessToken } from "./client";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  fullName: string;
  role: "TENANT" | "LANDLORD";
  phone?: string;
}

interface AuthResponse {
  accessToken: string;
}

async function authenticate(path: string, credentials: LoginCredentials | RegisterCredentials) {
  const response = await apiClient.post<AuthResponse>(path, credentials);
  setAccessToken(response.data.accessToken);
  return response.data;
}

export function login(credentials: LoginCredentials) {
  return authenticate("/auth/login", credentials);
}

export function register(credentials: RegisterCredentials) {
  return authenticate("/auth/register", credentials);
}