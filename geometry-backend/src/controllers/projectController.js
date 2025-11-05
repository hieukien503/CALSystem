const Project = require("../models/Project");
const User = require("../models/User");

// --- Create a new project ---
exports.createProject = async (req, res) => {
    try {
        const newProject = new Project({
            title: req.body.title || "Untitled Project",
            description: req.body.description || "",
            sharing: req.body.sharing || "private",
            projectVersion: req.body.projectVersion,
            collaborators: req.body.collaborators || [],
            ownedBy: req.user.userId, // ✅ lấy userId từ token
            objects: req.body.objects || [],
            geometryState: req.body.geometryState || {},
            dag: req.body.dag || [],
            labelUsed: req.body.labelUsed || [],
            animation: req.body.animation || []
        });

        await newProject.save();
        res.status(201).json(newProject);
    } catch (err) {
        console.error("Error creating project:", err);
        res.status(500).json({ message: err.message });
    }
};

// --- Load project by Mongo _id ---
exports.loadProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: "Project not found" });

        const userId = req.user.userId;
        const canView =
            project.sharing === "public" ||
            project.ownedBy === userId ||
            (project.collaborators || []).includes(userId);

        if (!canView)
            return res.status(403).json({ message: "Forbidden: private project" });

        res.json(project);
    } catch (err) {
        console.error("Error loading project:", err);
        res.status(500).json({ message: err.message });
    }
};

// --- Update project ---
exports.updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ error: "Project not found" });

        const userId = req.user.userId;
        const canEdit =
            project.ownedBy === userId ||
            (project.collaborators || []).includes(userId);

        if (!canEdit)
            return res.status(403).json({ error: "Forbidden: no edit permission" });

        const updateFields = req.body;
        const updated = await Project.findByIdAndUpdate(
            req.params.id,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        res.json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.bulkProject = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: "Missing or invalid ids array" });
        }
        const projects = await Project.find({ _id: { $in: ids } });

        const userId = req.user?.userId;

        const visible = projects.filter(p =>
            p.sharing === "public" ||
            (userId && p.ownedBy === userId) ||
            (userId && Array.isArray(p.collaborators) && p.collaborators.includes(userId))
        );

        res.json(visible); // ✅ Client expects an array
    } catch (err) {
        console.error("Error in bulkProject:", err);
        res.status(500).json({ message: "Error fetching projects", error: err.message });
    }
};


// --- Add project to user's project list ---
exports.addProjectToUser = async (req, res) => {
    try {
        const { userId, projectId } = req.body;
        if (!userId || !projectId) {
            return res.status(400).json({ message: "Missing userId or projectId" });
        }

        const user = await User.findOneAndUpdate(
            { userId },
            { $addToSet: { project: projectId } },
            { new: true }
        );

        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "Project added", user });
    } catch (err) {
        console.error("Error in addProjectToUser:", err);
        res.status(500).json({ message: "Error adding project", error: err.message });
    }
};

// --- Delete project (only owner) ---
exports.deleteProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ message: "Project not found" });

        if (project.ownedBy !== req.user.userId) {
            return res.status(403).json({ message: "Forbidden: only owner can delete" });
        }

        await Project.findByIdAndDelete(projectId);
        res.json({ message: "Project deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting project", error: err.message });
    }
};

// --- Rename project (owner or collaborator) ---
exports.renameProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { newTitle } = req.body;

        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ message: "Project not found" });

        const userId = req.user.userId;
        const canRename =
            project.ownedBy === userId ||
            (project.collaborators || []).includes(userId);

        if (!canRename)
            return res.status(403).json({ message: "Forbidden: cannot rename" });

        project.title = newTitle;
        await project.save();

        res.json({ message: "Project renamed successfully", project });
    } catch (err) {
        console.error("Error renaming project:", err.message);
        res.status(500).json({ message: "Error renaming project", error: err.message });
    }
};