const express = require("express");

const router = express.Router();
//user controller
const { register, login,checkUser} = require("../controller/userController");

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Check user
router.get("/check", checkUser);

module.exports = router;