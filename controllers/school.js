const School = require("../models/School");

const createSchool = async (req, res) => {
  const school = await School.create(req.body);
  res.status(201).json({
    success: true,
    data: school,
  });
};

const updateSchool = async (req, res) => {
  const school = await School.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data: school,
  });
};

const deleteSchool = async (req, res) => {
  await School.findByIdAndDelete(req.params.id);
  res.status(204).json({ success: true });
};

const getSchools = async (req, res) => {
  const schools = await School.find();
  res.json({ success: true, count: schools.length, data: schools });
};

const getSchool = async (req, res) => {
  const school = await School.findById(req.params.id);
  res.status(200).json({ success: true, data: school });
};

module.exports = {
  createSchool,
  updateSchool,
  deleteSchool,
  getSchools,
  getSchool,
};
