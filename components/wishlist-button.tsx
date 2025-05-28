"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { useWishlist } from "@/providers/wishlist-provider";

export function WishlistButton() {
  const { items } = useWishlist();

  return (
    <Link href="/wishlist">
      <div className="relative flex items-center justify-center text-foreground">
        <Heart className="h-6 w-6" />
        {items.length > 0 && (
          <span className="absolute -top-2 -right-2 inline-flex items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-xs font-bold text-primary-foreground">
            {items.length}
          </span>
        )}
      </div>
    </Link>
  );
}

export default WishlistButton;
