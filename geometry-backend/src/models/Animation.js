const mongoose = require("mongoose");

const animationSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  title: String,
}, { timestamps: true });

module.exports = mongoose.model("Animation", animationSchema);
