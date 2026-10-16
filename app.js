
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const dbconnections = require("./db/dbconfig");

// Import route files
const userRoutes = require("./routes/userRoute");
const questionRoutes = require("./routes/questionRoute");
const answerRoutes = require("./routes/answerRoute");

const app = express();
const port = process.env.PORT || 5500;

// Middleware
app.use(cors());
app.use(express.json());

// Register API routes
app.use("/api/users", userRoutes);
app.use("/api/question", questionRoutes);
app.use("/api/answer", answerRoutes);

// Simple root endpoint for checking the server
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Evangadi Forum API is running",
  });
});

// Start server only after confirming database connectivity
async function start() {
  try {
    await dbconnections.execute("SELECT 1");

    console.log("Database connection established successfully!");

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (err) {
    console.error("Database connection failed!");
    console.error(err.message || err);
    console.error(
      "Check that MySQL is running and your .env database credentials are correct."
    );

    process.exit(1);
  }
}

start();
