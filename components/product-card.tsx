"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, ShoppingCart } from "lucide-react";
import { useCart } from "@/providers/cart-provider";
import { useWishlist } from "@/providers/wishlist-provider";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { ProductDetailDrawer } from "@/components/product-detail-drawer";

interface ProductCardProps {
  product: {
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
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    isInWishlist,
  } = useWishlist();
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const inWishlist = isInWishlist(product._id);

  const handleAddToCart = () => {
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      color: product.colors?.[0]?.value || "",
      variant: product.sizes?.[0]?.value || "",
      quantity: 1,
      image: product.images[0],
    });
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inWishlist) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist({
        id: product._id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images[0],
        rating: product.rating,
        reviewCount: product.reviewCount,
      });
    }
  };

  return (
    <>
      <div className="flex flex-col rounded-lg overflow-hidden bg-background border border-border">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden">
          {product.images[0].startsWith("http") ? (
            <img
              src={product.images[0] || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Image
              src={product.images[0] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
            />
          )}
        </div>

        {/* Product Info */}
        <div className="p-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-base text-foreground">
                {product.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {product.category}
              </p>
            </div>
            <div className="flex items-center">
              <div className="flex">
                <svg
                  className="h-4 w-4 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <span className="ml-1 text-sm text-foreground">
                {product.rating.toFixed(1)}
              </span>
              <span className="ml-1 text-xs text-muted-foreground">
                ({product.reviewCount})
              </span>
            </div>
          </div>

          {/* More Info Link */}
          <button
            onClick={() => setIsDetailOpen(true)}
            className="mt-2 text-sm text-primary underline hover:text-primary/80"
          >
            More Info
          </button>

          {/* Price and Add to Cart */}
          <div className="mt-2 flex items-center justify-between">
            <div>
              <span className="font-medium text-lg text-foreground">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && (
                <span className="ml-2 text-sm text-muted-foreground line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleWishlist}
                className={cn(
                  "p-1.5 transition-colors",
                  inWishlist
                    ? "text-red-500"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Heart
                  className="h-4 w-4"
                  fill={inWishlist ? "currentColor" : "none"}
                />
              </button>
              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-sm font-medium hover:bg-primary/90"
                aria-label="Add to cart"
              >
                <ShoppingCart className="h-4 w-4 mr-1.5" />
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Detail Drawer */}
      <ProductDetailDrawer
        product={product}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </>
  );
}
