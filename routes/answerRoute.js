
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  getAnswers,
  postAnswer,
} = require("../controller/answerController");

// Public route: anyone can read answers.
router.get("/:question_id", getAnswers);

// Protected route: only logged-in users can post answers.
router.post("/", authMiddleware, postAnswer);

module.exports = router;
