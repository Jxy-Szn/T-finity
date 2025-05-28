"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "customer";
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on mount
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        setAuthState({
          user: data.user,
          loading: false,
          error: null,
        });
        return data.user;
      }
      return null;
    } catch (error) {
      setAuthState({
        user: null,
        loading: false,
        error: "Failed to check authentication status",
      });
      return null;
    }
  };

  const login = async (email: string, password: string) => {
    setAuthState({ ...authState, loading: true, error: null });
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Raw login API response:", response);
      console.log("Login API response status:", response.status);
      console.log("Login API response data:", data);
      console.log(
        "Login API response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Ensure we have the user data with role
      if (!data.user || !data.user.role) {
        console.error("Invalid user data in response:", data);
        console.error("Response data type:", typeof data);
        console.error("User data type:", typeof data.user);
        console.error(
          "User data keys:",
          data.user ? Object.keys(data.user) : "no user data"
        );
        throw new Error("Invalid user data received");
      }

      setAuthState({
        user: data.user,
        loading: false,
        error: null,
      });

      return data.user;
    } catch (error: any) {
      console.error("Login hook error:", error); // Debug log
      setAuthState({
        ...authState,
        loading: false,
        error: error.message || "Login failed",
      });
      throw error;
    }
  };

  const signup = async (email: string, name: string, password: string) => {
    try {
      setAuthState({ ...authState, loading: true, error: null });
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || "Signup failed";
        setAuthState({
          ...authState,
          loading: false,
          error: errorMessage,
        });
        throw new Error(errorMessage);
      }

      setAuthState({ ...authState, loading: false, error: null });
      return data;
    } catch (error: any) {
      if (error instanceof Error) {
        setAuthState({
          ...authState,
          loading: false,
          error: error.message,
        });
        throw error;
      }
      const errorMessage = "Failed to create account";
      setAuthState({
        ...authState,
        loading: false,
        error: errorMessage,
      });
      throw new Error(errorMessage);
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    try {
      setAuthState({ ...authState, loading: true, error: null });
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Verification failed");
      }

      setAuthState({ ...authState, loading: false, error: null });

      // Redirect to login page after successful verification
      router.push("/signin");
    } catch (error: any) {
      setAuthState({
        ...authState,
        loading: false,
        error: error.message || "Verification failed",
      });
      throw error;
    }
  };

  const resendOTP = async (email: string) => {
    setAuthState({ ...authState, loading: true, error: null });
    try {
      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to resend OTP");
      }

      setAuthState({ ...authState, loading: false, error: null });
    } catch (error: any) {
      setAuthState({
        ...authState,
        loading: false,
        error: error.message || "Failed to resend OTP",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Prevent multiple logout attempts
      if (authState.loading) return;

      setAuthState({ ...authState, loading: true });

      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      // Clear the auth state
      setAuthState({
        user: null,
        loading: false,
        error: null,
      });

      // Use replace instead of push to prevent back navigation
      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      setAuthState({
        ...authState,
        loading: false,
        error: "Logout failed",
      });
      throw error;
    }
  };

  return {
    ...authState,
    login,
    signup,
    verifyOTP,
    resendOTP,
    logout,
    checkAuth,
  };
}
