"use client";

import React, { useEffect, useState } from "react";
import { Hero } from "../components/Hero";
import { ProductCard } from "@/components/product-card";
import { ProductCardSkeleton } from "@/components/skeletons/product-card-skeleton";
import { create } from "zustand";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Contact } from "../components/Contact";
import { Category } from "@/components/category";
import { CartSidebar } from "@/components/cart-sidebar";
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  colors?: { name: string; value: string }[];
  sizes?: { name: string; value: string }[];
  rating: number;
  reviewCount: number;
  category: string;
  onSale: boolean;
}

interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
  slug: string;
  featured: boolean;
  order: number;
}

interface ProductStore {
  products: Product[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
  fetchProducts: () => Promise<void>;
  reset: () => void;
}

const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  loading: false,
  error: null,
  hasMore: true,
  page: 1,
  fetchProducts: async () => {
    const { page, products } = get();
    if (get().loading || !get().hasMore) return;

    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/products?page=${page}&limit=12`);
      if (!response.ok) throw new Error("Failed to fetch products");

      const data = await response.json();
      set({
        products: [...products, ...data.products],
        hasMore: data.products.length === 12,
        page: page + 1,
        loading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        loading: false,
      });
    }
  },
  reset: () => set({ products: [], page: 1, hasMore: true, error: null }),
}));

const Page = () => {
  const { products, loading, error, hasMore, fetchProducts } =
    useProductStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [observerTarget, setObserverTarget] = useState<HTMLDivElement | null>(
    null
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchProducts();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget) {
      observer.observe(observerTarget);
    }

    return () => {
      if (observerTarget) {
        observer.unobserve(observerTarget);
      }
    };
  }, [observerTarget, hasMore, loading, fetchProducts]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <CartSidebar />
      <Hero />

      {/* Products Section */}
      <div className="container mx-auto px-4 py-8 mt-12">
        <h2 className="text-2xl font-bold mb-6">Our Products</h2>

        {error && (
          <div className="text-center text-red-500">Error: {error}</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}

          {/* Loading state */}
          {loading &&
            Array.from({ length: 4 }).map((_, index) => (
              <ProductCardSkeleton key={`loading-${index}`} />
            ))}
        </div>

        {/* Intersection Observer target */}
        <div ref={setObserverTarget} className="h-10" />
      </div>

      {/* Contact Section */}
      <Contact />
    </div>
  );
};

export default Page;
