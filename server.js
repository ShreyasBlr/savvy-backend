import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

import userRoutes from "./routes/userRoutes.js";
import categoriesRoutes from "./routes/categoryRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";

const port = process.env.PORT || 5200;
connectDB();

const app = express();

const CORS_Origin = () => {
  if (process.env.NODE_ENV === "staging") {
    return "https://kharchu.onrender.com";
  }
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }
  return "https://crm-crm-organization-frontend.0cchfy.easypanel.host";
};

app.use(cors({ credentials: true, origin: CORS_Origin() }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", CORS_Origin());
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json"
  );
  next();
});

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/users", userRoutes);
app.use("/categories", categoriesRoutes);
app.use("/transactions", transactionRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));
