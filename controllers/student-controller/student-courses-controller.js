const StudentCourses = require("../../models/StudentCourses");
const Course = require("../../models/Course");
const mongoose = require("mongoose");

const getCoursesByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Find student's enrolled courses (returns only course IDs)
    const studentBoughtCourses = await StudentCourses.findOne({
      userId: studentId,
    });
    console.log(
      "----------------------------Student Course---------------------------"
    );
    console.log(studentBoughtCourses);
    if (studentBoughtCourses.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    // ✅ Manually fetch all course details using the course IDs
    const courses = await Course.find({
      _id: { $in: studentBoughtCourses.courses },
    });

    res.status(200).json({
      success: true,
      data: courses, // Return full course details
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

// Handle student courses
const enrollForFreeCourse = async (req, res) => {
  try {
    const { courseId, studentId, studentName, studentEmail } = req.body;
    const courseDe = new mongoose.Types.ObjectId(courseId);
    const studentDe = new mongoose.Types.ObjectId(studentId);

    // Find the course by ID
    const course = await Course.findById(courseDe);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found!" });
    }

    // Get student information
    const studentInfo = {
      studentId: studentDe,
      studentName,
      studentEmail,
      paidAmount: "0", // Free course
    };

    // ✅ Check if the student is already enrolled
    let studentCourses = await StudentCourses.findOne({ userId: studentDe });

    if (studentCourses) {
      // If student already has a course list, prevent duplicate enrollment
      if (studentCourses.courses.includes(courseDe)) {
        return res.status(400).json({
          success: false,
          message: "You are already enrolled in this course!",
        });
      }

      // ✅ Update existing student courses list
      studentCourses = await StudentCourses.findOneAndUpdate(
        { userId: studentDe },
        { $addToSet: { courses: courseDe } }, // Prevents duplicate courses
        { new: true }
      );
    } else {
      // ✅ Create a new student course entry if it doesn't exist
      studentCourses = await StudentCourses.create({
        userId: studentDe,
        courses: [courseDe],
      });
    }

    // ✅ Update course's student list, ensuring no duplicate students
    await Course.findByIdAndUpdate(
      courseDe,
      { $addToSet: { students: studentInfo } }, // Prevents duplicate students
      { new: true }
    );

    res.status(200).json({ success: true, data: studentCourses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Some error occurred!" });
  }
};

const checkEnrollment = async (req, res) => {
  try {
    const { studentId, courseId } = req.query;

    const studentDe = new mongoose.Types.ObjectId(studentId);
    const courseDe = new mongoose.Types.ObjectId(courseId);

    // Check if the student is already enrolled in the course
    const studentCourses = await StudentCourses.findOne({
      userId: studentDe,
      courses: courseDe, // Check if this course exists in the student's courses array
    });

    if (studentCourses) {
      return res.status(200).json({
        enrolled: true,
        message: "Student is already enrolled in this course.",
      });
    }

    return res.status(200).json({
      enrolled: false,
      message: "Student is not enrolled in this course.",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error checking enrollment status." });
  }
};

module.exports = {
  getCoursesByStudentId,
  enrollForFreeCourse,
  checkEnrollment,
};
