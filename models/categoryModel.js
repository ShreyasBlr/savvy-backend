import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
    type: { type: String, enum: ["income", "expense"] },
    plannedAmount: Number,
    currentAmount: { type: Number, default: 0 }, // Updates with transactions
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
