import asyncHandler from "../middleware/asyncHandler.js";

import categoryServices from "../services/categoryServices.js";

// @desc    Get categories of user
// @route   GET /categories
// @access  Private
const getUserCategories = asyncHandler(async (req, res) => {
  const { income, expense } = req.query;
  const categories = await categoryServices.getUserCategories(
    req.user._id,
    income,
    expense
  );
  res.status(200).json(categories);
});

// @desc    Get categories of user by id
// @route   GET /categories/:id
// @access  Private
const getUserCategoryById = asyncHandler(async (req, res) => {
  const categories = await categoryServices.getUserCategoryById(
    req.params.id,
    req.user._id
  );
  res.status(200).json(categories);
});

// @desc    Add new categories of user
// @route   POST /categories
// @access  Private
const addUserCategory = asyncHandler(async (req, res) => {
  const { type, name } = req.body;
  if (!type || !name) {
    res.status(400);
    throw new Error("Category Type and Name are required!");
  }
  const category = await categoryServices.addUserCategory(
    req.user._id,
    req.body
  );

  if (!category) {
    res.status(401);
    throw new Error("Invalid category data!");
  }
  res.status(200).json(category);
});

// @desc    Update user category
// @route   PUT /categories/:id
// @access  Private
const updateUserCategory = asyncHandler(async (req, res) => {
  const category = await categoryServices.updateUserCategory(
    req.user._id,
    req.params.id,
    req.body
  );
  if (!category) {
    res.status(401);
    throw new Error("Invalid category data!");
  }
  res.status(200).json(category);
});

// @desc    Delete user category
// @route   DELETE /categories/:id
// @access  Private
const deleteUserCategory = asyncHandler(async (req, res) => {
  const category = await categoryServices.deleteUserCategory(
    req.user._id,
    req.params.id
  );
  if (!category) {
    res.status(401);
    throw new Error("Invalid category data!");
  }
  res.status(200).json(category);
});

export {
  getUserCategories,
  getUserCategoryById,
  addUserCategory,
  updateUserCategory,
  deleteUserCategory,
};
