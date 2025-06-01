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

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<User | null>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      error: null,

      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      checkAuth: async () => {
        try {
          set({ loading: true, error: null });
          const response = await fetch("/api/auth/me");
          if (response.ok) {
            const data = await response.json();
            const userData = data.user;
            set({ user: userData, loading: false, error: null });
            return userData;
          }
          set({ user: null, loading: false, error: null });
          return null;
        } catch (error) {
          set({
            user: null,
            loading: false,
            error: "Failed to check authentication status",
          });
          return null;
        }
      },

      logout: async () => {
        const { loading } = get();
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

          set({ user: null, loading: false, error: null });
          window.location.href = "/"; // Force a full page reload to clear all state
        } catch (error) {
          console.error("Logout error:", error);
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
