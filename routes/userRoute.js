const express = require("express");

const router = express.Router();

// Authentication middleware
const authMiddleware = require("../middleware/authMiddleware");

// User controller
const {
  register,
  login,
  checkUser
} = require("../controller/userController");

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Check user
router.get("/check", authMiddleware, checkUser);

module.exports = router;