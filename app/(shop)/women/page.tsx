"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product-card";
import HorizontalFilters from "@/components/shop/ShopFilter";

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
  tags: string[];
}

export default function WomenPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/products?category=women");
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

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">No products found</h2>
          <p className="text-muted-foreground">
            Try adjusting your filters or check back later
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Women's Collection</h1>
            <p className="text-muted-foreground">
              {products.length} products found
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
