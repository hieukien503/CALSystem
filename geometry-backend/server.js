const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: '.env' });
const connectDB = require("./src/config/db");
const cors = require("cors");

const projectRoutes = require("./src/routes/projectRoutes");
const authRoutes = require("./src/routes/authRoutes");
const publicRoutes = require("./src/routes/publicRoutes"); // 👈 add this

const app = express();

const allowedOrigins = [
    "http://localhost:3000", // Local React development URL
    "https://bk-geometry-fe.onrender.com", // 👈 YOUR DEPLOYED FRONTEND URL
];

// ✅ allow your React dev origin
app.use(cors({
    origin: allowedOrigins,  // React frontend
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
const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => {
    
});
