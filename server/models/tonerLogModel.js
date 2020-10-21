/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const mongoose = require("mongoose");

const tonerLogSchema = new mongoose.Schema({
  toner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Toner",
  },

  logs: [
    {
      log_user: { type: String },
      log_time: {
        type: Date,
      },
    },
  ],
});

const TonerLog = mongoose.model("TonerLog", tonerLogSchema, "tonerLogs");
module.exports = TonerLog;
