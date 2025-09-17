const Project = require("../models/Project");

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

// SearchResults.tsx (query projects by name or label)
const searchProjects = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ error: "Missing search query" });

        const projects = await Project.find({
            "objects.label": { $regex: q, $options: "i" }
        });

        res.json({
            query: q,
            results: projects
        });
    } catch (err) {
        res.status(500).json({ error: "Error searching projects", details: err.message });
    }
};

module.exports = { loadHome, searchProjects };
