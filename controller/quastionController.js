const dbconnection = require("../db/dbconfig");
const statusCodes = require("../constants/statusCodes");
const { sendError, serverError, text } = require("../utils/respond");

const TITLE_MAX = 200;
const NOT_FOUND_MSG = "The requested question could not be found.";

// GET /api/question  (newest first)
async function getAllQuestions(req, res) {
  try {
    const [rows] = await dbconnection.query(
      `SELECT q.question_id, q.title, q.description AS content,
              u.username AS user_name, q.created_at
       FROM questions q
       JOIN users u ON q.userid = u.userid
       ORDER BY q.created_at DESC, q.question_id DESC`
    );
    if (rows.length === 0) {
      return sendError(res, statusCodes.NOT_FOUND, "No questions found.");
    }
    return res.status(statusCodes.OK).json({ questions: rows });
  } catch (err) {
    return serverError(res, err);
  }
}

// GET /api/question/:question_id
async function getSingleQuestion(req, res) {
  const id = Number(req.params.question_id);
  if (!Number.isInteger(id) || id < 1) {
    return sendError(res, statusCodes.NOT_FOUND, NOT_FOUND_MSG);
  }
  try {
    const [rows] = await dbconnection.query(
      `SELECT q.question_id, q.title, q.description AS content,
              q.userid AS user_id, u.username AS user_name, q.created_at
       FROM questions q
       JOIN users u ON q.userid = u.userid
       WHERE q.question_id = ?`,
      [id]
    );
    if (rows.length === 0) {
      return sendError(res, statusCodes.NOT_FOUND, NOT_FOUND_MSG);
    }
    return res.status(statusCodes.OK).json({ question: rows[0] });
  } catch (err) {
    return serverError(res, err);
  }
}

// POST /api/question
async function postQuestion(req, res) {
  const body = req.body || {};
  const title = text(body.title);
  const description = text(body.description);

  if (!title || !description) {
    return sendError(
      res,
      statusCodes.BAD_REQUEST,
      "Please provide all required fields"
    );
  }
  if (title.length > TITLE_MAX) {
    return sendError(
      res,
      statusCodes.BAD_REQUEST,
      `Title must be ${TITLE_MAX} characters or less`
    );
  }
  try {
    await dbconnection.query(
      "INSERT INTO questions (userid, title, description) VALUES (?, ?, ?)",
      [req.user.userid, title, description]
    );
    return res
      .status(statusCodes.CREATED)
      .json({ message: "Question created successfully" });
  } catch (err) {
    return serverError(res, err);
  }
}

module.exports = { getAllQuestions, getSingleQuestion, postQuestion };
