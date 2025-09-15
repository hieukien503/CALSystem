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
            // serialize shape without Konva node
            type: node.type,
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

    Object.entries(data).forEach(([key, value]) => {
        const v = value as ShapeNode;

        let konvaNode: Konva.Shape | null = null;

        if (isPoint(v.type)) {
            konvaNode = new Konva.Circle({
                x: v.type.x,
                y: v.type.y,
                radius: 5,
                fill: v.type.props.color,
            });
        }

        else if (isLine(v.type)) {
            konvaNode = new Konva.Line({
                points: [v.type.startLine.x, v.type.startLine.y, v.type.endLine.x, v.type.endLine.y],
                stroke: v.type.props.color,
                strokeWidth: v.type.props.line_size,
            });
        }

        else if (isCircle(v.type)) {
            konvaNode = new Konva.Circle({
                x: v.type.centerC.x,
                y: v.type.centerC.y,
                radius: v.type.radius,
                stroke: v.type.props.color,
                strokeWidth: v.type.props.line_size,
            });
        }

        // TODO: add cases for Segment, Vector, Ray, Sphere, etc.

        dag.set(key, {
            ...v,
            node: konvaNode!,
        });
    });

    return dag;
}
