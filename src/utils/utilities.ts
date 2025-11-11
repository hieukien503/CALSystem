import Konva from "konva";
import { LineStyle, SemiCircle } from "../types/geometry";
import { FONT_DEFAULTS, EPSILON } from "../types/constants";
import { GeometryState, Shape, Point, ShapeNode, Polygon, ShapeType, Segment, Circle, Line, Ray, Vector } from "../types/geometry";
import * as constants from '../types/constants'
import { v4 as uuidv4 } from 'uuid';
import * as Factory from './Factory';
const math = require('mathjs');

// Utility functions
export const convert2RGB = (color: string): [number, number, number] => {
    const rgb = Konva.Util.getRGB(color)
    if (rgb) {
        return [rgb.r, rgb.g, rgb.b]
    }
    throw new Error('Invalid color format');
};

export const createDashArray = (lineStyle: LineStyle): number[] => {
    const [dash, gap, offset] = [lineStyle.dash_size, lineStyle.gap_size, lineStyle.dot_size];
    return [offset ?? 0, gap, dash, gap];
};

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

export const createPointDefaultShapeProps = (label: string, radius: number = 0.05, labelXOffset: number = 0, labelYOffset: number = 0, labelZOffset: number = 0): Shape['props'] => {
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
        id: `point-${uuidv4()}`
    }
};

export const createLineDefaultShapeProps = (label: string, radius: number = 0, labelXOffset: number = 0, labelYOffset: number = 0, labelZOffset: number = 0): Shape['props'] => {
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
        id: `line-${uuidv4()}`
    }
};

export const createVectorDefaultShapeProps = (label: string, radius: number = 0, labelXOffset: number = 0, labelYOffset: number = 0, labelZOffset: number = 0): Shape['props'] => {
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
        id: `vector-${uuidv4()}`
    }
};

export const createCircleDefaultShapeProps = (label: string, radius: number, labelXOffset: number = 0, labelYOffset: number = 0, labelZOffset: number = 0): Shape['props'] => {
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
        id: `circle-${uuidv4()}`
    }
}

export const createSphereDefaultShapeProps = (label: string, radius: number, labelXOffset: number = 0, labelYOffset: number = 0, labelZOffset: number = 0): Shape['props'] => {
    return {
        label: label,
        labelXOffset: labelXOffset,
        labelYOffset: labelYOffset,
        labelZOffset: labelZOffset,
        line_size: 1,
        line_style: {dash_size: 0, gap_size: 0, dot_size: 0},
        radius: radius,
        color: 'red',
        visible: {shape: true, label: false},
        fill: true,
        id: `sphere-${uuidv4()}`
    }
};

export const createSemiCircleDefaultShapeProps = (label: string, radius: number, labelXOffset: number = 0, labelYOffset: number = 0, labelZOffset: number = 0): Shape['props'] => {
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
        id: `semi-${uuidv4()}`
    }
};

export const createPolygonDefaultShapeProps = (label: string, radius: number = 0, labelXOffset: number = 0, labelYOffset: number = 0, labelZOffset: number = 0): Shape['props'] => {
    return {
        label: label,
        labelXOffset: labelXOffset,
        labelYOffset: labelYOffset,
        labelZOffset: labelZOffset,
        line_size: 1,
        line_style: {dash_size: 0, gap_size: 0, dot_size: 0},
        radius: 0,  
        visible: {shape: true, label: false},
        color: 'red',
        fill: true,
        id: `polygon-${uuidv4()}`,
        opacity: 0.1
    }
};

export const createAngleDefaultShapeProps = (label: string, radius: number = 0, labelXOffset: number = 0, labelYOffset: number = 0, labelZOffset: number = 0): Shape['props'] => {
    return {
        label: label,
        labelXOffset: labelXOffset,
        labelYOffset: labelYOffset,
        labelZOffset: labelZOffset,
        line_size: 1,
        line_style: {dash_size: 0, gap_size: 0, dot_size: 0},
        radius: 0,  
        visible: {shape: true, label: false},
        color: 'green',
        fill: true,
        id: `angle-${uuidv4()}`,
        opacity: 0.1
    }
};

export const createPlaneDefaultShapeProps = (label: string, radius: number = 0, labelXOffset: number = 0, labelYOffset: number = 0, labelZOffset: number = 0): Shape['props'] => {
    return {
        label: label,
        labelXOffset: labelXOffset,
        labelYOffset: labelYOffset,
        labelZOffset: labelZOffset,
        line_size: 0,
        line_style: {dash_size: 0, gap_size: 0, dot_size: 0},
        radius: radius,  
        visible: {shape: true, label: false},
        color: 'blue', // Light blue color for plane
        fill: true,
        id: `plane-${uuidv4()}`,
        opacity: 0.3
    }
};

export const createCylinderDefaultShapeProps = (label: string, radius: number, labelXOffset: number = 0, labelYOffset: number = 0, labelZOffset: number = 0): Shape['props'] => {
    return {
        label: label,
        labelXOffset: labelXOffset,
        labelYOffset: labelYOffset,
        labelZOffset: labelZOffset,
        line_size: 0,
        line_style: {dash_size: 0, gap_size: 0, dot_size: 0},
        radius: radius,  
        visible: {shape: true, label: false},
        color: '#FF7276', // Light red color for cylinder
        fill: true,
        id: `cylinder-${uuidv4()}`,
        opacity: 0.5
    }
};

export const snapToGrid = (
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
};

export const clone = (
    state: GeometryState,
    dag: Map<string, ShapeNode>,
    selectedPoints: Point[],
    selectedShapes: Shape[],
    label_used: string[],
    cloneType: boolean = false
) => {
    const copyState = structuredClone(state);
    const copySelectedPoints = structuredClone(selectedPoints);
    const copySelectedShapes = structuredClone(selectedShapes);
    const copyLabelUsed = Array.from(label_used);
    const copyDAG = cloneDAG(dag, cloneType);
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
            position: isSnapToGrid ? snapToGrid(
                position,
                constants.BASE_SPACING,
                axisTickInterval,
                stage.width() / 2,
                stage.height() / 2,
                layerMath
            ) : position,
            rotFactor: rotFactor,
            scaleFactor: scaleFactor
        };
    }

    else {
        let shapeNode = dag.get(shape.id());
        if (shapeNode) {
            if ('centerC' in shapeNode.type && 'radius' in shapeNode.type) {
                const cx = shapeNode.node!.x();
                const cy = shapeNode.node!.y();
                const r = (shapeNode.node! as Konva.Circle).radius();
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

            else if (('startSegment' in shapeNode.type) || ('startRay' in shapeNode.type) || ('startLine' in shapeNode.type) ||  ('startVector' in shapeNode.type)) {
                let l = ('startVector' in shapeNode.type) ? (shapeNode as ShapeNode).node as Konva.Arrow :
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

            else if ('points' in shapeNode.type) {
                // Polygon
                // Only restricts in its segments
                let segmentDepends = shapeNode.dependsOn.slice((shapeNode.type as Polygon).points.length);
                for (let i = 0; i < segmentDepends.length; i++) {
                    let s = dag.get(segmentDepends[i]);
                    if (!s) continue;
                    if (!s.node!.intersects(pos)) continue;
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

export const cloneDAG = (dag: Map<string, ShapeNode>, cloneType: boolean = false): Map<string, ShapeNode> => {
    const copyDAG = new Map<string, ShapeNode>();
    dag.forEach((node, key) => {
        copyDAG.set(key, {
            id: key,
            type: cloneType === true ? structuredClone(node.type) : node.type,
            scaleFactor: node.scaleFactor,
            rotationFactor: structuredClone(node.rotationFactor),
            dependsOn: Array.from(node.dependsOn),
            node: node.node,
            defined: node.defined,
            isSelected: node.isSelected,
            side: node.side
        })
    });

    return copyDAG;
}

export const incrementLabel = (label: string): string => {
    const match = label.match(/^([A-Za-z])([₀₁₂₃₄₅₆₇₈₉]*)$/);
    if (!match) return label;  // or throw error

    const toNormal = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
    const toSub = ['₀','₁','₂','₃','₄','₅','₆','₇','₈','₉'];
    const [_, base, sub] = match;
    const normalDigits = sub.split('').map(c => toNormal[c as keyof typeof toNormal] ?? '').join('');
    const nextIndex = (normalDigits === '' ? 1 : parseInt(normalDigits) + 1);
    const newSub = nextIndex.toString().split('').map(d => toSub[parseInt(d)]).join('');
    return base + newSub;
}

export const convertToCustomCoords = (
    pos: {x: number, y: number}, origin: {x: number, y: number}, gridSpace: number
) => {
    const screenX = pos.x;
    const screenY = pos.y;

    const gridSpacing = gridSpace;

    const cx = (screenX - origin.x) / gridSpacing;
    const cy = (origin.y - screenY) / gridSpacing;

    return { x: cx, y: cy };
}

export const convertToScreenCoords = (
    pos: {x: number, y: number}, origin: {x: number, y: number}, gridSpace: number
) => {
    const gridSpacing = gridSpace;

    const screenX = origin.x + pos.x * gridSpacing;
    const screenY = origin.y - pos.y * gridSpacing;

    const cx = screenX;
    const cy = screenY;

    return { x: cx, y: cy };
}

export const updateShapeAfterTransform = (
    shape: Shape,
    transformedShape: Shape,
    labelUsed: string[],
    dag: Map<string, ShapeNode>,
    mode: string,
    data: {
        rotation: {
            degree: number,
            CCW: boolean
        } | undefined;
        scale_factor: number | undefined;
    },
    transformObject: Shape | undefined
): void => {
    const getNewLabel = (oldLabel: string) => {
        let label = incrementLabel(oldLabel);
        while (labelUsed.includes(label)) {
            label = incrementLabel(label);
        }

        return label;
    }

    const shapeType: ShapeType = (mode === 'rotation' ? 'Rotation' : 
                    (mode === 'enlarge' ? 'Enlarge' : (mode === 'translation' ? 'Translation' : 'Reflection')));

    if ('points' in transformedShape) {
        let idx = 0;
        let label = `poly${idx}`;
        while (labelUsed.includes(label)) {
            idx += 1;
            label = `poly${idx}`;
        }

        labelUsed.push(label);
        transformedShape.props.label = label;
        transformedShape.props.id = `polygon-${label}`;
        const points = (transformedShape as Polygon).points;
        for(let i = 0; i < points.length; i++) {
            updateShapeAfterTransform(
                (shape as Polygon).points[i],
                points[i],
                labelUsed,
                dag,
                mode,
                data,
                transformObject
            );
        };

        for (let i = 0; i < points.length; i++) {
            const pNext = points[(i + 1) % points.length];
            const oldSegment = Array.from(dag.entries()).find((value: [string, ShapeNode]) => {
                return 'startSegment' in value[1].type && 
                (
                    (value[1].type.endSegment.props.id === (shape as Polygon).points[i].props.id && (value[1].type.startSegment.props.id === (shape as Polygon).points[(i + 1) % points.length].props.id)) ||
                    (value[1].type.startSegment.props.id === (shape as Polygon).points[i].props.id && (value[1].type.endSegment.props.id === (shape as Polygon).points[(i + 1) % points.length].props.id))
                )
            });

            label = `segment0`;
            let index = 0;
            while (labelUsed.includes(label)) {
                index++;
                label = `segment${index}`;
            }

            labelUsed.push(label);
            const segment = Factory.createSegment(
                structuredClone(oldSegment![1].type.props),
                points[i],
                pNext
            );

            segment.props.label = label;
            segment.props.id = `line-${label}`
            let anotherShapeNode: ShapeNode = {
                id: segment.props.id,
                defined: true,
                isSelected: false,
                dependsOn: [oldSegment![1].id, transformObject!.props.id, points[i].props.id, pNext.props.id, transformedShape.props.id],
                type: segment,
                node: undefined,
                rotationFactor: mode === 'rotation' ? {
                    degree: (data.rotation ? data.rotation.degree : 0),
                    CCW: (data.rotation ? data.rotation.CCW : true)
                } : undefined,
                scaleFactor: data.scale_factor ? data.scale_factor : undefined
            };

            segment.type = shapeType;
            dag.set(segment.props.id, anotherShapeNode);
        }

        let shapeNode = {
            id: transformedShape.props.id,
            type: transformedShape,
            node: undefined,
            dependsOn: [shape.props.id, transformObject!.props.id],
            defined: true,
            isSelected: false,
            rotationFactor: mode === 'rotation' ? {
                degree: (data.rotation ? data.rotation.degree : 0),
                CCW: (data.rotation ? data.rotation.CCW : true)
            } : undefined,
            scaleFactor: data.scale_factor ? data.scale_factor : undefined
        };

        dag.set(transformedShape.props.id, shapeNode);
    }

    else if (!('x' in transformedShape && 'y' in transformedShape)) {
        if ('startSegment' in shape) {
            const [start, end] = [(shape as Segment).startSegment, (shape as Segment).endSegment];
            updateShapeAfterTransform(
                start, (transformedShape as Segment).startSegment, labelUsed, dag, mode, data, transformObject
            );
            updateShapeAfterTransform(
                end, (transformedShape as Segment).endSegment, labelUsed, dag, mode, data, transformObject
            );
            // (transformedShape as Segment).startSegment.props.label = getNewLabel(start.props.label);
            // (transformedShape as Segment).startSegment.props.id = `point-${uuidv4()}`
            // labelUsed.push((transformedShape as Segment).startSegment.props.label);
            // (transformedShape as Segment).endSegment.props.label = getNewLabel(end.props.label);
            // (transformedShape as Segment).endSegment.props.id = `point-${uuidv4()}`
            // labelUsed.push((transformedShape as Segment).endSegment.props.label);
            let segment_label = `segment0`;
            let index = 0;
            while (labelUsed.includes(segment_label)) {
                index++;
                segment_label = `segment${index}`;
            }

            labelUsed.push(segment_label);
            transformedShape.props.label = segment_label;
            transformedShape.props.id = `line-${segment_label}`;

            let anotherShapeNode = {
                id: transformedShape.props.id,
                defined: true,
                isSelected: false,
                dependsOn: [shape.props.id, transformObject!.props.id, (transformedShape as Segment).startSegment.props.id, (transformedShape as Segment).endSegment.props.id],
                type: transformedShape,
                node: undefined,
                rotationFactor: mode === 'rotation' ? {
                    degree: (data.rotation ? data.rotation.degree : 0),
                    CCW: (data.rotation ? data.rotation.CCW : true)
                } : undefined,
                scaleFactor: data.scale_factor ? data.scale_factor : undefined
            };

            transformedShape.type = shapeType;
            // shapeNode1.type.type = shapeType;
            // shapeNode2.type.type = shapeType;
            // dag.set(shapeNode1.id, shapeNode1);
            // dag.set(shapeNode2.id, shapeNode2);
            dag.set(transformedShape.props.id, anotherShapeNode);
        }

        else if ('startLine' in shape) {
            const [start, end] = [(shape as Line).startLine, (shape as Line).endLine];
            updateShapeAfterTransform(
                start, (transformedShape as Line).startLine, labelUsed, dag, mode, data, transformObject
            );
            updateShapeAfterTransform(
                end, (transformedShape as Line).endLine, labelUsed, dag, mode, data, transformObject
            );
            // (transformedShape as Line).startLine.props.label = getNewLabel(start.props.label);
            // (transformedShape as Line).startLine.props.id = `point-${uuidv4()}`
            // labelUsed.push((transformedShape as Line).startLine.props.label);
            // (transformedShape as Line).endLine.props.label = getNewLabel(end.props.label);
            // (transformedShape as Line).endLine.props.id = `point-${uuidv4()}`
            // labelUsed.push((transformedShape as Line).endLine.props.label);
            let line_label = `line0`;
            let index = 0;
            while (labelUsed.includes(line_label)) {
                index++;
                line_label = `line${index}`;
            }

            labelUsed.push(line_label);
            transformedShape.props.label = line_label;
            transformedShape.props.id = `line-${line_label}`;

            // let shapeNode1: ShapeNode = {
            //     id: (transformedShape as Line).startLine.props.id,
            //     defined: true,
            //     isSelected: false,
            //     dependsOn: [start.props.id, transformObject!.props.id],
            //     type: (transformedShape as Line).startLine,
            //     node: undefined,
            //     rotationFactor: mode === 'rotation' ? {
            //         degree: (data.rotation ? data.rotation.degree : 0),
            //         CCW: (data.rotation ? data.rotation.CCW : true)
            //     } : undefined,
            //     scaleFactor: data.scale_factor ? data.scale_factor : undefined
            // }

            // let shapeNode2: ShapeNode = {
            //     id: (transformedShape as Line).endLine.props.id,
            //     defined: true,
            //     isSelected: false,
            //     dependsOn: [end.props.id, transformObject!.props.id],
            //     type: (transformedShape as Line).endLine,
            //     node: undefined,
            //     rotationFactor: mode === 'rotation' ? {
            //         degree: (data.rotation ? data.rotation.degree : 0),
            //         CCW: (data.rotation ? data.rotation.CCW : true)
            //     } : undefined,
            //     scaleFactor: data.scale_factor ? data.scale_factor : undefined
            // }

            let anotherShapeNode = {
                id: transformedShape.props.id,
                defined: true,
                isSelected: false,
                dependsOn: [shape.props.id, transformObject!.props.id, (transformedShape as Line).startLine.props.id, (transformedShape as Line).endLine.props.id],
                type: transformedShape,
                node: undefined,
                rotationFactor: mode === 'rotation' ? {
                    degree: (data.rotation ? data.rotation.degree : 0),
                    CCW: (data.rotation ? data.rotation.CCW : true)
                } : undefined,
                scaleFactor: data.scale_factor ? data.scale_factor : undefined
            };

            transformedShape.type = shapeType;
            // shapeNode1.type.type = shapeType;
            // shapeNode2.type.type = shapeType;
            // dag.set(shapeNode1.id, shapeNode1);
            // dag.set(shapeNode2.id, shapeNode2);
            dag.set(transformedShape.props.id, anotherShapeNode);
        }

        else if ('startRay' in shape) {
            const [start, end] = [(shape as Ray).startRay, (shape as Ray).endRay];
            updateShapeAfterTransform(
                start, (transformedShape as Ray).startRay, labelUsed, dag, mode, data, transformObject
            );
            updateShapeAfterTransform(
                end, (transformedShape as Ray).endRay, labelUsed, dag, mode, data, transformObject
            );
            // (transformedShape as Ray).startRay.props.label = getNewLabel(start.props.label);
            // (transformedShape as Ray).startRay.props.id = `point-${uuidv4()}`
            // labelUsed.push((transformedShape as Ray).startRay.props.label);
            // (transformedShape as Ray).endRay.props.label = getNewLabel(end.props.label);
            // (transformedShape as Ray).endRay.props.id = `point-${uuidv4()}`
            // labelUsed.push((transformedShape as Ray).endRay.props.label);
            let ray_label = `ray0`;
            let index = 0;
            while (labelUsed.includes(ray_label)) {
                index++;
                ray_label = `ray${index}`;
            }

            labelUsed.push(ray_label);
            transformedShape.props.label = ray_label;
            transformedShape.props.id = `line-${ray_label}`;

            // let shapeNode1: ShapeNode = {
            //     id: (transformedShape as Ray).startRay.props.id,
            //     defined: true,
            //     isSelected: false,
            //     dependsOn: [start.props.id, transformObject!.props.id],
            //     type: (transformedShape as Ray).startRay,
            //     node: undefined,
            //     rotationFactor: mode === 'rotation' ? {
            //         degree: (data.rotation ? data.rotation.degree : 0),
            //         CCW: (data.rotation ? data.rotation.CCW : true)
            //     } : undefined,
            //     scaleFactor: data.scale_factor ? data.scale_factor : undefined
            // }

            // let shapeNode2: ShapeNode = {
            //     id: (transformedShape as Ray).endRay.props.id,
            //     defined: true,
            //     isSelected: false,
            //     dependsOn: [end.props.id, transformObject!.props.id],
            //     type: (transformedShape as Ray).endRay,
            //     node: undefined,
            //     rotationFactor: mode === 'rotation' ? {
            //         degree: (data.rotation ? data.rotation.degree : 0),
            //         CCW: (data.rotation ? data.rotation.CCW : true)
            //     } : undefined,
            //     scaleFactor: data.scale_factor ? data.scale_factor : undefined
            // }

            let anotherShapeNode = {
                id: transformedShape.props.id,
                defined: true,
                isSelected: false,
                dependsOn: [shape.props.id, transformObject!.props.id, (transformedShape as Ray).startRay.props.id, (transformedShape as Ray).endRay.props.id],
                type: transformedShape,
                node: undefined,
                rotationFactor: mode === 'rotation' ? {
                    degree: (data.rotation ? data.rotation.degree : 0),
                    CCW: (data.rotation ? data.rotation.CCW : true)
                } : undefined,
                scaleFactor: data.scale_factor ? data.scale_factor : undefined
            };

            transformedShape.type = shapeType;
            // shapeNode1.type.type = shapeType;
            // shapeNode2.type.type = shapeType;
            // dag.set(shapeNode1.id, shapeNode1);
            // dag.set(shapeNode2.id, shapeNode2);
            dag.set(transformedShape.props.id, anotherShapeNode);
        }

        else if ('startVector' in shape) {
            const [start, end] = [(shape as Vector).startVector, (shape as Vector).endVector];
            updateShapeAfterTransform(
                start, (transformedShape as Vector).startVector, labelUsed, dag, mode, data, transformObject
            );
            updateShapeAfterTransform(
                end, (transformedShape as Vector).endVector, labelUsed, dag, mode, data, transformObject
            );
            // (transformedShape as Vector).startVector.props.label = getNewLabel(start.props.label);
            // (transformedShape as Vector).startVector.props.id = `point-${uuidv4()}`
            // labelUsed.push((transformedShape as Vector).startVector.props.label);
            // (transformedShape as Vector).endVector.props.label = getNewLabel(end.props.label);
            // (transformedShape as Vector).endVector.props.id = `point-${uuidv4()}`
            // labelUsed.push((transformedShape as Vector).endVector.props.label);
            let vector_label = `vector0`;
            let index = 0;
            while (labelUsed.includes(vector_label)) {
                index++;
                vector_label = `vector${index}`;
            }

            labelUsed.push(vector_label);
            transformedShape.props.label = vector_label;
            transformedShape.props.id = `vector-${vector_label}`;

            // let shapeNode1: ShapeNode = {
            //     id: (transformedShape as Vector).startVector.props.id,
            //     defined: true,
            //     isSelected: false,
            //     dependsOn: [start.props.id, transformObject!.props.id],
            //     type: (transformedShape as Vector).startVector,
            //     node: undefined,
            //     rotationFactor: mode === 'rotation' ? {
            //         degree: (data.rotation ? data.rotation.degree : 0),
            //         CCW: (data.rotation ? data.rotation.CCW : true)
            //     } : undefined,
            //     scaleFactor: data.scale_factor ? data.scale_factor : undefined
            // }

            // let shapeNode2: ShapeNode = {
            //     id: (transformedShape as Vector).endVector.props.id,
            //     defined: true,
            //     isSelected: false,
            //     dependsOn: [end.props.id, transformObject!.props.id],
            //     type: (transformedShape as Vector).endVector,
            //     node: undefined,
            //     rotationFactor: mode === 'rotation' ? {
            //         degree: (data.rotation ? data.rotation.degree : 0),
            //         CCW: (data.rotation ? data.rotation.CCW : true)
            //     } : undefined,
            //     scaleFactor: data.scale_factor ? data.scale_factor : undefined
            // }

            let anotherShapeNode = {
                id: transformedShape.props.id,
                defined: true,
                isSelected: false,
                dependsOn: [shape.props.id, transformObject!.props.id, (transformedShape as Vector).startVector.props.id, (transformedShape as Vector).endVector.props.id],
                type: transformedShape,
                node: undefined,
                rotationFactor: mode === 'rotation' ? {
                    degree: (data.rotation ? data.rotation.degree : 0),
                    CCW: (data.rotation ? data.rotation.CCW : true)
                } : undefined,
                scaleFactor: data.scale_factor ? data.scale_factor : undefined
            };

            transformedShape.type = shapeType;
            // shapeNode1.type.type = shapeType;
            // shapeNode2.type.type = shapeType;
            // dag.set(shapeNode1.id, shapeNode1);
            // dag.set(shapeNode2.id, shapeNode2);
            dag.set(transformedShape.props.id, anotherShapeNode);
        }

        else if ('centerC' in shape && 'radius' in shape) {
            const center = (shape as Circle).centerC;
            updateShapeAfterTransform(
                center, (transformedShape as Circle).centerC, labelUsed, dag, mode, data, transformObject
            );
            // (transformedShape as Circle).centerC.props.label = getNewLabel(center.props.label);
            // (transformedShape as Circle).centerC.props.id = `point-${uuidv4()}`;
            // labelUsed.push((transformedShape as Circle).centerC.props.label);
            let circle_label = `circle0`;
            let index = 0;
            while (labelUsed.includes(circle_label)) {
                index++;
                circle_label = `circle${index}`;
            }

            labelUsed.push(circle_label);
            transformedShape.props.label = circle_label;
            transformedShape.props.id = `circle-${circle_label}`;

            // let shapeNode1: ShapeNode = {
            //     id: (transformedShape as Circle).centerC.props.id,
            //     defined: true,
            //     isSelected: false,
            //     dependsOn: [(shape as Circle).centerC.props.id, transformObject!.props.id],
            //     type: (transformedShape as Circle).centerC,
            //     node: undefined,
            //     rotationFactor: mode === 'rotation' ? {
            //         degree: (data.rotation ? data.rotation.degree : 0),
            //         CCW: (data.rotation ? data.rotation.CCW : true)
            //     } : undefined,
            //     scaleFactor: data.scale_factor ? data.scale_factor : undefined
            // }

            let anotherShapeNode = {
                id: transformedShape.props.id,
                defined: true,
                isSelected: false,
                dependsOn: [shape.props.id, transformObject!.props.id, (transformedShape as Circle).centerC.props.id],
                type: transformedShape,
                node: undefined,
                rotationFactor: mode === 'rotation' ? {
                    degree: (data.rotation ? data.rotation.degree : 0),
                    CCW: (data.rotation ? data.rotation.CCW : true)
                } : undefined,
                scaleFactor: data.scale_factor ? data.scale_factor : undefined
            };

            transformedShape.type = shapeType;
            // shapeNode1.type.type = shapeType;
            // dag.set(shapeNode1.id, shapeNode1);
            dag.set(transformedShape.props.id, anotherShapeNode);
        }

        else if ('start' in shape && 'end' in shape) {
            const startPoint = (shape as SemiCircle).start, endPoint = (shape as SemiCircle).end;
            updateShapeAfterTransform(
                startPoint, (transformedShape as SemiCircle).start, labelUsed, dag, mode, data, transformObject
            );
            updateShapeAfterTransform(
                endPoint, (transformedShape as SemiCircle).end, labelUsed, dag, mode, data, transformObject
            );
            // (transformedShape as SemiCircle).start.props.label = getNewLabel(startPoint.props.label);
            // (transformedShape as SemiCircle).start.props.id = `point-${uuidv4()}`
            // labelUsed.push((transformedShape as SemiCircle).start.props.label);
            // (transformedShape as SemiCircle).end.props.label = getNewLabel(endPoint.props.label);
            // (transformedShape as SemiCircle).end.props.id = `point-${uuidv4()}`
            // labelUsed.push((transformedShape as SemiCircle).end.props.label);
            let semi_label = `semi0`;
            let index = 0;
            while (labelUsed.includes(semi_label)) {
                index++;
                semi_label = `semi${index}`;
            }

            labelUsed.push(semi_label);
            transformedShape.props.label = semi_label;
            transformedShape.props.id = `semi-${semi_label}`;

            // let shapeNode1: ShapeNode = {
            //     id: (transformedShape as SemiCircle).start.props.id,
            //     defined: true,
            //     isSelected: false,
            //     dependsOn: [startPoint.props.id, transformObject!.props.id],
            //     type: (transformedShape as SemiCircle).start,
            //     node: undefined,
            //     rotationFactor: mode === 'rotation' ? {
            //         degree: (data.rotation ? data.rotation.degree : 0),
            //         CCW: (data.rotation ? data.rotation.CCW : true)
            //     } : undefined,
            //     scaleFactor: data.scale_factor ? data.scale_factor : undefined
            // }

            // let shapeNode2: ShapeNode = {
            //     id: (transformedShape as SemiCircle).end.props.id,
            //     defined: true,
            //     isSelected: false,
            //     dependsOn: [endPoint.props.id, transformObject!.props.id],
            //     type: (transformedShape as SemiCircle).end,
            //     node: undefined,
            //     rotationFactor: mode === 'rotation' ? {
            //         degree: (data.rotation ? data.rotation.degree : 0),
            //         CCW: (data.rotation ? data.rotation.CCW : true)
            //     } : undefined,
            //     scaleFactor: data.scale_factor ? data.scale_factor : undefined
            // }

            let anotherShapeNode = {
                id: transformedShape.props.id,
                defined: true,
                isSelected: false,
                dependsOn: [shape.props.id, transformObject!.props.id, (transformedShape as SemiCircle).start.props.id, (transformedShape as SemiCircle).end.props.id],
                type: transformedShape,
                node: undefined,
                rotationFactor: mode === 'rotation' ? {
                    degree: (data.rotation ? data.rotation.degree : 0),
                    CCW: (data.rotation ? data.rotation.CCW : true)
                } : undefined,
                scaleFactor: data.scale_factor ? data.scale_factor : undefined
            };

            transformedShape.type = shapeType;
            // shapeNode1.type.type = shapeType;
            // shapeNode2.type.type = shapeType;
            // dag.set(shapeNode1.id, shapeNode1);
            // dag.set(shapeNode2.id, shapeNode2);
            dag.set(transformedShape.props.id, anotherShapeNode);
        }
    }

    else {
        transformedShape.props.label = getNewLabel(shape.props.label);
        transformedShape.props.id = `point-${uuidv4()}`
        labelUsed.push(transformedShape.props.label);
        let anotherShapeNode = {
            id: transformedShape.props.id,
            defined: true,
            isSelected: false,
            dependsOn: [shape.props.id, transformObject!.props.id],
            type: transformedShape,
            node: undefined,
            rotationFactor: mode === 'rotation' ? {
                degree: (data.rotation ? data.rotation.degree : 0),
                CCW: (data.rotation ? data.rotation.CCW : true)
            } : undefined,
            scaleFactor: data.scale_factor ? data.scale_factor : undefined
        };

        transformedShape.type = shapeType;
        dag.set(transformedShape.props.id, anotherShapeNode);
    }
}