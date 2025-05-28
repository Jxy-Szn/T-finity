import mongoose from "mongoose";

const promocodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    discount: {
      type: Number,
      required: true,
      min: 0,
    },
    type: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "expired", "used"],
      default: "active",
    },
    usageCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    maxUsage: {
      type: Number,
      required: true,
      min: 1,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create TTL index on expiresAt field
promocodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Update status to expired when TTL triggers
promocodeSchema.pre("save", function (next) {
  if (this.isModified("expiresAt") && this.expiresAt < new Date()) {
    this.status = "expired";
  }
  next();
});

// Update status to used when maxUsage is reached
promocodeSchema.pre("save", function (next) {
  if (this.usageCount >= this.maxUsage) {
    this.status = "used";
  }
  next();
});

export const Promocode =
  mongoose.models.Promocode || mongoose.model("Promocode", promocodeSchema);
