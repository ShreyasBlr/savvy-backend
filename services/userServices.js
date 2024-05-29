import User from "../models/userModel.js";
import generateToken from "../utlis/generateToken.js";

const authUser = async (req, res) => {
  const { email, password } = req.body; // destructuring

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
    };
  } else {
    return false;
  }
};

const registerUser = async (req, res) => {
  const { email } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    ...req.body,
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
    };
  } else {
    return false;
  }
};

const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    return {
      _id: user._id,
      name: user.full_name,
      email: user.email,
      mobile: user.mobile,
      avatar_url: user.avatar_url,
      status: user.status,
    };
  } else {
    return false;
  }
};

const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.mobile = req.body.mobile || user.mobile;
    user.avatar_url = req.body.avatar_url || user.avatar_url;
    user.status = req.body.status || user.status;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    return {
      _id: updatedUser._id,
      name: updatedUser.full_name,
      email: updatedUser.email,
      mobile: updatedUser.mobile,
      avatar_url: updatedUser.avatar_url,
      status: updatedUser.status,
    };
  } else {
    return false;
  }
};

const getUsers = async (req, res) => {
  return await User.find({}).select("-password");
};

const getUserById = async (req, res) => {
  return await User.findById(req.params.id).select("-password");
};

const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.mobile = req.body.mobile || user.mobile;
    user.avatar_url = req.body.avatar_url || user.avatar_url;
    user.status = req.body.status || user.status;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    return {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      mobile: updatedUser.mobile,
      avatar_url: updatedUser.avatar_url,
      status: updatedUser.status,
    };
  } else {
    return false;
  }
};

const deleteUser = async (req, res) => {
  return await User.deleteOne({ _id: req.params.id });
};

export default {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
