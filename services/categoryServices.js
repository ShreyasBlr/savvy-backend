import Category from "../models/categoryModel.js";

const getUserCategories = async (userId, income, expense) => {
  const query = { user: userId };

  if (income === "true" && expense !== "true") {
    query.type = "income";
  } else if (expense === "true" && income !== "true") {
    query.type = "expense";
  }

  const categories = await Category.find(query);
  return categories;
};

const getUserCategoryById = async (categoryId, userId) => {
  const query = { _id: categoryId, user: userId };
  const categories = await Category.findOne(query);
  return categories;
};

const addUserCategory = async (userId, data) => {
  const category = await Category.findOne({
    user: userId,
    type: data.type,
    name: data.name,
  });
  if (category) {
    throw new Error("Category already exists!");
  } else {
    const newCategory = await Category.create({
      user: userId,
      name: data.name,
      type: data.type,
      plannedAmount: data.plannedAmount,
    });
    return newCategory;
  }
};

const updateUserCategory = async (userId, categoryId, data) => {
  const category = await Category.findById(categoryId);
  if (!category || category.user.toString() !== userId.toString()) {
    throw new Error("Category not found!");
  } else {
    category.name = data.name || category.name;
    // category.type = data.type || category.type;
    category.plannedAmount = data.plannedAmount || category.plannedAmount;
    category.currentAmount = data.currentAmount || category.currentAmount;
    await category.save();
    return category;
  }
};

const deleteUserCategory = async (userId, categoryId) => {
  const category = await Category.findOneAndDelete({
    _id: categoryId,
    user: userId,
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
