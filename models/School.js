const mongoose = require("mongoose");

const SchoolSchema = mongoose.Schema({
  name: String,
});

module.exports = mongoose.model("School", SchoolSchema);
