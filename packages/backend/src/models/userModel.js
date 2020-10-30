const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: [true, "You must enter first name"] },
  lastName: { type: String, required: [true, "You must enter last name"] },
  username: {
    type: String,
    unique: true,
    minlength: 3,
    required: [true, "You must enter username"],
  },
  role: {
    type: String,
    default: "user",
  },
  password: { type: String, required: [true, "You must enter password"] },
});

const User = mongoose.model("User", userSchema, "users");

module.exports = User;
