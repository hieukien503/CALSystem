import React from "react";
import { Point, ShapeNode } from "../types/geometry";

interface ButtonProps {
    label: string;
    requiredPoints: number;
    selectedPoints: Point[];
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
    // shapes: Map<string, ShapeNode>;
    onPointClick: () => void;
    onLineClick: () => void;
    onSegmentClick: () => void;
    onVectorClick: () => void;
    onPolygonClick: () => void;
    onCircleClick: () => void;
    onRayClick: () => void;
}

interface GeometryToolState {
    selectedPointsMap: Record<string, Point[]>;
    activeButton: string | null;
}

class GeometryTool extends React.Component<GeometryToolProps, GeometryToolState> {
    constructor(props: GeometryToolProps) {
        super(props);
        this.state = {
            selectedPointsMap: {
                "point": [],
                "line": [],
                "segment": [],
                "vector": [],
                "polygon": [],
                "circle": [],
                "ray": []
            },
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
    }

    render(): React.ReactNode {
        const tools = [
            {
                key: "point",
                label: "Create Point",
                requiredPoints: 0,
                onClick: () => this.setActiveTool("point")
            },
            {
                key: "line",
                label: "Create Line",
                requiredPoints: 2,
                onClick: () => this.setActiveTool("line")
            },
            {
                key: "segment",
                label: "Create Segment",
                requiredPoints: 2,
                onClick: () => this.setActiveTool("segment")
            },
            {
                key: "vector",
                label: "Create Vector",
                requiredPoints: 2,
                onClick: () => this.setActiveTool("vector")
            },
            {   
                key: "polygon", 
                label: "Create Polygon",
                requiredPoints: 3,
                onClick: () => this.setActiveTool("polygon")
            },
            {
                key: "circle",
                label: "Create Circle",
                requiredPoints: 1,
                onClick: () => this.setActiveTool("circle")
            },
            {
                key: "ray",
                label: "Create Ray",
                requiredPoints: 2,
                onClick: () => this.setActiveTool("ray")
            }
        ]

        return (
            <div>
                {tools.map((tool) => (
                    <Button
                        key={tool.key}
                        label={tool.label}
                        requiredPoints={tool.requiredPoints}
                        selectedPoints={this.state.selectedPointsMap[tool.key]}
                        onClick={tool.onClick}
                    />
                ))}
            </div>
        )
    }
}

export default GeometryTool;
