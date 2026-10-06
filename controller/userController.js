//dbconnection 
const dbconnection = require("../db/dbconfig");
const bcrypt = require("bcrypt");
const {statusCodes} =require("http-status-codes")
// REGISTER USER
async function register(req, res) {
  const {
    username,
    firstname,
    lastname,
    email,
    PASSWORD
  } = req.body;

  // Check required fields
  if (!username || !firstname || !lastname || !email || !PASSWORD) {
    return res.status(statusCodes.BAD_REQUEST).json({
      msg: "Please provide all required information!"
    });
  }
  try {
    const [user] =await dbconnection.query("select username,userid from users where username = ?",[username])
   if (user.length >0){
    return res.status(statusCodes.BAD_REQUEST).json({
      msg: "user already registered"
    })
   }
   if(PASSWORD.length<6){
    return res.status(statusCodes.BAD_REQUEST).json({
      msg: "Password must be at least 6 characters long!"
    })
   }
   //encription password
   const salt = await bcrypt.genSalt(10);
   const hashedPassword = await bcrypt.hash(PASSWORD, salt);
    // Insert user into database
    await dbconnection.query(
      "INSERT INTO users (username, firstname, lastname, email, PASSWORD) VALUES (?, ?, ?, ?, ?)",
      [username, firstname, lastname, email, hashedPassword]
    );

    return res.status(statusCodes.CREATED).json({
      msg: "User registered successfully!"
    });

  } catch (err) {
    console.error("Error registering user:", err);

    return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Something went wrong. Please try again later!"
    });
  }
}

// LOGIN USER

async function login(req, res) {
  res.send("login");
}

// CHECK USER

async function checkUser(req, res) {
  res.send("check user");
}

// EXPORT FUNCTIONS
module.exports = {
  register,
  login,
  checkUser
};