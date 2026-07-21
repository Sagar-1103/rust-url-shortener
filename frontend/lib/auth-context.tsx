"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  UserProfile,
  getAccessToken,
  clearTokens,
  getProfileApi,
  loginApi,
  signupApi,
  logoutApi,
  ApiResponse,
  Tokens,
} from "@/lib/api";

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<ApiResponse<Tokens>>;
  signup: (username: string, password: string) => Promise<ApiResponse<Tokens>>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => ({ success: false, message: "", data: null }),
  signup: async () => ({ success: false, message: "", data: null }),
  logout: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await getProfileApi();
      if (res.success && res.data) {
        setUser(res.data);
      } else {
        setUser(null);
        clearTokens();
      }
    } catch {
      setUser(null);
      clearTokens();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    const res = await loginApi(username, password);
    if (res.success) {
      await refreshProfile();
    } else {
      setIsLoading(false);
    }
    return res;
  };

  const signup = async (username: string, password: string) => {
    setIsLoading(true);
    const res = await signupApi(username, password);
    if (res.success) {
      await refreshProfile();
    } else {
      setIsLoading(false);
    }
    return res;
  };

  const logout = async () => {
    setIsLoading(true);
    await logoutApi();
    setUser(null);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
