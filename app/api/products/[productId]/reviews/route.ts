import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import connectDB from "@/lib/db/mongodb";
import { Review } from "@/models/review";
import { Product } from "@/models/product";
import { ObjectId } from "mongodb";

// GET /api/products/[productId]/reviews
export async function GET(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    await connectDB();

    const reviews = await Review.find({ productId: params.productId })
      .sort({ createdAt: -1 })
      .limit(10);

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST /api/products/[productId]/reviews
export async function POST(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { rating, content } = await request.json();

    if (!rating || !content) {
      return NextResponse.json(
        { error: "Rating and content are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Create the review
    const review = await Review.create({
      productId: params.productId,
      userId: session.userId,
      rating,
      content,
      userName: session.name,
      userAvatar: session.image || "/placeholder.svg",
    });

    // Update product rating and review count
    const product = await Product.findById(params.productId);
    if (product) {
      const reviews = await Review.find({ productId: params.productId });
      const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
      const averageRating = totalRating / reviews.length;

      await Product.findByIdAndUpdate(params.productId, {
        rating: averageRating,
        reviewCount: reviews.length,
      });
    }

    return NextResponse.json(review);
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}
