import mongoose from "mongoose";
const { Schema } = mongoose;

/** question model */
const questionModel = new Schema({
  course_id: {
    type: Schema.Types.ObjectId,
    ref: "Course",
  },
  questions: { type: Array, default: [] }, // create question with [] default value
  answers: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Question", questionModel);
