/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const mongoose = require("mongoose");

const tonerSchema = mongoose.Schema({
  brand: { type: String, unique: true, required: true },
  model: { type: String, unique: true, required: true },
  color: { type: String, required: true },
  amount: { type: Number, default: 0 },
  // user: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User",
  // },
});

tonerSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Toner = mongoose.model("Toner", tonerSchema, "toners");
module.exports = Toner;
