import React, { RefObject } from "react";
import { Line, Point, Shape, GeometryState, ShapeNode, DrawingMode, HistoryEntry, Segment, Ray, Vector, Circle, Polygon, Angle, SemiCircle } from "../types/geometry"
import Konva from "konva";
import { Stage, Layer } from "react-konva";
import { KonvaAxis } from "../utils/KonvaAxis";
import { KonvaGrid } from "../utils/KonvaGrid";
import * as Factory from '../utils/Factory'
import * as utils from '../utils/utilities'
import * as constants from '../types/constants'
import * as operation from '../utils/math_operation'
const math = require('mathjs');

interface CanvasProps {
    width: number;
    height: number;
    background_color: string;
    geometryState: GeometryState;
    dag: Map<string, ShapeNode>,
    mode: DrawingMode;
    isSnapToGrid: boolean;
    isResize: boolean;
    selectedPoints: Point[];
    selectedShapes: Shape[];
    labelUsed: string[];
    onChangeMode: (mode: DrawingMode) => void;
    onClearCanvas: () => void;
    onUpdateLastFailedState: (state?: {
        selectedPoints: Point[], selectedShapes: Shape[]
    }) => void;
    onUpdateAll: (state: {
        gs: GeometryState,
        dag: Map<string, ShapeNode>,
        selectedShapes: Shape[],
        selectedPoints: Point[]
    }) => void;
    onSelectedShapesChange: (s: Shape[]) => void;
    onSelectedPointsChange: (s: Point[]) => void;
    onGeometryStateChange: (s: GeometryState) => void;
    pushHistory: (history: HistoryEntry) => void;
    getSnapshot: () => HistoryEntry;
    onLabelUsed: (labelUsed: string[]) => void;
    onSelectedChange: (s: {
        selectedShapes: Shape[],
        selectedPoints: Point[]
    }) => void;
    onRenderMenuRightClick: (pos?: {x: number, y: number}) => void;
}

class KonvaCanvas extends React.Component<CanvasProps, {}> {
    private layerMathObjectRef: RefObject<Konva.Layer | null>;
    private layerUnchangeVisualRef: RefObject<Konva.Layer | null>;
    private layerAxisRef: RefObject<Konva.Layer | null>;
    private layerGridRef: RefObject<Konva.Layer | null>;
    private stageRef: RefObject<Konva.Stage | null>;
    private last_pointer: {x: number, y: number};
    private moveFrameId: number | null = null;
    private zoomFrameId: number | null = null;

    constructor(props: CanvasProps) {
        super(props);
        this.layerMathObjectRef = React.createRef<Konva.Layer>();
        this.layerUnchangeVisualRef = React.createRef<Konva.Layer>();
        this.layerAxisRef = React.createRef<Konva.Layer>();
        this.layerGridRef = React.createRef<Konva.Layer>();
        this.last_pointer = {x: 0, y: 0};
        this.stageRef = React.createRef<Konva.Stage>();
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleZoom = this.handleZoom.bind(this);
    }

    componentDidMount(): void {
        this.drawShapes();
    }

    componentDidUpdate(prevProps: Readonly<CanvasProps>): void {
        if (
            prevProps.geometryState !== this.props.geometryState ||
            prevProps.dag !== this.props.dag
        ) {
            this.drawShapes();
        }
    }

    private handleZoom = (e: Konva.KonvaEventObject<MouseEvent>) => {
        e.evt.preventDefault();
        const stage = this.stageRef.current;
        const layer = this.layerMathObjectRef.current;
        if (this.zoomFrameId) {
            cancelAnimationFrame(this.zoomFrameId);
        }

        this.zoomFrameId = requestAnimationFrame(() => {
            if (!stage || !layer) return null;

            const oldScale = layer.scaleX();
            const pointer = stage.getPointerPosition();
            if (!pointer) return null;

            const event = e.evt as WheelEvent;
            let newScale = oldScale * (event.deltaY < 0 ? constants.ZOOM_FACTOR : 1 / constants.ZOOM_FACTOR);

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

            this.props.dag.forEach((node, key) => {
                if ('x' in node.type) {
                    (node.node as Konva.Circle).radius(node.type.props.radius * constants.BASE_SPACING / newScale);
                }

                node.node.strokeWidth(node.type.props.line_size / newScale);
                node.node.hitStrokeWidth(2 / newScale);
                node.node.dash(utils.createDashArray({
                    dash_size: node.type.props.line_style.dash_size / newScale,
                    dot_size: node.type.props.line_style.dot_size ?? 0 / newScale,
                    gap_size: node.type.props.line_style.gap_size / newScale
                }))
            })

            // Batch draw all layers
            layer.batchDraw();
            this.layerGridRef.current?.batchDraw();
            this.layerAxisRef.current?.batchDraw();
            this.layerUnchangeVisualRef.current?.batchDraw();

            let numLoops = this.props.geometryState.numLoops + (newScale > oldScale ? -1 : (newScale < oldScale ? 1 : 0));
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

            let axisTickInterval = this.props.geometryState.axisTickInterval;
            if (numLoops === 8 || numLoops === -8) {
                axisTickInterval = calcNextInterval(axisTickInterval, numLoops > 0);
                numLoops = 0;
            }

            this.props.onGeometryStateChange({
                ...this.props.geometryState,
                numLoops: numLoops,
                axisTickInterval: axisTickInterval,
                zoom_level: newScale,
                spacing: constants.BASE_SPACING
            });
        })
        
    }

    private handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (!this.stageRef.current || !this.layerMathObjectRef.current) return;
        const pointer = this.stageRef.current.getPointerPosition();
        if (!pointer) return;
        if (e.evt.button !== 0) {
            this.stageRef.current.container()!.addEventListener('contextmenu', (e) => e.preventDefault());
            this.props.onRenderMenuRightClick({x: e.evt.clientX, y: e.evt.clientY});
            return;
        }

        this.props.onRenderMenuRightClick();
        if (this.props.mode !== 'edit') {
            let position = {
                x: (pointer.x - this.layerMathObjectRef.current.x()) / this.layerMathObjectRef.current.scaleX(),
                y: (pointer.y - this.layerMathObjectRef.current.y()) / this.layerMathObjectRef.current.scaleY()
            }

            this.last_pointer = position;

            position = this.props.isSnapToGrid? utils.snapToGrid(
                pointer,
                constants.BASE_SPACING,
                this.props.geometryState.axisTickInterval,
                this.stageRef.current.width() / 2,
                this.stageRef.current.height() / 2,
                this.layerMathObjectRef.current!
            ) : position;

            let shapes = this.stageRef.current.getAllIntersections(pointer);
            let children = shapes.filter(node => (node.getLayer() === this.layerMathObjectRef.current) || node.getLayer() === this.layerAxisRef.current);
            let shape = children.length > 0 ? children[0] : undefined;

            if (this.props.mode === 'intersection' && children.length > 1) {
                this.createPoint(position, children);
                return;
            }

            if (!shape || (shape && !shape.id().includes('point-'))) {
                if (!['length', 'area'].includes(this.props.mode) && 
                    !(shape && shape.id().includes('polygon-') && ['orthocenter', 'centroid', 'circumcenter', 'incenter', 'excenter', 'circumcircle', 'incircle', 'excircle'].includes(this.props.mode)) &&
                    !(this.props.mode === 'intersection')
                ) {
                    this.createPoint(position, children);
                }
            }

            else if (shape && shape.id().includes('point-')) {
                let shapeNode = this.props.dag.get(shape.id());
                this.props.onUpdateLastFailedState({
                    selectedPoints: [...this.props.selectedPoints, shapeNode!.type as Point],
                    selectedShapes: [...this.props.selectedShapes]
                })

                this.props.onSelectedPointsChange([...this.props.selectedPoints, shapeNode!.type as Point]);
            }

            else if (['show_label', 'show_object'].includes(this.props.mode)) {
                if (!shape) return;
                let shapeNode = this.props.dag.get(shape.id());
                if (!shapeNode) return;
                if (this.props.mode === 'show_object') {
                    let prevState = shapeNode.type.props.visible;
                    if (prevState.label === prevState.shape) {
                        shapeNode.type.props.visible.shape = !prevState.shape;
                        shapeNode.type.props.visible.label = !prevState.label;
                    }

                    else {
                        shapeNode.type.props.visible.shape = !prevState.shape;
                    }

                    shape.visible(shapeNode.type.props.visible.shape);
                }

                else {
                    shapeNode.type.props.visible.label = !shapeNode.type.props.visible.label;
                }

                let text = this.layerUnchangeVisualRef.current?.findOne(`#label-${shape.id()}`);
                if (!text) return;
                text.visible(shapeNode.type.props.visible.label);
            }

            if (shape) {
                let pNode = this.props.dag.get(shape.id());
                if (!pNode) {
                    let l: Line = Factory.createLine(
                        utils.createLineDefaultShapeProps(shape.id()),
                        Factory.createPoint(
                            utils.createPointDefaultShapeProps(''),
                            this.stageRef.current.width() / 2,
                            this.stageRef.current.height() / 2
                        ),

                        Factory.createPoint(
                            utils.createPointDefaultShapeProps(''),
                            this.stageRef.current.width() / 2 + (shape.id().includes('x-axis') ? 1 : 0),
                            this.stageRef.current.height() / 2 + (shape.id().includes('y-axis') ? 1 : 0)
                        ),
                    )

                    const newSelected = [...this.props.selectedShapes, l];
                    this.props.onSelectedShapesChange(newSelected);
                }
                
                else {
                    if (!shape.id().includes(pNode.type.type)) {
                        const newSelected = [...this.props.selectedShapes, pNode.type];
                        this.props.onSelectedShapesChange(newSelected);
                    }
                }
            }

            setTimeout(() => this.handleDrawing(), 0);
            return;
        }

        this.stageRef.current.container().className = this.stageRef.current.getIntersection(pointer) ? "cursor_drag" : "cursor_grabbing"
        if (e.target === this.stageRef.current || e.target instanceof Konva.Stage) {
            this.last_pointer = {
                x: pointer.x,
                y: pointer.y
            }

            this.props.onGeometryStateChange({
                ...this.props.geometryState,
                panning: true
            });
        }
    }

    private handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (this.moveFrameId) {
            cancelAnimationFrame(this.moveFrameId);
        }

        this.moveFrameId = requestAnimationFrame(() => {
            const layer = this.layerMathObjectRef.current;
            const stage = this.stageRef.current;
            if (!layer || !stage) return null;
            if (this.props.isResize) {
                stage.container().style.cursor = 'ew-resize';
                return null;
            }

            const pos = stage.getPointerPosition();
            const shapesUnderCursor = pos ? stage.getAllIntersections(pos) : [];
            const shapes = shapesUnderCursor.filter(node => node.getLayer() === this.layerMathObjectRef.current);

            stage.container().className = shapesUnderCursor.length > 0 ? "cursor_drag" : (this.props.geometryState.panning ? "cursor_grabbing" : "cursor_hit");

            const ids: string[] = [];
            shapes.forEach(node => {
                ids.push(node.id());
            });

            this.props.dag.forEach((node, key) => {
                if (ids.includes(node.id)) {
                    if (node.id.includes('point-')) {
                        (node.node as Konva.Circle).shadowColor('gray');
                        (node.node as Konva.Circle).shadowBlur((node.node as Konva.Circle).radius() * 2.5);
                        (node.node as Konva.Circle).shadowOpacity(1.5);
                    }
                    
                    else {
                        const strokeWidth = node.type.props.line_size / this.props.geometryState.zoom_level;
                        node.node.strokeWidth(strokeWidth * 2);
                    }
                }

                else {
                    if (node.id.includes('point-')) {
                        (node.node as Konva.Circle).shadowBlur(0);
                        (node.node as Konva.Circle).shadowOpacity(0);
                    }
                    
                    else {
                        const strokeWidth = node.type.props.line_size / this.props.geometryState.zoom_level;
                        node.node.strokeWidth(strokeWidth);
                    }
                }
            })
            
            if (this.props.mode !== 'edit') {
                return;
            }
            
            if (!this.props.geometryState.panning) return;

            if (e.target === stage || e.target instanceof Konva.Stage) {
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

                // Update labels
                this.layerUnchangeVisualRef.current?.getChildren().forEach((node) => {
                    node.position({x: node.x() + dx, y: node.y() + dy});
                })

                this.last_pointer = {
                    x: pointer.x,
                    y: pointer.y
                };

                // Batch draw all layers
                layer.batchDraw();
                this.layerAxisRef.current?.batchDraw();
                this.layerGridRef.current?.batchDraw();
                this.layerUnchangeVisualRef.current?.batchDraw();

                this.props.onGeometryStateChange({...this.props.geometryState});
            }
        })
    }

    private handleMouseUp = () => {
        if (this.props.geometryState.panning) {
                this.props.onGeometryStateChange({
                ...this.props.geometryState,
                panning: false
            });
        }
        

        this.stageRef.current!.container().className = "cursor_hit";
    }

    private drawGrid = (): void => {
        if (this.props.geometryState.gridVisible && this.layerGridRef.current) {
            const grid = new KonvaGrid({
                width: this.stageRef.current!.width(),
                height: this.props.height,
                gridColor: 'gray',
                gridSize: this.props.geometryState.spacing,
                strokeWidth: 0.75,
                originX: this.stageRef.current!.width() / 2,
                originY: this.stageRef.current!.height() / 2,
                opacity: 0.5
            });

            let scale = this.layerMathObjectRef.current?.getAbsoluteScale().x ?? 1;
            this.layerGridRef.current?.add(
                grid.generateGrid(
                    this.layerGridRef.current.position(),
                    scale,
                    this.props.geometryState.axisTickInterval
                )
            );
        }
    }
    
    private drawAxes = (): void => {
        if (this.props.geometryState.axesVisible && this.layerAxisRef.current) {
            const axes = new KonvaAxis({
                width: this.stageRef.current!.width(),
                height: this.stageRef.current!.height(),
                axisColor: 'gray',
                axisWidth: 1,
                pointerWidth: constants.ARROW_DEFAULTS.POINTER_WIDTH,
                pointerLength: constants.ARROW_DEFAULTS.POINTER_LENGTH,
                xTickSpacing: this.props.geometryState.spacing,
                originX: this.stageRef.current!.width() / 2,
                originY: this.stageRef.current!.height() / 2,
                opacity: 0.5
            });

            let scale = this.layerMathObjectRef.current?.getAbsoluteScale().x ?? 1;
            axes.generateAxis(
                this.props.geometryState.axisTickInterval,
                this.layerAxisRef.current,
                scale,
                this.layerUnchangeVisualRef.current!
            )
        }
    }

    private drawShapes = (): void => {
        if (!this.stageRef.current || !this.layerMathObjectRef.current) return;
        this.layerUnchangeVisualRef.current?.destroyChildren();
        this.layerAxisRef.current?.destroyChildren();
        this.layerGridRef.current?.destroyChildren();

        this.drawGrid();
        this.drawAxes();

        const visualPriority: Record<string, number> = {
            'Circle': 0,
            'Circle2Point': 1,
            'Circumcircle': 2,
            'Incircle': 3,
            'Excircle': 4,
            'SemiCircle': 5,

            'Polygon': 6,

            'RegularPolygon': 7,

            'Line': 8,
            'Ray': 9,
            'ParallelLine': 10,

            'Segment': 11,
            'Vector': 12,
            'TangentLine': 13,
            'Median': 14,
            'PerpendicularLine': 15,
            'PerpendicularBisector': 16,

            'InternalAngleBisector': 17,
            'ExternalAngleBisector': 18,

            'Centroid': 19,
            'Orthocenter': 20,
            'Circumcenter': 21,
            'Incenter': 22,
            'Excenter': 23,
            'Midpoint': 24,
            'Intersection': 25,
            'Projection': 26,

            'Reflection': 27,
            'Rotation': 28,
            'Enlarge': 29,
            'Translation': 30,

            'Angle': 31,

            'Point': 32
        };

        let shapeNode: ShapeNode[] = [];

        const children = [...this.layerMathObjectRef.current.getChildren()];

        children.forEach((node, id) => {
            if (!this.props.dag.get(node.id())) {
                node.remove();
            }
            
            else {
                const idx = node.id();
                const n = this.props.dag.get(idx);
                node.setAttrs((n as ShapeNode).node.getAttrs());
            }
        });

        this.props.dag.forEach((node, key) => {
            if (!this.layerMathObjectRef.current?.findOne(`#${node.id}`)) {
                this.layerMathObjectRef.current?.add(node.node);
            }

            shapeNode.push(node);
            let label = this.createLabel(node);
            if (!node.defined || ((node.type.props.visible.shape && !node.type.props.visible.label) || !node.type.props.visible.shape)) {
                label.hide();
            }

            this.layerUnchangeVisualRef.current?.add(label);
        })

        function sortShapesForZIndex(shapes: ShapeNode[]): ShapeNode[] {
            return shapes.sort((a, b) => (visualPriority[a.type.type] ?? 0) - (visualPriority[b.type.type] ?? 0));
        }

        shapeNode = sortShapesForZIndex(shapeNode);
        shapeNode.forEach((shape) => {
            if (shape.node.getLayer()) {
                shape.node.moveToTop();
            }
        });
        
        this.layerGridRef.current?.draw();
        this.layerUnchangeVisualRef.current?.draw();
        this.layerAxisRef.current?.draw();
        this.layerMathObjectRef.current.draw();
    }

    private drawPoint = (point: Point) => {
        const props = point.props;
        const scaledStrokeWidth = props.line_size / (this.layerMathObjectRef.current!.scaleX() ?? 1);

        const c = new Konva.Circle({
            x: point.x,
            y: point.y,
            radius: props.radius * constants.BASE_SPACING / (this.layerMathObjectRef.current!.scaleX() ?? 1),
            fill: props.color,
            stroke: props.color,
            visible: props.visible.shape,
            id: props.id,
            draggable: true,
            strokeWidth: scaledStrokeWidth,
            hitStrokeWidth: 2
        });

        c.visible(props.visible.shape);

        c.on('mousedown', (e) => {
            if (!["delete", "edit"].includes(this.props.mode)) {
                return;
            }

            e.cancelBubble = true;
            let stage = e.target.getStage();
            if (stage) {
                stage.container().style.cursor = 'pointer';
            }

            if (this.props.mode === "delete") {
                this.removeNode(c.id());
                this.props.pushHistory(this.props.getSnapshot());
            }
        })

        c.on('dragstart', (e) => {
            if (this.props.mode !== 'edit') {
                return;
            }

            e.cancelBubble = true;
            let stage = e.target.getStage();
            if (stage) {
                stage.container().style.cursor = 'pointer';
            }
        })
        
        c.on('dragmove', (e) => {
            if (this.props.mode !== 'edit') {
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
                const finalMathPos = this.props.isSnapToGrid ? utils.snapToGrid(
                    pos,
                    constants.BASE_SPACING,
                    this.props.geometryState.axisTickInterval,
                    this.stageRef.current!.width() / 2,
                    this.stageRef.current!.height() / 2,
                    this.layerMathObjectRef.current!
                ) : {
                    x: (pos.x - this.layerMathObjectRef.current!.x()) / this.layerMathObjectRef.current!.scaleX(),
                    y: (pos.y - this.layerMathObjectRef.current!.y()) / this.layerMathObjectRef.current!.scaleY()
                };

                node.node.position({x: finalMathPos.x, y: finalMathPos.y});
                point.x = finalMathPos.x;
                point.y = finalMathPos.y;

                if (this.layerUnchangeVisualRef.current) {
                    let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node.id()));
                    if (label) {
                        label.setAttrs(this.createLabel(node).getAttrs());
                    }
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

    private drawLine = (line: Line) => {
        const props = line.props;
        const dx = line.endLine.x - line.startLine.x;
        const dy = line.endLine.y - line.startLine.y;

        let length = 2 * Math.max(this.stageRef.current!.width(), this.stageRef.current!.height()) * Math.sqrt(dx * dx + dy * dy) / (this.layerMathObjectRef.current!.scaleX() ?? 1);
        let norm_dx = dx / Math.sqrt(dx * dx + dy * dy);
        let norm_dy = dy / Math.sqrt(dx * dx + dy * dy);

        const scale = (this.layerMathObjectRef.current!.scaleX() ?? 1);
        const scaledStrokeWidth = props.line_size / scale;
        
        const l = new Konva.Line({
            points: [
                line.startLine.x - length * norm_dx,
                line.startLine.y - length * norm_dy,
                line.endLine.x + length * norm_dx,
                line.endLine.y + length * norm_dy
            ],
            dash: utils.createDashArray(props.line_style),
            strokeWidth: scaledStrokeWidth,
            stroke: props.color,
            visible: props.visible.shape,
            id: props.id,
            hitStrokeWidth: 2,
            draggable: true
        });

        l.visible(props.visible.shape);

        l.on('mousedown', (e) => {
            if (!["delete", "edit"].includes(this.props.mode)) {
                return;
            }

            e.cancelBubble = true;
            let stage = e.target.getStage();
            if (stage) {
                stage.container().style.cursor = 'pointer';
            }

            if (this.props.mode === "delete") {
                this.removeNode(l.id());
                this.props.pushHistory(this.props.getSnapshot());
            }
        });

        let oldPos = {
            x: 0,
            y: 0
        }

        l.on('dragstart', (e) => {
            if (this.props.mode !== "edit") {
                return;
            }

            e.cancelBubble = true;
            let stage = e.target.getStage();
            if (stage) {
                stage.container().style.cursor = 'pointer';
            }

            oldPos = this.stageRef.current!.getPointerPosition() ?? oldPos;
        })

        l.on('dragmove', (e) => {
            if (this.props.mode !== "edit") {
                return;
            }

            e.cancelBubble = true;
            let stage = e.target.getStage();
            if (stage) {
                stage.container().style.cursor = 'pointer';
            }

            e.target.position({ x: 0, y: 0 });
            const pos = this.stageRef.current!.getPointerPosition();
            if (!pos) return;
            let dx = pos.x - oldPos.x;
            let dy = pos.y - oldPos.y;

            let [id1, id2] = [line.startLine.props.id, line.endLine.props.id];
            const [p1, p2] = [this.props.dag.get(id1), this.props.dag.get(id2)];
            if (!p1 || !p2) {
                return;
            }

            let node1 = (p1 as ShapeNode).node;
            let node2 = (p2 as ShapeNode).node;
            oldPos = pos;

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

    private drawSegment = (segment: Segment) => {
        const props = segment.props;
        const scale = (this.layerMathObjectRef.current!.scaleX() ?? 1);
        const scaledStrokeWidth = props.line_size / scale;

        const s = new Konva.Line({
            points: [
                segment.startSegment.x,
                segment.startSegment.y,
                segment.endSegment.x,
                segment.endSegment.y
            ],
            dash: utils.createDashArray(props.line_style),
            strokeWidth: scaledStrokeWidth,
            stroke: props.color,
            visible: props.visible.shape,
            id: props.id,
            hitStrokeWidth: 2,
            draggable: true,

        });

        s.visible(props.visible.shape);

        s.on('mousedown', (e) => {
            if (!["delete", "edit"].includes(this.props.mode)) {
                return;
            }

            e.cancelBubble = true;
            let stage = e.target.getStage();
            if (stage) {
                stage.container().style.cursor = 'pointer';
            }

            if (this.props.mode === "delete") {
                this.removeNode(s.id());
                this.props.pushHistory(this.props.getSnapshot());
            }
        })

        let oldPos = {
            x: 0,
            y: 0
        }

        s.on('dragstart', (e) => {
            if (this.props.mode !== "edit") {
                return;
            }

            e.cancelBubble = true;
            let stage = e.target.getStage();
            if (stage) {
                stage.container().style.cursor = 'pointer';
            }

            oldPos = this.stageRef.current!.getPointerPosition() ?? oldPos;
        })

        s.on('dragmove', (e) => {
            if (this.props.mode !== "edit") {
                return;
            }

            e.cancelBubble = true;
            let stage = e.target.getStage();
            if (stage) {
                stage.container().style.cursor = 'pointer';
            }

            e.target.position({ x: 0, y: 0 });
            const pos = this.stageRef.current!.getPointerPosition();
            if (!pos) return;

            let dx = pos.x - oldPos.x;
            let dy = pos.y - oldPos.y;

            let [id1, id2] = [segment.startSegment.props.id, segment.endSegment.props.id];
            const [p1, p2] = [this.props.dag.get(id1), this.props.dag.get(id2)];
            if (!p1 || !p2) {
                return;
            }

            let node1 = (p1 as ShapeNode).node;
            let node2 = (p2 as ShapeNode).node;
            oldPos = pos;

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

    private drawVector = (vector: Vector) => {
        const props = vector.props;
        const scale = (this.layerMathObjectRef.current!.scaleX() ?? 1);
        const scaledStrokeWidth = props.line_size / scale;

        const v = new Konva.Arrow({
            points: [
                vector.startVector.x,
                vector.startVector.y,
                vector.endVector.x,
                vector.endVector.y
            ],
            dash: utils.createDashArray(props.line_style),
            strokeWidth: scaledStrokeWidth,
            pointerWidth: constants.ARROW_DEFAULTS.POINTER_WIDTH,
            pointerLength: constants.ARROW_DEFAULTS.POINTER_LENGTH,
            stroke: props.color,
            visible: props.visible.shape,
            id: props.id,
            hitStrokeWidth: 2,
            draggable: true,
            fill: props.fill? props.color : 'none',

        });

        v.visible(props.visible.shape);

        v.on('mousedown', (e) => {
            if (!["delete", "edit"].includes(this.props.mode)) {
                return;
            }

            e.cancelBubble = true;
            let stage = e.target.getStage();
            if (stage) {
                stage.container().style.cursor = 'pointer';
            }

            if (this.props.mode === "delete") {
                this.removeNode(v.id());
                this.props.pushHistory(this.props.getSnapshot());
            }
        })

        let oldPos = {
            x: 0,
            y: 0
        }

        v.on('dragstart', (e) => {
            if (this.props.mode !== "edit") {
                return;
            }

            e.cancelBubble = true;
            let stage = e.target.getStage();
            if (stage) {
                stage.container().style.cursor = 'pointer';
            }

            oldPos = this.stageRef.current!.getPointerPosition() ?? oldPos;
        })

        v.on('dragmove', (e) => {
            if (this.props.mode !== "edit") {
                return;
            }

            e.cancelBubble = true;
            let stage = e.target.getStage();
            if (stage) {
                stage.container().style.cursor = 'pointer';
            }

            e.target.position({ x: 0, y: 0 });
            const pos = this.stageRef.current!.getPointerPosition();
            if (!pos) return;
            let dx = pos.x - oldPos.x;
            let dy = pos.y - oldPos.y;

            let [id1, id2] = [vector.startVector.props.id, vector.endVector.props.id];
            const [p1, p2] = [this.props.dag.get(id1), this.props.dag.get(id2)];
            if (!p1 || !p2) {
                return;
            }

            let node1 = (p1 as ShapeNode).node;
            let node2 = (p2 as ShapeNode).node;
            oldPos = pos;

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

    private drawCircle = (circle: Circle) => {
        const props = circle.props;
        const scale = (this.layerMathObjectRef.current!.scaleX() ?? 1);
        const scaledStrokeWidth = props.line_size / scale;

        const c = new Konva.Circle({
            x: circle.centerC.x,
            y: circle.centerC.y,
            radius: circle.radius,
            stroke: props.color,
            strokeWidth: scaledStrokeWidth,
            dash: utils.createDashArray(props.line_style),
            visible: props.visible.shape,
            id: props.id,
            draggable: true,

        });

        c.visible(props.visible.shape);

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

        c.on('mousedown', (e) => {
            if (!["delete", "edit"].includes(this.props.mode)) {
                return;
            }

            e.cancelBubble = true;
            let stage = e.target.getStage();
            if (stage) {
                stage.container().style.cursor = 'pointer';
            }

            if (this.props.mode === "delete") {
                this.removeNode(c.id());
                this.props.pushHistory(this.props.getSnapshot());
            }
        })

        let oldPos = {
            x: 0,
            y: 0
        }

        c.on('dragstart', (e) => {
            if (this.props.mode !== "edit") {
                return;
            }

            e.cancelBubble = true;
            let stage = e.target.getStage();
            if (stage) {
                stage.container().style.cursor = 'pointer';
            }

            oldPos = this.stageRef.current!.getPointerPosition() ?? oldPos;
        })

        c.on('dragmove', (e) => {
            if (this.props.mode !== "edit") {
                return;
            }

            e.cancelBubble = true;
            let stage = e.target.getStage();
            if (stage) {
                stage.container().style.cursor = 'pointer';
            }

            e.target.position({ x: 0, y: 0 });
            const pos = this.stageRef.current!.getPointerPosition();
            if (!pos) return;
            let dx = pos.x - oldPos.x;
            let dy = pos.y - oldPos.y;

            let id = circle.centerC.props.id;
            const p = this.props.dag.get(id);
            if (!p) {
                return;
            }

            let node = (p as ShapeNode).node;
            oldPos = pos;

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

    private drawPolygon = (polygon: Polygon) => {
        const props = polygon.props
        const points = polygon.points.flatMap(point => [point.x, point.y]);
        const opacity = props.opacity ?? 0.1;
        const [r, g, b] = utils.convert2RGB(props.color);

        const scale = (this.layerMathObjectRef.current!.scaleX() ?? 1);
        const scaledStrokeWidth = props.line_size / scale;

        const p = new Konva.Line({
            points,
            fill: `rgba(${r},${g},${b},${opacity})`,
            dash: utils.createDashArray(props.line_style),
            strokeWidth: scaledStrokeWidth,
            stroke: props.color,
            closed: true,
            visible: props.visible.shape,
            id: props.id,
            hitStrokeWidth: 2,
            draggable: true
        });

        p.visible(props.visible.shape);

        p.on('mousedown', (e) => {
            if (!["delete", "edit"].includes(this.props.mode)) {
                return;
            }

            e.cancelBubble = true;
            let stage = e.target.getStage();
            if (stage) {
                stage.container().style.cursor = 'pointer';
            }

            if (this.props.mode === "delete") {
                this.removeNode(p.id());
                this.props.pushHistory(this.props.getSnapshot());
            }
        })

        let oldPos = {
            x: 0,
            y: 0
        }

        p.on('dragstart', (e) => {
            if (this.props.mode !== "edit") {
                return;
            }

            e.cancelBubble = true;
            let stage = e.target.getStage();
            if (stage) {
                stage.container().style.cursor = 'pointer';
            }

            oldPos = this.stageRef.current!.getPointerPosition() ?? oldPos;
        })

        p.on('dragmove', (e) => {
            if (this.props.mode !== "edit") {
                return;
            }

            e.cancelBubble = true;
            let stage = e.target.getStage();
            if (stage) {
                stage.container().style.cursor = 'pointer';
            }

            e.target.position({ x: 0, y: 0 });
            const pos = this.stageRef.current!.getPointerPosition();
            if (!pos) return;
            let dx = pos.x - oldPos.x;
            let dy = pos.y - oldPos.y;

            let ids: string[] = [];
            polygon.points.forEach(id => {
                ids.push(id.props.id);
            });

            let shapeNode: ShapeNode[] = [];
            for (let i = 0; i < ids.length; i++) {
                let id = ids[i];
                let point = this.props.dag.get(id);
                if (!point) return;
                shapeNode.push(point as ShapeNode);
            }

            shapeNode.forEach(node => {
                let point = node.node;
                oldPos = pos;

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

    private drawRay = (ray: Ray) => {
        const props = ray.props;
        const dx = ray.endRay.x - ray.startRay.x;
        const dy = ray.endRay.y - ray.startRay.y;

        let norm_dx = dx / Math.sqrt(dx * dx + dy * dy);
        let norm_dy = dy / Math.sqrt(dx * dx + dy * dy);
        let length = 2 * Math.max(this.stageRef.current!.width(), this.stageRef.current!.height()) * Math.sqrt(dx * dx + dy * dy) / (this.layerMathObjectRef.current!.scaleX() ?? 1);

        const scale = (this.layerMathObjectRef.current!.scaleX() ?? 1);
        const scaledStrokeWidth = props.line_size / scale;

        const r = new Konva.Line({
            points: [
                ray.startRay.x,
                ray.startRay.y,
                ray.startRay.x + length * norm_dx,
                ray.startRay.y + length * norm_dy
            ],
            dash: utils.createDashArray(props.line_style),
            strokeWidth: scaledStrokeWidth,
            stroke: props.color,
            visible: props.visible.shape,
            id: props.id,
            hitStrokeWidth: 2,
            draggable: true,
        });

        r.visible(props.visible.shape);

        r.on('mousedown', (e) => {
            if (!["delete", "edit"].includes(this.props.mode)) {
                return;
            }

            e.cancelBubble = true;
            let stage = e.target.getStage();
            if (stage) {
                stage.container().style.cursor = 'pointer';
            }

            if (this.props.mode === "delete") {
                this.removeNode(r.id());
                this.props.pushHistory(this.props.getSnapshot());
            }
        })

        let oldPos = {
            x: 0,
            y: 0
        }

        r.on('dragstart', (e) => {
            if (this.props.mode !== "edit") {
                return;
            }

            e.cancelBubble = true;
            let stage = e.target.getStage();
            if (stage) {
                stage.container().style.cursor = 'pointer';
            }

            oldPos = this.stageRef.current!.getPointerPosition() ?? oldPos;
        })

        r.on('dragmove', (e) => {
            if (this.props.mode !== "edit") {
                return;
            }

            e.cancelBubble = true;
            let stage = e.target.getStage();
            if (stage) {
                stage.container().style.cursor = 'pointer';
            }

            e.target.position({ x: 0, y: 0 });
            const pos = this.stageRef.current!.getPointerPosition();
            if (!pos) return;
            let dx = pos.x - oldPos.x;
            let dy = pos.y - oldPos.y;

            let [id1, id2] = [ray.startRay.props.id, ray.endRay.props.id];
            const [p1, p2] = [this.props.dag.get(id1), this.props.dag.get(id2)];
            if (!p1 || !p2) {
                return;
            }

            let node1 = (p1 as ShapeNode).node;
            let node2 = (p2 as ShapeNode).node;
            oldPos = pos;

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

    private drawAngle = (shape: Angle): Konva.Shape => {
        const props = shape.props;
        const opacity = props.opacity ?? 0.5;
        const [r, g, b] = utils.convert2RGB(props.color);
        const scale = (this.layerMathObjectRef.current!.scaleX() ?? 1);
        const scaledStrokeWidth = props.line_size / scale;

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
            x: shape.vertex ? shape.vertex.x : 0,
            y: shape.vertex ? shape.vertex.y : 0,
            radius: 10,
            startAngle: shape.startAngle,
            angle: shape.degree,
            fill: `rgba(${r},${g},${b},${opacity})`,
            stroke: props.color,
            strokeWidth: scaledStrokeWidth,
            hitStrokeWidth: 2
        }) : new Konva.Line({
            x: shape.vertex ? shape.vertex.x : 0,
            y: shape.vertex ? shape.vertex.y : 0,
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

        a.visible(props.visible.shape && shape.degree !== 0);

        a.on('mousedown', (e) => {
            if (!["delete", "edit"].includes(this.props.mode)) {
                return;
            }

            e.cancelBubble = true;
            if (this.props.mode === "delete") {
                this.removeNode(a.id());
                this.props.pushHistory(this.props.getSnapshot());
            }
        })

        return a;
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

        else if (['Intersection', 'Point', 'Midpoint', 'Circumcenter', 'Orthocenter', 'Excenter', 'Incenter', 'Centroid'].includes(shape.type)) {
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
            let points = (shapeNode.node as Konva.Line).points();
            for (let i = 0; i < points.length; i += 2) {
                let xP = points[i], yP = points[i + 1];
                x += xP;
                y += yP
            }

            x /= (shape as Polygon).points.length;
            y /= (shape as Polygon).points.length;
        }

        else if (shape.type === 'Angle') {
            x = shapeNode.node.x();
            y = shapeNode.node.y();
        }

        let text = new Konva.Text(
            utils.createLabelProps(
                x,
                y,
                shape.props.label,
                shape.props.labelXOffset,
                shape.props.labelYOffset,
                shape.props.visible.shape && shape.props.visible.label,
                (this.layerMathObjectRef.current!.scaleX() ?? 1),
                this.layerMathObjectRef.current!.position()
            )
        );

        text.id(`label-${shape.props.id}`);
        if (shape.type === 'Angle') {
            text.visible(shape.props.visible.shape && shape.props.visible.label && (shape as Angle).degree !== 0);
        }

        else {
            text.visible(shape.props.visible.shape && shape.props.visible.label);
        }
        
        text.on('dragstart', (e) => {
            if (this.props.mode !== 'edit') {
                return;
            }

            e.cancelBubble = true;
            let stage = e.target.getStage();
            if (stage) {
                stage.container().style.cursor = 'pointer';
            }
        });

        text.on('dragmove', (e) => {
            if (this.props.mode !== "edit") return;
            e.cancelBubble = true;

            const pointer = this.stageRef.current!.getPointerPosition();
            if (!pointer) return;

            // Compute screen-space position of the object's center
            let shapeX = 0, shapeY = 0;
            const scale = this.layerMathObjectRef.current!.scaleX() ?? 1;
            const offset = this.layerMathObjectRef.current!.position();

            if (shape.type === 'Circle') {
                shapeX = shapeNode.node.x();
                shapeY = shapeNode.node.y();
            }
            
            else if (['Segment', 'Ray', 'Vector', 'Line'].includes(shape.type)) {
                const pts = (shapeNode.node as Konva.Line).points();
                shapeX = (pts[0] + pts[2]) / 2;
                shapeY = (pts[1] + pts[3]) / 2;
            }
            
            else if (shape.type === 'Polygon') {
                const pts = (shapeNode.node as Konva.Line).points();
                for (let i = 0; i < pts.length; i += 2) {
                    shapeX += pts[i];
                    shapeY += pts[i + 1];
                }

                shapeX /= pts.length / 2;
                shapeY /= pts.length / 2;
            }
            
            else {
                shapeX = shapeNode.node.x();
                shapeY = shapeNode.node.y();
            }

            const screenX = shapeX * scale + offset.x;
            const screenY = shapeY * scale + offset.y;

            const dx = pointer.x - screenX;
            const dy = pointer.y - screenY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const limit = Math.min(dist, 20);
            const moveX = dx * (limit / dist);
            const moveY = dy * (limit / dist);

            text.position({
                x: screenX + moveX,
                y: screenY + moveY
            });
        });

        text.on('dragend', (e) => {
            if (this.props.mode !== 'edit') return;

            const scale = this.layerMathObjectRef.current!.scaleX() ?? 1;
            const offset = this.layerMathObjectRef.current!.position();

            let shapeX = 0, shapeY = 0;

            if (shape.type === 'Circle') {
                shapeX = shapeNode.node.x();
                shapeY = shapeNode.node.y();
            }
            
            else if (['Segment', 'Ray', 'Vector', 'Line'].includes(shape.type)) {
                const pts = (shapeNode.node as Konva.Line).points();
                shapeX = (pts[0] + pts[2]) / 2;
                shapeY = (pts[1] + pts[3]) / 2;
            }
            
            else if (shape.type === 'Polygon') {
                const pts = (shapeNode.node as Konva.Line).points();
                for (let i = 0; i < pts.length; i += 2) {
                    shapeX += pts[i];
                    shapeY += pts[i + 1];
                }
                
                shapeX /= pts.length / 2;
                shapeY /= pts.length / 2;
            }
            
            else {
                shapeX = shapeNode.node.x();
                shapeY = shapeNode.node.y();
            }

            const labelX = text.x();
            const labelY = text.y();

            const shapeScreenX = shapeX * scale + offset.x;
            const shapeScreenY = shapeY * scale + offset.y;

            shape.props.labelXOffset = labelX - shapeScreenX;
            shape.props.labelYOffset = labelY - shapeScreenY;
        });

        return text;
    }

    private createKonvaShape = (shape: Shape): Konva.Shape => {
        let konvaShape: Konva.Shape;
        switch (shape.type) {
            case 'Point':
                konvaShape = this.drawPoint(shape as Point);
                break;
            
            case 'Line':
                konvaShape = this.drawLine(shape as Line);
                break;
            
            case 'Segment':
                konvaShape = this.drawSegment(shape as Segment);
                break;
            
            case 'Vector':
                konvaShape = this.drawVector(shape as Vector);
                break;
            
            case 'Ray':
                konvaShape = this.drawRay(shape as Ray);
                break;
            
            case 'Polygon':
                konvaShape = this.drawPolygon(shape as Polygon);
                break;
            
            case 'Circle':
                konvaShape = this.drawCircle(shape as Circle);
                break;
            
            default:
                konvaShape = this.drawAngle(shape as Angle);
                break;
        }

        return konvaShape;
    }

    private handleDrawing = (): void => {
        if (this.props.mode === 'point') {
            this.props.onUpdateAll({
                gs: {...this.props.geometryState},
                dag: this.props.dag,
                selectedPoints: [],
                selectedShapes: []
            });
        }
        
        else if (['segment', 'line', 'ray', 'vector'].includes(this.props.mode)) {
            if (this.props.selectedPoints.length === 1) {
                return;
            }

            const selectedPoints = [...this.props.selectedPoints];
            let [p1, p2] = selectedPoints;
            if (p1 === p2) {
                selectedPoints.pop();
                this.props.onSelectedPointsChange(selectedPoints);
                return;
            }

            let label = utils.getExcelLabel(this.props.mode === 'vector' ? 'u' : 'f', 0);
            let index = 0;
            while (this.props.labelUsed.includes(label)) {
                index++;
                label = utils.getExcelLabel(this.props.mode === 'vector' ? 'u' : 'f', index);
            }

            this.props.onLabelUsed([...this.props.labelUsed, label]);
            const DAG = utils.cloneDAG(this.props.dag);
            switch (this.props.mode) {
                case 'vector': {
                    const vector: Vector = {
                        startVector: p1,
                        endVector: p2,
                        props: utils.createLineDefaultShapeProps(label, 0, 0, 10, 0),
                        type: 'Vector'
                    }

                    let shapeNode: ShapeNode = {
                        id: vector.props.id,
                        type: vector,
                        node: this.createKonvaShape(vector),
                        dependsOn: [p1.props.id, p2.props.id],
                        defined: true,
                        ambiguous: false
                    }

            
                    DAG.set(vector.props.id, shapeNode);
                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: {...this.props.geometryState, shapes: [...this.props.geometryState.shapes, vector.props.id]},
                        dag: DAG,
                        selectedPoints: [],
                        selectedShapes: []
                    });

                    break;
                }
                    
                
                case 'line': {
                    const line: Line = Factory.createLine(
                        utils.createLineDefaultShapeProps(label),
                        p1,
                        p2
                    )

                    let shapeNode: ShapeNode = {
                        id: line.props.id,
                        type: line,
                        node: this.createKonvaShape(line),
                        dependsOn: [p1.props.id, p2.props.id],
                        defined: true,
                        ambiguous: false
                    };

            

                    DAG.set(line.props.id, shapeNode);
                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: {...this.props.geometryState, shapes: [...this.props.geometryState.shapes, line.props.id]},
                        dag: DAG,
                        selectedPoints: [],
                        selectedShapes: []
                    });

                    break;
                }

                case 'ray': {
                    const ray: Ray = {
                        startRay: p1,
                        endRay: p2,
                        props: utils.createLineDefaultShapeProps(label, 0, 0, 10, 0),
                        type: 'Ray'
                    }

                    let shapeNode: ShapeNode = {
                        id: ray.props.id,
                        type: ray,
                        node: this.createKonvaShape(ray),
                        dependsOn: [p1.props.id, p2.props.id],
                        defined: true,
                        ambiguous: false
                    };

            
                    DAG.set(ray.props.id, shapeNode);
                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: {...this.props.geometryState, shapes: [...this.props.geometryState.shapes, ray.props.id]},
                        dag: DAG,
                        selectedPoints: [],
                        selectedShapes: []
                    });

                    break;
                }
                    
                default: {
                    const segment: Segment = {
                        startSegment: p1,
                        endSegment: p2,
                        props: utils.createLineDefaultShapeProps(label, 0, 0, 10, 0),
                        type: 'Segment'
                    }

                    let shapeNode: ShapeNode = {
                        id: segment.props.id,
                        type: segment,
                        node: this.createKonvaShape(segment),
                        dependsOn: [p1.props.id, p2.props.id],
                        defined: true,
                        ambiguous: false
                    };

            
                    DAG.set(segment.props.id, shapeNode);
                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: {...this.props.geometryState, shapes: [...this.props.geometryState.shapes, segment.props.id]},
                        dag: DAG,
                        selectedPoints: [],
                        selectedShapes: []
                    });

                    break;
                }
            }
        }

        else if (this.props.mode === 'circle') {
            const point = this.props.selectedPoints[0];
            const DAG = utils.cloneDAG(this.props.dag);
            let pNode = DAG.get(point.props.id);
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

                let label = utils.getExcelLabel('c', 0);
                let index = 0;
                while (this.props.labelUsed.includes(label)) {
                    index++;
                    label = utils.getExcelLabel('c', index);
                }

                this.props.onLabelUsed([...this.props.labelUsed, label]);
                
                const circle: Circle = Factory.createCircle(
                    utils.createCircleDefaultShapeProps(label, radius, 0, 10, 0),
                    point,
                    radius * constants.BASE_SPACING
                )

                let shapeNode: ShapeNode = {
                    id: circle.props.id,
                    type: circle,
                    node: this.createKonvaShape(circle),
                    dependsOn: [point.props.id],
                    defined: true,
                    ambiguous: false
                }

        

                DAG.set(circle.props.id, shapeNode);
                this.props.onUpdateLastFailedState();
                this.props.onUpdateAll({
                    gs: {...this.props.geometryState, shapes: [...this.props.geometryState.shapes, circle.props.id]},
                    dag: DAG,
                    selectedPoints: [],
                    selectedShapes: []
                });
            }

            catch (error) {
                pNode?.node.draggable(true);
                alert('Invalid expression for radius');
            }
        }

        else if (this.props.mode === 'polygon') {
            const selectedPoints = [...this.props.selectedPoints];
            if (selectedPoints.length < 4) {
                let points = selectedPoints;
                const lastPoint = points[points.length - 1];
                for (let i = 0; i < points.length - 1; i++) {
                    if (points[i] === lastPoint) {
                        selectedPoints.splice(i, 1);
                        selectedPoints.pop();
                        this.props.onSelectedPointsChange(selectedPoints);
                        return;
                    }
                }

                return;
            }
            
            else {
                if (selectedPoints[0] !== selectedPoints[selectedPoints.length - 1]) {
                    for (let i = 1; i < selectedPoints.length - 1; i++) {
                        if (selectedPoints[i] === selectedPoints[selectedPoints.length - 1]) {
                            selectedPoints.splice(i, 1);
                            selectedPoints.pop();
                            this.props.onSelectedPointsChange(selectedPoints);
                            return;
                        }
                    }

                    return;
                }

                else {
                    selectedPoints.pop();
                    let label = `poly${this.props.geometryState.polygonIndex + 1}`;
                    const polygon: Polygon = Factory.createPolygon(
                        utils.createPolygonDefaultShapeProps(label, 0, 0, 10, 0),
                        selectedPoints
                    )

                    let dependencies: string[] = [];
                    dependencies = selectedPoints.map(point => point.props.id);
                    let shapes = this.props.geometryState.shapes;
                    const DAG = utils.cloneDAG(this.props.dag);
                    const labelUsed = [...this.props.labelUsed];

                    for (let i = 0; i < selectedPoints.length; i++) {
                        let p = selectedPoints[i];
                        let pNext = selectedPoints[(i + 1) % selectedPoints.length];
                        let label = utils.getExcelLabel('a', 0);
                        let index = 0;
                        while (labelUsed.includes(label)) {
                            index++;
                            label = utils.getExcelLabel('a', index);
                        }

                        labelUsed.push(label);
                        let segment = Factory.createSegment(
                            utils.createLineDefaultShapeProps(label),
                            p,
                            pNext
                        );

                        segment.props.color = polygon.props.color;
                        let shapeNode: ShapeNode = {
                            id: segment.props.id,
                            type: segment,
                            node: this.createKonvaShape(segment),
                            dependsOn: [p.props.id, pNext.props.id, polygon.props.id],
                            defined: true,
                            ambiguous: false
                        }

                        DAG.set(segment.props.id, shapeNode);
                        shapes = [...shapes, segment.props.id];
                    }

                    let shapeNode: ShapeNode = {
                        id: polygon.props.id,
                        type: polygon,
                        node: this.createKonvaShape(polygon),
                        dependsOn: dependencies,
                        defined: true,
                        ambiguous: false
                    }
            
                    DAG.set(polygon.props.id, shapeNode);
                    this.props.onLabelUsed(labelUsed);
                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: {...this.props.geometryState, shapes: [...this.props.geometryState.shapes, polygon.props.id]},
                        dag: DAG,
                        selectedPoints: [],
                        selectedShapes: []
                    });
                }
            }
        }

        else if (this.props.mode === 'angle') {
            const [selectedPoints, selectedShapes] = [[...this.props.selectedPoints], [...this.props.selectedShapes]];
            if (selectedPoints.length === 0) {
                if (selectedShapes.length !== 2) return;
                // 2 lines
                // convert them to Line
                let [start1, end1] = operation.getStartAndEnd(selectedShapes[0]);
                let [start2, end2] = operation.getStartAndEnd(selectedShapes[1]);

                let tmpSelectedShapes = [
                    Factory.createLine(
                        selectedShapes[0].props,
                        Factory.createPoint(
                            utils.createPointDefaultShapeProps(''),
                            start1.x,
                            start1.y,
                            start1.z
                        ),
                        Factory.createPoint(
                            utils.createPointDefaultShapeProps(''),
                            end1.x,
                            end1.y,
                            end1.z
                        ),
                    ),
                    Factory.createLine(
                        selectedShapes[1].props,
                        Factory.createPoint(
                            utils.createPointDefaultShapeProps(''),
                            start2.x,
                            start2.y
                        ),
                        Factory.createPoint(
                            utils.createPointDefaultShapeProps(''),
                            end2.x,
                            end2.y
                        ),
                    )
                ]
                
                let vertex = operation.getIntersections2D(
                    tmpSelectedShapes[0],
                    tmpSelectedShapes[1]
                )

                let tmpVertex = Factory.createPoint(
                    utils.createPointDefaultShapeProps(''),
                    vertex[0].coors ? vertex[0].coors.x : 0,
                    vertex[0].coors ? vertex[0].coors.y : 0
                )

                const angleFromXAxis = (v: {x: number, y: number}) => {
                    return (math.parse('atan2(y, x)').evaluate({x: v.x, y: v.y})) * 180 / Math.PI;
                }

                let startAngle = utils.cleanAngle(angleFromXAxis({
                    x: (end1.x - start1.x) / math.parse('sqrt(x^2 + y^2)').evaluate({x: end1.x - start1.x, y: end1.y - start1.y}),
                    y: (end1.y - start1.y) / math.parse('sqrt(x^2 + y^2)').evaluate({x: end1.x - start1.x, y: end1.y - start1.y}),
                }));

                let degree = utils.cleanAngle(operation.angleBetweenLines(
                    tmpSelectedShapes[0],
                    tmpSelectedShapes[1]
                ));

                let label = utils.getAngleLabel(0);
                let idx = 0;
                while (this.props.labelUsed.includes(label)) {
                    idx++;
                    label = utils.getAngleLabel(idx);
                }

                this.props.onLabelUsed([...this.props.labelUsed, label]);

                let a = Factory.createAngle(
                    utils.createAngleDefaultShapeProps(`${label}`),
                    tmpVertex,
                    startAngle,
                    degree
                )

                const DAG = utils.cloneDAG(this.props.dag);
                let shapeNode: ShapeNode = {
                    id: a.props.id,
                    dependsOn: [selectedShapes[0].props.id, selectedShapes[1].props.id],
                    type: a,
                    node: this.createKonvaShape(a),
                    defined: vertex[0].coors !== undefined && vertex[0].ambiguous === false,
                    ambiguous: vertex[0].ambiguous
                }

        

                DAG.set(a.props.id, shapeNode);
                this.props.onUpdateLastFailedState();
                this.props.onUpdateAll({
                    gs: {...this.props.geometryState, shapes: [...this.props.geometryState.shapes, a.props.id]},
                    dag: DAG,
                    selectedPoints: [],
                    selectedShapes: []
                });
            }

            else {
                if (selectedPoints.length !== 3) return;
                let [point1, point2, point3] = [
                    selectedShapes[0] as Point,
                    selectedShapes[1] as Point,
                    selectedShapes[2] as Point,
                ]

                if (point3 === point1) {
                    this.props.onUpdateLastFailedState({
                        selectedPoints: selectedPoints,
                        selectedShapes: selectedShapes
                    });

                    selectedPoints.splice(0, 1);
                    selectedShapes.splice(0, 1);
                    selectedPoints.pop();
                    selectedShapes.pop();
                    this.props.onUpdateAll({
                        gs: this.props.geometryState,
                        dag: this.props.dag,
                        selectedPoints: selectedPoints,
                        selectedShapes: selectedShapes
                    });

                    return;
                }

                else if (point3 === point2) {
                    this.props.onUpdateLastFailedState({
                        selectedPoints: selectedPoints,
                        selectedShapes: selectedShapes
                    });

                    selectedPoints.splice(1);
                    selectedShapes.splice(1);
                    this.props.onUpdateAll({
                        gs: this.props.geometryState,
                        dag: this.props.dag,
                        selectedPoints: selectedPoints,
                        selectedShapes: selectedShapes
                    });

                    return;
                }

                const angleFromXAxis = (v: {x: number, y: number}) => {
                    return (math.parse('atan2(y, x)').evaluate({x: v.x, y: v.y})) * 180 / Math.PI;
                }

                let startAngle = utils.cleanAngle(angleFromXAxis({
                    x: (point1.x - point2.x) / math.parse('sqrt(x^2 + y^2)').evaluate({x: point1.x - point2.x, y: point1.y - point2.y}),
                    y: (point1.y - point2.y) / math.parse('sqrt(x^2 + y^2)').evaluate({x: point1.x - point2.x, y: point1.y - point2.y}),
                }));

                let angle = utils.cleanAngle(operation.angleBetween3Points(point1, point2, point3));

                let label = utils.getAngleLabel(0);
                let idx = 0;
                while (this.props.labelUsed.includes(label)) {
                    idx++;
                    label = utils.getAngleLabel(idx);
                }

                this.props.onLabelUsed([...this.props.labelUsed, label]);

                let a = Factory.createAngle(
                    utils.createAngleDefaultShapeProps(`${label}`),
                    point2,
                    startAngle,
                    angle
                )

                const DAG = utils.cloneDAG(this.props.dag);
                let shapeNode: ShapeNode = {
                    id: a.props.id,
                    dependsOn: [selectedShapes[0].props.id, selectedShapes[1].props.id, selectedShapes[2].props.id],
                    type: a,
                    node: this.createKonvaShape(a),
                    defined: true,
                    ambiguous: false
                };

        
                DAG.set(a.props.id, shapeNode);

                this.props.onUpdateLastFailedState();
                this.props.onUpdateAll({
                    gs: {...this.props.geometryState, shapes: [...this.props.geometryState.shapes, a.props.id]},
                    dag: DAG,
                    selectedPoints: [],
                    selectedShapes: []
                });
            }
        }

        else if (this.props.mode === 'length') {
            let perimeter: number = 0;
            let label: string = "";
            let id: string = "";
            const selectedShapes = [...this.props.selectedShapes];
            let x = this.last_pointer.x;
            let y = this.last_pointer.y;
            let tmpSegment: Segment | undefined = undefined;
            if (selectedShapes.length !== 1 && selectedShapes.length !== 2) return;
            if (selectedShapes.length === 1) {
                let shape = selectedShapes[0];
                id = shape.props.id;
                if ('startSegment' in shape) {
                    shape = shape as Segment;
                    label = `Length of ${shape.props.label} = `
                }
            
                else if ('points' in shape) {
                    shape = shape as Polygon;
                    label = `Perimeter of ${shape.props.label} = `
                }
            
                else if ('radius' in shape) {
                    shape = shape as Circle;
                    label = `Perimeter of ${shape.props.label} = `
                }
            
                else if ('start' in shape && 'end' in shape) {
                    shape = shape as SemiCircle;
                    label = `Arc length of ${shape.props.label} = `
                }

                else return;
                perimeter = operation.getLength(shape);
            }

            else {
                if ('x' in selectedShapes[0] && 'x' in selectedShapes[1]) {
                    perimeter = operation.getDistance(selectedShapes[0] as Point, selectedShapes[1] as Point);
                    label = `${selectedShapes[0].props.label}${selectedShapes[1].props.label} = `
                    x = (selectedShapes[0].x + selectedShapes[1].x) / 2;
                    y = (selectedShapes[0].y + selectedShapes[1].y) / 2;
                    tmpSegment = Factory.createSegment(
                        utils.createLineDefaultShapeProps(`tmpLine${selectedShapes[0].props.label}${selectedShapes[1].props.label}`),
                        selectedShapes[0],
                        selectedShapes[1]
                    )
                }

                else {
                    let point = selectedShapes.find(shape => shape.props.id.includes('point-')) as Point;
                    let line = selectedShapes.find(shape => shape.props.id.includes('line-') || shape.props.id.includes('-axis'));
                    if (!point || !line) return;
                    let [start, end] = operation.getStartAndEnd(line);
                    let n = {
                        x: start.y - end.y,
                        y: end.x - start.x
                    }

                    perimeter = Math.abs(n.x * point.x + n.y * point.y - (n.x * start.x + n.y * start.y)) / math.parse('sqrt(x^2 + y^2)').evaluate({x: n.x, y: n.y});
                    label = `${selectedShapes[0].props.label}${selectedShapes[1].props.label} = `
                    let projectedPoint = operation.point_projection(point, line);
                    x = (point.x + projectedPoint.x) / 2;
                    y = (point.y + projectedPoint.y) / 2;
                    tmpSegment = Factory.createSegment(
                        utils.createLineDefaultShapeProps(`tmpLine${selectedShapes[0].props.label}${selectedShapes[1].props.label}`),
                        point,
                        Factory.createPoint(
                            utils.createPointDefaultShapeProps(''),
                            projectedPoint.x,
                            projectedPoint.x
                        )
                    )
                }
            }

            label = `${label}${perimeter}`;
            let tmpPoint = Factory.createPoint(
                utils.createPointDefaultShapeProps(label),
                x,
                y
            );

            let tmpShapeNode: ShapeNode = {
                id: `tmpPoint${id}`,
                dependsOn: tmpSegment === undefined ? [id] : [tmpSegment.props.id],
                node: this.createKonvaShape(tmpPoint),
                type: tmpPoint,
                defined: true,
                ambiguous: false,
                scaleFactor: tmpSegment === undefined ? undefined : 0.5
            }

            tmpShapeNode.node.hide();
            const DAG = utils.cloneDAG(this.props.dag);

            DAG.set(`tmpPoint${id}`, tmpShapeNode);
            if (tmpSegment) {
                DAG.set(tmpSegment.props.id, {
                    id: tmpSegment.props.id,
                    dependsOn: [tmpSegment.endSegment.props.id, tmpSegment.startSegment.props.id],
                    node: this.createKonvaShape(tmpSegment),
                    type: tmpSegment,
                    defined: true,
                    ambiguous: false
                });

                DAG.get(tmpSegment.props.id)!.node.hide();
            }

            this.props.onUpdateLastFailedState();
            this.props.onUpdateAll({
                gs: {...this.props.geometryState, shapes: [...this.props.geometryState.shapes, `tmpPoint${id}`]},
                dag: DAG,
                selectedPoints: [],
                selectedShapes: []
            });   
        }

        else if (this.props.mode === 'area') {
            const selectedShapes= [...this.props.selectedShapes];
            let label: string = "";
            if (selectedShapes.length !== 1) return;
            let shape: Shape = selectedShapes[0] as Shape;
            if (!('points' in shape) && !('radius' in shape)) return;
            let area = ('points' in shape ? (shape as Polygon).area : (shape as Circle).area);
            if (!area) return;
            label = `Area of ${shape.props.label} = ${area}`;
            let tmpPoint = Factory.createPoint(
                utils.createPointDefaultShapeProps(label),
                this.last_pointer.x,
                this.last_pointer.y
            );

            let id: string = shape.props.id;
            let tmpShapeNode: ShapeNode = {
                id: `tmpPoint${id}`,
                dependsOn: [id],
                node: this.createKonvaShape(tmpPoint),
                type: tmpPoint,
                defined: true,
                ambiguous: false
            }

            tmpShapeNode.node.hide();
            const DAG = utils.cloneDAG(this.props.dag);
            DAG.set(`tmpPoint${id}`, tmpShapeNode);
            this.props.onUpdateLastFailedState();
            this.props.onUpdateAll({
                gs: {...this.props.geometryState, shapes: [...this.props.geometryState.shapes, `tmpPoint${id}`]},
                dag: DAG,
                selectedPoints: [],
                selectedShapes: []
            });
        }

        else if (this.props.mode === 'intersection') {
            const selectedShapes = [...this.props.selectedShapes];
            if (!(this.props.selectedPoints.length === 0 && selectedShapes.length === 2)) return;
            let intersects = operation.getIntersections2D(selectedShapes[0], selectedShapes[1]);
            const shapes = [...this.props.geometryState.shapes];
            const DAG = utils.cloneDAG(this.props.dag);
            const labelUsed = [...this.props.labelUsed];
            intersects.forEach(intersect => {
                let label = utils.getExcelLabel('A', 0);
                let index = 0;
                while (labelUsed.includes(label)) {
                    index++;
                    label = utils.getExcelLabel('A', index);
                }

                labelUsed.push(label);
                let point = Factory.createPoint(
                    utils.createPointDefaultShapeProps(label),
                    intersect.coors ? intersect.coors.x : 0,
                    intersect.coors ? intersect.coors.y : 0
                );

                let pNode = this.createKonvaShape(point);
                point.type = 'Intersection';
                pNode.draggable(false);
                let shapeNode: ShapeNode = {
                    id: point.props.id,
                    type: point,
                    dependsOn: [selectedShapes[0].props.id, selectedShapes[1].props.id],
                    node: pNode,
                    defined: intersect.coors !== undefined && !intersect.ambiguous,
                    ambiguous: intersect.ambiguous
                }

                DAG.set(point.props.id, shapeNode);
                if (!intersect.coors || intersect.ambiguous) {
                    pNode.hide();
                }

                shapes.push(point.props.id);
            });
            
            this.props.onLabelUsed(labelUsed);
            this.props.onUpdateLastFailedState();
            this.props.onUpdateAll({
                gs: {...this.props.geometryState, shapes: shapes},
                dag: DAG,
                selectedPoints: [],
                selectedShapes: []
            });
        }

        else if (this.props.mode === 'circle_2_points') {
            const selectedPoints = [...this.props.selectedPoints];
            if (selectedPoints.length !== 2) return;
            let label = utils.getExcelLabel('c', 0);
            let index = 0;
            while (this.props.labelUsed.includes(label)) {
                index++;
                label = utils.getExcelLabel('c', index);
            }

            this.props.onLabelUsed([...this.props.labelUsed, label]);
            const r = operation.getDistance(selectedPoints[0], selectedPoints[1]);
            const circle: Circle = Factory.createCircle(
                utils.createCircleDefaultShapeProps(label, r, 0, 10, 0),
                selectedPoints[0],
                r
            )

            const DAG = utils.cloneDAG(this.props.dag);
            let shapeNode: ShapeNode = {
                id: circle.props.id,
                type: circle,
                node: this.createKonvaShape(circle),
                dependsOn: [selectedPoints[0].props.id, selectedPoints[1].props.id],
                defined: true,
                ambiguous: false,
            }

            circle.type = 'Circle2Point';

            DAG.set(circle.props.id, shapeNode);
            this.props.onUpdateLastFailedState();
            this.props.onUpdateAll({
                gs: {...this.props.geometryState, shapes: [...this.props.geometryState.shapes, circle.props.id]},
                dag: DAG,
                selectedPoints: [],
                selectedShapes: []
            });
        }

        else if (['orthocenter', 'centroid', 'incenter', 'circumcenter'].includes(this.props.mode)) {
            const selectedPoints = [...this.props.selectedPoints];
            const selectedShapes = [...this.props.selectedShapes];
            let polygon = selectedShapes.find(shape => 'points' in shape);
            if (polygon) {
                if ((polygon as Polygon).points.length !== 3) return;
                let label = utils.getExcelLabel('A', 0);
                let index = 0;
                while (this.props.labelUsed.includes(label)) {
                    index++;
                    label = utils.getExcelLabel('A', index);
                }

                this.props.onLabelUsed([...this.props.labelUsed, label]);
                const DAG = utils.cloneDAG(this.props.dag);
                try {
                    let p = (
                        this.props.mode === 'orthocenter' ? operation.orthocenter((polygon as Polygon).points[0], (polygon as Polygon).points[1], (polygon as Polygon).points[2]) : 
                        (
                            this.props.mode === 'incenter' ? operation.incenter((polygon as Polygon).points[0], (polygon as Polygon).points[1], (polygon as Polygon).points[2]) : 
                            (
                                this.props.mode === 'circumcenter' ? operation.circumcenter((polygon as Polygon).points[0], (polygon as Polygon).points[1], (polygon as Polygon).points[2]) : 
                                operation.centroid((polygon as Polygon).points[0], (polygon as Polygon).points[1], (polygon as Polygon).points[2])
                            )
                        )
                    );

                    let point = Factory.createPoint(
                        utils.createPointDefaultShapeProps(label),
                        p.x,
                        p.y
                    );

                    let shapeNode: ShapeNode = {
                        id: point.props.id,
                        defined: true,
                        ambiguous: false,
                        node: this.createKonvaShape(point),
                        type: point,
                        dependsOn: [(polygon as Polygon).points[0].props.id, (polygon as Polygon).points[1].props.id, (polygon as Polygon).points[2].props.id] 
                    };

                    point.type = this.props.mode === 'orthocenter' ? 'Orthocenter' : (this.props.mode === 'centroid' ? 'Centroid' : (this.props.mode === 'incenter' ? 'Incenter' : 'Circumcenter'));
                    shapeNode.node.draggable(false);
                    DAG.set(point.props.id, shapeNode);
                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: {...this.props.geometryState, shapes: [...this.props.geometryState.shapes, point.props.id]},
                        dag: DAG,
                        selectedPoints: [],
                        selectedShapes: []
                    });
                }

                catch (error) {
                    let point = Factory.createPoint(
                        utils.createPointDefaultShapeProps(label),
                        0,
                        0
                    );

                    let shapeNode: ShapeNode = {
                        id: point.props.id,
                        defined: false,
                        ambiguous: false,
                        node: this.createKonvaShape(point),
                        type: point,
                        dependsOn: [(polygon as Polygon).points[0].props.id, (polygon as Polygon).points[1].props.id, (polygon as Polygon).points[2].props.id] 
                    };

                    point.type = this.props.mode === 'orthocenter' ? 'Orthocenter' : (this.props.mode === 'centroid' ? 'Centroid' : (this.props.mode === 'incenter' ? 'Incenter' : 'Circumcenter'));
                    shapeNode.node.draggable(false);
                    shapeNode.node.hide();
                    DAG.set(point.props.id, shapeNode);
                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: {...this.props.geometryState, shapes: [...this.props.geometryState.shapes, point.props.id]},
                        dag: DAG,
                        selectedPoints: [],
                        selectedShapes: []
                    });
                }
            }

            else {
                if (selectedPoints.length !== 3) return;
                let label = utils.getExcelLabel('A', 0);
                let index = 0;
                while (this.props.labelUsed.includes(label)) {
                    index++;
                    label = utils.getExcelLabel('A', index);
                }

                this.props.onLabelUsed([...this.props.labelUsed, label]);
                const DAG = utils.cloneDAG(this.props.dag);
                try {
                    let p = this.props.mode === 'orthocenter' ? operation.orthocenter(selectedPoints[0], selectedPoints[1], selectedPoints[2]) : 
                    (
                        this.props.mode === 'incenter' ? operation.incenter(selectedPoints[0], selectedPoints[1], selectedPoints[2]) : 
                        (
                            this.props.mode === 'circumcenter' ? operation.circumcenter(selectedPoints[0], selectedPoints[1], selectedPoints[2]) : 
                            operation.centroid(selectedPoints[0], selectedPoints[1], selectedPoints[2])
                        )
                    );

                    let point = Factory.createPoint(
                        utils.createPointDefaultShapeProps(label),
                        p.x,
                        p.y
                    );

                    let shapeNode: ShapeNode = {
                        id: point.props.id,
                        defined: true,
                        ambiguous: false,
                        node: this.createKonvaShape(point),
                        type: point,
                        dependsOn: [selectedPoints[0].props.id, selectedPoints[1].props.id, selectedPoints[2].props.id] 
                    };

                    point.type = this.props.mode === 'orthocenter' ? 'Orthocenter' : (this.props.mode === 'centroid' ? 'Centroid' : (this.props.mode === 'incenter' ? 'Incenter' : 'Circumcenter'));
                    shapeNode.node.draggable(false);
                    DAG.set(point.props.id, shapeNode);
                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: {...this.props.geometryState, shapes: [...this.props.geometryState.shapes, point.props.id]},
                        dag: DAG,
                        selectedPoints: [],
                        selectedShapes: []
                    });
                }

                catch (error) {
                    let point = Factory.createPoint(
                        utils.createPointDefaultShapeProps(label),
                        0,
                        0
                    );

                    let shapeNode: ShapeNode = {
                        id: point.props.id,
                        defined: false,
                        ambiguous: false,
                        node: this.createKonvaShape(point),
                        type: point,
                        dependsOn: [selectedPoints[0].props.id, selectedPoints[1].props.id, selectedPoints[2].props.id] 
                    };

                    point.type = this.props.mode === 'orthocenter' ? 'Orthocenter' : (this.props.mode === 'centroid' ? 'Centroid' : (this.props.mode === 'incenter' ? 'Incenter' : 'Circumcenter'));
                    shapeNode.node.draggable(false);
                    shapeNode.node.hide();
                    DAG.set(point.props.id, shapeNode);
                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: {...this.props.geometryState, shapes: [...this.props.geometryState.shapes, point.props.id]},
                        dag: DAG,
                        selectedPoints: [],
                        selectedShapes: []
                    });
                }
            }
        }

        else if (['incircle', 'circumcircle'].includes(this.props.mode)) {
            const selectedPoints = [...this.props.selectedPoints];
            const selectedShapes = [...this.props.selectedShapes];
            let polygon = selectedShapes.find(shape => 'points' in shape);
            if (polygon) {
                if ((polygon as Polygon).points.length !== 3) return;
                let label = utils.getExcelLabel('c', 0);
                let index = 0;
                while (this.props.labelUsed.includes(label)) {
                    index++;
                    label = utils.getExcelLabel('c', index);
                }

                this.props.onLabelUsed([...this.props.labelUsed, label]);
                const DAG = utils.cloneDAG(this.props.dag);
                try {
                    let p = this.props.mode === 'incircle' ? operation.incenter((polygon as Polygon).points[0], (polygon as Polygon).points[1], (polygon as Polygon).points[2]) :
                            operation.circumcenter((polygon as Polygon).points[0], (polygon as Polygon).points[1], (polygon as Polygon).points[2]);
                    
                    let r = this.props.mode === 'incircle' ? operation.inradius((polygon as Polygon).points[0], (polygon as Polygon).points[1], (polygon as Polygon).points[2]) :
                            operation.circumradius((polygon as Polygon).points[0], (polygon as Polygon).points[1], (polygon as Polygon).points[2]);

                    let circle = Factory.createCircle(
                        utils.createCircleDefaultShapeProps(label, r),
                        Factory.createPoint(
                            utils.createPointDefaultShapeProps(''),
                            p.x,
                            p.y
                        ),
                        r
                    );

                    let shapeNode: ShapeNode = {
                        id: circle.props.id,
                        defined: true,
                        ambiguous: false,
                        node: this.createKonvaShape(circle),
                        type: circle,
                        dependsOn: [(polygon as Polygon).points[0].props.id, (polygon as Polygon).points[1].props.id, (polygon as Polygon).points[2].props.id] 
                    };

                    circle.type = (this.props.mode === 'incircle' ? 'Incircle' : 'Circumcircle');
                    shapeNode.node.draggable(false);
                    DAG.set(circle.props.id, shapeNode);
                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: {...this.props.geometryState, shapes: [...this.props.geometryState.shapes, circle.props.id]},
                        dag: DAG,
                        selectedPoints: [],
                        selectedShapes: []
                    });
                }

                catch (error) {
                    let circle = Factory.createCircle(
                        utils.createCircleDefaultShapeProps(label, 0),
                        Factory.createPoint(
                            utils.createPointDefaultShapeProps(''),
                            0,
                            0
                        ),
                        0
                    );

                    let shapeNode: ShapeNode = {
                        id: circle.props.id,
                        defined: false,
                        ambiguous: false,
                        node: this.createKonvaShape(circle),
                        type: circle,
                        dependsOn: [(polygon as Polygon).points[0].props.id, (polygon as Polygon).points[1].props.id, (polygon as Polygon).points[2].props.id] 
                    };

                    circle.type = (this.props.mode === 'incircle' ? 'Incircle' : 'Circumcircle');
                    shapeNode.node.hide();
                    shapeNode.node.draggable(false);
                    DAG.set(circle.props.id, shapeNode);
                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: {...this.props.geometryState, shapes: [...this.props.geometryState.shapes, circle.props.id]},
                        dag: DAG,
                        selectedPoints: [],
                        selectedShapes: []
                    });
                }
            }

            else {
                if (selectedPoints.length !== 3) return;
                let label = utils.getExcelLabel('A', 0);
                let index = 0;
                while (this.props.labelUsed.includes(label)) {
                    index++;
                    label = utils.getExcelLabel('A', index);
                }

                this.props.onLabelUsed([...this.props.labelUsed, label]);
                const DAG = utils.cloneDAG(this.props.dag);
                try {
                    let p = this.props.mode === 'incircle' ? operation.incenter(selectedPoints[0], selectedPoints[1], selectedPoints[2]) :
                            operation.circumcenter(selectedPoints[0], selectedPoints[1], selectedPoints[2]);
                    
                    let r = this.props.mode === 'incircle' ? operation.inradius(selectedPoints[0], selectedPoints[1], selectedPoints[2]) :
                            operation.circumradius(selectedPoints[0], selectedPoints[1], selectedPoints[2]);

                    let circle = Factory.createCircle(
                        utils.createCircleDefaultShapeProps(label, r),
                        Factory.createPoint(
                            utils.createPointDefaultShapeProps(''),
                            p.x,
                            p.y
                        ),
                        r * constants.BASE_SPACING
                    );

                    let shapeNode: ShapeNode = {
                        id: circle.props.id,
                        defined: true,
                        ambiguous: false,
                        node: this.createKonvaShape(circle),
                        type: circle,
                        dependsOn: [selectedPoints[0].props.id, selectedPoints[1].props.id, selectedPoints[2].props.id] 
                    };

                    circle.type = (this.props.mode === 'incircle' ? 'Incircle' : 'Circumcircle');
                    shapeNode.node.draggable(false);
                    DAG.set(circle.props.id, shapeNode);
                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: {...this.props.geometryState, shapes: [...this.props.geometryState.shapes, circle.props.id]},
                        dag: DAG,
                        selectedPoints: [],
                        selectedShapes: []
                    });
                }

                catch (error) {
                    let circle = Factory.createCircle(
                        utils.createCircleDefaultShapeProps(label, 0),
                        Factory.createPoint(
                            utils.createPointDefaultShapeProps(''),
                            0,
                            0
                        ),
                        0
                    );

                    let shapeNode: ShapeNode = {
                        id: circle.props.id,
                        defined: false,
                        ambiguous: false,
                        node: this.createKonvaShape(circle),
                        type: circle,
                        dependsOn: [selectedPoints[0].props.id, selectedPoints[1].props.id, selectedPoints[2].props.id] 
                    };

                    circle.type = (this.props.mode === 'incircle' ? 'Incircle' : 'Circumcircle');
                    shapeNode.node.draggable(false);
                    shapeNode.node.hide();
                    DAG.set(circle.props.id, shapeNode);
                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: {...this.props.geometryState, shapes: [...this.props.geometryState.shapes, circle.props.id]},
                        dag: DAG,
                        selectedPoints: [],
                        selectedShapes: []
                    });
                }
            }
        }

        else if (this.props.mode === 'excircle') {
            const selectedPoints = [...this.props.selectedPoints];
            const selectedShapes = [...this.props.selectedShapes];
            let polygon = selectedShapes.find(shape => 'points' in shape);
            if (polygon) {
                if ((polygon as Polygon).points.length !== 3) return;
                const DAG = utils.cloneDAG(this.props.dag);
                try {
                    const shapes = [...this.props.geometryState.shapes];
                    const labelUsed = [...this.props.labelUsed];
                    let p = operation.excenter((polygon as Polygon).points[0], (polygon as Polygon).points[1], (polygon as Polygon).points[2]);
                    let r = operation.exradius((polygon as Polygon).points[0], (polygon as Polygon).points[1], (polygon as Polygon).points[2]);
                    for (let i = 0; i < 3; i++) {
                        let label = utils.getExcelLabel('c', 0);
                        let index = 0;
                        while (labelUsed.includes(label)) {
                            index++;
                            label = utils.getExcelLabel('c', index);
                        }

                        labelUsed.push(label);
                        let circle = Factory.createCircle(
                            utils.createCircleDefaultShapeProps(label, r[i]),
                            Factory.createPoint(
                                utils.createPointDefaultShapeProps(''),
                                p[i].x,
                                p[i].y
                            ),
                            r[i]
                        );

                        let shapeNode: ShapeNode = {
                            id: circle.props.id,
                            defined: true,
                            ambiguous: false,
                            node: this.createKonvaShape(circle),
                            type: circle,
                            dependsOn: [(polygon as Polygon).points[0].props.id, (polygon as Polygon).points[1].props.id, (polygon as Polygon).points[2].props.id] 
                        };

                        circle.type = 'Excircle';
                        shapeNode.node.draggable(false);
                        DAG.set(circle.props.id, shapeNode);
                        shapes.push(circle.props.id);
                    }

                    this.props.onLabelUsed(labelUsed);
                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: {...this.props.geometryState, shapes: shapes},
                        dag: DAG,
                        selectedPoints: [],
                        selectedShapes: []
                    });
                }

                catch (error) {
                    const shapes = [...this.props.geometryState.shapes];
                    const DAG = utils.cloneDAG(this.props.dag);
                    const labelUsed = [...this.props.labelUsed];
                    for (let i = 0; i < 3; i++) {
                        let label = utils.getExcelLabel('c', 0);
                        let index = 0;
                        while (labelUsed.includes(label)) {
                            index++;
                            label = utils.getExcelLabel('c', index);
                        }

                        labelUsed.push(label);
                        let circle = Factory.createCircle(
                            utils.createCircleDefaultShapeProps(label, 0),
                            Factory.createPoint(
                                utils.createPointDefaultShapeProps(''),
                                0,
                                0
                            ),
                            0
                        );

                        let shapeNode: ShapeNode = {
                            id: circle.props.id,
                            defined: false,
                            ambiguous: false,
                            node: this.createKonvaShape(circle),
                            type: circle,
                            dependsOn: [(polygon as Polygon).points[0].props.id, (polygon as Polygon).points[1].props.id, (polygon as Polygon).points[2].props.id] 
                        };

                        circle.type = 'Excircle';
                        shapeNode.node.draggable(false);
                        shapeNode.node.hide();
                        DAG.set(circle.props.id, shapeNode);
                        shapes.push(circle.props.id);
                    }

                    this.props.onLabelUsed(labelUsed);
                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: {...this.props.geometryState, shapes: shapes},
                        dag: DAG,
                        selectedPoints: [],
                        selectedShapes: []
                    });
                }
            }

            else {
                if (selectedPoints.length !== 3) return;
                const DAG = utils.cloneDAG(this.props.dag);
                try {
                    const shapes = [...this.props.geometryState.shapes];
                    const labelUsed = [...this.props.labelUsed];
                    let p = operation.excenter(selectedPoints[0], selectedPoints[1], selectedPoints[2]);
                    let r = operation.exradius(selectedPoints[0], selectedPoints[1], selectedPoints[2]);
                    for (let i = 0; i < 3; i++) {
                        let label = utils.getExcelLabel('c', 0);
                        let index = 0;
                        while (labelUsed.includes(label)) {
                            index++;
                            label = utils.getExcelLabel('c', index);
                        }

                        labelUsed.push(label);
                        let circle = Factory.createCircle(
                            utils.createCircleDefaultShapeProps(label, r[i]),
                            Factory.createPoint(
                                utils.createPointDefaultShapeProps(''),
                                p[i].x,
                                p[i].y
                            ),
                            r[i]
                        );

                        let shapeNode: ShapeNode = {
                            id: circle.props.id,
                            defined: true,
                            ambiguous: false,
                            node: this.createKonvaShape(circle),
                            type: circle,
                            dependsOn: [selectedPoints[0].props.id, selectedPoints[1].props.id, selectedPoints[2].props.id] 
                        };

                        circle.type = 'Excircle';
                        shapeNode.node.draggable(false);
                        DAG.set(circle.props.id, shapeNode);
                        shapes.push(circle.props.id);
                    }

                    this.props.onLabelUsed(labelUsed);
                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: {...this.props.geometryState, shapes: shapes},
                        dag: DAG,
                        selectedPoints: [],
                        selectedShapes: []
                    });
                }

                catch (error) {
                    const shapes = [...this.props.geometryState.shapes];
                    const DAG = utils.cloneDAG(this.props.dag);
                    const labelUsed = [...this.props.labelUsed];
                    for (let i = 0; i < 3; i++) {
                        let label = utils.getExcelLabel('c', 0);
                        let index = 0;
                        while (labelUsed.includes(label)) {
                            index++;
                            label = utils.getExcelLabel('c', index);
                        }

                        labelUsed.push(label);
                        let circle = Factory.createCircle(
                            utils.createCircleDefaultShapeProps(label, 0),
                            Factory.createPoint(
                                utils.createPointDefaultShapeProps(''),
                                0,
                                0
                            ),
                            0
                        );

                        let shapeNode: ShapeNode = {
                            id: circle.props.id,
                            defined: false,
                            ambiguous: false,
                            node: this.createKonvaShape(circle),
                            type: circle,
                            dependsOn: [selectedPoints[0].props.id, selectedPoints[1].props.id, selectedPoints[2].props.id] 
                        };

                        circle.type = 'Excircle';
                        shapeNode.node.draggable(false);
                        shapeNode.node.hide();
                        DAG.set(circle.props.id, shapeNode);
                        shapes.push(circle.props.id);
                    }

                    this.props.onLabelUsed(labelUsed);
                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: {...this.props.geometryState, shapes: shapes},
                        dag: DAG,
                        selectedPoints: [],
                        selectedShapes: []
                    });
                }
            }
        }

        else if (this.props.mode === 'excenter') {
            const selectedPoints = [...this.props.selectedPoints];
            const selectedShapes = [...this.props.selectedShapes];
            let polygon = selectedShapes.find(shape => 'points' in shape);
            if (polygon) {
                if ((polygon as Polygon).points.length !== 3) return;
                const DAG = utils.cloneDAG(this.props.dag);
                try {
                    const shapes = [...this.props.geometryState.shapes];
                    let p = operation.excenter((polygon as Polygon).points[0], (polygon as Polygon).points[1], (polygon as Polygon).points[2]);
                    const labelUsed = [...this.props.labelUsed];
                    for (let i = 0; i < 3; i++) {
                        let label = utils.getExcelLabel('A', 0);
                        let index = 0;
                        while (labelUsed.includes(label)) {
                            index++;
                            label = utils.getExcelLabel('A', index);
                        }

                        labelUsed.push(label);
                        let point = Factory.createPoint(
                            utils.createPointDefaultShapeProps(label),
                            p[i].x,
                            p[i].y
                        );

                        let shapeNode: ShapeNode = {
                            id: point.props.id,
                            defined: true,
                            ambiguous: false,
                            node: this.createKonvaShape(point),
                            type: point,
                            dependsOn: [(polygon as Polygon).points[0].props.id, (polygon as Polygon).points[1].props.id, (polygon as Polygon).points[2].props.id] 
                        };

                        point.type = 'Excenter';
                        shapeNode.node.draggable(false);
                        DAG.set(point.props.id, shapeNode);
                        shapes.push(point.props.id);
                    }

                    this.props.onLabelUsed(labelUsed);
                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: {...this.props.geometryState, shapes: shapes},
                        dag: DAG,
                        selectedPoints: [],
                        selectedShapes: []
                    });
                }

                catch (error) {
                    const shapes = [...this.props.geometryState.shapes];
                    const labelUsed = [...this.props.labelUsed];
                    for (let i = 0; i < 3; i++) {
                        let label = utils.getExcelLabel('A', 0);
                        let index = 0;
                        while (labelUsed.includes(label)) {
                            index++;
                            label = utils.getExcelLabel('A', index);
                        }

                        labelUsed.push(label);
                        let point = Factory.createPoint(
                            utils.createPointDefaultShapeProps(label),
                            0,
                            0
                        );

                        let shapeNode: ShapeNode = {
                            id: point.props.id,
                            defined: false,
                            ambiguous: false,
                            node: this.createKonvaShape(point),
                            type: point,
                            dependsOn: [(polygon as Polygon).points[0].props.id, (polygon as Polygon).points[1].props.id, (polygon as Polygon).points[2].props.id]
                        };

                        point.type = 'Excenter';
                        shapeNode.node.draggable(false);
                        shapeNode.node.hide();
                        DAG.set(point.props.id, shapeNode);
                        shapes.push(point.props.id);
                    }

                    this.props.onLabelUsed(labelUsed);
                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: {...this.props.geometryState, shapes: shapes},
                        dag: DAG,
                        selectedPoints: [],
                        selectedShapes: []
                    });
                }
            }

            else {
                if (selectedPoints.length !== 3) return;
                const DAG = utils.cloneDAG(this.props.dag);
                try {
                    const shapes = [...this.props.geometryState.shapes];
                    let p = operation.excenter(selectedPoints[0], selectedPoints[1], selectedPoints[2]);
                    const labelUsed = [...this.props.labelUsed];
                    for (let i = 0; i < 3; i++) {
                        let label = utils.getExcelLabel('A', 0);
                        let index = 0;
                        while (labelUsed.includes(label)) {
                            index++;
                            label = utils.getExcelLabel('A', index);
                        }

                        labelUsed.push(label);
                        let point = Factory.createPoint(
                            utils.createPointDefaultShapeProps(label),
                            p[i].x,
                            p[i].y
                        );

                        let shapeNode: ShapeNode = {
                            id: point.props.id,
                            defined: true,
                            ambiguous: false,
                            node: this.createKonvaShape(point),
                            type: point,
                            dependsOn: [selectedPoints[0].props.id, selectedPoints[1].props.id, selectedPoints[2].props.id] 
                        };

                        point.type = 'Excenter';
                        shapeNode.node.draggable(false);
                        DAG.set(point.props.id, shapeNode);
                        shapes.push(point.props.id);
                    }

                    this.props.onLabelUsed(labelUsed);
                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: {...this.props.geometryState, shapes: shapes},
                        dag: DAG,
                        selectedPoints: [],
                        selectedShapes: []
                    });
                }

                catch (error) {
                    const shapes = [...this.props.geometryState.shapes];
                    const labelUsed = [...this.props.labelUsed];
                    for (let i = 0; i < 3; i++) {
                        let label = utils.getExcelLabel('A', 0);
                        let index = 0;
                        while (labelUsed.includes(label)) {
                            index++;
                            label = utils.getExcelLabel('A', index);
                        }

                        labelUsed.push(label);
                        let point = Factory.createPoint(
                            utils.createPointDefaultShapeProps(label),
                            0,
                            0
                        );

                        let shapeNode: ShapeNode = {
                            id: point.props.id,
                            defined: false,
                            ambiguous: false,
                            node: this.createKonvaShape(point),
                            type: point,
                            dependsOn: [selectedPoints[0].props.id, selectedPoints[1].props.id, selectedPoints[2].props.id]
                        };

                        point.type = 'Excenter';
                        shapeNode.node.draggable(false);
                        shapeNode.node.hide();
                        DAG.set(point.props.id, shapeNode);
                        shapes.push(point.props.id);
                    }

                    this.props.onLabelUsed(labelUsed);
                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: {...this.props.geometryState, shapes: shapes},
                        dag: DAG,
                        selectedPoints: [],
                        selectedShapes: []
                    });
                }
            }
        }
    }

    private findChildren = (id: string): string[] => {
        if (!this.props.dag.get(id)) {
            return [];
        }

        let children: string[] = [];
        this.props.dag.forEach((value, key) => {
            if (value.dependsOn.includes(id)) {
                children.push(key)
            }
        })

        return children;
    }

    private updateAndPropagate = (id: string, updateFn: (node: ShapeNode) => ShapeNode) => {
        const copyDAG = utils.cloneDAG(this.props.dag);
        const node = copyDAG.get(id);
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
        copyDAG.set(id, updated);

        stack.reverse().forEach(nodeId => {
            if (nodeId !== id) { // Skip the initial node
                const node = copyDAG.get(nodeId) as ShapeNode;
                if (node) {
                    copyDAG.set(nodeId, this.computeUpdateFor(node));
                }
            }
        });

        this.setState({
            dag: copyDAG
        })
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
            'Circumcircle': this.updateCircle3Point,
            'SemiCircle': this.updateSemiCircle, 
            'Angle': this.updateAngle,
            'Reflection': this.updateReflection, 
            'Rotation': this.updateRotation,
            'Projection': this.updateProjection,
            'Enlarge': this.updateEnlarge,
            'Excenter': this.updateExcenter,
            'Excircle': this.updateExcircle,
            'RegularPolygon': this.updateRegularPoly
        }

        if (node.type.type in map) {
            // Type assertion ensures only valid keys are used
            return map[node.type.type as keyof typeof map](node);
        }

        return node;
    }

    private updatePoint = (node: ShapeNode): ShapeNode => {
        let perimeter: number = -1;
        let area: number = -1
        if (node.dependsOn.length === 1) {
            let shape = this.props.dag.get(node.dependsOn[0]);
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

            if ('startSegment' in shape.type || 'points' in shape.type || 'centerC' in shape.type || ('start' in shape.type && 'end' in shape.type)) {
                perimeter = operation.getLength(shape.type);
                if ('points' in shape.type || 'centerC' in shape.type) {
                    area = 'points' in shape.type ? operation.getArea(shape.type) : Math.pow(shape.type.radius, 2) * Math.PI;
                }
            }
        }

        if (this.layerUnchangeVisualRef.current) {
            if (node.id.includes('tmpPoint')) {
                let splits = node.type.props.label.split(' = ');
                if (splits.length > 0) {
                    node.type.props.label = `${splits[0]} = ${splits.includes('Area') ? area : perimeter}`;
                }
            }
            

            let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node.id()));
            if (label) {
                label.setAttrs(this.createLabel(node).getAttrs());
            }
        }

        (node.type as Point).x = node.node.x();
        (node.type as Point).y = node.node.y();
        return { ...node }
    }

    private updateSegment = (node: ShapeNode): ShapeNode => {
        const [id1, id2] = node.dependsOn;
        const p1 = this.props.dag.get(id1);
        const p2 = this.props.dag.get(id2);
        if (!p1 || !p2) return { ...node };

        const posA = (p1 as ShapeNode).node.position();
        const posB = (p2 as ShapeNode).node.position();

        const line = node.node as Konva.Line;
        line.points([posA.x, posA.y, posB.x, posB.y]);
        if (this.layerUnchangeVisualRef.current) {
            let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node.id()));
            if (label) {
                label.setAttrs(this.createLabel(node).getAttrs());
            }
        }

        [(node.type as Segment).startSegment.x, (node.type as Segment).startSegment.y] = [posA.x, posA.y];
        [(node.type as Segment).endSegment.x, (node.type as Segment).endSegment.y] = [posB.x, posB.y];
        return { ...node };
    }

    private updateLine = (node: ShapeNode): ShapeNode => {
        const [id1, id2] = node.dependsOn;
        const p1 = this.props.dag.get(id1);
        const p2 = this.props.dag.get(id2);
        if (!p1 || !p2) return { ...node };

        const posA = (p1 as ShapeNode).node.position();
        const posB = (p2 as ShapeNode).node.position();

        const dx = posB.x - posA.x;
        const dy = posB.y - posA.y;

        let length = 2 * Math.max(this.stageRef.current!.width(), this.stageRef.current!.height()) * Math.sqrt(dx * dx + dy * dy) / this.props.geometryState.zoom_level;
        let norm_dx = dx / Math.sqrt(dx * dx + dy * dy);
        let norm_dy = dy / Math.sqrt(dx * dx + dy * dy);

        const line = node.node as Konva.Line;
        line.points([posA.x - length * norm_dx, posA.y - length * norm_dy, posB.x + length * norm_dx, posB.y + length * norm_dy]);

        if (this.layerUnchangeVisualRef.current) {
            let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node.id()));
            if (label) {
                label.setAttrs(this.createLabel(node).getAttrs());
            }
        }

        [(node.type as Line).startLine.x, (node.type as Line).startLine.y] = [posA.x, posA.y];
        [(node.type as Line).endLine.x, (node.type as Line).endLine.y] = [posB.x, posB.y];
        return { ...node };
    }

    private updateRay = (node: ShapeNode): ShapeNode => {
        const [id1, id2] = node.dependsOn;
        const p1 = this.props.dag.get(id1);
        const p2 = this.props.dag.get(id2);
        if (!p1 || !p2) return { ...node };

        const posA = (p1 as ShapeNode).node.position();
        const posB = (p2 as ShapeNode).node.position();

        const dx = posB.x - posA.x;
        const dy = posB.y - posA.y;

        let length = 2 * Math.max(this.stageRef.current!.width(), this.stageRef.current!.height()) * Math.sqrt(dx * dx + dy * dy) / this.props.geometryState.zoom_level;
        let norm_dx = dx / Math.sqrt(dx * dx + dy * dy);
        let norm_dy = dy / Math.sqrt(dx * dx + dy * dy);

        const line = node.node as Konva.Line;
        line.points([posA.x, posA.y, posB.x + length * norm_dx, posB.y + length * norm_dy]);

        if (this.layerUnchangeVisualRef.current) {
            let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node.id()));
            if (label) {
                label.setAttrs(this.createLabel(node).getAttrs());
            }
        }

        [(node.type as Ray).startRay.x, (node.type as Ray).startRay.y] = [posA.x, posA.y];
        [(node.type as Ray).endRay.x, (node.type as Ray).endRay.y] = [posB.x, posB.y];
        return { ...node };
    }

    private updatePolygon = (node: ShapeNode): ShapeNode => {
        const pointIds = node.dependsOn;
        const points: number[] = [];
        for (const pid of pointIds) {
            const pointNode = this.props.dag.get(pid);
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
            let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node.id()));
            if (label) {
                label.setAttrs(this.createLabel(node).getAttrs());
            }
        }

        return { ...node };
    }

    private updateCircle = (node: ShapeNode): ShapeNode => {
        let id = node.dependsOn[0];
        let centerNode = this.props.dag.get(id);
        if (!centerNode) {
            return { ...node };
        }

        let circleNode = node.node as Konva.Circle;
        circleNode.position((centerNode as ShapeNode).node.position());

        if (this.layerUnchangeVisualRef.current) {
            let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node.id()));
            if (label) {
                label.setAttrs(this.createLabel(node).getAttrs());
            }
        }

        [(node.type as Circle).centerC.x, (node.type as Circle).centerC.y] = [circleNode.x(), circleNode.y()];
        return { ...node };
    }

    private updateVector = (node: ShapeNode): ShapeNode => {
        const [id1, id2] = node.dependsOn;
        const [start, end] = [this.props.dag.get(id1), this.props.dag.get(id2)];
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
            let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node.id()));
            if (label) {
                label.setAttrs(this.createLabel(node).getAttrs());
            }
        }

        return { ...node };
    }

    private updateMidpoint = (node: ShapeNode): ShapeNode => {
        const [id1, id2] = node.dependsOn;
        const [start, end] = [this.props.dag.get(id1), this.props.dag.get(id2)];
        if (!start || !end) {
            return { ...node };
        }

        const posA = (start as ShapeNode).node.position();
        const posB = (end as ShapeNode).node.position();
        
        let point = node.node as Konva.Circle;
        point.position({x: (posA.x + posB.x) / 2, y: (posA.y + posB.y) / 2});

        if (this.layerUnchangeVisualRef.current) {
            let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node.id()));
            if (label) {
                label.setAttrs(this.createLabel(node).getAttrs());
            }
        }

        [(node.type as Point).x, (node.type as Point).x] = [point.x(), point.y()];
        return { ...node };
    }

    private updateCentroid = (node: ShapeNode): ShapeNode => {
        const [id1, id2, id3] = node.dependsOn;
        const [p1, p2, p3] = [this.props.dag.get(id1), this.props.dag.get(id2), this.props.dag.get(id3)];
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
            point.position({x: ortho.x, y: ortho.y});
            point.show();

            if (this.layerUnchangeVisualRef.current) {
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node.id()));
                if (label) {
                    label.show()
                    label.setAttrs(this.createLabel(node).getAttrs());
                }
            }

            [(node.type as Point).x, (node.type as Point).x] = [point.x(), point.y()];
            return { ...node };
        }

        catch (error) {
            node.node.hide();
            node.defined = false;
            if (this.layerUnchangeVisualRef.current) {
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node.id()));
                if (label) {
                    label.hide();
                }
            }

            return { ...node };
        }
    }

    private updateOrthocenter = (node: ShapeNode): ShapeNode => {
        const [id1, id2, id3] = node.dependsOn;
        const [p1, p2, p3] = [this.props.dag.get(id1), this.props.dag.get(id2), this.props.dag.get(id3)];
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
            point.position({x: ortho.x, y: ortho.y});
            point.show();
            if (this.layerUnchangeVisualRef.current) {
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node.id()));
                if (label) {
                    label.show()
                    label.setAttrs(this.createLabel(node).getAttrs());
                }
            }

            [(node.type as Point).x, (node.type as Point).x] = [point.x(), point.y()];
            return { ...node };
        }

        catch (error) {
            node.node.hide();
            node.defined = false;
            if (this.layerUnchangeVisualRef.current) {
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node.id()));
                if (label) {
                    label.hide();
                }
            }

            return { ...node };
        }
    }

    private updateCircumcenter = (node: ShapeNode): ShapeNode => {
        const [id1, id2, id3] = node.dependsOn;
        const [p1, p2, p3] = [this.props.dag.get(id1), this.props.dag.get(id2), this.props.dag.get(id3)];
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
            point.position({x: ortho.x, y: ortho.y});
            point.show();

            if (this.layerUnchangeVisualRef.current) {
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node.id()));
                if (label) {
                    label.show();
                    label.setAttrs(this.createLabel(node).getAttrs());
                }
            }

            [(node.type as Point).x, (node.type as Point).x] = [point.x(), point.y()];
            return { ...node };
        }

        catch (error) {
            node.node.hide();
            node.defined = false;
            if (this.layerUnchangeVisualRef.current) {
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node.id()));
                if (label) {
                    label.hide();
                }
            }

            return { ...node };
        }
    }

    private updateIncenter = (node: ShapeNode): ShapeNode => {
        const [id1, id2, id3] = node.dependsOn;
        const [p1, p2, p3] = [this.props.dag.get(id1), this.props.dag.get(id2), this.props.dag.get(id3)];
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
            point.position({x: ortho.x, y: ortho.y});
            point.show();

            if (this.layerUnchangeVisualRef.current) {
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node.id()));
                if (label) {
                    label.show();
                    label.setAttrs(this.createLabel(node).getAttrs());
                }
            }

            [(node.type as Point).x, (node.type as Point).x] = [point.x(), point.y()];
            return { ...node };
        }

        catch (error) {
            node.node.hide();
            if (this.layerUnchangeVisualRef.current) {
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node.id()));
                if (label) {
                    label.hide();
                }
            }

            return { ...node };
        }
    }

    private updateCircle2Point = (node: ShapeNode): ShapeNode => {
        const [id1, id2] = node.dependsOn;
        const [start, end] = [this.props.dag.get(id1), this.props.dag.get(id2)];
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
            let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node.id()));
            if (label) {
                label.setAttrs(this.createLabel(node).getAttrs());
            }
        }
        return { ...node };
    }

    private updateIntersection = (node: ShapeNode): ShapeNode => {
        const [id1, id2] = node.dependsOn;
        const shape1 = this.props.dag.get(id1);
        const shape2 = this.props.dag.get(id2);

        if (!shape1 || !shape2) {
            return { ...node };
        }

        const intersections = operation.getIntersections2D(shape1.type, shape2.type);
        if (intersections[0].coors === undefined || intersections[0].ambiguous) {
            node.node.hide();
            if (this.layerUnchangeVisualRef.current) {
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node.id()));
                if (label) {
                    label.hide();
                }
            }

            return { ...node };
        }

        const nodePos = node.node.position();

        // Match by closest distance
        let closest = intersections[0].coors;
        let minDist = Math.hypot(nodePos.x - closest.x, nodePos.y - closest.y);

        for (let i = 1; i < intersections.length; i++) {
            if (intersections[i].coors !== undefined) continue;
            const d = Math.hypot(nodePos.x - intersections[i].coors!.x, nodePos.y - intersections[i].coors!.y);
            if (d < minDist) {
                minDist = d;
                closest = intersections[i].coors!;
            }
        }

        node.node.position({x: closest.x, y: closest.y});
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
        node.defined = intersections[0].coors !== undefined && !intersections[0].ambiguous;
        node.ambiguous = intersections[0].ambiguous;
        return { ...node };
    }

    private updateMedian = (node: ShapeNode): ShapeNode => {
        const [id1, id2, id3] = node.dependsOn;
        const shape1 = this.props.dag.get(id1);
        const shape2 = this.props.dag.get(id2);
        const shape3 = this.props.dag.get(id3);

        if (!shape1 || !shape2 || !shape3) {
            return { ...node };
        }

        let [posA, posB, posC] = [(shape1 as ShapeNode).node, (shape2 as ShapeNode).node, (shape3 as ShapeNode).node]
        
        let [A, B, C] = [
            Factory.createPoint(node.type.props, posA.x(), posA.y()),
            Factory.createPoint(node.type.props, posB.x(), posB.y()),
            Factory.createPoint(node.type.props, posC.x(), posC.y())
        ];

        if (operation.isCollinear(A, B, C)) {
            node.node.hide();
            if (this.layerUnchangeVisualRef.current) {
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node.id()));
                if (label) {
                    label.show()
                    label.setAttrs(this.createLabel(node).getAttrs());
                }
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
            let [shape1, shape2, shape3] = [this.props.dag.get(ids[0]), this.props.dag.get(ids[1]), this.props.dag.get(ids[2])];
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

            let length = 2 * Math.max(this.stageRef.current!.width(), this.stageRef.current!.height()) * Math.sqrt(dx * dx + dy * dy) / this.props.geometryState.zoom_level;
            let norm_dx = dx / Math.sqrt(dx * dx + dy * dy);
            let norm_dy = dy / Math.sqrt(dx * dx + dy * dy);

            let l = node.node as Konva.Line;
            l.points([line.point.x - length * norm_dx, line.point.y - length * norm_dy, line.point.x + length * norm_dx, line.point.y + length * norm_dy]);
            node.node.show();
            if (this.layerUnchangeVisualRef.current) {
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node.id()));
                if (label) {
                    label.show();
                    label.setAttrs(this.createLabel(node).getAttrs());
                }
            }

            [(node.type as Line).startLine.x, (node.type as Line).startLine.y] = [l.points()[0], l.points()[1]];
            [(node.type as Line).endLine.x, (node.type as Line).endLine.y] = [l.points()[2], l.points()[3]];
            return { ...node };
        }

        else if (ids.length === 2) {
            // Handle 2 lines
            let [shape1, shape2] = [this.props.dag.get(ids[0]), this.props.dag.get(ids[1])];
            if (!shape1 || !shape2) {
                return node;
            }

            try {
                let bisectors = operation.bisector_angle_line2(shape1.type as Line, shape2.type as Line);
                let selected = node.type.type === 'InternalAngleBisector' ? bisectors[0] : bisectors[1];
                
                const dx = selected.direction.x;
                const dy = selected.direction.y;

                let length = 2 * Math.max(this.stageRef.current!.width(), this.stageRef.current!.height()) * Math.sqrt(dx * dx + dy * dy) / this.props.geometryState.zoom_level;
                let norm_dx = dx / Math.sqrt(dx * dx + dy * dy);
                let norm_dy = dy / Math.sqrt(dx * dx + dy * dy);

                let l = node.node as Konva.Line;
                l.points([selected.point.x - length * norm_dx, selected.point.y - length * norm_dy, selected.point.x + length * norm_dx, selected.point.y + length * norm_dy]);
                node.node.show();
                if (this.layerUnchangeVisualRef.current) {
                    let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node.id()));
                    if (label) {
                        label.show();
                        label.setAttrs(this.createLabel(node).getAttrs());
                    }
                }

                [(node.type as Line).startLine.x, (node.type as Line).startLine.y] = [l.points()[0], l.points()[1]];
                [(node.type as Line).endLine.x, (node.type as Line).endLine.y] = [l.points()[2], l.points()[3]];
                return { ...node };
            }
            catch (error) {
                node.node.hide();
                if (this.layerUnchangeVisualRef.current) {
                    let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node.id()));
                    if (label) {
                        label.hide();
                    }
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
            let [shape1, shape2, shape3] = [this.props.dag.get(ids[0]), this.props.dag.get(ids[1]), this.props.dag.get(ids[2])];
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

            let angle = utils.cleanAngle(operation.angleBetween3Points(A, B, C));
            let BA = {
                x: A.x - B.x,
                y: A.y - B.y
            }

            const angleFromXAxis = (v: {x: number, y: number}) => {
                return (math.parse('atan2(y, x)').evaluate({x: v.x, y: v.y})) * 180 / Math.PI;
            }

            let startAngle = utils.cleanAngle(angleFromXAxis(BA));
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
            let [shape1, shape2] = [this.props.dag.get(ids[0]), this.props.dag.get(ids[1])];
            if (!shape1 || !shape2) {
                return node;
            }

            // Convert them to Line
            let [start1, end1] = operation.getStartAndEnd(shape1.type);
            let [start2, end2] = operation.getStartAndEnd(shape2.type);

            const tmpShape1 = Factory.createLine(
                shape1.type.props,
                Factory.createPoint(
                    utils.createPointDefaultShapeProps(''),
                    start1.x,
                    start1.y
                ),
                Factory.createPoint(
                    utils.createPointDefaultShapeProps(''),
                    end1.x,
                    end1.y
                ),
            );

            const tmpShape2 = Factory.createLine(
                shape2.type.props,
                Factory.createPoint(
                    utils.createPointDefaultShapeProps(''),
                    start2.x,
                    start2.y
                ),
                Factory.createPoint(
                    utils.createPointDefaultShapeProps(''),
                    end2.x,
                    end2.y
                ),
            )

            let angle = utils.cleanAngle(operation.angleBetweenLines(tmpShape1, tmpShape2));
            let start = {
                x: tmpShape1.endLine.x - tmpShape1.startLine.x,
                y: tmpShape1.endLine.y - tmpShape1.startLine.y
            }

            const angleFromXAxis = (v: {x: number, y: number}) => {
                return (math.parse('atan2(y, x)').evaluate({x: v.x, y: v.y})) * 180 / Math.PI;
            }

            let startAngle = utils.cleanAngle(angleFromXAxis(start));
            let intersection = operation.getIntersections2D(shape1.type as Line, shape2.type as Line);
            let vertex: Point | undefined = intersection[0].coors === undefined ? undefined : 
                                            Factory.createPoint(
                                                utils.createPointDefaultShapeProps(''),
                                                intersection[0].coors.x,
                                                intersection[0].coors.y
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
                    let s = (Math.abs(angle - 90) < constants.EPSILON) ? new Konva.Shape({
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
                        x: vertex.x,
                        y: vertex.y,
                        radius: 10,
                        startAngle: startAngle,
                        angle: angle,
                        fill: node.node.fill(),
                        stroke: node.node.stroke(),
                        strokeWidth: node.node.strokeWidth(),
                        hitStrokeWidth: 2,
                        id: node.node.id()
                    }) : new Konva.Line({
                        x: vertex.x,
                        y: vertex.y,
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
        const [p1, p2, p3] = [this.props.dag.get(id1), this.props.dag.get(id2), this.props.dag.get(id3)];
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
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node.id()));
                if (label) {
                    label.show();
                    label.setAttrs(this.createLabel(node).getAttrs());
                }
            }

            return { ...node };
        }

        catch(error) {
            node.node.hide();
            if (this.layerUnchangeVisualRef.current) {
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node.id()));
                if (label) {
                    label.hide();
                    label.setAttrs(this.createLabel(node).getAttrs());
                }
            }

            return { ...node };
        }
    }

    private updateIncircle3Point = (node: ShapeNode): ShapeNode => {
        const [id1, id2, id3] = node.dependsOn;
        const [p1, p2, p3] = [this.props.dag.get(id1), this.props.dag.get(id2), this.props.dag.get(id3)];
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
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node.id()));
                if (label) {
                    label.show();
                    label.setAttrs(this.createLabel(node).getAttrs());
                }
            }

            return { ...node };
        }

        catch(error) {
            node.node.hide();
            if (this.layerUnchangeVisualRef.current) {
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node.id()));
                if (label) {
                    label.hide();
                }
            }
            
            return { ...node };
        }
    }

    private updateSemiCircle = (node: ShapeNode): ShapeNode => {
        const [id1, id2] = node.dependsOn;
        const [start, end] = [this.props.dag.get(id1), this.props.dag.get(id2)];
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

        let startAngle = utils.cleanAngle(angleFromXAxis(MB));

        let arc = node.node;
        arc.position({x: M.x, y: M.y});
        arc.setAttrs({
            angle: 180,
            startAngle: startAngle
        });
                
        if (this.layerUnchangeVisualRef.current) {
            let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node.id()));
            if (label) {
                label.setAttrs(this.createLabel(node).getAttrs());
            }
        }


        (node.type as SemiCircle).start = B;
        (node.type as SemiCircle).end = A;

        return { ...node };
    }

    private updateReflection = (node: ShapeNode): ShapeNode => {
        const [id1, id2] = node.dependsOn;
        const shape1 = this.props.dag.get(id1);
        const shape2 = this.props.dag.get(id2);

        if (!shape1 || !shape2) {
            return { ...node };
        }

        // shape1 is object, shape2 is mirror
        let reflected = operation.reflection(shape1.type, shape2.type);
        if ('x' in reflected && 'y' in reflected) {
            // reflected is Point
            let p = node.node as Konva.Circle;
            p.position({x: reflected.x, y: reflected.y});
            (node.type as Point).x = reflected.x;
            (node.type as Point).y = reflected.y;
        }

        else if ('radius' in reflected) {
            // reflected is Circle
            let p = node.node as Konva.Circle;
            p.position({x: (reflected as Circle).centerC.x, y: (reflected as Circle).centerC.y});
            p.radius(reflected.radius);
            (node.type as Circle).centerC.x = (reflected as Circle).centerC.x;
            (node.type as Circle).centerC.y = (reflected as Circle).centerC.y;
            (node.type as Circle).radius = (reflected as Circle).radius;
        }

        else if ('points' in reflected) {
            let p = node.node as Konva.Line;
            let points: number[] = [];
            reflected.points.forEach((p: Point) => {
                points.push(p.x, p.y);
            });

            p.points(points);
            (node.type as Polygon).points = reflected.points;
        }

        else if ('startLine' in reflected) {
            let l = node.node as Konva.Line;
            const dx = (reflected as Line).endLine.x - (reflected as Line).startLine.x;
            const dy = (reflected as Line).endLine.y - (reflected as Line).startLine.y;

            let length = 2 * Math.max(this.stageRef.current!.width(), this.stageRef.current!.height()) * Math.sqrt(dx * dx + dy * dy) / this.props.geometryState.zoom_level;
            let norm_dx = dx / Math.sqrt(dx * dx + dy * dy);
            let norm_dy = dy / Math.sqrt(dx * dx + dy * dy);

            l.points([(reflected as Line).startLine.x - length * norm_dx, (reflected as Line).startLine.y - length * norm_dy, (reflected as Line).startLine.x + length * norm_dx, (reflected as Line).startLine.y + length * norm_dy]);
            [(node.type as Line).startLine.x, (node.type as Line).startLine.y] = [l.points()[0], l.points()[1]];
            [(node.type as Line).endLine.x, (node.type as Line).endLine.y] = [l.points()[2], l.points()[3]];
        }

        else if ('startVector' in reflected) {
            let l = node.node as Konva.Arrow;
            l.points([(reflected as Vector).startVector.x, (reflected as Vector).startVector.y, (reflected as Vector).endVector.x, (reflected as Vector).endVector.y]);
            [(node.type as Vector).startVector.x, (node.type as Vector).startVector.y] = [l.points()[0], l.points()[1]];
            [(node.type as Vector).endVector.x, (node.type as Vector).endVector.y] = [l.points()[2], l.points()[3]];
        }

        else if ('startSegment' in reflected) {
            let l = node.node as Konva.Line;
            l.points([(reflected as Segment).startSegment.x, (reflected as Segment).startSegment.y, (reflected as Segment).endSegment.x, (reflected as Segment).endSegment.y]);
            [(node.type as Segment).startSegment.x, (node.type as Segment).startSegment.y] = [l.points()[0], l.points()[1]];
            [(node.type as Segment).endSegment.x, (node.type as Segment).endSegment.y] = [l.points()[2], l.points()[3]];
        }

        else if ('startRay' in reflected) {
            let l = node.node as Konva.Line;
            const dx = (reflected as Ray).endRay.x - (reflected as Ray).startRay.x;
            const dy = (reflected as Ray).endRay.y - (reflected as Ray).startRay.y;

            let length = 2 * Math.max(this.stageRef.current!.width(), this.stageRef.current!.height()) * Math.sqrt(dx * dx + dy * dy) / this.props.geometryState.zoom_level;
            let norm_dx = dx / Math.sqrt(dx * dx + dy * dy);
            let norm_dy = dy / Math.sqrt(dx * dx + dy * dy);

            l.points([(reflected as Ray).startRay.x, (reflected as Ray).startRay.y, (reflected as Ray).startRay.x + length * norm_dx, (reflected as Ray).startRay.y + length * norm_dy]);
            [(node.type as Ray).startRay.x, (node.type as Ray).startRay.y] = [l.points()[0], l.points()[1]];
            [(node.type as Ray).endRay.x, (node.type as Ray).endRay.y] = [l.points()[2], l.points()[3]];
        }

        if (this.layerUnchangeVisualRef.current) {
            let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node.id()));
            if (label) {
                label.setAttrs(this.createLabel(node).getAttrs());
            }
        }

        return { ...node };
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
        const point = this.props.dag.get(pointId);
        const circle = this.props.dag.get(circleId);
        if (!point || !circle) return { ...node };

        let [A, c] = [
            Factory.createPoint(
                point.type.props,
                (point.type as Point).x,
                (point.type as Point).y
            ),

            Factory.createCircle(
                circle.type.props,
                (circle.type as Circle).centerC,
                (circle.type as Circle).radius,
                (circle.type as Circle).normal
            )
        ]

        const newTangents = operation.tangentLine(A, c); // returns 0-2 lines
        if (newTangents.length < 2) {
            (node.node as Konva.Line).hide();
            if (this.layerUnchangeVisualRef.current) {
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node.id()));
                if (label) {
                    label.show()
                    label.setAttrs(this.createLabel(node).getAttrs());
                }
            }

            return { ...node };
        }

        let tangents: Konva.Line[] = [];
        newTangents.forEach(l => {
            const dx = l.direction.x;
            const dy = l.direction.y;

            let length = 2 * Math.max(this.stageRef.current!.width(), this.stageRef.current!.height()) * Math.sqrt(dx * dx + dy * dy) / this.props.geometryState.zoom_level;
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
        [(node.type as Line).startLine.x, (node.type as Line).startLine.y] = [line.points()[0], line.points()[1]];
        [(node.type as Line).endLine.x, (node.type as Line).endLine.y] = [line.points()[2], line.points()[3]];
        line.show();
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

    private updatePerpendicularBisector = (node: ShapeNode): ShapeNode => {
        // Only depends on segment ID or 2 points
        if (node.dependsOn.length === 1) {
            const shape = this.props.dag.get(node.dependsOn[0]);
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

            let length = 2 * Math.max(this.stageRef.current!.width(), this.stageRef.current!.height()) * Math.sqrt(dx * dx + dy * dy) / this.props.geometryState.zoom_level;
            let norm_dx = dx / Math.sqrt(dx * dx + dy * dy);
            let norm_dy = dy / Math.sqrt(dx * dx + dy * dy);

            let line: Konva.Line = node.node as Konva.Line;
            line.points([midPoint.x - length * norm_dx, midPoint.y - length * norm_dy, midPoint.x + length * norm_dx, midPoint.y + length * norm_dy]);
            [(node.type as Line).startLine.x, (node.type as Line).startLine.y] = [line.points()[0], line.points()[1]];
            [(node.type as Line).endLine.x, (node.type as Line).endLine.y] = [line.points()[2], line.points()[3]];
            if (this.layerUnchangeVisualRef.current) {
            this.layerUnchangeVisualRef.current.getChildren().forEach((childNode, idx) => {
                    let id = childNode.id();
                    if (id === `label-${node.node.id()}`) {
                        childNode.setAttrs(this.createLabel(node).getAttrs());
                        return;
                    }
                })
            }
        }

        else if (node.dependsOn.length === 2) {
            const [id1, id2] = node.dependsOn;
            const [start, end] = [this.props.dag.get(id1), this.props.dag.get(id2)];
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

            let length = 2 * Math.max(this.stageRef.current!.width(), this.stageRef.current!.height()) * Math.sqrt(dx * dx + dy * dy) / this.props.geometryState.zoom_level;
            let norm_dx = dx / Math.sqrt(dx * dx + dy * dy);
            let norm_dy = dy / Math.sqrt(dx * dx + dy * dy);

            let line: Konva.Line = node.node as Konva.Line;
            line.points([midPoint.x - length * norm_dx, midPoint.y - length * norm_dy, midPoint.x + length * norm_dx, midPoint.y + length * norm_dy]);
            [(node.type as Line).startLine.x, (node.type as Line).startLine.y] = [line.points()[0], line.points()[1]];
            [(node.type as Line).endLine.x, (node.type as Line).endLine.y] = [line.points()[2], line.points()[3]];
            if (this.layerUnchangeVisualRef.current) {
                this.layerUnchangeVisualRef.current.getChildren().forEach((childNode, idx) => {
                    let id = childNode.id();
                    if (id === `label-${node.node.id()}`) {
                        childNode.setAttrs(this.createLabel(node).getAttrs());
                        return;
                    }
                })
            }
        }

        return { ...node };
    }

    private updatePerpendicularLine = (node: ShapeNode): ShapeNode => {
        const [id1, id2] = node.dependsOn;
        const [start, end] = [this.props.dag.get(id1), this.props.dag.get(id2)];
        if (!start || !end) {
            return { ...node };
        }

        // shape1 is point, shape2 is line/segment/ray
        let segmentPos = ((end as ShapeNode).node as Konva.Line).points();
        let pointPos = ((start as ShapeNode).node as Konva.Circle).position();

        const dx = segmentPos[1] - segmentPos[3];
        const dy = segmentPos[2] - segmentPos[0];

        let length = 2 * Math.max(this.stageRef.current!.width(), this.stageRef.current!.height()) * Math.sqrt(dx * dx + dy * dy) / this.props.geometryState.zoom_level;
        let norm_dx = dx / Math.sqrt(dx * dx + dy * dy);
        let norm_dy = dy / Math.sqrt(dx * dx + dy * dy);

        let line: Konva.Line = node.node as Konva.Line;
        line.points([pointPos.x - length * norm_dx, pointPos.y - length * norm_dy, pointPos.x + length * norm_dx, pointPos.y + length * norm_dy]);
        [(node.type as Line).startLine.x, (node.type as Line).startLine.y] = [line.points()[0], line.points()[1]];
        [(node.type as Line).endLine.x, (node.type as Line).endLine.y] = [line.points()[2], line.points()[3]];
        this.layerUnchangeVisualRef.current!.getChildren().forEach((childNode, idx) => {
            let id = childNode.id();
            if (id === `label-${node.node.id()}`) {
                childNode.setAttrs(this.createLabel(node).getAttrs());
                return;
            }
        })
        return { ...node };
    }

    private updateParallelLine = (node: ShapeNode): ShapeNode => {
        const [id1, id2] = node.dependsOn;
        const [start, end] = [this.props.dag.get(id1), this.props.dag.get(id2)];
        if (!start || !end) {
            return { ...node };
        }

        // shape1 is point, shape2 is line/segment/ray
        let segmentPos = ((end as ShapeNode).node as Konva.Line).points();
        let pointPos = ((start as ShapeNode).node as Konva.Circle).position();

        const dx = segmentPos[2] - segmentPos[0];
        const dy = segmentPos[3] - segmentPos[1];

        let length = 2 * Math.max(this.stageRef.current!.width(), this.stageRef.current!.height()) * Math.sqrt(dx * dx + dy * dy) / this.props.geometryState.zoom_level;
        let norm_dx = dx / Math.sqrt(dx * dx + dy * dy);
        let norm_dy = dy / Math.sqrt(dx * dx + dy * dy);

        let line: Konva.Line = node.node as Konva.Line;
        line.points([pointPos.x - length * norm_dx, pointPos.y - length * norm_dy, pointPos.x + length * norm_dx, pointPos.y + length * norm_dy]);
        [(node.type as Line).startLine.x, (node.type as Line).startLine.y] = [line.points()[0], line.points()[1]];
        [(node.type as Line).endLine.x, (node.type as Line).endLine.y] = [line.points()[2], line.points()[3]];
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

    private updateProjection = (node: ShapeNode): ShapeNode => {
        const [id1, id2] = node.dependsOn;
        const [shape1, shape2] = [this.props.dag.get(id1), this.props.dag.get(id2)];
        if (!shape1 || !shape2) {
            return { ...node };
        }

        let projected_point = operation.point_projection(
            shape1.type as Point,
            shape2.type
        )

        let point = node.node as Konva.Circle;
        point.position({x: projected_point.x, y: projected_point.y});
        [(node.type as Point).x, (node.type as Point).y] = [point.x(), point.y()];
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

    private updateExcircle = (node: ShapeNode): ShapeNode => {
        const [id1, id2, id3] = node.dependsOn;
        const [p1, p2, p3] = [this.props.dag.get(id1), this.props.dag.get(id2), this.props.dag.get(id3)];
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
            let idx = 0, minDst = math.parse('sqrt(x^2 + y^2)').evaluate({x: excenter[0].x - circle.x(), y: excenter[0].y - circle.y()});
            excenter.forEach((center, i) => {
                const newDst = math.parse('sqrt(x^2 + y^2)').evaluate({x: center.x - circle.x(), y: center.y - circle.y()});
                if (newDst <= minDst) {
                    minDst = newDst;
                    idx = i;
                }
            });

            circle.position({x: excenter[idx].x, y: excenter[idx].y});
            circle.radius(exradius[idx]);
            node.node.show();
            [
                (node.type as Circle).centerC.x,
                (node.type as Circle).centerC.y,
                (node.type as Circle).radius
            ] = [
                excenter[idx].x,
                excenter[idx].y,
                exradius[idx]
            ]

            if (this.layerUnchangeVisualRef.current) {
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node.id()));
                if (label) {
                    label.setAttrs(this.createLabel(node).getAttrs());
                }
            }

            return { ...node };
        }

        catch(error) {
            node.node.hide();
            if (this.layerUnchangeVisualRef.current) {
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node.id()));
                if (label) {
                    label.show()
                    label.setAttrs(this.createLabel(node).getAttrs());
                }
            }
            
            return { ...node };
        }
    }

    private updateExcenter = (node: ShapeNode): ShapeNode => {
        const [id1, id2, id3] = node.dependsOn;
        const [p1, p2, p3] = [this.props.dag.get(id1), this.props.dag.get(id2), this.props.dag.get(id3)];
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
            let idx = 0, minDst = math.parse('sqrt(x^2 + y^2)').evaluate({x: excenter[0].x - circle.x(), y: excenter[0].y - circle.y()});
            excenter.forEach((center, i) => {
                const newDst = math.parse('sqrt(x^2 + y^2)').evaluate({x: center.x - circle.x(), y: center.y - circle.y()});
                if (newDst <= minDst) {
                    minDst = newDst;
                    idx = i;
                }
            });

            let point = node.node as Konva.Circle;
            point.position({x: excenter[idx].x, y: excenter[idx].y});
            point.show();

            if (this.layerUnchangeVisualRef.current) {
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node.id()));
                if (label) {
                    label.show()
                    label.setAttrs(this.createLabel(node).getAttrs());
                }
            }

            [(node.type as Point).x, (node.type as Point).x] = [point.x(), point.y()];
            return { ...node };
        }

        catch (error) {
            node.node.hide();
            if (this.layerUnchangeVisualRef.current) {
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node.id()));
                if (label) {
                    label.hide();
                }
            }

            return { ...node };
        }
    }

    private updateRotation = (node: ShapeNode): ShapeNode => {
        const [id1, id2] = node.dependsOn;
        const [p1, p2] = [this.props.dag.get(id1), this.props.dag.get(id2)];
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
            // rotated_obj is Point
            let p = node.node as Konva.Circle;
            p.position({x: rotated_obj.x, y: rotated_obj.y});
            (node.type as Point).x = rotated_obj.x;
            (node.type as Point).y = rotated_obj.y;
        }

        else if ('radius' in rotated_obj) {
            // rotated_obj is Circle
            let p = node.node as Konva.Circle;
            p.position({x: (rotated_obj as Circle).centerC.x, y: (rotated_obj as Circle).centerC.y});
            p.radius(rotated_obj.radius);
            (node.type as Circle).centerC.x = (rotated_obj as Circle).centerC.x;
            (node.type as Circle).centerC.y = (rotated_obj as Circle).centerC.y;
            (node.type as Circle).radius = (rotated_obj as Circle).radius;
        }

        else if ('points' in rotated_obj) {
            let p = node.node as Konva.Line;
            let points: number[] = [];
            rotated_obj.points.forEach((p: Point) => {
                points.push(p.x, p.y);
            });

            p.points(points);
            (node.type as Polygon).points = rotated_obj.points;
        }

        else if ('startLine' in rotated_obj) {
            let l = node.node as Konva.Line;
            const dx = (rotated_obj as Line).endLine.x - (rotated_obj as Line).startLine.x;
            const dy = (rotated_obj as Line).endLine.y - (rotated_obj as Line).startLine.y;

            let length = 2 * Math.max(this.stageRef.current!.width(), this.stageRef.current!.height()) * Math.sqrt(dx * dx + dy * dy) / this.props.geometryState.zoom_level;
            let norm_dx = dx / Math.sqrt(dx * dx + dy * dy);
            let norm_dy = dy / Math.sqrt(dx * dx + dy * dy);

            l.points([(rotated_obj as Line).startLine.x - length * norm_dx, (rotated_obj as Line).startLine.y - length * norm_dy, (rotated_obj as Line).startLine.x + length * norm_dx, (rotated_obj as Line).startLine.y + length * norm_dy]);
            [(node.type as Line).startLine.x, (node.type as Line).startLine.y] = [l.points()[0], l.points()[1]];
            [(node.type as Line).endLine.x, (node.type as Line).endLine.y] = [l.points()[2], l.points()[3]];
        }

        else if ('startVector' in rotated_obj) {
            let l = node.node as Konva.Arrow;
            l.points([(rotated_obj as Vector).startVector.x, (rotated_obj as Vector).startVector.y, (rotated_obj as Vector).endVector.x, (rotated_obj as Vector).endVector.y]);
            [(node.type as Vector).startVector.x, (node.type as Vector).startVector.y] = [l.points()[0], l.points()[1]];
            [(node.type as Vector).endVector.x, (node.type as Vector).endVector.y] = [l.points()[2], l.points()[3]];
        }

        else if ('startSegment' in rotated_obj) {
            let l = node.node as Konva.Line;
            l.points([(rotated_obj as Segment).startSegment.x, (rotated_obj as Segment).startSegment.y, (rotated_obj as Segment).endSegment.x, (rotated_obj as Segment).endSegment.y]);
            [(node.type as Segment).startSegment.x, (node.type as Segment).startSegment.y] = [l.points()[0], l.points()[1]];
            [(node.type as Segment).endSegment.x, (node.type as Segment).endSegment.y] = [l.points()[2], l.points()[3]];
        }

        else if ('startRay' in rotated_obj) {
            let l = node.node as Konva.Line;
            const dx = (rotated_obj as Ray).endRay.x - (rotated_obj as Ray).startRay.x;
            const dy = (rotated_obj as Ray).endRay.y - (rotated_obj as Ray).startRay.y;

            let length = 2 * Math.max(this.stageRef.current!.width(), this.stageRef.current!.height()) * Math.sqrt(dx * dx + dy * dy) / this.props.geometryState.zoom_level;
            let norm_dx = dx / Math.sqrt(dx * dx + dy * dy);
            let norm_dy = dy / Math.sqrt(dx * dx + dy * dy);

            l.points([(rotated_obj as Ray).startRay.x, (rotated_obj as Ray).startRay.y, (rotated_obj as Ray).startRay.x + length * norm_dx, (rotated_obj as Ray).startRay.y + length * norm_dy]);
            [(node.type as Ray).startRay.x, (node.type as Ray).startRay.y] = [l.points()[0], l.points()[1]];
            [(node.type as Ray).endRay.x, (node.type as Ray).endRay.y] = [l.points()[2], l.points()[3]];
        }

        if (this.layerUnchangeVisualRef.current) {
            let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node.id()));
            if (label) {
                label.setAttrs(this.createLabel(node).getAttrs());
            }
        }

        return { ...node };
    }

    private updateEnlarge = (node: ShapeNode): ShapeNode => {
        const [id1, id2] = node.dependsOn;
        const [p1, p2] = [this.props.dag.get(id1), this.props.dag.get(id2)];
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

            let length = 2 * Math.max(this.stageRef.current!.width(), this.stageRef.current!.height()) * Math.sqrt(dx * dx + dy * dy) / this.props.geometryState.zoom_level;
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

            let length = 2 * Math.max(this.stageRef.current!.width(), this.stageRef.current!.height()) * Math.sqrt(dx * dx + dy * dy) / this.props.geometryState.zoom_level;
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

    private updateRegularPoly = (node: ShapeNode): ShapeNode => {
        const shape1 = this.props.dag.get(node.dependsOn[0]);
        if (!shape1) return { ...node };

        if (!node.rotationFactor) return { ...node };
        const posA = {
            x: (shape1.node as Konva.Line).points()[0],
            y: (shape1.node as Konva.Line).points()[1]
        }

        const posB = {
            x: (shape1.node as Konva.Line).points()[2],
            y: (shape1.node as Konva.Line).points()[3]
        }

        let [A, B] = [
            Factory.createPoint(node.type.props, posA.x, posA.y),
            Factory.createPoint(node.type.props, posB.x, posB.y),
        ]

        let pts: number[] = [A.x, A.y, B.x, B.y];
        let points = [A, B];
        while (pts.length < (node.node as Konva.Line).points().length) {
            let newEnd = operation.rotation(A, B, node.rotationFactor.degree, false) as Point;
            points.push(newEnd);
            pts.push(newEnd.x, newEnd.y);
            A = B;
            B = newEnd;
        }

        (node.node as Konva.Line).points(pts);
        (node.type as Polygon).points = points;
        return { ...node };
    }

    private removeNodeBatch = (id: string, visited: Set<string>, state: {
        shapes: string[],
        labelUsed: string[],
        dag: Map<string, ShapeNode>
    }) => {
        if (visited.has(id)) return;
        const node = state.dag.get(id);
        if (!node) return;

        visited.add(id);
        // 1. Find all dependent nodes and recursively remove them
        state.dag.forEach((value, key) => {
            if (value.dependsOn.includes(id)) {
                this.removeNodeBatch(key, visited, state);
            }
        });

        // 2. Clean up
        this.props.onLabelUsed(state.labelUsed.filter(
            label => label !== node.type.props.label
        ));

        (node as ShapeNode).node.destroy();
        state.dag.delete(id);

        // 3. Remove from shapes
        state.shapes = state.shapes.filter(shapeId => shapeId !== id);
    };

    // Public method that does batch delete with single re-render
    private removeNode = (id: string): void => {
        const newShapes = [...this.props.geometryState.shapes];
        const dag = utils.cloneDAG(this.props.dag);
        const set = new Set<string>();

        this.removeNodeBatch(id, set, { shapes: newShapes, labelUsed: this.props.labelUsed, dag: dag });

        // Only one render here
        this.props.onUpdateAll({
            gs: this.props.geometryState,
            dag: dag,
            selectedPoints: this.props.selectedPoints,
            selectedShapes: this.props.selectedShapes
        })
    };

    private createPoint = (
        position: {x: number, y: number},
        children: Konva.Shape[]
    ): void => {
        let shape = children.length > 0 ? children[children.length - 1] : undefined;
        let scaleFactor: number | undefined = undefined;
        let rotFactor: {degree: number, CCW: boolean} | undefined = undefined;

        const DAG = utils.cloneDAG(this.props.dag);
        
        children.reverse().slice(-2).forEach(s => {
            let posInfo = utils.snapToShape(
                DAG, s, position, this.layerMathObjectRef.current!, this.props.isSnapToGrid,
                this.stageRef.current!, this.props.geometryState.axisTickInterval
            );

            position = posInfo.position;
            rotFactor = posInfo.rotFactor;
            scaleFactor = posInfo.scaleFactor;
        });

        const selectedPoints = [...this.props.selectedPoints];
        let label = utils.getExcelLabel('A', 0);
        let index = 0;
        while (this.props.labelUsed.includes(label)) {
            index++;
            label = utils.getExcelLabel('A', index);
        }

        this.props.onLabelUsed([...this.props.labelUsed, label]);
        let point = Factory.createPoint(
            utils.createPointDefaultShapeProps(label),
            position.x,
            position.y
        );

        let pNode = this.createKonvaShape(point);
        if (children.length > 1) {
            pNode.draggable(false);
            point.type = 'Intersection';
        }

        else if (shape) {
            pNode.off('dragmove');
            pNode.on('dragmove', (e) => {
                if (this.props.mode !== 'edit') {
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
                    let posInfo = utils.snapToShape(
                        DAG, shape, pos, this.layerMathObjectRef.current!, this.props.isSnapToGrid,
                        this.stageRef.current!, this.props.geometryState.axisTickInterval
                    );

                    position = posInfo.position;
                    rotFactor = posInfo.rotFactor;
                    scaleFactor = posInfo.scaleFactor;
                    node.node.position(position);
                    point.x = position.x;
                    point.y = position.y;

                    if (this.layerUnchangeVisualRef.current) {
                        let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node.id()));
                        if (label) {
                            label.setAttrs(this.createLabel(node).getAttrs());
                        }
                    }

                    return node;
                };

                this.updateAndPropagate(pNode.id(), updateFn);
            })
        }

        let shapeNode: ShapeNode = {
            id: point.props.id,
            type: point,
            node: pNode,
            dependsOn: children.slice(-2).reverse().map(node => node.id()),
            scaleFactor: scaleFactor,
            rotationFactor: rotFactor,
            defined: true,
            ambiguous: false
        }

        DAG.set(point.props.id, shapeNode);

        this.props.onUpdateLastFailedState(this.props.mode === 'point' ? undefined : {
            selectedPoints: [...selectedPoints, point],
            selectedShapes: [...this.props.selectedShapes]
        });

        this.props.onUpdateAll({
            gs: {...this.props.geometryState, shapes: [...this.props.geometryState.shapes, point.props.id]},
            dag: DAG,
            selectedShapes: [...this.props.selectedShapes],
            selectedPoints: [...selectedPoints, point]
        });
    }

    render(): React.ReactNode {
        const { width, height, background_color } = this.props;
        return (
            <Stage
                className={"cursor_hit"} 
                ref={this.stageRef} 
                width={width}
                height={height} 
                style={{background: background_color}}
                onWheel={this.handleZoom}
                onMouseDown={this.handleMouseDown}
                onMouseMove={this.handleMouseMove}
                onMouseUp={this.handleMouseUp}
            >
                <Layer ref={this.layerGridRef} />
                <Layer ref={this.layerUnchangeVisualRef} />
                <Layer ref={this.layerAxisRef} />
                <Layer ref={this.layerMathObjectRef} />
            </Stage>
        )
    }
}

export default KonvaCanvas;