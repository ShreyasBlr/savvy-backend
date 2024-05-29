import Transaction from "../models/transactionModel.js";

const getTransactions = async (req, res) => {
  const { income, expense } = req.query;
  const query = { user: req.user._id };
  if (income === "true" && expense !== "true") {
    query.transaction_type = "income";
  } else if (expense === "true" && income !== "true") {
    query.transaction_type = "expense";
  }
  return await Transaction.find(query);
};

const createTransaction = async (req, res) => {
  return await Transaction.create({
    transaction_type: req.body.transaction_type,
    category: req.body.category,
    description: req.body.description,
    amount: req.body.amount,
    date: req.body.date,
    user: req.user._id,
  });
};

const updateTransaction = async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);
  if (!transaction || transaction.user.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error("Transaction not found!");
  } else {
    transaction.transaction_type =
      req.body.transaction_type || transaction.transaction_type;
    transaction.category = req.body.category || transaction.category;
    transaction.description = req.body.description || transaction.description;
    transaction.amount = req.body.amount || transaction.amount;
    transaction.date = req.body.date || transaction.date;
    return await transaction.save();
  }
};

const deleteTransaction = async (req, res) => {
  const transaction = await Transaction.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!transaction) {
    res.status(404);
    throw new Error("Transaction not found!");
  } else {
    return transaction;
  }
};

export default {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
