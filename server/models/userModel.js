/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
  usergroup: { type: String, required: true },
  username: { type: String, unique: true, required: true, minlength: 3 },
  passwordHash: { type: String, required: true },
  toners: [{ type: mongoose.Schema.Types.ObjectId, ref: "Toner" }],
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

userSchema.plugin(uniqueValidator);

const User = mongoose.model("User", userSchema, "users");

module.exports = User;
