import bcrypt from "bcryptjs";

const users = [
  {
    id: 1,
    name: "Shreyas Aradhya",
    email: "s.shreyas.blr@gmail.com",
    mobile: "9008077061",
    password: bcrypt.hashSync("shreyas123", 10),
    avatar_url: "shreyas.jpg",
    income_categories: ["salary", "freelance", "other"],
    expense_categories: ["food", "shopping", "other"],
  },
  {
    id: 2,
    name: "Smitha Aradhya",
    email: "smithakrao1102@gmail.com",
    mobile: "9686563514",
    password: bcrypt.hashSync("smitha123", 10),
    avatarUrl: "https://api.dicebear.com/8.x/bottts/svg?seed=Lucky",
    income_categories: ["salary", "freelance", "other"],
    expense_categories: ["food", "shopping", "other"],
  },
];

export default users;
