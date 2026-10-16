
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getAllQuestions,
  getSingleQuestion,
  postQuestion,
} = require("../controller/quastionController");

// Public routes: anyone can read questions.
router.get("/", getAllQuestions);
router.get("/:question_id", getSingleQuestion);

// Protected route: only logged-in users can post questions.
router.post("/", authMiddleware, postQuestion);

module.exports = router;
