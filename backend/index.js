const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
const DATABASE_URL =
  process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/MCQ";

// Middleware to parse JSON request bodies
app.use(express.json());

// Enable CORS for cross-origin requests
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));

//imports
const courseRoutes = require("./routes/courseRoutes.js");
const subjectRoutes = require("./routes/subjectRoutes.js");
const questionRoutes = require("./routes/questionRoutes.js");
const statsRoutes = require("./routes/statsRoutes.js");
const Subject = require("./models/subject");

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/course", courseRoutes);
app.use("/api/subject", subjectRoutes);
app.use("/api/question", questionRoutes);
app.use("/api/stats", statsRoutes);

// Unknown API routes
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.path} not found.` });
});

// Fallback error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server error." });
});

const start = async () => {
  try {
    await mongoose.connect(DATABASE_URL);
    console.log("Database Connected Successfully");
    // Subject names used to be globally unique; they are now unique per course.
    await Subject.syncIndexes();
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1); // Exit process with failure
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
};

start();
