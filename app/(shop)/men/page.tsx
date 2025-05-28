"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { ProductCardSkeleton } from "@/components/skeletons/product-card-skeleton";
import HorizontalFilters from "@/components/shop/ShopFilter";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  subcategory?: string;
  colors?: { name: string; value: string }[];
  sizes?: { name: string; value: string }[];
  rating: number;
  reviewCount: number;
  stock: number;
  featured: boolean;
  onSale: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export default function MenPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/products?category=men");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch products");
        }

        setProducts(data.products);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container py-2 pl-32 pr-4">
      <div className="mb-2">
        <HorizontalFilters />
      </div>

      {error ? (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Men's Collection</h1>
            {!loading && (
              <p className="text-muted-foreground">
                {products.length} products found
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {loading ? (
              // Show 8 skeleton cards while loading
              Array.from({ length: 8 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))
            ) : products.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <h2 className="text-2xl font-bold mb-2">No products found</h2>
                <p className="text-muted-foreground">
                  Try adjusting your filters or check back later
                </p>
              </div>
            ) : (
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
