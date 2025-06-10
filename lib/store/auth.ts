import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "customer";
  image?: string;
  phone?: string;
  address?: string;
}

// Helper function to convert user ID to string format
function normalizeUserId(
  id: string | { buffer: { [key: string]: number } } | undefined
): string | undefined {
  if (!id) return undefined;
  if (typeof id === "string") return id;
  if (typeof id === "object" && "buffer" in id) {
    return Buffer.from(Object.values(id.buffer)).toString("hex");
  }
  return undefined;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  lastCheck: number;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<User | null>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  clearSession: () => void;
}

const AUTH_CHECK_INTERVAL = 60000; // 1 minute

// Helper function to clear token cookie
const clearTokenCookie = () => {
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      error: null,
      lastCheck: 0,

      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      clearSession: () => {
        clearTokenCookie();
        set({ user: null, loading: false, error: null, lastCheck: 0 });
      },

      checkAuth: async () => {
        const { lastCheck, loading, clearSession } = get();
        const now = Date.now();

        // Don't check if we've checked recently or if already loading
        if (now - lastCheck < AUTH_CHECK_INTERVAL || loading) {
          return get().user;
        }

        try {
          set({ loading: true, error: null });
          console.log("Checking auth status...");

          const response = await fetch("/api/auth/me");
          console.log("Auth check response status:", response.status);

          if (response.ok) {
            const data = await response.json();
            console.log("Auth check response data:", data);

            if (!data.user) {
              console.error("No user data in response");
              clearSession();
              return null;
            }

            // Normalize the user ID format
            const normalizedId = normalizeUserId(data.user.id || data.user._id);
            if (!normalizedId) {
              console.error(
                "Invalid user ID format:",
                data.user.id || data.user._id
              );
              clearSession();
              return null;
            }

            const userData = {
              ...data.user,
              id: normalizedId,
            };

            console.log("Setting user data:", userData);
            set({
              user: userData,
              loading: false,
              error: null,
              lastCheck: now,
            });
            return userData;
          }

          // If we get a 401 or 404, it means the user session is invalid
          if (response.status === 401 || response.status === 404) {
            console.log("Session invalid, clearing session");
            clearSession();
            return null;
          }

          console.log("Auth check failed, clearing user data");
          clearSession();
          return null;
        } catch (error) {
          console.error("Auth check error:", error);
          clearSession();
          set({
            loading: false,
            error: "Failed to check authentication status",
            lastCheck: now,
          });
          return null;
        }
      },

      logout: async () => {
        const { loading, clearSession } = get();
        if (loading) return;

        try {
          set({ loading: true, error: null });
          const response = await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
          });

          if (!response.ok) {
            throw new Error("Logout failed");
          }

          clearSession();
          window.location.href = "/"; // Force a full page reload to clear all state
        } catch (error) {
          console.error("Logout error:", error);
          // Even if the API call fails, clear the session locally
          clearSession();
          set({
            loading: false,
            error: "Logout failed",
          });
          throw error;
        }
      },

      updateUser: async (userData: Partial<User>) => {
        try {
          const response = await fetch("/api/auth/update", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
          });

          if (!response.ok) {
            throw new Error("Failed to update user");
          }

          const data = await response.json();
          set((state) => ({
            user: state.user ? { ...state.user, ...data.user } : null,
          }));
        } catch (error) {
          console.error("Update user error:", error);
          throw error;
        }
      },
    }),
    {
      name: "auth-storage", // unique name for localStorage
      partialize: (state) => ({ user: state.user }), // only persist user data
    }
  )
);
