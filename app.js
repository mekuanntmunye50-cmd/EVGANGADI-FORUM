const express = require("express");

const app = express();
const port = 5500;

// User routes middleware
const userRoutes = require("./routes/userRoute");

app.use("/api/users", userRoutes);
// quastion route midlewar

//answer routes midlewar
app.listen(port, (err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log(`Listening on port ${port}`);
  }
}); 
