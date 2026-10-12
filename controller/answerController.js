const dbconnection = require("../db/dbconfig");
const statusCodes = require("../constants/statusCodes");
const { sendError, serverError, text } = require("../utils/respond");

const NOT_FOUND_MSG = "The requested question could not be found.";

// GET /api/answer/:question_id
async function getAnswers(req, res) {
  const id = Number(req.params.question_id);
  if (!Number.isInteger(id) || id < 1) {
    return sendError(res, statusCodes.NOT_FOUND, NOT_FOUND_MSG);
  }
  try {
    const [q] = await dbconnection.query(
      "SELECT question_id FROM questions WHERE question_id = ?",
      [id]
    );
    if (q.length === 0) {
      return sendError(res, statusCodes.NOT_FOUND, NOT_FOUND_MSG);
    }
    const [rows] = await dbconnection.query(
      `SELECT a.answer_id, a.answer AS content, u.username AS user_name, a.created_at
       FROM answers a
       JOIN users u ON a.userid = u.userid
       WHERE a.question_id = ?
       ORDER BY a.created_at DESC, a.answer_id DESC`,
      [id]
    );
    return res.status(statusCodes.OK).json({ answers: rows });
  } catch (err) {
    return serverError(res, err);
  }
}

// POST /api/answer
async function postAnswer(req, res) {
  const body = req.body || {};
  const answer = text(body.answer);
  if (!answer) {
    return sendError(res, statusCodes.BAD_REQUEST, "Please provide answer");
  }
  const id = Number(body.questionid);
  if (!Number.isInteger(id) || id < 1) {
    return sendError(
      res,
      statusCodes.BAD_REQUEST,
      "Please provide all required fields"
    );
  }
  try {
    const [q] = await dbconnection.query(
      "SELECT question_id FROM questions WHERE question_id = ?",
      [id]
    );
    if (q.length === 0) {
      return sendError(res, statusCodes.NOT_FOUND, NOT_FOUND_MSG);
    }
    await dbconnection.query(
      "INSERT INTO answers (userid, question_id, answer) VALUES (?, ?, ?)",
      [req.user.userid, id, answer]
    );
    return res
      .status(statusCodes.CREATED)
      .json({ message: "Answer posted successfully" });
  } catch (err) {
    return serverError(res, err);
  }
}

module.exports = { getAnswers, postAnswer };
