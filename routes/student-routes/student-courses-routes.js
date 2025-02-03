const express = require("express");
const {
  getCoursesByStudentId,
  enrollForFreeCourse,
  checkEnrollment,
} = require("../../controllers/student-controller/student-courses-controller");

const router = express.Router();

router.get("/get/:studentId", getCoursesByStudentId);
router.post("/enroll", enrollForFreeCourse);
router.post("/course-enrollment-check", checkEnrollment);

module.exports = router;
