const mongoose = require("mongoose");

const objectSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  label: String,
  show: { type: Boolean, default: true },
  type: {
    type: String,
    enum: [
      "Point", "Line", "Circle", "Polygon",
      "Cone", "Cylinder", "FormulaObject", "Other"
    ]
  },

  // ----- Point -----
  coordinates: {
    x: Number,
    y: Number,
    z: Number,
  },

  // ----- Line -----
  point1Id: { type: mongoose.Schema.Types.ObjectId, ref: "Object" },
  point2Id: { type: mongoose.Schema.Types.ObjectId, ref: "Object" },
  segment: Boolean,
  vector: [Number],

  // ----- Circle -----
  centerId: { type: mongoose.Schema.Types.ObjectId, ref: "Object" },
  radius: Number,

  // ----- Polygon -----
  pointIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Object" }],

  // ----- Cone -----
  baseRadius: Number,
  height: Number,
  slant: Number,

  // ----- Cylinder -----
  cylinderBaseRadius: Number,
  cylinderHeight: Number,

  // ----- FormulaObject -----
  formula: String,

  // ----- Other -----
  objectType: String,
}, { timestamps: true });

module.exports = mongoose.model("Object", objectSchema);
