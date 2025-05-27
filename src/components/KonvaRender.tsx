import React, { RefObject } from "react";
import { Line, Vector, Segment, Polygon, Point, Circle, Ray, Shape, LineStyle, GeometryState, ShapeNode } from "../types/geometry"
import Konva from "konva";
import { Stage, Layer } from "react-konva";
import { isCircle, isPoint, isPolygon, isVector, isLine, isSegment, isRay } from "../utils/type_guard";
import { KonvaAxis } from "../utils/KonvaAxis";
import { KonvaGrid } from "../utils/KonvaGrid";
import GeometryTool from "./GeometryTool";
import { v4 as uuidv4 } from 'uuid';
import { create } from "lodash";
const math = require("mathjs");

if (!Number.isInteger) {
    (Number as any).isInteger = function (value: any) { // Use (Number as any) to avoid TS errors
        return typeof value === 'number' &&
            isFinite(value) &&
            Math.floor(value) === value;
    };
}

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
        // Prevent zooming out too much
        if (newScale < 0.005 || newScale > 200) {
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
        if (numLoops === 7 || numLoops === -7) {
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
                strokeWidth: 0.25,
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
            strokeWidth: props.line_size / scale
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

        if (isCircle(shape)) {
            x = shape.centerC.x;
            y = shape.centerC.y + shape.radius * BASE_SPACING;
        }
        
        else if (isPoint(shape)) {
            x = shape.x;
            y = shape.y;
        }
        
        else if (isPolygon(shape)) {
            shape.points.forEach((point) => {
                x += point.x;
                y += point.y;
            });

            x /= shape.points.length;
            y /= shape.points.length;
        }
        
        else if (isVector(shape)) {
            x = (shape.endVector.x + shape.startVector.x) / 2;
            y = (shape.endVector.y + shape.startVector.y) / 2;
        }
        
        else if (isLine(shape)) {
            x = (shape.endLine.x + shape.startLine.x) / 2;
            y = (shape.endLine.y + shape.startLine.y) / 2;
        }
        
        else if (isSegment(shape)) {
            x = (shape.startSegment.x + shape.endSegment.x) / 2;
            y = (shape.startSegment.y + shape.endSegment.y) / 2;
        }

        else if (isRay(shape)) {
            x = (shape.endRay.x + shape.startRay.x) / 2;
            y = (shape.endRay.y + shape.startRay.y) / 2;
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

        if (isCircle(shape)) {
            konvaShape = this.drawCircle(shape, shape.props);
        }
        
        else if (isPoint(shape)) {
            konvaShape = this.drawPoint(shape, shape.props);
        }
        
        else if (isPolygon(shape)) {
            konvaShape = this.drawPolygon(shape, shape.props);
        }
        
        else if (isVector(shape)) {
            konvaShape = this.drawVector(shape, shape.props);
        }
        
        else if (isLine(shape)) {
            konvaShape = this.drawLine(shape, shape.props);
        }

        else if (isRay(shape)) {
            konvaShape = this.drawRay(shape, shape.props);
        }
        
        else {
            konvaShape = this.drawSegment(shape as Segment, shape.props);
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

        this.drawAxes();
        this.drawGrid();

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
                if (isPoint(node.type)) {
                    // If the mouse is within 2 pixels of the point, don't create a new point
                    if (Math.abs(Math.pow(node.type.x - position.x, 2) + Math.pow(node.type.y - position.y, 2)) <= 5) {
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

            const point: Point = {
                x: position.x,
                y: position.y,
                props: createPointDefaultShapeProps(label)
            }

            this.state.shapes.set(point.props.id, {
                id: point.props.id,
                type: point,
                node: this.drawPoint(point, point.props),
                sharedWith: []
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
                if (isPoint(node.type)) {
                    if (Math.abs(Math.pow(node.type.x - position.x, 2) + Math.pow(node.type.y - position.y, 2)) <= 5) {
                        this.state.selectedShapes.push(node.type);
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
                const point: Point = {
                    x: position.x,
                    y: position.y,
                    props: createPointDefaultShapeProps(label)
                }
    
                this.state.shapes.set(point.props.id, {
                    id: point.props.id,
                    type: point,
                    node: this.drawPoint(point, point.props),
                    sharedWith: []
                });

                this.setState({pointIndex: index + 1});
                this.state.selectedShapes.push(point);
            }

            if (this.state.selectedShapes.length === 1) {
                const p = this.state.selectedShapes[0];
                if (Math.abs(Math.pow(p.x - position.x, 2) + Math.pow(p.y - position.y, 2)) <= 5) {
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
                    const line: Line = {
                        startLine: p1,
                        endLine: p2,
                        props: createLineDefaultShapeProps(
                            label,
                            0,
                            p1.x - length * dx,
                            (p1.y - length * dy - 10 < 0) ? p1.y - length * dy - 10 : p1.y - length * dy + 10,
                            0
                        )
                    }

                    this.state.shapes.set(line.props.id, {
                        id: line.props.id,
                        type: line,
                        node: this.drawLine(line, line.props),
                        sharedWith: []
                    });

                    this.state.shapes.forEach((node) => {
                        if (node.id === p1.props.id || node.id === p2.props.id) {
                            node.sharedWith.push(line.props.id);
                        }
                    })

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
                        props: createLineDefaultShapeProps(label, 0, 0, 10, 0)
                    }

                    this.state.shapes.set(segment.props.id, {
                        id: segment.props.id,
                        type: segment,
                        node: this.drawSegment(segment, segment.props),
                        sharedWith: []
                    });

                    this.state.shapes.forEach((node) => {
                        if (node.id === p1.props.id || node.id === p2.props.id) {
                            node.sharedWith.push(segment.props.id);
                        }
                    })

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
                        props: createLineDefaultShapeProps(label, 0, 0, 10, 0)
                    }

                    this.state.shapes.set(vector.props.id, {
                        id: vector.props.id,
                        type: vector,
                        node: this.drawVector(vector, vector.props),
                        sharedWith: []
                    });

                    this.state.shapes.forEach((node) => {
                        if (node.id === p1.props.id || node.id === p2.props.id) {
                            node.sharedWith.push(vector.props.id);
                        }
                    })

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
                        props: createLineDefaultShapeProps(label, 0, 0, 10, 0)
                    }

                    this.state.shapes.set(ray.props.id, {
                        id: ray.props.id,
                        type: ray,
                        node: this.drawRay(ray, ray.props),
                        sharedWith: []
                    });

                    this.state.shapes.forEach((node) => {
                        if (node.id === p1.props.id || node.id === p2.props.id) {
                            node.sharedWith.push(ray.props.id);
                        }
                    })

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
                if (isPoint(node.type)) {
                    if (Math.abs(Math.pow(node.type.x - position.x, 2) + Math.pow(node.type.y - position.y, 2)) <= 5) {
                        this.state.selectedShapes.push(node.type);
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
                const point: Point = {
                    x: position.x,
                    y: position.y,
                    props: createPointDefaultShapeProps(label)
                }
    
                this.state.shapes.set(point.props.id, {
                    id: point.props.id,
                    type: point,
                    node: this.drawPoint(point, point.props),
                    sharedWith: []
                });

                this.setState({pointIndex: index + 1});
                this.state.selectedShapes.push(point);
            }
            
            if (this.state.selectedShapes.length >= 4) {
                let points = Array.from(this.state.selectedShapes);
                if (points[0] !== points[points.length - 1]) {
                    for (let i = 1; i < points.length - 1; i++) {
                        if (points[i] === points[points.length - 1]) {
                            this.state.selectedShapes.splice(i, 1);
                            this.state.selectedShapes.pop();
                            return;
                        }
                    }
                }

                else {
                    points.pop();
                    let label = `poly${this.state.polygonIndex + 1}`;
                    const polygon: Polygon = {
                        points: points,
                        props: createPolygonDefaultShapeProps(label, 0, 0, 10, 0)
                    }

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
                        const segment: Segment = {
                            startSegment: start,
                            endSegment: end,
                            props: createPolygonDefaultShapeProps(label, 0, 0, 10, 0)
                        }

                        this.state.shapes.set(segment.props.id, {
                            id: segment.props.id,
                            type: segment,
                            node: this.drawSegment(segment, segment.props),
                            sharedWith: [polygon.props.id]
                        });

                        this.state.shapes.forEach((node) => {
                            if (node.id === start.props.id || node.id === end.props.id) {
                                node.sharedWith.push(segment.props.id);
                                node.sharedWith.push(polygon.props.id);
                            }
                        })

                        this.setState({segmentIndex: index + 1});
                    }

                    this.state.shapes.set(polygon.props.id, {
                        id: polygon.props.id,
                        type: polygon,
                        node: this.drawPolygon(polygon, polygon.props),
                        sharedWith: []
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
                if (isPoint(node.type)) {
                    if (Math.abs(Math.pow(node.type.x - position.x, 2) + Math.pow(node.type.y - position.y, 2)) <= 5) {
                        this.state.selectedShapes.push(node.type);
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

                const point: Point = {
                    x: position.x,
                    y: position.y,
                    props: createPointDefaultShapeProps(label)
                }

                this.state.shapes.set(point.props.id, {
                    id: point.props.id,
                    type: point,
                    node: this.drawPoint(point, point.props),
                    sharedWith: []
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
                
                const circle: Circle = {
                    centerC: point,
                    radius: radius,
                    props: createCircleDefaultShapeProps(label, radius, 0, 10, 0)
                }   

                this.state.shapes.set(circle.props.id, {
                    id: circle.props.id,
                    type: circle,
                    node: this.drawCircle(circle, circle.props),
                    sharedWith: []
                });

                this.state.shapes.forEach((node) => {
                    if (node.id === point.props.id) {
                        node.sharedWith.push(circle.props.id);
                    }
                })

                this.setState({circleIndex: index + 1});
                this.state.selectedShapes.splice(0, this.state.selectedShapes.length);
            }
            catch (error) {
                alert('Invalid expression for radius');
            }
        }
    }

    render(): React.ReactNode {
        const { width, height, background_color } = this.props;
        return (
            <div>
                <GeometryTool
                    onPointClick={this.handlePointClick}
                    onLineClick={this.handleLineClick}
                    onSegmentClick={this.handleSegmentClick}
                    onVectorClick={this.handleVectorClick}
                    onPolygonClick={this.handlePolygonClick}
                    onCircleClick={this.handleCircleClick}
                    onRayClick={this.handleRayClick} />
                <Stage 
                    ref={this.stageRef} 
                    width={width} 
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