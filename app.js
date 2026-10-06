const express = require("express");

const app = express();
const port = 5500;

// Database connection
const dbconnections = require("./db/dbconfig");

// User routes middleware
const userRoutes = require("./routes/userRoute");
//json middleware to extract data
app.use(express.json());

app.use("/api/users", userRoutes);

// Question routes middleware
// app.use("/api/questions", questionRoutes);

// Answer routes middleware
// app.use("/api/answers", answerRoutes);

async function start() {
  try {
    // Test database connection
    const result = await dbconnections.execute("SELECT 1");

    console.log("Database connection established successfully!");

    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });

  } catch (err) {
    console.log("Database connection failed:", err.message);
  }
}

start();