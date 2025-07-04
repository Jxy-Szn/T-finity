"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { SearchBar } from "./SearchBar";
import Switch from "./Switch";
import {
  CircleUser,
  LogOut,
  Package,
  Settings,
  User,
  CreditCard,
  Shirt,
  Headphones,
  Heart,
  ShoppingCart,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CartButton } from "@/components/cart-button";
import { WishlistButton } from "@/components/wishlist-button";

// Ensure Pacifico font is loaded (Google Fonts)
if (typeof window !== "undefined") {
  const id = "pacifico-font";
  if (!document.getElementById(id)) {
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Pacifico&display=swap";
    document.head.appendChild(link);
  }
}

const Navbar = () => {
  const { user, loading, checkAuth, clearSession, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await checkAuth();
      } catch (error) {
        console.error("Auth check failed:", error);
        clearSession();
      }
    };
    verifyAuth();
  }, [checkAuth, clearSession]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
      // Force clear session even if logout API fails
      clearSession();
      router.push("/");
    }
  };

  const handleSignInClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Always clear session and token before navigating to /signin
    clearSession();
    // Also clear the token cookie directly (in case clearSession is not enough)
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/signin");
  };

  const handleSupportClick = () => {
    window.location.href = "mailto:byronjason902@gmail.com";
  };

  console.log("Navbar render - user:", user, "loading:", loading);

  return (
    <nav className="bg-background px-4 py-2 flex items-center justify-between top-0 z-50 sticky">
      {/* Left Items */}
      {/* Logo */}
      <Link href="/">
        <span
          style={{ fontFamily: "Pacifico, cursive" }}
          className="text-3xl font-medium text-foreground tracking-tight select-none"
        >
          T-finity
        </span>
      </Link>

      {/* SearchBar */}
      <div className="flex-grow mx-4 max-w-xl">
        <SearchBar />
      </div>

      {/* Right Items */}
      <div className="flex items-center space-x-6 text-sm">
        {/* Theme Toggle */}
        <Switch />

        {/* User Menu */}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full p-0"
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/user/profile")}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/user/orders")}>
                <Package className="mr-2 h-4 w-4" />
                <span>Orders</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/user/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} disabled={loading}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>{loading ? "Logging out..." : "Log out"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/signin" onClick={handleSignInClick}>
            <div className="flex items-center space-x-1 cursor-pointer">
              <CircleUser size={24} />
            </div>
          </Link>
        )}

        {/* Wishlist */}
        <WishlistButton />

        {/* Cart */}
        <CartButton />
      </div>
    </nav>
  );
};

export default Navbar;
