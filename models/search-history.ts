import mongoose from "mongoose";

const searchHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    query: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient querying of user's search history
searchHistorySchema.index({ userId: 1, timestamp: -1 });

export const SearchHistory =
  mongoose.models.SearchHistory ||
  mongoose.model("SearchHistory", searchHistorySchema);
