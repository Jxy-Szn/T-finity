"use client";

import { useState, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Star, Check, ShoppingCart, Heart, Truck, Shield } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/providers/cart-provider";
import { useWishlist } from "@/providers/wishlist-provider";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { formatDistanceToNow } from "date-fns";

interface Review {
  _id: string;
  rating: number;
  content: string;
  userName: string;
  userAvatar: string;
  createdAt: string;
}

interface ProductDetailDrawerProps {
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
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetailDrawer({
  product,
  isOpen,
  onClose,
}: ProductDetailDrawerProps) {
  const { addItem } = useCart();
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    isInWishlist,
  } = useWishlist();
  const { toast } = useToast();
  const [selectedSize, setSelectedSize] = useState(
    product.sizes?.[0]?.value || ""
  );
  const [selectedColor, setSelectedColor] = useState(
    product.colors?.[0]?.value || ""
  );
  const [reviewText, setReviewText] = useState("");
  const [userRating, setUserRating] = useState(5);
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inWishlist = isInWishlist(product._id);
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  useEffect(() => {
    if (isOpen) {
      fetchReviews();
    }
  }, [isOpen, product._id]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/products/${product._id}/reviews`);
      if (!response.ok) throw new Error("Failed to fetch reviews");
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive",
      });
    }
  };

  const handleAddToCart = () => {
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      color: selectedColor,
      variant: selectedSize,
      quantity: 1,
      image: product.images[0],
    });
  };

  const toggleWishlist = () => {
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

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      toast({
        title: "Error",
        description: "Please write a review",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/products/${product._id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating: userRating,
          content: reviewText,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      const newReview = await response.json();
      setReviews((prev) => [newReview, ...prev]);
      setReviewText("");
      setUserRating(5);
      toast({
        title: "Success",
        description: "Thank you for your review!",
      });
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-[90vh]">
        <DrawerHeader>
          <DrawerTitle>{product.name}</DrawerTitle>
          <DrawerDescription>{product.category}</DrawerDescription>
        </DrawerHeader>
        <div className="container mx-auto p-4 overflow-y-auto h-[calc(90vh-80px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left side - Product images */}
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-lg">
                <Image
                  src={selectedImage}
                  alt={product.name}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={cn(
                      "relative aspect-square overflow-hidden rounded-lg border-2 transition-all",
                      selectedImage === image
                        ? "border-primary"
                        : "border-transparent hover:border-primary/50"
                    )}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - Image ${index + 1}`}
                      fill
                      className="object-contain"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right side - Product details */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold">{product.name}</h2>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex items-center text-yellow-400">
                      <Star className="mr-1 h-4 w-4 fill-current" />
                      <span>{product.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({product.reviewCount} reviews)
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">
                      {formatCurrency(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-lg text-muted-foreground line-through">
                        {formatCurrency(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  {product.onSale && (
                    <span className="inline-block rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-600">
                      On Sale
                    </span>
                  )}
                </div>

                <p className="text-muted-foreground">{product.description}</p>
              </div>

              {/* Product Options */}
              <div className="space-y-4">
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-foreground">
                      Select Color
                    </h3>
                    <div className="grid grid-cols-8 gap-1">
                      {product.colors.map((color) => (
                        <button
                          key={`${color.name}-${color.value}`}
                          onClick={() => setSelectedColor(color.value)}
                          className={cn(
                            "relative h-6 w-8 rounded-md border transition-all",
                            selectedColor === color.value
                              ? "ring-2 ring-primary ring-offset-2"
                              : "hover:ring-2 hover:ring-primary/50"
                          )}
                          style={{ backgroundColor: color.value }}
                        >
                          {selectedColor === color.value && (
                            <Check className="absolute inset-0 m-auto h-4 w-4 text-white" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-foreground">
                      Select Size
                    </h3>
                    <div className="flex gap-2">
                      {["S", "M", "L", "XL", "XXL"].map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={cn(
                            "flex-1 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
                            selectedSize === size
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button className="flex-1 gap-2" onClick={handleAddToCart}>
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleWishlist}
                    className={cn(
                      "border-border",
                      inWishlist ? "text-red-500" : "text-muted-foreground"
                    )}
                  >
                    <Heart
                      className="h-4 w-4"
                      fill={inWishlist ? "currentColor" : "none"}
                    />
                  </Button>
                </div>
              </div>

              {/* Product Features */}
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">Free Shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">2 Year Warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">Quality Checked</span>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="border-t pt-6">
                <h3 className="mb-4 text-lg font-medium">Customer Reviews</h3>
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review._id} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={review.userAvatar} />
                          <AvatarFallback>
                            {review.userName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{review.userName}</p>
                          <div className="flex items-center gap-1">
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    "h-4 w-4",
                                    i < review.rating
                                      ? "fill-current"
                                      : "text-gray-300"
                                  )}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {formatDistanceToNow(new Date(review.createdAt), {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {review.content}
                      </p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSubmitReview} className="mt-6 space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Your Rating
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => setUserRating(rating)}
                          className="text-2xl"
                        >
                          <Star
                            className={cn(
                              "h-6 w-6",
                              rating <= userRating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            )}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Your Review
                    </label>
                    <Textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Write your review here..."
                      className="min-h-[100px]"
                    />
                  </div>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Review"}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
