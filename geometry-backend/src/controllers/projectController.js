const Project = require("../models/Project");

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

        console.log("dag: ", dag);

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

//exports.updateSession = async (req, res) => {
//    try {
//        const { id } = req.params;

//        const project = await Project.findByIdAndUpdate(
//            id,
//            { $set: { session: req.body } }, // replace session entirely
//            { new: true, upsert: true }      // upsert ensures session exists
//        );

//        if (!project) return res.status(404).json({ message: "Project not found" });

//        res.json(project);
//    } catch (err) {
//        console.error("Error updating session:", err);
//        res.status(500).json({ message: "Failed to update session" });
//    }
//};
