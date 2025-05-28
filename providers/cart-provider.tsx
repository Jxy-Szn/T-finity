"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { products } from "@/data/products";

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

  // Load cart from localStorage on client
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart from localStorage");
      }
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prevItems, item];
    });
  };

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem("cart");
  };

  const toggleCart = () => setIsOpen((prev) => !prev);
  const closeCart = () => setIsOpen(false);
  const openCart = () => setIsOpen(true);

  const applyPromoCode = () => {
    // Simple promo code logic - in a real app, you'd validate this against a backend
    if (promoCode.toLowerCase() === "discount10") {
      setDiscount(subtotal * 0.1); // 10% discount
    } else if (promoCode.toLowerCase() === "discount20") {
      setDiscount(subtotal * 0.2); // 20% discount
    } else {
      setDiscount(0);
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
