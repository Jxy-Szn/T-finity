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
} from "lucide-react";
import { WishlistButton } from "@/components/wishlist-button";
import { CartButton } from "@/components/cart-button";
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
  const { user, loading, logout, checkAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Check auth status when component mounts
    checkAuth();
  }, [checkAuth]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  return (
    <nav className="bg-background px-4 py-2 flex items-center justify-between top-0 z-50 sticky">
      {/* Left Items */}
      {/* Logo */}
      <Link href="/">
        <span
          style={{ fontFamily: "Pacifico, cursive" }}
          className="text-3xl font-medium text-foreground tracking-tight select-none pl-10"
        >
          Tifinity
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
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/orders")}>
                <Package className="mr-2 h-4 w-4" />
                <span>Orders</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/payment")}>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Payment Methods</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/settings")}>
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
          <Link href="/signin">
            <div className="flex items-center space-x-1 cursor-pointer">
              <CircleUser size={24} />
            </div>
          </Link>
        )}

        {/* Wishlist */}
        <div className="flex items-center space-x-1 cursor-pointer">
          <WishlistButton />
        </div>

        {/* Cart */}
        <div className="relative flex items-center space-x-1 cursor-pointer pr-10">
          <CartButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
