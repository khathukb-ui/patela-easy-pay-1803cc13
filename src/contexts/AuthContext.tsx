import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface UserProfile {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  role: "admin" | "manager" | "cashier";
}

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

function buildProfile(sbUser: SupabaseUser): UserProfile {
  const meta = sbUser.user_metadata ?? {};
  return {
    id: sbUser.id,
    full_name: meta.full_name ?? "",
    email: sbUser.email ?? null,
    phone: sbUser.phone ?? null,
    role: meta.role ?? "admin",
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set up auth listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(buildProfile(session.user));
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Then check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(buildProfile(session.user));
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = useCallback(async (data: { full_name: string; email?: string; phone?: string; password: string }) => {
    try {
      // Use email if provided, otherwise use phone as a pseudo-email for auth
      const authEmail = data.email?.trim() || `${data.phone?.replace(/\+/g, "")}@phone.patela.app`;

      const { error: signUpError } = await supabase.auth.signUp({
        email: authEmail,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
            phone: data.phone,
            role: "admin",
          },
        },
      });

      if (signUpError) return { error: new Error(signUpError.message) };

      // Update profile with additional info
      const { data: { user: newUser } } = await supabase.auth.getUser();
      if (newUser) {
        await supabase.from("profiles").update({
          first_name: data.full_name.split(" ")[0],
          last_name: data.full_name.split(" ").slice(1).join(" "),
          phone: data.phone,
          email: data.email || null,
        }).eq("user_id", newUser.id);
      }

      return { error: null };
    } catch (e) {
      return { error: new Error(e instanceof Error ? e.message : "Registration failed") };
    }
  }, []);

  const signIn = useCallback(async (identifier: string, password: string) => {
    try {
      // Determine if identifier is email or phone
      const isEmail = identifier.includes("@");
      const authEmail = isEmail ? identifier : `${identifier.replace(/\+/g, "")}@phone.patela.app`;

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password,
      });

      if (signInError) return { error: new Error(signInError.message) };
      return { error: null };
    } catch (e) {
      return { error: new Error(e instanceof Error ? e.message : "Login failed") };
    }
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
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
