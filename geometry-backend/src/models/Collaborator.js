const mongoose = require("mongoose");

const collaboratorSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  collabId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: String, enum: ["editor", "viewer"], default: "viewer" }
});

module.exports = mongoose.model("Collaborator", collaboratorSchema);
