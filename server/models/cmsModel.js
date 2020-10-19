const mongoose = require("mongoose");

const cmsSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: [true, "Name can't be empty"] },
  link: { type: String, unique: true, required: [true, "Link can't be empty"] },
});

const Cms = mongoose.model("Cms", cmsSchema, "cmss");
module.exports = Cms;
