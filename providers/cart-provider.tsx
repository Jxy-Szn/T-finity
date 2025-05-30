"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { products } from "@/data/products";
import { toast } from "sonner";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  color: string;
  variant: string;
  quantity: number;
  image: string;
};

export type ShippingMethod = {
  id: string;
  name: string;
  description: string;
  price: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  toggleCart: () => void;
  closeCart: () => void;
  openCart: () => void;
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
  promoCode: string;
  setPromoCode: (code: string) => void;
  applyPromoCode: () => void;
  discount: number;
  shippingMethods: ShippingMethod[];
  selectedShippingMethod: ShippingMethod;
  setSelectedShippingMethod: (method: ShippingMethod) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const defaultShippingMethods: ShippingMethod[] = [
  {
    id: "standard",
    name: "Standard Shipping",
    description: "3-5 days",
    price: 5.99,
  },
  {
    id: "express",
    name: "Express Shipping",
    description: "1-2 days",
    price: 12.99,
  },
  {
    id: "overnight",
    name: "Overnight Shipping",
    description: "Next day",
    price: 19.99,
  },
];

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [shippingMethods] = useState<ShippingMethod[]>(defaultShippingMethods);
  const [selectedShippingMethod, setSelectedShippingMethod] =
    useState<ShippingMethod>(defaultShippingMethods[0]);

  // Calculate totals
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = selectedShippingMethod.price;
  const total = subtotal + shipping - discount;

  // Log cart state changes
  useEffect(() => {
    console.log("Cart state updated:", {
      items,
      subtotal,
      shipping,
      total,
      selectedShippingMethod,
      discount,
    });
  }, [items, subtotal, shipping, total, selectedShippingMethod, discount]);

  // Load cart from localStorage on client
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        console.log("Loading cart from localStorage:", parsedCart);
        setItems(parsedCart);
      } catch (e) {
        console.error("Failed to parse cart from localStorage:", e);
      }
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    console.log("Saving cart to localStorage:", items);
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addItem = (item: CartItem) => {
    console.log("Adding item to cart:", item);
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      toast.success("Added to cart");
      return [...prevItems, item];
    });
  };

  const removeItem = (id: string) => {
    console.log("Removing item from cart:", id);
    setItems((prevItems) => {
      const item = prevItems.find((i) => i.id === id);
      if (item) {
        toast.success("Removed from cart");
      }
      return prevItems.filter((item) => item.id !== id);
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    console.log("Updating item quantity:", { id, quantity });
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    console.log("Clearing cart");
    setItems([]);
    localStorage.removeItem("cart");
    toast.success("Cart cleared");
  };

  const toggleCart = () => setIsOpen((prev) => !prev);
  const closeCart = () => setIsOpen(false);
  const openCart = () => setIsOpen(true);

  const applyPromoCode = async () => {
    if (!promoCode.trim()) {
      toast.error("Please enter a promo code");
      return;
    }

    try {
      const response = await fetch(`/api/promocodes/apply?code=${promoCode}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to apply promo code");
      }

      if (data.type === "percentage") {
        setDiscount(subtotal * (data.discount / 100));
      } else {
        setDiscount(data.discount);
      }

      toast.success("Promo code applied successfully");
    } catch (error: any) {
      setDiscount(0);
      toast.error(error.message || "Failed to apply promo code");
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isOpen,
        toggleCart,
        closeCart,
        openCart,
        itemCount,
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
