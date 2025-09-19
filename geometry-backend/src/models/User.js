const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
      userId: { type: String, required: true, unique: true },
      name: String,
      email: { type: String, required: true, unique: true },
      passwordHash: String,
      role: { type: String, enum: ["student", "teacher", "admin"], default: "student" },
      grade: String,
      project: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
