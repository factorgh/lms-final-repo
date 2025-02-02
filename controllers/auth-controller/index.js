const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const School = require("../../models/School");
const { createSchool } = require("../school");

const registerUser = async (req, res) => {
  console.log(req.body); // Debugging

  const { role, userEmail, userName, password, school } = req.body;

  // Validate required fields
  if (!userEmail || !userName || !password) {
    return res.status(400).json({
      success: false,
      message: "userEmail, userName, and password are required",
    });
  }

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ userEmail }, { userName }],
  });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User name or user email already exists",
    });
  }

  // Create school if role is teacher or student
  if ((role === "teacher" || role === "student") && school) {
    const createdSchool = await School.create({ name: school });
    req.body.school = createdSchool._id;
  }

  // Create new user
  const newUser = new User({
    ...req.body,
    role,
    userEmail,
    userName,
    password, // Ensure password is included
  });

  await newUser.save();

  return res.status(201).json({
    success: true,
    message: "User registered successfully!",
    data: newUser,
  });
};

const loginUser = async (req, res) => {
  const { userEmail, password } = req.body;

  const checkUser = await User.findOne({ userEmail });
  console.log(checkUser);

  if (!checkUser || !(await checkUser.comparePassword(password))) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  const accessToken = jwt.sign(
    {
      _id: checkUser._id,
      userName: checkUser.userName,
      userEmail: checkUser.userEmail,
      role: checkUser.role,
    },
    "JWT_SECRET",
    { expiresIn: "120m" }
  );

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    data: {
      accessToken,
      user: {
        _id: checkUser._id,
        userName: checkUser.userName,
        userEmail: checkUser.userEmail,
        role: checkUser.role,
      },
    },
  });
};

module.exports = { registerUser, loginUser };
