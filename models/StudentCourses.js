const mongoose = require("mongoose");

const StudentCoursesSchema = new mongoose.Schema({
  userId: String,
  courses: [
    {
      courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" }, // Reference to Course
    },
  ],
});

module.exports = mongoose.model("StudentCourses", StudentCoursesSchema);
