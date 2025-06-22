import Konva from "konva";
import _ from 'lodash';
import { LineStyle } from "../types/geometry";
import { FONT_DEFAULTS, EPSILON } from "../types/constants";
import { GeometryState, Shape, Point, ShapeNode, Polygon } from "../types/geometry";
import * as constants from '../types/constants'
const math = require('mathjs');

// Utility functions
export const convert2RGB = _.memoize((color: string): [number, number, number] => {
    const rgb = Konva.Util.getRGB(color)
    if (rgb) {
        return [rgb.r, rgb.g, rgb.b]
    }
    throw new Error('Invalid color format');
});

export const createDashArray = _.memoize((lineStyle: LineStyle): number[] => {
    const [dash, gap, offset] = [lineStyle.dash_size, lineStyle.gap_size, lineStyle.dot_size];
    return [offset ?? 0, gap, dash, gap];
});

export const createLabelProps = (
    x: number,
    y: number,
    label: string,
    labelXOffset: number,
    labelYOffset: number,
    visible: boolean,
    currentMathScale: number,
    mathLayerPos: {x: number, y: number}
) => {
    let x_stage = x * currentMathScale + mathLayerPos.x;
    let y_stage = y * currentMathScale + mathLayerPos.y;
    return {
        x: x_stage + labelXOffset, // labelXOffset is now directly in pixels
        y: y_stage + labelYOffset, // labelYOffset is now directly in pixels
        text: label,
        fontSize: FONT_DEFAULTS.SIZE, // Fixed font size, as layerUnchangeVisualRef is no longer scaled
        fontFamily: FONT_DEFAULTS.FAMILY,
        fill: FONT_DEFAULTS.COLOR,
        visible: visible,
        draggable: true
    }
}

export const createPointDefaultShapeProps = _.memoize((label: string, radius: number = 0.05, labelXOffset: number = 0, labelYOffset: number = 0, labelZOffset: number = 0): Shape['props'] => {
    return {
        label: label,
        labelXOffset: labelXOffset,
        labelYOffset: labelYOffset,
        labelZOffset: labelZOffset,
        line_size: 1,
        line_style: {dash_size: 0, gap_size: 0, dot_size: 0},
        radius: radius,
        color: 'black',
        visible: {shape: true, label: true},
        fill: true,
        id: `point-${label}`
    }
});

export const createLineDefaultShapeProps = _.memoize((label: string, radius: number = 0, labelXOffset: number = 0, labelYOffset: number = 0, labelZOffset: number = 0): Shape['props'] => {
    return {
        line_size: 1,
        line_style: {dash_size: 0, gap_size: 0, dot_size: 0},
        radius: radius,
        label: label,
        visible: {shape: true, label: false},
        fill: true,
        color: 'black',
        labelXOffset: labelXOffset,
        labelYOffset: labelYOffset,
        labelZOffset: labelZOffset,
        id: `line-${label}`
    }
})

export const createCircleDefaultShapeProps = _.memoize((label: string, radius: number, labelXOffset: number = 0, labelYOffset: number = 0, labelZOffset: number = 0): Shape['props'] => {
    return {
        label: label,
        labelXOffset: labelXOffset,
        labelYOffset: labelYOffset,
        labelZOffset: labelZOffset,
        line_size: 1,
        line_style: {dash_size: 0, gap_size: 0, dot_size: 0},
        radius: radius,
        color: 'black',
        visible: {shape: true, label: false},
        fill: true,
        id: `circle-${label}`
    }
})

export const createPolygonDefaultShapeProps = _.memoize((label: string, radius: number = 0, labelXOffset: number = 0, labelYOffset: number = 0, labelZOffset: number = 0): Shape['props'] => {
    return {
        label: label,
        labelXOffset: 0,
        labelYOffset: 10,
        labelZOffset: 0,
        line_size: 1,
        line_style: {dash_size: 0, gap_size: 0, dot_size: 0},
        radius: 0,  
        visible: {shape: true, label: false},
        color: 'red',
        fill: true,
        id: `polygon-${label}`,
        opacity: 0.1
    }
})

export const createAngleDefaultShapeProps = _.memoize((label: string, radius: number = 0, labelXOffset: number = 0, labelYOffset: number = 0, labelZOffset: number = 0): Shape['props'] => {
    return {
        label: label,
        labelXOffset: 0,
        labelYOffset: 10,
        labelZOffset: 0,
        line_size: 1,
        line_style: {dash_size: 0, gap_size: 0, dot_size: 0},
        radius: 0,  
        visible: {shape: true, label: false},
        color: 'green',
        fill: true,
        id: `angle-${label}`,
        opacity: 0.1
    }
})

export const snapToGrid = _.memoize((
    pointer: {x: number, y: number},
    gridSpace: number,
    split: number,
    originX: number,
    originY: number,
    layer: Konva.Layer
) => 
{
    const scaledGridSize = gridSpace * split;

    const snap = (value: number, origin: number): number => {
        return Math.round((value - origin) / scaledGridSize) * scaledGridSize + origin;
    };

    const pos = {
        x: (pointer.x - layer.x()) / layer.scaleX(),
        y: (pointer.y - layer.y()) / layer.scaleY()
    };

    const snapped = {
        x: snap(pos.x, originX),
        y: snap(pos.y, originY)
    };

    // 4. Convert snapped position to screen (pixel) coordinates
    const snappedScreen = {
        x: snapped.x * layer.scaleX() + layer.x(),
        y: snapped.y * layer.scaleY() + layer.y()
    };

    // 5. Compute pixel distance to decide snap
    const dx = pointer.x - snappedScreen.x;
    const dy = pointer.y - snappedScreen.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    let finalMathPos;
    if (distance <= 5) {
        // Snap to intersection
        finalMathPos = snapped;
    }
    
    else {
        // Use original pointer position
        finalMathPos = pos;
    }

    return finalMathPos;
});

export const clone = (
    state: GeometryState,
    dag: Map<string, ShapeNode>,
    selectedPoints: Point[],
    selectedShapes: Shape[],
    label_used: string[]
) => {
    const copyState = structuredClone(state);
    const copySelectedPoints = structuredClone(selectedPoints);
    const copySelectedShapes = structuredClone(selectedShapes);
    const copyLabelUsed = Array.from(label_used);
    const copyDAG = new Map<string, ShapeNode>();
    dag.forEach((node, key) => {
        copyDAG.set(key, {
            id: key,
            type: node.type,
            scaleFactor: node.scaleFactor,
            rotationFactor: structuredClone(node.rotationFactor),
            dependsOn: Array.from(node.dependsOn),
            node: node.node.clone(),
            defined: node.defined,
            ambiguous: node.ambiguous,
            isSelected: node.isSelected
        })
    })

    return {
        state: copyState,
        dag: copyDAG,
        selectedPoints: copySelectedPoints,
        selectedShapes: copySelectedShapes,
        label_used: copyLabelUsed
    }
}

export const cleanAngle = (angle: number): number => {
    const nearestAngle = Math.round(angle);
    return Math.abs(nearestAngle - angle) < EPSILON ? nearestAngle : angle;
}

export const projectPointOntoLineSegment = (
    p: { x: number; y: number },
    a: { x: number; y: number },
    b: { x: number; y: number }
): number => {
    const ap = { x: p.x - a.x, y: p.y - a.y };
    const ab = { x: b.x - a.x, y: b.y - a.y };
    const abLengthSq = ab.x * ab.x + ab.y * ab.y;

    // Dot product of ap and ab
    let t = (ap.x * ab.x + ap.y * ab.y) / abLengthSq;
    // Clamp t to [0, 1] to stay within segment bounds
    t = Math.max(0, Math.min(1, t));
    return t;
};

export const snapToShape = (
    dag: Map<string, ShapeNode>,
    shape: Konva.Shape | undefined,
    pos: {x: number, y: number},
    layerMath: Konva.Layer,
    isSnapToGrid: boolean,
    stage: Konva.Stage,
    axisTickInterval: number
): {
    position: {
        x: number,
        y: number
    },
    rotFactor?: {
        degree: number,
        CCW: boolean
    },
    scaleFactor?: number
} => {
    let position = pos;
    let rotFactor: {
        degree: number,
        CCW: boolean
    } | undefined = undefined;
    let scaleFactor: number | undefined = undefined;
    if (!shape) {
        return {
            position: position,
            rotFactor: rotFactor,
            scaleFactor: scaleFactor
        };
    }

    else {
        let shapeNode = dag.get(shape.id());
        if (shapeNode) {
            if (shapeNode.type.type === 'Circle') {
                const cx = shapeNode.node.x();
                const cy = shapeNode.node.y();
                const r = (shapeNode.node as Konva.Circle).radius();
                const dx = pos.x - cx;
                const dy = pos.y - cy;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist === 0) {
                    position = {
                        x: cx,
                        y: cy
                    };

                    rotFactor = {
                        degree: 0,
                        CCW: true
                    };
                }

                else {
                    const angleFromXAxis = (v: {x: number, y: number}) => {
                        return (math.parse('atan2(y, x)').evaluate({x: v.x, y: v.y})) * 180 / Math.PI;
                    }

                    position = {
                        x: cx + (dx / dist) * r,
                        y: cy + (dy / dist) * r,
                    };

                    rotFactor = {
                        degree: cleanAngle(angleFromXAxis({x: dx, y: dy})),
                        CCW: true 
                    }
                }
            }

            else if (['Segment', 'Line', 'Ray', 'Vector'].includes(shapeNode.type.type)) {
                let l = shapeNode.type.type === 'Vector' ? (shapeNode as ShapeNode).node as Konva.Arrow :
                                                            (shapeNode as ShapeNode).node as Konva.Line;

                let start = {
                    x: l.points()[0],
                    y: l.points()[1]
                }

                let end = {
                    x: l.points()[2],
                    y: l.points()[3]
                }

                scaleFactor = projectPointOntoLineSegment (
                    pos, 
                    start,
                    end
                );

                position = {
                    x: start.x + (end.x - start.x) * scaleFactor,
                    y: start.y + (end.y - start.y) * scaleFactor
                };
            }

            else if (shapeNode.type.type === 'Polygon') {
                // Polygon
                // Only restricts in its segments
                let segmentDepends = shapeNode.dependsOn.slice((shapeNode.type as Polygon).points.length);
                for (let i = 0; i < segmentDepends.length; i++) {
                    let s = dag.get(segmentDepends[i]);
                    if (!s) continue;
                    if (!s.node.intersects(pos)) continue;
                    let start = {
                        x: (s.node as Konva.Line).points()[0],
                        y: (s.node as Konva.Line).points()[1]
                    }

                    let end = {
                        x: (s.node as Konva.Line).points()[2],
                        y: (s.node as Konva.Line).points()[3]
                    }

                    scaleFactor = projectPointOntoLineSegment (
                        pos, 
                        start,
                        end
                    );

                    position = {
                        x: start.x + (end.x - start.x) * scaleFactor,
                        y: start.y + (end.y - start.y) * scaleFactor
                    };

                    break;
                }
            }
        }

        else {
            let start = {
                x: (shape as Konva.Arrow).points()[0],
                y: (shape as Konva.Arrow).points()[1]
            }

            let end = {
                x: (shape as Konva.Arrow).points()[2],
                y: (shape as Konva.Arrow).points()[3]
            }

            scaleFactor = projectPointOntoLineSegment (
                pos, 
                start,
                end
            );

            position = {
                x: start.x + (end.x - start.x) * scaleFactor,
                y: start.y + (end.y - start.y) * scaleFactor
            };
        }
    }

    let positionMath = layerMath.getAbsoluteTransform().copy().point(position);
    let tmpPos = isSnapToGrid ? snapToGrid(
        positionMath,
        constants.BASE_SPACING,
        axisTickInterval,
        stage.width() / 2,
        stage.height() / 2,
        layerMath
    ) : position

    let tmpStagePos = layerMath.getAbsoluteTransform().copy().point(tmpPos);
    const nodes = stage.getAllIntersections(tmpStagePos);
    const tmpShape = nodes.find((node) =>
        node.getLayer() === layerMath
    );
    
    if (tmpShape && (tmpShape?.id() === shape.id() || (['x-axis', 'y-axis'].includes(tmpShape?.id()) && (['x-axis', 'y-axis'].includes(shape.id()))))) {
        position = tmpPos;
    }

    return {
        position: position,
        rotFactor: rotFactor,
        scaleFactor: scaleFactor
    }
}

export const getExcelLabel = (start: string, index: number): string => {
    const baseChar = start[0].toUpperCase();
    const startIndex = baseChar.charCodeAt(0) - 'A'.charCodeAt(0);

    const totalIndex = startIndex + index;

    let result = '';
    let n = totalIndex;
    while (n >= 0) {
        result = String.fromCharCode((n % 26) + 'A'.charCodeAt(0)) + result;
        n = Math.floor(n / 26) - 1;
    }

    return start === start.toUpperCase() ? result : result.toLowerCase();
}

export const getAngleLabel = (index: number): string => {
    const greek = [
        'α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ',
        'ι', 'κ', 'λ', 'μ', 'ν', 'ξ', 'ο', 'π',
        'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω'
    ];
    const subscripts = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];

    const base = greek[index % greek.length];
    const cycle = Math.floor(index / greek.length);
    if (cycle === 0) return base;

    const sub = String(cycle).split('').map(d => subscripts[+d]).join('');
    return base + sub;
}

export const cloneDAG = (dag: Map<string, ShapeNode>): Map<string, ShapeNode> => {
    const copyDAG = new Map<string, ShapeNode>();
    dag.forEach((node, key) => {
        copyDAG.set(key, {
            id: key,
            type: node.type,
            scaleFactor: node.scaleFactor,
            rotationFactor: structuredClone(node.rotationFactor),
            dependsOn: Array.from(node.dependsOn),
            node: node.node,
            defined: node.defined,
            ambiguous: node.ambiguous,
            isSelected: node.isSelected
        })
    })

    return copyDAG;
}