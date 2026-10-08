const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const statusCodes = require("../constants/statusCodes");

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Authentication invalid" });
  }

  try {
    const data = jwt.verify(authHeader, "secret");

    req.user = data;

    next();
  } catch (error) {
    return res
      .status(statusCodes.UNAUTHORIZED)
      .json({ msg: "Authentication invalid" });
  }
}

module.exports = authMiddleware;