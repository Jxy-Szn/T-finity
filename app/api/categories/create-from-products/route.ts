import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/models/product";
import { Category } from "@/models/category";

export async function POST() {
  try {
    await connectToDatabase();

    // Get all unique categories from products
    const products = await Product.find({}, { category: 1 });
    const uniqueCategories = [...new Set(products.map((p) => p.category))];

    // Create categories for each unique category
    const createdCategories = await Promise.all(
      uniqueCategories.map(async (categoryName) => {
        // Check if category already exists
        const existingCategory = await Category.findOne({ name: categoryName });
        if (existingCategory) return existingCategory;

        // Create new category
        const category = new Category({
          name: categoryName,
          description: `${categoryName} products`,
          image: "/placeholder.svg", // Default placeholder image
          slug: categoryName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, ""),
        });

        return category.save();
      })
    );

    return NextResponse.json({
      message: "Categories created successfully",
      categories: createdCategories,
    });
  } catch (error) {
    console.error("Error creating categories from products:", error);
    return NextResponse.json(
      { error: "Failed to create categories from products" },
      { status: 500 }
    );
  }
}
