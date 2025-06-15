import { title } from "process";
import React from "react";

interface ButtonProps {
    label: string;
    title: string;
    onClick: () => void;
};

class Button extends React.Component<ButtonProps> {
    render(): React.ReactNode {
        return (
            <button className="m-2" onClick={this.props.onClick} onMouseEnter={(e) => {
                e.currentTarget.style.fontWeight = "500";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.fontWeight = "normal";
            }} style={{fontSize: 12, fontFamily: 'sans-serif'}} title={this.props.title}>
                {this.props.label}
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
    onCircleClick: () => void;
    onRayClick: () => void;
    onEditClick: () => void;
    onDeleteClick: () => void;
    onClearClick: () => void;
    onUndoClick: () => void;
    onRedoClick: () => void;
    onAngleClick: () => void;
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
            this.props.onCircleClick();
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
                    { key: "ray", label: "Ray", onClick: () => this.setActiveTool("ray"), title: "Select 2 points" }
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
            },
            {
                name: "Measurement",
                tools: [
                    { key: "angle", label: "Angle", onClick: () => this.setActiveTool("angle"), title: "Select 2 lines or 3 points" }
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
                    boxSizing: "border-box"
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
                            />
                        ))}
                    </div>
                </div>
            ))}
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
            this.props.onCircleClick();
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
                            />
                        ))}
                    </div>
                </div>
            ))}
            </div>
        )
    }
}
