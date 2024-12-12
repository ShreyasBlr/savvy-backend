import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    type: { type: String, enum: ["income", "expense"] },
    amount: { type: Number, default: 0 },
    description: { type: String, default: "" },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
