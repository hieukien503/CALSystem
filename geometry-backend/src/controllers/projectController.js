const Project = require("../models/Project");

// Save project (POST /api/projects/save)
const saveProject = async (req, res) => {
  try {
    const { name, data } = req.body;

    if (!name || !data) {
      return res.status(400).json({ message: "Thiếu name hoặc data" });
    }

    // Kiểm tra nếu project đã tồn tại → update
    let project = await Project.findOne({ name });

    if (project) {
      project.data = data;
      project.updatedAt = Date.now();
      await project.save();
      return res.json({ message: "Cập nhật project thành công", project });
    }

    // Nếu chưa có thì tạo mới
    project = new Project({ name, data });
    await project.save();

    res.status(201).json({ message: "Tạo project thành công", project });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi save project", error: err.message });
  }
};

// Load project theo tên (GET /api/projects/load/:name)
const loadProject = async (req, res) => {
  try {
    const { name } = req.params;
    const project = await Project.findOne({ name });

    if (!project) {
      return res.status(404).json({ message: "Không tìm thấy project" });
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi load project", error: err.message });
  }
};

// Lấy tất cả projects
const loadAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

module.exports = { saveProject, loadProject, loadAllProjects, };
