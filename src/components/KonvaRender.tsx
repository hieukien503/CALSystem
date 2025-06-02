import React, { RefObject } from "react";
import { Line, Vector, Segment, Polygon, Point, Circle, Ray, Shape, LineStyle, GeometryState, ShapeNode } from "../types/geometry"
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
            selectedShapes: new Array<Point>(),
            mode: 'none'
        }

        this.last_pointer = {x: 0, y: 0};
        this.label_used = [];
        this.stageRef = React.createRef<Konva.Stage>();
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleZoom = this.handleZoom.bind(this);
        this.historyStack.push(_.cloneDeep(this.state)); // Initialize history stack with the initial state
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
            prevState.selectedShapes !== this.state.selectedShapes ||
            prevState.mode !== this.state.mode
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
        if (this.state.mode !== 'none') {
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
            hitStrokeWidth: 20
        });

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
            draggable: true
        });

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
            draggable: true
        });

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
            draggable: true,
            fill: props.fill? props.color : 'none'
        });

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
            draggable: true
        });

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
            draggable: true
        });

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
            draggable: true
        });

        return r;
    };

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
            
            default:
                konvaShape = this.drawSegment(shape as Segment, shape.props);
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

        shapes.forEach((node) => {
            if (node.type.props.visible.shape) {
                const konvaItem = this.createKonvaShape(node.type);
                this.layerMathObjectRef.current!.add(konvaItem[0]);
                this.layerTextRef.current!.add(konvaItem[1]);
            }
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
        this.setState({mode: 'point'});
    }

    private handleLineClick = () => {
        this.setState({mode: 'line'});
    }

    private handleSegmentClick = () => {
        this.setState({mode: 'segment'});
    }

    private handleVectorClick = () => {
        this.setState({mode: 'vector'});
    }

    private handlePolygonClick = () => {
        this.setState({mode: 'polygon'});
    }

    private handleCircleClick = () => {
        this.setState({mode: 'circle'});
    }

    private handleRayClick = () => {
        this.setState({mode: 'ray'});
    }

    private handleEditClick = () => {
        this.setState({mode: 'edit'});
    }

    private handleDeleteClick = () => {
        this.setState({mode: 'delete'});
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
            selectedShapes: [],
            mode: 'none'
        });

        this.label_used = [];
        this.drawShapes();
    }

    private handleUndoClick = () => {
        console.log(this.historyStack, this.futureStack);
        if (this.historyStack.length > 1) {
            this.futureStack.push(this.historyStack.pop()!);
            const prevState = this.historyStack[this.historyStack.length - 1];
            this.setState({...prevState, mode: 'none'});
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
            this.setState({...nextState, mode: 'none'});
        }
    }

    private handleDrawing = () => {
        if (this.state.mode === 'point') {
            if (!this.stageRef.current) return;
            const pointer = this.stageRef.current.getPointerPosition();
            if (!pointer) return;
            const position = {
                x: (pointer.x - this.layerMathObjectRef.current!.x()) / this.layerMathObjectRef.current!.scaleX(),
                y: (pointer.y - this.layerMathObjectRef.current!.y()) / this.layerMathObjectRef.current!.scaleY()
            }

            this.state.shapes.forEach((node) => {
                if (node.type.type === 'Point') {
                    let p: Point = node.type as Point
                    // If the mouse is within 2 pixels of the point, don't create a new point
                    if (Math.abs(Math.pow(p.x - position.x, 2) + Math.pow(p.y - position.y, 2)) <= 10) {
                        return;
                    }
                }
            })

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

        else if (['line', 'segment', 'vector', 'ray'].includes(this.state.mode)) {
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
                    if (Math.abs(Math.pow(p.x - position.x, 2) + Math.pow(p.y - position.y, 2)) <= 10) {
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
                if (Math.abs(Math.pow(p.x - position.x, 2) + Math.pow(p.y - position.y, 2)) <= 10) {
                    return;
                }
            }

            else {
                const [p1, p2] = Array.from(this.state.selectedShapes);
                if (this.state.mode === 'line') {
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

                else if (this.state.mode === 'segment') {
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

                else if (this.state.mode === 'vector') {
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

                else if (this.state.mode === 'ray') {
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

        else if (this.state.mode === 'polygon') {
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
                    if (Math.abs(Math.pow(p.x - position.x, 2) + Math.pow(p.y - position.y, 2)) <= 10) {
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

                    polygon.area = operation.getArea(polygon);

                    let dependcies: string[] = [];
                    dependcies = points.map(point => point.props.id);
                    for (let i = 0; i < points.length; i++) {
                        // Create a segment for each 2 consecutive points
                        const start = points[i];
                        const end = points[(i + 1) % points.length];
                        label = this.getExcelLabel('a', this.state.segmentIndex);
                        let index = this.state.segmentIndex;
                        while (this.label_used.includes(label)) {
                            index++;
                            label = this.getExcelLabel('a', index);
                        }

                        this.label_used.push(label);
                        const segment: Segment = Factory.createSegment(
                            createPolygonDefaultShapeProps(label, 0, 0, 10, 0),
                            start,
                            end
                        )

                        this.state.shapes.set(segment.props.id, {
                            id: segment.props.id,
                            type: segment,
                            node: this.drawSegment(segment, segment.props),
                            dependsOn: [start.props.id, end.props.id]
                        });

                        dependcies.push(segment.props.id);
                        this.setState({segmentIndex: index + 1});
                    }

                    this.state.shapes.set(polygon.props.id, {
                        id: polygon.props.id,
                        type: polygon,
                        node: this.drawPolygon(polygon, polygon.props),
                        dependsOn: dependcies
                    });

                    this.setState({polygonIndex: this.state.polygonIndex + 1});
                    this.state.selectedShapes.splice(0, this.state.selectedShapes.length);
                }
            }
        }

        else if (this.state.mode === 'circle') {
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
                    if (Math.abs(Math.pow(p.x - position.x, 2) + Math.pow(p.y - position.y, 2)) <= 10) {
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