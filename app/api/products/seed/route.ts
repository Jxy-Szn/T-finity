import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { Product } from "@/models/product";

const sampleProducts = [
  {
    name: "Classic White T-Shirt",
    description: "A comfortable, everyday white t-shirt made from 100% cotton.",
    price: 29.99,
    originalPrice: 39.99,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&auto=format",
    ],
    category: "Clothing",
    subcategory: "T-Shirts",
    colors: [
      { name: "White", value: "#FFFFFF" },
      { name: "Black", value: "#000000" },
    ],
    sizes: [
      { name: "Small", value: "S" },
      { name: "Medium", value: "M" },
      { name: "Large", value: "L" },
    ],
    rating: 4.5,
    reviewCount: 128,
    stock: 100,
    featured: true,
    onSale: true,
    tags: ["casual", "basic", "cotton"],
  },
  {
    name: "Slim Fit Jeans",
    description: "Modern slim fit jeans with a comfortable stretch.",
    price: 79.99,
    originalPrice: 99.99,
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&auto=format",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format",
    ],
    category: "Clothing",
    subcategory: "Jeans",
    colors: [
      { name: "Blue", value: "#0000FF" },
      { name: "Black", value: "#000000" },
    ],
    sizes: [
      { name: "30x30", value: "30x30" },
      { name: "32x30", value: "32x30" },
      { name: "34x30", value: "34x30" },
    ],
    rating: 4.3,
    reviewCount: 89,
    stock: 50,
    featured: false,
    onSale: true,
    tags: ["denim", "casual", "slim-fit"],
  },
];

export async function GET() {
  try {
    await connectDB();

    // Clear existing products
    await Product.deleteMany({});

    // Insert sample products
    const products = await Product.insertMany(sampleProducts);

    return NextResponse.json({
      message: "Sample products added successfully",
      count: products.length,
    });
  } catch (error) {
    console.error("Error seeding products:", error);
    return NextResponse.json(
      { error: "Failed to seed products" },
      { status: 500 }
    );
  }
}
