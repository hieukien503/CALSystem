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
            ownedBy: req.body.ownedBy || null,
            objects: req.body.objects || [],
            session: req.body.session || {} // optional session
        });

        await newProject.save();
        res.status(201).json(newProject); // return Mongo _id
    } catch (err) {
        console.error("Error creating project:", err);
        res.status(500).json({ message: err.message });
    }
};

// --- Load project by Mongo _id ---
exports.loadProject = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findById(id);

        if (!project) return res.status(404).json({ message: "Project not found" });

        res.json(project);
    } catch (err) {
        console.error("Error loading project:", err);
        res.status(500).json({ message: err.message });
    }
};

// --- Update project by Mongo _id ---
exports.updateProject = async (req, res) => {
    try {
        const { title, description, sharing, projectVersion, collaborators, ownedBy, geometryState, dag, labelUsed } = req.body;

        const project = await Project.findByIdAndUpdate(
            req.params.id,
            { title, description, sharing, projectVersion, collaborators, ownedBy, geometryState, dag, labelUsed },
            { new: true, runValidators: true }
        );

        if (!project) return res.status(404).json({ error: "Project not found" });
        res.json(project);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.bulkProject = async (req, res) => {
    try {
        const { ids } = req.body; // array of projectIds
        const projects = await Project.find({ _id: { $in: ids } });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addProjectToUser = async (req, res) => {
    try {
        const { userId, projectId } = req.body;

        if (!userId || !projectId) {
            return res.status(400).json({ message: "Missing userId or projectId" });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { project: projectId } }, // prevents duplicates
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Project added", user });
    } catch (err) {
        console.error("Error in addProjectToUser:", err);
        res.status(500).json({ message: "Error adding project", error: err.message });
    }
};

// Delete a project
exports.deleteProject = async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findByIdAndDelete(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.json({ message: "Project deleted successfully", project });
    } catch (err) {
        res.status(500).json({ message: "Error deleting project", error: err.message });
    }
};

// Rename a project
exports.renameProject = async (req, res) => {
    console.log("Rename Project Function Executed");
    try {
        const { projectId } = req.params;
        const { newTitle } = req.body;

        console.log("Project ID:", projectId);
        console.log("New Title:", newTitle);

        const project = await Project.findByIdAndUpdate(
            projectId,
            { title: newTitle },
            { new: true }
        );

        console.log("Updated Project:", project);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.json({ message: "Project renamed successfully", project });
    } catch (err) {
        console.error("Error renaming project:", err.message);
        res.status(500).json({ message: "Error renaming project", error: err.message });
    }
};