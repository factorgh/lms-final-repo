const express = require("express");

const {
  getSchool,
  getSchools,
  updateSchool,
  deleteSchool,
  createSchool,
} = require("../controllers/school");
const router = express.Router();

router.route("/").get(getSchools).post(createSchool);

router.route("/:id").get(getSchool).put(updateSchool).delete(deleteSchool);

module.exports = router;
