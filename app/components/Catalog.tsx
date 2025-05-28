"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import Image from "next/image";
import { useState, useRef, useEffect, useCallback } from "react"; // Import useCallback

interface Category {
  name: string;
  description: string;
  image: string;
  productCount: number;
  featured?: boolean;
  rating: number;
  reviewCount: number;
  priceRange: string;
  tags: string[];
}

export default function Catalog() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Extended categories array to include 8 items with T-shirt descriptions
  const categories: Category[] = [
    {
      name: "Classic Comfort Tees",
      description:
        "Discover our collection of timeless and comfortable t-shirts, perfect for everyday wear. Made with soft, breathable fabrics.",
      image: "/img/catalog/catalog1.jpg",
      productCount: 156,
      featured: true,
      rating: 4.9,
      reviewCount: 1250,
      priceRange: "$20 - $40",
      tags: ["Cotton", "Basic", "Everyday Wear"],
    },
    {
      name: "Graphic Print Originals",
      description:
        "Express yourself with our unique graphic print t-shirts. Featuring bold designs and artistic statements.",
      image: "/img/catalog/catalog2.jpg",
      productCount: 89,
      rating: 4.7,
      reviewCount: 890,
      priceRange: "$25 - $50",
      tags: ["Artistic", "Statement", "Trendy"],
    },
    {
      name: "Premium Blends Collection",
      description:
        "Experience luxurious comfort with our premium blend t-shirts. Crafted for superior feel and lasting quality.",
      image: "/img/catalog/catalog3.jpg",
      productCount: 112,
      rating: 4.8,
      reviewCount: 965,
      priceRange: "$35 - $70",
      tags: ["Soft", "Durable", "High-Quality"],
    },
    {
      name: "Sport & Performance Tees",
      description:
        "Stay cool and dry with our athletic t-shirts. Designed for peak performance and active lifestyles.",
      image: "/img/catalog/catalog4.jpg",
      productCount: 75,
      rating: 4.5,
      reviewCount: 620,
      priceRange: "$30 - $60",
      tags: ["Athletic", "Moisture-Wicking", "Activewear"],
    },
    {
      name: "Vintage Washed Styles",
      description:
        "Achieve that perfectly worn-in look with our vintage washed t-shirts. Soft, faded, and full of character.",
      image: "/img/catalog/catalog5.jpg",
      productCount: 60,
      rating: 4.6,
      reviewCount: 510,
      priceRange: "$28 - $55",
      tags: ["Retro", "Distressed", "Comfort-Fit"],
    },
    {
      name: "Sustainable & Eco-Friendly",
      description:
        "Wear your values with our eco-friendly t-shirts. Made from organic cotton and recycled materials.",
      image: "/img/catalog/catalog6.jpg",
      productCount: 95,
      rating: 4.7,
      reviewCount: 780,
      priceRange: "$30 - $65",
      tags: ["Organic", "Recycled", "Ethical"],
    },
    {
      name: "Customizable Creations",
      description:
        "Design your own unique t-shirt! Explore options for custom prints, embroidery, and personalized messages.",
      image: "/img/catalog/catalog7.jpg",
      productCount: 130,
      rating: 4.8,
      reviewCount: 1100,
      priceRange: "$35 - $80",
      tags: ["Personalized", "Unique", "Design Your Own"],
    },
    {
      name: "Limited Edition Drops",
      description:
        "Don't miss out on our exclusive, limited edition t-shirt releases. Unique designs available for a short time.",
      image: "/img/catalog/catalog8.jpg",
      productCount: 45,
      featured: true,
      rating: 4.9,
      reviewCount: 950,
      priceRange: "$40 - $100+",
      tags: ["Exclusive", "Rare", "Collector's Item"],
    },
  ];

  // Function to advance the slide automatically
  const autoAdvanceSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % categories.length);
  }, [categories.length]); // categories.length is a stable dependency

  // Function to reset the auto-play timer
  const resetAutoPlay = useCallback(() => {
    if (timeoutRef.current) {
      clearInterval(timeoutRef.current);
    }
    timeoutRef.current = setInterval(autoAdvanceSlide, 5000);
  }, [autoAdvanceSlide]);

  // Effect to set up and clean up the auto-play interval
  useEffect(() => {
    resetAutoPlay(); // Initialize auto-play on mount
    return () => {
      // Clear interval on component unmount
      if (timeoutRef.current) clearInterval(timeoutRef.current);
    };
  }, [resetAutoPlay]); // Dependency on resetAutoPlay to ensure it runs when needed

  // Handles manual navigation to the next slide
  const handleNextSlide = () => {
    if (isAnimating) return; // Prevent multiple rapid clicks
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % categories.length);
    resetAutoPlay(); // Reset timer after manual interaction
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Handles manual navigation to the previous slide
  const handlePrevSlide = () => {
    if (isAnimating) return; // Prevent multiple rapid clicks
    setIsAnimating(true);
    setCurrentIndex(
      (prev) => (prev - 1 + categories.length) % categories.length
    );
    resetAutoPlay(); // Reset timer after manual interaction
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div className="mx-auto w-full max-w-7xl p-6">
      <div className="bg-card relative overflow-hidden rounded-xl border">
        {/* Main Carousel */}
        <div className="relative aspect-[21/9]">
          {categories.map((category, index) => (
            <div
              key={category.name}
              className={`absolute inset-0 transition-transform duration-500 ease-out ${
                index === currentIndex
                  ? "translate-x-0"
                  : index < currentIndex
                    ? "-translate-x-full"
                    : "translate-x-full"
              }`}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  // Fallback for image loading errors
                  onError={(e) => {
                    e.currentTarget.src = `https://placehold.co/1200x514/E0E0E0/333333?text=Image+Error`;
                    e.currentTarget.srcset = ""; // Clear srcset to prevent further errors
                  }}
                />
                <div className="from-background/90 via-background/60 absolute inset-0 bg-gradient-to-r to-transparent" />
              </div>

              {/* Content */}
              <div className="relative flex h-full items-center">
                <div className="w-full max-w-2xl space-y-6 p-8 lg:p-12">
                  {category.featured && (
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary mb-4"
                    >
                      Featured Collection
                    </Badge>
                  )}

                  <h2 className="text-4xl font-semibold tracking-tight">
                    {category.name}
                  </h2>

                  <p className="text-accent-foreground/80 text-lg">
                    {category.description}
                  </p>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(category.rating)
                              ? "fill-primary text-primary"
                              : "fill-muted text-muted"
                          }`}
                        />
                      ))}
                      <span className="ml-2 font-medium">
                        {category.rating}
                      </span>
                      <span className="text-accent-foreground/80">
                        ({category.reviewCount})
                      </span>
                    </div>
                    <div className="text-accent-foreground/80">
                      {category.productCount} products
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {category.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="bg-background/50 backdrop-blur-sm"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="pt-4">
                    <Button size="lg" className="group">
                      Explore Collection
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="absolute right-6 bottom-6 flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevSlide}
            className="bg-background/50 hover:bg-background/80 backdrop-blur-sm"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextSlide}
            className="bg-background/50 hover:bg-background/80 backdrop-blur-sm"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Indicators */}
        <div className="absolute bottom-6 left-6 flex items-center gap-2">
          {categories.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-primary w-6"
                  : "bg-primary/30 hover:bg-primary/50"
              }`}
              onClick={() => {
                setIsAnimating(true);
                setCurrentIndex(index);
                resetAutoPlay(); // Reset timer after manual interaction
                setTimeout(() => setIsAnimating(false), 500);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
