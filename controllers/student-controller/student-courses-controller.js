const StudentCourses = require("../../models/StudentCourses");
const Course = require("../../models/Course");

const getCoursesByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;
    const studentBoughtCourses = await StudentCourses.findOne({
      userId: studentId,
    });

    console.log(studentBoughtCourses.courses);
    res.status(200).json({
      success: true,
      data: studentBoughtCourses.courses,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

// Handle student courses
const enrollForFreeCourse = async (req, res) => {
  try {
    const { courseId, studentId } = req.params;

    // Find the course by ID
    const course = await Course.findById(courseId);

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found!" });
    }

    // Get student information (e.g., from your database or request body)
    const studentInfo = {
      studentId: studentId,
      studentName: req.body.studentName, // assuming name and email are sent in the body
      studentEmail: req.body.studentEmail,
      paidAmount: "0", // Assuming it's a free course
    };

    // Update student's courses list
    const studentCourses = await StudentCourses.findOneAndUpdate(
      { userId: studentId },
      { $push: { courses: courseId } },
      { new: true }
    );

    // Update course's student list
    await Course.findByIdAndUpdate(
      courseId,
      { $push: { students: studentInfo } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: studentCourses,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

module.exports = { getCoursesByStudentId, enrollForFreeCourse };
