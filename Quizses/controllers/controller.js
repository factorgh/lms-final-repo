const questions = require("../../database/data.js");
const Questions = require("../models/questionSchema.js");
const Result = require("../models/resultSchema.js");

/** Get all questions */
const getQuestions = async (req, res) => {
  try {
    const q = await Questions.find();
    res.json(q);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/** Insert all questions */
const insertQuestions = async (req, res) => {
  try {
    await Questions.insertMany(questions);
    res.json({ msg: "Data Saved Successfully...!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/** Create a new question */
const createQuestion = async (req, res) => {
  try {
    const { course_id, questions, answers } = req.body;
    if (!course_id || !questions || !answers) {
      return res.status(400).json({ error: "Data Not Provided...!" });
    }

    const newQuestion = await Questions.create({
      course_id,
      questions,
      answers,
    });
    res.json({ msg: "Question Saved Successfully...!", data: newQuestion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/** Delete all questions */
const dropQuestions = async (req, res) => {
  try {
    await Questions.deleteMany();
    res.json({ msg: "Questions Deleted Successfully...!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/** Get all results */
const getResult = async (req, res) => {
  try {
    const results = await Result.find();
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/** Store a result */
const storeResult = async (req, res) => {
  try {
    const { username, result, attempts, points, achieved } = req.body;
    if (!username || !result) {
      return res.status(400).json({ error: "Data Not Provided...!" });
    }

    const newResult = await Result.create({
      username,
      result,
      attempts,
      points,
      achieved,
    });
    res.json({ msg: "Result Saved Successfully...!", data: newResult });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/** Delete all results */
const dropResult = async (req, res) => {
  try {
    await Result.deleteMany();
    res.json({ msg: "Result Deleted Successfully...!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Export functions using CommonJS
module.exports = {
  getQuestions,
  insertQuestions,
  createQuestion,
  dropQuestions,
  getResult,
  storeResult,
  dropResult,
};
