const express = require("express");
const router = express.Router();
const { createProject, loadProject, updateProject, bulkProject, addProjectToUser, deleteProject, updateProjectInfo } = require("../controllers/projectController");

const { authenticateUser } = require("../controllers/middleware");

// Routes cần đăng nhập
router.post("/", createProject);           // POST /api/projects
router.get("/:id/:user", loadProject);           // GET /api/projects/:id
router.patch("/:id", authenticateUser, updateProject);       // PATCH /api/projects/:id
router.post("/bulk", bulkProject);
router.post("/add", authenticateUser, addProjectToUser);
router.delete("/:projectId", authenticateUser, deleteProject);    // Delete a project → DELETE /api/projects/:projectId
router.patch("/:projectId/rename", authenticateUser, updateProjectInfo); // Rename a project → PATCH /api/projects/:projectId

module.exports = router;