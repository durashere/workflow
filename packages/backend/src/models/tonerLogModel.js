const mongoose = require("mongoose");

const tonerLogSchema = new mongoose.Schema({
  log_user: { type: String },
  log_time: { type: Date },
});

const TonerLog = mongoose.model("TonerLog", tonerLogSchema, "tonerslogs");
module.exports = TonerLog;
