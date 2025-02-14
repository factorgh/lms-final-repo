const express = require("express");
const router = express.Router();

/** Import controllers */
const controller = require("../controllers/controller.js");

/** Questions Routes API */
router
  .route("/questions")
  .get(controller.getQuestions) // GET Request
  .post(controller.createQuestion) // POST Request
  .delete(controller.dropQuestions);

router.route("/course").get(controller.getQuizByCourseId);

router
  .route("/result")
  .get(controller.getResult)
  .post(controller.storeResult)
  .delete(controller.dropResult);

module.exports = router;
