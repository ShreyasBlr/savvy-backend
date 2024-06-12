import mongoose from "mongoose";
import Category from "../models/categoryModel.js";
import Transaction from "../models/transactionModel.js";

const getTransactions = async (req, res) => {
  const { income, expense } = req.query;
  const query = { user: req.user._id };
  if (income === "true" && expense !== "true") {
    query.transaction_type = "income";
  } else if (expense === "true" && income !== "true") {
    query.transaction_type = "expense";
  }
  return await Transaction.find(query).populate("category");
};

const createTransaction = async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) {
    res.status(404);
    throw new Error("Category not found!");
  }
  if (req.body.transaction_type === "income") {
    category.remaining = category.remaining + +req.body.amount;
  } else if (req.body.transaction_type === "expense") {
    category.remaining = category.remaining - +req.body.amount;
  }
  await category.save();
  return await Transaction.create({
    transaction_type: req.body.transaction_type,
    category: req.body.category,
    description: req.body.description,
    amount: +req.body.amount,
    date: req.body.date,
    user: req.user._id,
  });
};

const updateTransaction = async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);
  if (!transaction || transaction.user.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error("Transaction not found!");
  }

  if (req.body.amount) {
    const category = await Category.findById(transaction.category);

    if (!category) {
      res.status(404);
      throw new Error("Category not found!");
    }

    if (transaction.transaction_type === "income") {
      category.remaining = category.remaining - +transaction.amount;
      category.remaining = category.remaining + +req.body.amount;
    } else if (req.body.transaction_type === "expense") {
      category.remaining = category.remaining + +transaction.amount;
      category.remaining = category.remaining - +req.body.amount;
    }

    await category.save();
  }

  transaction.transaction_type =
    req.body.transaction_type || transaction.transaction_type;
  transaction.category = req.body.category || transaction.category;
  transaction.description = req.body.description || transaction.description;
  transaction.amount = req.body.amount || transaction.amount;
  transaction.date = req.body.date || transaction.date;

  return await transaction.save();
};

const deleteTransaction = async (req, res) => {
  const transaction = await Transaction.findOne({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!transaction) {
    res.status(404);
    throw new Error("Transaction not found!");
  }

  const category = await Category.findById(transaction.category);
  if (!category) {
    res.status(404);
    throw new Error("Category not found!");
  }

  if (transaction.transaction_type === "income") {
    category.remaining = category.remaining - +transaction.amount;
  } else if (transaction.transaction_type === "expense") {
    category.remaining = category.remaining + +transaction.amount;
  }
  await category.save();

  await Transaction.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  return transaction;
};

const getMonthlySummary = async (req, res) => {
  const startOfMonth = new Date(new Date().setDate(1)); // First day of the current month
  const endOfMonth = new Date(
    new Date().setMonth(new Date().getMonth() + 1, 0)
  ); // Last day of the current month

  const totals = await Transaction.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId.createFromHexString(req.user.id),
        date: {
          $gte: startOfMonth,
          $lte: endOfMonth,
        },
      },
    },
    {
      $group: {
        _id: "$transaction_type",
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);

  // Initialize the result object with default values
  const result = {
    income: 0,
    expense: 0,
  };

  // Populate the result object based on the aggregation results
  totals.forEach((item) => {
    if (item._id === "income") {
      result.income = item.totalAmount;
    } else if (item._id === "expense") {
      result.expense = item.totalAmount;
    }
  });

  return result;
};

export default {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getMonthlySummary,
};
