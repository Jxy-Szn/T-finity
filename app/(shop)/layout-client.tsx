"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";

export function ShopLayoutClient() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  useEffect(() => {
    // Add any client-side layout effects here
    // For example, you could track page views or handle auth state changes
  }, [pathname, user]);

  return null; // This component doesn't render anything directly
}
