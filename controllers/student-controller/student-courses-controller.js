const StudentCourses = require("../../models/StudentCourses");
const Course = require("../../models/Course");
const mongoose = require("mongoose");

const getCoursesByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Find student's enrolled courses (returns only course IDs)
    const studentBoughtCourses = await StudentCourses.findOne({
      userId: studentId,
    }).populate(
      "courses.courseId"
      // {
      // path: "courses.courseId", // Populate the course details
      // populate: {
      //   path: "quizzes", // Populate the quizzes inside each course
      //   model: "Question", // Ensure this matches your Quiz model name
      // },
      // }
    );

    console.log(studentBoughtCourses);

    console.log(
      "----------------------------Student Course---------------------------"
    );
    console.log(studentBoughtCourses.courses);

    res.status(200).json({
      success: true,
      data: studentBoughtCourses,
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

    console.log(courseDe, studentDe);

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
      // ❌ Fix: Use `.some()` instead of `.includes()`
      if (
        studentCourses.courses.some(
          (c) => c.courseId.toString() === courseDe.toString()
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "You are already enrolled in this course!",
        });
      }

      // ✅ Fix: Properly structure the `courses` array
      studentCourses = await StudentCourses.findOneAndUpdate(
        { userId: studentDe },
        {
          $push: {
            courses: {
              courseId: courseDe,
              title: course.title,
              instructorId: course.instructorId,
              instructorName: course.instructorName,
              courseImage: course.courseImage,
            },
          },
        },
        { new: true }
      );
    } else {
      // ✅ Fix: Store the course as an object, not just an ID
      studentCourses = await StudentCourses.create({
        userId: studentDe,
        courses: [
          {
            courseId: courseDe,
            title: course.title,
            instructorId: course.instructorId,
            instructorName: course.instructorName,
            courseImage: course.courseImage,
          },
        ],
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

const getStudentQuizzes = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find student's enrolled courses and populate course details with quizzes
    const studentCourses = await StudentCourses.findOne({ userId }).populate({
      path: "courses.courseId",
      populate: { path: "quizzes", model: "Question" }, // Ensure "Question" is the correct model name
    });

    if (!studentCourses) {
      return res
        .status(404)
        .json({ message: "No courses found for this student." });
    }

    // Extract quizzes along with course ID and title
    const quizzesWithCourses = studentCourses.courses.map((course) => ({
      courseId: course.courseId._id,
      courseTitle: course.courseId.title,
      quizzes: course.courseId.quizzes,
    }));

    return res.send(quizzesWithCourses);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getCoursesByStudentId,
  enrollForFreeCourse,
  checkEnrollment,
  getStudentQuizzes,
};
