import React from "react";
import { ProductCard } from "@/components/product-card";
import { products } from "@/data/products";

const page = () => {
  return (
    <div>
      <main className="flex-1">
        <div className="container py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Featured Products</h1>
            <p className="text-gray-400">{products.length} products found</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                description={product.description}
                price={product.price}
                originalPrice={product.originalPrice}
                color={product.color}
                variant={product.variant}
                image={product.image}
                rating={product.rating}
                reviewCount={product.reviewCount}
                category={
                  product.id.includes("watch")
                    ? "Accessories"
                    : product.id.includes("jacket")
                      ? "Outerwear"
                      : product.id.includes("jeans") ||
                          product.id.includes("tee")
                        ? "Clothing"
                        : product.id.includes("shoes")
                          ? "Shoes"
                          : ""
                }
                onSale={product.originalPrice !== undefined} // If there's an original price, it's on sale
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default page;
