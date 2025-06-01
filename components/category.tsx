"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  onSale: boolean;
  discount?: number;
}

export function Category() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products?limit=6&sort=-createdAt");
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="w-full">
      <div className="bg-purple-500 p-4 rounded-t-xl">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">
            Limited Stock Deals
          </h2>
          <Link href="/deals">
            <Button
              variant="link"
              className="text-white hover:underline cursor-pointer"
            >
              See All
            </Button>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 bg-background p-4">
        {loading
          ? // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <Card
                key={`skeleton-${index}`}
                className="relative animate-pulse overflow-hidden"
              >
                <div className="aspect-square bg-muted" />
                <CardContent className="p-4">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </CardContent>
              </Card>
            ))
          : products.map((product) => (
              <Card
                key={product._id}
                className="relative overflow-hidden group p-0 cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-square w-full cursor-pointer">
                  <Image
                    src={product.images[0] || "/placeholder.png"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {product.onSale && product.originalPrice && (
                    <Badge className="absolute top-2 left-2 bg-purple-400 text-white">
                      -
                      {Math.round(
                        ((product.originalPrice - product.price) /
                          product.originalPrice) *
                          100
                      )}
                      %
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium truncate mb-1 text-foreground">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <p className="text-base font-semibold text-foreground">
                      {formatCurrency(product.price)}
                    </p>
                    {product.originalPrice && (
                      <p className="text-xs text-muted-foreground line-through">
                        {formatCurrency(product.originalPrice)}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>
    </section>
  );
}
