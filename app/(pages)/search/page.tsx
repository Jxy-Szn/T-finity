"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { SearchBar } from "@/components/search-bar";
import { ProductCardSkeleton } from "@/components/skeletons/product-card-skeleton";
import ShopFilters from "@/components/shop/ShopFilter";

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
  brand?: string;
  createdAt: string;
}

interface FilterState {
  priceRange: [number, number];
  colors: string[];
  sizes: string[];
  sortBy: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 500],
    colors: [],
    sizes: [],
    sortBy: "price-desc",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      if (!query) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `/api/products?query=${encodeURIComponent(query)}`
        );
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
  }, [query]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  // Apply filters to products
  const filteredProducts = products.filter((product) => {
    // Price range filter
    if (
      product.price < filters.priceRange[0] ||
      product.price > filters.priceRange[1]
    ) {
      return false;
    }

    // Color filter
    if (filters.colors.length > 0 && product.colors) {
      const hasMatchingColor = product.colors.some((color) =>
        filters.colors.includes(color.name)
      );
      if (!hasMatchingColor) return false;
    }

    // Size filter
    if (filters.sizes.length > 0 && product.sizes) {
      const hasMatchingSize = product.sizes.some((size) =>
        filters.sizes.includes(size.name)
      );
      if (!hasMatchingSize) return false;
    }

    return true;
  });

  // Sort products based on selected option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (filters.sortBy) {
      case "price-desc":
        return b.price - a.price;
      case "price-asc":
        return a.price - b.price;
      default:
        return 0;
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {!query && (
        <div className="mb-8">
          <SearchBar />
        </div>
      )}

      {error ? (
        <div className="text-center text-red-500">Error: {error}</div>
      ) : (
        <>
          {query && (
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold">
                Search Results for "{query}"
              </h1>
              <p className="text-muted-foreground">
                {sortedProducts.length} products found
              </p>
            </div>
          )}

          <ShopFilters onFilterChange={handleFilterChange} className="mb-8" />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading ? (
              Array.from({ length: 8 }).map((_, index) => (
                <ProductCardSkeleton key={`loading-${index}`} />
              ))
            ) : sortedProducts.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <h2 className="text-2xl font-bold mb-2">No products found</h2>
                <p className="text-muted-foreground">
                  Try adjusting your search or browse our categories
                </p>
              </div>
            ) : (
              sortedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
