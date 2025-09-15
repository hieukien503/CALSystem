const express = require("express");
const router = express.Router();
const { saveProject, loadProject, loadAllProjects } = require("../controllers/projectController");

// Save project
router.post("/save", saveProject);

// Load project theo tên
router.get("/load/:name", loadProject);

// Lấy tất cả projects
router.get("/", loadAllProjects);

module.exports = router;
