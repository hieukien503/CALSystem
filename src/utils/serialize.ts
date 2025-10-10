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

export function deserializeDAG(data: Record<string, any>): Map<string, ShapeNode> {
    const dag = new Map<string, ShapeNode>();
    // 🔥 handle wrapped array
    const obj = Array.isArray(data) ? data[0] : data;

    Object.entries(obj).forEach(([key, value]) => {
        const v = value as any;
        dag.set(key, {
            ...v
        });
    });

    return dag;
}
