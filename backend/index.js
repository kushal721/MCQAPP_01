const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();
const app = express();
const PORT = 4000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Function to connect to the database
const connectDb = async (DATABASE_URL) => {
  try {
    await mongoose.connect(DATABASE_URL);
    console.log("Database Connected Successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1); // Exit process with failure
  }
};
// Call the connectDb function with the database URL from environment variables
const DATABASE_URL = process.env.DATABASE_URL || "mongodb://127.0.0.1:27017";
connectDb(DATABASE_URL);

//imports
const courseRoutes = require("./routes/courseRoutes.js");
const subjectRoutes = require("./routes/subjectRoutes.js");

app.use("/api/course", courseRoutes);
app.use("/api/subject", subjectRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
