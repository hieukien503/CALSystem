const express = require("express");
const router = express.Router();
const { createProject, loadProject, updateProject } = require("../controllers/projectController");

router.post("/", createProject);           // POST /api/projects
router.get("/:id", loadProject);           // GET /api/projects/:id
router.patch("/:id", updateProject);       // PATCH /api/projects/:id
//router.patch("/:id/session", updateSession); // PATCH /api/projects/:id/session

module.exports = router;
