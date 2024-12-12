import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    plannedAmount: { type: Number, required: true },
    currentAmount: { type: Number, default: 0 }, // Updates with transactions
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
