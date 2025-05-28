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
  Edit2,
  Trash2,
  ShoppingCart,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    promoCode,
    setPromoCode,
    applyPromoCode,
    discount,
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
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        closeCart();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, closeCart]);

  // Handle click outside to close shipping dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        shippingDropdownOpen &&
        sidebarRef.current &&
        !event
          .composedPath()
          .some(
            (el) =>
              (el as HTMLElement)?.classList?.contains("shipping-dropdown") ||
              (el as HTMLElement)?.classList?.contains("shipping-option")
          )
      ) {
        setShippingDropdownOpen(false);
      }
    };

    if (shippingDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [shippingDropdownOpen]);

  // Handle clear cart confirmation
  const handleClearCart = () => {
    if (showClearConfirm) {
      clearCart();
      setShowClearConfirm(false);
    } else {
      setShowClearConfirm(true);
    }
  };

  // Reset clear confirmation when cart is closed
  useEffect(() => {
    if (!isOpen) {
      setShowClearConfirm(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-opacity duration-500 ease-in-out"
      style={{ opacity: isOpen ? 1 : 0 }}
    >
      <div
        ref={sidebarRef}
        className="absolute inset-y-0 right-0 flex h-full w-full max-w-md flex-col bg-background text-foreground shadow-xl transition-transform duration-500 ease-in-out"
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
                  "h-8 w-8 rounded-full",
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
            className="text-muted-foreground hover:text-foreground hover:bg-muted"
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
              <Button onClick={closeCart} className="mt-4">
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
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex rounded-lg bg-muted overflow-hidden"
                  >
                    <div className="relative h-[80px] w-[80px] flex-shrink-0 bg-background group">
                      {item.image.startsWith("http") ? (
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      )}
                      {/* Edit icon overlay that appears on hover */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 bg-background/50 group-hover:opacity-100 transition-opacity">
                        <div className="rounded-full bg-primary p-2">
                          <Edit2 className="h-4 w-4 text-primary-foreground" />
                        </div>
                      </div>
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
                          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center rounded-md border border-border bg-muted">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none text-muted-foreground hover:text-foreground hover:bg-transparent"
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
                            className="h-8 w-8 rounded-none text-muted-foreground hover:text-foreground hover:bg-transparent"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <span className="font-medium">+</span>
                            <span className="sr-only">Increase quantity</span>
                          </Button>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-foreground">
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
              </div>

              {/* Order Summary - now part of the scrollable content */}
              <div className="rounded-lg bg-muted p-4">
                <h3 className="mb-3 font-medium text-foreground">
                  Order Summary
                </h3>

                {/* Shipping Method */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2 text-foreground">
                    Shipping Method
                  </h4>
                  <div className="relative">
                    <div
                      className="shipping-dropdown w-full rounded-md border border-border bg-background p-3 text-sm cursor-pointer flex justify-between items-center"
                      onClick={() =>
                        setShippingDropdownOpen(!shippingDropdownOpen)
                      }
                    >
                      <div>
                        <div className="font-medium text-foreground">
                          {selectedShippingMethod.name}
                        </div>
                        <div className="text-muted-foreground text-xs">
                          {selectedShippingMethod.description}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-foreground">
                          ${selectedShippingMethod.price.toFixed(2)}
                        </span>
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>

                    {shippingDropdownOpen && (
                      <div className="absolute z-10 mt-1 w-full rounded-md border border-border bg-background shadow-lg">
                        {shippingMethods.map((method) => (
                          <div
                            key={method.id}
                            className={cn(
                              "shipping-option p-3 cursor-pointer hover:bg-muted flex justify-between items-center",
                              method.id === selectedShippingMethod.id &&
                                "bg-muted"
                            )}
                            onClick={() => {
                              setSelectedShippingMethod(method);
                              setShippingDropdownOpen(false);
                            }}
                          >
                            <div>
                              <div className="font-medium text-foreground">
                                {method.name}
                              </div>
                              <div className="text-muted-foreground text-xs">
                                {method.description}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-foreground">
                                ${method.price.toFixed(2)}
                              </span>
                              {method.id === selectedShippingMethod.id && (
                                <Check className="h-4 w-4 text-primary" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Promo Code */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2 text-foreground">
                    Promo Code
                  </h4>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="outline" onClick={applyPromoCode}>
                      Apply
                    </Button>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-500">
                      <span>Discount</span>
                      <span>-{formatCurrency(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-foreground">
                      {formatCurrency(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-2 font-medium">
                    <span className="text-foreground">Total</span>
                    <span className="text-foreground">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>

                {/* Additional Info */}
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
                  className="mt-4 w-full gap-2"
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
