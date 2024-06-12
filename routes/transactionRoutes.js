import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getMonthlySummary,
} from "../controllers/transactionController.js";

const router = express.Router();

router
  .route("/")
  .get(protect, getTransactions)
  .post(protect, createTransaction);

router
  .route("/:id")
  .put(protect, updateTransaction)
  .delete(protect, deleteTransaction);

router.get("/monthly-summary", protect, getMonthlySummary);

export default router;
