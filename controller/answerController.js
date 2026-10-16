
const dbconnection = require("../db/dbconfig");
const statusCodes = require("../constants/statusCodes");
const { sendError, serverError, text } = require("../utils/respond");

const NOT_FOUND_MSG = "The requested question could not be found.";

// GET /api/answer/:question_id
// Fetch answers belonging to a question.
async function getAnswers(req, res) {
  const id = Number(req.params.question_id);

  if (!Number.isInteger(id) || id < 1) {
    return sendError(
      res,
      statusCodes.BAD_REQUEST,
      "Please provide a valid question ID."
    );
  }

  try {
    // First, verify that the question exists.
    const [questions] = await dbconnection.query(
      "SELECT question_id FROM questions WHERE question_id = ?",
      [id]
    );

    if (questions.length === 0) {
      return sendError(res, statusCodes.NOT_FOUND, NOT_FOUND_MSG);
    }

    // Retrieve answers. An existing question may have zero answers.
    const [rows] = await dbconnection.query(
      `SELECT
         a.answer_id,
         a.answer AS content,
         u.username AS user_name,
         a.created_at
       FROM answers a
       JOIN users u ON a.userid = u.userid
       WHERE a.question_id = ?
       ORDER BY a.created_at DESC, a.answer_id DESC`,
      [id]
    );

    // Return an empty array when no answers have been posted.
    return res.status(statusCodes.OK).json({
      answers: rows,
    });
  } catch (err) {
    console.error("Error fetching answers:", err);
    return serverError(res, err);
  }
}

// POST /api/answer
// Create an answer for the authenticated user.
async function postAnswer(req, res) {
  const body = req.body || {};
  const answer = text(body.answer);
  const id = Number(body.questionid);

  if (!answer) {
    return sendError(
      res,
      statusCodes.BAD_REQUEST,
      "Please provide an answer."
    );
  }

  if (!Number.isInteger(id) || id < 1) {
    return sendError(
      res,
      statusCodes.BAD_REQUEST,
      "Please provide a valid question ID."
    );
  }

  if (!req.user || !req.user.userid) {
    return sendError(
      res,
      statusCodes.UNAUTHORIZED,
      "Please log in to post an answer."
    );
  }

  try {
    const [questions] = await dbconnection.query(
      "SELECT question_id FROM questions WHERE question_id = ?",
      [id]
    );

    if (questions.length === 0) {
      return sendError(res, statusCodes.NOT_FOUND, NOT_FOUND_MSG);
    }

    await dbconnection.query(
      `INSERT INTO answers (userid, question_id, answer)
       VALUES (?, ?, ?)`,
      [req.user.userid, id, answer]
    );

    return res.status(statusCodes.CREATED).json({
      message: "Answer posted successfully",
    });
  } catch (err) {
    console.error("Error posting answer:", err);
    return serverError(res, err);
  }
}

module.exports = {
  getAnswers,
  postAnswer,
};
