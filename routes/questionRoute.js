const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  getAllQuestions,
  getSingleQuestion,
  postQuestion,
} = require("../controller/questionController");

router.get("/", authMiddleware, getAllQuestions);
router.get("/:question_id", authMiddleware, getSingleQuestion);
router.post("/", authMiddleware, postQuestion);

module.exports = router;
