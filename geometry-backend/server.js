const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: './geometry-backend/.env' });
const connectDB = require("./src/config/db");
const cors = require("cors");

const projectRoutes = require("./src/routes/projectRoutes");
const authRoutes = require("./src/routes/authRoutes");
const publicRoutes = require("./src/routes/publicRoutes"); // 👈 add this

const app = express();

// ✅ allow your React dev origin
app.use(cors({
    origin: "http://localhost:3000",  // React frontend
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// Middleware
app.use(express.json());

// DB connect
connectDB();

// Routes
app.use("/api/projects", projectRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", publicRoutes); // 👈 /api/home and /api/search

// Start server
//const PORT = process.env.PORT || 3000;
const PORT = 3001;
app.listen(PORT, () => {
    
});
