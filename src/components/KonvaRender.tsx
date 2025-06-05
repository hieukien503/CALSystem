import React, { RefObject } from "react";
import { Line, Vector, Segment, Polygon, Point, Circle, Ray, Shape, LineStyle, GeometryState, ShapeNode, Angle, Enlarge, Rotation } from "../types/geometry"
import Konva from "konva";
import { Stage, Layer } from "react-konva";
import { KonvaAxis } from "../utils/KonvaAxis";
import { KonvaGrid } from "../utils/KonvaGrid";
import { GeometryTool } from "./GeometryTool";
import { v4 as uuidv4 } from 'uuid';
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

// Mutable variables
let scale = 1;

// Utility functions
const convert2RGB = (color: string): [number, number, number] => {
    const rgb = Konva.Util.getRGB(color)
    if (rgb) {
        return [rgb.r, rgb.g, rgb.b]
    }
    throw new Error('Invalid color format');
};

const createDashArray = (lineStyle: LineStyle): number[] => {
    const [dash, gap, offset] = [lineStyle.dash_size, lineStyle.gap_size, lineStyle.dot_size];
    return [offset ?? 0, gap, dash, gap];
};

const createLabelProps = (
    x: number,
    y: number,
    label: string,
    labelXOffset: number,
    labelYOffset: number,
    currentMathLayerScale: number, // Renamed 'scale' for clarity to avoid confusion with `scale` variable scope below
    visible: boolean,
    mathLayerX: number, // Pass the current X position of the math object layer
    mathLayerY: number  // Pass the current Y position of the math object layer
) => {
    // Calculate the absolute stage coordinates for the label based on the math object's position
    // and the math layer's scale and position.
    const stageX = (x * currentMathLayerScale) + mathLayerX;
    const stageY = (y * currentMathLayerScale) + mathLayerY;

    return {
        x: stageX + labelXOffset, // labelXOffset is now directly in pixels
        y: stageY + labelYOffset, // labelYOffset is now directly in pixels
        text: label,
        fontSize: FONT_DEFAULTS.SIZE, // Fixed font size, as layerTextRef is no longer scaled
        fontFamily: FONT_DEFAULTS.FAMILY,
        fill: FONT_DEFAULTS.COLOR,
        visible: visible,
        draggable: true
    }
}

const createPointDefaultShapeProps = (label: string, radius: number = 0.02, labelXOffset: number = 0, labelYOffset: number = 0, labelZOffset: number = 0): Shape['props'] => {
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
        id: uuidv4()
    }
}

const createLineDefaultShapeProps = (label: string, radius: number = 0, labelXOffset: number = 0, labelYOffset: number = 0, labelZOffset: number = 0): Shape['props'] => {
    return {
        line_size: 1,
        line_style: {dash_size: 0, gap_size: 0, dot_size: 0},
        radius: 0,
        label: label,
        visible: {shape: true, label: true},
        fill: true,
        color: 'black',
        labelXOffset: labelXOffset,
        labelYOffset: labelYOffset,
        labelZOffset: labelZOffset,
        id: uuidv4()
    }
}

const createCircleDefaultShapeProps = (label: string, radius: number, labelXOffset: number = 0, labelYOffset: number = 0, labelZOffset: number = 0): Shape['props'] => {
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
        id: uuidv4()
    }
}

const createPolygonDefaultShapeProps = (label: string, radius: number = 0, labelXOffset: number = 0, labelYOffset: number = 0, labelZOffset: number = 0): Shape['props'] => {
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
        id: uuidv4(),
        opacity: 0.1
    }
}

interface CanvasProps {
    width: number;
    height: number;
    background_color: string;
}

class KonvaCanvas extends React.Component<CanvasProps, GeometryState> {
    private layerMathObjectRef: RefObject<Konva.Layer | null>;
    private layerTextRef: RefObject<Konva.Layer | null>;
    private layerAxisRef: RefObject<Konva.Layer | null>;
    private layerGridRef: RefObject<Konva.Layer | null>;
    private stageRef: RefObject<Konva.Stage | null>;
    private last_pointer: {x: number, y: number};
    private label_used: string[];
    private historyStack: GeometryState[] = [];
    private futureStack: GeometryState[] = [];
    private mode: string;

    constructor(props: CanvasProps) {
        super(props);
        this.layerMathObjectRef = React.createRef<Konva.Layer>();
        this.layerTextRef = React.createRef<Konva.Layer>();
        this.layerAxisRef = React.createRef<Konva.Layer>();
        this.layerGridRef = React.createRef<Konva.Layer>();
        this.state = {
            numLoops: 0,
            axisTickInterval: 1,
            spacing: BASE_SPACING,
            shapes: new Map<string, ShapeNode>(),
            gridVisible: true,
            zoom_level: 1,
            axesVisible: true,
            panning: false,
            dummy: false,
            pointIndex: 0,
            circleIndex: 0,
            lineIndex: 0,
            polygonIndex: 0,
            rayIndex: 0,
            segmentIndex: 0,
            vectorIndex: 0,
            selectedShapes: new Array<Point>()
        }

        this.last_pointer = {x: 0, y: 0};
        this.label_used = [];
        this.stageRef = React.createRef<Konva.Stage>();
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleZoom = this.handleZoom.bind(this);
        this.historyStack.push(_.cloneDeep(this.state)); // Initialize history stack with the initial state
        this.mode = 'edit'
    }

    componentDidMount(): void {
        this.drawShapes();
    }

    componentWillUnmount(): void {
        if (this.stageRef.current) {
            this.stageRef.current.off('wheel', this.handleZoom);
            this.stageRef.current.off('mousedown touchstart', this.handleMouseDown);
            this.stageRef.current.off('mousemove touchmove', this.handleMouseMove);
            this.stageRef.current.off('mouseup touchend', this.handleMouseUp);
            this.stageRef.current.off('mouseleave', this.handleMouseUp);
        }
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
            prevState.pointIndex !== this.state.pointIndex ||
            prevState.lineIndex !== this.state.lineIndex ||
            prevState.segmentIndex !== this.state.segmentIndex ||
            prevState.vectorIndex !== this.state.vectorIndex ||
            prevState.circleIndex !== this.state.circleIndex ||
            prevState.polygonIndex !== this.state.polygonIndex ||
            prevState.rayIndex !== this.state.rayIndex ||
            prevState.selectedShapes !== this.state.selectedShapes
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

        // Batch draw all layers
        layer.batchDraw();
        this.layerGridRef.current?.batchDraw();
        this.layerAxisRef.current?.batchDraw();
        this.layerTextRef.current?.batchDraw();

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

    private handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (e.evt.button !== 0) return; // Only handle left mouse button clicks
        if (this.mode !== 'edit') {
            this.handleDrawing();
            return;
        }

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
        if (!this.state.panning) return;
        if (this.mode !== 'edit') {
            this.handleDrawing();
            return;
        }

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
            this.layerTextRef.current?.batchDraw();

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

            scale = this.layerMathObjectRef.current?.getAbsoluteScale().x ?? 1;
            this.layerGridRef.current?.add(
                grid.generateGrid(
                    {x: this.layerGridRef.current?.x(), y: this.layerGridRef.current?.y()},
                    scale,
                    this.state.axisTickInterval
                )
            );

            this.layerGridRef.current?.batchDraw();
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

            scale = this.layerMathObjectRef.current?.getAbsoluteScale().x ?? 1;
            this.layerAxisRef.current.add(
                axes.generateAxis(
                    this.state.axisTickInterval,
                    {x: this.layerAxisRef.current.x(), y: this.layerAxisRef.current.y()},
                    scale,
                    this.layerTextRef.current!
                )
            );
        }
    }

    private drawPoint = (point: Point, props: Shape['props']) => {
        scale = this.layerMathObjectRef.current?.getAbsoluteScale().x ?? 1;
        let radius = props.radius / scale;
        const c = new Konva.Circle({
            x: point.x,
            y: point.y,
            radius: radius * BASE_SPACING,
            fill: props.color,
            stroke: props.color,
            visible: props.visible.shape,
            id: props.id,
            draggable: true,
            strokeWidth: props.line_size / scale,
            hitStrokeWidth: 2,
            strokeScaleEnabled: false
        });

        c.on('mousedown', (e) => {

            if (!["delete", "edit"].includes(this.mode)) {
                return;
            }

            e.cancelBubble = true;
            if (this.mode === "delete") {
                this.removeNode(c.id());
                this.setState({dummy: !this.state.dummy});
                this.historyStack.push(_.cloneDeep(this.state));
                this.futureStack = [];
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

        scale = this.layerMathObjectRef.current?.getAbsoluteScale().x ?? 1;
        let strokeWidth = props.line_size / scale;
        
        const l = new Konva.Line({
            points: [
                line.startLine.x - length * norm_dx,
                line.startLine.y - length * norm_dy,
                line.endLine.x + length * norm_dx,
                line.endLine.y + length * norm_dy
            ],
            dash: createDashArray(props.line_style),
            strokeWidth: strokeWidth,
            stroke: props.color,
            visible: props.visible.shape,
            id: props.id,
            hitStrokeWidth: 2,
            draggable: true
        });

        l.on('mousedown', (e) => {
            if (!["delete", "edit"].includes(this.mode)) {
                return;
            }

            e.cancelBubble = true;
            if (this.mode === "delete") {
                this.removeNode(l.id());
                this.setState({dummy: !this.state.dummy});
                this.historyStack.push(_.cloneDeep(this.state));
                this.futureStack = [];
            }
        })

        return l;
    };

    private drawSegment = (segment: Segment, props: Shape['props']) => {
        scale = this.layerMathObjectRef.current?.getAbsoluteScale().x ?? 1;
        let strokeWidth = props.line_size / scale;
        const s = new Konva.Line({
            points: [
                segment.startSegment.x,
                segment.startSegment.y,
                segment.endSegment.x,
                segment.endSegment.y
            ],
            dash: createDashArray(props.line_style),
            strokeWidth: strokeWidth,
            stroke: props.color,
            visible: props.visible.shape,
            id: props.id,
            hitStrokeWidth: 2,
            draggable: true
        });

        s.on('mousedown', (e) => {
            if (!["delete", "edit"].includes(this.mode)) {
                return;
            }

            e.cancelBubble = true;
            if (this.mode === "delete") {
                this.removeNode(s.id());
                this.setState({dummy: !this.state.dummy});
                this.historyStack.push(_.cloneDeep(this.state));
                this.futureStack = [];
            }
        })

        return s;
    };

    private drawVector = (vector: Vector, props: Shape['props']) => {
        scale = this.layerMathObjectRef.current?.getAbsoluteScale().x ?? 1;
        let strokeWidth = props.line_size / scale;
        const v = new Konva.Arrow({
            points: [
                vector.startVector.x,
                vector.startVector.y,
                vector.endVector.x,
                vector.endVector.y
            ],
            dash: createDashArray(props.line_style),
            strokeWidth: strokeWidth,
            pointerWidth: ARROW_DEFAULTS.POINTER_WIDTH,
            pointerLength: ARROW_DEFAULTS.POINTER_LENGTH,
            stroke: props.color,
            visible: props.visible.shape,
            id: props.id,
            hitStrokeWidth: 2,
            draggable: true,
            fill: props.fill? props.color : 'none'
        });

        v.on('mousedown', (e) => {
            if (!["delete", "edit"].includes(this.mode)) {
                return;
            }

            e.cancelBubble = true;
            if (this.mode === "delete") {
                this.removeNode(v.id());
            }
        })

        return v;
    };

    private drawCircle = (circle: Circle, props: Shape['props']) => {
        scale = this.layerMathObjectRef.current?.getAbsoluteScale().x ?? 1;
        let strokeWidth = props.line_size / scale;
        const c = new Konva.Circle({
            x: circle.centerC.x,
            y: circle.centerC.y,
            radius: circle.radius * BASE_SPACING,
            stroke: props.color,
            strokeWidth: strokeWidth,
            dash: createDashArray(props.line_style),
            visible: props.visible.shape,
            id: props.id,
            hitStrokeWidth: 2,
            draggable: true
        });

        c.on('mousedown', (e) => {
            if (!["delete", "edit"].includes(this.mode)) {
                return;
            }

            e.cancelBubble = true;
            if (this.mode === "delete") {
                this.removeNode(c.id());
                this.setState({dummy: !this.state.dummy});
                this.historyStack.push(_.cloneDeep(this.state));
                this.futureStack = [];
            }
        })

        return c;
    };

    private drawPolygon = (polygon: Polygon, props: Shape['props']) => {
        scale = this.layerMathObjectRef.current?.getAbsoluteScale().x ?? 1;
        let strokeWidth = props.line_size / scale;
        const points = polygon.points.flatMap(point => [point.x, point.y]);
        const opacity = props.opacity ?? 0.1;
        const [r, g, b] = convert2RGB(props.color);

        const p = new Konva.Line({
            points,
            fill: `rgba(${r},${g},${b},${opacity})`,
            dash: createDashArray(props.line_style),
            strokeWidth: strokeWidth,
            stroke: props.color,
            closed: true,
            visible: props.visible.shape,
            id: props.id,
            hitStrokeWidth: 2,
            draggable: true
        });

        p.on('mousedown', (e) => {
            if (!["delete", "edit"].includes(this.mode)) {
                return;
            }

            e.cancelBubble = true;
            if (this.mode === "delete") {
                this.removeNode(p.id());
                this.setState({dummy: !this.state.dummy});
                this.historyStack.push(_.cloneDeep(this.state));
                this.futureStack = [];
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
        scale = this.layerMathObjectRef.current?.getAbsoluteScale().x ?? 1;
        let strokeWidth = props.line_size / scale;
        const r = new Konva.Line({
            points: [
                ray.startRay.x,
                ray.startRay.y,
                ray.startRay.x + length * norm_dx,
                ray.startRay.y + length * norm_dy
            ],
            dash: createDashArray(props.line_style),
            strokeWidth: strokeWidth,
            stroke: props.color,
            visible: props.visible.shape,
            id: props.id,
            hitStrokeWidth: 2,
            draggable: true
        });

        r.on('mousedown', (e) => {
            if (!["delete", "edit"].includes(this.mode)) {
                return;
            }

            e.cancelBubble = true;
            if (this.mode === "delete") {
                this.removeNode(r.id());
                this.setState({dummy: !this.state.dummy});
                this.historyStack.push(_.cloneDeep(this.state));
                this.futureStack = [];
            }
        })

        return r;
    };

    private drawAngle = (shape: Angle, props: Shape['props']): Konva.Arc => {
        scale = this.layerMathObjectRef.current?.getAbsoluteScale().x ?? 1;
        let strokeWidth = props.line_size / scale;
        let a = new Konva.Arc({
            x: shape.vertex.x,
            y: shape.vertex.y,
            innerRadius: 15,
            outerRadius: 20,
            angle: shape.degrees,
            rotation: shape.startAngle,
            stroke: props.color,
            opacity: props.opacity ?? 0.5,
            strokeWidth: strokeWidth,
            visible: props.visible.shape,
            hitStrokeWidth: 2,
            id: props.id
        });

        a.on('mousedown', (e) => {
            if (!["delete", "edit"].includes(this.mode)) {
                return;
            }

            e.cancelBubble = true;
            if (this.mode === "delete") {
                this.removeNode(a.id());
                this.setState({dummy: !this.state.dummy});
                this.historyStack.push(_.cloneDeep(this.state));
                this.futureStack = [];
            }
        })

        return a;
    }

    private createLabel = (shape: Shape): Konva.Text => {
        let x = 0, y = 0;

        if (shape.type === 'Circle') {
            let s: Circle = shape as Circle;
            x = s.centerC.x;
            y = s.centerC.y + s.radius * BASE_SPACING;
        }
        
        else if (shape.type === 'Point') {
            let p: Point = shape as Point;
            x = p.x;
            y = p.y;
        }
        
        else if (shape.type === 'Polygon') {
            let poly: Polygon = shape as Polygon;
            poly.points.forEach((point) => {
                x += point.x;
                y += point.y;
            });

            x /= poly.points.length;
            y /= poly.points.length;
        }
        
        else if (shape.type === 'Vector') {
            let v: Vector = shape as Vector;
            x = (v.endVector.x + v.startVector.x) / 2;
            y = (v.endVector.y + v.startVector.y) / 2;
        }
        
        else if (shape.type === 'Line') {
            let l: Line = shape as Line;
            x = (l.endLine.x + l.startLine.x) / 2;
            y = (l.endLine.y + l.startLine.y) / 2;
        }
        
        else if (shape.type === 'Segment') {
            let s: Segment = shape as Segment;
            x = (s.startSegment.x + s.endSegment.x) / 2;
            y = (s.startSegment.y + s.endSegment.y) / 2;
        }

        else if (shape.type === 'Ray') {
            let r: Ray = shape as Ray;
            x = (r.endRay.x + r.startRay.x) / 2;
            y = (r.endRay.y + r.startRay.y) / 2;
        }

        const currentMathLayerScale = this.layerMathObjectRef.current?.getAbsoluteScale().x ?? 1;
        const mathLayerX = this.layerMathObjectRef.current!.x();
        const mathLayerY = this.layerMathObjectRef.current!.y();
        return new Konva.Text(
            createLabelProps(
                x,
                y,
                shape.props.label,
                shape.props.labelXOffset,
                shape.props.labelYOffset,
                currentMathLayerScale, // Pass the scale of the math layer
                shape.props.visible.shape && shape.props.visible.label,
                mathLayerX, // Pass math layer's X
                mathLayerY  // Pass math layer's Y
            )
        );
    }
    
    private createKonvaShape = (shape: Shape): [Konva.Shape, Konva.Text] => {
        let konvaShape: Konva.Shape;
        switch (shape.type) {
            case 'Circle':
                konvaShape = this.drawCircle(shape as Circle, shape.props);
                break;
            
            case 'Point':
                konvaShape = this.drawPoint(shape as Point, shape.props);
                break;
            
            case 'Line':
                konvaShape = this.drawLine(shape as Line, shape.props);
                break;
            
            case 'Polygon':
                konvaShape = this.drawPolygon(shape as Polygon, shape.props);
                break;

            case 'Vector':
                konvaShape = this.drawVector(shape as Vector, shape.props);
                break;
            
            case 'Ray':
                konvaShape = this.drawRay(shape as Ray, shape.props);
                break;
            
            case 'Segment':
                konvaShape = this.drawSegment(shape as Segment, shape.props);
                break;
            
            default:
                konvaShape = this.drawAngle(shape as Angle, shape.props);
                break;
        }

        return [konvaShape, this.createLabel(shape)];
    };

    private drawShapes = (): void => {
        const shapes = this.state.shapes;
        if (!this.layerMathObjectRef.current) return;
        this.layerMathObjectRef.current.destroyChildren();
        this.layerTextRef.current?.destroyChildren();
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

        shapes.forEach((node) => {
            if (node.type.props.visible.shape) {
                const konvaItem = this.createKonvaShape(node.type);
                (node as ShapeNode).node = konvaItem[0];
                shapeNode.push(node as ShapeNode);
                this.layerMathObjectRef.current!.add(konvaItem[0]);
                this.layerTextRef.current!.add(konvaItem[1]);
            }
        });

        function sortShapesForZIndex(shapes: ShapeNode[]): ShapeNode[] {
            return shapes
                .sort((a, b) => (visualPriority[a.type.type] ?? 0) - (visualPriority[b.type.type] ?? 0));
        }

        shapeNode = sortShapesForZIndex(shapeNode);
        for (let i = 0; i < shapeNode.length; i++) {
            shapeNode[i].node.moveToTop();
        }

        this.layerMathObjectRef.current.getChildren().forEach((node, id) => {
            console.log(`${id}: ${node.getClassName()} - id:${node.id()}`)
        })

        this.layerMathObjectRef.current.draw();
        this.layerTextRef.current?.draw();
        this.layerAxisRef.current?.draw();
        this.layerGridRef.current?.draw();
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

    private handleClearClick = () => {
        this.setState({
            shapes: new Map<string, ShapeNode>(),
            pointIndex: 0,
            lineIndex: 0,
            segmentIndex: 0,
            vectorIndex: 0,
            circleIndex: 0,
            polygonIndex: 0,
            rayIndex: 0,
            selectedShapes: []
        });

        this.label_used = [];
        this.drawShapes();
        this.mode = 'edit';
    }

    private handleUndoClick = () => {
        if (this.historyStack.length > 1) {
            this.futureStack.push(this.historyStack.pop()!);
            const prevState = this.historyStack[this.historyStack.length - 1];
            this.setState({...prevState });
            this.mode = 'edit';
        }

        else {
            this.setState(this.historyStack[0]);
            this.futureStack = []; // Clear future stack if we revert to the initial state
        }
    }

    private handleRedoClick = () => {
        if (this.futureStack.length > 0) {
            const nextState = this.futureStack.pop()!;
            this.historyStack.push(nextState);
            this.setState({...nextState });
            this.mode = 'edit';
        }
    }

    private handleDrawing = () => {
        if (this.mode === 'point') {
            if (!this.stageRef.current) return;
            const pointer = this.stageRef.current.getPointerPosition();
            if (!pointer) return;
            const position = {
                x: (pointer.x - this.layerMathObjectRef.current!.x()) / this.layerMathObjectRef.current!.scaleX(),
                y: (pointer.y - this.layerMathObjectRef.current!.y()) / this.layerMathObjectRef.current!.scaleY()
            }

            let found = false;
            this.state.shapes.forEach((node) => {
                if (node.type.type === 'Point') {
                    let p: Point = node.type as Point
                    // If the mouse is within 2 pixels of the point, don't create a new point
                    if (Math.sqrt(Math.pow(p.x - position.x, 2) + Math.pow(p.y - position.y, 2)) <= 5) {
                        found = true;
                        return;
                    }
                }
            })

            if (found) return;
            let label = this.getExcelLabel('A', this.state.pointIndex);
            let index = this.state.pointIndex;
            while (this.label_used.includes(label)) {
                index++;
                label = this.getExcelLabel('A', index);
            }

            this.label_used.push(label);

            const point: Point = Factory.createPoint(
                createPointDefaultShapeProps(label),
                position.x,
                position.y
            )

            this.state.shapes.set(point.props.id, {
                id: point.props.id,
                type: point,
                node: this.drawPoint(point, point.props),
                dependsOn: []
            })

            this.setState({pointIndex: index + 1});
        }

        else if (['line', 'segment', 'vector', 'ray'].includes(this.mode)) {
            if (!this.stageRef.current) return;
            const pointer = this.stageRef.current.getPointerPosition();
            if (!pointer) return;
            const position = {
                x: (pointer.x - this.layerMathObjectRef.current!.x()) / this.layerMathObjectRef.current!.scaleX(),
                y: (pointer.y - this.layerMathObjectRef.current!.y()) / this.layerMathObjectRef.current!.scaleY()
            }

            let found = false;
            this.state.shapes.forEach((node) => {
                if (node.type.type === 'Point') {
                    let p: Point = node.type as Point
                    if (Math.sqrt(Math.pow(p.x - position.x, 2) + Math.pow(p.y - position.y, 2)) <= 5) {
                        this.state.selectedShapes.push(p);
                        found = true;
                        return;
                    }
                }
            })

            if (!found) {
                let label = this.getExcelLabel('A', this.state.pointIndex);
                let index = this.state.pointIndex;
                while (this.label_used.includes(label)) {
                    index++;
                    label = this.getExcelLabel('A', index);
                }

                this.label_used.push(label);
                const point: Point = Factory.createPoint(
                    createPointDefaultShapeProps(label),
                    position.x,
                    position.y
                )
    
                this.state.shapes.set(point.props.id, {
                    id: point.props.id,
                    type: point,
                    node: this.drawPoint(point, point.props),
                    dependsOn: []
                });

                this.setState({pointIndex: index + 1});
                this.state.selectedShapes.push(point);
            }

            if (this.state.selectedShapes.length === 1) {
                const p = this.state.selectedShapes[0];
                if (Math.sqrt(Math.pow(p.x - position.x, 2) + Math.pow(p.y - position.y, 2)) <= 5) {
                    return;
                }
            }

            else {
                const [p1, p2] = Array.from(this.state.selectedShapes);
                if (this.mode === 'line') {
                    let label = this.getExcelLabel('f', this.state.lineIndex);
                    let index = this.state.lineIndex;
                    while (this.label_used.includes(label)) {
                        index++;
                        label = this.getExcelLabel('f', index);
                    }

                    this.label_used.push(label);

                    const dx = p2.x - p1.x;
                    const dy = p2.y - p1.y;

                    let length = 2 * Math.max(this.props.width, this.props.height) * Math.sqrt(dx * dx + dy * dy) / this.state.zoom_level;
                    const line: Line = Factory.createLine(
                        createLineDefaultShapeProps(
                            label,
                            0,
                            p1.x - length * dx,
                            (p1.y - length * dy - 10 < 0) ? p1.y - length * dy - 10 : p1.y - length * dy + 10,
                            0
                        ),
                        p1,
                        p2
                    )

                    this.state.shapes.set(line.props.id, {
                        id: line.props.id,
                        type: line,
                        node: this.drawLine(line, line.props),
                        dependsOn: [p1.props.id, p2.props.id]
                    });

                    this.setState({lineIndex: index + 1});
                    this.state.selectedShapes.splice(0, this.state.selectedShapes.length);
                }

                else if (this.mode === 'segment') {
                    let label = this.getExcelLabel('f', this.state.segmentIndex);
                    let index = this.state.segmentIndex;
                    while (this.label_used.includes(label)) {
                        index++;
                        label = this.getExcelLabel('f', index);
                    }

                    this.label_used.push(label);
                    const segment: Segment = {
                        startSegment: p1,
                        endSegment: p2,
                        props: createLineDefaultShapeProps(label, 0, 0, 10, 0),
                        type: 'Segment'
                    }

                    this.state.shapes.set(segment.props.id, {
                        id: segment.props.id,
                        type: segment,
                        node: this.drawSegment(segment, segment.props),
                        dependsOn: [p1.props.id, p2.props.id]
                    });

                    this.setState({segmentIndex: index + 1});
                    this.state.selectedShapes.splice(0, this.state.selectedShapes.length);
                }

                else if (this.mode === 'vector') {
                    let label = this.getExcelLabel('u', this.state.vectorIndex);
                    let index = this.state.vectorIndex;
                    while (this.label_used.includes(label)) {
                        index++;
                        label = this.getExcelLabel('u', index);
                    }

                    this.label_used.push(label);
                    const vector: Vector = {
                        startVector: p1,
                        endVector: p2,
                        props: createLineDefaultShapeProps(label, 0, 0, 10, 0),
                        type: 'Vector'
                    }

                    this.state.shapes.set(vector.props.id, {
                        id: vector.props.id,
                        type: vector,
                        node: this.drawVector(vector, vector.props),
                        dependsOn: [p1.props.id, p2.props.id]
                    });

                    this.setState({vectorIndex: index + 1});
                    this.state.selectedShapes.splice(0, this.state.selectedShapes.length);
                }

                else if (this.mode === 'ray') {
                    let label = this.getExcelLabel('f', this.state.rayIndex);
                    let index = this.state.rayIndex;
                    while (this.label_used.includes(label)) {
                        index++;
                        label = this.getExcelLabel('f', index);
                    }

                    this.label_used.push(label);
                    const ray: Ray = {
                        startRay: p1,
                        endRay: p2,
                        props: createLineDefaultShapeProps(label, 0, 0, 10, 0),
                        type: 'Ray'
                    }

                    this.state.shapes.set(ray.props.id, {
                        id: ray.props.id,
                        type: ray,
                        node: this.drawRay(ray, ray.props),
                        dependsOn: [p1.props.id, p2.props.id]
                    });

                    this.setState({rayIndex: index + 1});
                    this.state.selectedShapes.splice(0, this.state.selectedShapes.length);
                }
            }
        }

        else if (this.mode === 'polygon') {
            if (!this.stageRef.current) return;
            const pointer = this.stageRef.current.getPointerPosition();
            if (!pointer) return;
            const position = {
                x: (pointer.x - this.layerMathObjectRef.current!.x()) / this.layerMathObjectRef.current!.scaleX(),
                y: (pointer.y - this.layerMathObjectRef.current!.y()) / this.layerMathObjectRef.current!.scaleY()
            }

            let found = false;
            this.state.shapes.forEach((node) => {
                if (node.type.type === 'Point') {
                    let p: Point = node.type as Point
                    if (Math.sqrt(Math.pow(p.x - position.x, 2) + Math.pow(p.y - position.y, 2)) <= 5) {
                        this.state.selectedShapes.push(p);
                        found = true;
                        return;
                    }
                }
            })

            if (!found) {
                let label = this.getExcelLabel('A', this.state.pointIndex);
                let index = this.state.pointIndex;
                while (this.label_used.includes(label)) {
                    index++;
                    label = this.getExcelLabel('A', index);
                }

                this.label_used.push(label);
                const point: Point = Factory.createPoint(
                    createPointDefaultShapeProps(label),
                    position.x,
                    position.y
                )
    
                this.state.shapes.set(point.props.id, {
                    id: point.props.id,
                    type: point,
                    node: this.drawPoint(point, point.props),
                    dependsOn: []
                });

                this.setState({pointIndex: index + 1});
                this.state.selectedShapes.push(point);
            }

            if (this.state.selectedShapes.length < 4) {
                let points = Array.from(this.state.selectedShapes);
                const lastPoint = points[points.length - 1];
                for (let i = 0; i < points.length - 1; i++) {
                    if (points[i] === lastPoint) {
                        this.state.selectedShapes.splice(i, 1);
                        this.state.selectedShapes.pop();
                        return;
                    }
                }

                return;
            }
            
            else {
                let points = Array.from(this.state.selectedShapes);
                if (points[0] !== points[points.length - 1]) {
                    for (let i = 1; i < points.length - 1; i++) {
                        if (points[i] === points[points.length - 1]) {
                            this.state.selectedShapes.splice(i, 1);
                            this.state.selectedShapes.pop();
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

                    this.state.shapes.set(polygon.props.id, {
                        id: polygon.props.id,
                        type: polygon,
                        node: this.drawPolygon(polygon, polygon.props),
                        dependsOn: dependencies
                    });

                    this.setState({polygonIndex: this.state.polygonIndex + 1});
                    this.state.selectedShapes.splice(0, this.state.selectedShapes.length);
                }
            }
        }

        else if (this.mode === 'circle') {
            if (!this.stageRef.current) return;
            const pointer = this.stageRef.current.getPointerPosition();
            if (!pointer) return;
            const position = {
                x: (pointer.x - this.layerMathObjectRef.current!.x()) / this.layerMathObjectRef.current!.scaleX(),
                y: (pointer.y - this.layerMathObjectRef.current!.y()) / this.layerMathObjectRef.current!.scaleY()
            }

            let found = false;
            this.state.shapes.forEach((node) => {
                if (node.type.type === 'Point') {
                    let p: Point = node.type as Point
                    if (Math.sqrt(Math.pow(p.x - position.x, 2) + Math.pow(p.y - position.y, 2)) <= 5) {
                        this.state.selectedShapes.push(p);
                        found = true;
                        return;
                    }
                }
            })

            if (!found) {
                let label = this.getExcelLabel('A', this.state.pointIndex);
                let index = this.state.pointIndex;
                while (this.label_used.includes(label)) {
                    index++;
                    label = this.getExcelLabel('A', index);
                }

                this.label_used.push(label);
                const point: Point = Factory.createPoint(
                    createPointDefaultShapeProps(label),
                    position.x,
                    position.y
                )

                this.state.shapes.set(point.props.id, {
                    id: point.props.id,
                    type: point,
                    node: this.drawPoint(point, point.props),
                    dependsOn: []
                })

                this.setState({pointIndex: index + 1});
                this.state.selectedShapes.push(point);
            }

            let input = prompt('Enter the radius of the circle');
            if (!input) return;
            try {
                const radius = math.evaluate(input);
                if (typeof radius !== 'number' || radius <= 0) {
                    alert('Invalid radius');
                    return;
                }

                const point = this.state.selectedShapes[0];
                let label = this.getExcelLabel('c', this.state.circleIndex);
                let index = this.state.circleIndex;
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

                this.state.shapes.set(circle.props.id, {
                    id: circle.props.id,
                    type: circle,
                    node: this.drawCircle(circle, circle.props),
                    dependsOn: [point.props.id]
                });

                this.setState({circleIndex: index + 1});
                this.state.selectedShapes.splice(0, this.state.selectedShapes.length);
            }

            catch (error) {
                alert('Invalid expression for radius');
            }
        }

        this.historyStack.push(_.cloneDeep(this.state));
        this.futureStack = [];
    }

    private findChildren = (id: string): string[] => {
        if (!this.state.shapes.get(id)) {
            return [];
        }

        let children: string[] = [];
        this.state.shapes.forEach((value, key) => {
            if (value.dependsOn.includes(id)) {
                children.push(key)
            }
        })

        return children;
    } 

    private updateAndPropagate = (id: string, updateFn: (node: ShapeNode) => ShapeNode) => {
        const node = this.state.shapes.get(id);
        if (!node) return;

        const updated = updateFn(node as ShapeNode);
        this.state.shapes.set(id, updated);

        let children = this.findChildren(id);
        for (const child of children) {
            this.updateAndPropagate(child, this.computeUpdateFor);
        }
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
        return { ...node }
    }

    private updateSegment = (node: ShapeNode): ShapeNode => {
        const [id1, id2] = node.dependsOn;
        const p1 = this.state.shapes.get(id1);
        const p2 = this.state.shapes.get(id2);
        if (!p1 || !p2) return { ...node };

        const posA = (p1 as ShapeNode).node.position();
        const posB = (p2 as ShapeNode).node.position();

        const line = node.node as Konva.Line;
        line.points([posA.x, posA.y, posB.x, posB.y]);
        return { ...node };
    }

    private updateLine = (node: ShapeNode): ShapeNode => {
        const [id1, id2] = node.dependsOn;
        const p1 = this.state.shapes.get(id1);
        const p2 = this.state.shapes.get(id2);
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
        return { ...node };
    }

    private updateRay = (node: ShapeNode): ShapeNode => {
        const [id1, id2] = node.dependsOn;
        const p1 = this.state.shapes.get(id1);
        const p2 = this.state.shapes.get(id2);
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
        return { ...node };
    }

    private updatePolygon = (node: ShapeNode): ShapeNode => {
        const pointIds = node.dependsOn;
        const points: number[] = [];
        for (const pid of pointIds) {
            const pointNode = this.state.shapes.get(pid);
            if (!pointNode) {
                return { ...node };
            }

            const pos = (pointNode as ShapeNode).node.position();
            points.push(pos.x, pos.y);
        }

        const polygon = node.node as Konva.Line;
        polygon.points(points);
        return { ...node };
    }

    private updateCircle = (node: ShapeNode): ShapeNode => {
        let id = node.dependsOn[0];
        let centerNode = this.state.shapes.get(id);
        if (!centerNode) {
            return { ...node };
        }

        let circleNode = node.node as Konva.Circle;
        circleNode.position((centerNode as ShapeNode).node.position());
        return { ...node };
    }

    private updateVector = (node: ShapeNode): ShapeNode => {
        const [id1, id2] = node.dependsOn;
        const [start, end] = [this.state.shapes.get(id1), this.state.shapes.get(id2)];
        if (!start || !end) {
            return { ...node };
        }

        const posA = (start as ShapeNode).node.position();
        const posB = (end as ShapeNode).node.position();
        
        let vectorNode = node.node as Konva.Arrow;
        vectorNode.points([posA.x, posA.y, posB.x, posB.y]);
        return { ...node };
    }

    private updateMidpoint = (node: ShapeNode): ShapeNode => {
        const [id1, id2] = node.dependsOn;
        const [start, end] = [this.state.shapes.get(id1), this.state.shapes.get(id2)];
        if (!start || !end) {
            return { ...node };
        }

        const posA = (start as ShapeNode).node.position();
        const posB = (end as ShapeNode).node.position();
        
        let point = node.node as Konva.Circle;
        point.position({x: (posA.x + posB.x) / 2, y: (posA.y + posB.y) / 2});
        return { ...node };
    }

    private updateCentroid = (node: ShapeNode): ShapeNode => {
        const [id1, id2, id3] = node.dependsOn;
        const [p1, p2, p3] = [this.state.shapes.get(id1), this.state.shapes.get(id2), this.state.shapes.get(id3)];
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
            return { ...node };
        }

        catch (error) {
            node.node.hide();
            return { ...node };
        }
    }

    private updateOrthocenter = (node: ShapeNode): ShapeNode => {
        const [id1, id2, id3] = node.dependsOn;
        const [p1, p2, p3] = [this.state.shapes.get(id1), this.state.shapes.get(id2), this.state.shapes.get(id3)];
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
            return { ...node };
        }

        catch (error) {
            node.node.hide();
            return { ...node };
        }
    }

    private updateCircumcenter = (node: ShapeNode): ShapeNode => {
        const [id1, id2, id3] = node.dependsOn;
        const [p1, p2, p3] = [this.state.shapes.get(id1), this.state.shapes.get(id2), this.state.shapes.get(id3)];
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
            return { ...node };
        }

        catch (error) {
            node.node.hide();
            return { ...node };
        }
    }

    private updateIncenter = (node: ShapeNode): ShapeNode => {
        const [id1, id2, id3] = node.dependsOn;
        const [p1, p2, p3] = [this.state.shapes.get(id1), this.state.shapes.get(id2), this.state.shapes.get(id3)];
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
            return { ...node };
        }

        catch (error) {
            node.node.hide();
            return { ...node };
        }
    }

    private updateCircle2Point = (node: ShapeNode): ShapeNode => {
        const [id1, id2] = node.dependsOn;
        const [start, end] = [this.state.shapes.get(id1), this.state.shapes.get(id2)];
        if (!start || !end) {
            return { ...node };
        }

        const posA = (start as ShapeNode).node.position();
        const posB = (end as ShapeNode).node.position();
        
        let point = node.node as Konva.Circle;
        point.position({x: posA.x, y: posA.y});
        point.radius(Math.hypot(posB.x - posA.x, posB.y - posA.y));
        return { ...node };
    }

    private updateIntersection = (node: ShapeNode): ShapeNode => {
        const [id1, id2] = node.dependsOn;
        const shape1 = this.state.shapes.get(id1);
        const shape2 = this.state.shapes.get(id2);

        if (!shape1 || !shape2) {
            return { ...node };
        }

        const intersections = operation.getIntersections2D(shape1.type, shape2.type);
        if (!intersections || intersections.length === 0) {
            node.node.hide();
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

        return { ...node };
    }

    private updateMedian = (node: ShapeNode): ShapeNode => {
        const [id1, id2] = node.dependsOn;
        const shape1 = this.state.shapes.get(id1);
        const shape2 = this.state.shapes.get(id2);

        if (!shape1 || !shape2) {
            return { ...node };
        }
        
        let points = ((shape2 as ShapeNode).node as Konva.Line).points()
        let midPoint = {
            x: (points[0] + points[2]) / 2,
            y: (points[1] + points[3]) / 2
        }

        let start = (shape1 as ShapeNode).node
        let s = node.node as Konva.Line;
        s.points([start.position().x, start.position().y, midPoint.x, midPoint.y]);
        return { ...node };
    }

    private updateAngleBisector = (node: ShapeNode): ShapeNode => {
        let ids = node.dependsOn;
        if (ids.length === 3) {
            // Handle 3 points
            let [shape1, shape2, shape3] = [this.state.shapes.get(ids[0]), this.state.shapes.get(ids[1]), this.state.shapes.get(ids[2])];
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
            return { ...node };
        }

        else if (ids.length === 2) {
            // Handle 2 lines
            let [shape1, shape2] = [this.state.shapes.get(ids[0]), this.state.shapes.get(ids[1])];
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
                return { ...node };
            }
            catch (error) {
                node.node.hide();
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
            let [shape1, shape2, shape3] = [this.state.shapes.get(ids[0]), this.state.shapes.get(ids[1]), this.state.shapes.get(ids[2])];
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
                return (Math.atan2(-v.y, v.x) * 180) / Math.PI;
            }

            const clampAngle = (degree: number) => {
                return (degree + 360) % 360;
            }

            let startAngle = clampAngle(angleFromXAxis(BA));
            
            let a = node.node as Konva.Arc;
            a.position({x: B.x, y: B.y});
            a.angle(angle);
            a.rotation(startAngle);
            return { ...node };
        }

        else if (ids.length === 2) {
            // Handle 2 lines
            let [shape1, shape2] = [this.state.shapes.get(ids[0]), this.state.shapes.get(ids[1])];
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
                return { ...node };
            }
            catch (error) {
                node.node.hide();
                return { ...node };
            }
        }

        else {
            return { ...node };
        } 
    }

    private updateCircle3Point = (node: ShapeNode): ShapeNode => {
        const [id1, id2, id3] = node.dependsOn;
        const [p1, p2, p3] = [this.state.shapes.get(id1), this.state.shapes.get(id2), this.state.shapes.get(id3)];
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
            return { ...node };
        }

        catch(error) {
            node.node.hide();
            return { ...node };
        }
    }

    private updateIncircle3Point = (node: ShapeNode): ShapeNode => {
        const [id1, id2, id3] = node.dependsOn;
        const [p1, p2, p3] = [this.state.shapes.get(id1), this.state.shapes.get(id2), this.state.shapes.get(id3)];
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
            return { ...node };
        }

        catch(error) {
            node.node.hide();
            return { ...node };
        }
    }

    private updateSemiCircle = (node: ShapeNode): ShapeNode => {
        const [id1, id2] = node.dependsOn;
        const [start, end] = [this.state.shapes.get(id1), this.state.shapes.get(id2)];
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
            return (Math.atan2(-v.y, v.x) * 180) / Math.PI;
        }

        const clampAngle = (degree: number) => {
            return (degree + 360) % 360;
        }

        let startAngle = clampAngle(angleFromXAxis(MB));

        let arc = node.node as Konva.Arc;
        arc.position({x: M.x, y: M.y});
        arc.rotation(startAngle);
        arc.angle(180);
        return { ...node };
    }

    private updateReflection = (node: ShapeNode): ShapeNode => {
        const [id1, id2] = node.dependsOn;
        const shape1 = this.state.shapes.get(id1);
        const shape2 = this.state.shapes.get(id2);

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
        const point = this.state.shapes.get(pointId);
        const circle = this.state.shapes.get(circleId);
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
            const shape = this.state.shapes.get(node.dependsOn[0]);
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
            const [start, end] = [this.state.shapes.get(id1), this.state.shapes.get(id2)];
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
        const [start, end] = [this.state.shapes.get(id1), this.state.shapes.get(id2)];
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
        const [start, end] = [this.state.shapes.get(id1), this.state.shapes.get(id2)];
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
        const [shape1, shape2, shape3] = [this.state.shapes.get(id1), this.state.shapes.get(id2), this.state.shapes.get(id3)];
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
        const [p1, p2, p3] = [this.state.shapes.get(id1), this.state.shapes.get(id2), this.state.shapes.get(id3)];
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
            return { ...node };
        }

        catch(error) {
            node.node.hide();
            return { ...node };
        }
    }

    private updateExcenter = (node: ShapeNode): ShapeNode => {
        const [id1, id2, id3] = node.dependsOn;
        const [p1, p2, p3] = [this.state.shapes.get(id1), this.state.shapes.get(id2), this.state.shapes.get(id3)];
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
            return { ...node };
        }

        catch (error) {
            node.node.hide();
            return { ...node };
        }
    }

    private updateRotation = (node: ShapeNode): ShapeNode => {
        const [id1, id2] = node.dependsOn;
        const [p1, p2] = [this.state.shapes.get(id1), this.state.shapes.get(id2)];
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
        const [p1, p2] = [this.state.shapes.get(id1), this.state.shapes.get(id2)];
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

    private removeNode = (id: string): void => {
        const node = this.state.shapes.get(id);
        if (!node) return;

        // Step 1: Find all nodes that depend on this node
        const dependents: string[] = [];
        this.state.shapes.forEach((value, key) => {
            if (value.dependsOn.includes(id)) {
                dependents.push(key);
            }
        })

        // Step 2: Recursively delete dependents
        for (const dependent of dependents) {
            this.removeNode(dependent);
        }

        // Step 3: Remove from Konva stage
        (node as ShapeNode).node.destroy();

        // Step 4: Remove from DAG
        this.state.shapes.delete(id);
    }

    render(): React.ReactNode {
        const { width, height, background_color } = this.props;
        return (
            <div className="flex flex-row h-full">
                <GeometryTool
                    width={width * 0.28}
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
                />
                <Stage 
                    ref={this.stageRef} 
                    width={width * 0.72}
                    height={height} 
                    style={{background: background_color}}
                    onWheel={this.handleZoom}
                    onMouseDown={this.handleMouseDown}
                    onMouseMove={this.handleMouseMove}
                    onMouseUp={this.handleMouseUp}
                    onMouseLeave={this.handleMouseUp}
                >
                    <Layer ref={this.layerMathObjectRef} />
                    <Layer ref={this.layerAxisRef} />
                    <Layer ref={this.layerGridRef} />
                    <Layer ref={this.layerTextRef} />
                </Stage>
            </div>
        )
    }
}

export default KonvaCanvas;