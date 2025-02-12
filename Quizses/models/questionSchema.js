const mongoose = require("mongoose");
const { Schema } = mongoose;

/** Question Model */
const questionSchema = new Schema({
  course_id: {
    type: Schema.Types.ObjectId,
    ref: "Course",
  },
  questions: { type: Array, default: [] }, // Default value is an empty array
  answers: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Question", questionSchema);
