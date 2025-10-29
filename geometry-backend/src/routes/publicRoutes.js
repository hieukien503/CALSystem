const express = require("express");
const router = express.Router();
const { loadHome, searchAll } = require("../controllers/publicController");
const { optionalAuth } = require("../controllers/optionalAuth"); // path tương ứng

// Home.tsx → GET /api/home
router.get("/home", loadHome);

router.get("/search", optionalAuth, searchAll);

router.get("/debug/db", async (req, res) => {
    const mongoose = require("mongoose");
    res.json({
        db: mongoose.connection.name,
        collections: await mongoose.connection.db.listCollections().toArray()
    });
});

module.exports = router;
