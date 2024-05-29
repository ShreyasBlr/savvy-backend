import asyncHandler from "../middleware/asyncHandler.js";
import userServices from "../services/userServices.js";

// @desc    Auth user & get token
// @route   POST /users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  if (!req.body.email && !req.body.password) {
    res.status(401);
    throw new Error("Email and Password are required");
  }

  const user = await userServices.authUser(req, res);

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Register a new user
// @route   POST /users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const user = await userServices.registerUser(req, res);

  if (user) {
    res.status(201).json(user);
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Logout user / clear cookie
// @route   POST /users/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: "Logged out successfully" });
});

// @desc    Get user profile
// @route   GET /users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }

  const user = await userServices.getUserProfile(req, res);

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user profile
// @route   PUT /users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }

  const user = await userServices.updateUserProfile(req, res);

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get all users
// @route   GET /users/
// @access  Private / admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await userServices.getUsers(req, res);
  res.status(200).json(users);
});

// @desc    Get user by ID
// @route   GET /users/:id
// @access  Private / admin
const getUserById = asyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(401);
    throw new Error("User ID is required");
  }
  const user = await userServices.getUserById(req, res);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.status(200).json(user);
});

// @desc    Update user
// @route   PUT /users/:id
// @access  Private / admin
const updateUser = asyncHandler(async (req, res) => {
  const updatedUser = await userServices.updateUser(req, res);

  if (updatedUser) {
    res.status(200).json(updatedUser);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Delete user
// @route   DELETE /users/:id
// @access  Private / admin
const deleteUser = asyncHandler(async (req, res) => {
  if (!req.params.id) {
    res.status(401);
    throw new Error("User ID is required");
  }
  const user = await userServices.deleteUser(req, res);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.status(200).json(user);
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
