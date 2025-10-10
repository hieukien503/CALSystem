const Project = require("../models/Project");
const User = require("../models/User");

// Home.tsx (simple placeholder: latest projects)
const loadHome = async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 }).limit(5);
        res.json({
            message: "Welcome to Home",
            latestProjects: projects
        });
    } catch (err) {
        res.status(500).json({ error: "Error loading home", details: err.message });
    }
};

// Search projects by title
// http://localhost:3000/api/search?q=keyword
const searchProjects = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ error: "Missing search query" });

        const projects = await Project.find({
            title: { $regex: q, $options: "i" } // Search only in the title field
        });

        res.json({
            query: q,
            results: projects
        });
    } catch (err) {
        res.status(500).json({ error: "Error searching projects", details: err.message });
    }
};

// Search users by name 
// http://localhost:3000/api/search/users?q=keyword
const searchUsers = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ error: "Missing search query" });

        const users = await User.find({
            name: { $regex: q, $options: "i" } // Search only in the name field
        });

        res.json({
            query: q,
            results: users
        });
    } catch (err) {
        res.status(500).json({ error: "Error searching users", details: err.message });
    }
};

module.exports = { loadHome, searchProjects, searchUsers };
