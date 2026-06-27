"use client";

import { useState, useEffect, useCallback } from "react";
import { User } from "@/types";
import { authService } from "@/services/auth.service";
import { getStoredUser, clearAuthData, isAuthenticated } from "@/lib/auth";
import { useRouter } from "next/navigation";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = getStoredUser();
    if (stored && isAuthenticated()) {
      setUser(stored);
      authService.getMe().then(setUser).catch(() => {
        clearAuthData();
        setUser(null);
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const tokens = await authService.login(email, password);
    setUser(tokens.user);
    return tokens;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    router.push("/login");
  }, [router]);

  return { user, loading, login, logout, isAuthenticated: !!user };
}
