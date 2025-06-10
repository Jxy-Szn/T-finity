"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/providers/cart-provider";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  X,
  CreditCard,
  RefreshCcw,
  ShieldCheck,
  Truck,
  Check,
  ChevronDown,
  Trash2,
  ShoppingCart,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CartSidebar() {
  const router = useRouter();
  const {
    isOpen,
    closeCart,
    items,
    itemCount,
    updateQuantity,
    removeItem,
    subtotal,
    shipping,
    total,
    shippingMethods,
    selectedShippingMethod,
    setSelectedShippingMethod,
    clearCart,
  } = useCart();

  const sidebarRef = useRef<HTMLDivElement>(null);
  const [shippingDropdownOpen, setShippingDropdownOpen] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest(".cart-content")
      ) {
        closeCart();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, closeCart]);

  const handleClearCart = () => {
    if (showClearConfirm) {
      clearCart();
      setShowClearConfirm(false);
    } else {
      setShowClearConfirm(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-opacity duration-500 ease-in-out"
      style={{
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? "auto" : "none",
      }}
    >
      <div
        ref={sidebarRef}
        className="absolute inset-y-0 right-0 flex h-full w-full max-w-md flex-col bg-background text-foreground shadow-xl transition-transform duration-500 ease-in-out cart-content"
        style={{ transform: isOpen ? "translateX(0)" : "translateX(100%)" }}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-lg font-medium text-foreground">
                Shopping Cart
              </h2>
              <p className="text-sm text-muted-foreground">
                {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
              </p>
            </div>
            {items.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearCart}
                className={cn(
                  "h-8 w-8 rounded-full cursor-pointer",
                  showClearConfirm
                    ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
                title={showClearConfirm ? "Confirm clear cart" : "Clear cart"}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">
                  {showClearConfirm ? "Confirm clear cart" : "Clear cart"}
                </span>
              </Button>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={closeCart}
            className="text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        {/* Make the entire content scrollable */}
        <div className="flex-1 overflow-auto p-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center">
              <div className="rounded-full bg-muted p-3">
                <ShoppingCart className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="mt-4 text-lg font-medium text-foreground">
                Your cart is empty
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Add items to your cart to see them here
              </p>
              <Button onClick={closeCart} className="mt-4 cursor-pointer">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Clear cart confirmation message */}
              {showClearConfirm && (
                <div className="rounded-lg bg-destructive/10 border border-destructive p-3 text-sm flex items-center justify-between">
                  <p className="text-foreground">
                    Are you sure you want to clear your cart?
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowClearConfirm(false)}
                      className="h-7 px-2 text-xs hover:bg-muted"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        clearCart();
                        setShowClearConfirm(false);
                      }}
                      className="h-7 px-2 text-xs"
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              )}

              {/* Cart Items */}
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 rounded-lg border p-4">
                  <div className="relative h-20 w-20 overflow-hidden rounded-md bg-muted">
                    {item.image.startsWith("data:image") ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-3">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium text-foreground">
                          {item.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {item.color} • {item.variant}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center rounded-md border border-border bg-muted">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none text-muted-foreground hover:text-foreground hover:bg-transparent cursor-pointer"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          <span className="font-medium">-</span>
                          <span className="sr-only">Decrease quantity</span>
                        </Button>
                        <span className="w-8 text-center text-foreground">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none text-muted-foreground hover:text-foreground hover:bg-transparent cursor-pointer"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <span className="font-medium">+</span>
                          <span className="sr-only">Increase quantity</span>
                        </Button>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {formatCurrency(item.price)}
                        </div>
                        {item.originalPrice && (
                          <div className="text-sm text-muted-foreground line-through">
                            {formatCurrency(item.originalPrice)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Order Summary */}
              <div className="rounded-lg border p-4">
                <h3 className="font-medium">Order Summary</h3>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{formatCurrency(shipping)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-medium">{formatCurrency(total)}</span>
                  </div>
                </div>

                {/* Shipping Method */}
                <div className="mt-4">
                  <div
                    className="flex cursor-pointer items-center justify-between rounded-lg border p-3"
                    onClick={() =>
                      setShippingDropdownOpen(!shippingDropdownOpen)
                    }
                  >
                    <div>
                      <p className="font-medium">
                        {selectedShippingMethod.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedShippingMethod.description}
                      </p>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        shippingDropdownOpen && "rotate-180"
                      )}
                    />
                  </div>
                  {shippingDropdownOpen && (
                    <div className="mt-2 space-y-2 rounded-lg border p-2">
                      {shippingMethods.map((method) => (
                        <div
                          key={method.id}
                          className="flex cursor-pointer items-center justify-between rounded-md p-2 hover:bg-muted"
                          onClick={() => {
                            setSelectedShippingMethod(method);
                            setShippingDropdownOpen(false);
                          }}
                        >
                          <div>
                            <p className="font-medium">{method.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {method.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">
                              {formatCurrency(method.price)}
                            </span>
                            {selectedShippingMethod.id === method.id && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Trust Badges */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <RefreshCcw className="h-3.5 w-3.5" />
                    <span>Free returns within 30 days</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Secure payment</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Truck className="h-3.5 w-3.5" />
                    <span>Fast delivery</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button
                  className="mt-4 w-full gap-2 cursor-pointer"
                  onClick={() => {
                    closeCart();
                    router.push("/checkout");
                  }}
                >
                  <CreditCard className="h-4 w-4" />
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
