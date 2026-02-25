import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { authApi, UserProfile, ApiError } from "@/lib/api-client";

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  signUp: (data: { full_name: string; email?: string; phone?: string; password: string }) => Promise<{ error: Error | null }>;
  signIn: (identifier: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => void;
  userRole: "admin" | "manager" | "cashier" | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    if (authApi.isAuthenticated()) {
      authApi.me()
        .then(setUser)
        .catch(() => {
          authApi.logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const signUp = useCallback(async (data: { full_name: string; email?: string; phone?: string; password: string }) => {
    try {
      await authApi.register(data);
      const profile = await authApi.me();
      setUser(profile);
      return { error: null };
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "Registration failed";
      return { error: new Error(msg) };
    }
  }, []);

  const signIn = useCallback(async (identifier: string, password: string) => {
    try {
      await authApi.login(identifier, password);
      const profile = await authApi.me();
      setUser(profile);
      return { error: null };
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "Login failed";
      return { error: new Error(msg) };
    }
  }, []);

  const signOut = useCallback(() => {
    authApi.logout();
    setUser(null);
  }, []);

  const userRole = user?.role ?? null;

  return (
    <AuthContext.Provider value={{ user, loading, error, signUp, signIn, signOut, userRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
