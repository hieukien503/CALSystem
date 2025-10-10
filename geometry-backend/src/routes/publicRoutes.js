const express = require("express");
const router = express.Router();
const { loadHome, searchProjects, searchUsers } = require("../controllers/publicController");

// Home.tsx → GET /api/home
router.get("/home", loadHome);

// SearchResults.tsx → GET /api/search?q=keyword
router.get("/search", searchProjects);

// Search users → GET /api/search/users?q=keyword
router.get("/search/users", searchUsers);

router.get("/debug/db", async (req, res) => {
    const mongoose = require("mongoose");
    res.json({
        db: mongoose.connection.name,
        collections: await mongoose.connection.db.listCollections().toArray()
    });
});

module.exports = router;
