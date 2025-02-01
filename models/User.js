const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    userName: { type: String },
    dateOfBirth: { type: Date },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: "Other",
    },
    userEmail: { type: String, unique: true, required: true },
    phone: { type: String },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
    },
    role: {
      type: String,
      enum: ["student", "teacher", "instructor"],
      default: "student",
    },
    gradeLevel: { type: String, enum: ["Year 1", "Year 2", "Year 3"] }, // For students
    courses: [{ type: String }], // For teachers
    academicQualifications: { type: String }, // For teachers
    teachingExperience: { type: Number }, // For teachers
    certifications: [{ type: String }], // For teachers
    profilePicture: { type: String },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// Hash the password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("User", UserSchema);
