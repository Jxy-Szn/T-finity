"use client";

import { useWishlist } from "@/providers/wishlist-provider";
import { useCart } from "@/providers/cart-provider";
import { Heart, Star, ShoppingCart, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlist();
  const { addItem } = useCart();

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      originalPrice: item.originalPrice,
      color: item.color || "",
      variant: item.variant || "",
      quantity: 1,
      image: item.image,
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <main className="flex-1 flex flex-col pt-8">
        <div className="container">
          <div className="mb-8 flex items-center justify-end">
            {items.length > 0 && (
              <Button variant="outline" onClick={() => clearWishlist()}>
                Clear Wishlist
              </Button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Heart className="h-16 w-16 text-muted-foreground" />
              <h2 className="mt-4 text-xl font-medium">
                Your wishlist is empty
              </h2>
              <p className="mt-2 text-muted-foreground">
                Add items to your wishlist to save them for later
              </p>
              <Link href="/">
                <Button className="mt-6">Continue Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border bg-card text-card-foreground p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 64px) 100vw, 64px"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <div className="mt-1 flex items-center">
                        <div className="flex items-center text-yellow-400">
                          <Star className="mr-1 h-3.5 w-3.5 fill-current" />
                          <span className="text-sm">
                            {item.rating.toFixed(1)}
                          </span>
                        </div>
                        <span className="ml-1 text-xs text-muted-foreground">
                          ({item.reviewCount})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-blue-400">Price</div>
                      <div className="font-medium">
                        {formatCurrency(item.price)}
                      </div>
                      {item.originalPrice && (
                        <div className="text-sm text-muted-foreground line-through">
                          {formatCurrency(item.originalPrice)}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button onClick={() => handleAddToCart(item)}>
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Add to Cart
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="h-9 w-9 rounded-full text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-5 w-5" />
                        <span className="sr-only">Remove from wishlist</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
