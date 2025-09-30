const express = require("express");
const router = express.Router();
const { createProject, loadProject, updateProject, bulkProject, addProjectToUser, deleteProject, renameProject } = require("../controllers/projectController");

router.post("/", createProject);           // POST /api/projects
router.get("/:id", loadProject);           // GET /api/projects/:id
router.post("/bulk", bulkProject);
router.patch("/:id", updateProject);       // PATCH /api/projects/:id
router.post("/add", addProjectToUser);
router.delete("/:projectId", deleteProject);    // Delete a project → DELETE /api/projects/:projectId
router.patch("/:projectId/rename", renameProject); // Rename a project → PATCH /api/projects/:projectId

module.exports = router;
