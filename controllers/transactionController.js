import asyncHandler from "../middleware/asyncHandler.js";
import transactionServices from "../services/transactionServices.js";

// @desc    Get transactions
// @route   GET /transactions
// @access  Private
const getTransactions = asyncHandler(async (req, res) => {
  const transactions = await transactionServices.getTransactions(req, res);
  res.status(200).json(transactions);
});

// @desc    Create transaction
// @route   POST /transactions
// @access  Private
const createTransaction = asyncHandler(async (req, res) => {
  if (
    !req.body.transaction_type ||
    !req.body.category ||
    !req.body.description ||
    !req.body.amount ||
    !req.body.date
  ) {
    res.status(400);
    throw new Error(
      "Transaction Type, Category, Description, Amount, and Date are required!"
    );
  }
  const transaction = await transactionServices.createTransaction(req, res);
  res.status(200).json(transaction);
});

// @desc    Update transaction
// @route   PUT /transactions/:id
// @access  Private
const updateTransaction = asyncHandler(async (req, res) => {
  const transaction = await transactionServices.updateTransaction(req, res);
  if (!transaction) {
    res.status(401);
    throw new Error("Invalid transaction data!");
  }
  res.status(200).json(transaction);
});

// @desc    Delete transaction
// @route   DELETE /transactions/:id
// @access  Private
const deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await transactionServices.deleteTransaction(req, res);
  if (!transaction) {
    res.status(401);
    throw new Error("Invalid transaction data!");
  }
  res.status(200).json(transaction);
});

// @desc    Get Totals for current month
// @route   GET /transactions/monthly-summary
// @access  Private
const getMonthlySummary = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("User not found!");
  }
  const transaction = await transactionServices.getMonthlySummary(req, res);
  if (!transaction) {
    res.status(401);
    throw new Error("Invalid transaction data!");
  }
  res.status(200).json(transaction);
});

export {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getMonthlySummary,
};
