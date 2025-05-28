"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/providers/cart-provider";

export function CartButton() {
  const { toggleCart, itemCount } = useCart();

  return (
    <button
      onClick={toggleCart}
      className="relative flex items-center justify-center text-foreground hover:cursor-pointer"
    >
      <ShoppingCart className="h-6 w-6" />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 inline-flex items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-xs font-bold text-primary-foreground">
          {itemCount}
        </span>
      )}
    </button>
  );
}

export default CartButton;
