import Category from "../models/categoryModel.js";

const getUserCategories = async (req, res) => {
  const { income, expense } = req.query;

  const query = { user: req.user._id };

  if (income === "true" && expense !== "true") {
    query.cat_type = "income";
  } else if (expense === "true" && income !== "true") {
    query.cat_type = "expense";
  }

  const categories = await Category.find(query);
  return categories;
};

const getUserCategoryById = async (req, res) => {
  const query = { _id: req.params.id, user: req.user._id };
  const categories = await Category.findOne(query);
  return categories;
};

const addUserCategory = async (req, res) => {
  const category = await Category.findOne({
    cat_type: req.body.cat_type,
    name: req.body.name,
  });
  if (category) {
    res.status(401);
    throw new Error("Category already exists!");
  } else {
    const newCategory = await Category.create({
      cat_type: req.body.cat_type,
      name: req.body.name,
      user: req.user._id,
      budget: req.body.budget,
      remaining: req.body.budget,
    });
    return newCategory;
  }
};

const updateUserCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category || category.user.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error("Category not found!");
  } else {
    category.cat_type = req.body.cat_type || category.cat_type;
    category.name = req.body.name || category.name;
    category.remaining = req.body.budget
      ? req.body.budget - (category.budget - category.remaining)
      : category.remaining;
    category.budget = req.body.budget || category.budget;
    await category.save();
    return category;
  }
};

const deleteUserCategory = async (req, res) => {
  const category = await Category.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!category) {
    res.status(404);
    throw new Error("Category not found!");
  } else {
    return category;
  }
};

export default {
  getUserCategories,
  getUserCategoryById,
  addUserCategory,
  updateUserCategory,
  deleteUserCategory,
};
