const { Schema, model } = require("mongoose");

const logSchema = new Schema({
  user: { type: String },
  date: { type: Date },
  amountBefore: { type: Number },
  amountAfter: { type: Number },
});

logSchema.virtual("changeType").get(function () {
  return this.amountAfter - this.amountBefore;
});

const tonerSchema = new Schema({
  brand: {
    type: String,
    enum: ["Xerox", "HP"],
    required: [true, "You must select toner brand"],
  },
  code: {
    type: String,
    unique: true,
    required: [true, "You must enter toner code"],
  },
  color: {
    type: String,
    enum: ["Black", "Cyan", "Magenta", "Yellow"],
    required: [true, "You must select toner color"],
  },
  amount: { type: Number, default: 0 },
  logs: [logSchema],
});

const Toner = model("Toner", tonerSchema, "toners");
module.exports = Toner;
