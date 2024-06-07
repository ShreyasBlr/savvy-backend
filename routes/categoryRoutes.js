import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  addUserCategory,
  deleteUserCategory,
  getUserCategories,
  getUserCategoryById,
  updateUserCategory,
} from "../controllers/categoriesController.js";

const router = express.Router();

router
  .route("/")
  .get(protect, getUserCategories)
  .post(protect, addUserCategory);

router
  .route("/:id")
  .get(protect, getUserCategoryById)
  .put(protect, updateUserCategory)
  .delete(protect, deleteUserCategory);

export default router;
