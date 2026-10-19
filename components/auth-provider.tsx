"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export interface CustomerData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  defaultAddress?: any;
  orders?: {
    nodes: any[];
  };
  addresses?: {
    nodes: any[];
  };
}

export type AuthReason = "cart" | "favourites" | "account" | "checkout";

interface AuthContextValue {
  isAuthenticated: boolean;
  customer: CustomerData | null;
  loading: boolean;
  configured: boolean;
  favourites: string[];
  favouritesCount: number;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
  toggleFavourite: (handle: string) => Promise<boolean>;
  isFavourite: (handle: string) => boolean;
  requireAuth: (
    targetUrl: string,
    reason?: AuthReason,
    actionParams?: Record<string, string>
  ) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [configured, setConfigured] = useState(true);
  const [loading, setLoading] = useState(true);
  const [favourites, setFavourites] = useState<string[]>([]);

  // Fetch account status and verified favourites
  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/account");
      const data = await res.json();

      const authed = Boolean(data.authenticated && data.customer);
      setIsAuthenticated(authed);
      setCustomer(data.customer || null);
      setConfigured(Boolean(data.configured));

      if (authed) {
        // Fetch favourites for authenticated customer
        try {
          const favRes = await fetch("/api/account/favourites");
          if (favRes.ok) {
            const favData = await favRes.json();
            setFavourites(favData.handles || []);
          }
        } catch {
          // Non-blocking
        }
      } else {
        setFavourites([]);
      }
    } catch (err) {
      console.error("Auth provider refresh failed:", err);
      setIsAuthenticated(false);
      setCustomer(null);
      setFavourites([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Ignore
    }
    setIsAuthenticated(false);
    setCustomer(null);
    setFavourites([]);
    // Remove client cart lines to prevent subsequent users from seeing private cart
    try {
      localStorage.removeItem("third_shelf_bag_v1");
      localStorage.removeItem("third_shelf_bag_note_v1");
    } catch {
      // Ignore
    }
    router.push("/login");
  }, [router]);

  const requireAuth = useCallback(
    (
      targetUrl: string,
      reason: AuthReason = "account",
      actionParams?: Record<string, string>
    ) => {
      // Clean path and safely append action parameters
      const [path, query] = targetUrl.split("?");
      const params = new URLSearchParams(query || "");

      if (actionParams) {
        Object.entries(actionParams).forEach(([k, v]) => {
          params.set(k, v);
        });
      }

      const queryString = params.toString();
      const destination = queryString ? `${path}?${queryString}` : path;
      const loginUrl = `/login?redirectTo=${encodeURIComponent(destination)}&reason=${reason}`;

      router.push(loginUrl);
    },
    [router]
  );

  const toggleFavourite = useCallback(
    async (handle: string): Promise<boolean> => {
      if (!isAuthenticated) {
        requireAuth(`/products/${handle}`, "favourites", { action: "favourite" });
        return false;
      }

      const isFav = favourites.includes(handle);
      const method = isFav ? "DELETE" : "POST";

      try {
        const res = await fetch("/api/account/favourites", {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ handle }),
        });

        if (res.ok) {
          const data = await res.json();
          setFavourites(data.handles || []);
          return !isFav;
        }
      } catch (err) {
        console.error("Toggle favourite failed:", err);
      }
      return isFav;
    },
    [isAuthenticated, favourites, requireAuth]
  );

  const isFavourite = useCallback(
    (handle: string) => {
      return favourites.includes(handle);
    },
    [favourites]
  );

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        customer,
        loading,
        configured,
        favourites,
        favouritesCount: favourites.length,
        refresh,
        logout,
        toggleFavourite,
        isFavourite,
        requireAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return ctx;
}
