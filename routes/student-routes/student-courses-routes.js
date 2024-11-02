const express = require("express");
const {
  getCoursesByStudentId,
  enrollForFreeCourse,
} = require("../../controllers/student-controller/student-courses-controller");

const router = express.Router();

router.get("/get/:studentId", getCoursesByStudentId);
router.post("/enroll/:courseId/:studentId", enrollForFreeCourse);

module.exports = router;
