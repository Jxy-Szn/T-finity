import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Category } from "@/models/category";

export async function GET() {
  try {
    await connectToDatabase();
    const settings = await Category.findOne({ name: "featured" });
    return NextResponse.json({
      settings: settings || {
        headerText: "Limited Stock Deals",
        headerColor: "bg-purple-500",
      },
    });
  } catch (error) {
    console.error("Error fetching category settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch category settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const data = await request.json();

    let settings = await Category.findOne({ name: "featured" });
    if (!settings) {
      settings = new Category({
        name: "featured",
        description: "Featured products section",
        image: "/placeholder.svg",
        slug: "featured",
        headerText: data.headerText || "Limited Stock Deals",
        headerColor: data.headerColor || "bg-purple-500",
      });
    } else {
      settings.headerText = data.headerText;
      settings.headerColor = data.headerColor;
    }

    await settings.save();
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Error updating category settings:", error);
    return NextResponse.json(
      { error: "Failed to update category settings" },
      { status: 500 }
    );
  }
}
