// utils/serialize.ts
import Konva from "konva";
import { ShapeNode, Shape, Point, Line, Circle } from "../types/geometry";
export function serializeDAG(dag: Map<string, ShapeNode>) {
    const obj: Record<string, any> = {};
    dag.forEach((node, key) => {
        obj[key] = {
            id: node.id,
            defined: node.defined,
            dependsOn: node.dependsOn,
            isSelected: node.isSelected,
            scaleFactor: node.scaleFactor,
            rotationFactor: node.rotationFactor,
            side: node.side,
            // store type string instead of the object
            type: node.type,   // store full shape for reconstruction
        };
    });
    return obj;
}
function isPoint(shape: Shape): shape is Point {
    return shape.type === "Point";
}

function isLine(shape: Shape): shape is Line {
    return shape.type === "Line";
}

function isCircle(shape: Shape): shape is Circle {
    return shape.type === "Circle";
}
export function deserializeDAG(data: Record<string, any>): Map<string, ShapeNode> {
    const dag = new Map<string, ShapeNode>();

    // 🔥 handle wrapped array
    const obj = Array.isArray(data) ? data[0] : data;

    Object.entries(obj).forEach(([key, value]) => {
        console.log("Rendering key: ", key);

        const v = value as any;

        console.log("v.type: ", v.type);

        let konvaNode: Konva.Shape | null = null;

        if (v.type.type === "Point") {
            console.log("Rendering point");
            const point = v.type as Point;
            konvaNode = new Konva.Circle({
                x: point.x,
                y: point.y,
                z: point.z,
                radius: 5,
                fill: point.props.color || "black",
            });
        } else if (v.type.type === "Line") {
            const line = v.type as Line;
            konvaNode = new Konva.Line({
                points: [line.startLine.x, line.startLine.y, line.endLine.x, line.endLine.y],
                stroke: line.props.color || "black",
                strokeWidth: line.props.line_size || 1,
            });
        } else if (v.type.type === "Circle") {
            const circle = v.type as Circle;
            konvaNode = new Konva.Circle({
                x: circle.centerC.x,
                y: circle.centerC.y,
                radius: circle.radius,
                //stroke: circle.props.color,
                //strokeWidth: circle.props.line_size,
            });
        }

        dag.set(key, {
            ...v,
            node: konvaNode!,
        });
    });

    return dag;
}
