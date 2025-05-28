import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    category: {
      type: String,
      required: true,
    },
    subcategory: String,
    colors: [
      {
        name: String,
        value: String,
      },
    ],
    sizes: [
      {
        name: String,
        value: String,
      },
    ],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    onSale: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    warranty: {
      type: String,
      enum: [
        "none",
        "30-days",
        "60-days",
        "90-days",
        "1-year",
        "2-years",
        "lifetime",
      ],
      default: "none",
    },
    quality: {
      type: String,
      enum: ["standard", "premium", "luxury"],
      default: "standard",
    },
    tags: [String],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Add text index for search functionality
productSchema.index({
  name: "text",
  description: "text",
  category: "text",
  tags: "text",
});

export const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
