const mongoose = require("mongoose");

const animationStepSchema = new mongoose.Schema({
  animationId: { type: mongoose.Schema.Types.ObjectId, ref: "Animation", required: true },
  objectId: { type: mongoose.Schema.Types.ObjectId, ref: "Object", required: true },
  stepOrder: { type: Number, required: true },
  timeOffset: { type: Number, default: 0 },

  // Transformations
  translation: {
    dx: Number,
    dy: Number,
  },
  rotation: {
    angle: Number,
  },
  scaling: {
    multiplier: Number,
  },
}, { timestamps: true });

module.exports = mongoose.model("AnimationStep", animationStepSchema);
