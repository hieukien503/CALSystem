// models/Session.js
const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },

    geometryState: { type: Object },
    selectedPoints: { type: Array },
    selectedShapes: { type: Array },
    mode: String,
    isSnapToGrid: Boolean,
    isResize: Boolean,
    toolWidth: Number,

    isMenuRightClick: {
        x: Number,
        y: Number
    },
    isDialogBox: {
        title: String,
        input_label: String,
        angleMode: Boolean
    },
    data: {
        radius: Number,
        vertices: Number,
        rotation: {
            degree: Number,
            CCW: Boolean
        }
    },
    error: {
        label: String,
        message: String
    },
    position: {
        dialogPos: { x: Number, y: Number },
        errorDialogPos: { x: Number, y: Number }
    },
    snapToGridEnabled: Boolean
}, { timestamps: true });

module.exports = mongoose.model("Session", sessionSchema);
