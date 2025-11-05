const express = require("express");
const router = express.Router();
const { createProject, loadProject, updateProject, bulkProject, addProjectToUser, deleteProject, renameProject } = require("../controllers/projectController");

const { authenticateUser } = require("../controllers/middleware");

// Routes cần đăng nhập
router.post("/bulk", authenticateUser, bulkProject);
router.post("/", authenticateUser, createProject);           // POST /api/projects
router.get("/:id", authenticateUser, loadProject);           // GET /api/projects/:id
router.patch("/:id", authenticateUser, updateProject);       // PATCH /api/projects/:id
router.post("/add", authenticateUser, addProjectToUser);
router.delete("/:projectId", authenticateUser, deleteProject);    // Delete a project → DELETE /api/projects/:projectId
router.patch("/:projectId/rename", authenticateUser, renameProject); // Rename a project → PATCH /api/projects/:projectId

module.exports = router;