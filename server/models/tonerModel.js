/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const mongoose = require("mongoose");

const tonerSchema = new mongoose.Schema({
  brand: {
    type: String,
    enum: ["Xerox", "HP"],
    required: [true, "Brand can't be empty"],
  },
  code: { type: String, unique: true, required: [true, "Code can't be empty"] },
  color: { type: String, required: [true, "Color can't be empty"] },
  amount: { type: Number, default: 0 },
  logs: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TonerLog",
  },
});

const Toner = mongoose.model("Toner", tonerSchema, "toners");
module.exports = Toner;
