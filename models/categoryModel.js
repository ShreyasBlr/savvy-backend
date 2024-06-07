import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  cat_type: {
    type: String,
    enum: ["income", "expense"],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  budget: {
    type: Number,
    required: true,
  },
  remaining: {
    type: Number,
    required: true,
  },
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
