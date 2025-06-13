import React, { RefObject } from "react";
import { Line, Vector, Segment, Polygon, Point, Circle, Ray, Shape, LineStyle, GeometryState, ShapeNode, Angle, SemiCircle } from "../types/geometry"
import Konva from "konva";
import { Stage, Layer } from "react-konva";
import { KonvaAxis } from "../utils/KonvaAxis";
import { KonvaGrid } from "../utils/KonvaGrid";
import { GeometryTool } from "./GeometryTool";
import * as operation from '../utils/math_operation'
import _ from "lodash";
import * as Factory from '../utils/Factory'
const math = require("mathjs");

// Constants
const FONT_DEFAULTS = {
    SIZE: 12,
    FAMILY: 'Calibri',
    COLOR: 'black'
};

const ARROW_DEFAULTS = {
    POINTER_WIDTH: 5,
    POINTER_LENGTH: 5
};

// Constants for line extension

// Constants for grid and axes spacing
const BASE_SPACING = 60;

// Constants for zoom level
const ZOOM_FACTOR = 1.1;

// Utility functions
const convert2RGB = _.memoize((color: string): [number, number, number] => {
    const rgb = Konva.Util.getRGB(color)
    if (rgb) {
        return [rgb.r, rgb.g, rgb.b]
    }
    throw new Error('Invalid color format');
});

const createDashArray = _.memoize((lineStyle: LineStyle): number[] => {
    const [dash, gap, offset] = [lineStyle.dash_size, lineStyle.gap_size, lineStyle.dot_size];
    return [offset ?? 0, gap, dash, gap];
});

const createLabelProps = (
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

const createPointDefaultShapeProps = _.memoize((label: string, radius: number = 0.05, labelXOffset: number = 0, labelYOffset: number = 0, labelZOffset: number = 0): Shape['props'] => {
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

const createLineDefaultShapeProps = _.memoize((label: string, radius: number = 0, labelXOffset: number = 0, labelYOffset: number = 0, labelZOffset: number = 0): Shape['props'] => {
    return {
        line_size: 1,
        line_style: {dash_size: 0, gap_size: 0, dot_size: 0},
        radius: radius,
        label: label,
        visible: {shape: true, label: true},
        fill: true,
        color: 'black',
        labelXOffset: labelXOffset,
        labelYOffset: labelYOffset,
        labelZOffset: labelZOffset,
        id: `line-${label}`
    }
})

const createCircleDefaultShapeProps = _.memoize((label: string, radius: number, labelXOffset: number = 0, labelYOffset: number = 0, labelZOffset: number = 0): Shape['props'] => {
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
        id: `circle-${label}`
    }
})

const createPolygonDefaultShapeProps = _.memoize((label: string, radius: number = 0, labelXOffset: number = 0, labelYOffset: number = 0, labelZOffset: number = 0): Shape['props'] => {
    return {
        label: label,
        labelXOffset: 0,
        labelYOffset: 10,
        labelZOffset: 0,
        line_size: 1,
        line_style: {dash_size: 0, gap_size: 0, dot_size: 0},
        radius: 0,  
        visible: {shape: true, label: true},
        color: 'red',
        fill: true,
        id: `polygon-${label}`,
        opacity: 0.1
    }
})

const createAngleDefaultShapeProps = _.memoize((label: string, radius: number = 0, labelXOffset: number = 0, labelYOffset: number = 0, labelZOffset: number = 0): Shape['props'] => {
    return {
        label: label,
        labelXOffset: 0,
        labelYOffset: 10,
        labelZOffset: 0,
        line_size: 1,
        line_style: {dash_size: 0, gap_size: 0, dot_size: 0},
        radius: 0,  
        visible: {shape: true, label: true},
        color: 'green',
        fill: true,
        id: `angle-${label}`,
        opacity: 0.1
    }
})

const snapToGrid = _.memoize((
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

    const position = {
        x: (pointer.x - layer.x()) / layer.scaleX(),
        y: (pointer.y - layer.y()) / layer.scaleY()
    };

    const snapped = {
        x: snap(position.x, originX),
        y: snap(position.y, originY)
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
        finalMathPos = position;
    }

    return finalMathPos;
});

const clone = (
    state: GeometryState,
    dag: Map<string, ShapeNode>,
    selectedPoints: Point[],
    selectedShapes: Shape[],
    label_used: string[]
) => {
    const copyState = structuredClone(state);
    const copySelectedPoints = structuredClone(selectedPoints);
    const copySelectedShapes = structuredClone(selectedPoints);
    const copyLabelUsed = Array.from(label_used);
    const copyDAG = new Map<string, ShapeNode>();
    dag.forEach((node, key) => {
        copyDAG.set(key, {
            id: key,
            type: node.type,
            scaleFactor: node.scaleFactor,
            rotationFactor: node.rotationFactor,
            dependsOn: Array.from(node.dependsOn),
            node: node.node.clone()
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

const projectPointOntoLineSegment = (
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

interface CanvasProps {
    width: number;
    height: number;
    background_color: string;
}

class KonvaCanvas extends React.Component<CanvasProps, GeometryState> {
    private layerMathObjectRef: RefObject<Konva.Layer | null>;
    private layerUnchangeVisualRef: RefObject<Konva.Layer | null>;
    private layerAxisRef: RefObject<Konva.Layer | null>;
    private layerGridRef: RefObject<Konva.Layer | null>;
    private stageRef: RefObject<Konva.Stage | null>;
    private last_pointer: {x: number, y: number};
    private historyStack: { 
        state: GeometryState,
        dag: Map<string, ShapeNode>,
        selectedPoints: Point[],
        selectedShapes: Shape[],
        label_used: string[]
    }[] = [];
    private futureStack: { state: GeometryState,
        dag: Map<string, ShapeNode>,
        selectedPoints: Point[],
        selectedShapes: Shape[],
        label_used: string[]
    }[] = [];
    private mode: string;
    private DAG: Map<string, ShapeNode>;
    private selectedPoints: Point[];
    private label_used: string[] = [];
    private selectedShapes: Shape[] = [];

    constructor(props: CanvasProps) {
        super(props);
        this.layerMathObjectRef = React.createRef<Konva.Layer>();
        this.layerUnchangeVisualRef = React.createRef<Konva.Layer>();
        this.layerAxisRef = React.createRef<Konva.Layer>();
        this.layerGridRef = React.createRef<Konva.Layer>();
        this.state = {
            numLoops: 0,
            axisTickInterval: 1,
            spacing: BASE_SPACING,
            shapes: [],
            gridVisible: true,
            zoom_level: 1,
            axesVisible: true,
            panning: false,
            dummy: false,
            polygonIndex: 0,
        }

        this.last_pointer = {x: 0, y: 0};
        this.stageRef = React.createRef<Konva.Stage>();
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = _.throttle(this.handleMouseMove.bind(this), 16);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleZoom = _.debounce(this.handleZoom.bind(this), 50);
        this.mode = 'edit';
        this.DAG = new Map<string, ShapeNode>();
        this.selectedPoints = new Array<Point>();

        this.historyStack.push(clone(this.state, this.DAG, this.selectedPoints, this.selectedShapes, this.label_used)); // Initialize history stack
    }

    componentDidMount(): void {
        this.drawShapes();
    }

    componentDidUpdate(prevProps: Readonly<CanvasProps>, prevState: Readonly<GeometryState>): void {
        if (
            prevProps.width !== this.props.width ||
            prevProps.height !== this.props.height ||
            prevState.gridVisible !== this.state.gridVisible ||
            prevState.axesVisible !== this.state.axesVisible ||
            prevState.zoom_level !== this.state.zoom_level ||
            prevState.axisTickInterval !== this.state.axisTickInterval ||
            prevState.spacing !== this.state.spacing ||
            prevState.panning !== this.state.panning ||
            prevState.dummy !== this.state.dummy ||
            prevState.shapes !== this.state.shapes ||
            prevState.polygonIndex !== this.state.polygonIndex
        ) {
            this.drawShapes();
        }

        if (prevProps.background_color !== this.props.background_color) {
            this.updateBackground();
        }
    }

    private handleZoom = (e: Konva.KonvaEventObject<MouseEvent>) => {
        e.evt.preventDefault();
        const stage = this.stageRef.current;
        const layer = this.layerMathObjectRef.current;
        if (!stage || !layer) return;

        const oldScale = layer.scaleX();
        const pointer = stage.getPointerPosition();
        if (!pointer) return;

        const event = e.evt as WheelEvent;
        let newScale = oldScale * (event.deltaY < 0 ? ZOOM_FACTOR : 1 / ZOOM_FACTOR);

        if (newScale >= 1000 || newScale <= 0.002) {
            newScale = oldScale;
        }

        // Calculate the mouse position relative to the layer
        const mousePointTo = {
            x: (pointer.x - layer.x()) / oldScale,
            y: (pointer.y - layer.y()) / oldScale
        };

        // Calculate the new position to keep the mouse point fixed
        const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale
        };

        // Apply the new scale
        layer.scale({ x: newScale, y: newScale });
        this.layerGridRef.current?.scale({ x: newScale, y: newScale });
        this.layerAxisRef.current?.scale({ x: newScale, y: newScale });

        // Update all layers' positions
        layer.position(newPos);
        this.layerGridRef.current?.position(newPos);
        this.layerAxisRef.current?.position(newPos);

        this.DAG.forEach((node, key) => {
            if ('x' in node.type) {
                ((node as ShapeNode).node as Konva.Circle).radius(node.type.props.radius * BASE_SPACING / newScale);
            }
        })

        // Batch draw all layers
        layer.batchDraw();
        this.layerGridRef.current?.batchDraw();
        this.layerAxisRef.current?.batchDraw();
        this.layerUnchangeVisualRef.current?.batchDraw();

        let numLoops = this.state.numLoops + (newScale > oldScale ? -1 : (newScale < oldScale ? 1 : 0));
        let calcNextInterval = (interval: number, forward: boolean) => {
            let multiplier = [2, 2.5, 2];
            let base = 1;
            if (interval >= base) {
                let current = base;
                let i = 0;
                while (current < interval) {
                    current *= multiplier[i];
                    i = (i + 1) % multiplier.length;
                }
                
                return (forward ? current * multiplier[i] : current / multiplier[(i - 1 + multiplier.length) % multiplier.length]);
            }

            else {
                let current = base;
                let i = 2;
                while (current > interval) {
                    current /= multiplier[i];
                    i = ((i - 1) % multiplier.length + multiplier.length) % multiplier.length;
                }

                return (forward ? current * multiplier[(i + 1) % multiplier.length] : current / multiplier[i]);
            }
        }

        let axisTickInterval = this.state.axisTickInterval;
        if (numLoops === 8 || numLoops === -8) {
            axisTickInterval = calcNextInterval(axisTickInterval, numLoops > 0);
            numLoops = 0;
        }

        this.setState({
            numLoops: numLoops,
            axisTickInterval: axisTickInterval,
            zoom_level: newScale,
            spacing: BASE_SPACING,
        });
    }

    private handleMouseOver = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (!this.stageRef.current || !this.layerMathObjectRef.current) return;

        const pos = this.stageRef.current.getPointerPosition();
        const shapeUnderCursor = pos ? this.stageRef.current.getIntersection(pos) : null;

        if (shapeUnderCursor !== null) {
            this.stageRef.current.container().style.cursor = 'default';
        }
        
        else {
            this.stageRef.current.container().style.cursor = 'crosshair';
        }
    }

    private handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (e.evt.button !== 0) return; // Only handle left mouse button clicks
        if (this.mode !== 'edit') {
            this.handleDrawing();
            return;
        }

        if (!this.stageRef.current) return;
        this.stageRef.current.container().style.cursor = 'grabbing';

        if (e.target === this.stageRef.current || e.target instanceof Konva.Stage) {
            this.setState({ panning: true });
            const stage = this.stageRef.current;
            if (!stage) return;

            const pointer = stage.getPointerPosition();
            if (!pointer) return;

            this.last_pointer = {
                x: pointer.x,
                y: pointer.y
            }
        }
    }

    private handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (!this.stageRef.current) return;
        const pos = this.stageRef.current.getPointerPosition();
        const shapeUnderCursor = pos ? this.stageRef.current.getIntersection(pos) : null;

        if (shapeUnderCursor !== null) {
            this.stageRef.current.container().style.cursor = 'default';
        }
        
        else {
            this.stageRef.current.container().style.cursor = this.state.panning ? 'grabbing' : 'crosshair';
        }
        
        if (this.mode !== 'edit') {
            return;
        }
        
        if (!this.state.panning) return;

        if (e.target === this.stageRef.current || e.target instanceof Konva.Stage) {
            const layer = this.layerMathObjectRef.current;
            const stage = this.stageRef.current;
            if (!layer || !stage) return;

            const pointer = stage.getPointerPosition();
            if (!pointer) return;
            
            const dx = pointer.x - this.last_pointer.x;
            const dy = pointer.y - this.last_pointer.y;

            // Update positions for all layers
            const updatePosition = (layer: Konva.Layer | null) => {
                if (layer) {
                    layer.position({
                        x: layer.x() + dx,
                        y: layer.y() + dy
                    });
                }
            };

            updatePosition(layer);
            updatePosition(this.layerAxisRef.current);
            updatePosition(this.layerGridRef.current);

            this.last_pointer = {
                x: pointer.x,
                y: pointer.y
            };

            // Batch draw all layers
            layer.batchDraw();
            this.layerAxisRef.current?.batchDraw();
            this.layerGridRef.current?.batchDraw();
            this.layerUnchangeVisualRef.current?.batchDraw();

            this.setState({
                dummy: !this.state.dummy
            });
        }
    }

    private handleMouseUp = () => {
        this.setState({ panning: false });
    }

    private updateBackground = () => {
        if (this.stageRef.current) {
            this.stageRef.current.x(0);
            this.stageRef.current.y(0);
            this.stageRef.current.width(this.props.width);
            this.stageRef.current.height(this.props.height);
        }
    }

    private drawGrid = (): void => {
        if (this.state.gridVisible && this.layerGridRef.current) {
            const grid = new KonvaGrid({
                width: this.props.width,
                height: this.props.height,
                gridColor: 'gray',
                gridSize: this.state.spacing,
                strokeWidth: 0.75,
                originX: this.props.width / 2,
                originY: this.props.height / 2,
                opacity: 0.5
            });

            let scale = this.layerMathObjectRef.current?.getAbsoluteScale().x ?? 1;
            this.layerGridRef.current?.add(
                grid.generateGrid(
                    this.layerGridRef.current.position(),
                    scale,
                    this.state.axisTickInterval
                )
            );
        }
    }
    
    private drawAxes = (): void => {
        if (this.state.axesVisible && this.layerAxisRef.current) {
            const axes = new KonvaAxis({
                width: this.props.width,
                height: this.props.height,
                axisColor: 'gray',
                axisWidth: 1,
                pointerWidth: ARROW_DEFAULTS.POINTER_WIDTH,
                pointerLength: ARROW_DEFAULTS.POINTER_LENGTH,
                xTickSpacing: this.state.spacing,
                originX: this.props.width / 2,
                originY: this.props.height / 2,
                opacity: 0.5
            });

            let scale = this.layerMathObjectRef.current?.getAbsoluteScale().x ?? 1;
            axes.generateAxis(
                this.state.axisTickInterval,
                this.layerAxisRef.current,
                scale,
                this.layerUnchangeVisualRef.current!
            )
        }
    }

    private drawPoint = (point: Point, props: Shape['props']) => {
        const scale = this.layerMathObjectRef.current?.getAbsoluteScale().x ?? 1;
        const scaledStrokeWidth = props.line_size / scale;

        const c = new Konva.Circle({
            x: point.x,
            y: point.y,
            radius: props.radius * BASE_SPACING,
            fill: props.color,
            stroke: props.color,
            visible: props.visible.shape,
            id: props.id,
            draggable: true,
            strokeWidth: scaledStrokeWidth,
            hitStrokeWidth: 2
        });

        c.on('mouseover', (e) => {
            e.cancelBubble = true;
            c.shadowColor('gray');
            c.shadowBlur(c.radius() * 2.5);
            c.shadowOpacity(1.5);
            c.getLayer()?.batchDraw();
        })

        c.on('mouseleave', (e) => {
            e.cancelBubble = true;
            c.shadowBlur(0);
            c.getLayer()?.batchDraw();
        })

        c.on('mousedown', (e) => {
            if (!["delete", "edit"].includes(this.mode)) {
                return;
            }

            e.cancelBubble = true;
            let stage = e.target.getStage();
            if (stage) {
                stage.container().style.cursor = 'pointer';
            }

            if (this.mode === "delete") {
                this.removeNode(c.id());
                this.historyStack.push(clone(this.state, this.DAG, this.selectedPoints, this.selectedShapes, this.label_used));

                if (this.historyStack.length >= 100) {
                    this.historyStack.splice(0, 1);
                }

                this.futureStack = [];
            }
        })

        c.on('dragstart', (e) => {
            if (this.mode !== 'edit' || !this.stageRef.current) {
                return;
            }

            e.cancelBubble = true;
            let stage = e.target.getStage();
            if (stage) {
                stage.container().style.cursor = 'pointer';
            }
        })

        c.on('dragmove', (e) => {
            if (this.mode !== 'edit' || !this.stageRef.current) {
                return;
            }

            e.cancelBubble = true;
            let stage = e.target.getStage();
            let pos = {
                x: 0,
                y: 0
            }

            if (stage) {
                stage.container().style.cursor = 'pointer';
                pos = stage.getPointerPosition() ?? pos;
            }

            this.updateAndPropagate(c.id(), (node: ShapeNode): ShapeNode => {
                const finalMathPos = snapToGrid(
                    pos,
                    BASE_SPACING,
                    this.state.axisTickInterval,
                    this.props.width / 2,
                    this.props.height / 2,
                    this.layerMathObjectRef.current!
                );

                node.node.position({x: finalMathPos.x, y: finalMathPos.y});
                point.x = finalMathPos.x;
                point.y = finalMathPos.y;

                if (this.layerUnchangeVisualRef.current) {
                    this.layerUnchangeVisualRef.current.getChildren().forEach((childNode, idx) => {
                        let id = childNode.id();
                        if (id === `label-${c.id()}`) {
                            childNode.setAttrs(this.createLabel(node).getAttrs());
                            return;
                        }
                    })
                }

                return node;
            });
        })

        c.on('mouseup', (e) => {
            e.cancelBubble = true;
            let stage = e.target.getStage();
            if (stage) {
                stage.container().style.cursor = 'default';
            }
        })

        return c;
    };

    private drawLine = (line: Line, props: Shape['props']) => {
        const dx = line.endLine.x - line.startLine.x;
        const dy = line.endLine.y - line.startLine.y;

        let length = 2 * Math.max(this.props.width, this.props.height) * Math.sqrt(dx * dx + dy * dy) / this.state.zoom_level;
        let norm_dx = dx / Math.sqrt(dx * dx + dy * dy);
        let norm_dy = dy / Math.sqrt(dx * dx + dy * dy);

        const scale = this.layerMathObjectRef.current?.getAbsoluteScale().x ?? 1;
        const scaledStrokeWidth = props.line_size / scale;
        
        const l = new Konva.Line({
            points: [
                line.startLine.x - length * norm_dx,
                line.startLine.y - length * norm_dy,
                line.endLine.x + length * norm_dx,
                line.endLine.y + length * norm_dy
            ],
            dash: createDashArray(props.line_style),
            strokeWidth: scaledStrokeWidth,
            stroke: props.color,
            visible: props.visible.shape,
            id: props.id,
            hitStrokeWidth: 2,
            draggable: true
        });

        l.on('mouseover', (e) => {
            e.cancelBubble = true;
            l.strokeWidth(scaledStrokeWidth * 2);
            l.getLayer()?.batchDraw();
        })

        l.on('mouseleave', (e) => {
            e.cancelBubble = true;
            l.strokeWidth(scaledStrokeWidth);
            l.getLayer()?.batchDraw();
        })

        l.on('mousedown', (e) => {
            if (!["delete", "edit"].includes(this.mode)) {
                return;
            }

            e.cancelBubble = true;
            let stage = e.target.getStage();
            if (stage) {
                stage.container().style.cursor = 'pointer';
            }

            if (this.mode === "delete") {
                this.removeNode(l.id());
                this.historyStack.push(clone(this.state, this.DAG, this.selectedPoints, this.selectedShapes, this.label_used));

                if (this.historyStack.length >= 100) {
                    this.historyStack.splice(0, 1);
                }
                this.futureStack = [];
            }
        });

        let oldPos = {
            x: 0,
            y: 0
        }

        l.on('dragstart', (e) => {
            if (this.mode !== "edit") {
                return;
            }

            e.cancelBubble = true;
            let stage = e.target.getStage();
            if (stage) {
                stage.container().style.cursor = 'pointer';
            }

            oldPos = this.stageRef.current?.getPointerPosition() ?? oldPos;
        })

        l.on('dragmove', (e) => {
            if (this.mode !== "edit") {
                return;
            }

            e.cancelBubble = true;
            let stage = e.target.getStage();
            if (stage) {
                stage.container().style.cursor = 'pointer';
            }

            e.target.position({ x: 0, y: 0 });
            const position = this.stageRef.current?.getPointerPosition();
            if (!position) return;
            let dx = position.x - oldPos.x;
            let dy = position.y - oldPos.y;

            let [id1, id2] = [line.startLine.props.id, line.endLine.props.id];
            const [p1, p2] = [this.DAG.get(id1), this.DAG.get(id2)];
            if (!p1 || !p2) {
                return;
            }

            let node1 = (p1 as ShapeNode).node;
            let node2 = (p2 as ShapeNode).node;
            oldPos = position;

            node1.position({x: node1.x() + dx, y: node1.y() + dy});
            node2.position({x: node2.x() + dx, y: node2.y() + dy});
            this.updateAndPropagate(p1.id, this.computeUpdateFor);
            this.updateAndPropagate(p2.id, this.computeUpdateFor);
        })

        l.on('mouseup', (e) => {
            e.cancelBubble = true;
            let stage = e.target.getStage();
            if (stage) {
                stage.container().style.cursor = 'default';
            }
        })

        return l;
    };

    private drawSegment = (segment: Segment, props: Shape['props']) => {
        const scale = this.layerMathObjectRef.current?.getAbsoluteScale().x ?? 1;
        const scaledStrokeWidth = props.line_size / scale;

        const s = new Konva.Line({
            points: [
                segment.startSegment.x,
                segment.startSegment.y,
                segment.endSegment.x,
                segment.endSegment.y
            ],
            dash: createDashArray(props.line_style),
            strokeWidth: scaledStrokeWidth,
            stroke: props.color,
            visible: props.visible.shape,
            id: props.id,
            hitStrokeWidth: 2,
            draggable: true,
            strokeScaleEnabled: false,
            perfectDrawEnabled: true
        });

        s.on('mouseover', (e) => {
            e.cancelBubble = true;
            s.strokeWidth(scaledStrokeWidth * 2);
            s.getLayer()?.batchDraw();
        })

        s.on('mouseleave', (e) => {
            e.cancelBubble = true;
            s.strokeWidth(scaledStrokeWidth);
            s.getLayer()?.batchDraw();
        })

        s.on('mousedown', (e) => {
            if (!["delete", "edit"].includes(this.mode)) {
                return;
            }

            e.cancelBubble = true;
            let stage = e.target.getStage();
            if (stage) {
                stage.container().style.cursor = 'pointer';
            }

            if (this.mode === "delete") {
                this.removeNode(s.id());
                this.historyStack.push(clone(this.state, this.DAG, this.selectedPoints, this.selectedShapes, this.label_used));

                if (this.historyStack.length >= 100) {
                    this.historyStack.splice(0, 1);
                }

                this.futureStack = [];
            }
        })

        let oldPos = {
            x: 0,
            y: 0
        }

        s.on('dragstart', (e) => {
            if (this.mode !== "edit") {
                return;
            }

            e.cancelBubble = true;
            let stage = e.target.getStage();
            if (stage) {
                stage.container().style.cursor = 'pointer';
            }

            oldPos = this.stageRef.current?.getPointerPosition() ?? oldPos;
        })

        s.on('dragmove', (e) => {
            if (this.mode !== "edit") {
                return;
            }

            e.cancelBubble = true;
            let stage = e.target.getStage();
            if (stage) {
                stage.container().style.cursor = 'pointer';
            }

            e.target.position({ x: 0, y: 0 });
            const position = this.stageRef.current?.getPointerPosition();
            if (!position) return;

            let dx = position.x - oldPos.x;
            let dy = position.y - oldPos.y;

            let [id1, id2] = [segment.startSegment.props.id, segment.endSegment.props.id];
            const [p1, p2] = [this.DAG.get(id1), this.DAG.get(id2)];
            if (!p1 || !p2) {
                return;
            }

            let node1 = (p1 as ShapeNode).node;
            let node2 = (p2 as ShapeNode).node;
            oldPos = position;

            node1.position({x: node1.x() + dx, y: node1.y() + dy});
            node2.position({x: node2.x() + dx, y: node2.y() + dy});
            this.updateAndPropagate(p1.id, this.computeUpdateFor);
            this.updateAndPropagate(p2.id, this.computeUpdateFor);
        })

        s.on('mouseup', (e) => {
            e.cancelBubble = true;
            let stage = e.target.getStage();
            if (stage) {
                stage.container().style.cursor = 'default';
            }
        })

        return s;
    };

    private drawVector = (vector: Vector, props: Shape['props']) => {
        const scale = this.layerMathObjectRef.current?.getAbsoluteScale().x ?? 1;
        const scaledStrokeWidth = props.line_size / scale;

        const v = new Konva.Arrow({
            points: [
                vector.startVector.x,
                vector.startVector.y,
                vector.endVector.x,
                vector.endVector.y
            ],
            dash: createDashArray(props.line_style),
            strokeWidth: scaledStrokeWidth,
            pointerWidth: ARROW_DEFAULTS.POINTER_WIDTH,
            pointerLength: ARROW_DEFAULTS.POINTER_LENGTH,
            stroke: props.color,
            visible: props.visible.shape,
            id: props.id,
            hitStrokeWidth: 2,
            draggable: true,
            fill: props.fill? props.color : 'none',
            strokeScaleEnabled: false,
            perfectDrawEnabled: true
        });

        v.on('mouseover', (e) => {
            e.cancelBubble = true;
            v.strokeWidth(scaledStrokeWidth * 2);
            v.getLayer()?.batchDraw();
        })

        v.on('mouseleave', (e) => {
            e.cancelBubble = true;
            v.strokeWidth(scaledStrokeWidth);
            v.getLayer()?.batchDraw();
        })

        v.on('mousedown', (e) => {
            if (!["delete", "edit"].includes(this.mode)) {
                return;
            }

            e.cancelBubble = true;
            let stage = e.target.getStage();
            if (stage) {
                stage.container().style.cursor = 'pointer';
            }

            if (this.mode === "delete") {
                this.removeNode(v.id());
                this.historyStack.push(clone(this.state, this.DAG, this.selectedPoints, this.selectedShapes, this.label_used));

                if (this.historyStack.length >= 100) {
                    this.historyStack.splice(0, 1);
                }

                this.futureStack = [];
            }
        })

        let oldPos = {
            x: 0,
            y: 0
        }

        v.on('dragstart', (e) => {
            if (this.mode !== "edit") {
                return;
            }

            e.cancelBubble = true;
            let stage = e.target.getStage();
            if (stage) {
                stage.container().style.cursor = 'pointer';
            }

            oldPos = this.stageRef.current?.getPointerPosition() ?? oldPos;
        })

        v.on('dragmove', (e) => {
            if (this.mode !== "edit") {
                return;
            }

            e.cancelBubble = true;
            let stage = e.target.getStage();
            if (stage) {
                stage.container().style.cursor = 'pointer';
            }

            e.target.position({ x: 0, y: 0 });
            const position = this.stageRef.current?.getPointerPosition();
            if (!position) return;
            let dx = position.x - oldPos.x;
            let dy = position.y - oldPos.y;

            let [id1, id2] = [vector.startVector.props.id, vector.endVector.props.id];
            const [p1, p2] = [this.DAG.get(id1), this.DAG.get(id2)];
            if (!p1 || !p2) {
                return;
            }

            let node1 = (p1 as ShapeNode).node;
            let node2 = (p2 as ShapeNode).node;
            oldPos = position;

            node1.position({x: node1.x() + dx, y: node1.y() + dy});
            node2.position({x: node2.x() + dx, y: node2.y() + dy});
            this.updateAndPropagate(p1.id, this.computeUpdateFor);
            this.updateAndPropagate(p2.id, this.computeUpdateFor);
        })

        v.on('mouseup', (e) => {
            e.cancelBubble = true;
            let stage = e.target.getStage();
            if (stage) {
                stage.container().style.cursor = 'default';
            }
        })

        return v;
    };

    private drawCircle = (circle: Circle, props: Shape['props']) => {
        const scale = this.layerMathObjectRef.current?.getAbsoluteScale().x ?? 1;
        const scaledStrokeWidth = props.line_size / scale;

        const c = new Konva.Circle({
            x: circle.centerC.x,
            y: circle.centerC.y,
            radius: circle.radius * BASE_SPACING,
            stroke: props.color,
            strokeWidth: scaledStrokeWidth,
            dash: createDashArray(props.line_style),
            visible: props.visible.shape,
            id: props.id,
            draggable: true,
            strokeScaleEnabled: false,
            perfectDrawEnabled: true
        });

        c.hitFunc((ctx, shape) => {
            const currentRadius = shape.radius();
            const currentStrokeWidth = scaledStrokeWidth; // Use the same strokeWidth you want for hit detection

            // Define the inner and outer radii for the hit area
            const innerRadius = currentRadius - currentStrokeWidth / 2 - 2;
            const outerRadius = currentRadius + currentStrokeWidth / 2 + 2;

            // Draw the hit area as an annulus (ring)
            ctx.beginPath();
            ctx.arc(0, 0, outerRadius, 0, Math.PI * 2, false);
            ctx.arc(0, 0, innerRadius, 0, Math.PI * 2, true); // true for anticlockwise to cut a hole
            ctx.closePath();
            ctx.fillStrokeShape(shape); // This applies the fill and stroke based on the shape's properties for hit detection
        });

        c.on('mouseover', (e) => {
            e.cancelBubble = true;
            c.strokeWidth(scaledStrokeWidth * 2);
            c.getLayer()?.batchDraw();
        })

        c.on('mouseleave', (e) => {
            e.cancelBubble = true;
            c.strokeWidth(scaledStrokeWidth);
            c.getLayer()?.batchDraw();
        })

        c.on('mousedown', (e) => {
            if (!["delete", "edit"].includes(this.mode)) {
                return;
            }

            e.cancelBubble = true;
            let stage = e.target.getStage();
            if (stage) {
                stage.container().style.cursor = 'pointer';
            }

            if (this.mode === "delete") {
                this.removeNode(c.id());
                this.historyStack.push(clone(this.state, this.DAG, this.selectedPoints, this.selectedShapes, this.label_used));

                if (this.historyStack.length >= 100) {
                    this.historyStack.splice(0, 1);
                }

                this.futureStack = [];
            }
        })

        let oldPos = {
            x: 0,
            y: 0
        }

        c.on('dragstart', (e) => {
            if (this.mode !== "edit") {
                return;
            }

            e.cancelBubble = true;
            let stage = e.target.getStage();
            if (stage) {
                stage.container().style.cursor = 'pointer';
            }

            oldPos = this.stageRef.current?.getPointerPosition() ?? oldPos;
        })

        c.on('dragmove', (e) => {
            if (this.mode !== "edit") {
                return;
            }

            e.cancelBubble = true;
            let stage = e.target.getStage();
            if (stage) {
                stage.container().style.cursor = 'pointer';
            }

            e.target.position({ x: 0, y: 0 });
            const position = this.stageRef.current?.getPointerPosition();
            if (!position) return;
            let dx = position.x - oldPos.x;
            let dy = position.y - oldPos.y;

            let id = circle.centerC.props.id;
            const p = this.DAG.get(id);
            if (!p) {
                return;
            }

            let node = (p as ShapeNode).node;
            oldPos = position;

            node.position({x: node.x() + dx, y: node.y() + dy});
            this.updateAndPropagate(p.id, this.computeUpdateFor);
        })

        c.on('mouseup', (e) => {
            e.cancelBubble = true;
            let stage = e.target.getStage();
            if (stage) {
                stage.container().style.cursor = 'default';
            }
        })

        return c;
    };

    private drawPolygon = (polygon: Polygon, props: Shape['props']) => {
        const points = polygon.points.flatMap(point => [point.x, point.y]);
        const opacity = props.opacity ?? 0.1;
        const [r, g, b] = convert2RGB(props.color);

        const scale = this.layerMathObjectRef.current?.getAbsoluteScale().x ?? 1;
        const scaledStrokeWidth = props.line_size / scale;

        const p = new Konva.Line({
            points,
            fill: `rgba(${r},${g},${b},${opacity})`,
            dash: createDashArray(props.line_style),
            strokeWidth: scaledStrokeWidth,
            stroke: props.color,
            closed: true,
            visible: props.visible.shape,
            id: props.id,
            hitStrokeWidth: 2,
            draggable: true
        });

        p.on('mouseover', (e) => {
            e.cancelBubble = true;
            p.strokeWidth(scaledStrokeWidth * 2);
            p.getLayer()?.batchDraw();
        })

        p.on('mouseleave', (e) => {
            e.cancelBubble = true;
            p.strokeWidth(scaledStrokeWidth);
            p.getLayer()?.batchDraw();
        })

        p.on('mousedown', (e) => {
            if (!["delete", "edit"].includes(this.mode)) {
                return;
            }

            e.cancelBubble = true;
            let stage = e.target.getStage();
            if (stage) {
                stage.container().style.cursor = 'pointer';
            }

            if (this.mode === "delete") {
                this.removeNode(p.id());
                this.historyStack.push(clone(this.state, this.DAG, this.selectedPoints, this.selectedShapes, this.label_used));

                if (this.historyStack.length >= 100) {
                    this.historyStack.splice(0, 1);
                }

                this.futureStack = [];
            }
        })

        let oldPos = {
            x: 0,
            y: 0
        }

        p.on('dragstart', (e) => {
            if (this.mode !== "edit") {
                return;
            }

            e.cancelBubble = true;
            let stage = e.target.getStage();
            if (stage) {
                stage.container().style.cursor = 'pointer';
            }

            oldPos = this.stageRef.current?.getPointerPosition() ?? oldPos;
        })

        p.on('dragmove', (e) => {
            if (this.mode !== "edit") {
                return;
            }

            e.cancelBubble = true;
            let stage = e.target.getStage();
            if (stage) {
                stage.container().style.cursor = 'pointer';
            }

            e.target.position({ x: 0, y: 0 });
            const position = this.stageRef.current?.getPointerPosition();
            if (!position) return;
            let dx = position.x - oldPos.x;
            let dy = position.y - oldPos.y;

            let ids: string[] = [];
            polygon.points.forEach(id => {
                ids.push(id.props.id);
            });

            let shapeNode: ShapeNode[] = [];
            for (let i = 0; i < ids.length; i++) {
                let id = ids[i];
                let point = this.DAG.get(id);
                if (!point) return;
                shapeNode.push(point as ShapeNode);
            }

            shapeNode.forEach(node => {
                let point = node.node;
                oldPos = position;

                point.position({x: point.x() + dx, y: point.y() + dy});
                this.updateAndPropagate(node.id, this.computeUpdateFor);
            })
        })

        p.on('mouseup', (e) => {
            e.cancelBubble = true;
            let stage = e.target.getStage();
            if (stage) {
                stage.container().style.cursor = 'default';
            }
        })

        return p;
    };

    private drawRay = (ray: Ray, props: Shape['props']) => {
        const dx = ray.endRay.x - ray.startRay.x;
        const dy = ray.endRay.y - ray.startRay.y;

        let norm_dx = dx / Math.sqrt(dx * dx + dy * dy);
        let norm_dy = dy / Math.sqrt(dx * dx + dy * dy);
        let length = 2 * Math.max(this.props.width, this.props.height) * Math.sqrt(dx * dx + dy * dy) / this.state.zoom_level;

        const scale = this.layerMathObjectRef.current?.getAbsoluteScale().x ?? 1;
        const scaledStrokeWidth = props.line_size / scale;

        const r = new Konva.Line({
            points: [
                ray.startRay.x,
                ray.startRay.y,
                ray.startRay.x + length * norm_dx,
                ray.startRay.y + length * norm_dy
            ],
            dash: createDashArray(props.line_style),
            strokeWidth: scaledStrokeWidth,
            stroke: props.color,
            visible: props.visible.shape,
            id: props.id,
            hitStrokeWidth: 2,
            draggable: true,
        });

        r.on('mouseover', (e) => {
            e.cancelBubble = true;
            r.strokeWidth(scaledStrokeWidth * 2);
            r.getLayer()?.batchDraw();
        })

        r.on('mouseleave', (e) => {

            e.cancelBubble = true;
            r.strokeWidth(scaledStrokeWidth);
            r.getLayer()?.batchDraw();
        })

        r.on('mousedown', (e) => {
            if (!["delete", "edit"].includes(this.mode)) {
                return;
            }

            e.cancelBubble = true;
            let stage = e.target.getStage();
            if (stage) {
                stage.container().style.cursor = 'pointer';
            }

            if (this.mode === "delete") {
                this.removeNode(r.id());
                this.historyStack.push(clone(this.state, this.DAG, this.selectedPoints, this.selectedShapes, this.label_used));

                if (this.historyStack.length >= 100) {
                    this.historyStack.splice(0, 1);
                }

                this.futureStack = [];
            }
        })

        let oldPos = {
            x: 0,
            y: 0
        }

        r.on('dragstart', (e) => {
            if (this.mode !== "edit") {
                return;
            }

            e.cancelBubble = true;
            let stage = e.target.getStage();
            if (stage) {
                stage.container().style.cursor = 'pointer';
            }

            oldPos = this.stageRef.current?.getPointerPosition() ?? oldPos;
        })

        r.on('dragmove', (e) => {
            if (this.mode !== "edit") {
                return;
            }

            e.cancelBubble = true;
            let stage = e.target.getStage();
            if (stage) {
                stage.container().style.cursor = 'pointer';
            }

            e.target.position({ x: 0, y: 0 });
            const position = this.stageRef.current?.getPointerPosition();
            if (!position) return;
            let dx = position.x - oldPos.x;
            let dy = position.y - oldPos.y;

            let [id1, id2] = [ray.startRay.props.id, ray.endRay.props.id];
            const [p1, p2] = [this.DAG.get(id1), this.DAG.get(id2)];
            if (!p1 || !p2) {
                return;
            }

            let node1 = (p1 as ShapeNode).node;
            let node2 = (p2 as ShapeNode).node;
            oldPos = position;

            node1.position({x: node1.x() + dx, y: node1.y() + dy});
            node2.position({x: node2.x() + dx, y: node2.y() + dy});
            this.updateAndPropagate(p1.id, this.computeUpdateFor);
            this.updateAndPropagate(p2.id, this.computeUpdateFor);
        })

        r.on('mouseup', (e) => {
            e.cancelBubble = true;
            let stage = e.target.getStage();
            if (stage) {
                stage.container().style.cursor = 'default';
            }
        })

        return r;
    };

    private drawAngle = (shape: Angle, props: Shape['props']): Konva.Shape | undefined => {
        const opacity = props.opacity ?? 0.5;
        const [r, g, b] = convert2RGB(props.color);
        const scale = this.layerMathObjectRef.current?.getAbsoluteScale().x ?? 1;
        const scaledStrokeWidth = props.line_size / scale;

        if (shape.vertex) {
            let a = (shape.degree !== 90) ? new Konva.Shape({
            sceneFunc: function (context, shape) {
                const r = shape.attrs.radius;
                const x = 0;
                const y = 0;
                const start = Konva.getAngle(shape.attrs.startAngle); // radians
                const end = Konva.getAngle(shape.attrs.startAngle - shape.attrs.angle); // radians

                context.beginPath();
                context.moveTo(0, 0);

                context.arc(x, y, r, start, end, true);
                context.closePath();
                context.fillStrokeShape(shape);
            },
                x: shape.vertex.x,
                y: shape.vertex.y,
                radius: 10,
                startAngle: shape.startAngle,
                angle: shape.degree,
                fill: `rgba(${r},${g},${b},${opacity})`,
                stroke: props.color,
                strokeWidth: scaledStrokeWidth,
                hitStrokeWidth: 2
            }) : new Konva.Line({
                x: shape.vertex.x,
                y: shape.vertex.y,
                points: [
                    0, 0,
                    10, 0,
                    10, -10,
                    0, -10
                ],

                fill: `rgba(${r},${g},${b},${opacity})`,
                strokeWidth: scaledStrokeWidth,
                stroke: props.color,
                closed: true,
                visible: props.visible.shape,
                id: props.id,
                hitStrokeWidth: 2,
                draggable: false,
                rotation: shape.startAngle,
            })

            a.on('mouseover', (e) => {
                e.cancelBubble = true;
                a.strokeWidth(scaledStrokeWidth * 2);
                a.getLayer()?.batchDraw();
            })

            a.on('mouseleave', (e) => {
                e.cancelBubble = true;
                a.strokeWidth(scaledStrokeWidth);
                a.getLayer()?.batchDraw();
            })

            a.on('mousedown', (e) => {
                if (!["delete", "edit"].includes(this.mode)) {
                    return;
                }

                e.cancelBubble = true;
                if (this.mode === "delete") {
                    this.removeNode(a.id());
                    this.historyStack.push(clone(this.state, this.DAG, this.selectedPoints, this.selectedShapes, this.label_used));

                    if (this.historyStack.length >= 100) {
                        this.historyStack.splice(0, 1);
                    }

                    this.futureStack = [];
                }
            })

            return a;
        }
        
        return undefined;
    }

    private createLabel = (shapeNode: ShapeNode): Konva.Text => {
        let x = 0, y = 0;
        let shape = shapeNode.type;
        if (shape.type === 'Circle') {
            let p1 = {
                x: shapeNode.node.x(),
                y: shapeNode.node.y() + (shapeNode.node as Konva.Circle).radius()
            };

            let p2 = {
                x: shapeNode.node.x(),
                y: shapeNode.node.y()
            };

            x = (p1.x - p2.x) * Math.cos(Math.PI / 6) - (p1.y - p2.y) * Math.sin(Math.PI / 6) + p2.x
            y = (p1.x - p2.x) * Math.sin(Math.PI / 6) + (p1.y - p2.y) * Math.cos(Math.PI / 6) + p2.y
        }

        else if (shape.type === 'Point') {
            x = shapeNode.node.x();
            y = shapeNode.node.y() + (shapeNode.node as Konva.Circle).radius();
        }

        else if (['Segment', 'Ray', 'Vector', 'Line'].includes(shape.type)) {
            let [p1_x, p1_y] = [(shapeNode.node as Konva.Line).points()[0], (shapeNode.node as Konva.Line).points()[1]];
            let [p2_x, p2_y] = [(shapeNode.node as Konva.Line).points()[2], (shapeNode.node as Konva.Line).points()[3]];

            x = (p1_x + p2_x) / 2;
            y = (p1_y + p2_y) / 2;
        }

        else if (shape.type === 'Polygon') {
            (shapeNode.node as Konva.Line).points().forEach((coor, idx) => {
                if (idx % 2 === 0) {
                    x += coor;
                }

                else {
                    y += coor;
                }
            })

            x /= (shape as Polygon).points.length;
            y /= (shape as Polygon).points.length;
        }

        else if (shape.type === 'Angle') {
            x = shapeNode.node.x();
            y = shapeNode.node.y();
        }

        let text = new Konva.Text(
            createLabelProps(
                x,
                y,
                shape.props.label,
                shape.props.labelXOffset,
                shape.props.labelYOffset,
                shape.props.visible.shape && shape.props.visible.label,
                this.state.zoom_level,
                this.layerMathObjectRef.current?.position() ?? {x: 0, y: 0}
            )
        );

        text.id(`label-${shape.props.id}`);
        text.on('dragstart', (e) => {
            if (this.mode !== 'edit') {
                return;
            }

            e.cancelBubble = true;
            let stage = e.target.getStage();
            if (stage) {
                stage.container().style.cursor = 'pointer';
            }
        });

        text.on('dragmove', (e) => {
            if (this.mode !== "edit") {
                return;
            }

            e.cancelBubble = true;
            let stage = e.target.getStage();
            if (stage) {
                stage.container().style.cursor = 'pointer';
            }

            let pointer = this.stageRef.current?.getPointerPosition();
            if (!pointer) return;
            const position = {
                x: (pointer.x - this.layerMathObjectRef.current!.x()) / this.layerMathObjectRef.current!.scaleX(),
                y: (pointer.y - this.layerMathObjectRef.current!.y()) / this.layerMathObjectRef.current!.scaleY(),
            }

            let shape = shapeNode.type;
            let newX = 0, newY = 0;

            if (shape.type === 'Circle') {
                let r = (shapeNode.node as Konva.Circle).radius();
                let cx = shapeNode.node.x();
                let cy = shapeNode.node.y();
                let angle = Math.PI / 6;
                newX = cx + r * Math.cos(angle);
                newY = cy - r * Math.sin(angle);
            }
            
            else if (shape.type === 'Point') {
                newX = shapeNode.node.x();
                newY = shapeNode.node.y();
            }
            
            else if (['Segment', 'Ray', 'Vector', 'Line'].includes(shape.type)) {
                let pts = (shapeNode.node as Konva.Line).points();
                newX = (pts[0] + pts[2]) / 2;
                newY = (pts[1] + pts[3]) / 2;
            }
            
            else if (shape.type === 'Polygon') {
                let pts = (shapeNode.node as Konva.Line).points();
                for (let i = 0; i < pts.length; i += 2) {
                    newX += pts[i];
                    newY += pts[i + 1];
                }
                newX /= pts.length / 2;
                newY /= pts.length / 2;
            }

            else if (shape.type === 'Angle') {
                newX = shapeNode.node.x();
                newY = shapeNode.node.y();
            }

            let dx = position.x - newX;
            let dy = position.y - newY;
            const length = Math.sqrt(dx * dx + dy * dy);
            if (length === 0) return;

            const scale = Math.min(length, 20) / length;
            const offsetX = dx * scale;
            const offsetY = dy * scale;

            text.position({
                x: newX + offsetX,
                y: newY + offsetY
            });
        });

        text.on('dragend', (e) => {
            if (this.mode !== 'edit') return;

            // Compute new offset relative to shape center
            let shape = shapeNode.type;
            let shapeX = 0, shapeY = 0;

            if (shape.type === 'Point') {
                shapeX = shapeNode.node.x();
                shapeY = shapeNode.node.y();
            }
            
            else if (['Segment', 'Line', 'Ray', 'Vector'].includes(shape.type)) {
                const pts = (shapeNode.node as Konva.Line).points();
                shapeX = (pts[0] + pts[2]) / 2;
                shapeY = (pts[1] + pts[3]) / 2;
            }
            
            else if (shape.type === 'Circle') {
                shapeX = shapeNode.node.x();
                shapeY = shapeNode.node.y();
            }
            
            else if (shapeNode.type.type === 'Polygon') {
                const pts = (shapeNode.node as Konva.Line).points();
                for (let i = 0; i < pts.length; i += 2) {
                    shapeX += pts[i];
                    shapeY += pts[i + 1];
                }
                shapeX /= pts.length;
                shapeY /= pts.length;
            }

            else if (shape.type === 'Angle') {
                shapeX = shapeNode.node.x();
                shapeY = shapeNode.node.y();
            }

            const labelX = text.x();
            const labelY = text.y();

            // Save pixel offset
            shape.props.labelXOffset = labelX - shapeX * this.state.zoom_level - (this.layerMathObjectRef.current?.position().x ?? 0);
            shape.props.labelYOffset = labelY - shapeY * this.state.zoom_level - (this.layerMathObjectRef.current?.position().y ?? 0);
        });

        return text;
    }

    private createKonvaShape = (shape: Shape): Konva.Shape | undefined => {
        let konvaShape: Konva.Shape | undefined;
        switch (shape.type) {
            case 'Point':
                konvaShape = this.drawPoint(shape as Point, shape.props);
                break;
            
            case 'Line':
                konvaShape = this.drawLine(shape as Line, shape.props);
                break;
            
            case 'Segment':
                konvaShape = this.drawSegment(shape as Segment, shape.props);
                break;
            
            case 'Vector':
                konvaShape = this.drawVector(shape as Vector, shape.props);
                break;
            
            case 'Ray':
                konvaShape = this.drawRay(shape as Ray, shape.props);
                break;
            
            case 'Polygon':
                konvaShape = this.drawPolygon(shape as Polygon, shape.props);
                break;
            
            case 'Circle':
                konvaShape = this.drawCircle(shape as Circle, shape.props);
                break;
            
            case 'Angle':
                konvaShape = this.drawAngle(shape as Angle, shape.props);
                break;
        }

        return konvaShape;
    }

    private drawShapes = (): void => {
        if (!this.layerMathObjectRef.current) return;

        this.layerUnchangeVisualRef.current?.destroyChildren();
        this.layerAxisRef.current?.destroyChildren();
        this.layerGridRef.current?.destroyChildren();

        this.drawGrid();
        this.drawAxes();

        const visualPriority: Record<string, number> = {
            'Circle': 0,
            'Circle2Point': 1,
            'Circle3Point': 2,
            'Incircle3Point': 3,
            'Excircle': 4,
            'SemiCircle': 5,

            'Polygon': 6,

            'Line': 7,
            'Ray': 8,
            'ParallelLine': 9,

            'Segment': 10,
            'Vector': 11,
            'TangentLine': 12,
            'Median': 13,
            'PerpendicularLine': 14,
            'PerpendicularBisector': 15,

            'InternalAngleBisector': 16,
            'ExternalAngleBisector': 17,

            'Centroid': 18,
            'Orthocenter': 19,
            'Circumcenter': 20,
            'Incenter': 21,
            'Excenter': 22,
            'Midpoint': 23,
            'Intersection': 24,
            'Projection': 25,

            'Reflection': 26,
            'Rotation': 27,
            'Enlarge': 28,
            'Translation': 29,

            'Angle': 30,

            'Point': 31,
        };

        let shapeNode: ShapeNode[] = [];

        const children = [...this.layerMathObjectRef.current.getChildren()];

        children.forEach((node, id) => {
            if (!this.DAG.get(node.id())) {
                node.remove();
            }
            
            else {
                const idx = node.id();
                const n = this.DAG.get(idx);
                node.setAttrs((n as ShapeNode).node.getAttrs());
            }
        });

        this.DAG.forEach((node, key) => {
            if (!this.layerMathObjectRef.current?.findOne(`#${node.id}`)) {
                this.layerMathObjectRef.current?.add(node.node);
            }

            shapeNode.push((node as ShapeNode));
            this.layerUnchangeVisualRef.current?.add(this.createLabel(node as ShapeNode));
        })

        function sortShapesForZIndex(shapes: ShapeNode[]): ShapeNode[] {
            return shapes.sort((a, b) => (visualPriority[a.type.type] ?? 0) - (visualPriority[b.type.type] ?? 0));
        }

        shapeNode = sortShapesForZIndex(shapeNode);
        shapeNode.forEach((shape) => {
            shape.node.moveToTop();
        });
        
        this.layerGridRef.current?.draw();
        this.layerUnchangeVisualRef.current?.draw();
        this.layerAxisRef.current?.draw();
        this.layerMathObjectRef.current.draw();
    }

    private getExcelLabel(start: string, index: number): string {
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

    private getAngleLabel = (index: number): string => {
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

    private handlePointClick = () => {
        this.mode = 'point';
    }

    private handleLineClick = () => {
        this.mode = 'line';
    }

    private handleSegmentClick = () => {
        this.mode = 'segment';
    }

    private handleVectorClick = () => {
        this.mode = 'vector';
    }

    private handlePolygonClick = () => {
        this.mode = 'polygon';
    }

    private handleCircleClick = () => {
        this.mode = 'circle';
    }

    private handleRayClick = () => {
        this.mode = 'ray';
    }

    private handleEditClick = () => {
        this.mode = 'edit';
    }

    private handleDeleteClick = () => {
        this.mode = 'delete';
    }

    private handleAngleClick = () => {
        this.mode = 'angle';
    }

    private handleClearClick = () => {
        this.setState({
            shapes: [],
            polygonIndex: 0
        });

        this.selectedPoints = [];
        this.selectedShapes = [];
        this.DAG.clear();
        this.mode = 'edit';
        this.label_used = [];
        this.historyStack.push(clone(this.state, this.DAG, this.selectedPoints, this.selectedShapes, this.label_used));

        if (this.historyStack.length >= 100) {
            this.historyStack.splice(0, 1);
        }

        this.futureStack = [];
    }

    private handleUndoClick = () => {
        if (this.historyStack.length > 1) {
            this.futureStack.push(this.historyStack.pop()!);
            const prevState = this.historyStack[this.historyStack.length - 1];
            const copyState = clone(prevState.state, prevState.dag, prevState.selectedPoints, prevState.selectedShapes, prevState.label_used);

            this.layerMathObjectRef.current?.destroyChildren();

            this.DAG = copyState.dag;
            this.DAG.forEach((node, key) => {
                node.node.destroy();
                let tmpNode = this.createKonvaShape(node.type);
                if (tmpNode) {
                    node.node = tmpNode;
                    this.layerMathObjectRef.current?.add(node.node);
                }
            });

            this.selectedPoints = copyState.selectedPoints;
            this.selectedShapes = copyState.selectedShapes;
            this.label_used = copyState.label_used;
            this.setState(copyState.state);
            this.mode = 'edit';
        }

        else {
            const prevState = this.historyStack[0];
            const copyState = clone(prevState.state, prevState.dag, prevState.selectedPoints, prevState.selectedShapes, prevState.label_used);

            this.layerMathObjectRef.current?.destroyChildren();

            this.DAG = copyState.dag;
            this.DAG.forEach((node, key) => {
                node.node.destroy();
                let tmpNode = this.createKonvaShape(node.type);
                if (tmpNode) {
                    node.node = tmpNode;
                    this.layerMathObjectRef.current?.add(node.node);
                }
            });

            this.selectedPoints = copyState.selectedPoints;
            this.selectedShapes = copyState.selectedShapes;
            this.label_used = copyState.label_used;
            this.setState(copyState.state);
            this.mode = 'edit';
        }
    }

    private handleRedoClick = () => {
        if (this.futureStack.length > 0) {
            const nextState = this.futureStack.pop()!;
            this.historyStack.push(nextState);
            if (this.historyStack.length >= 100) {
                this.historyStack.splice(0, 1);
            }

            const copyState = clone(nextState.state, nextState.dag, nextState.selectedPoints, nextState.selectedShapes, nextState.label_used);

            this.layerMathObjectRef.current?.destroyChildren();

            this.DAG = copyState.dag;
            this.DAG.forEach((node, key) => {
                node.node.destroy();
                let tmpNode = this.createKonvaShape(node.type);
                if (tmpNode) {
                    node.node = tmpNode;
                    this.layerMathObjectRef.current?.add(node.node);
                }
            });

            this.selectedPoints = copyState.selectedPoints;
            this.selectedShapes = copyState.selectedShapes;
            this.label_used = copyState.label_used;
            this.setState(copyState.state);
            this.mode = 'edit';
        }
    }

    private handleDrawing = () => {
        if (!this.stageRef.current || !this.layerMathObjectRef.current) return;
        const pointer = this.stageRef.current.getPointerPosition();
        if (!pointer) return;

        let position = {
            x: (pointer.x - this.layerMathObjectRef.current.x()) / this.layerMathObjectRef.current.scaleX(),
            y: (pointer.y - this.layerMathObjectRef.current.y()) / this.layerMathObjectRef.current.scaleY()
        }

        position = snapToGrid(
            pointer,
            BASE_SPACING,
            this.state.axisTickInterval,
            this.props.width / 2,
            this.props.height / 2,
            this.layerMathObjectRef.current!
        )

        let shape = this.stageRef.current.getIntersection(pointer);
        if (['angle'].includes(this.mode) && ((shape && shape.id().includes('point-')) || !shape)) {
            // Remove the mouseover handler
            this.DAG.forEach((node, key) => {
                if (!key.includes('point-')) {
                    node.node.off('mouseover');
                }
            })
        }

        let scale: number | undefined = undefined;
        let rotFactor: {degree: number, CCW: boolean} | undefined = undefined;
        const snapToShape = (shape: Konva.Shape | null, pos: {x: number, y: number}): void => {
            if (!shape) {
                return;
            }

            else {
                let shapeNode = this.DAG.get(shape.id());
                if (shapeNode) {
                    if (shapeNode.type.type === 'Circle') {
                        const cx = (shapeNode as ShapeNode).node.x();
                        const cy = (shapeNode as ShapeNode).node.y();
                        const r = ((shapeNode as ShapeNode).node as Konva.Circle).radius();
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
                            }
                        }

                        else {
                            position = {
                                x: cx + (dx / dist) * r,
                                y: cy + (dy / dist) * r,
                            };

                            const angleFromXAxis = (v: {x: number, y: number}) => {
                                return (math.parse('atan2(y, x)').evaluate({x: v.x, y: v.y})) * 180 / Math.PI;
                            }

                            rotFactor = {
                                degree: angleFromXAxis({x: dx, y: dy}),
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

                        scale = projectPointOntoLineSegment (
                            pos, 
                            start,
                            end
                        );

                        position = {
                            x: start.x + (end.x - start.x) * scale,
                            y: start.y + (end.y - start.y) * scale
                        }
                    }

                    else if (shapeNode.type.type === 'Polygon') {
                        // Polygon
                        // Only restricts in its segments
                        let segmentDepends = shapeNode.dependsOn.slice((shapeNode.type as Polygon).points.length);
                        for (let i = 0; i < segmentDepends.length; i++) {
                            let s = this.DAG.get(segmentDepends[i]);
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

                            scale = projectPointOntoLineSegment (
                                pos, 
                                start,
                                end
                            );

                            position = {
                                x: start.x + (end.x - start.x) * scale,
                                y: start.y + (end.y - start.y) * scale
                            }

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

                    scale = projectPointOntoLineSegment (
                        pos, 
                        start,
                        end
                    );

                    position = {
                        x: start.x + (end.x - start.x) * scale,
                        y: start.y + (end.y - start.y) * scale
                    }
                }
            }

            let positionMath = this.layerMathObjectRef.current!.getAbsoluteTransform().copy().point(position);
            let tmpPos = snapToGrid(
                positionMath,
                BASE_SPACING,
                this.state.axisTickInterval,
                this.props.width / 2,
                this.props.height / 2,
                this.layerMathObjectRef.current!
            )

            let tmpStagePos = this.layerMathObjectRef.current!.getAbsoluteTransform().copy().point(tmpPos);
            const nodes = this.stageRef.current!.getAllIntersections(tmpStagePos);
            const tmpShape = nodes.find((node) =>
                node.getLayer() === this.layerMathObjectRef.current
            );
            
            if (tmpShape && (tmpShape?.id() === shape.id() || (['x-axis', 'y-axis'].includes(tmpShape?.id()) && (['x-axis', 'y-axis'].includes(shape.id()))))) {
                position = tmpPos;
            }
        }

        snapToShape(shape, position);
        const createPoint = (): void => {
            let found: boolean = false;
            this.DAG.forEach((node) => {
                if (node.type.type === 'Point') {
                    let p: Point = node.type as Point
                    // If the mouse is within 2 pixels of the point, don't create a new point
                    if (Math.sqrt(Math.pow(p.x - position.x, 2) + Math.pow(p.y - position.y, 2)) <= 5) {
                        found = true;
                        this.selectedPoints.push(p);
                        return;
                    }
                }
            })

            if (found) return;
            let label = this.getExcelLabel('A', 0);
            let index = 0;
            while (this.label_used.includes(label)) {
                index++;
                label = this.getExcelLabel('A', index);
            }

            this.label_used.push(label);
            let point = Factory.createPoint(
                createPointDefaultShapeProps(label),
                position.x,
                position.y
            );

            let pNode = this.createKonvaShape(point);
            if (shape) {
                pNode!.off('dragmove');
                pNode!.on('dragmove', (e) => {
                    if (this.mode !== 'edit' || !this.stageRef.current) {
                        return;
                    }

                    e.cancelBubble = true;
                    let stage = e.target.getStage();
                    let pos = {
                        x: 0,
                        y: 0
                    }

                    if (stage) {
                        stage.container().style.cursor = 'pointer';
                        pos = stage.getPointerPosition() ?? pos;
                    }

                    const updateFn = (node: ShapeNode): ShapeNode => {
                        snapToShape(shape, pos);
                        node.node.position(position);
                        point.x = position.x;
                        point.y = position.y;

                        if (this.layerUnchangeVisualRef.current) {
                            this.layerUnchangeVisualRef.current.getChildren().forEach((childNode, idx) => {
                                let id = childNode.id();
                                if (id === `label-${pNode!.id()}`) {
                                    childNode.setAttrs(this.createLabel(node).getAttrs());
                                    return;
                                }
                            })
                        }

                        return node;
                    };

                    this.updateAndPropagate(pNode!.id(), updateFn);
                })
            }
            

            if (!shape && position.x === this.props.width / 2 && position.y === this.props.height / 2) {
                pNode!.draggable(false);
                pNode!.off('dragstart dragmove');
                point.type = 'Intersection';
            }

            this.DAG.set(point.props.id, {
                id: point.props.id,
                type: point,
                node: pNode!,
                dependsOn: (!shape) ? [] : [shape.id()],
                scaleFactor: scale,
                rotationFactor: rotFactor
            });

            this.selectedPoints.push(point);
            this.setState({
                shapes: [...this.state.shapes, point.props.id]
            })
        };

        if (this.mode === 'point') {
            createPoint();
            this.selectedPoints = [];
        }

        else if (['line', 'segment', 'vector', 'ray'].includes(this.mode)) {
            createPoint();
            if (this.selectedPoints.length === 1) {
                return;
            }

            else {
                const [p1, p2] = this.selectedPoints;
                if (p1 === p2) {
                    this.selectedPoints.pop();
                    return;
                }

                let label = this.getExcelLabel(this.mode === 'vector' ? 'u' : 'f', 0);
                let index = 0;
                while (this.label_used.includes(label)) {
                    index++;
                    label = this.getExcelLabel(this.mode === 'vector' ? 'u' : 'f', index);
                }

                this.label_used.push(label);
                if (this.mode === 'line') {
                    const line: Line = Factory.createLine(
                        createLineDefaultShapeProps(label),
                        p1,
                        p2
                    )

                    this.DAG.set(line.props.id, {
                        id: line.props.id,
                        type: line,
                        node: this.createKonvaShape(line)!,
                        dependsOn: [p1.props.id, p2.props.id]
                    });

                    this.setState({
                        shapes: [...this.state.shapes, line.props.id]
                    });

                    this.selectedPoints = [];
                }

                else if (this.mode === 'segment') {
                    const segment: Segment = {
                        startSegment: p1,
                        endSegment: p2,
                        props: createLineDefaultShapeProps(label, 0, 0, 10, 0),
                        type: 'Segment'
                    }

                    this.DAG.set(segment.props.id, {
                        id: segment.props.id,
                        type: segment,
                        node: this.createKonvaShape(segment)!,
                        dependsOn: [p1.props.id, p2.props.id]
                    });

                    this.setState({
                        shapes: [...this.state.shapes, segment.props.id]
                    });

                    this.selectedPoints = [];
                }

                else if (this.mode === 'vector') {
                    const vector: Vector = {
                        startVector: p1,
                        endVector: p2,
                        props: createLineDefaultShapeProps(label, 0, 0, 10, 0),
                        type: 'Vector'
                    }

                    this.DAG.set(vector.props.id, {
                        id: vector.props.id,
                        type: vector,
                        node: this.createKonvaShape(vector)!,
                        dependsOn: [p1.props.id, p2.props.id]
                    });

                    this.setState({
                        shapes: [...this.state.shapes, vector.props.id],
                    });

                    this.selectedPoints = [];
                }

                else if (this.mode === 'ray') {
                    const ray: Ray = {
                        startRay: p1,
                        endRay: p2,
                        props: createLineDefaultShapeProps(label, 0, 0, 10, 0),
                        type: 'Ray'
                    }

                    this.DAG.set(ray.props.id, {
                        id: ray.props.id,
                        type: ray,
                        node: this.createKonvaShape(ray)!,
                        dependsOn: [p1.props.id, p2.props.id]
                    });

                    this.setState({
                        shapes: [...this.state.shapes, ray.props.id],
                    });

                    this.selectedPoints = [];
                }
            }
        }

        else if (this.mode === 'polygon') {
            createPoint();
            if (this.selectedPoints.length < 4) {
                let points = this.selectedPoints;
                const lastPoint = points[points.length - 1];
                for (let i = 0; i < points.length - 1; i++) {
                    if (points[i] === lastPoint) {
                        this.selectedPoints.splice(i, 1);
                        this.selectedPoints.pop();
                        return;
                    }
                }

                return;
            }
            
            else {
                let points = this.selectedPoints;
                if (points[0] !== points[points.length - 1]) {
                    for (let i = 1; i < points.length - 1; i++) {
                        if (points[i] === points[points.length - 1]) {
                            this.selectedPoints.splice(i, 1);
                            this.selectedPoints.pop();
                            return;
                        }
                    }

                    return;
                }

                else {
                    points.pop();
                    let label = `poly${this.state.polygonIndex + 1}`;
                    const polygon: Polygon = Factory.createPolygon(
                        createPolygonDefaultShapeProps(label, 0, 0, 10, 0),
                        points
                    )

                    let dependencies: string[] = [];
                    dependencies = points.map(point => point.props.id);
                    let shapes = this.state.shapes;

                    for (let i = 0; i < points.length; i++) {
                        let p = points[i];
                        let pNext = points[(i + 1) % points.length];
                        let label = this.getExcelLabel('a', 0);
                        let index = 0;
                        while (this.label_used.includes(label)) {
                            index++;
                            label = this.getExcelLabel('a', index);
                        }

                        this.label_used.push(label);
                        let segment = Factory.createSegment(
                            createLineDefaultShapeProps(label),
                            p,
                            pNext
                        );

                        segment.props.color = polygon.props.color;

                        this.DAG.set(segment.props.id, {
                            id: segment.props.id,
                            type: segment,
                            node: this.createKonvaShape(segment)!,
                            dependsOn: [p.props.id, pNext.props.id, polygon.props.id]
                        });

                        shapes = [...shapes, segment.props.id];
                    }

                    this.DAG.set(polygon.props.id, {
                        id: polygon.props.id,
                        type: polygon,
                        node: this.createKonvaShape(polygon)!,
                        dependsOn: dependencies
                    });

                    this.setState({
                        polygonIndex: this.state.polygonIndex + 1,
                        shapes: [...shapes, polygon.props.id]
                    });

                    this.selectedPoints = [];
                }
            }
        }

        else if (this.mode === 'circle') {
            createPoint();
            const point = this.selectedPoints[0];
            let pNode = this.DAG.get(point.props.id);
            pNode?.node.draggable(false);
            let input = prompt('Enter the radius of the circle');
            if (!input) return;
            try {
                const radius = math.evaluate(input);
                if (typeof radius !== 'number' || radius <= 0) {
                    alert('Invalid radius');
                    pNode?.node.draggable(true);
                    return;
                }

                let label = this.getExcelLabel('c', 0);
                let index = 0;
                while (this.label_used.includes(label)) {
                    index++;
                    label = this.getExcelLabel('c', index);
                }

                this.label_used.push(label);
                
                const circle: Circle = Factory.createCircle(
                    createCircleDefaultShapeProps(label, radius, 0, 10, 0),
                    point,
                    radius
                )  

                this.DAG.set(circle.props.id, {
                    id: circle.props.id,
                    type: circle,
                    node: this.createKonvaShape(circle)!,
                    dependsOn: [point.props.id]
                });

                this.setState({
                    shapes: [...this.state.shapes, circle.props.id]
                });

                this.selectedPoints = [];
            }

            catch (error) {
                pNode?.node.draggable(true);
                alert('Invalid expression for radius');
            }
        }

        else if (this.mode === 'angle') {
            if (!shape) {
                createPoint();
                let p = this.selectedPoints.pop()!;
                let pNode = this.DAG.get(p.props.id);
                if (!pNode) return;
                this.selectedShapes = this.selectedShapes.filter(item => item.props.id.includes('point-'));
                this.selectedShapes.push(pNode.type);
            }

            else {
                if (this.selectedShapes.length === 0) {
                    let pNode = this.DAG.get(shape.id());
                    if (!pNode) {
                        let l: Line = Factory.createLine(
                            createLineDefaultShapeProps(shape.id()),
                            Factory.createPoint(
                                createPointDefaultShapeProps(''),
                                this.props.width / 2,
                                this.props.height / 2
                            ),

                            Factory.createPoint(
                                createPointDefaultShapeProps(''),
                                this.props.width / 2 + (shape.id().includes('x-axis') ? 1 : 0),
                                this.props.height / 2 + (shape.id().includes('y-axis') ? 1 : 0)
                            ),
                        )

                        this.selectedShapes.push(l);
                    }
                    
                    else {
                        this.selectedShapes.push(pNode.type);
                    }
                }

                else {
                    let tempSelected = this.selectedShapes.filter(item => item.props.id.includes('point-'));
                    if (tempSelected.length > 0) {
                        return;
                    }

                    else {
                        let pNode = this.DAG.get(shape.id());
                        if (!pNode) {
                            // Handle Axis Arrows:
                            let l: Line = Factory.createLine(
                                createLineDefaultShapeProps(shape.id()),
                                Factory.createPoint(
                                    createPointDefaultShapeProps(''),
                                    (shape as Konva.Arrow).points()[0],
                                    (shape as Konva.Arrow).points()[1]
                                ),

                                Factory.createPoint(
                                    createPointDefaultShapeProps(''),
                                    (shape as Konva.Arrow).points()[2],
                                    (shape as Konva.Arrow).points()[3]
                                ),
                            )

                            this.selectedShapes.push(l);
                        }

                        else {
                            this.selectedShapes.push(pNode.type);
                        }
                    }
                }
            }

            if (this.selectedShapes.length === 2) {
                if (this.selectedShapes[0].props.id.includes('point-')) {
                    // All points selected
                    if (this.selectedShapes[1] === this.selectedShapes[0]) {
                        // Click the same point
                        this.selectedShapes = [];
                    }

                    return;
                }

                else {
                    // 2 lines
                    // convert them to Line
                    let [start1, end1] = operation.getStartAndEnd(this.selectedShapes[0]);
                    let [start2, end2] = operation.getStartAndEnd(this.selectedShapes[1]);

                    this.selectedShapes = [
                        Factory.createLine(
                            this.selectedShapes[0].props,
                            Factory.createPoint(
                                createPointDefaultShapeProps(''),
                                start1.x,
                                start1.y,
                                start1.z
                            ),
                            Factory.createPoint(
                                createPointDefaultShapeProps(''),
                                end1.x,
                                end1.y,
                                end1.z
                            ),
                        ),
                        Factory.createLine(
                            this.selectedShapes[1].props,
                            Factory.createPoint(
                                createPointDefaultShapeProps(''),
                                start2.x,
                                start2.y,
                                start2.z
                            ),
                            Factory.createPoint(
                                createPointDefaultShapeProps(''),
                                end2.x,
                                end2.y,
                                end2.z
                            ),
                        )
                    ]
                    
                    let vertex = operation.getIntersections2D(
                        this.selectedShapes[0],
                        this.selectedShapes[1]
                    )

                    if (vertex.length === 0) {
                        return;
                    }

                    let tmpVertex = Factory.createPoint(
                        createPointDefaultShapeProps(''),
                        vertex[0].x,
                        vertex[0].y,
                        vertex[0].z
                    )

                    const angleFromXAxis = (v: {x: number, y: number}) => {
                        return (math.parse('atan2(y, x)').evaluate({x: v.x, y: v.y})) * 180 / Math.PI;
                    }

                    let startAngle = angleFromXAxis({
                        x: (end1.x - vertex[0].x) / math.parse('sqrt(x^2 + y^2)').evaluate({x: end1.x - vertex[0].x, y: end1.y - vertex[0].y}),
                        y: (end1.y - vertex[0].y) / math.parse('sqrt(x^2 + y^2)').evaluate({x: end1.x - vertex[0].x, y: end1.y - vertex[0].y}),
                    });

                    let degree = operation.angleBetweenLines(
                        this.selectedShapes[0],
                        this.selectedShapes[1]
                    );

                    let label = this.getAngleLabel(0);
                    let idx = 0;
                    while (this.label_used.includes(label)) {
                        idx++;
                        label = this.getAngleLabel(idx);
                    }

                    this.label_used.push(label);

                    let a = Factory.createAngle(
                        createAngleDefaultShapeProps(`${label}`),
                        tmpVertex,
                        startAngle,
                        degree
                    )

                    this.DAG.set(a.props.id, {
                        id: a.props.id,
                        dependsOn: [this.selectedShapes[0].props.id, this.selectedShapes[1].props.id],
                        type: a,
                        node: this.drawAngle(a, a.props)!
                    });

                    this.selectedShapes = [];
                    this.selectedPoints = [];

                    this.setState({
                        shapes: [...this.state.shapes, a.props.id]
                    })
                }
            }

            else if (this.selectedShapes.length === 3) {
                let [point1, point2, point3] = [
                    this.selectedShapes[0] as Point,
                    this.selectedShapes[1] as Point,
                    this.selectedShapes[2] as Point,
                ]

                const angleFromXAxis = (v: {x: number, y: number}) => {
                    return (math.parse('atan2(y, x)').evaluate({x: v.x, y: v.y})) * 180 / Math.PI;
                }

                let startAngle = angleFromXAxis({
                    x: (point1.x - point2.x) / math.parse('sqrt(x^2 + y^2)').evaluate({x: point1.x - point2.x, y: point1.y - point2.y}),
                    y: (point1.y - point2.y) / math.parse('sqrt(x^2 + y^2)').evaluate({x: point1.x - point2.x, y: point1.y - point2.y}),
                });

                let angle = operation.angleBetween3Points(point1, point2, point3);

                let label = this.getAngleLabel(0);
                let idx = 0;
                while (this.label_used.includes(label)) {
                    idx++;
                    label = this.getAngleLabel(idx);
                }

                this.label_used.push(label);

                let a = Factory.createAngle(
                    createAngleDefaultShapeProps(`${label}`),
                    point2,
                    startAngle,
                    angle
                )

                this.DAG.set(a.props.id, {
                    id: a.props.id,
                    dependsOn: [this.selectedShapes[0].props.id, this.selectedShapes[1].props.id],
                    type: a,
                    node: this.drawAngle(a, a.props)!
                });

                this.selectedShapes = [];
                this.selectedPoints = [];

                this.setState({
                    shapes: [...this.state.shapes, a.props.id]
                })
            }
        }

        this.historyStack.push(clone(this.state, this.DAG, this.selectedPoints, this.selectedShapes, this.label_used));

        if (this.historyStack.length >= 100) {
            this.historyStack.splice(0, 1);
        }
        
        this.futureStack = [];
    }

    private findChildren = (id: string): string[] => {
        if (!this.DAG.get(id)) {
            return [];
        }

        let children: string[] = [];
        this.DAG.forEach((value, key) => {
            if (value.dependsOn.includes(id)) {
                children.push(key)
            }
        })

        return children;
    } 

    private updateAndPropagate = (id: string, updateFn: (node: ShapeNode) => ShapeNode) => {
        const node = this.DAG.get(id);
        if (!node) return;

        const visited = new Set<string>();
        const stack: string[] = [];

        // Perform topological sort to get nodes in dependency order
        const topologicalSort = (nodeId: string) => {
            if (visited.has(nodeId)) return;
            visited.add(nodeId);
            this.findChildren(nodeId).forEach(childId => topologicalSort(childId));
            stack.push(nodeId);
        };

        topologicalSort(id);
        const updated = updateFn(node as ShapeNode);
        this.DAG.set(id, updated);

        stack.reverse().forEach(nodeId => {
            if (nodeId !== id) { // Skip the initial node
                const node = this.DAG.get(nodeId) as ShapeNode;
                if (node) {
                    this.DAG.set(nodeId, this.computeUpdateFor(node));
                }
            }
        });
    }

    private computeUpdateFor = (node: ShapeNode): ShapeNode => {
        let map = {
            'Point': this.updatePoint,
            'Segment': this.updateSegment,
            'Line': this.updateLine,
            'Ray': this.updateRay,
            'Polygon': this.updatePolygon,
            'Circle': this.updateCircle,
            'Vector': this.updateVector,
            'Circle2Point': this.updateCircle2Point,
            'Intersection': this.updateIntersection,
            'Midpoint': this.updateMidpoint, 
            'Centroid': this.updateCentroid,
            'Orthocenter': this.updateOrthocenter,
            'Circumcenter': this.updateCircumcenter,
            'Incenter': this.updateIncenter,
            'AngleBisector': this.updateAngleBisector,
            'Incircle3Point': this.updateIncircle3Point,
            'PerpendicularBisector': this.updatePerpendicularBisector,
            'PerpendicularLine': this.updatePerpendicularLine,
            'TangentLine': this.updateTangentLine,
            'Median': this.updateMedian,
            'ParallelLine': this.updateParallelLine,
            'Circle3Point': this.updateCircle3Point,
            'SemiCircle': this.updateSemiCircle, 
            'Angle': this.updateAngle,
            'Reflection': this.updateReflection, 
            'Rotation': this.updateRotation,
            'Projection': this.updateProjection,
            'Enlarge': this.updateEnlarge,
            'Excenter': this.updateExcenter,
            'Excircle': this.updateExcircle
        }

        if (node.type.type in map) {
            // Type assertion ensures only valid keys are used
            return map[node.type.type as keyof typeof map](node);
        }

        return node;
    }

    private updatePoint = (node: ShapeNode): ShapeNode => {
        if (node.dependsOn.length === 1) {
            let shape = this.DAG.get(node.dependsOn[0]);
            if (!shape) return { ...node };
            if (node.scaleFactor) {
                let l = ['Segment', 'Line', 'Ray'].includes(shape.type.type) ? shape.node as Konva.Line : shape.node as Konva.Arrow;
                let d = {
                    x: l.points()[2] - l.points()[0],
                    y: l.points()[3] - l.points()[1]
                }

                node.node.position({x: l.points()[0] + node.scaleFactor * d.x, y: l.points()[1] + node.scaleFactor * d.y});
            }

            else if (node.rotationFactor) {
                if (!(shape.type.type === 'SemiCircle')) {
                    let c = shape.node as Konva.Circle;
                    const cx = c.x();
                    const cy = c.y();
                    const r = c.radius();
                    const angle = Konva.getAngle(node.rotationFactor.degree);

                    const newX = cx + r * Math.cos(angle);
                    const newY = cy + r * Math.sin(angle);
                    node.node.position({ x: newX, y: newY });
                }
                
                else {
                    let c = shape.node as Konva.Arc;
                    const cx = c.x();
                    const cy = c.y();
                    const r = c.outerRadius();
                    const angle = Konva.getAngle(node.rotationFactor.degree);

                    const newX = cx + r * Math.cos(angle);
                    const newY = cy - r * Math.sin(angle);
                    node.node.position({ x: newX, y: newY });
                }
            }
        }

        if (this.layerUnchangeVisualRef.current) {
            this.layerUnchangeVisualRef.current.getChildren().forEach((childNode, idx) => {
                let id = childNode.id();
                if (id === `label-${node.node.id()}`) {
                    childNode.setAttrs(this.createLabel(node).getAttrs());
                    return;
                }
            })
        }

        (node.type as Point).x = node.node.x();
        (node.type as Point).y = node.node.y();
        return { ...node }
    }

    private updateSegment = (node: ShapeNode): ShapeNode => {
        const [id1, id2] = node.dependsOn;
        const p1 = this.DAG.get(id1);
        const p2 = this.DAG.get(id2);
        if (!p1 || !p2) return { ...node };

        const posA = (p1 as ShapeNode).node.position();
        const posB = (p2 as ShapeNode).node.position();

        const line = node.node as Konva.Line;
        line.points([posA.x, posA.y, posB.x, posB.y]);
        if (this.layerUnchangeVisualRef.current) {
            this.layerUnchangeVisualRef.current.getChildren().forEach((childNode, idx) => {
                let id = childNode.id();
                if (id === `label-${node.node.id()}`) {
                    childNode.setAttrs(this.createLabel(node).getAttrs());
                    return;
                }
            })
        }

        [(node.type as Segment).startSegment.x, (node.type as Segment).startSegment.y] = [posA.x, posA.y];
        [(node.type as Segment).endSegment.x, (node.type as Segment).endSegment.y] = [posB.x, posB.y];
        return { ...node };
    }

    private updateLine = (node: ShapeNode): ShapeNode => {
        const [id1, id2] = node.dependsOn;
        const p1 = this.DAG.get(id1);
        const p2 = this.DAG.get(id2);
        if (!p1 || !p2) return { ...node };

        const posA = (p1 as ShapeNode).node.position();
        const posB = (p2 as ShapeNode).node.position();

        const dx = posB.x - posA.x;
        const dy = posB.y - posA.y;

        let length = 2 * Math.max(this.props.width, this.props.height) * Math.sqrt(dx * dx + dy * dy) / this.state.zoom_level;
        let norm_dx = dx / Math.sqrt(dx * dx + dy * dy);
        let norm_dy = dy / Math.sqrt(dx * dx + dy * dy);

        const line = node.node as Konva.Line;
        line.points([posA.x - length * norm_dx, posA.y - length * norm_dy, posB.x + length * norm_dx, posB.y + length * norm_dy]);

        if (this.layerUnchangeVisualRef.current) {
            this.layerUnchangeVisualRef.current.getChildren().forEach((childNode, idx) => {
                let id = childNode.id();
                if (id === `label-${node.node.id()}`) {
                    childNode.setAttrs(this.createLabel(node).getAttrs());
                    return;
                }
            })
        }

        [(node.type as Line).startLine.x, (node.type as Line).startLine.y] = [posA.x, posA.y];
        [(node.type as Line).endLine.x, (node.type as Line).endLine.y] = [posB.x, posB.y];
        return { ...node };
    }

    private updateRay = (node: ShapeNode): ShapeNode => {
        const [id1, id2] = node.dependsOn;
        const p1 = this.DAG.get(id1);
        const p2 = this.DAG.get(id2);
        if (!p1 || !p2) return { ...node };

        const posA = (p1 as ShapeNode).node.position();
        const posB = (p2 as ShapeNode).node.position();

        const dx = posB.x - posA.x;
        const dy = posB.y - posA.y;

        let length = 2 * Math.max(this.props.width, this.props.height) * Math.sqrt(dx * dx + dy * dy) / this.state.zoom_level;
        let norm_dx = dx / Math.sqrt(dx * dx + dy * dy);
        let norm_dy = dy / Math.sqrt(dx * dx + dy * dy);

        const line = node.node as Konva.Line;
        line.points([posA.x, posA.y, posB.x + length * norm_dx, posB.y + length * norm_dy]);

        if (this.layerUnchangeVisualRef.current) {
            this.layerUnchangeVisualRef.current.getChildren().forEach((childNode, idx) => {
                let id = childNode.id();
                if (id === `label-${node.node.id()}`) {
                    childNode.setAttrs(this.createLabel(node).getAttrs());
                    return;
                }
            })
        }

        [(node.type as Ray).startRay.x, (node.type as Ray).startRay.y] = [posA.x, posA.y];
        [(node.type as Ray).endRay.x, (node.type as Ray).endRay.y] = [posB.x, posB.y];
        return { ...node };
    }

    private updatePolygon = (node: ShapeNode): ShapeNode => {
        const pointIds = node.dependsOn;
        const points: number[] = [];
        for (const pid of pointIds) {
            const pointNode = this.DAG.get(pid);
            if (!pointNode) {
                return { ...node };
            }

            const pos = (pointNode as ShapeNode).node.position();
            points.push(pos.x, pos.y);
        }

        const polygon = node.node as Konva.Line;
        polygon.points(points);

        (node.type as Polygon).points.forEach((point, idx) => {
            point.x = polygon.points()[2 * idx];
            point.y = polygon.points()[2 * idx + 1];
        })

        if (this.layerUnchangeVisualRef.current) {
            this.layerUnchangeVisualRef.current.getChildren().forEach((childNode, idx) => {
                let id = childNode.id();
                if (id === `label-${node.node.id()}`) {
                    childNode.setAttrs(this.createLabel(node).getAttrs());
                    return;
                }
            })
        }

        return { ...node };
    }

    private updateCircle = (node: ShapeNode): ShapeNode => {
        let id = node.dependsOn[0];
        let centerNode = this.DAG.get(id);
        if (!centerNode) {
            return { ...node };
        }

        let circleNode = node.node as Konva.Circle;
        circleNode.position((centerNode as ShapeNode).node.position());

        if (this.layerUnchangeVisualRef.current) {
            this.layerUnchangeVisualRef.current.getChildren().forEach((childNode, idx) => {
                let id = childNode.id();
                if (id === `label-${node.node.id()}`) {
                    childNode.setAttrs(this.createLabel(node).getAttrs());
                    return;
                }
            })
        }

        [(node.type as Circle).centerC.x, (node.type as Circle).centerC.y] = [circleNode.x(), circleNode.y()];
        return { ...node };
    }

    private updateVector = (node: ShapeNode): ShapeNode => {
        const [id1, id2] = node.dependsOn;
        const [start, end] = [this.DAG.get(id1), this.DAG.get(id2)];
        if (!start || !end) {
            return { ...node };
        }

        const posA = (start as ShapeNode).node.position();
        const posB = (end as ShapeNode).node.position();
        
        let vectorNode = node.node as Konva.Arrow;
        vectorNode.points([posA.x, posA.y, posB.x, posB.y]);
        [(node.type as Vector).startVector.x, (node.type as Vector).startVector.y] = [posA.x, posA.y];
        [(node.type as Vector).endVector.x, (node.type as Vector).endVector.y] = [posB.x, posB.y];

        if (this.layerUnchangeVisualRef.current) {
            this.layerUnchangeVisualRef.current.getChildren().forEach((childNode, idx) => {
                let id = childNode.id();
                if (id === `label-${node.node.id()}`) {
                    childNode.setAttrs(this.createLabel(node).getAttrs());
                    return;
                }
            })
        }

        return { ...node };
    }

    private updateMidpoint = (node: ShapeNode): ShapeNode => {
        const [id1, id2] = node.dependsOn;
        const [start, end] = [this.DAG.get(id1), this.DAG.get(id2)];
        if (!start || !end) {
            return { ...node };
        }

        const posA = (start as ShapeNode).node.position();
        const posB = (end as ShapeNode).node.position();
        
        let point = node.node as Konva.Circle;
        point.position({x: (posA.x + posB.x) / 2, y: (posA.y + posB.y) / 2});

        if (this.layerUnchangeVisualRef.current) {
            this.layerUnchangeVisualRef.current.getChildren().forEach((childNode, idx) => {
                let id = childNode.id();
                if (id === `label-${node.node.id()}`) {
                    childNode.setAttrs(this.createLabel(node).getAttrs());
                    return;
                }
            })
        }

        [(node.type as Point).x, (node.type as Point).x] = [point.x(), point.y()];
        return { ...node };
    }

    private updateCentroid = (node: ShapeNode): ShapeNode => {
        const [id1, id2, id3] = node.dependsOn;
        const [p1, p2, p3] = [this.DAG.get(id1), this.DAG.get(id2), this.DAG.get(id3)];
        if (!p1 || !p2 || !p3) {
            return { ...node };
        }

        const posA = (p1 as ShapeNode).node.position();
        const posB = (p2 as ShapeNode).node.position();
        const posC = (p3 as ShapeNode).node.position();
        
        let [A, B, C] = [
            Factory.createPoint(node.type.props, posA.x, posA.y),
            Factory.createPoint(node.type.props, posB.x, posB.y),
            Factory.createPoint(node.type.props, posC.x, posC.y)
        ]

        try {
            let ortho = operation.centroid(A, B, C);
            let point = node.node as Konva.Circle;
            point.position({x: ortho.x as number, y: ortho.y as number});
            point.show();

            if (this.layerUnchangeVisualRef.current) {
                this.layerUnchangeVisualRef.current.getChildren().forEach((childNode, idx) => {
                    let id = childNode.id();
                    if (id === `label-${node.node.id()}`) {
                        childNode.setAttrs(this.createLabel(node).getAttrs());
                        childNode.show();
                        return;
                    }
                })
            }

            [(node.type as Point).x, (node.type as Point).x] = [point.x(), point.y()];
            return { ...node };
        }

        catch (error) {
            node.node.hide();
            if (this.layerUnchangeVisualRef.current) {
                this.layerUnchangeVisualRef.current.getChildren().forEach((childNode, idx) => {
                    let id = childNode.id();
                    if (id === `label-${node.node.id()}`) {
                        childNode.hide();
                        return;
                    }
                })
            }

            return { ...node };
        }
    }

    private updateOrthocenter = (node: ShapeNode): ShapeNode => {
        const [id1, id2, id3] = node.dependsOn;
        const [p1, p2, p3] = [this.DAG.get(id1), this.DAG.get(id2), this.DAG.get(id3)];
        if (!p1 || !p2 || !p3) {
            return { ...node };
        }

        const posA = (p1 as ShapeNode).node.position();
        const posB = (p2 as ShapeNode).node.position();
        const posC = (p3 as ShapeNode).node.position();

        let [A, B, C] = [
            Factory.createPoint(node.type.props, posA.x, posA.y),
            Factory.createPoint(node.type.props, posB.x, posB.y),
            Factory.createPoint(node.type.props, posC.x, posC.y)
        ]

        try {
            let ortho = operation.orthocenter(A, B, C);
            let point = node.node as Konva.Circle;
            point.position({x: ortho.x as number, y: ortho.y as number});
            point.show();
            if (this.layerUnchangeVisualRef.current) {
                this.layerUnchangeVisualRef.current.getChildren().forEach((childNode, idx) => {
                    let id = childNode.id();
                    if (id === `label-${node.node.id()}`) {
                        childNode.show();
                        childNode.setAttrs(this.createLabel(node).getAttrs());
                        return;
                    }
                })
            }

            [(node.type as Point).x, (node.type as Point).x] = [point.x(), point.y()];
            return { ...node };
        }

        catch (error) {
            node.node.hide();
            if (this.layerUnchangeVisualRef.current) {
                this.layerUnchangeVisualRef.current.getChildren().forEach((childNode, idx) => {
                    let id = childNode.id();
                    if (id === `label-${node.node.id()}`) {
                        childNode.hide();
                        return;
                    }
                })
            }

            return { ...node };
        }
    }

    private updateCircumcenter = (node: ShapeNode): ShapeNode => {
        const [id1, id2, id3] = node.dependsOn;
        const [p1, p2, p3] = [this.DAG.get(id1), this.DAG.get(id2), this.DAG.get(id3)];
        if (!p1 || !p2 || !p3) {
            return { ...node };
        }

        const posA = (p1 as ShapeNode).node.position();
        const posB = (p2 as ShapeNode).node.position();
        const posC = (p3 as ShapeNode).node.position();

        let [A, B, C] = [
            Factory.createPoint(node.type.props, posA.x, posA.y),
            Factory.createPoint(node.type.props, posB.x, posB.y),
            Factory.createPoint(node.type.props, posC.x, posC.y)
        ]

        try {
            let ortho = operation.circumcenter(A, B, C);
            let point = node.node as Konva.Circle;
            point.position({x: ortho.x as number, y: ortho.y as number});
            point.show();

            if (this.layerUnchangeVisualRef.current) {
                this.layerUnchangeVisualRef.current.getChildren().forEach((childNode, idx) => {
                    let id = childNode.id();
                    if (id === `label-${node.node.id()}`) {
                        childNode.setAttrs(this.createLabel(node).getAttrs());
                        childNode.show();
                        return;
                    }
                })
            }

            [(node.type as Point).x, (node.type as Point).x] = [point.x(), point.y()];
            return { ...node };
        }

        catch (error) {
            node.node.hide();
            if (this.layerUnchangeVisualRef.current) {
                this.layerUnchangeVisualRef.current.getChildren().forEach((childNode, idx) => {
                    let id = childNode.id();
                    if (id === `label-${node.node.id()}`) {
                        childNode.hide();
                        return;
                    }
                })
            }

            return { ...node };
        }
    }

    private updateIncenter = (node: ShapeNode): ShapeNode => {
        const [id1, id2, id3] = node.dependsOn;
        const [p1, p2, p3] = [this.DAG.get(id1), this.DAG.get(id2), this.DAG.get(id3)];
        if (!p1 || !p2 || !p3) {
            return { ...node };
        }

        const posA = (p1 as ShapeNode).node.position();
        const posB = (p2 as ShapeNode).node.position();
        const posC = (p3 as ShapeNode).node.position();

        let [A, B, C] = [
            Factory.createPoint(node.type.props, posA.x, posA.y),
            Factory.createPoint(node.type.props, posB.x, posB.y),
            Factory.createPoint(node.type.props, posC.x, posC.y)
        ]

        try {
            let ortho = operation.incenter(A, B, C);
            let point = node.node as Konva.Circle;
            point.position({x: ortho.x as number, y: ortho.y as number});
            point.show();

            if (this.layerUnchangeVisualRef.current) {
                this.layerUnchangeVisualRef.current.getChildren().forEach((childNode, idx) => {
                    let id = childNode.id();
                    if (id === `label-${node.node.id()}`) {
                        childNode.setAttrs(this.createLabel(node).getAttrs());
                        childNode.show();
                        return;
                    }
                })
            }

            [(node.type as Point).x, (node.type as Point).x] = [point.x(), point.y()];
            return { ...node };
        }

        catch (error) {
            node.node.hide();
            if (this.layerUnchangeVisualRef.current) {
                this.layerUnchangeVisualRef.current.getChildren().forEach((childNode, idx) => {
                    let id = childNode.id();
                    if (id === `label-${node.node.id()}`) {
                        childNode.hide();
                        return;
                    }
                })
            }

            return { ...node };
        }
    }

    private updateCircle2Point = (node: ShapeNode): ShapeNode => {
        const [id1, id2] = node.dependsOn;
        const [start, end] = [this.DAG.get(id1), this.DAG.get(id2)];
        if (!start || !end) {
            return { ...node };
        }

        const posA = (start as ShapeNode).node.position();
        const posB = (end as ShapeNode).node.position();
        
        let point = node.node as Konva.Circle;
        point.position({x: posA.x, y: posA.y});
        point.radius(Math.hypot(posB.x - posA.x, posB.y - posA.y));

        [
            (node.type as Circle).centerC.x,
            (node.type as Circle).centerC.y,
            (node.type as Circle).radius
        ] = [
            posA.x,
            posA.y,
            Math.hypot(posB.x - posA.x, posB.y - posA.y)
        ]

        if (this.layerUnchangeVisualRef.current) {
            this.layerUnchangeVisualRef.current.getChildren().forEach((childNode, idx) => {
                let id = childNode.id();
                if (id === `label-${node.node.id()}`) {
                    childNode.setAttrs(this.createLabel(node).getAttrs());
                    return;
                }
            })
        }

        return { ...node };
    }

    private updateIntersection = (node: ShapeNode): ShapeNode => {
        const [id1, id2] = node.dependsOn;
        const shape1 = this.DAG.get(id1);
        const shape2 = this.DAG.get(id2);

        if (!shape1 || !shape2) {
            return { ...node };
        }

        const intersections = operation.getIntersections2D(shape1.type, shape2.type);
        if (!intersections || intersections.length === 0) {
            node.node.hide();
            if (this.layerUnchangeVisualRef.current) {
                this.layerUnchangeVisualRef.current.getChildren().forEach((childNode, idx) => {
                    let id = childNode.id();
                    if (id === `label-${node.node.id()}`) {
                        childNode.hide();
                        return;
                    }
                })
            }

            return { ...node };
        }

        const nodePos = node.node.position();

        // Match by closest distance
        let closest = intersections[0];
        let minDist = Math.hypot(nodePos.x - closest.x, nodePos.y - closest.y);

        for (let i = 1; i < intersections.length; i++) {
            const d = Math.hypot(nodePos.x - intersections[i].x, nodePos.y - intersections[i].y);
            if (d < minDist) {
                minDist = d;
                closest = intersections[i];
            }
        }

        node.node.position(closest);
        node.node.show();

        if (this.layerUnchangeVisualRef.current) {
            this.layerUnchangeVisualRef.current.getChildren().forEach((childNode, idx) => {
                let id = childNode.id();
                if (id === `label-${node.node.id()}`) {
                    childNode.setAttrs(this.createLabel(node).getAttrs());
                    childNode.show();
                    return;
                }
            })
        }

        [(node.type as Point).x, (node.type as Point).y] = [closest.x, closest.y];
        return { ...node };
    }

    private updateMedian = (node: ShapeNode): ShapeNode => {
        const [id1, id2, id3] = node.dependsOn;
        const shape1 = this.DAG.get(id1);
        const shape2 = this.DAG.get(id2);
        const shape3 = this.DAG.get(id3);

        if (!shape1 || !shape2 || !shape3) {
            return { ...node };
        }

        let [posA, posB, posC] = [(shape1 as ShapeNode).node, (shape2 as ShapeNode).node, (shape3 as ShapeNode).node]
        
        let [A, B, C] = [
            Factory.createPoint(node.type.props, posA.x(), posA.y()),
            Factory.createPoint(node.type.props, posB.x(), posB.y()),
            Factory.createPoint(node.type.props, posC.x(), posC.y())
        ];

        if (operation.isColinear(A, B, C)) {
            node.node.hide();
            if (this.layerUnchangeVisualRef.current) {
                this.layerUnchangeVisualRef.current.getChildren().forEach((childNode, idx) => {
                    let id = childNode.id();
                    if (id === `label-${node.node.id()}`) {
                        childNode.hide();
                        return;
                    }
                })
            }

            return { ...node };
        }
        
        let midPoint = {
            x: (A.x + C.x) / 2,
            y: (A.y + C.y) / 2
        }

        let s = node.node as Konva.Line;
        s.points([B.x, B.y, midPoint.x, midPoint.y]);

        if (this.layerUnchangeVisualRef.current) {
            this.layerUnchangeVisualRef.current.getChildren().forEach((childNode, idx) => {
                let id = childNode.id();
                if (id === `label-${node.node.id()}`) {
                    childNode.setAttrs(this.createLabel(node).getAttrs());
                    childNode.show();
                    return;
                }
            })
        }

        [(node.type as Line).startLine.x, (node.type as Line).startLine.y] = [B.x, B.y];
        [(node.type as Line).endLine.x, (node.type as Line).endLine.y] = [midPoint.x, midPoint.y];
        return { ...node };
    }

    private updateAngleBisector = (node: ShapeNode): ShapeNode => {
        let ids = node.dependsOn;
        if (ids.length === 3) {
            // Handle 3 points
            let [shape1, shape2, shape3] = [this.DAG.get(ids[0]), this.DAG.get(ids[1]), this.DAG.get(ids[2])];
            if (!shape1 || !shape2 || !shape3) {
                return node;
            }

            const posA = (shape1 as ShapeNode).node.position();
            const posB = (shape2 as ShapeNode).node.position();
            const posC = (shape3 as ShapeNode).node.position();

            let [A, B, C] = [
                Factory.createPoint(node.type.props, posA.x, posA.y),
                Factory.createPoint(node.type.props, posB.x, posB.y),
                Factory.createPoint(node.type.props, posC.x, posC.y)
            ]

            let line = operation.bisector_angle_line1(A, B, C);
            const dx = line.direction.x;
            const dy = line.direction.y;

            let length = 2 * Math.max(this.props.width, this.props.height) * Math.sqrt(dx * dx + dy * dy) / this.state.zoom_level;
            let norm_dx = dx / Math.sqrt(dx * dx + dy * dy);
            let norm_dy = dy / Math.sqrt(dx * dx + dy * dy);

            let l = node.node as Konva.Line;
            l.points([line.point.x - length * norm_dx, line.point.y - length * norm_dy, line.point.x + length * norm_dx, line.point.y + length * norm_dy]);
            node.node.show();
            if (this.layerUnchangeVisualRef.current) {
                this.layerUnchangeVisualRef.current.getChildren().forEach((childNode, idx) => {
                    let id = childNode.id();
                    if (id === `label-${node.node.id()}`) {
                        childNode.setAttrs(this.createLabel(node).getAttrs());
                        childNode.show();
                        return;
                    }
                })
            }

            [(node.type as Line).startLine.x, (node.type as Line).startLine.y] = [l.points()[0], l.points()[1]];
            [(node.type as Line).endLine.x, (node.type as Line).endLine.y] = [l.points()[2], l.points()[3]];
            return { ...node };
        }

        else if (ids.length === 2) {
            // Handle 2 lines
            let [shape1, shape2] = [this.DAG.get(ids[0]), this.DAG.get(ids[1])];
            if (!shape1 || !shape2) {
                return node;
            }

            try {
                let bisectors = operation.bisector_angle_line2(shape1.type as Line, shape2.type as Line);
                let selected = node.type.type === 'InternalAngleBisector' ? bisectors[0] : bisectors[1];
                
                const dx = selected.direction.x;
                const dy = selected.direction.y;

                let length = 2 * Math.max(this.props.width, this.props.height) * Math.sqrt(dx * dx + dy * dy) / this.state.zoom_level;
                let norm_dx = dx / Math.sqrt(dx * dx + dy * dy);
                let norm_dy = dy / Math.sqrt(dx * dx + dy * dy);

                let l = node.node as Konva.Line;
                l.points([selected.point.x - length * norm_dx, selected.point.y - length * norm_dy, selected.point.x + length * norm_dx, selected.point.y + length * norm_dy]);
                node.node.show();
                if (this.layerUnchangeVisualRef.current) {
                    this.layerUnchangeVisualRef.current.getChildren().forEach((childNode, idx) => {
                        let id = childNode.id();
                        if (id === `label-${node.node.id()}`) {
                            childNode.setAttrs(this.createLabel(node).getAttrs());
                            childNode.show();
                            return;
                        }
                    })
                }

                [(node.type as Line).startLine.x, (node.type as Line).startLine.y] = [l.points()[0], l.points()[1]];
                [(node.type as Line).endLine.x, (node.type as Line).endLine.y] = [l.points()[2], l.points()[3]];
                return { ...node };
            }
            catch (error) {
                node.node.hide();
                if (this.layerUnchangeVisualRef.current) {
                    this.layerUnchangeVisualRef.current.getChildren().forEach((childNode, idx) => {
                        let id = childNode.id();
                        if (id === `label-${node.node.id()}`) {
                            childNode.hide();
                            return;
                        }
                    })
                }

                return { ...node };
            }
        }

        else {
            return { ...node };
        }
    }

    private updateAngle = (node: ShapeNode): ShapeNode => {
        let ids = node.dependsOn;
        if (ids.length === 3) {
            // Handle 3 points
            let [shape1, shape2, shape3] = [this.DAG.get(ids[0]), this.DAG.get(ids[1]), this.DAG.get(ids[2])];
            if (!shape1 || !shape2 || !shape3) {
                return node;
            }

            const posA = (shape1 as ShapeNode).node.position();
            const posB = (shape2 as ShapeNode).node.position();
            const posC = (shape3 as ShapeNode).node.position();

            let [A, B, C] = [
                Factory.createPoint(node.type.props, posA.x, posA.y),
                Factory.createPoint(node.type.props, posB.x, posB.y),
                Factory.createPoint(node.type.props, posC.x, posC.y)
            ]

            let angle = operation.angleBetween3Points(A, B, C);
            let BA = {
                x: A.x - B.x,
                y: A.y - B.y
            }

            const angleFromXAxis = (v: {x: number, y: number}) => {
                return (math.parse('atan2(y, x)').evaluate({x: v.x, y: v.y})) * 180 / Math.PI;
            }

            let startAngle = angleFromXAxis(BA);
            let parent = node.node.getParent();
            if (parent) {
                let s = (angle !== 90) ? new Konva.Shape({
                    sceneFunc: ((context, shape) => {
                        const r = shape.attrs.radius;
                        const x = 0;
                        const y = 0;
                        const start = Konva.getAngle(shape.attrs.startAngle); // radians
                        const end = Konva.getAngle(shape.attrs.startAngle - shape.attrs.angle); // radians

                        context.beginPath();
                        context.moveTo(0, 0);

                        context.arc(x, y, r, start, end, true);
                        context.closePath();
                        context.fillStrokeShape(shape);
                    }),
                    x: B.x,
                    y: B.y,
                    radius: 10,
                    startAngle: startAngle,
                    angle: angle,
                    fill: node.node.fill(),
                    stroke: node.node.stroke(),
                    strokeWidth: node.node.strokeWidth(),
                    hitStrokeWidth: 2,
                    id: node.node.id()
                }) : new Konva.Line({
                    x: B.x,
                    y: B.y,
                    points: [
                        0, 0,
                        10, 0,
                        10, -10,
                        0, -10
                    ],

                    fill: node.node.fill(),
                    stroke: node.node.stroke(),
                    strokeWidth: node.node.strokeWidth(),
                    hitStrokeWidth: 2,
                    rotation: startAngle,
                    closed: true,
                    draggable: false,
                    id: node.node.id()
                });

                node.node.destroy();
                node.node = s;
                parent.add(s);
            }

            if (angle === 0) {
                if (this.layerUnchangeVisualRef.current) {
                    this.layerUnchangeVisualRef.current.getChildren().forEach((childNode, idx) => {
                        let id = childNode.id();
                        if (id === `label-${node.node.id()}`) {
                            childNode.hide();
                            return;
                        }
                    })
                }
            }
            
            else {
                if (this.layerUnchangeVisualRef.current) {
                    this.layerUnchangeVisualRef.current.getChildren().forEach((childNode, idx) => {
                        let id = childNode.id();
                        if (id === `label-${node.node.id()}`) {
                            childNode.setAttrs(this.createLabel(node).getAttrs());
                            childNode.show();
                            return;
                        }
                    })
                }
            }

            (node.type as Angle).vertex = B;
            (node.type as Angle).startAngle = startAngle;
            (node.type as Angle).degree = angle;
        }

        else if (ids.length === 2) {
            // Handle 2 lines
            let [shape1, shape2] = [this.DAG.get(ids[0]), this.DAG.get(ids[1])];
            if (!shape1 || !shape2) {
                return node;
            }

            // Convert them to Line
            let [start1, end1] = operation.getStartAndEnd(shape1.type);
            let [start2, end2] = operation.getStartAndEnd(shape2.type);

            const tmpShape1 = Factory.createLine(
                shape1.type.props,
                Factory.createPoint(
                    createPointDefaultShapeProps(''),
                    start1.x,
                    start1.y,
                    start1.z
                ),
                Factory.createPoint(
                    createPointDefaultShapeProps(''),
                    end1.x,
                    end1.y,
                    end1.z
                ),
            );

            const tmpShape2 = Factory.createLine(
                shape2.type.props,
                Factory.createPoint(
                    createPointDefaultShapeProps(''),
                    start2.x,
                    start2.y,
                    start2.z
                ),
                Factory.createPoint(
                    createPointDefaultShapeProps(''),
                    end2.x,
                    end2.y,
                    end2.z
                ),
            )

            let angle = operation.angleBetweenLines(tmpShape1, tmpShape2);
            let start = {
                x: tmpShape1.endLine.x - tmpShape1.startLine.x,
                y: tmpShape1.endLine.y - tmpShape1.startLine.y
            }

            const angleFromXAxis = (v: {x: number, y: number}) => {
                return (math.parse('atan2(y, x)').evaluate({x: v.x, y: v.y})) * 180 / Math.PI;
            }

            let startAngle = angleFromXAxis(start);
            let intersection = operation.getIntersections2D(shape1.type as Line, shape2.type as Line);
            let vertex: Point | undefined = intersection.length === 0 ? undefined : 
                                            Factory.createPoint(
                                                createPointDefaultShapeProps(''),
                                                intersection[0].x,
                                                intersection[0].y,
                                                intersection[0].z
                                            )
            if (angle === 0 || !vertex) {
                if (this.layerUnchangeVisualRef.current) {
                    this.layerUnchangeVisualRef.current.getChildren().forEach((childNode, idx) => {
                        let id = childNode.id();
                        if (id === `label-${node.node.id()}`) {
                            childNode.hide();
                            return;
                        }
                    })
                }

                node.node.hide();
            }
            
            else {
                let parent = node.node.getParent();
                if (parent) {
                    let s = (angle !== 90) ? new Konva.Shape({
                        sceneFunc: ((context, shape) => {
                            const r = shape.attrs.radius;
                            const x = 0;
                            const y = 0;
                            const start = Konva.getAngle(shape.attrs.startAngle); // radians
                            const end = Konva.getAngle(shape.attrs.startAngle - shape.attrs.angle); // radians

                            context.beginPath();
                            context.moveTo(0, 0);

                            context.arc(x, y, r, start, end, true);
                            context.closePath();
                            context.fillStrokeShape(shape);
                        }),
                        x: intersection[0].x,
                        y: intersection[0].y,
                        radius: 10,
                        startAngle: startAngle,
                        angle: angle,
                        fill: node.node.fill(),
                        stroke: node.node.stroke(),
                        strokeWidth: node.node.strokeWidth(),
                        hitStrokeWidth: 2,
                        id: node.node.id()
                    }) : new Konva.Line({
                        x: intersection[0].x,
                        y: intersection[0].y,
                        points: [
                            0, 0,
                            10, 0,
                            10, -10,
                            0, -10
                        ],

                        fill: node.node.fill(),
                        stroke: node.node.stroke(),
                        strokeWidth: node.node.strokeWidth(),
                        hitStrokeWidth: 2,
                        rotation: startAngle,
                        closed: true,
                        draggable: false,
                        id: node.node.id()
                    });

                    node.node.destroy();
                    node.node = s;
                    parent.add(s);
                }

                if (this.layerUnchangeVisualRef.current) {
                    this.layerUnchangeVisualRef.current.getChildren().forEach((childNode, idx) => {
                        let id = childNode.id();
                        if (id === `label-${node.node.id()}`) {
                            childNode.setAttrs(this.createLabel(node).getAttrs());
                            childNode.show();
                            return;
                        }
                    })
                }
            }


            (node.type as Angle).vertex = vertex;
            (node.type as Angle).startAngle = startAngle;
            (node.type as Angle).degree = angle;
        }

        return { ...node };
    }

    private updateCircle3Point = (node: ShapeNode): ShapeNode => {
        const [id1, id2, id3] = node.dependsOn;
        const [p1, p2, p3] = [this.DAG.get(id1), this.DAG.get(id2), this.DAG.get(id3)];
        if (!p1 || !p2 || !p3) {
            return { ...node };
        }

        const posA = (p1 as ShapeNode).node.position();
        const posB = (p2 as ShapeNode).node.position();
        const posC = (p3 as ShapeNode).node.position();

        let [A, B, C] = [
            Factory.createPoint(node.type.props, posA.x, posA.y),
            Factory.createPoint(node.type.props, posB.x, posB.y),
            Factory.createPoint(node.type.props, posC.x, posC.y)
        ]

        try {
            let [circumcenter, circumradius] = [operation.circumcenter(A, B, C), operation.circumradius(A, B, C)];
            let circle = node.node as Konva.Circle;
            circle.position({x: circumcenter.x, y: circumcenter.y});
            circle.radius(circumradius);
            node.node.show();
            [
                (node.type as Circle).centerC.x,
                (node.type as Circle).centerC.y,
                (node.type as Circle).radius
            ] = [
                circumcenter.x,
                circumcenter.y,
                circumradius
            ]

            if (this.layerUnchangeVisualRef.current) {
                this.layerUnchangeVisualRef.current.getChildren().forEach((childNode, idx) => {
                    let id = childNode.id();
                    if (id === `label-${node.node.id()}`) {
                        childNode.setAttrs(this.createLabel(node).getAttrs());
                        childNode.show();
                        return;
                    }
                })
            }

            return { ...node };
        }

        catch(error) {
            node.node.hide();
            if (this.layerUnchangeVisualRef.current) {
                this.layerUnchangeVisualRef.current.getChildren().forEach((childNode, idx) => {
                    let id = childNode.id();
                    if (id === `label-${node.node.id()}`) {
                        childNode.hide();
                        return;
                    }
                })
            }

            return { ...node };
        }
    }

    private updateIncircle3Point = (node: ShapeNode): ShapeNode => {
        const [id1, id2, id3] = node.dependsOn;
        const [p1, p2, p3] = [this.DAG.get(id1), this.DAG.get(id2), this.DAG.get(id3)];
        if (!p1 || !p2 || !p3) {
            return { ...node };
        }

        const posA = (p1 as ShapeNode).node.position();
        const posB = (p2 as ShapeNode).node.position();
        const posC = (p3 as ShapeNode).node.position();

        let [A, B, C] = [
            Factory.createPoint(node.type.props, posA.x, posA.y),
            Factory.createPoint(node.type.props, posB.x, posB.y),
            Factory.createPoint(node.type.props, posC.x, posC.y)
        ]

        try {
            let [incenter, inradius] = [operation.incenter(A, B, C), operation.inradius(A, B, C)];
            let circle = node.node as Konva.Circle;
            circle.position({x: incenter.x, y: incenter.y});
            circle.radius(inradius);
            node.node.show();
            [
                (node.type as Circle).centerC.x,
                (node.type as Circle).centerC.y,
                (node.type as Circle).radius
            ] = [
                incenter.x,
                incenter.y,
                inradius
            ]

            if (this.layerUnchangeVisualRef.current) {
                this.layerUnchangeVisualRef.current.getChildren().forEach((childNode, idx) => {
                    let id = childNode.id();
                    if (id === `label-${node.node.id()}`) {
                        childNode.setAttrs(this.createLabel(node).getAttrs());
                        childNode.show();
                        return;
                    }
                })
            }

            return { ...node };
        }

        catch(error) {
            node.node.hide();
            if (this.layerUnchangeVisualRef.current) {
                this.layerUnchangeVisualRef.current.getChildren().forEach((childNode, idx) => {
                    let id = childNode.id();
                    if (id === `label-${node.node.id()}`) {
                        childNode.hide();
                        return;
                    }
                })
            }
            
            return { ...node };
        }
    }

    private updateSemiCircle = (node: ShapeNode): ShapeNode => {
        const [id1, id2] = node.dependsOn;
        const [start, end] = [this.DAG.get(id1), this.DAG.get(id2)];
        if (!start || !end) {
            return { ...node };
        }

        const posA = (start as ShapeNode).node.position();
        const posB = (end as ShapeNode).node.position();

        let [A, B] = [
            Factory.createPoint(node.type.props, posA.x, posA.y),
            Factory.createPoint(node.type.props, posB.x, posB.y)
        ]

        let M = operation.midPoint(A, B);
        let MB = {
            x: B.x - M.x,
            y: B.y - M.y
        }

        const angleFromXAxis = (v: {x: number, y: number}) => {
            return (math.parse('atan2(y, x)').evaluate({x: v.x, y: v.y})) * 180 / Math.PI;
        }

        let startAngle = angleFromXAxis(MB);

        let arc = node.node;
        arc.position({x: M.x, y: M.y});
        arc.setAttrs({
            angle: 180,
            startAngle: startAngle
        });
                
        if (this.layerUnchangeVisualRef.current) {
            this.layerUnchangeVisualRef.current.getChildren().forEach((childNode, idx) => {
                let id = childNode.id();
                if (id === `label-${node.node.id()}`) {
                    childNode.setAttrs(this.createLabel(node).getAttrs());
                    return;
                }
            })
        }


        (node.type as SemiCircle).start = B;
        (node.type as SemiCircle).end = A;

        return { ...node };
    }

    private updateReflection = (node: ShapeNode): ShapeNode => {
        const [id1, id2] = node.dependsOn;
        const shape1 = this.DAG.get(id1);
        const shape2 = this.DAG.get(id2);

        if (!shape1 || !shape2) {
            return { ...node };
        }

        // shape1 is object, shape2 is mirror
        let reflected = operation.reflection(shape1.type, shape2.type);
        if ('x' in reflected && 'y' in reflected) {
            // reflected is Point
            let p = node.node as Konva.Circle;
            p.position({x: reflected.x, y: reflected.y});
            return { ...node};
        }

        else if ('radius' in reflected) {
            // reflected is Circle
            let p = node.node as Konva.Circle;
            p.position({x: (reflected as Circle).centerC.x, y: (reflected as Circle).centerC.y});
            p.radius(reflected.radius);
            return { ...node};
        }

        else if ('points' in reflected) {
            let p = node.node as Konva.Line;
            let points: number[] = [];
            reflected.points.forEach((p: Point) => {
                points.push(p.x, p.y);
            });

            p.points(points);
            return { ...node};
        }

        else if ('startLine' in reflected) {
            let l = node.node as Konva.Line;
            const dx = (reflected as Line).endLine.x - (reflected as Line).startLine.x;
            const dy = (reflected as Line).endLine.y - (reflected as Line).startLine.y;

            let length = 2 * Math.max(this.props.width, this.props.height) * Math.sqrt(dx * dx + dy * dy) / this.state.zoom_level;
            let norm_dx = dx / Math.sqrt(dx * dx + dy * dy);
            let norm_dy = dy / Math.sqrt(dx * dx + dy * dy);

            l.points([(reflected as Line).startLine.x - length * norm_dx, (reflected as Line).startLine.y - length * norm_dy, (reflected as Line).startLine.x + length * norm_dx, (reflected as Line).startLine.y + length * norm_dy]);
            return { ...node };
        }

        else if ('startVector' in reflected) {
            let l = node.node as Konva.Arrow;
            l.points([(reflected as Vector).startVector.x, (reflected as Vector).startVector.y, (reflected as Vector).endVector.x, (reflected as Vector).endVector.y]);
            return { ...node };
        }

        else if ('startSegment' in reflected) {
            let l = node.node as Konva.Line;
            l.points([(reflected as Segment).startSegment.x, (reflected as Segment).startSegment.y, (reflected as Segment).endSegment.x, (reflected as Segment).endSegment.y]);
            return { ...node };
        }

        else if ('startRay' in reflected) {
            let l = node.node as Konva.Line;
            const dx = (reflected as Ray).endRay.x - (reflected as Ray).startRay.x;
            const dy = (reflected as Ray).endRay.y - (reflected as Ray).startRay.y;

            let length = 2 * Math.max(this.props.width, this.props.height) * Math.sqrt(dx * dx + dy * dy) / this.state.zoom_level;
            let norm_dx = dx / Math.sqrt(dx * dx + dy * dy);
            let norm_dy = dy / Math.sqrt(dx * dx + dy * dy);

            l.points([(reflected as Ray).startRay.x, (reflected as Ray).startRay.y, (reflected as Ray).startRay.x + length * norm_dx, (reflected as Ray).startRay.y + length * norm_dy]);
            return { ...node };
        }

        else {
            return { ...node };
        }
    }

    private updateTangentLine = (node: ShapeNode): ShapeNode => {
        const matchTangent = (
            oldNode: ShapeNode,
            candidates: Konva.Line[]
        ): Konva.Line => {
            const oldLine = oldNode.node as Konva.Line;
            const oldPts = oldLine.points();
            const oldVec = {
                x: oldPts[2] - oldPts[0],
                y: oldPts[3] - oldPts[1],
            };

            function angleScore(candidate: Konva.Line): number {
                const pts = candidate.points();
                const vec = {
                    x: pts[2] - pts[0],
                    y: pts[3] - pts[1],
                };
                
                const dot = oldVec.x * vec.x + oldVec.y * vec.y;
                const len1 = Math.hypot(oldVec.x, oldVec.y);
                const len2 = Math.hypot(vec.x, vec.y);
                const cosTheta = dot / (len1 * len2);
                return Math.acos(Math.max(-1, Math.min(1, cosTheta))); // angle difference in radians
            }

            // Choose the candidate with the smallest angle difference
            let best = candidates[0];
            let bestScore = angleScore(best);

            for (let i = 1; i < candidates.length; i++) {
                const score = angleScore(candidates[i]);
                if (score < bestScore) {
                    best = candidates[i];
                    bestScore = score;
                }
            }

            return best;
        }

        const [pointId, circleId] = node.dependsOn;
        const point = this.DAG.get(pointId);
        const circle = this.DAG.get(circleId);
        if (!point || !circle) return { ...node };

        let [A, c] = [
            Factory.createPoint(
                point.type.props,
                (point.type as Point).x,
                (point.type as Point).y,
                (point.type as Point).z ?? 0
            ),

            Factory.createCircle(
                circle.type.props,
                (circle.type as Circle).centerC,
                (circle.type as Circle).radius,
                (circle.type as Circle).normal
            )
        ]

        const newTangents = operation.tangentLine(A, c); // returns 0–2 lines
        if (newTangents.length === 0) {
            (node.node as Konva.Line).hide();
            return { ...node };
        }

        let tangents: Konva.Line[] = [];
        newTangents.forEach(l => {
            const dx = l.direction.x;
            const dy = l.direction.y;

            let length = 2 * Math.max(this.props.width, this.props.height) * Math.sqrt(dx * dx + dy * dy) / this.state.zoom_level;
            let norm_dx = dx / Math.sqrt(dx * dx + dy * dy);
            let norm_dy = dy / Math.sqrt(dx * dx + dy * dy);

            let line: Konva.Line = node.node.clone();
            line.points([l.point.x - length * norm_dx, l.point.y - length * norm_dy, l.point.x + length * norm_dx, l.point.y + length * norm_dy]);
            tangents.push(line);
        })

        const match = matchTangent(node, tangents);
        const [x1, y1, x2, y2] = match.points();
        const line = node.node as Konva.Line;
        line.points([x1, y1, x2, y2]);
        line.show();

        return { ...node };
    }

    private updatePerpendicularBisector = (node: ShapeNode): ShapeNode => {
        // Only depends on segment ID or 2 points
        if (node.dependsOn.length === 1) {
            const shape = this.DAG.get(node.dependsOn[0]);
            if (!shape) {
                return { ...node };
            }

            let segmentPos = ((shape as ShapeNode).node as Konva.Line).points();
            let midPoint = {
                x: (segmentPos[2] + segmentPos[0]) / 2,
                y: (segmentPos[3] + segmentPos[1]) / 2
            }

            const dx = segmentPos[1] - segmentPos[3];
            const dy = segmentPos[2] - segmentPos[0];

            let length = 2 * Math.max(this.props.width, this.props.height) * Math.sqrt(dx * dx + dy * dy) / this.state.zoom_level;
            let norm_dx = dx / Math.sqrt(dx * dx + dy * dy);
            let norm_dy = dy / Math.sqrt(dx * dx + dy * dy);

            let line: Konva.Line = node.node as Konva.Line;
            line.points([midPoint.x - length * norm_dx, midPoint.y - length * norm_dy, midPoint.x + length * norm_dx, midPoint.y + length * norm_dy]);
            return { ...node };
        }

        else if (node.dependsOn.length === 2) {
            const [id1, id2] = node.dependsOn;
            const [start, end] = [this.DAG.get(id1), this.DAG.get(id2)];
            if (!start || !end) {
                return { ...node };
            }

            const posA = (start as ShapeNode).node.position();
            const posB = (end as ShapeNode).node.position();

            let midPoint = {
                x: (posA.x + posB.x) / 2,
                y: (posA.y + posB.y) / 2
            }

            const dx = posA.x - posB.x;
            const dy = posB.y - posB.y;

            let length = 2 * Math.max(this.props.width, this.props.height) * Math.sqrt(dx * dx + dy * dy) / this.state.zoom_level;
            let norm_dx = dx / Math.sqrt(dx * dx + dy * dy);
            let norm_dy = dy / Math.sqrt(dx * dx + dy * dy);

            let line: Konva.Line = node.node as Konva.Line;
            line.points([midPoint.x - length * norm_dx, midPoint.y - length * norm_dy, midPoint.x + length * norm_dx, midPoint.y + length * norm_dy]);
            return { ...node };
        }

        else {
            return { ...node };
        }
    }

    private updatePerpendicularLine = (node: ShapeNode): ShapeNode => {
        const [id1, id2] = node.dependsOn;
        const [start, end] = [this.DAG.get(id1), this.DAG.get(id2)];
        if (!start || !end) {
            return { ...node };
        }

        // shape1 is point, shape2 is line/segment/ray
        let segmentPos = ((end as ShapeNode).node as Konva.Line).points();
        let pointPos = ((start as ShapeNode).node as Konva.Circle).position();

        const dx = segmentPos[1] - segmentPos[3];
        const dy = segmentPos[2] - segmentPos[0];

        let length = 2 * Math.max(this.props.width, this.props.height) * Math.sqrt(dx * dx + dy * dy) / this.state.zoom_level;
        let norm_dx = dx / Math.sqrt(dx * dx + dy * dy);
        let norm_dy = dy / Math.sqrt(dx * dx + dy * dy);

        let line: Konva.Line = node.node as Konva.Line;
        line.points([pointPos.x - length * norm_dx, pointPos.y - length * norm_dy, pointPos.x + length * norm_dx, pointPos.y + length * norm_dy]);
        return { ...node };
    }

    private updateParallelLine = (node: ShapeNode): ShapeNode => {
        const [id1, id2] = node.dependsOn;
        const [start, end] = [this.DAG.get(id1), this.DAG.get(id2)];
        if (!start || !end) {
            return { ...node };
        }

        // shape1 is point, shape2 is line/segment/ray
        let segmentPos = ((end as ShapeNode).node as Konva.Line).points();
        let pointPos = ((start as ShapeNode).node as Konva.Circle).position();

        const dx = segmentPos[2] - segmentPos[0];
        const dy = segmentPos[3] - segmentPos[1];

        let length = 2 * Math.max(this.props.width, this.props.height) * Math.sqrt(dx * dx + dy * dy) / this.state.zoom_level;
        let norm_dx = dx / Math.sqrt(dx * dx + dy * dy);
        let norm_dy = dy / Math.sqrt(dx * dx + dy * dy);

        let line: Konva.Line = node.node as Konva.Line;
        line.points([pointPos.x - length * norm_dx, pointPos.y - length * norm_dy, pointPos.x + length * norm_dx, pointPos.y + length * norm_dy]);
        return { ...node };
    }

    private updateProjection = (node: ShapeNode): ShapeNode => {
        const [id1, id2, id3] = node.dependsOn;
        const [shape1, shape2, shape3] = [this.DAG.get(id1), this.DAG.get(id2), this.DAG.get(id3)];
        if (!shape1 || !shape2 || !shape3) {
            return { ...node };
        }

        let projected_point: Point = operation.point_projection(
            shape1.type as Point,
            shape2.type,
            shape3.type as Line
        )

        let point = node.node as Konva.Circle;
        point.position({x: projected_point.x, y: projected_point.y});
        return { ...node };
    }

    private updateExcircle = (node: ShapeNode): ShapeNode => {
        const [id1, id2, id3] = node.dependsOn;
        const [p1, p2, p3] = [this.DAG.get(id1), this.DAG.get(id2), this.DAG.get(id3)];
        if (!p1 || !p2 || !p3) {
            return { ...node };
        }

        const posA = (p1 as ShapeNode).node.position();
        const posB = (p2 as ShapeNode).node.position();
        const posC = (p3 as ShapeNode).node.position();

        let [A, B, C] = [
            Factory.createPoint(node.type.props, posA.x, posA.y),
            Factory.createPoint(node.type.props, posB.x, posB.y),
            Factory.createPoint(node.type.props, posC.x, posC.y)
        ]

        try {
            let [excenter, exradius] = [operation.excenter(A, B, C), operation.exradius(A, B, C)];
            let circle = node.node as Konva.Circle;
            circle.position({x: excenter.x, y: excenter.y});
            circle.radius(exradius);
            node.node.show();
            [
                (node.type as Circle).centerC.x,
                (node.type as Circle).centerC.y,
                (node.type as Circle).radius
            ] = [
                excenter.x,
                excenter.y,
                exradius
            ]

            if (this.layerUnchangeVisualRef.current) {
                this.layerUnchangeVisualRef.current.getChildren().forEach((childNode, idx) => {
                    let id = childNode.id();
                    if (id === `label-${node.node.id()}`) {
                        childNode.setAttrs(this.createLabel(node).getAttrs());
                        childNode.show();
                        return;
                    }
                })
            }

            return { ...node };
        }

        catch(error) {
            node.node.hide();
            if (this.layerUnchangeVisualRef.current) {
                this.layerUnchangeVisualRef.current.getChildren().forEach((childNode, idx) => {
                    let id = childNode.id();
                    if (id === `label-${node.node.id()}`) {
                        childNode.hide();
                        return;
                    }
                })
            }
            
            return { ...node };
        }
    }

    private updateExcenter = (node: ShapeNode): ShapeNode => {
        const [id1, id2, id3] = node.dependsOn;
        const [p1, p2, p3] = [this.DAG.get(id1), this.DAG.get(id2), this.DAG.get(id3)];
        if (!p1 || !p2 || !p3) {
            return { ...node };
        }

        const posA = (p1 as ShapeNode).node.position();
        const posB = (p2 as ShapeNode).node.position();
        const posC = (p3 as ShapeNode).node.position();

        let [A, B, C] = [
            Factory.createPoint(node.type.props, posA.x, posA.y),
            Factory.createPoint(node.type.props, posB.x, posB.y),
            Factory.createPoint(node.type.props, posC.x, posC.y)
        ]

        try {
            let ortho = operation.excenter(A, B, C);
            let point = node.node as Konva.Circle;
            point.position({x: ortho.x as number, y: ortho.y as number});
            point.show();

            if (this.layerUnchangeVisualRef.current) {
                this.layerUnchangeVisualRef.current.getChildren().forEach((childNode, idx) => {
                    let id = childNode.id();
                    if (id === `label-${node.node.id()}`) {
                        childNode.setAttrs(this.createLabel(node).getAttrs());
                        childNode.show();
                        return;
                    }
                })
            }

            [(node.type as Point).x, (node.type as Point).x] = [point.x(), point.y()];
            return { ...node };
        }

        catch (error) {
            node.node.hide();
            if (this.layerUnchangeVisualRef.current) {
                this.layerUnchangeVisualRef.current.getChildren().forEach((childNode, idx) => {
                    let id = childNode.id();
                    if (id === `label-${node.node.id()}`) {
                        childNode.hide();
                        return;
                    }
                })
            }

            return { ...node };
        }
    }

    private updateRotation = (node: ShapeNode): ShapeNode => {
        const [id1, id2] = node.dependsOn;
        const [p1, p2] = [this.DAG.get(id1), this.DAG.get(id2)];
        if (!p1 || !p2) {
            return { ...node };
        }

        if (node.rotationFactor === undefined) {
            return { ...node};
        }

        let rotated_obj = operation.rotation(
            p1.type, p2.type, node.rotationFactor.degree, node.rotationFactor.CCW
        );

        if ('x' in rotated_obj && 'y' in rotated_obj) {
            let p = node.node as Konva.Circle;
            p.position({x: (rotated_obj as Point).x, y: (rotated_obj as Point).y});

        }

        else if ('centerC' in rotated_obj && 'radius' in rotated_obj) {
            let p = node.node as Konva.Circle;
            p.position({x: (rotated_obj as Circle).centerC.x, y: (rotated_obj as Circle).centerC.y});
            p.radius((rotated_obj as Circle).radius);
        }

        else if ('points' in rotated_obj) {
            let p = node.node as Konva.Line;
            let points: number[] = [];
            (rotated_obj as Polygon).points.forEach((p: Point) => {
                points.push(p.x, p.y);
            })

            p.points(points);
        }

        else if ('startLine' in rotated_obj) {
            let pointPos = {
                x: (rotated_obj as Line).startLine.x,
                y: (rotated_obj as Line).startLine.y
            }

            let d = {
                x: (rotated_obj as Line).endLine.x - (rotated_obj as Line).startLine.x,
                y: (rotated_obj as Line).endLine.y - (rotated_obj as Line).startLine.y
            }

            const dx = d.x;
            const dy = d.y;

            let length = 2 * Math.max(this.props.width, this.props.height) * Math.sqrt(dx * dx + dy * dy) / this.state.zoom_level;
            let norm_dx = dx / Math.sqrt(dx * dx + dy * dy);
            let norm_dy = dy / Math.sqrt(dx * dx + dy * dy);

            let line: Konva.Line = node.node as Konva.Line;
            line.points([pointPos.x - length * norm_dx, pointPos.y - length * norm_dy, pointPos.x + length * norm_dx, pointPos.y + length * norm_dy]);
            return { ...node };
        }

        else if ('startRay' in rotated_obj) {
            let pointPos = {
                x: (rotated_obj as Ray).startRay.x,
                y: (rotated_obj as Ray).startRay.y
            }

            let d = {
                x: (rotated_obj as Ray).endRay.x - (rotated_obj as Ray).startRay.x,
                y: (rotated_obj as Ray).endRay.y - (rotated_obj as Ray).startRay.y
            }

            const dx = d.x;
            const dy = d.y;

            let length = 2 * Math.max(this.props.width, this.props.height) * Math.sqrt(dx * dx + dy * dy) / this.state.zoom_level;
            let norm_dx = dx / Math.sqrt(dx * dx + dy * dy);
            let norm_dy = dy / Math.sqrt(dx * dx + dy * dy);

            let line: Konva.Line = node.node as Konva.Line;
            line.points([pointPos.x, pointPos.y, pointPos.x + length * norm_dx, pointPos.y + length * norm_dy]);
        }

        else if ('startSegment' in rotated_obj) {
            let line: Konva.Line = node.node as Konva.Line;
            line.points([
                (rotated_obj as Segment).startSegment.x, (rotated_obj as Segment).startSegment.y,
                (rotated_obj as Segment).endSegment.x, (rotated_obj as Segment).endSegment.y
            ]);
        }

        else if ('startVector' in rotated_obj) {
            let line: Konva.Line = node.node as Konva.Arrow;
            line.points([
                (rotated_obj as Vector).startVector.x, (rotated_obj as Vector).startVector.y,
                (rotated_obj as Vector).endVector.x, (rotated_obj as Vector).endVector.y
            ]);
        }

        return { ...node };
    }

    private updateEnlarge = (node: ShapeNode): ShapeNode => {
        const [id1, id2] = node.dependsOn;
        const [p1, p2] = [this.DAG.get(id1), this.DAG.get(id2)];
        if (!p1 || !p2) {
            return { ...node };
        }

        if (node.rotationFactor === undefined) {
            return { ...node};
        }

        if (node.scaleFactor === undefined) {
            return { ...node };
        }

        let enlarge_obj = operation.enlarge(p1.type, p2.type as Point, node.scaleFactor);
        if ('x' in enlarge_obj && 'y' in enlarge_obj) {
            let p = node.node as Konva.Circle;
            p.position({x: (enlarge_obj as Point).x, y: (enlarge_obj as Point).y});

        }

        else if ('centerC' in enlarge_obj && 'radius' in enlarge_obj) {
            let p = node.node as Konva.Circle;
            p.position({x: (enlarge_obj as Circle).centerC.x, y: (enlarge_obj as Circle).centerC.y});
            p.radius((enlarge_obj as Circle).radius);
        }

        else if ('points' in enlarge_obj) {
            let p = node.node as Konva.Line;
            let points: number[] = [];
            (enlarge_obj as Polygon).points.forEach((p: Point) => {
                points.push(p.x, p.y);
            })

            p.points(points);
        }

        else if ('startLine' in enlarge_obj) {
            let pointPos = {
                x: (enlarge_obj as Line).startLine.x,
                y: (enlarge_obj as Line).startLine.y
            }

            let d = {
                x: (enlarge_obj as Line).endLine.x - (enlarge_obj as Line).startLine.x,
                y: (enlarge_obj as Line).endLine.y - (enlarge_obj as Line).startLine.y
            }

            const dx = d.x;
            const dy = d.y;

            let length = 2 * Math.max(this.props.width, this.props.height) * Math.sqrt(dx * dx + dy * dy) / this.state.zoom_level;
            let norm_dx = dx / Math.sqrt(dx * dx + dy * dy);
            let norm_dy = dy / Math.sqrt(dx * dx + dy * dy);

            let line: Konva.Line = node.node as Konva.Line;
            line.points([pointPos.x - length * norm_dx, pointPos.y - length * norm_dy, pointPos.x + length * norm_dx, pointPos.y + length * norm_dy]);
            return { ...node };
        }

        else if ('startRay' in enlarge_obj) {
            let pointPos = {
                x: (enlarge_obj as Ray).startRay.x,
                y: (enlarge_obj as Ray).startRay.y
            }

            let d = {
                x: (enlarge_obj as Ray).endRay.x - (enlarge_obj as Ray).startRay.x,
                y: (enlarge_obj as Ray).endRay.y - (enlarge_obj as Ray).startRay.y
            }

            const dx = d.x;
            const dy = d.y;

            let length = 2 * Math.max(this.props.width, this.props.height) * Math.sqrt(dx * dx + dy * dy) / this.state.zoom_level;
            let norm_dx = dx / Math.sqrt(dx * dx + dy * dy);
            let norm_dy = dy / Math.sqrt(dx * dx + dy * dy);

            let line: Konva.Line = node.node as Konva.Line;
            line.points([pointPos.x, pointPos.y, pointPos.x + length * norm_dx, pointPos.y + length * norm_dy]);
        }

        else if ('startSegment' in enlarge_obj) {
            let line: Konva.Line = node.node as Konva.Line;
            line.points([
                (enlarge_obj as Segment).startSegment.x, (enlarge_obj as Segment).startSegment.y,
                (enlarge_obj as Segment).endSegment.x, (enlarge_obj as Segment).endSegment.y
            ]);
        }

        else if ('startVector' in enlarge_obj) {
            let line: Konva.Line = node.node as Konva.Arrow;
            line.points([
                (enlarge_obj as Vector).startVector.x, (enlarge_obj as Vector).startVector.y,
                (enlarge_obj as Vector).endVector.x, (enlarge_obj as Vector).endVector.y
            ]);
        }

        return { ...node };
    }

    private removeNodeBatch = (id: string, visited: Set<string>, state: {
        shapes: string[]
    }) => {
        if (visited.has(id)) return;
        const node = this.DAG.get(id);
        if (!node) return;

        visited.add(id);
        // 1. Find all dependent nodes and recursively remove them
        this.DAG.forEach((value, key) => {
            if (value.dependsOn.includes(id)) {
                this.removeNodeBatch(key, visited, state);
            }
        });

        // 2. Clean up
        this.label_used = this.label_used.filter(
            label => label !== node.type.props.label
        );

        (node as ShapeNode).node.destroy();
        this.DAG.delete(id);

        // 3. Remove from shapes
        state.shapes = state.shapes.filter(shapeId => shapeId !== id);
    };

    // Public method that does batch delete with single re-render
    private removeNode = (id: string): void => {
        const newShapes = [...this.state.shapes];
        const set = new Set<string>();

        this.removeNodeBatch(id, set, { shapes: newShapes });

        // Only one render here
        this.setState({
            shapes: newShapes
        });
    };

    render(): React.ReactNode {
        const { width, height, background_color } = this.props;
        return (
            <div className="flex flex-row h-full">
                <GeometryTool
                    width={width * 0.25}
                    onPointClick={this.handlePointClick}
                    onLineClick={this.handleLineClick}
                    onSegmentClick={this.handleSegmentClick}
                    onVectorClick={this.handleVectorClick}
                    onPolygonClick={this.handlePolygonClick}
                    onCircleClick={this.handleCircleClick}
                    onRayClick={this.handleRayClick}
                    onEditClick={this.handleEditClick}
                    onDeleteClick={this.handleDeleteClick}
                    onClearClick={this.handleClearClick}
                    onUndoClick={this.handleUndoClick}
                    onRedoClick={this.handleRedoClick}
                    onAngleClick={this.handleAngleClick}
                />
                <Stage 
                    ref={this.stageRef} 
                    width={width * 0.75}
                    height={height} 
                    style={{background: background_color}}
                    onWheel={this.handleZoom}
                    onMouseDown={this.handleMouseDown}
                    onMouseMove={this.handleMouseMove}
                    onMouseUp={this.handleMouseUp}
                    onMouseLeave={this.handleMouseUp}
                >
                    <Layer ref={this.layerGridRef} />
                    <Layer ref={this.layerUnchangeVisualRef} />
                    <Layer ref={this.layerAxisRef} />
                    <Layer ref={this.layerMathObjectRef} />
                </Stage>
            </div>
        )
    }
}

export default KonvaCanvas;