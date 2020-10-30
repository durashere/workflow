const mongoose = require("mongoose");

const tonerSchema = new mongoose.Schema({
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
  logs: [{ type: mongoose.Schema.Types.ObjectId, ref: "TonerLog" }],
});

const Toner = mongoose.model("Toner", tonerSchema, "toners");
module.exports = Toner;
