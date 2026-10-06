const express = require("express");

const app = express();
const port = 5500;

// User routes middleware
const userRoutes = require("./routes/userRoutes");

app.use("/api/users", userRoutes);

app.listen(port, (err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log(`Listening on port ${port}`);
  }
});
