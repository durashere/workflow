/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: [true, "First Name can't be empty"] },
  lastName: { type: String, required: [true, "Last Name can't be empty"] },
  username: {
    type: String,
    unique: true,
    minlength: 3,
    required: [true, "Username can't be empty"],
  },
  role: {
    type: String,
    default: "user",
    required: [true, "Role can't be empty"],
  },
  password: { type: String, required: [true, "Password can't be empty"] },
  // toners: [{ type: mongoose.Schema.Types.ObjectId, ref: "Toner" }],
});

// userSchema.set("toJSON", {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString();
//     delete returnedObject._id;
//     delete returnedObject.__v;
//     delete returnedObject.password;
//   },
// });

userSchema.plugin(uniqueValidator);

const User = mongoose.model("User", userSchema, "users");

module.exports = User;
