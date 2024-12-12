import User from "../models/userModel.js";
import generateToken from "../utlis/generateToken.js";

const authUser = async (email, password, res) => {
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      avatar_url: user.avatar_url,
      status: user.status,
      startingBalance: user.startingBalance,
      previousBalance: user.previousBalance,
      financialMonthStartDate: user.financialMonthStartDate,
    };
  } else {
    return false;
  }
};

const registerUser = async (data, res) => {
  const { email } = data;
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error("User already exists");
  }

  const user = await User.create({
    ...data,
  });

  if (user) {
    generateToken(res, user._id);
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      avatar_url: user.avatar_url,
      status: user.status,
      startingBalance: user.startingBalance,
      previousBalance: user.previousBalance,
      financialMonthStartDate: user.financialMonthStartDate,
    };
  } else {
    return false;
  }
};

const getUserProfile = async (userId) => {
  const user = await User.findById(userId);

  if (user) {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      avatar_url: user.avatar_url,
      status: user.status,
      startingBalance: user.startingBalance,
      previousBalance: user.previousBalance,
      financialMonthStartDate: user.financialMonthStartDate,
    };
  } else {
    return false;
  }
};

const updateUserProfile = async (userId, data) => {
  const user = await User.findById(userId);

  if (user) {
    user.name = data.name || user.name;
    user.email = data.email || user.email;
    user.mobile = data.mobile || user.mobile;
    user.avatar_url = data.avatar_url || user.avatar_url;
    user.status = data.status || user.status;
    user.startingBalance = data.startingBalance || user.startingBalance;
    user.previousBalance = data.previousBalance || user.previousBalance;
    user.financialMonthStartDate =
      data.financialMonthStartDate || user.financialMonthStartDate;

    if (data.password) {
      user.password = data.password;
    }

    const updatedUser = await user.save();
    return {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      mobile: updatedUser.mobile,
      avatar_url: updatedUser.avatar_url,
      status: updatedUser.status,
      startingBalance: updatedUser.startingBalance,
      previousBalance: updatedUser.previousBalance,
      financialMonthStartDate: updatedUser.financialMonthStartDate,
    };
  } else {
    return false;
  }
};

const updateUserStartingBalance = async (userId, startingBalance) => {
  const user = await User.findById(userId);

  if (!startingBalance) {
    throw new Error("Please add a starting balance");
  }

  if (user) {
    const oldBalance = +user.startingBalance.toString();
    const newTotal =
      +user.totalBalance.toString() - oldBalance + +startingBalance;
    user.startingBalance = startingBalance || user.startingBalance;
    user.totalBalance = newTotal;

    const updatedUser = await user.save();

    return {
      _id: updatedUser._id,
      startingBalance: updatedUser.startingBalance,
    };
  } else {
    return false;
  }
};

const getUsers = async () => {
  return await User.find({}).select("-password");
};

const getUserById = async (userId) => {
  return await User.findById(userId).select("-password");
};

const updateUser = async (userId, data) => {
  const user = await User.findById(userId);

  if (user) {
    user.name = data.name || user.name;
    user.email = data.email || user.email;
    user.mobile = data.mobile || user.mobile;
    user.avatar_url = data.avatar_url || user.avatar_url;
    user.status = data.status || user.status;
    user.startingBalance = data.startingBalance || user.startingBalance;
    user.previousBalance = data.previousBalance || user.previousBalance;
    user.financialMonthStartDate =
      data.financialMonthStartDate || user.financialMonthStartDate;

    if (data.password) {
      user.password = data.password;
    }

    const updatedUser = await user.save();
    return {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      mobile: updatedUser.mobile,
      avatar_url: updatedUser.avatar_url,
      status: updatedUser.status,
      startingBalance: updatedUser.startingBalance,
      previousBalance: updatedUser.previousBalance,
      financialMonthStartDate: updatedUser.financialMonthStartDate,
    };
  } else {
    return false;
  }
};

const deleteUser = async (userId) => {
  return await User.deleteOne({ _id: userId });
};

export default {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  updateUserStartingBalance,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
