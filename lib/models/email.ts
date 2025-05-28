import mongoose from "mongoose";

const emailSchema = new mongoose.Schema(
  {
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["order", "support", "marketing", "system"],
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    isStarred: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["delivered", "failed", "pending"],
      default: "pending",
    },
    date: {
      type: Date,
      default: Date.now,
    },
    attachments: [
      {
        filename: String,
        path: String,
        mimetype: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Email =
  mongoose.models.Email || mongoose.model("Email", emailSchema);
