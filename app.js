require("dotenv").config();
const express = require("express");

const app = express();
const port = process.env.PORT || 5500;

// Database connection
const dbconnections = require("./db/dbconfig");

// User routes middleware
const userRoutes = require("./routes/userRoute");

app.use(express.json());
app.use("/api/users", userRoutes);

// Question routes middleware
// app.use("/api/questions", questionRoutes);

// Answer routes middleware
// app.use("/api/answers", answerRoutes);

async function start() {
  try {
    await dbconnections.execute("SELECT 1");
    console.log("Database connection established successfully!");

    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  } catch (err) {
    console.error("Database connection failed!");
    console.error(err.message || err);
    console.error("Check that MySQL is running and that DB credentials in .env are correct.");
    process.exit(1);
  }
}

start();