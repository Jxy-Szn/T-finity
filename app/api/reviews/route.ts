import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import connectDB from "@/lib/db/mongodb";
import { Review } from "@/models/review";
import { Product } from "@/models/product";

// GET /api/reviews
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get all reviews with product names
    const reviews = await Review.find().sort({ createdAt: -1 }).lean();

    // Get product names for each review
    const reviewsWithProductNames = await Promise.all(
      reviews.map(async (review) => {
        const product = await Product.findById(review.productId).select("name");
        return {
          ...review,
          productName: product?.name || "Unknown Product",
        };
      })
    );

    return NextResponse.json(reviewsWithProductNames);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// DELETE /api/reviews/[reviewId]
export async function DELETE(
  request: Request,
  { params }: { params: { reviewId: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const review = await Review.findById(params.reviewId);
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Delete the review
    await Review.findByIdAndDelete(params.reviewId);

    // Update product rating and review count
    const product = await Product.findById(review.productId);
    if (product) {
      const remainingReviews = await Review.find({
        productId: review.productId,
      });
      const totalRating = remainingReviews.reduce(
        (sum, r) => sum + r.rating,
        0
      );
      const averageRating =
        remainingReviews.length > 0 ? totalRating / remainingReviews.length : 0;

      await Product.findByIdAndUpdate(review.productId, {
        rating: averageRating,
        reviewCount: remainingReviews.length,
      });
    }

    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}
