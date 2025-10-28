// models/Project.js
const mongoose = require("mongoose");

//
// Shape properties (similar to ShapeProps in TS)
//
const lineStyleSchema = new mongoose.Schema({
    dash_size: { type: Number, default: 0 },
    gap_size: { type: Number, default: 0 },
    dot_size: { type: Number, default: 0 }
}, { _id: false });

const visibleSchema = new mongoose.Schema({
    shape: { type: Boolean, default: true },
    label: { type: Boolean, default: true }
}, { _id: false });

const shapePropsSchema = new mongoose.Schema({
    id: String,
    label: String,
    color: String,
    line_size: Number,
    line_style: lineStyleSchema,
    radius: Number,
    opacity: Number,
    visible: visibleSchema,
    fill: Boolean,
    labelXOffset: Number,
    labelYOffset: Number,
    labelZOffset: Number
}, { _id: false });

//
// Geometry point (used in Point, Line, Circle, etc.)
//
const pointSchema = new mongoose.Schema({
    x: Number,
    y: Number,
    z: Number,
    props: shapePropsSchema
}, { _id: false });

//
// Shape type (Point, Line, Circle, Polygon, etc.)
//
const shapeTypeSchema = new mongoose.Schema({
    type: String,
    startLine: pointSchema,
    endLine: pointSchema,
    centerC: pointSchema,
    radius: Number,
    points: [pointSchema],
    props: shapePropsSchema
}, { _id: false });

//
// ShapeNode (object in DAG)
//
const objectSchema = new mongoose.Schema({
    id: { type: String, required: true },
    defined: { type: Boolean, default: true },
    isSelected: { type: Boolean, default: false },
    dependsOn: [{ type: String }], // links to other object IDs
    type: shapeTypeSchema
}, { _id: false });

//
// Project metadata (Project2DProps)
//
const projectVersionSchema = new mongoose.Schema({
    versionName: String,
    versionNumber: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: String
}, { _id: false });

const collaboratorSchema = new mongoose.Schema({
    id: String,
    role: String
}, { _id: false });

const projectSchema = new mongoose.Schema({

    title: String,
    description: String,
    sharing: { type: String, default: "private" },
    projectVersion: projectVersionSchema,
    collaborators: [collaboratorSchema],
    ownedBy: String,

    // Core geometry objects (points, lines, circles�)
    objects: [objectSchema],

    // Store serialized geometry and DAG
    geometryState: { type: mongoose.Schema.Types.Mixed, default: {} },
    dag: { type: Array, default: [] },
    labelUsed: { type: [String], default: [] },
    animation: { type: Array, default: [] }
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);
