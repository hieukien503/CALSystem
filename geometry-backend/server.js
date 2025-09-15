const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");
const projectRoutes = require("./src/routes/projectRoutes");

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// Kết nối DB
connectDB();

// Routes
app.use("/api/projects", projectRoutes);

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
