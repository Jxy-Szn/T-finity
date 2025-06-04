"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/providers/cart-provider";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  onSale: boolean;
  discount?: number;
}

interface CategorySettings {
  headerText: string;
  headerColor: string;
}

export function Category() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<CategorySettings>({
    headerText: "Limited Stock Deals",
    headerColor: "bg-purple-500",
  });
  const { addItem } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch settings
        const settingsResponse = await fetch("/api/category-settings");
        if (settingsResponse.ok) {
          const settingsData = await settingsResponse.json();
          setSettings(settingsData.settings);
        }

        // Fetch products
        const productsResponse = await fetch(
          "/api/products?limit=6&sort=-createdAt"
        );
        if (!productsResponse.ok) throw new Error("Failed to fetch products");
        const productsData = await productsResponse.json();
        setProducts(productsData.products);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      color: "",
      variant: "",
      quantity: 1,
      image: product.images[0] || "/placeholder.png",
    });
    toast.success("Added to cart");
  };

  return (
    <section className="w-full">
      <div className={`${settings.headerColor} p-4 rounded-t-xl`}>
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">
            {settings.headerText}
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
                  <div className="flex items-center justify-between">
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
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span className="sr-only">Add to cart</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>
    </section>
  );
}
