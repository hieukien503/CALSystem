import React from "react";

interface ButtonProps {
    label: string;
    title: string;
    onClick: () => void;
    selected: boolean;
};

class Button extends React.Component<ButtonProps> {
    render(): React.ReactNode {
        return (
            <button 
                type="button"
                className={`toolButton${this.props.selected ? " selected" : ""}`}
                onClick={this.props.onClick}
                title={this.props.title}
            >
                <div className="label">{this.props.label}</div>
            </button>                 
        );
    }
}

interface GeometryToolProps {
    width: number;
    height: number;
    onPointClick: () => void;
    onLineClick: () => void;
    onSegmentClick: () => void;
    onVectorClick: () => void;
    onPolygonClick: () => void;
    onCircleRadiusClick: () => void;
    onRayClick: () => void;
    onEditClick: () => void;
    onDeleteClick: () => void;
    onClearClick: () => void;
    onUndoClick: () => void;
    onRedoClick: () => void;
    onAngleClick: () => void;
    onHideLabelClick: () => void;
    onHideObjectClick: () => void;
    onMidPointClick: () => void;
    onCircumcenterClick: () => void;
    onIncenterClick: () => void;
    onExcenterClick: () => void;
    onOrthocenterClick: () => void;
    onCentroidClick: () => void;
    onLengthClick: () => void;
    onPerpenLineClick: () => void;
    onPerpenBisecClick: () => void;
    onParaLineClick: () => void;
    onAngleBisecClick: () => void;
    onTangentLineClick: () => void;
    onCircumcircleClick: () => void;
    onIncircleClick: () => void;
    onExcircleClick: () => void;
    onCircle2PointClick: () => void;
    onSegmentLengthClick: () => void;
    onSemiClick: () => void;
    onRegularPolygonClick: () => void;
    // onTranslationClick: () => void;
    // onRotationClick: () => void;
    // onReflectionClick: () => void;
    // onProjectionClick: () => void;
    // onScalingClick: () => void;
    onIntersectionClick: () => void;
    onAreaClick: () => void;
}

interface GeometryTool3DProps extends GeometryToolProps {
    onAddCuboid: () => void;
    onAddCone: () => void;
    onAddPrism: () => void;
    onAddPyramid: () => void;
    onAddSphere: () => void;
    onAddPlane: () => void;
    onAddCylinder: () => void;
}

interface GeometryToolState {
    activeButton: string | null;
}

export class GeometryTool extends React.Component<GeometryToolProps, GeometryToolState> {
    constructor(props: GeometryToolProps) {
        super(props);
        this.state = {
            activeButton: null
        }
    }

    setActiveTool(toolKey: string) {
        this.setState({ activeButton: toolKey });
        if (toolKey === "point") {
            this.props.onPointClick();
        }

        else if (toolKey === "line") {
            this.props.onLineClick();
        }

        else if (toolKey === "segment") {
            this.props.onSegmentClick();
        }

        else if (toolKey === "vector") {
            this.props.onVectorClick();
        }

        else if (toolKey === "polygon") {
            this.props.onPolygonClick();
        }

        else if (toolKey === "circle") {
            this.props.onCircleRadiusClick();
        }

        else if (toolKey === "ray") {
            this.props.onRayClick();
        }

        else if (toolKey === "edit") {
            this.props.onEditClick();
        }

        else if (toolKey === "delete") {
            this.props.onDeleteClick();
        }

        else if (toolKey === "clear") {
            this.props.onClearClick();
        }

        else if (toolKey === "undo") {
            this.props.onUndoClick();
        }

        else if (toolKey === "redo") {
            this.props.onRedoClick();
        }

        else if (toolKey === "angle") {
            this.props.onAngleClick();
        }

        else if (toolKey === "show_label") {
            this.props.onHideLabelClick();
        }

        else if (toolKey === "show_object") {
            this.props.onHideObjectClick();
        }

        else if (toolKey === "midpoint") {
            this.props.onMidPointClick();
        }

        else if (toolKey === "perpendicular") {
            this.props.onPerpenLineClick();
        }

        else if (toolKey === "perpendicular_bisector") {
            this.props.onPerpenBisecClick();
        }

        else if (toolKey === "parallel") {
            this.props.onParaLineClick();
        }

        else if (toolKey === "angle_bisector") {
            this.props.onAngleBisecClick();
        }

        else if (toolKey === "tangent") {
            this.props.onTangentLineClick();
        }

        else if (toolKey === "intersection") {
            this.props.onIntersectionClick();
        }

        else if (toolKey === "circumcenter") {
            this.props.onCircumcenterClick();
        }

        else if (toolKey === "incenter") {
            this.props.onIncenterClick();
        }

        else if (toolKey === "excenter") {
            this.props.onExcenterClick();
        }

        else if (toolKey === "orthocenter") {
            this.props.onOrthocenterClick();
        }

        else if (toolKey === "centroid") {
            this.props.onCentroidClick();
        }

        else if (toolKey === "length") {
            this.props.onLengthClick();
        }

        else if (toolKey === "area") {
            this.props.onAreaClick();
        }

        else if (toolKey === "segment_length") {
            this.props.onSegmentLengthClick();
        }

        else if (toolKey === "circle_2_points") {
            this.props.onCircle2PointClick();
        }

        else if (toolKey === "circumcircle") {
            this.props.onCircumcircleClick();
        }

        else if (toolKey === "incircle") {
            this.props.onIncircleClick();
        }

        else if (toolKey === "excircle") {
            this.props.onExcircleClick();
        }

        else if (toolKey === "semicircle") {
            this.props.onSemiClick();
        }

        else if (toolKey === "reg_polygon") {
            this.props.onRegularPolygonClick();
        }

        // else if (toolKey === "translation") {
        //     this.props.onTranslationClick();
        // }

        // else if (toolKey === "scaling") {
        //     this.props.onScalingClick();
        // }

        // else if (toolKey === "rotation") {
        //     this.props.onRotationClick();
        // }

        // else if (toolKey === "projection") {
        //     this.props.onProjectionClick();
        // }

        // else if (toolKey === "reflection") {
        //     this.props.onReflectionClick();
        // }
    }

    render(): React.ReactNode {
        const toolCategories = [
            {
                name: "Basic Tools",
                tools: [
                    { key: "point", label: "Point", onClick: () => this.setActiveTool("point"), title: "Select position or object" },
                    { key: "line", label: "Line", onClick: () => this.setActiveTool("line"), title: "Select 2 points" },
                    { key: "segment", label: "Segment", onClick: () => this.setActiveTool("segment"), title: "Select 2 points" },
                    { key: "polygon", label: "Polygon", onClick: () => this.setActiveTool("polygon"), title: "Select all vertices, then click on the first point again" },
                    { key: "circle", label: "Circle", onClick: () => this.setActiveTool("circle"), title: "Select a center, then enter its radius" },
                    { key: "edit", label: "Move", onClick: () => this.setActiveTool("edit"), title: "Move the objects or View" }
                ]
            },
            {
                name: "Edit",
                tools: [
                    { key: "delete", label: "Delete", onClick: () => this.setActiveTool("delete"), title: "Select the object to delete" },
                    { key: "show_label", label: "Show / Hide Label", onClick: () => this.setActiveTool("show_label"), title: "Select object" },
                    { key: "show_object", label: "Show / Hide Object", onClick: () => this.setActiveTool("show_object"), title: "Select object" },
                    { key: "undo", label: "Undo", onClick: () => this.setActiveTool("undo"), title: "Undo the process" },
                    { key: "redo", label: "Redo", onClick: () => this.setActiveTool("redo"), title: "Redo the process" },
                    { key: "clear", label: "Clear", onClick: () => this.setActiveTool("clear"), title: "Clear all objects" }
                ]
            },
            {
                name: "Construct",
                tools: [
                    { key: "midpoint", label: "Midpoint or Center", onClick: () => this.setActiveTool("midpoint"), title: "Select 2 points, a segment or a circle" },
                    { key: "perpendicular", label: "Perpendicular Line", onClick: () => this.setActiveTool("perpendicular"), title: "Select perpendicular line and point" },
                    { key: "perpendicular_bisector", label: "Perpendicular Bisector", onClick: () => this.setActiveTool("perpendicular_bisector"), title: "Select 2 points or a segment" },
                    { key: "parallel", label: "Parallel Line", onClick: () => this.setActiveTool("parallel"), title: "Select parallel line and point" },
                    { key: "angle_bisector", label: "Angle Bisector", onClick: () => this.setActiveTool("angle_bisector"), title: "Select parallel line and point" },
                    { key: "tangent", label: "Tangents", onClick: () => this.setActiveTool("tangent"), title: "Select point, then circle" },
                ]
            },
            {
                name: "Points",
                tools: [
                    { key: "point", label: "Point", onClick: () => this.setActiveTool("point"), title: "Select position or object" },
                    { key: "intersection", label: "Intersect", onClick: () => this.setActiveTool("intersection"), title: "Select intersection or 2 objects" },
                    { key: "circumcenter", label: "Circumcenter of Triangle", onClick: () => this.setActiveTool("circumcenter"), title: "Select 3 non-collinear points or polygon with 3 vertices" },
                    { key: "incenter", label: "Incenter of Triangle", onClick: () => this.setActiveTool("incenter"), title: "Select 3 non-collinear points or polygon with 3 vertices" },
                    { key: "excenter", label: "Excenter of Triangle", onClick: () => this.setActiveTool("excenter"), title: "Select 3 non-collinear points or polygon with 3 vertices" },
                    { key: "orthocenter", label: "Orthocenter of Triangle", onClick: () => this.setActiveTool("orthocenter"), title: "Select 3 non-collinear points or polygon with 3 vertices" },
                    { key: "centroid", label: "Centroid of Triangle", onClick: () => this.setActiveTool("centroid"), title: "Select 3 non-collinear points or polygon with 3 vertices" }
                ]
            },
            {
                name: "Measure",
                tools: [
                    { key: "angle", label: "Angle", onClick: () => this.setActiveTool("angle"), title: "Select 2 lines or 3 points" },
                    { key: "length", label: "Distance or Length", onClick: () => this.setActiveTool("length"), title: "Select 2 points or segment, polygon, circle" },
                    { key: "area", label: "Area", onClick: () => this.setActiveTool("area"), title: "Select polygon or circle" }
                ]
            },
            {
                name: "Lines",
                tools: [
                    { key: "vector", label: "Vector", onClick: () => this.setActiveTool("vector"), title: "Select 2 points" },
                    { key: "line", label: "Line", onClick: () => this.setActiveTool("line"), title: "Select 2 points" },
                    { key: "ray", label: "Ray", onClick: () => this.setActiveTool("ray"), title: "Select 2 points" },
                    { key: "segment", label: "Segment", onClick: () => this.setActiveTool("segment"), title: "Select 2 points" },
                    { key: "segment_length", label: "Segment with Given Length", onClick: () => this.setActiveTool("segment_length"), title: "Select point, then enter length" },
                ]
            },
            {
                name: "Circles",
                tools: [
                    { key: "circle", label: "Circle: Center & Radius", onClick: () => this.setActiveTool("circle"), title: "Select a center, then enter its radius" },
                    { key: "circle_2_points", label: "Circle with Center", onClick: () => this.setActiveTool("circle_2_points"), title: "Select a center, then point on circle" },
                    { key: "circumcircle", label: "Circle through 3 points", onClick: () => this.setActiveTool("circumcircle"), title: "Select 3 points on the circle" },
                    { key: "semicircle", label: "Semicircle", onClick: () => this.setActiveTool("semicircle"), title: "Select 2 end points" },
                    { key: "incircle", label: "Incircle of Triangle", onClick: () => this.setActiveTool("incircle"), title: "Select 3 non-collinear points or polygon with 3 vertices" },
                    { key: "excircle", label: "Excircle of Triangle", onClick: () => this.setActiveTool("excircle"), title: "Select 3 non-collinear points or polygon with 3 vertices" },
                ]
            },
            {
                name: "Polygon",
                tools: [
                    { key: "polygon", label: "Polygon", onClick: () => this.setActiveTool("polygon"), title: "Select all vertices, then click on the first point again" },
                    { key: "reg_polygon", label: "Regular Polygon", onClick: () => this.setActiveTool("reg_polygon"), title: "Select 2 points, then enter number of vertices" },
                ]
            },
            {
                name: "Transform",
                tools: [
                    { key: "translation", label: "Translate by Vector", onClick: () => this.setActiveTool("translation"), title: "Select object to translate, then vector" },
                    { key: "rotation", label: "Rotate around Point", onClick: () => this.setActiveTool("rotation"), title: "Select object to rotate and center point, then enter angle" },
                    { key: "scaling", label: "Dilate from Point", onClick: () => this.setActiveTool("scaling"), title: "Select object, then center point, then enter factor" },
                    { key: "reflect_point", label: "Reflect about Point", onClick: () => this.setActiveTool("reflect_point"), title: "Select object to reflect, then center point" },
                    { key: "reflect_line", label: "Reflect about Line", onClick: () => this.setActiveTool("reflect_line"), title: "Select object to reflect, then line of reflection" },
                    { key: "projection", label: "Project to Line", onClick: () => this.setActiveTool("projection"), title: "Select point or segment to project, then line to project onto" },
                ]
            }
        ];

        return (
            <div 
                className="customScrollBar"
                style={{
                    overflow: 'auto',
                    position: 'relative',
                    width: this.props.width,
                    height: this.props.height,
                    display: 'flex',
                    flexDirection: 'row',
                    backgroundColor: '#f9f9f9'
                }}
            >
                <div
                    className="tool-panel"
                    style={{
                        width: this.props.width,
                        height: this.props.height,
                        padding: "8px 16px 14px 16px"
                    }}
                >
                {toolCategories.map((category) => (
                    <div key={category.name}>
                        <div className="catLabel text-neutral-900">{category.name}</div>
                        <div
                            className="categoryPanel"
                        >
                            {category.tools.map((tool) => (
                                <Button
                                    key={tool.key}
                                    label={tool.label}
                                    title={tool.title}
                                    onClick={tool.onClick}
                                    selected={this.state.activeButton === tool.key}
                                />
                            ))}
                        </div>
                    </div>
                ))}
                </div>
            </div>
            
        )
    }
}

export class GeometryTool3D extends React.Component<GeometryTool3DProps, GeometryToolState> {
    constructor(props: GeometryTool3DProps) {
        super(props);
        this.state = {
            activeButton: null
        }
    }

    setActiveTool(toolKey: string) {
        this.setState({ activeButton: toolKey });
        if (toolKey === "point") {
            this.props.onPointClick();
        }

        else if (toolKey === "line") {
            this.props.onLineClick();
        }

        else if (toolKey === "segment") {
            this.props.onSegmentClick();
        }

        else if (toolKey === "vector") {
            this.props.onVectorClick();
        }

        else if (toolKey === "polygon") {
            this.props.onPolygonClick();
        }

        else if (toolKey === "circle") {
            this.props.onCircleRadiusClick();
        }

        else if (toolKey === "ray") {
            this.props.onRayClick();
        }

        else if (toolKey === "edit") {
            this.props.onEditClick();
        }

        else if (toolKey === "delete") {
            this.props.onDeleteClick();
        }

        else if (toolKey === "clear") {
            this.props.onClearClick();
        }

        else if (toolKey === "undo") {
            this.props.onUndoClick();
        }

        else if (toolKey === "redo") {
            this.props.onRedoClick();
        }

        else if (toolKey === "cuboid") {
            this.props.onAddCuboid();
        }

        else if (toolKey === "cone") {
            this.props.onAddCone();
        }

        else if (toolKey === "prism") {
            this.props.onAddPrism();
        }

        else if (toolKey === "pyramid") {
            this.props.onAddPyramid();
        }

        else if (toolKey === "sphere") {
            this.props.onAddSphere();
        }

        else if (toolKey === "plane") {
            this.props.onAddPlane();
        }

        else if (toolKey === "cylinder") {
            this.props.onAddCylinder();
        }

        else if (toolKey === "angle") {
            this.props.onAngleClick();
        }
    }

    render(): React.ReactNode {
        const toolCategories = [
            {
                name: "Draw",
                tools: [
                    { key: "point", label: "Point", onClick: () => this.setActiveTool("point"), title: "Click on the View or on objects" },
                    { key: "line", label: "Line", onClick: () => this.setActiveTool("line"), title: "Select 2 points" },
                    { key: "segment", label: "Segment", onClick: () => this.setActiveTool("segment"), title: "Select 2 points" },
                    { key: "vector", label: "Vector", onClick: () => this.setActiveTool("vector"), title: "Select 2 points" },
                    { key: "polygon", label: "Polygon", onClick: () => this.setActiveTool("polygon"), title: "Select all vertices, then click on the first point again" },
                    { key: "circle", label: "Circle", onClick: () => this.setActiveTool("circle"), title: "Select a center, then enter its radius" },
                    { key: "ray", label: "Ray", onClick: () => this.setActiveTool("ray"), title: "Select 2 points" },
                    { key: "angle", label: "Angle", onClick: () => this.setActiveTool("angle"), title: "Select 2 lines or 3 points" }
                ]
            },
            {
                name: "Edit",
                tools: [
                    { key: "edit", label: "Move", onClick: () => this.setActiveTool("edit"), title: "Move the objects or View" },
                    { key: "delete", label: "Delete", onClick: () => this.setActiveTool("delete"), title: "Select the object to delete" }
                ]
            },
            {
                name: "Actions",
                tools: [
                    { key: "undo", label: "Undo", onClick: () => this.setActiveTool("undo"), title: "Undo the process" },
                    { key: "redo", label: "Redo", onClick: () => this.setActiveTool("redo"), title: "Redo the process" },
                    { key: "clear", label: "Clear", onClick: () => this.setActiveTool("clear"), title: "Clear the view" }
                ]
            }
        ];

        return (
            <div
                className="tool-panel"
                style={{
                    width: this.props.width,
                    height: this.props.height,
                    background: "#f0f0f0",
                    borderRight: "2px solid #ccc",
                    position: "relative",
                    padding: 8,
                    boxSizing: "border-box",
                    overflow: 'auto'
                }}
            >
            {toolCategories.map((category) => (
                <div key={category.name} style={{ marginBottom: 16 }}>
                    <div style={{ fontWeight: 550, marginBottom: 8, textAlign: "left", marginLeft: 8, fontSize: 14, fontFamily: 'sans-serif' }}>{category.name}</div>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: `repeat(auto-fill, minmax(60px, 1fr))`,
                            gap: 8
                        }}
                    >
                        {category.tools.map((tool) => (
                            <Button
                                key={tool.key}
                                label={tool.label}
                                title={tool.title}
                                onClick={tool.onClick}
                                selected={this.state.activeButton === tool.key}
                            />
                        ))}
                    </div>
                </div>
            ))}
            </div>
        )
    }
}
