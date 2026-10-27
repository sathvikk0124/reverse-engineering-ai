const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const analyzeRoutes = require("./routes/analyzeRoutes");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", analyzeRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    status: "success",
    message: "Reverse Engineering API is running"
  });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Startup failed:", error.message);
    process.exit(1);
  }
}

startServer();