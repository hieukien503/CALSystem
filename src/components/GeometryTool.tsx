import React from "react";
import { Point } from "../types/geometry";

interface ButtonProps {
    label: string;
    onClick: () => void;
};

class Button extends React.Component<ButtonProps> {
    render(): React.ReactNode {
        return (
            <button className="m-2" onClick={this.props.onClick}>{this.props.label}</button>                 
        );
    }
}

interface GeometryToolProps {
    width: number;
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
        const tools = [
            {
                key: "point",
                label: "Create Point",
                onClick: () => this.setActiveTool("point")
            },
            {
                key: "line",
                label: "Create Line",
                onClick: () => this.setActiveTool("line")
            },
            {
                key: "segment",
                label: "Create Segment",
                onClick: () => this.setActiveTool("segment")
            },
            {
                key: "vector",
                label: "Create Vector",
                onClick: () => this.setActiveTool("vector")
            },
            {   
                key: "polygon", 
                label: "Create Polygon",
                onClick: () => this.setActiveTool("polygon")
            },
            {
                key: "circle",
                label: "Create Circle",
                onClick: () => this.setActiveTool("circle")
            },
            {
                key: "ray",
                label: "Create Ray",
                onClick: () => this.setActiveTool("ray")
            },
            {
                key: "edit",
                label: "Edit Shape",
                onClick: () => this.setActiveTool("edit")
            },
            {
                key: "delete",
                label: "Delete Shape",
                onClick: () => this.setActiveTool("delete")
            },
            {
                key: "clear",
                label: "Clear All",
                onClick: () => this.setActiveTool("clear")
            },
            {
                key: "undo",
                label: "Undo",
                onClick: () => this.setActiveTool("undo")
            },
            {
                key: "redo",
                label: "Redo",
                onClick: () => this.setActiveTool("redo")
            },
            {
                key: "angle",
                label: "Measure angle",
                onClick: () => this.setActiveTool("angle")
            }
        ]

        return (
            <div
                className="tool-panel"
                style={{
                    width: this.props.width,
                    height: "100vh",
                    background: "#f0f0f0",
                    borderRight: "2px solid #ccc",
                    position: "relative",
                    padding: 8,
                    boxSizing: "border-box",
                    overflow: 'auto'
                }}
                >
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: `repeat(auto-fill, minmax(60px, 1fr))`,
                        fontSize: "14px",
                        gap: 8
                    }}
                >
                {tools.map((tool) => (
                    <Button
                        key={tool.key}
                        label={tool.label}
                        onClick={tool.onClick}
                    />
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
        const tools = [
            {
                key: "point",
                label: "Create Point",
                onClick: () => this.setActiveTool("point")
            },
            {
                key: "line",
                label: "Create Line",
                onClick: () => this.setActiveTool("line")
            },
            {
                key: "segment",
                label: "Create Segment",
                onClick: () => this.setActiveTool("segment")
            },
            {
                key: "vector",
                label: "Create Vector",
                onClick: () => this.setActiveTool("vector")
            },
            {   
                key: "polygon", 
                label: "Create Polygon",
                onClick: () => this.setActiveTool("polygon")
            },
            {
                key: "circle",
                label: "Create Circle",
                onClick: () => this.setActiveTool("circle")
            },
            {
                key: "ray",
                label: "Create Ray",
                onClick: () => this.setActiveTool("ray")
            },
            {
                key: "cuboid",
                label: "Add Cuboid",
                onClick: () => this.setActiveTool("cuboid")
            },
            {
                key: "cone",
                label: "Add Cone",
                onClick: () => this.setActiveTool("cone")
            },
            {
                key: "prism",
                label: "Add Prism",
                onClick: () => this.setActiveTool("prism")
            },
            {
                key: "pyramid",
                label: "Add Pyramid",
                onClick: () => this.setActiveTool("pyramid")
            },
            {
                key: "sphere",
                label: "Add Sphere",
                onClick: () => this.setActiveTool("sphere")
            },
            {
                key: "plane",
                label: "Add Plane",
                onClick: () => this.setActiveTool("plane")
            },
            {
                key: "cylinder",
                label: "Add Cylinder",
                onClick: () => this.setActiveTool("cylinder")
            },
            {
                key: "edit",
                label: "Edit Shape",
                onClick: () => this.setActiveTool("edit")
            },
            {
                key: "delete",
                label: "Delete Shape",
                onClick: () => this.setActiveTool("delete")
            },
            {
                key: "clear",
                label: "Clear All",
                onClick: () => this.setActiveTool("clear")
            },
            {
                key: "undo",
                label: "Undo",
                onClick: () => this.setActiveTool("undo")
            },
            {
                key: "redo",
                label: "Redo",
                onClick: () => this.setActiveTool("redo")
            },
            {
                key: "angle",
                label: "Measure angle",
                onClick: () => this.setActiveTool("angle")
            }
        ]

        return (
            <div
                className="tool-panel"
                style={{
                    width: this.props.width,
                    height: "100vh",
                    background: "#f0f0f0",
                    borderRight: "2px solid #ccc",
                    position: "relative",
                    padding: 8,
                    boxSizing: "border-box",
                    overflow: 'auto'
                }}
                >
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: `repeat(auto-fill, minmax(60px, 1fr))`,
                        fontSize: "14px",
                        gap: 8
                    }}
                >
                {tools.map((tool) => (
                    <Button
                        key={tool.key}
                        label={tool.label}
                        onClick={tool.onClick}
                    />
                ))}
                </div>
            </div>
        )
    }
}
