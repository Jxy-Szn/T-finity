import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userAvatar: {
      type: String,
      default: "/placeholder.svg",
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for efficient querying
reviewSchema.index({ productId: 1, createdAt: -1 });

export const Review =
  mongoose.models.Review || mongoose.model("Review", reviewSchema);
