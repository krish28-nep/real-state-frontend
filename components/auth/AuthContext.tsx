"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { apiClient, restoreSession, setAccessToken } from "@/lib/api";

export type UserRole = "ADMIN" | "LANDLORD" | "TENANT";

export type AuthUser = {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  phone?: string | null;
  profileImage?: string | null;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type TokenClaims = { sub?: number | string; email?: string; role?: UserRole };

type AuthContextValue = {
  accessToken: string | null;
  user: AuthUser | null;
  isLoading: boolean;
  setSession: (token: string, user?: Partial<AuthUser>) => void;
  clearSession: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readClaims(token: string): Partial<AuthUser> | null {
  try {
    const encodedPayload = token.split(".")[1];
    if (!encodedPayload) return null;
    const unpadded = encodedPayload.replace(/-/g, "+").replace(/_/g, "/");
    const base64 = unpadded.padEnd(Math.ceil(unpadded.length / 4) * 4, "=");
    const payload = JSON.parse(atob(base64)) as TokenClaims;
    if (payload.sub === undefined || !payload.email || !payload.role) return null;
    return { id: Number(payload.sub), email: payload.email, role: payload.role };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setSession = useCallback((token: string, profile?: Partial<AuthUser>) => {
    setAccessToken(token);
    setAccessTokenState(token);
    const claims = readClaims(token);
    if (claims) setUser({ ...claims, ...profile } as AuthUser);
    else if (profile) setUser(profile as AuthUser);
  }, []);

  const clearSession = useCallback(() => {
    setAccessToken(null);
    setAccessTokenState(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const token = await restoreSession();
    if (!token) {
      clearSession();
      return;
    }

    setAccessTokenState(token);
    const claims = readClaims(token);
    if (claims) setUser((current) => ({ ...claims, ...current } as AuthUser));

    try {
      const response = await apiClient.get<AuthUser>("/auth/me");
      setUser(response.data);
    } catch {
      if (!claims) clearSession();
    }
  }, [clearSession]);

  useEffect(() => {
    let active = true;
    void refreshUser().finally(() => {
      if (active) setIsLoading(false);
    });
    return () => { active = false; };
  }, [refreshUser]);

  const value = useMemo(() => ({ accessToken, user, isLoading, setSession, clearSession, refreshUser }), [accessToken, user, isLoading, setSession, clearSession, refreshUser]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
