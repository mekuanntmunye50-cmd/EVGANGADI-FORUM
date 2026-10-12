// Error shape required by the API documentation: { error, message }
const statusCodes = require("../constants/statusCodes");

const NAMES = {
  400: "Bad Request",
  401: "Unauthorized",
  404: "Not Found",
  409: "Conflict",
  500: "Internal Server Error",
};

function sendError(res, status, message) {
  return res.status(status).json({ error: NAMES[status], message });
}

function serverError(res, err) {
  console.error(err);
  return sendError(
    res,
    statusCodes.INTERNAL_SERVER_ERROR,
    "An unexpected error occurred."
  );
}

// trims strings; anything that is not a string becomes ""
const text = (v) => (typeof v === "string" ? v.trim() : "");

module.exports = { sendError, serverError, text };
