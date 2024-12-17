import mongoose from "mongoose";
import Transaction from "../models/transactionModel.js";
import User from "../models/userModel.js";
import Category from "../models/categoryModel.js";

const getTransactions = async (userId, income, expense, limit) => {
  const query = { user: userId };
  if (income === "true" && expense !== "true") {
    query.type = "income";
  } else if (expense === "true" && income !== "true") {
    query.type = "expense";
  }

  if (limit) {
    return await Transaction.find(query).limit(limit).populate("category");
  }
  return await Transaction.find(query).populate("category");
};

const createTransaction = async (userId, data) => {
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found!");
  }

  // if (req.body.type === "income") {
  //   user.totalBalance = +user.totalBalance.toString() + +req.body.amount;
  // } else if (req.body.type === "expense") {
  //   user.totalBalance = +user.totalBalance.toString() - +req.body.amount;
  // }
  // await user.save();

  const category = await Category.findOne({
    user: userId,
    type: data.type,
    _id: data.category,
  });

  if (!category) {
    throw new Error("Category not found!");
  }

  const transaction = await Transaction.create({
    user: userId,
    category: data.category,
    type: data.type,
    amount: +data.amount,
    description: data.description,
    date: data.date,
  });

  // Update category currentAmount
  category.currentAmount += +data.amount;
  await category.save();

  // Update user's total balance
  if (data.type === "income") {
    user.totalBalance += +data.amount;
  } else if (data.type === "expense") {
    user.totalBalance -= +data.amount;
  }
  await user.save();

  return transaction;
};

const updateTransaction = async (userId, transactionId, data) => {
  const transaction = await Transaction.findById(transactionId);
  const user = await User.findById(userId);
  if (!transaction || transaction.user.toString() !== userId.toString()) {
    res.status(404);
    throw new Error("Transaction not found!");
  }

  // transaction.type =
  //   data.type || transaction.type;
  transaction.category = data.category || transaction.category;
  transaction.description = data.description || transaction.description;
  transaction.amount = data.amount || transaction.amount;
  transaction.date = data.date || transaction.date;

  const category = await Category.findById(data.category);
  if (data.amount) {
    if (!category) {
      res.status(404);
      throw new Error("Category not found!");
    }
    if (data.amount !== undefined) {
      category.currentAmount =
        +category.currentAmount.toString() - +transaction.amount;
      category.currentAmount =
        +category.currentAmount.toString() + +data.amount;
      if (data.type === "income") {
        user.totalBalance = +user.totalBalance.toString() - +transaction.amount;
        user.totalBalance = +user.totalBalance.toString() + +data.amount;
      } else if (data.type === "expense") {
        user.totalBalance = +user.totalBalance.toString() + +transaction.amount;
        user.totalBalance = +user.totalBalance.toString() - +data.amount;
      }
    }
  }

  const updatedTransaction = await transaction.save();
  await category.save();
  await user.save();
  return updatedTransaction;
};

const deleteTransaction = async (userId, transactionId) => {
  const transaction = await Transaction.findOne({
    _id: transactionId,
    user: userId,
  });
  if (!transaction) {
    throw new Error("Transaction not found!");
  }

  const user = await User.findById(userId);
  const category = await Category.findById(transaction.category);
  if (!category) {
    throw new Error("Category not found!");
  }
  category.currentAmount =
    +category.currentAmount.toString() - +transaction.amount;
  if (transaction.type === "income") {
    user.totalBalance = +user.totalBalance.toString() - +transaction.amount;
  } else if (transaction.type === "expense") {
    user.totalBalance = +user.totalBalance.toString() + +transaction.amount;
  }
  await user.save();

  await Transaction.findOneAndDelete({
    _id: transactionId,
    user: userId,
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
        _id: "$type",
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);

  // User balance
  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found!");
  }
  const totalBalance = +user.totalBalance.toString();
  const startingBalance = +user.startingBalance.toString();

  // Initialize the result object with default values
  const result = {
    income: 0,
    expense: 0,
    totalBalance,
    startingBalance,
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
