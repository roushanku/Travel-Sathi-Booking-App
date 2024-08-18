import mongoose from "mongoose";

const searchHistorySchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    queries: [{ type: String }],
  },
  { timestamps: true }
);
const SearchHistory = mongoose.model("SearchHistory", searchHistorySchema);

export default SearchHistory;
