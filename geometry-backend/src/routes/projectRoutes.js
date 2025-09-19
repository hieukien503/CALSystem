const express = require("express");
const router = express.Router();
const { createProject, loadProject, updateProject, bulkProject, addProjectToUser } = require("../controllers/projectController");

router.post("/", createProject);           // POST /api/projects
router.get("/:id", loadProject);           // GET /api/projects/:id
router.post("/bulk", bulkProject);
router.patch("/:id", updateProject);       // PATCH /api/projects/:id
router.post("/add", addProjectToUser);

module.exports = router;
