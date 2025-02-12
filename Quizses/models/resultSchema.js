const mongoose = require("mongoose");
const { Schema } = mongoose;

/** Result Model */
const resultSchema = new Schema({
  username: { type: String },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  course_id: {
    type: Schema.Types.ObjectId,
    ref: "Course",
  },
  result: { type: Array, default: [] },
  attempts: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
  achived: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Result", resultSchema);
