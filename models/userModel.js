import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar_url: {
    type: String,
  },
  status: {
    type: Boolean,
    default: true,
  },
  startingBalance: {
    type: mongoose.Schema.Types.Decimal128,
    default: 0,
  },
  totalBalance: {
    type: mongoose.Schema.Types.Decimal128,
    default: 0,
  },
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
}; // this refers to the user object

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  if (this.isNew) {
    this.totalBalance =
      +this.totalBalance.toString() + +this.startingBalance.toString();
    console.log(this.totalBalance);
  }

  next();
});

const User = mongoose.model("User", userSchema);

export default User;
