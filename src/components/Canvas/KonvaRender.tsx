import React, { RefObject } from "react";
import { Line, Point, Shape, GeometryState, ShapeNode, DrawingMode, HistoryEntry, Segment, Ray, Vector, Circle, Polygon, Angle, SemiCircle } from "../../types/geometry"
import Konva from "konva";
import { Stage, Layer } from "react-konva";
import { KonvaAxis } from "../../utils/KonvaAxis";
import { KonvaGrid } from "../../utils/KonvaGrid";
import * as Factory from '../../utils/Factory'
import * as utils from '../../utils/utilities'
import * as constants from '../../types/constants'
import * as operation from '../../utils/math_operation'
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
    data: {
        radius: number | undefined | string;
        vertices: number | undefined;
        rotation: {
            degree: number;
            CCW: boolean;
        } | undefined;
    };
    onChangeMode: (mode: DrawingMode) => void;
    onUpdateLastFailedState: (state?: {
        selectedPoints: Point[], selectedShapes: Shape[]
    }) => void;
    onUpdateAll: (state: {
        gs: GeometryState,
        dag: Map<string, ShapeNode>,
        selectedShapes: Shape[],
        selectedPoints: Point[]
    }, storeHistory?: boolean) => void;
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
    onRenderMenuRightClick: (pos?: { x: number, y: number }) => void;
    onRemoveNode: (id: string) => void;
    onRenderDialogbox: (mode: DrawingMode, id_to_change?: string) => void;
    stageRef: RefObject<Konva.Stage | null>;
}

class KonvaCanvas extends React.Component<CanvasProps, {}> {
    private layerMathObjectRef: RefObject<Konva.Layer | null>;
    private layerUnchangeVisualRef: RefObject<Konva.Layer | null>;
    private layerAxisRef: RefObject<Konva.Layer | null>;
    private layerGridRef: RefObject<Konva.Layer | null>;
    private last_pointer: { x: number, y: number };
    private moveFrameId: number | null = null;
    private zoomFrameId: number | null = null;
    private newCreatedPoint: Point[];
    private isBatchUpdating: boolean = false;

    constructor(props: CanvasProps) {
        super(props);
        this.layerMathObjectRef = React.createRef<Konva.Layer>();
        this.layerUnchangeVisualRef = React.createRef<Konva.Layer>();
        this.layerAxisRef = React.createRef<Konva.Layer>();
        this.layerGridRef = React.createRef<Konva.Layer>();
        this.last_pointer = { x: 0, y: 0 };
        //this.props.stageRef = React.createRef<Konva.Stage>();
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleZoom = this.handleZoom.bind(this);
        this.newCreatedPoint = new Array<Point>();
    }

    componentDidMount(): void {
        this.props.stageRef.current?.container().addEventListener('contextmenu', this.handleContextMenu);
        this.drawShapes();
    }

    componentDidUpdate(prevProps: Readonly<CanvasProps>): void {
        if (
            (['segment_length', 'circle', 'enlarge'].includes(this.props.mode)) &&
            this.props.data.radius !== prevProps.data.radius &&
            typeof this.props.data.radius === 'number'
        ) {
            this.handleDrawing(); // ✅ call same function again
        }

        else if (
            (this.props.mode === 'regular_polygon') &&
            this.props.data.vertices !== prevProps.data.vertices &&
            typeof this.props.data.vertices === 'number'
        ) {
            this.handleDrawing(); // ✅ call same function again
        }

        else if (
            (this.props.mode === 'rotation') &&
            this.props.data.rotation !== prevProps.data.rotation &&
            this.props.data.rotation !== undefined &&
            typeof this.props.data.rotation.degree === 'number'
        ) {
            this.handleDrawing(); // ✅ call same function again
        }

        else if (
            (this.props.mode === 'angle') &&
            this.props.data.radius !== prevProps.data.radius &&
            this.props.data.radius !== undefined &&
            typeof this.props.data.radius === 'string'
        ) {
            this.handleDrawing(); // ✅ call same function again
        }

        if (
            prevProps.geometryState !== this.props.geometryState ||
            prevProps.dag !== this.props.dag
        ) {
            this.drawShapes();
        }
    }

    componentWillUnmount(): void {
        this.props.stageRef.current?.container().removeEventListener('contextmenu', this.handleContextMenu);
    }

    private handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
    };

    private handleZoom = (e: Konva.KonvaEventObject<MouseEvent>) => {
        e.evt.preventDefault();
        const stage = this.props.stageRef.current;
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
                    (node.node! as Konva.Circle).radius(node.type.props.radius * this.props.geometryState.spacing / newScale);
                }

                node.node!.strokeWidth(node.type.props.line_size / newScale);
                node.node!.hitStrokeWidth(5 / newScale);
                node.node!.dash(utils.createDashArray({
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

            let numLoops = this.props.geometryState.numLoops + (newScale > oldScale ? 1 : (newScale < oldScale ? -1 : 0));
            const calcNextInterval = (interval: number, forward: boolean) => {
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
            if (Math.abs(numLoops) % 8 === 0) {
                axisTickInterval = calcNextInterval(axisTickInterval, newScale < oldScale);
            }

            this.props.onGeometryStateChange({
                ...this.props.geometryState,
                numLoops: numLoops,
                axisTickInterval: axisTickInterval,
                zoom_level: newScale,
                spacing: this.props.geometryState.spacing
            });
        })

    }

    private handleMouseDown = (e: Konva.KonvaEventObject<PointerEvent>) => {
        if (!this.props.stageRef.current || !this.layerMathObjectRef.current) return;
        const pointer = this.props.stageRef.current.getPointerPosition();
        if (!pointer) return;
        if (e.evt.button !== 0) {
            this.props.onRenderMenuRightClick({ x: e.evt.clientX, y: e.evt.clientY });
            return;
        }

        this.props.onRenderMenuRightClick();
        if (this.props.mode !== 'edit') {
            let position = {
                x: (pointer.x - this.layerMathObjectRef.current.x()) / this.layerMathObjectRef.current.scaleX(),
                y: (pointer.y - this.layerMathObjectRef.current.y()) / this.layerMathObjectRef.current.scaleY()
            }

            this.last_pointer = position;

            position = this.props.isSnapToGrid ? utils.snapToGrid(
                pointer,
                this.props.geometryState.spacing,
                this.props.geometryState.axisTickInterval,
                this.props.stageRef.current.width() / 2,
                this.props.stageRef.current.height() / 2,
                this.layerMathObjectRef.current!
            ) : position;

            let shapes = this.props.stageRef.current.getAllIntersections(pointer);
            let children = shapes.filter(node => (node.getLayer() === this.layerMathObjectRef.current) || node.getLayer() === this.layerAxisRef.current);
            let shape = children.length > 0 ? children[children.length - 1] : undefined;
            if (shape) {
                let pNode = this.props.dag.get(shape.id());
                if (!pNode) {
                    let l: Line = Factory.createLine(
                        utils.createLineDefaultShapeProps(shape.id()),
                        Factory.createPoint(
                            utils.createPointDefaultShapeProps(''),
                            0, 0
                        ),

                        Factory.createPoint(
                            utils.createPointDefaultShapeProps(''),
                            0 + (shape.id().includes('x-axis') ? 1 : 0),
                            0 + (shape.id().includes('y-axis') ? 1 : 0)
                        ),
                    )

                    const newSelected = [...this.props.selectedShapes, l];
                    this.props.onSelectedShapesChange(newSelected);
                }

                else {
                    if (!shape.id().includes('point-')) {
                        const newSelected = [...this.props.selectedShapes, pNode.type];
                        this.props.onSelectedShapesChange(newSelected);
                    }

                    else {
                        this.props.onSelectedPointsChange([...this.props.selectedPoints, pNode.type as Point]);
                    }
                }
            }

            if (this.props.mode === 'intersection' && children.filter(item => !item.id().includes('point-') && !item.id().includes('polygon-')).length > 1) {
                this.createPoint(position, children);
                return;
            }

            if (['parallel', 'perpendicular', 'perpendicular_bisector', 'angle', 'angle_bisector', 'reflect_point', 'reflect_line',
                'translation', 'rotation', 'projection', 'enlarge'].includes(this.props.mode)) {
                if (!shape) {
                    this.createPoint(position, children);
                }
            }

            else if (['show_label', 'show_object'].includes(this.props.mode)) {
                if (!shape) return;
                let shapeNode = this.props.dag.get(shape.id());
                if (!shapeNode) return;
                if (this.props.mode === 'show_object') {
                    shapeNode.type.props.visible.shape = !shapeNode.type.props.visible.shape;
                    if (!shapeNode.type.props.visible.shape && shapeNode.type.props.visible.label) {
                        shapeNode.type.props.visible.label = false;
                    }

                    shapeNode.type.props.visible.shape ? shapeNode.node!.show() : shapeNode.node!.hide();
                }

                else {
                    shapeNode.type.props.visible.label = !shapeNode.type.props.visible.label;
                }

                let text = this.layerUnchangeVisualRef.current?.findOne(`#label-${shape.id()}`);
                if (!text) return;
                shapeNode.type.props.visible.label ? text.show() : text.hide();
            }

            else if (!shape || (shape && !shape.id().includes('point-'))) {
                if (!['length', 'area', 'tangent_line'].includes(this.props.mode) &&
                    !(shape && shape.id().includes('polygon-') && this.props.selectedPoints.length === 0 && ['orthocenter', 'centroid', 'circumcenter', 'incenter', 'excenter', 'circumcircle', 'incircle', 'excircle'].includes(this.props.mode)) &&
                    !(this.props.mode === 'intersection' && shape && !shape.id().includes('point-')) &&
                    !(shape && (shape.id().includes('circle-') ||
                        (shape.id().includes('line-') && this.props.dag.has(shape.id()) && 'startSegment' in this.props.dag.get(shape.id())!.type)) && this.props.mode === 'midpoint') &&
                    !(shape && (shape.id().includes('point-') || (shape.id().includes('line-') && this.props.dag.has(shape.id()) && 'startSegment' in this.props.dag.get(shape.id())!.type)) && this.props.mode === 'regular_polygon')
                ) {
                    this.createPoint(position, children);
                }
            }

            requestAnimationFrame(() => this.handleDrawing());
            return;
        }

        this.props.stageRef.current.container().className = this.props.stageRef.current.getIntersection(pointer) ? "cursor_drag" : "cursor_grabbing";
        let shapes = this.props.stageRef.current.getAllIntersections(pointer);
        let children = shapes.filter(node => (node.getLayer() === this.layerMathObjectRef.current));
        let shape = children.length > 0 ? children[children.length - 1] : undefined;
        if (shape) {
            const isCtrl = e.evt.ctrlKey || e.evt.metaKey;
            let pNode = this.props.dag.get(shape.id());
            if (!shape.id().includes('point-')) {
                const selected = this.props.selectedShapes.map(s => s.props.id);
                const isAlreadySelected = selected.includes(pNode!.type.props.id);
                let newSelectedShapes = [...this.props.selectedShapes];
                if (isCtrl) {
                    if (isAlreadySelected) {
                        newSelectedShapes = newSelectedShapes.filter(s => s.props.id !== pNode!.type.props.id);
                    }

                    else {
                        newSelectedShapes.push(pNode!.type);
                    }
                }

                else {
                    newSelectedShapes = [pNode!.type];
                }

                this.props.onSelectedShapesChange(newSelectedShapes);
            }

            else {
                const selected = this.props.selectedPoints.map(p => p.props.id);
                const isAlreadySelected = selected.includes(pNode!.type.props.id);
                let newSelectedPoints = [...this.props.selectedPoints];
                if (isCtrl) {
                    if (isAlreadySelected) {
                        newSelectedPoints = newSelectedPoints.filter(p => p.props.id !== pNode!.type.props.id);
                    }

                    else {
                        newSelectedPoints.push(pNode!.type as Point);
                    }
                }

                else {
                    newSelectedPoints = [pNode!.type as Point];
                }

                this.props.onSelectedPointsChange(newSelectedPoints);
            }
        }

        else {
            if (e.target === this.props.stageRef.current || e.target instanceof Konva.Stage) {
                this.last_pointer = {
                    x: pointer.x,
                    y: pointer.y
                }

                this.props.onUpdateAll({
                    gs: { ...this.props.geometryState, panning: true },
                    dag: utils.cloneDAG(this.props.dag),
                    selectedShapes: [],
                    selectedPoints: []
                })
            }
        }
    }

    private handleMouseMove = (e: Konva.KonvaEventObject<PointerEvent>) => {
        if (this.moveFrameId) {
            cancelAnimationFrame(this.moveFrameId);
        }

        this.moveFrameId = requestAnimationFrame(() => {
            const layer = this.layerMathObjectRef.current;
            const stage = this.props.stageRef.current;
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
                        (node.node! as Konva.Circle).shadowColor('gray');
                        (node.node! as Konva.Circle).shadowBlur((node.node! as Konva.Circle).radius() * 2.5);
                        (node.node! as Konva.Circle).shadowOpacity(1.5);
                    }

                    else {
                        const strokeWidth = node.type.props.line_size / this.props.geometryState.zoom_level;
                        node.node!.strokeWidth(strokeWidth * 2);
                    }
                }

                else {
                    if (!node.isSelected) {
                        if (node.id.includes('point-')) {
                            (node.node! as Konva.Circle).shadowBlur(0);
                            (node.node! as Konva.Circle).shadowOpacity(0);
                        }

                        else {
                            const strokeWidth = node.type.props.line_size / this.props.geometryState.zoom_level;
                            node.node!.strokeWidth(strokeWidth);
                        }
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
                    node.position({ x: node.x() + dx, y: node.y() + dy });
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

                this.props.onGeometryStateChange({ ...this.props.geometryState });
            }
        })
    }

    private handleMouseUp = () => {
        if (this.props.geometryState.panning) {
            this.props.onUpdateAll({
                gs: { ...this.props.geometryState, panning: false },
                dag: this.props.dag,
                selectedShapes: [],
                selectedPoints: []
            });
        }


        this.props.stageRef.current!.container().className = "cursor_hit";
    }

    private drawGrid = (): void => {
        if (this.props.geometryState.gridVisible && this.layerGridRef.current) {
            const grid = new KonvaGrid({
                width: this.props.stageRef.current!.width(),
                height: this.props.height,
                gridColor: 'gray',
                gridSize: this.props.geometryState.spacing,
                strokeWidth: 0.75,
                originX: this.props.stageRef.current!.width() / 2,
                originY: this.props.stageRef.current!.height() / 2,
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
                width: this.props.stageRef.current!.width(),
                height: this.props.stageRef.current!.height(),
                axisColor: 'gray',
                axisWidth: 1,
                pointerWidth: constants.ARROW_DEFAULTS.POINTER_WIDTH,
                pointerLength: constants.ARROW_DEFAULTS.POINTER_LENGTH,
                xTickSpacing: this.props.geometryState.spacing,
                originX: this.props.stageRef.current!.width() / 2,
                originY: this.props.stageRef.current!.height() / 2,
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
        if (!this.props.stageRef.current || !this.layerMathObjectRef.current) return;
        this.layerUnchangeVisualRef.current?.destroyChildren();
        this.layerAxisRef.current?.destroyChildren();
        this.layerGridRef.current?.destroyChildren();

        this.drawGrid();
        this.drawAxes();

        const visualPriority: Record<string, number> = {
            'Polygon': 0,
            'RegularPolygon': 1,

            'Circle': 2,
            'Circle2Point': 3,
            'Circumcircle': 4,
            'Incircle': 5,
            'Excircle': 6,
            'SemiCircle': 7,

            'Line': 8,
            'Ray': 9,
            'ParallelLine': 10,

            'Segment': 11,
            'Vector': 12,
            'TangentLine': 13,
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

            'Point': 31
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
                node.setAttrs(this.createKonvaShape(n!.type).getAttrs());
            }
        });

        this.props.dag.forEach((node, key) => {
            if (node.node !== undefined) {
                if (!this.layerMathObjectRef.current?.findOne(`#${node.id}`)) {
                    this.layerMathObjectRef.current?.add(node.node!);
                }
            }

            else {
                node.node = this.createKonvaShape(node.type);
                this.layerMathObjectRef.current?.add(node.node!);
            }

            shapeNode.push(node);
            let label = this.createLabel(node);
            if (!node.defined || ((node.type.props.visible.shape && !node.type.props.visible.label) || !node.type.props.visible.shape)) {
                node.id.includes('tmp') ? label.show() : label.hide();
            }

            this.layerUnchangeVisualRef.current?.add(label);
        });

        function sortShapesForZIndex(shapes: ShapeNode[]): ShapeNode[] {
            return shapes.sort((a, b) => (visualPriority[a.type.type] ?? 0) - (visualPriority[b.type.type] ?? 0));
        }

        shapeNode = sortShapesForZIndex(shapeNode);
        shapeNode.forEach((shape) => {
            if (shape.node!.getLayer()) {
                shape.node!.moveToTop();
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
        const pos = utils.convertToScreenCoords(
            { x: point.x, y: point.y }, { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
            this.props.geometryState.spacing
        );

        const c = new Konva.Circle({
            x: pos.x,
            y: pos.y,
            radius: props.radius * this.props.geometryState.spacing / (this.layerMathObjectRef.current!.scaleX() ?? 1),
            fill: props.color,
            stroke: props.color,
            visible: props.visible.shape,
            id: props.id,
            draggable: true,
            strokeWidth: scaledStrokeWidth,
            perfectDrawEnabled: false,
            hitStrokeWidth: 5
        });

        c.visible(props.visible.shape);

        c.on('mousedown', (e) => {
            if (this.props.mode !== 'delete') {
                return;
            }

            e.cancelBubble = true;
            if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(point.props.id));
                if (label) {
                    label.destroy();
                }
            }

            this.props.onRemoveNode(c.id());
            this.props.pushHistory(this.props.getSnapshot());
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

            this.props.pushHistory(this.props.getSnapshot());
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

            const updateFn = (node: ShapeNode): ShapeNode => {
                let shape: Konva.Shape | undefined;
                if (node.dependsOn.length > 0) {
                    if (['x-axis', 'y-axis'].includes(node.dependsOn[0])) {
                        shape = this.createKonvaShape(
                            Factory.createLine(
                                utils.createLineDefaultShapeProps(node.dependsOn[0]),
                                Factory.createPoint(
                                    utils.createPointDefaultShapeProps(''),
                                    0, 0
                                ),

                                Factory.createPoint(
                                    utils.createPointDefaultShapeProps(''),
                                    0 + (node.dependsOn[0].includes('x-axis') ? 1 : 0),
                                    0 + (node.dependsOn[0].includes('y-axis') ? 1 : 0)
                                ),
                            )
                        )
                    }

                    else shape = this.props.dag.get(node.dependsOn[0])?.node;
                }

                let posInfo = utils.snapToShape(
                    this.props.dag, shape, pos, this.layerMathObjectRef.current!, this.props.isSnapToGrid,
                    this.props.stageRef.current!, this.props.geometryState.axisTickInterval
                );

                if (!shape && !this.props.isSnapToGrid) {
                    posInfo.position = {
                        x: (posInfo.position.x - this.layerMathObjectRef.current!.x()) / this.layerMathObjectRef.current!.scaleX(),
                        y: (posInfo.position.y - this.layerMathObjectRef.current!.y()) / this.layerMathObjectRef.current!.scaleY(),
                    }
                }

                node.node!.position(posInfo.position);
                this.updatePointPos(node.type as Point, node.node!.x(), node.node!.y());
                node.rotationFactor = posInfo.rotFactor;
                node.scaleFactor = posInfo.scaleFactor;

                if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
                    let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
                    if (label) {
                        label.setAttrs(this.createLabel(node).getAttrs());
                    }
                }

                return { ...node };
            };

            this.updateAndPropagateBatch([c.id()], updateFn);
        });

        c.on('dragend', (e) => {
            if (this.props.mode !== 'edit') {
                return;
            }

            e.cancelBubble = true;
            this.props.pushHistory(this.props.getSnapshot());
        });

        c.on('dblclick', (e) => {
            if (this.props.mode !== 'edit') {
                return;
            }

            e.cancelBubble = true;
            const newName = this.props.data.radius;
            if (newName === undefined || typeof newName !== 'string') {
                this.props.onRenderDialogbox('changeName', point.props.id);
                return;
            }
        });

        return c;
    };

    private drawLine = (line: Line) => {
        const props = line.props;
        const screenPosStart = utils.convertToScreenCoords(
            { x: line.startLine.x, y: line.startLine.y }, { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
            this.props.geometryState.spacing
        );

        const screenPosEnd = utils.convertToScreenCoords(
            { x: line.endLine.x, y: line.endLine.y }, { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
            this.props.geometryState.spacing
        );

        const dx = screenPosEnd.x - screenPosStart.x;
        const dy = screenPosEnd.y - screenPosStart.y;

        let length = 2 * Math.max(this.props.stageRef.current!.width(), this.props.stageRef.current!.height()) * Math.sqrt(dx * dx + dy * dy) / (this.layerMathObjectRef.current!.scaleX() ?? 1);
        let norm_dx = dx / Math.sqrt(dx * dx + dy * dy);
        let norm_dy = dy / Math.sqrt(dx * dx + dy * dy);

        const scale = (this.layerMathObjectRef.current!.scaleX() ?? 1);
        const scaledStrokeWidth = props.line_size / scale;

        const l = new Konva.Line({
            points: [
                screenPosStart.x - length * norm_dx,
                screenPosStart.y - length * norm_dy,
                screenPosEnd.x + length * norm_dx,
                screenPosEnd.y + length * norm_dy
            ],
            dash: utils.createDashArray(props.line_style),
            strokeWidth: scaledStrokeWidth,
            stroke: props.color,
            visible: props.visible.shape,
            id: props.id,
            hitStrokeWidth: 5,
            draggable: true
        });

        l.visible(props.visible.shape);

        l.on('mousedown', (e) => {
            if (this.props.mode !== 'delete') {
                return;
            }

            e.cancelBubble = true;
            if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(line.props.id));
                if (label) {
                    label.destroy();
                }
            }

            this.props.onRemoveNode(l.id());
            this.props.pushHistory(this.props.getSnapshot());
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

            oldPos = this.props.stageRef.current!.getPointerPosition() ?? oldPos;
            this.props.pushHistory(this.props.getSnapshot());
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
            const pos = this.props.stageRef.current!.getPointerPosition();
            if (!pos) return;
            let dx = pos.x - oldPos.x;
            let dy = pos.y - oldPos.y;

            let [id1, id2] = [line.startLine.props.id, line.endLine.props.id];
            const [p1, p2] = [this.props.dag.get(id1), this.props.dag.get(id2)];
            if (!p1 || !p2) {
                return;
            }

            let node1 = (p1).node!;
            let node2 = (p2).node!;
            oldPos = pos;

            node1.position({ x: node1.x() + dx, y: node1.y() + dy });
            node2.position({ x: node2.x() + dx, y: node2.y() + dy });
            this.updateAndPropagateBatch([p1.id, p2.id], this.computeUpdateFor);
        });

        l.on('dragend', (e) => {
            if (this.props.mode !== 'edit') {
                return;
            }

            e.cancelBubble = true;
            this.props.pushHistory(this.props.getSnapshot());
        });

        return l;
    };

    private drawSegment = (segment: Segment) => {
        const props = segment.props;
        const screenPosStart = utils.convertToScreenCoords(
            { x: segment.startSegment.x, y: segment.startSegment.y }, { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
            this.props.geometryState.spacing
        );

        const screenPosEnd = utils.convertToScreenCoords(
            { x: segment.endSegment.x, y: segment.endSegment.y }, { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
            this.props.geometryState.spacing
        );

        const scale = (this.layerMathObjectRef.current!.scaleX() ?? 1);
        const scaledStrokeWidth = props.line_size / scale;

        const s = new Konva.Line({
            points: [
                screenPosStart.x,
                screenPosStart.y,
                screenPosEnd.x,
                screenPosEnd.y
            ],
            dash: utils.createDashArray(props.line_style),
            strokeWidth: scaledStrokeWidth,
            stroke: props.color,
            visible: props.visible.shape,
            id: props.id,
            hitStrokeWidth: 5,
            draggable: true,

        });

        s.visible(props.visible.shape);

        s.on('mousedown', (e) => {
            if (this.props.mode !== 'delete') {
                return;
            }

            e.cancelBubble = true;
            if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(segment.props.id));
                if (label) {
                    label.destroy();
                }
            }

            this.props.onRemoveNode(s.id());
            this.props.pushHistory(this.props.getSnapshot());
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

            oldPos = this.props.stageRef.current!.getPointerPosition() ?? oldPos;
            this.props.pushHistory(this.props.getSnapshot());
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
            const pos = this.props.stageRef.current!.getPointerPosition();
            if (!pos) return;

            let dx = pos.x - oldPos.x;
            let dy = pos.y - oldPos.y;

            let [id1, id2] = [segment.startSegment.props.id, segment.endSegment.props.id];
            const [p1, p2] = [this.props.dag.get(id1), this.props.dag.get(id2)];
            if (!p1 || !p2) {
                return;
            }

            let node1 = (p1).node!;
            let node2 = (p2).node!;
            oldPos = pos;

            node1.position({ x: node1.x() + dx, y: node1.y() + dy });
            node2.position({ x: node2.x() + dx, y: node2.y() + dy });
            this.updateAndPropagateBatch([p1.id, p2.id], this.computeUpdateFor);
        });

        s.on('dragend', (e) => {
            if (this.props.mode !== 'edit') {
                return;
            }

            e.cancelBubble = true;
            this.props.pushHistory(this.props.getSnapshot());
        });

        return s;
    };

    private drawVector = (vector: Vector) => {
        const props = vector.props;
        const screenPosStart = utils.convertToScreenCoords(
            { x: vector.startVector.x, y: vector.startVector.y }, { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
            this.props.geometryState.spacing
        );

        const screenPosEnd = utils.convertToScreenCoords(
            { x: vector.endVector.x, y: vector.endVector.y }, { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
            this.props.geometryState.spacing
        );

        const scale = (this.layerMathObjectRef.current!.scaleX() ?? 1);
        const scaledStrokeWidth = props.line_size / scale;

        const v = new Konva.Arrow({
            points: [
                screenPosStart.x,
                screenPosStart.y,
                screenPosEnd.x,
                screenPosEnd.y
            ],
            dash: utils.createDashArray(props.line_style),
            strokeWidth: scaledStrokeWidth,
            pointerWidth: constants.ARROW_DEFAULTS.POINTER_WIDTH,
            pointerLength: constants.ARROW_DEFAULTS.POINTER_LENGTH,
            stroke: props.color,
            visible: props.visible.shape,
            id: props.id,
            hitStrokeWidth: 5,
            draggable: true,
            fill: props.fill ? props.color : 'none',

        });

        v.visible(props.visible.shape);

        v.on('mousedown', (e) => {
            if (this.props.mode !== 'delete') {
                return;
            }

            e.cancelBubble = true;
            if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(vector.props.id));
                if (label) {
                    label.destroy();
                }
            }

            this.props.onRemoveNode(v.id());
            this.props.pushHistory(this.props.getSnapshot());
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

            oldPos = this.props.stageRef.current!.getPointerPosition() ?? oldPos;
            this.props.pushHistory(this.props.getSnapshot());
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
            const pos = this.props.stageRef.current!.getPointerPosition();
            if (!pos) return;
            let dx = pos.x - oldPos.x;
            let dy = pos.y - oldPos.y;

            let [id1, id2] = [vector.startVector.props.id, vector.endVector.props.id];
            const [p1, p2] = [this.props.dag.get(id1), this.props.dag.get(id2)];
            if (!p1 || !p2) {
                return;
            }

            let node1 = (p1).node!;
            let node2 = (p2).node!;
            oldPos = pos;

            node1.position({ x: node1.x() + dx, y: node1.y() + dy });
            node2.position({ x: node2.x() + dx, y: node2.y() + dy });
            this.updateAndPropagateBatch([p1.id, p2.id], this.computeUpdateFor);
        });

        v.on('dragend', (e) => {
            if (this.props.mode !== 'edit') {
                return;
            }

            e.cancelBubble = true;
            this.props.pushHistory(this.props.getSnapshot());
        });

        return v;
    };

    private drawCircle = (circle: Circle) => {
        const props = circle.props;
        const screenPos = utils.convertToScreenCoords(
            { x: circle.centerC.x, y: circle.centerC.y }, { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
            this.props.geometryState.spacing
        );
        const scale = (this.layerMathObjectRef.current!.scaleX() ?? 1);
        const scaledStrokeWidth = props.line_size / scale;

        const c = new Konva.Circle({
            x: screenPos.x,
            y: screenPos.y,
            radius: circle.radius * this.props.geometryState.spacing,
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
            if (this.props.mode !== 'delete') {
                return;
            }

            e.cancelBubble = true;
            if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(circle.props.id));
                if (label) {
                    label.destroy();
                }
            }

            this.props.onRemoveNode(c.id());
            this.props.pushHistory(this.props.getSnapshot());
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

            oldPos = this.props.stageRef.current!.getPointerPosition() ?? oldPos;
            this.props.pushHistory(this.props.getSnapshot());
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
            const pos = this.props.stageRef.current!.getPointerPosition();
            if (!pos) return;
            let dx = pos.x - oldPos.x;
            let dy = pos.y - oldPos.y;

            let id = circle.centerC.props.id;
            const p = this.props.dag.get(id);
            if (!p) {
                return;
            }

            let node = p.node!;
            oldPos = pos;

            node.position({ x: node.x() + dx, y: node.y() + dy });
            this.updateAndPropagateBatch([p.id], this.computeUpdateFor);
        });

        c.on('dragend', (e) => {
            if (this.props.mode !== 'edit') {
                return;
            }

            e.cancelBubble = true;
            this.props.pushHistory(this.props.getSnapshot());
        });

        return c;
    };

    private drawPolygon = (polygon: Polygon) => {
        const props = polygon.props
        const points = polygon.points.flatMap(point => {
            const screenPos = utils.convertToScreenCoords(
                { x: point.x, y: point.y }, { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            return [screenPos.x, screenPos.y];
        });

        const opacity = props.opacity ?? 0.1;
        const [r, g, b] = utils.convert2RGB(props.color);

        const scale = (this.layerMathObjectRef.current!.scaleX() ?? 1);
        const scaledStrokeWidth = props.line_size / scale;

        const p = new Konva.Line({
            points: points,
            fill: `rgba(${r},${g},${b},${opacity})`,
            dash: utils.createDashArray(props.line_style),
            strokeWidth: scaledStrokeWidth,
            stroke: props.color,
            closed: true,
            visible: props.visible.shape,
            id: props.id,
            hitStrokeWidth: 5,
            draggable: true
        });

        p.visible(props.visible.shape);

        p.on('mousedown', (e) => {
            if (this.props.mode !== 'delete') {
                return;
            }

            e.cancelBubble = true;
            if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(polygon.props.id));
                if (label) {
                    label.destroy();
                }
            }

            this.props.onRemoveNode(p.id());
            this.props.pushHistory(this.props.getSnapshot());
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

            oldPos = this.props.stageRef.current!.getPointerPosition() ?? oldPos;
            this.props.pushHistory(this.props.getSnapshot());
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
            const pos = this.props.stageRef.current!.getPointerPosition();
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
                shapeNode.push(point);
            }

            shapeNode.forEach(node => {
                let point = node.node!;
                oldPos = pos;

                point.position({ x: point.x() + dx, y: point.y() + dy });
                this.updateAndPropagateBatch([node.id], this.computeUpdateFor);
            })
        });

        p.on('dragend', (e) => {
            if (this.props.mode !== 'edit') {
                return;
            }

            e.cancelBubble = true;
            this.props.pushHistory(this.props.getSnapshot());
        });

        return p;
    };

    private drawRay = (ray: Ray) => {
        const props = ray.props;
        const screenPosStart = utils.convertToScreenCoords(
            { x: ray.startRay.x, y: ray.startRay.y }, { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
            this.props.geometryState.spacing
        );

        const screenPosEnd = utils.convertToScreenCoords(
            { x: ray.endRay.x, y: ray.endRay.y }, { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
            this.props.geometryState.spacing
        );

        const dx = screenPosEnd.x - screenPosStart.x;
        const dy = screenPosEnd.y - screenPosStart.y;

        let norm_dx = dx / Math.sqrt(dx * dx + dy * dy);
        let norm_dy = dy / Math.sqrt(dx * dx + dy * dy);
        let length = 2 * Math.max(this.props.stageRef.current!.width(), this.props.stageRef.current!.height()) * Math.sqrt(dx * dx + dy * dy) / (this.layerMathObjectRef.current!.scaleX() ?? 1);

        const scale = (this.layerMathObjectRef.current!.scaleX() ?? 1);
        const scaledStrokeWidth = props.line_size / scale;

        const r = new Konva.Line({
            points: [
                screenPosStart.x,
                screenPosStart.y,
                screenPosStart.x + length * norm_dx,
                screenPosStart.y + length * norm_dy
            ],
            dash: utils.createDashArray(props.line_style),
            strokeWidth: scaledStrokeWidth,
            stroke: props.color,
            visible: props.visible.shape,
            id: props.id,
            hitStrokeWidth: 5,
            draggable: true,
        });

        r.visible(props.visible.shape);

        r.on('mousedown', (e) => {
            if (this.props.mode !== 'delete') {
                return;
            }

            e.cancelBubble = true;
            if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(ray.props.id));
                if (label) {
                    label.destroy();
                }
            }

            this.props.onRemoveNode(r.id());
            this.props.pushHistory(this.props.getSnapshot());
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

            oldPos = this.props.stageRef.current!.getPointerPosition() ?? oldPos;
            this.props.pushHistory(this.props.getSnapshot());
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
            const pos = this.props.stageRef.current!.getPointerPosition();
            if (!pos) return;
            let dx = pos.x - oldPos.x;
            let dy = pos.y - oldPos.y;

            let [id1, id2] = [ray.startRay.props.id, ray.endRay.props.id];
            const [p1, p2] = [this.props.dag.get(id1), this.props.dag.get(id2)];
            if (!p1 || !p2) {
                return;
            }

            let node1 = (p1).node!;
            let node2 = (p2).node!;
            oldPos = pos;

            node1.position({ x: node1.x() + dx, y: node1.y() + dy });
            node2.position({ x: node2.x() + dx, y: node2.y() + dy });
            this.updateAndPropagateBatch([p1.id, p2.id], this.computeUpdateFor);
        });

        r.on('dragend', (e) => {
            if (this.props.mode !== 'edit') {
                return;
            }

            e.cancelBubble = true;
            this.props.pushHistory(this.props.getSnapshot());
        });

        return r;
    };

    private drawAngle = (shape: Angle): Konva.Shape => {
        const props = shape.props;
        const screenPos = utils.convertToScreenCoords(
            { x: (shape.vertex ? shape.vertex.x : 0), y: (shape.vertex ? shape.vertex.y : 0) }, { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
            this.props.geometryState.spacing
        );

        const opacity = props.opacity ?? 0.5;
        const [r, g, b] = utils.convert2RGB(props.color);
        const scale = (this.layerMathObjectRef.current!.scaleX() ?? 1);
        const scaledStrokeWidth = props.line_size / scale;
        const angle = (x: number, y: number): number => {
            let degree = Math.atan2(y, x) * 180 / Math.PI;
            if (degree < 0) {
                degree += 360;
            }

            return degree;
        }

        const startAngle = angle(
            shape.vector1.endVector.x - shape.vector1.startVector.x,
            shape.vector1.endVector.y - shape.vector1.startVector.y,
        )

        const endAngle = angle(
            shape.vector2.endVector.x - shape.vector2.startVector.x,
            shape.vector2.endVector.y - shape.vector2.startVector.y,
        )

        let degree = endAngle - startAngle;
        if (shape.range && shape.range[1] === 180) {
            degree = (degree < 0 ? 180 + degree : degree);
        }

        let a = (Math.abs(Math.abs(degree) - 90) > constants.EPSILON) ? new Konva.Shape({
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
            x: screenPos.x,
            y: screenPos.y,
            radius: 10,
            startAngle: -startAngle,
            angle: degree,
            fill: `rgba(${r},${g},${b},${opacity})`,
            stroke: props.color,
            strokeWidth: scaledStrokeWidth,
            hitStrokeWidth: 5,
            id: shape.props.id
        }) : new Konva.Line({
            x: screenPos.x,
            y: screenPos.y,
            points: [
                0, 0,
                10 / this.props.geometryState.zoom_level, 0,
                10 / this.props.geometryState.zoom_level, -10 / this.props.geometryState.zoom_level,
                0, -10 / this.props.geometryState.zoom_level
            ],

            fill: `rgba(${r},${g},${b},${opacity})`,
            strokeWidth: scaledStrokeWidth,
            stroke: props.color,
            closed: true,
            visible: props.visible.shape,
            id: props.id,
            hitStrokeWidth: 5,
            draggable: false,
            rotation: -startAngle,
        })

        a.visible(props.visible.shape && degree !== 0);

        a.on('mousedown', (e) => {
            if (this.props.mode !== 'delete') {
                return;
            }

            e.cancelBubble = true;
            if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(shape.props.id));
                if (label) {
                    label.destroy();
                }
            }

            this.props.onRemoveNode(a.id());
            this.props.pushHistory(this.props.getSnapshot());
        })

        return a;
    }

    private drawSemiCircle = (semicircle: SemiCircle): Konva.Shape => {
        const props = semicircle.props;
        const scale = (this.layerMathObjectRef.current!.scaleX() ?? 1);
        const scaledStrokeWidth = props.line_size / scale;
        const radius = (math.parse('sqrt(x^2 + y^2)').evaluate({ x: semicircle.start.x - semicircle.end.x, y: semicircle.start.y - semicircle.end.y })) / 2

        const screenPosStart = utils.convertToScreenCoords(
            { x: semicircle.start.x, y: semicircle.start.y }, { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
            this.props.geometryState.spacing
        );

        const screenPosEnd = utils.convertToScreenCoords(
            { x: semicircle.end.x, y: semicircle.end.y }, { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
            this.props.geometryState.spacing
        );

        const semiCircle = new Konva.Arc({
            x: (screenPosStart.x + screenPosEnd.x) / 2,
            y: (screenPosStart.y + screenPosEnd.y) / 2,
            innerRadius: radius,
            outerRadius: radius,
            angle: 180,
            rotation: utils.cleanAngle((math.parse('atan2(y, x)').evaluate({ x: screenPosEnd.x - screenPosStart.x, y: screenPosEnd.y - screenPosStart.y })) * 180 / Math.PI),
            stroke: props.color,
            strokeWidth: scaledStrokeWidth,
            dash: utils.createDashArray(props.line_style),
            id: props.id,
            hitStrokeWidth: 5,
            draggable: true,
            clockwise: true
        })

        semiCircle.visible(props.visible.shape);

        semiCircle.on('mousedown', (e) => {
            if (this.props.mode !== 'delete') {
                return;
            }

            e.cancelBubble = true;
            if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(semicircle.props.id));
                if (label) {
                    label.destroy();
                }
            }

            this.props.onRemoveNode(semiCircle.id());
            this.props.pushHistory(this.props.getSnapshot());
        })

        let oldPos = {
            x: 0,
            y: 0
        }

        semiCircle.on('dragstart', (e) => {
            if (this.props.mode !== "edit") {
                return;
            }

            e.cancelBubble = true;
            let stage = e.target.getStage();
            if (stage) {
                stage.container().style.cursor = 'pointer';
            }

            oldPos = this.props.stageRef.current!.getPointerPosition() ?? oldPos;
            this.props.pushHistory(this.props.getSnapshot());
        })

        semiCircle.on('dragmove', (e) => {
            if (this.props.mode !== "edit") {
                return;
            }

            e.cancelBubble = true;
            let stage = e.target.getStage();
            if (stage) {
                stage.container().style.cursor = 'pointer';
            }

            e.target.position({ x: 0, y: 0 });
            const pos = this.props.stageRef.current!.getPointerPosition();
            if (!pos) return;
            let dx = pos.x - oldPos.x;
            let dy = pos.y - oldPos.y;

            let [id1, id2] = [semicircle.start.props.id, semicircle.end.props.id];
            const [p1, p2] = [this.props.dag.get(id1), this.props.dag.get(id2)];
            if (!p1 || !p2) {
                return;
            }

            let node1 = (p1).node!;
            let node2 = (p2).node!;
            oldPos = pos;

            node1.position({ x: node1.x() + dx, y: node1.y() + dy });
            node2.position({ x: node2.x() + dx, y: node2.y() + dy });
            this.updateAndPropagateBatch([p1.id, p2.id], this.computeUpdateFor);
        });

        semiCircle.on('dragend', (e) => {
            if (this.props.mode !== 'edit') {
                return;
            }

            e.cancelBubble = true;
            this.props.pushHistory(this.props.getSnapshot());
        });

        return semiCircle;
    }

    private createLabel = (shapeNode: ShapeNode): Konva.Text => {
        let x = 0, y = 0;
        let shape = shapeNode.type;

        if ('centerC' in shape && 'radius' in shape) {
            let p1 = {
                x: shapeNode.node!.x(),
                y: shapeNode.node!.y() + (shapeNode.node! as Konva.Circle).radius()
            };

            let p2 = {
                x: shapeNode.node!.x(),
                y: shapeNode.node!.y()
            };

            x = (p1.x - p2.x) * Math.cos(5 * Math.PI / 6) + (p1.y - p2.y) * Math.sin(5 * Math.PI / 6) + p2.x
            y = -(p1.x - p2.x) * Math.sin(5 * Math.PI / 6) + (p1.y - p2.y) * Math.cos(5 * Math.PI / 6) + p2.y
        }

        else if ('start' in shape && 'end' in shape) {
            let p1 = {
                x: shapeNode.node!.x(),
                y: shapeNode.node!.y() + (shapeNode.node! as Konva.Arc).outerRadius()
            };

            let p2 = {
                x: shapeNode.node!.x(),
                y: shapeNode.node!.y()
            };

            x = (p2.x - p1.x) * Math.cos(Math.PI / 6) - (p2.y - p1.y) * Math.sin(Math.PI / 6) + p2.x
            y = (p2.x - p1.x) * Math.sin(Math.PI / 6) + (p2.y - p1.y) * Math.cos(Math.PI / 6) + p2.y
        }

        else if ('startSegment' in shape || 'startLine' in shape || 'startRay' in shape || 'startVector' in shape) {
            let [p1_x, p1_y] = [(shapeNode.node! as Konva.Line).points()[0], (shapeNode.node! as Konva.Line).points()[1]];
            let [p2_x, p2_y] = [(shapeNode.node! as Konva.Line).points()[2], (shapeNode.node! as Konva.Line).points()[3]];

            x = (p1_x + p2_x) / 2;
            y = (p1_y + p2_y) / 2;
        }

        else if ('points' in shape) {
            let points = (shapeNode.node! as Konva.Line).points();
            for (let i = 0; i < points.length; i += 2) {
                let xP = points[i], yP = points[i + 1];
                x += xP;
                y += yP
            }

            x /= (shape as Polygon).points.length;
            y /= (shape as Polygon).points.length;
        }

        else if ('vector1' in shape && 'vector2' in shape) {
            x = shapeNode.node!.x();
            y = shapeNode.node!.y();
        }

        else {
            x = shapeNode.node!.x();
            y = shapeNode.node!.y() + (shapeNode.node! as Konva.Circle).radius();
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
            const angle = (x: number, y: number): number => {
                let degree = (math.parse('atan2(y, x)').evaluate({ x: x, y: y })) * 180 / Math.PI;
                if (degree < 0) {
                    degree += 360;
                }

                return degree;
            }

            const startAngle = angle(
                (shape as Angle).vector1.endVector.x - (shape as Angle).vector1.startVector.x,
                (shape as Angle).vector1.endVector.y - (shape as Angle).vector1.startVector.y,
            );

            const endAngle = angle(
                (shape as Angle).vector2.endVector.x - (shape as Angle).vector2.startVector.x,
                (shape as Angle).vector2.endVector.y - (shape as Angle).vector2.startVector.y,
            )

            const degree = endAngle - startAngle;
            text.visible(shape.props.visible.shape && shape.props.visible.label && degree !== 0);
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

            this.props.pushHistory(this.props.getSnapshot());
        });

        text.on('dragmove', (e) => {
            if (this.props.mode !== "edit") return;
            e.cancelBubble = true;

            const pointer = this.props.stageRef.current!.getPointerPosition();
            if (!pointer) return;

            // Compute screen-space position of the object's center
            let shapeX = 0, shapeY = 0;
            const scale = this.layerMathObjectRef.current!.scaleX() ?? 1;
            const offset = this.layerMathObjectRef.current!.position();

            if ('centerC' in shape && 'radius' in shape) {
                shapeX = shapeNode.node!.x();
                shapeY = shapeNode.node!.y();
            }

            else if ('startSegment' in shape || 'startLine' in shape || 'startRay' in shape || 'startVector' in shape) {
                const pts = (shapeNode.node! as Konva.Line).points();
                shapeX = (pts[0] + pts[2]) / 2;
                shapeY = (pts[1] + pts[3]) / 2;
            }

            else if ('points' in shape) {
                const pts = (shapeNode.node! as Konva.Line).points();
                for (let i = 0; i < pts.length; i += 2) {
                    shapeX += pts[i];
                    shapeY += pts[i + 1];
                }

                shapeX /= pts.length / 2;
                shapeY /= pts.length / 2;
            }

            else {
                shapeX = shapeNode.node!.x();
                shapeY = shapeNode.node!.y();
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

            if ('centerC' in shape && 'radius' in shape) {
                shapeX = shapeNode.node!.x();
                shapeY = shapeNode.node!.y();
            }

            else if ('startSegment' in shape || 'startLine' in shape || 'startRay' in shape || 'startVector' in shape) {
                const pts = (shapeNode.node! as Konva.Line).points();
                shapeX = (pts[0] + pts[2]) / 2;
                shapeY = (pts[1] + pts[3]) / 2;
            }

            else if ('points' in shape) {
                const pts = (shapeNode.node! as Konva.Line).points();
                for (let i = 0; i < pts.length; i += 2) {
                    shapeX += pts[i];
                    shapeY += pts[i + 1];
                }

                shapeX /= pts.length / 2;
                shapeY /= pts.length / 2;
            }

            else {
                shapeX = shapeNode.node!.x();
                shapeY = shapeNode.node!.y();
            }

            const labelX = text.x();
            const labelY = text.y();

            const shapeScreenX = shapeX * scale + offset.x;
            const shapeScreenY = shapeY * scale + offset.y;

            shape.props.labelXOffset = labelX - shapeScreenX;
            shape.props.labelYOffset = labelY - shapeScreenY;

            this.props.pushHistory(this.props.getSnapshot());
        });

        return text;
    }

    private createKonvaShape = (shape: Shape): Konva.Shape => {
        let konvaShape: Konva.Shape;
        if ('x' in shape && 'y' in shape) {
            konvaShape = this.drawPoint(shape as Point);
        }

        else if ('startLine' in shape) {
            konvaShape = this.drawLine(shape as Line);
        }

        else if ('startSegment' in shape) {
            konvaShape = this.drawSegment(shape as Segment);
        }

        else if ('startVector' in shape) {
            konvaShape = this.drawVector(shape as Vector);
        }

        else if ('startRay' in shape) {
            konvaShape = this.drawRay(shape as Ray);
        }

        else if ('points' in shape) {
            konvaShape = this.drawPolygon(shape as Polygon);
        }

        else if ('centerC' in shape && 'radius' in shape) {
            konvaShape = this.drawCircle(shape as Circle);
        }

        else if ('start' in shape && 'end' in shape) {
            konvaShape = this.drawSemiCircle(shape as SemiCircle);
        }

        else {
            konvaShape = this.drawAngle(shape as Angle);
        }

        if (shape.type === 'Translation' || shape.type === 'Projection' || shape.type === 'Reflection' ||
            shape.type === 'Rotation' || shape.type === 'Enlarge'
        ) {
            konvaShape.draggable(false);
        }

        return konvaShape;
    }

    private handleDrawing = (): void => {
        const DAG = utils.cloneDAG(this.props.dag);
        if (['segment', 'line', 'ray', 'vector'].includes(this.props.mode)) {
            const selectedPoints = [...this.props.selectedPoints];
            if (selectedPoints.length === 1) return;
            let [p1, p2] = selectedPoints;
            if (p1 === p2) {
                selectedPoints.pop();
                this.props.onSelectedPointsChange(selectedPoints);
                return;
            }

            let index = 0;
            let label = `${this.props.mode}${index}`;
            while (this.props.labelUsed.includes(label)) {
                index++;
                label = `${this.props.mode}${index}`;
            }

            this.props.onLabelUsed([...this.props.labelUsed, label]);
            switch (this.props.mode) {
                case 'vector': {
                    const vector: Vector = {
                        startVector: p1,
                        endVector: p2,
                        props: utils.createVectorDefaultShapeProps(label, 0, 0, 10, 0),
                        type: 'Vector'
                    }

                    let shapeNode: ShapeNode = {
                        id: vector.props.id,
                        type: vector,
                        node: this.createKonvaShape(vector),
                        dependsOn: [p1.props.id, p2.props.id],
                        defined: true,
                        isSelected: false
                    }


                    DAG.set(vector.props.id, shapeNode);
                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: { ...this.props.geometryState },
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
                        isSelected: false
                    };



                    DAG.set(line.props.id, shapeNode);
                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: { ...this.props.geometryState },
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
                        isSelected: false
                    };


                    DAG.set(ray.props.id, shapeNode);
                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: { ...this.props.geometryState },
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
                        isSelected: false
                    };


                    DAG.set(segment.props.id, shapeNode);
                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: { ...this.props.geometryState },
                        dag: DAG,
                        selectedPoints: [],
                        selectedShapes: []
                    });

                    break;
                }
            }
        }

        else if (this.props.mode === 'circle') {
            const selectedPoints = [...this.props.selectedPoints];
            if (selectedPoints.length !== 1) return;

            const point = selectedPoints[0];
            const radius = this.props.data.radius;
            if (radius === undefined || typeof radius === 'string' || radius <= 0) {
                this.props.onRenderDialogbox(this.props.mode);
                return;
            }

            let label = `circle0`
            let index = 0;
            while (this.props.labelUsed.includes(label)) {
                index++;
                label = `circle${index}`;
            }

            this.props.onLabelUsed([...this.props.labelUsed, label]);
            const circle: Circle = Factory.createCircle(
                utils.createCircleDefaultShapeProps(label, radius, 0, 10, 0),
                point,
                radius
            )

            let shapeNode: ShapeNode = {
                id: circle.props.id,
                type: circle,
                node: this.createKonvaShape(circle),
                dependsOn: [point.props.id],
                defined: true,
                isSelected: false
            }

            DAG.set(circle.props.id, shapeNode);
            this.props.onUpdateLastFailedState();
            this.props.onUpdateAll({
                gs: { ...this.props.geometryState },
                dag: DAG,
                selectedPoints: [],
                selectedShapes: []
            });
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
                    const labelUsed = [...this.props.labelUsed];
                    let index = 1;
                    let label: string = `poly${index}`;
                    while (labelUsed.includes(label)) {
                        index += 1;
                        label = `poly${index}`;
                    }

                    labelUsed.push(label);
                    const polygon: Polygon = Factory.createPolygon(
                        utils.createPolygonDefaultShapeProps(label),
                        selectedPoints
                    )

                    let dependencies: string[] = [];
                    dependencies = selectedPoints.map(point => point.props.id);

                    for (let i = 0; i < selectedPoints.length; i++) {
                        let p = selectedPoints[i];
                        let pNext = selectedPoints[(i + 1) % selectedPoints.length];
                        let label = `segment0`
                        let index = 0;
                        while (labelUsed.includes(label)) {
                            index++;
                            label = `segment${index}`;
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
                            isSelected: false
                        }

                        DAG.set(segment.props.id, shapeNode);
                    }

                    let shapeNode: ShapeNode = {
                        id: polygon.props.id,
                        type: polygon,
                        node: this.createKonvaShape(polygon),
                        dependsOn: dependencies,
                        defined: true,
                        isSelected: false
                    }

                    DAG.set(polygon.props.id, shapeNode);
                    this.props.onLabelUsed(labelUsed);
                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: { ...this.props.geometryState },
                        dag: DAG,
                        selectedPoints: [],
                        selectedShapes: []
                    });
                }
            }
        }

        else if (this.props.mode === 'angle') {
            const [selectedPoints, selectedShapes] = [[...this.props.selectedPoints], [...this.props.selectedShapes]];
            const data = this.props.data.radius;
            if (data === undefined || (data !== undefined && typeof data !== 'string')) {
                this.props.onRenderDialogbox(this.props.mode);
                return
            }

            const range: [number, number] = (data === "0to180" ? [0, 180] : [0, 360]);
            if (selectedPoints.length === 0) {
                if (selectedShapes.length !== 2) return;
                if (!(selectedShapes[0].props.id.includes('line-')) || !(selectedShapes[1].props.id.includes('line-'))) {
                    this.props.onUpdateLastFailedState();
                    this.props.onSelectedChange({
                        selectedShapes: [],
                        selectedPoints: []
                    })

                    return;
                }

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

                let label = utils.getAngleLabel(0);
                let idx = 0;
                while (this.props.labelUsed.includes(label)) {
                    idx++;
                    label = utils.getAngleLabel(idx);
                }

                this.props.onLabelUsed([...this.props.labelUsed, label]);

                let a = Factory.createAngle(
                    utils.createAngleDefaultShapeProps(`${label}`),
                    Factory.createVector(
                        utils.createVectorDefaultShapeProps(''),
                        Factory.createPoint(
                            utils.createPointDefaultShapeProps(''),
                            start1.x, start1.y, (start1.z ?? 0)
                        ),
                        Factory.createPoint(
                            utils.createPointDefaultShapeProps(''),
                            end1.x, end1.y, (end1.z ?? 0)
                        )
                    ),
                    Factory.createVector(
                        utils.createVectorDefaultShapeProps(''),
                        Factory.createPoint(
                            utils.createPointDefaultShapeProps(''),
                            start2.x, start2.y, (start2.z ?? 0)
                        ),
                        Factory.createPoint(
                            utils.createPointDefaultShapeProps(''),
                            end2.x, end2.y, (end2.z ?? 0)
                        )
                    ),
                    range,
                    tmpVertex
                )


                let shapeNode: ShapeNode = {
                    id: a.props.id,
                    dependsOn: [selectedShapes[0].props.id, selectedShapes[1].props.id],
                    type: a,
                    node: this.createKonvaShape(a),
                    defined: vertex[0].coors !== undefined && vertex[0].ambiguous === false,
                    isSelected: false
                }

                DAG.set(a.props.id, shapeNode);
                this.props.onUpdateLastFailedState();
                this.props.onUpdateAll({
                    gs: { ...this.props.geometryState },
                    dag: DAG,
                    selectedPoints: [],
                    selectedShapes: []
                });
            }

            else {
                if (selectedPoints.length !== 3) {
                    if (selectedShapes.length > 0) {
                        this.props.onUpdateLastFailedState();
                        this.props.onSelectedChange({
                            selectedShapes: [],
                            selectedPoints: []
                        });
                    }

                    return;
                }

                let [point1, point2, point3] = [
                    selectedPoints[0],
                    selectedPoints[1],
                    selectedPoints[2],
                ]

                if (point3 === point1) {
                    this.props.onUpdateLastFailedState({
                        selectedPoints: selectedPoints,
                        selectedShapes: selectedShapes
                    });

                    selectedPoints.splice(0, 1);
                    selectedPoints.pop();
                    this.props.onUpdateAll({
                        gs: this.props.geometryState,
                        dag: DAG,
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
                    this.props.onUpdateAll({
                        gs: this.props.geometryState,
                        dag: DAG,
                        selectedPoints: selectedPoints,
                        selectedShapes: selectedShapes
                    });

                    return;
                }

                let label = utils.getAngleLabel(0);
                let idx = 0;
                while (this.props.labelUsed.includes(label)) {
                    idx++;
                    label = utils.getAngleLabel(idx);
                }

                this.props.onLabelUsed([...this.props.labelUsed, label]);

                let a = Factory.createAngle(
                    utils.createAngleDefaultShapeProps(`${label}`),
                    Factory.createVector(
                        utils.createVectorDefaultShapeProps(''),
                        point2,
                        point1
                    ),
                    Factory.createVector(
                        utils.createVectorDefaultShapeProps(''),
                        point2,
                        point3
                    ),
                    range,
                    point2
                )


                let shapeNode: ShapeNode = {
                    id: a.props.id,
                    dependsOn: [selectedPoints[0].props.id, selectedPoints[1].props.id, selectedPoints[2].props.id],
                    type: a,
                    node: this.createKonvaShape(a),
                    defined: true,
                    isSelected: false
                };


                DAG.set(a.props.id, shapeNode);

                this.props.onUpdateLastFailedState();
                this.props.onUpdateAll({
                    gs: { ...this.props.geometryState },
                    dag: DAG,
                    selectedPoints: [],
                    selectedShapes: []
                });
            }
        }

        else if (this.props.mode === 'length') {
            let perimeter: number = 0;
            let label: string = "";
            const selectedShapes = [...this.props.selectedShapes];
            const selectedPoints = [...this.props.selectedPoints];
            const pos = utils.convertToCustomCoords(
                this.last_pointer, {x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            let x = pos.x, y = pos.y;
            let scaleFactor: number | undefined = undefined;
            let rotationFactor: { degree: number, CCW: boolean } | undefined = undefined;

            if (selectedShapes.length === 1 && selectedPoints.length === 0) {
                let shape = selectedShapes[0];
                if ('startSegment' in shape) {
                    shape = shape as Segment;
                    const point = operation.point_projection(
                        Factory.createPoint(
                            utils.createPointDefaultShapeProps(''),
                            x, y
                        ),
                        shape
                    );

                    scaleFactor = utils.projectPointOntoLineSegment (
                        { x: point.x, y: point.y }, 
                        { x: shape.startSegment.x, y: shape.startSegment.y },
                        { x: shape.endSegment.x, y: shape.endSegment.y }
                    );
                    
                    label = `Length of ${shape.props.label} = `
                }

                else if ('points' in shape) {
                    shape = shape as Polygon;
                    let base: { x: number, y: number } = { x: 0, y: 0 };
                    shape.points.forEach(pt => {
                        base.x += pt.x
                        base.y += pt.y
                    });

                    base.x /= shape.points.length;
                    base.y /= shape.points.length;
                    rotationFactor = {
                        degree: utils.cleanAngle((math.parse('atan2(y, x)').evaluate({x: x - base.x, y: y - base.y})) * 180 / Math.PI),
                        CCW: true
                    }

                    scaleFactor = Math.sqrt((base.x - x) ** 2 + (base.y - y) ** 2);
                    label = `Perimeter of ${shape.props.label} = `
                }

                else if ('radius' in shape) {
                    shape = shape as Circle;
                    rotationFactor = {
                        degree: utils.cleanAngle((math.parse('atan2(y, x)').evaluate({x: x - shape.centerC.x, y: y - shape.centerC.y})) * 180 / Math.PI),
                        CCW: true
                    }

                    label = `Perimeter of ${shape.props.label} = `
                }

                else if ('start' in shape && 'end' in shape) {
                    shape = shape as SemiCircle;
                    const center: {x: number, y: number} = {
                        x: (shape.start.x + shape.end.x) / 2,
                        y: (shape.start.y + shape.end.y) / 2
                    }

                    rotationFactor = {
                        degree: utils.cleanAngle((math.parse('atan2(y, x)').evaluate({x: center.x - x, y: center.y - y})) * 180 / Math.PI),
                        CCW: true
                    }

                    label = `Arc length of ${shape.props.label} = `
                }

                else return;
                perimeter = operation.getLength(shape);
            }

            else if (selectedShapes.length === 1 && selectedPoints.length === 1) {
                if (!selectedShapes[0].props.id.includes('line-')) {
                    this.props.onUpdateLastFailedState();
                    this.props.onSelectedChange({
                        selectedShapes: [],
                        selectedPoints: []
                    })

                    return;
                }

                let line = selectedShapes[0];
                let point = selectedPoints[0];
                let [start, end] = operation.getStartAndEnd(line);
                let n = {
                    x: start.y - end.y,
                    y: end.x - start.x
                }

                perimeter = Math.abs(n.x * point.x + n.y * point.y - (n.x * start.x + n.y * start.y)) / math.parse('sqrt(x^2 + y^2)').evaluate({ x: n.x, y: n.y });
                label = `${selectedShapes[0].props.label}${selectedShapes[1].props.label} = `
                let projectedPoint = operation.point_projection(point, line);
                x = (point.x + projectedPoint.x) / 2;
                y = (point.y + projectedPoint.y) / 2;
            }

            else if (selectedPoints.length === 2) {
                perimeter = operation.getDistance(selectedPoints[0], selectedPoints[1]);
                label = `${selectedPoints[0].props.label}${selectedPoints[1].props.label} = `
                x = (selectedPoints[0].x + selectedPoints[1].x) / 2;
                y = (selectedPoints[0].y + selectedPoints[1].y) / 2;
            }

            else {
                this.props.onUpdateLastFailedState();
                this.props.onSelectedChange({
                    selectedShapes: [],
                    selectedPoints: []
                })

                return;
            }

            label = `${label}${perimeter.toFixed(2)}`;
            let tmpPoint = Factory.createPoint(
                utils.createPointDefaultShapeProps(label),
                x,
                y
            );

            tmpPoint.props.visible.shape = false;

            tmpPoint.type = (selectedPoints.length > 0 ? 'Midpoint' : 'Point');
            let dependencies: string[] = [];
            selectedShapes.forEach(shape => {
                dependencies.push(shape.props.id)
            });

            selectedPoints.forEach(point => {
                dependencies.push(point.props.id)
            });

            let tmpShapeNode: ShapeNode = {
                id: `tmpPoint-${tmpPoint.props.id}`,
                dependsOn: dependencies,
                node: this.createKonvaShape(tmpPoint),
                type: tmpPoint,
                defined: true,
                isSelected: false,
                scaleFactor: scaleFactor,
                rotationFactor: rotationFactor
            }

            tmpShapeNode.node!.hide();
            DAG.set(tmpShapeNode.id, tmpShapeNode);
            this.props.onUpdateLastFailedState();
            this.props.onUpdateAll({
                gs: { ...this.props.geometryState },
                dag: DAG,
                selectedPoints: [],
                selectedShapes: []
            });
        }

        else if (this.props.mode === 'area') {
            const selectedShapes = [...this.props.selectedShapes];
            let label: string = "";
            if (selectedShapes.length !== 1) return;
            let shape: Shape = selectedShapes[0] as Shape;
            if (!('points' in shape) && !('radius' in shape)) return;
            let area = ('points' in shape ? (shape as Polygon).area : (shape as Circle).area);
            if (!area) return;
            label = `Area of ${shape.props.label} = ${area.toFixed(2)}`;
            const pos = utils.convertToCustomCoords(
                this.last_pointer, {x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            let scaleFactor: number | undefined = undefined;
            let rotationFactor: { degree: number, CCW: boolean } | undefined = undefined;
            if ('points' in shape) {
                shape = shape as Polygon;
                let base: { x: number, y: number } = { x: 0, y: 0 };
                shape.points.forEach(pt => {
                    base.x += pt.x
                    base.y += pt.y
                });

                base.x /= shape.points.length;
                base.y /= shape.points.length;
                rotationFactor = {
                    degree: utils.cleanAngle((math.parse('atan2(y, x)').evaluate({x: pos.x - base.x, y: pos.y - base.y})) * 180 / Math.PI),
                    CCW: true
                }

                scaleFactor = Math.sqrt((base.x - pos.x) ** 2 + (base.y - pos.y) ** 2);
            }
        
            else if ('radius' in shape) {
                shape = shape as Circle;
                rotationFactor = {
                    degree: utils.cleanAngle((math.parse('atan2(y, x)').evaluate({x: pos.x - shape.centerC.x, y: pos.y - shape.centerC.y})) * 180 / Math.PI),
                    CCW: true
                }
            }

            let tmpPoint = Factory.createPoint(
                utils.createPointDefaultShapeProps(label),
                pos.x, pos.y
            );

            let tmpShapeNode: ShapeNode = {
                id: `tmpPoint-${tmpPoint.props.id}`,
                dependsOn: [selectedShapes[0].props.id],
                node: this.createKonvaShape(tmpPoint),
                type: tmpPoint,
                defined: true,
                isSelected: false,
                scaleFactor: scaleFactor,
                rotationFactor: rotationFactor
            };

            tmpPoint.props.visible.shape = false;
            tmpShapeNode.node!.hide();
            DAG.set(tmpShapeNode.id, tmpShapeNode);
            this.props.onUpdateLastFailedState();
            this.props.onUpdateAll({
                gs: { ...this.props.geometryState },
                dag: DAG,
                selectedPoints: [],
                selectedShapes: []
            });
        }

        else if (this.props.mode === 'intersection') {
            const selectedShapes = [...this.props.selectedShapes];
            if (this.props.selectedPoints.length > 0) {
                this.props.onUpdateLastFailedState();
                this.props.onSelectedChange({
                    selectedShapes: [],
                    selectedPoints: []
                })

                return;
            }

            if (selectedShapes.length === 1) return;
            let intersects = operation.getIntersections2D(selectedShapes[0], selectedShapes[1]);
            const labelUsed = [...this.props.labelUsed];
            intersects.forEach((intersect, idx) => {
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
                    isSelected: false,
                    side: idx === 0 ? 0 : 1
                }

                if (!shapeNode.defined) {
                    pNode.hide();
                }

                DAG.set(point.props.id, shapeNode);
            });

            this.props.onLabelUsed(labelUsed);
            this.props.onUpdateLastFailedState();
            this.props.onUpdateAll({
                gs: { ...this.props.geometryState },
                dag: DAG,
                selectedPoints: [],
                selectedShapes: []
            });
        }

        else if (this.props.mode === 'circle_2_points') {
            const selectedPoints = [...this.props.selectedPoints];
            if (selectedPoints.length !== 2) return;
            let label = `circle0`
            let index = 0;
            while (this.props.labelUsed.includes(label)) {
                index++;
                label = `circle${index}`;
            }

            this.props.onLabelUsed([...this.props.labelUsed, label]);
            const r = operation.getDistance(selectedPoints[0], selectedPoints[1]);
            const circle: Circle = Factory.createCircle(
                utils.createCircleDefaultShapeProps(label, r, 0, 10, 0),
                selectedPoints[0],
                r
            )

            let shapeNode: ShapeNode = {
                id: circle.props.id,
                type: circle,
                node: this.createKonvaShape(circle),
                dependsOn: [selectedPoints[0].props.id, selectedPoints[1].props.id],
                defined: true,
                isSelected: false,
            }

            circle.type = 'Circle2Point';

            DAG.set(circle.props.id, shapeNode);
            this.props.onUpdateLastFailedState();
            this.props.onUpdateAll({
                gs: { ...this.props.geometryState },
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
                        isSelected: false,
                        node: this.createKonvaShape(point),
                        type: point,
                        dependsOn: [(polygon as Polygon).points[0].props.id, (polygon as Polygon).points[1].props.id, (polygon as Polygon).points[2].props.id]
                    };

                    point.type = this.props.mode === 'orthocenter' ? 'Orthocenter' : (this.props.mode === 'centroid' ? 'Centroid' : (this.props.mode === 'incenter' ? 'Incenter' : 'Circumcenter'));
                    shapeNode.node!.draggable(false);
                    DAG.set(point.props.id, shapeNode);
                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: { ...this.props.geometryState },
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
                        isSelected: false,
                        node: this.createKonvaShape(point),
                        type: point,
                        dependsOn: [(polygon as Polygon).points[0].props.id, (polygon as Polygon).points[1].props.id, (polygon as Polygon).points[2].props.id]
                    };

                    point.type = this.props.mode === 'orthocenter' ? 'Orthocenter' : (this.props.mode === 'centroid' ? 'Centroid' : (this.props.mode === 'incenter' ? 'Incenter' : 'Circumcenter'));
                    shapeNode.node!.draggable(false);
                    shapeNode.node!.hide();
                    DAG.set(point.props.id, shapeNode);
                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: { ...this.props.geometryState },
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
                        isSelected: false,
                        node: this.createKonvaShape(point),
                        type: point,
                        dependsOn: [selectedPoints[0].props.id, selectedPoints[1].props.id, selectedPoints[2].props.id]
                    };

                    point.type = this.props.mode === 'orthocenter' ? 'Orthocenter' : (this.props.mode === 'centroid' ? 'Centroid' : (this.props.mode === 'incenter' ? 'Incenter' : 'Circumcenter'));
                    shapeNode.node!.draggable(false);
                    DAG.set(point.props.id, shapeNode);
                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: { ...this.props.geometryState },
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
                        isSelected: false,
                        node: this.createKonvaShape(point),
                        type: point,
                        dependsOn: [selectedPoints[0].props.id, selectedPoints[1].props.id, selectedPoints[2].props.id]
                    };

                    point.type = this.props.mode === 'orthocenter' ? 'Orthocenter' : (this.props.mode === 'centroid' ? 'Centroid' : (this.props.mode === 'incenter' ? 'Incenter' : 'Circumcenter'));
                    shapeNode.node!.draggable(false);
                    shapeNode.node!.hide();
                    DAG.set(point.props.id, shapeNode);
                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: { ...this.props.geometryState },
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
                let label = `circle0`
                let index = 0;
                while (this.props.labelUsed.includes(label)) {
                    index++;
                    label = `circle${index}`;
                }

                this.props.onLabelUsed([...this.props.labelUsed, label]);

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
                        isSelected: false,
                        node: this.createKonvaShape(circle),
                        type: circle,
                        dependsOn: [(polygon as Polygon).points[0].props.id, (polygon as Polygon).points[1].props.id, (polygon as Polygon).points[2].props.id]
                    };

                    circle.type = (this.props.mode === 'incircle' ? 'Incircle' : 'Circumcircle');
                    shapeNode.node!.draggable(false);
                    DAG.set(circle.props.id, shapeNode);
                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: { ...this.props.geometryState },
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
                        isSelected: false,
                        node: this.createKonvaShape(circle),
                        type: circle,
                        dependsOn: [(polygon as Polygon).points[0].props.id, (polygon as Polygon).points[1].props.id, (polygon as Polygon).points[2].props.id]
                    };

                    circle.type = (this.props.mode === 'incircle' ? 'Incircle' : 'Circumcircle');
                    shapeNode.node!.hide();
                    shapeNode.node!.draggable(false);
                    DAG.set(circle.props.id, shapeNode);
                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: { ...this.props.geometryState },
                        dag: DAG,
                        selectedPoints: [],
                        selectedShapes: []
                    });
                }
            }

            else {
                if (selectedPoints.length !== 3) return;
                let label = `circle0`
                let index = 0;
                while (this.props.labelUsed.includes(label)) {
                    index++;
                    label = `circle${index}`;
                }

                this.props.onLabelUsed([...this.props.labelUsed, label]);

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
                        r
                    );

                    let shapeNode: ShapeNode = {
                        id: circle.props.id,
                        defined: true,
                        isSelected: false,
                        node: this.createKonvaShape(circle),
                        type: circle,
                        dependsOn: [selectedPoints[0].props.id, selectedPoints[1].props.id, selectedPoints[2].props.id]
                    };

                    circle.type = (this.props.mode === 'incircle' ? 'Incircle' : 'Circumcircle');
                    shapeNode.node!.draggable(false);
                    DAG.set(circle.props.id, shapeNode);
                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: { ...this.props.geometryState },
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
                        isSelected: false,
                        node: this.createKonvaShape(circle),
                        type: circle,
                        dependsOn: [selectedPoints[0].props.id, selectedPoints[1].props.id, selectedPoints[2].props.id]
                    };

                    circle.type = (this.props.mode === 'incircle' ? 'Incircle' : 'Circumcircle');
                    shapeNode.node!.draggable(false);
                    shapeNode.node!.hide();
                    DAG.set(circle.props.id, shapeNode);
                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: { ...this.props.geometryState },
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

                try {
                    const labelUsed = [...this.props.labelUsed];
                    let p = operation.excenter((polygon as Polygon).points[0], (polygon as Polygon).points[1], (polygon as Polygon).points[2]);
                    let r = operation.exradius((polygon as Polygon).points[0], (polygon as Polygon).points[1], (polygon as Polygon).points[2]);
                    for (let i = 0; i < 3; i++) {
                        let label = `circle0`
                        let index = 0;
                        while (labelUsed.includes(label)) {
                            index++;
                            label = `circle${index}`;
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
                            isSelected: false,
                            node: this.createKonvaShape(circle),
                            type: circle,
                            dependsOn: [(polygon as Polygon).points[0].props.id, (polygon as Polygon).points[1].props.id, (polygon as Polygon).points[2].props.id]
                        };

                        circle.type = 'Excircle';
                        shapeNode.node!.draggable(false);
                        DAG.set(circle.props.id, shapeNode);
                    }

                    this.props.onLabelUsed(labelUsed);
                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: { ...this.props.geometryState },
                        dag: DAG,
                        selectedPoints: [],
                        selectedShapes: []
                    });
                }

                catch (error) {
                    const labelUsed = [...this.props.labelUsed];
                    for (let i = 0; i < 3; i++) {
                        let label = `circle0`
                        let index = 0;
                        while (labelUsed.includes(label)) {
                            index++;
                            label = `circle${index}`;
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
                            isSelected: false,
                            node: this.createKonvaShape(circle),
                            type: circle,
                            dependsOn: [(polygon as Polygon).points[0].props.id, (polygon as Polygon).points[1].props.id, (polygon as Polygon).points[2].props.id]
                        };

                        circle.type = 'Excircle';
                        shapeNode.node!.draggable(false);
                        shapeNode.node!.hide();
                        DAG.set(circle.props.id, shapeNode);
                    }

                    this.props.onLabelUsed(labelUsed);
                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: { ...this.props.geometryState },
                        dag: DAG,
                        selectedPoints: [],
                        selectedShapes: []
                    });
                }
            }

            else {
                if (selectedPoints.length !== 3) return;

                try {
                    const labelUsed = [...this.props.labelUsed];
                    let p = operation.excenter(selectedPoints[0], selectedPoints[1], selectedPoints[2]);
                    let r = operation.exradius(selectedPoints[0], selectedPoints[1], selectedPoints[2]);
                    for (let i = 0; i < 3; i++) {
                        let label = `circle0`
                        let index = 0;
                        while (labelUsed.includes(label)) {
                            index++;
                            label = `circle${index}`;
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
                            isSelected: false,
                            node: this.createKonvaShape(circle),
                            type: circle,
                            dependsOn: [selectedPoints[0].props.id, selectedPoints[1].props.id, selectedPoints[2].props.id]
                        };

                        circle.type = 'Excircle';
                        shapeNode.node!.draggable(false);
                        DAG.set(circle.props.id, shapeNode);
                    }

                    this.props.onLabelUsed(labelUsed);
                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: { ...this.props.geometryState },
                        dag: DAG,
                        selectedPoints: [],
                        selectedShapes: []
                    });
                }

                catch (error) {
                    const labelUsed = [...this.props.labelUsed];
                    for (let i = 0; i < 3; i++) {
                        let label = `circle0`
                        let index = 0;
                        while (labelUsed.includes(label)) {
                            index++;
                            label = `circle${index}`;
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
                            isSelected: false,
                            node: this.createKonvaShape(circle),
                            type: circle,
                            dependsOn: [selectedPoints[0].props.id, selectedPoints[1].props.id, selectedPoints[2].props.id]
                        };

                        circle.type = 'Excircle';
                        shapeNode.node!.draggable(false);
                        shapeNode.node!.hide();
                        DAG.set(circle.props.id, shapeNode);
                    }

                    this.props.onLabelUsed(labelUsed);
                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: { ...this.props.geometryState },
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

                try {
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
                            isSelected: false,
                            node: this.createKonvaShape(point),
                            type: point,
                            dependsOn: [(polygon as Polygon).points[0].props.id, (polygon as Polygon).points[1].props.id, (polygon as Polygon).points[2].props.id]
                        };

                        point.type = 'Excenter';
                        shapeNode.node!.draggable(false);
                        DAG.set(point.props.id, shapeNode);
                    }

                    this.props.onLabelUsed(labelUsed);
                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: { ...this.props.geometryState },
                        dag: DAG,
                        selectedPoints: [],
                        selectedShapes: []
                    });
                }

                catch (error) {
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
                            isSelected: false,
                            node: this.createKonvaShape(point),
                            type: point,
                            dependsOn: [(polygon as Polygon).points[0].props.id, (polygon as Polygon).points[1].props.id, (polygon as Polygon).points[2].props.id]
                        };

                        point.type = 'Excenter';
                        shapeNode.node!.draggable(false);
                        shapeNode.node!.hide();
                        DAG.set(point.props.id, shapeNode);
                    }

                    this.props.onLabelUsed(labelUsed);
                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: { ...this.props.geometryState },
                        dag: DAG,
                        selectedPoints: [],
                        selectedShapes: []
                    });
                }
            }

            else {
                if (selectedPoints.length !== 3) return;

                try {
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
                            isSelected: false,
                            node: this.createKonvaShape(point),
                            type: point,
                            dependsOn: [selectedPoints[0].props.id, selectedPoints[1].props.id, selectedPoints[2].props.id]
                        };

                        point.type = 'Excenter';
                        shapeNode.node!.draggable(false);
                        DAG.set(point.props.id, shapeNode);
                    }

                    this.props.onLabelUsed(labelUsed);
                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: { ...this.props.geometryState },
                        dag: DAG,
                        selectedPoints: [],
                        selectedShapes: []
                    });
                }

                catch (error) {
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
                            isSelected: false,
                            node: this.createKonvaShape(point),
                            type: point,
                            dependsOn: [selectedPoints[0].props.id, selectedPoints[1].props.id, selectedPoints[2].props.id]
                        };

                        point.type = 'Excenter';
                        shapeNode.node!.draggable(false);
                        shapeNode.node!.hide();
                        DAG.set(point.props.id, shapeNode);
                    }

                    this.props.onLabelUsed(labelUsed);
                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: { ...this.props.geometryState },
                        dag: DAG,
                        selectedPoints: [],
                        selectedShapes: []
                    });
                }
            }
        }

        else if (this.props.mode === 'midpoint') {
            const selectedShapes = [...this.props.selectedShapes];
            const selectedPoints = [...this.props.selectedPoints];
            if (selectedPoints.length === 2) {
                let label = utils.getExcelLabel('A', 0);
                let index = 0;
                while (this.props.labelUsed.includes(label)) {
                    index++;
                    label = utils.getExcelLabel('A', index);
                }

                this.props.onLabelUsed([...this.props.labelUsed, label]);
                const midpoint = Factory.createPoint(
                    utils.createPointDefaultShapeProps(label),
                    (selectedPoints[0].x + selectedPoints[1].x) / 2,
                    (selectedPoints[0].y + selectedPoints[1].y) / 2
                )


                DAG.set(midpoint.props.id, {
                    id: midpoint.props.id,
                    dependsOn: [selectedPoints[0].props.id, selectedPoints[1].props.id],
                    defined: true,
                    isSelected: false,
                    type: midpoint,
                    node: this.createKonvaShape(midpoint)
                });

                midpoint.type = 'Midpoint';
                this.props.onUpdateLastFailedState();
                this.props.onUpdateAll({
                    gs: { ...this.props.geometryState },
                    dag: DAG,
                    selectedPoints: [],
                    selectedShapes: []
                });
            }

            else if (selectedShapes.length === 1 && selectedPoints.length === 0) {
                if (!('startSegment' in selectedShapes[0]) && !selectedShapes[0].props.id.includes('circle-')) {
                    this.props.onUpdateLastFailedState();
                    this.props.onSelectedChange({
                        selectedShapes: [],
                        selectedPoints: []
                    });
                    return;
                }

                let label = utils.getExcelLabel('A', 0);
                let index = 0;
                while (this.props.labelUsed.includes(label)) {
                    index++;
                    label = utils.getExcelLabel('A', index);
                }

                this.props.onLabelUsed([...this.props.labelUsed, label]);
                if ('startSegment' in selectedShapes[0]) {
                    const midpoint = Factory.createPoint(
                        utils.createPointDefaultShapeProps(label),
                        (selectedShapes[0].startSegment.x + selectedShapes[0].endSegment.x) / 2,
                        (selectedShapes[0].startSegment.y + selectedShapes[0].endSegment.y) / 2
                    )


                    DAG.set(midpoint.props.id, {
                        id: midpoint.props.id,
                        dependsOn: [selectedShapes[0].props.id],
                        defined: true,
                        isSelected: false,
                        type: midpoint,
                        node: this.createKonvaShape(midpoint)
                    });

                    midpoint.type = 'Midpoint';
                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: { ...this.props.geometryState },
                        dag: DAG,
                        selectedPoints: [],
                        selectedShapes: []
                    });
                }

                else {
                    const midpoint = Factory.createPoint(
                        utils.createPointDefaultShapeProps(label),
                        (selectedShapes[0] as Circle).centerC.x,
                        (selectedShapes[0] as Circle).centerC.y
                    )

                    midpoint.type = 'Midpoint';

                    DAG.set(midpoint.props.id, {
                        id: midpoint.props.id,
                        dependsOn: [selectedShapes[0].props.id],
                        defined: true,
                        isSelected: false,
                        type: midpoint,
                        node: this.createKonvaShape(midpoint)
                    });

                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: { ...this.props.geometryState },
                        dag: DAG,
                        selectedPoints: [],
                        selectedShapes: []
                    });
                }
            }
        }

        else if (['parallel', 'perpendicular'].includes(this.props.mode)) {
            const selectedShapes = [...this.props.selectedShapes];
            const selectedPoints = [...this.props.selectedPoints];
            if (selectedShapes.length !== 1 || selectedPoints.length !== 1) {
                if (selectedPoints.length === 2) {
                    this.props.onUpdateLastFailedState();
                    this.props.onSelectedChange({
                        selectedShapes: [],
                        selectedPoints: []
                    });
                }

                return;
            }

            if (!selectedShapes[0].props.id.includes('line-')) return;
            const [start, end] = operation.getStartAndEnd(selectedShapes[0]);
            let label = `line0`;
            let index = 0;
            while (this.props.labelUsed.includes(label)) {
                index++;
                label = `line${index}`;
            }

            this.props.onLabelUsed([...this.props.labelUsed, label]);
            let newLine = Factory.createLine(
                utils.createLineDefaultShapeProps(label),
                selectedPoints[0],
                this.props.mode === 'parallel' ? Factory.createPoint(
                    utils.createPointDefaultShapeProps(''),
                    selectedPoints[0].x + (end.x - start.x),
                    selectedPoints[0].y + (end.y - start.y)
                ) : Factory.createPoint(
                    utils.createPointDefaultShapeProps(''),
                    selectedPoints[0].x + (start.y - end.y),
                    selectedPoints[0].y + (end.x - start.x)
                )
            );

            DAG.set(newLine.props.id, {
                id: newLine.props.id,
                dependsOn: [selectedPoints[0].props.id, selectedShapes[0].props.id],
                defined: true,
                isSelected: false,
                type: newLine,
                node: this.createKonvaShape(newLine)
            });

            newLine.type = this.props.mode === 'parallel' ? 'ParallelLine' : 'PerpendicularLine';

            this.props.onUpdateLastFailedState();
            this.props.onUpdateAll({
                gs: { ...this.props.geometryState },
                dag: DAG,
                selectedPoints: [],
                selectedShapes: []
            });
        }

        else if (this.props.mode === 'segment_length') {
            const selectedPoints = [...this.props.selectedPoints];
            if (selectedPoints.length !== 1) return;
            const length = this.props.data.radius;
            if (length === undefined || typeof length === 'string' || length <= 0) {
                this.props.onRenderDialogbox(this.props.mode);
                return;
            }

            let segment_label = `line0`;
            let index = 0;
            while (this.props.labelUsed.includes(segment_label)) {
                index++;
                segment_label = `line${index}`;
            }

            let point_label = utils.getExcelLabel('A', 0);
            index = 0;
            while (this.props.labelUsed.includes(point_label)) {
                index++;
                point_label = utils.getExcelLabel('A', index);
            }

            this.props.onLabelUsed([...this.props.labelUsed, point_label, segment_label]);

            const point: Point = Factory.createPoint(
                utils.createPointDefaultShapeProps(point_label),
                selectedPoints[0].x + length,
                selectedPoints[0].y
            )

            const segment: Segment = Factory.createSegment(
                utils.createLineDefaultShapeProps(segment_label),
                selectedPoints[0],
                point
            )

            let shapeNodePoint: ShapeNode = {
                id: point.props.id,
                type: point,
                node: this.createKonvaShape(point),
                dependsOn: [selectedPoints[0].props.id],
                defined: true,
                isSelected: false,
                scaleFactor: length,
                rotationFactor: {
                    degree: 0,
                    CCW: true
                }
            }

            let shapeNodeSegment: ShapeNode = {
                id: segment.props.id,
                type: segment,
                node: this.createKonvaShape(segment),
                dependsOn: [selectedPoints[0].props.id, point.props.id],
                defined: true,
                isSelected: false
            }

            DAG.set(shapeNodePoint.id, shapeNodePoint);
            DAG.set(shapeNodeSegment.id, shapeNodeSegment);
            this.props.onUpdateLastFailedState();
            this.props.onUpdateAll({
                gs: { ...this.props.geometryState },
                dag: DAG,
                selectedPoints: [],
                selectedShapes: []
            });
        }

        else if (this.props.mode === 'perpendicular_bisector') {
            const selectedPoints = [...this.props.selectedPoints];
            const selectedShapes = [...this.props.selectedShapes];
            if (selectedPoints.length !== 2 && selectedShapes.length !== 1) return;
            if (selectedShapes.length === 1) {
                if (selectedPoints.length !== 0 || !('startSegment' in selectedShapes[0])) {
                    this.props.onUpdateLastFailedState();
                    this.props.onSelectedChange({
                        selectedShapes: [],
                        selectedPoints: []
                    });

                    return;
                }

                const [start, end] = operation.getStartAndEnd(selectedShapes[0]);
                const mid = {
                    x: (start.x + end.x) / 2,
                    y: (start.y + end.y) / 2
                }

                const dir = {
                    x: (start.y - end.y) / 2,
                    y: (end.x - start.x) / 2
                }

                let label = `line0`;
                let index = 0;
                while (this.props.labelUsed.includes(label)) {
                    index++;
                    label = `line${index}`;
                }

                this.props.onLabelUsed([...this.props.labelUsed, label]);

                const line: Line = Factory.createLine(
                    utils.createLineDefaultShapeProps(label),
                    Factory.createPoint(
                        utils.createPointDefaultShapeProps(''),
                        mid.x - dir.x,
                        mid.y - dir.y
                    ),
                    Factory.createPoint(
                        utils.createPointDefaultShapeProps(''),
                        mid.x + dir.x,
                        mid.y + dir.y
                    )
                );


                DAG.set(line.props.id, {
                    id: line.props.id,
                    dependsOn: [selectedShapes[0].props.id],
                    defined: true,
                    isSelected: false,
                    type: line,
                    node: this.createKonvaShape(line)
                });

                line.type = 'PerpendicularBisector';
                this.props.onUpdateLastFailedState();
                this.props.onUpdateAll({
                    gs: { ...this.props.geometryState },
                    dag: DAG,
                    selectedPoints: [],
                    selectedShapes: []
                });
            }

            else {
                const [start, end] = [selectedPoints[0], selectedPoints[1]];
                const mid = {
                    x: (start.x + end.x) / 2,
                    y: (start.y + end.y) / 2
                }

                const dir = {
                    x: (start.y - end.y) / 2,
                    y: (end.x - start.x) / 2
                }

                let label = `line0`;
                let index = 0;
                while (this.props.labelUsed.includes(label)) {
                    index++;
                    label = `line${index}`;
                }

                this.props.onLabelUsed([...this.props.labelUsed, label]);

                const line: Line = Factory.createLine(
                    utils.createLineDefaultShapeProps(label),
                    Factory.createPoint(
                        utils.createPointDefaultShapeProps(''),
                        mid.x - dir.x,
                        mid.y - dir.y
                    ),
                    Factory.createPoint(
                        utils.createPointDefaultShapeProps(''),
                        mid.x + dir.x,
                        mid.y + dir.y
                    )
                );


                DAG.set(line.props.id, {
                    id: line.props.id,
                    dependsOn: [selectedPoints[0].props.id, selectedPoints[1].props.id],
                    defined: true,
                    isSelected: false,
                    type: line,
                    node: this.createKonvaShape(line)
                });

                line.type = 'PerpendicularBisector';
                this.props.onUpdateLastFailedState();
                this.props.onUpdateAll({
                    gs: { ...this.props.geometryState },
                    dag: DAG,
                    selectedPoints: [],
                    selectedShapes: []
                });
            }
        }

        else if (this.props.mode === 'semicircle') {
            const selectedPoints = [...this.props.selectedPoints];
            if (selectedPoints.length !== 2) return;
            const [p1, p2] = selectedPoints;
            let label = `semi0`;
            let index = 0;
            while (this.props.labelUsed.includes(label)) {
                index++;
                label = `semi${index}`;
            }

            this.props.onLabelUsed([...this.props.labelUsed, label]);
            const radius = (math.parse('sqrt(x^2 + y^2)').evaluate({ x: p1.x - p2.x, y: p1.y - p2.y })) / 2;
            let semiCircle: SemiCircle = Factory.createSemiCircle(
                utils.createSemiCircleDefaultShapeProps(label, radius),
                p1,
                p2
            );

            DAG.set(semiCircle.props.id, {
                id: semiCircle.props.id,
                dependsOn: [p1.props.id, p2.props.id],
                defined: true,
                isSelected: false,
                type: semiCircle,
                node: this.createKonvaShape(semiCircle),
                rotationFactor: {
                    degree: utils.cleanAngle((math.parse('atan2(y, x)').evaluate({ x: p2.x - p1.x, y: p2.y - p1.y })) * 180 / Math.PI),
                    CCW: false
                }
            });

            this.props.onUpdateLastFailedState();
            this.props.onUpdateAll({
                gs: { ...this.props.geometryState },
                dag: DAG,
                selectedPoints: [],
                selectedShapes: []
            })
        }

        else if (this.props.mode === 'angle_bisector') {
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
                            start2.y,
                            start2.z
                        ),
                        Factory.createPoint(
                            utils.createPointDefaultShapeProps(''),
                            end2.x,
                            end2.y,
                            end2.z
                        ),
                    )
                ]

                try {
                    let bisectors = operation.bisector_angle_line2(tmpSelectedShapes[0], tmpSelectedShapes[1]);
                    const labelUsed = [...this.props.labelUsed];
                    bisectors.forEach((b, i) => {
                        let label = `line0`;
                        let index = 0;
                        while (this.props.labelUsed.includes(label)) {
                            index++;
                            label = `line${index}`;
                        }

                        labelUsed.push(label);
                        let line = Factory.createLine(
                            utils.createLineDefaultShapeProps(`${label}`),
                            Factory.createPoint(
                                utils.createPointDefaultShapeProps(''),
                                b.point.x - b.direction.x,
                                b.point.y - b.direction.y
                            ),
                            Factory.createPoint(
                                utils.createPointDefaultShapeProps(''),
                                b.point.x + b.direction.x,
                                b.point.y + b.direction.y
                            )
                        );

                        let shapeNode: ShapeNode = {
                            id: line.props.id,
                            dependsOn: [selectedShapes[0].props.id, selectedShapes[1].props.id],
                            type: line,
                            node: this.createKonvaShape(line),
                            defined: true,
                            isSelected: false,
                            side: i === 0 ? 0 : 1
                        };

                        line.type = 'AngleBisector';
                        shapeNode.node!.draggable(false);
                        DAG.set(line.props.id, shapeNode);
                    });

                    this.props.onLabelUsed(labelUsed);
                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: { ...this.props.geometryState },
                        dag: DAG,
                        selectedPoints: [],
                        selectedShapes: []
                    });
                }

                catch (error) {
                    // Create 2 perpendicular, undefined lines
                    const labelUsed = [...this.props.labelUsed];
                    for (let i = 0; i < 2; i++) {
                        let label = `line0`;
                        let index = 0;
                        while (this.props.labelUsed.includes(label)) {
                            index++;
                            label = `line${index}`;
                        }

                        labelUsed.push(label);
                        let line = Factory.createLine(
                            utils.createLineDefaultShapeProps(`${label}`),
                            Factory.createPoint(
                                utils.createPointDefaultShapeProps(''),
                                0,
                                0
                            ),
                            Factory.createPoint(
                                utils.createPointDefaultShapeProps(''),
                                0 + (i === 0 ? 1 : 0),
                                0 + (i === 0 ? 0 : 1)
                            )
                        );

                        let shapeNode: ShapeNode = {
                            id: line.props.id,
                            dependsOn: [selectedShapes[0].props.id, selectedShapes[1].props.id],
                            type: line,
                            node: this.createKonvaShape(line),
                            defined: false,
                            isSelected: false,
                            side: i === 0 ? 0 : 1
                        };

                        line.type = 'AngleBisector';
                        shapeNode.node!.draggable(false);
                        shapeNode.node!.hide();
                        DAG.set(line.props.id, shapeNode);
                    }

                    this.props.onLabelUsed(labelUsed);
                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: { ...this.props.geometryState },
                        dag: DAG,
                        selectedPoints: [],
                        selectedShapes: []
                    });
                }
            }

            else {
                if (selectedPoints.length !== 3) {
                    if (selectedShapes.length > 0) {
                        this.props.onUpdateLastFailedState();
                        this.props.onSelectedChange({
                            selectedShapes: [],
                            selectedPoints: []
                        });
                    }

                    return;
                }

                let [point1, point2, point3] = [
                    selectedPoints[0],
                    selectedPoints[1],
                    selectedPoints[2],
                ]

                if (point3 === point1) {
                    this.props.onUpdateLastFailedState({
                        selectedPoints: selectedPoints,
                        selectedShapes: selectedShapes
                    });

                    selectedPoints.splice(0, 1);
                    selectedPoints.pop();
                    this.props.onUpdateAll({
                        gs: this.props.geometryState,
                        dag: DAG,
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
                    this.props.onUpdateAll({
                        gs: this.props.geometryState,
                        dag: DAG,
                        selectedPoints: selectedPoints,
                        selectedShapes: selectedShapes
                    });

                    return;
                }

                let line = operation.bisector_angle_line1(point1, point2, point3);
                let label = `line0`;
                let index = 0;
                while (this.props.labelUsed.includes(label)) {
                    index++;
                    label = `line${index}`;
                }

                this.props.onLabelUsed([...this.props.labelUsed, label]);
                let newLine = Factory.createLine(
                    utils.createLineDefaultShapeProps(label),
                    point2,
                    Factory.createPoint(
                        utils.createPointDefaultShapeProps(''),
                        line.point.x + line.direction.x,
                        line.point.y + line.direction.y
                    )
                );

                DAG.set(newLine.props.id, {
                    id: newLine.props.id,
                    dependsOn: [point1.props.id, point2.props.id, point3.props.id],
                    defined: true,
                    isSelected: false,
                    type: newLine,
                    node: this.createKonvaShape(newLine),
                    side: 0
                });

                newLine.type = 'AngleBisector';
                this.props.onUpdateLastFailedState();
                this.props.onUpdateAll({
                    gs: { ...this.props.geometryState },
                    dag: DAG,
                    selectedPoints: [],
                    selectedShapes: []
                });
            }
        }

        else if (this.props.mode === 'tangent_line') {
            const selectedPoints = [...this.props.selectedPoints];
            const selectedShapes = [...this.props.selectedShapes];
            if (selectedPoints.length !== 1 || selectedShapes.length !== 1) {
                if (selectedPoints.length > 1 || selectedShapes.length > 1) {
                    this.props.onUpdateLastFailedState();
                    this.props.onSelectedChange({
                        selectedShapes: [],
                        selectedPoints: []
                    });
                }

                return;
            }

            if (!selectedShapes[0].props.id.includes('circle-') && !selectedShapes[0].props.id.includes('semi-')) {
                this.props.onUpdateLastFailedState();
                this.props.onSelectedChange({
                    selectedShapes: [],
                    selectedPoints: []
                });
            }

            if ('centerC' in selectedShapes[0] && 'radius' in selectedShapes[0]) {
                let tangentLines = operation.tangentLine(selectedPoints[0], selectedShapes[0]);
                const labelUsed = [...this.props.labelUsed];
                for (let i = 0; i < tangentLines.length; i++) {
                    let label = `line0`;
                    let index = 0;
                    while (labelUsed.includes(label)) {
                        index++;
                        label = `line${index}`;
                    }

                    labelUsed.push(label);
                    const line = Factory.createLine(
                        utils.createLineDefaultShapeProps(label),
                        Factory.createPoint(
                            utils.createPointDefaultShapeProps(''),
                            selectedPoints[0].x - tangentLines[i].direction.x,
                            selectedPoints[0].y - tangentLines[i].direction.y,
                        ),
                        Factory.createPoint(
                            utils.createPointDefaultShapeProps(''),
                            selectedPoints[0].x + tangentLines[i].direction.x,
                            selectedPoints[0].y + tangentLines[i].direction.y,
                        )
                    )

                    DAG.set(line.props.id, {
                        id: line.props.id,
                        dependsOn: [selectedPoints[0].props.id, selectedShapes[0].props.id],
                        side: (i === 0 ? 0 : 1),
                        defined: tangentLines.length === 0 ? false : (tangentLines.length === 1 ? i === 0 : true),
                        type: line,
                        node: this.createKonvaShape(line),
                        isSelected: false
                    });

                    line.type = 'TangentLine'
                }

                this.props.onLabelUsed(labelUsed);
                this.props.onUpdateLastFailedState();
                this.props.onUpdateAll({
                    gs: { ...this.props.geometryState },
                    dag: DAG,
                    selectedPoints: [],
                    selectedShapes: []
                })
            }

            else {
                let tangentLines = operation.tangentLine(selectedPoints[0], selectedShapes[0] as SemiCircle);
                const labelUsed = [...this.props.labelUsed];
                for (let i = 0; i < tangentLines.length; i++) {
                    let label = `line0`;
                    let index = 0;
                    while (labelUsed.includes(label)) {
                        index++;
                        label = `line${index}`;
                    }

                    labelUsed.push(label);
                    const line = Factory.createLine(
                        utils.createLineDefaultShapeProps(label),
                        Factory.createPoint(
                            utils.createPointDefaultShapeProps(''),
                            selectedPoints[0].x - tangentLines[i].direction.x,
                            selectedPoints[0].y - tangentLines[i].direction.y,
                        ),
                        Factory.createPoint(
                            utils.createPointDefaultShapeProps(''),
                            selectedPoints[0].x + tangentLines[i].direction.x,
                            selectedPoints[0].y + tangentLines[i].direction.y,
                        )
                    )

                    DAG.set(line.props.id, {
                        id: line.props.id,
                        dependsOn: [selectedPoints[0].props.id, selectedShapes[0].props.id],
                        side: (i === 0 ? 0 : 1),
                        defined: tangentLines.length === 0 ? false : (tangentLines.length === 1 ? i === 0 : true),
                        type: line,
                        node: this.createKonvaShape(line),
                        isSelected: false
                    });

                    line.type = 'TangentLine'
                }

                this.props.onLabelUsed(labelUsed);
                this.props.onUpdateLastFailedState();
                this.props.onUpdateAll({
                    gs: { ...this.props.geometryState },
                    dag: DAG,
                    selectedPoints: [],
                    selectedShapes: []
                })
            }
        }

        else if (this.props.mode === 'regular_polygon') {
            const selectedPoints = [...this.props.selectedPoints];
            const selectedShapes = [...this.props.selectedShapes];

            if (selectedShapes.length === 1) {
                if (selectedPoints.length !== 0 || !('startSegment' in selectedShapes[0])) {
                    this.props.onUpdateLastFailedState();
                    this.props.onSelectedChange({
                        selectedShapes: [],
                        selectedPoints: []
                    });

                    return;
                }

                const vertices = this.props.data.vertices;
                if (!vertices) {
                    this.props.onRenderDialogbox(this.props.mode);
                    return;
                }

                const segment = selectedShapes[0] as Segment;
                let [start, end] = [segment.startSegment, segment.endSegment];
                let angle = (vertices - 2) * 180 / vertices;
                let points: Point[] = [];
                const labelUsed = [...this.props.labelUsed];
                for (let i = 2; i < vertices; i++) {
                    let label = utils.getExcelLabel('A', 0);
                    let index = 0;
                    while (labelUsed.includes(label)) {
                        index++;
                        label = utils.getExcelLabel('A', index);
                    }

                    labelUsed.push(label);
                    let newEnd = operation.rotation(start, end, angle, false) as Point;
                    newEnd.props = utils.createPointDefaultShapeProps(label);
                    start = end;
                    end = newEnd;
                    points.push(newEnd);
                }

                let idx = 1;
                let poly_label = `regPoly${idx}`;
                while (labelUsed.includes(poly_label)) {
                    idx += 1;
                    poly_label = `regPoly${idx}`;
                }

                labelUsed.push(poly_label);

                const polygonPoints = [segment.startSegment, segment.endSegment, ...points];
                let props = utils.createPolygonDefaultShapeProps(poly_label);
                props.color = segment.props.color;
                const polygon: Polygon = Factory.createPolygon(
                    props,
                    polygonPoints
                )

                DAG.get(segment.props.id)!.dependsOn.push(polygon.props.id);

                points.forEach(point => {
                    let pNode = this.createKonvaShape(point);
                    pNode.draggable(false);
                    DAG.set(point.props.id, {
                        id: point.props.id,
                        type: point,
                        node: pNode,
                        dependsOn: [polygon.props.id],
                        isSelected: false,
                        defined: true
                    });
                });

                for (let i = 0; i < polygonPoints.length; i++) {
                    if (i === 0) continue;
                    let p = polygonPoints[i];
                    let pNext = polygonPoints[(i + 1) % polygonPoints.length];
                    let label = `segment0`;
                    let index = 0;
                    while (labelUsed.includes(label)) {
                        index++;
                        label = `segment${index}`;
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
                        isSelected: false
                    }

                    DAG.set(segment.props.id, shapeNode);
                }

                let shapeNode: ShapeNode = {
                    id: polygon.props.id,
                    type: polygon,
                    node: this.createKonvaShape(polygon),
                    dependsOn: polygonPoints.map(point => point.props.id),
                    defined: true,
                    isSelected: false,
                    rotationFactor: {
                        degree: angle,
                        CCW: true
                    }
                }

                polygon.type = 'RegularPolygon';

                DAG.set(polygon.props.id, shapeNode);
                this.props.onLabelUsed(labelUsed);
                this.props.onUpdateLastFailedState();
                this.props.onUpdateAll({
                    gs: { ...this.props.geometryState },
                    dag: DAG,
                    selectedPoints: [],
                    selectedShapes: []
                });
            }

            else {
                if (selectedPoints.length !== 2) return;
                const vertices = this.props.data.vertices;
                if (!vertices) {
                    this.props.onRenderDialogbox(this.props.mode);
                    return;
                }

                let [start, end] = [selectedPoints[0], selectedPoints[1]];
                let angle = (vertices - 2) * 180 / vertices;
                let points: Point[] = [];
                const labelUsed = [...this.props.labelUsed];
                for (let i = 2; i < vertices; i++) {
                    let label = utils.getExcelLabel('A', 0);
                    let index = 0;
                    while (labelUsed.includes(label)) {
                        index++;
                        label = utils.getExcelLabel('A', index);
                    }

                    labelUsed.push(label);
                    let newEnd = operation.rotation(start, end, angle, false) as Point;
                    newEnd.props = utils.createPointDefaultShapeProps(label);
                    start = end;
                    end = newEnd;
                    points.push(newEnd);
                }

                let idx = 1;
                let poly_label = `regPoly${idx}`;
                while (labelUsed.includes(poly_label)) {
                    idx += 1;
                    poly_label = `regPoly${idx}`;
                }

                labelUsed.push(poly_label);
                const polygonPoints = [selectedPoints[0], selectedPoints[1], ...points];
                let props = utils.createPolygonDefaultShapeProps(poly_label);
                const polygon: Polygon = Factory.createPolygon(
                    props,
                    polygonPoints
                );

                points.forEach(point => {
                    let pNode = this.createKonvaShape(point);
                    pNode.draggable(false);
                    DAG.set(point.props.id, {
                        id: point.props.id,
                        type: point,
                        node: pNode,
                        dependsOn: [polygon.props.id],
                        isSelected: false,
                        defined: true,
                    });
                });

                for (let i = 0; i < polygonPoints.length; i++) {
                    let p = polygonPoints[i];
                    let pNext = polygonPoints[(i + 1) % polygonPoints.length];
                    let label = `segment0`;
                    let index = 0;
                    while (labelUsed.includes(label)) {
                        index++;
                        label = `segment${index}`;
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
                        isSelected: false
                    }

                    DAG.set(segment.props.id, shapeNode);
                }

                let shapeNode: ShapeNode = {
                    id: polygon.props.id,
                    type: polygon,
                    node: this.createKonvaShape(polygon),
                    dependsOn: polygonPoints.map(point => point.props.id),
                    defined: true,
                    isSelected: false,
                    rotationFactor: {
                        degree: angle,
                        CCW: true
                    }
                }

                polygon.type = 'RegularPolygon';

                DAG.set(polygon.props.id, shapeNode);
                this.props.onLabelUsed(labelUsed);
                this.props.onUpdateLastFailedState();
                this.props.onUpdateAll({
                    gs: { ...this.props.geometryState },
                    dag: DAG,
                    selectedPoints: [],
                    selectedShapes: []
                });
            }
        }

        else if (['reflect_point', 'reflect_line', 'rotation', 'enlarge', 'translation'].includes(this.props.mode)) {
            const selectedPoints = [...this.props.selectedPoints];
            const selectedShapes = [...this.props.selectedShapes];
            let shape: Shape;
            let transformObject: Shape | undefined = undefined;
            if ((['reflect_line', 'translation'].includes(this.props.mode) && selectedPoints.length > 1) || (['reflect_point', 'rotation', 'enlarge'].includes(this.props.mode) && selectedShapes.length > 1)) {
                this.props.onUpdateLastFailedState();
                this.props.onSelectedChange({
                    selectedShapes: [],
                    selectedPoints: []
                });

                return;
            }

            let newShape: Shape | undefined = undefined;
            if (selectedShapes.length === 2) {
                if (this.props.mode === 'reflect_line' && !('startSegment' in selectedShapes[1]) && !('startRay' in selectedShapes[1]) && !('startLine' in selectedShapes[1])) {
                    this.props.onUpdateLastFailedState();
                    this.props.onSelectedChange({
                        selectedShapes: [],
                        selectedPoints: []
                    });

                    return;
                }

                if (this.props.mode === 'translation' && !('startVector' in selectedShapes[1] && 'endVector' in selectedShapes[1])) {
                    this.props.onUpdateLastFailedState();
                    this.props.onSelectedChange({
                        selectedShapes: [],
                        selectedPoints: []
                    });

                    return;
                }

                newShape = this.props.mode === 'reflect_line' ? operation.reflection(selectedShapes[0], selectedShapes[1]) :
                    operation.translation(selectedShapes[0], selectedShapes[1] as Vector);
                shape = selectedShapes[0];
                transformObject = selectedShapes[1];
            }

            else if (selectedShapes.length === 1) {
                if (selectedPoints.length === 0) return;
                if (this.props.mode === 'rotation') {
                    const rotation = this.props.data.rotation;
                    if (!rotation) {
                        this.props.onRenderDialogbox(this.props.mode);
                        return;
                    }

                    newShape = operation.rotation(selectedShapes[0], selectedPoints[0], rotation.degree, rotation.CCW);
                    shape = selectedShapes[0];
                    transformObject = selectedPoints[0];
                }

                else if (this.props.mode === 'enlarge') {
                    const scaleFactor = this.props.data.radius;
                    if (!scaleFactor || typeof scaleFactor === 'string') {
                        this.props.onRenderDialogbox(this.props.mode);
                        return;
                    }

                    newShape = operation.enlarge(selectedShapes[0], selectedPoints[0], scaleFactor);
                    shape = selectedShapes[0];
                    transformObject = selectedPoints[0];
                }

                else {
                    if (this.props.mode === 'reflect_line') {
                        if (!('startSegment' in selectedShapes[0]) && !('startRay' in selectedShapes[0]) && !('startLine' in selectedShapes[0])) {
                            this.props.onUpdateLastFailedState();
                            this.props.onSelectedChange({
                                selectedShapes: [],
                                selectedPoints: []
                            });

                            return;
                        }

                        newShape = operation.reflection(selectedPoints[0], selectedShapes[0]) as Point;
                        shape = selectedPoints[0];
                        transformObject = selectedShapes[0];
                    }

                    else if (this.props.mode === 'translation') {
                        if (!('startVector' in selectedShapes[0] && 'endVector' in selectedShapes[0])) {
                            this.props.onUpdateLastFailedState();
                            this.props.onSelectedChange({
                                selectedShapes: [],
                                selectedPoints: []
                            });

                            return;
                        }

                        newShape = operation.translation(selectedPoints[0], selectedShapes[0] as Vector) as Point;
                        shape = selectedPoints[0];
                        transformObject = selectedShapes[0];
                    }

                    else {
                        newShape = operation.reflection(selectedShapes[0], selectedPoints[0]);
                        transformObject = selectedPoints[0];
                        shape = selectedShapes[0];
                    }
                }
            }

            else {
                if (['reflect_line', 'translation'].includes(this.props.mode)) {
                    if (selectedPoints.length > 1) {
                        this.props.onUpdateLastFailedState();
                        this.props.onSelectedChange({
                            selectedShapes: [],
                            selectedPoints: []
                        });
                    }

                    return;
                }

                if (selectedPoints.length !== 2) return;
                if (this.props.mode === 'rotation') {
                    const rotation = this.props.data.rotation;
                    if (!rotation) {
                        this.props.onRenderDialogbox(this.props.mode);
                        return;
                    }

                    newShape = operation.rotation(selectedPoints[0], selectedPoints[1], rotation.degree, rotation.CCW) as Point;
                    shape = selectedPoints[0];
                    transformObject = selectedPoints[1];
                }

                else if (this.props.mode === 'enlarge') {
                    const scaleFactor = this.props.data.radius;
                    if (!scaleFactor || typeof scaleFactor === 'string') {
                        this.props.onRenderDialogbox(this.props.mode);
                        return;
                    }

                    newShape = operation.enlarge(selectedPoints[0], selectedPoints[1], scaleFactor) as Point;
                    shape = selectedPoints[0];
                    transformObject = selectedPoints[1];
                }

                else {
                    newShape = operation.reflection(selectedPoints[0], selectedPoints[1]) as Point;
                    shape = selectedPoints[0];
                    transformObject = selectedPoints[1];
                }
            }

            if (!newShape) return;
            const labelUsed = [...this.props.labelUsed];
            utils.updateShapeAfterTransform(
                shape,
                newShape,
                labelUsed,
                DAG,
                this.props.mode,
                { rotation: this.props.data.rotation, scale_factor: this.props.data.radius as number },
                transformObject
            );

            this.props.onLabelUsed(labelUsed);
            this.props.onUpdateLastFailedState();
            this.props.onUpdateAll({
                gs: {
                    ...this.props.geometryState
                },
                dag: DAG,
                selectedPoints: [],
                selectedShapes: []
            });
        }

        else if (this.props.mode === 'projection') {
            const selectedPoints = [...this.props.selectedPoints];
            const selectedShapes = [...this.props.selectedShapes];
            if (selectedPoints.length === 1) {
                if (selectedShapes.length !== 1) return;
                if (!('startSegment' in selectedShapes[0]) && !('startLine' in selectedShapes[0]) && !('startRay' in selectedShapes[0])) {
                    this.props.onUpdateLastFailedState();
                    this.props.onSelectedChange({
                        selectedShapes: [],
                        selectedPoints: []
                    });

                    return;
                }

                const point_coor = operation.point_projection(selectedPoints[0], selectedShapes[0]);
                const labelUsed = [...this.props.labelUsed];
                let label = utils.getExcelLabel('A', 0);
                let index = 0;
                while (labelUsed.includes(label)) {
                    index++;
                    label = utils.getExcelLabel('A', index);
                }

                labelUsed.push(label);
                const point = Factory.createPoint(
                    utils.createPointDefaultShapeProps(label),
                    point_coor.x,
                    point_coor.y
                );

                point.type = 'Projection';
                let shapeNode: ShapeNode = {
                    id: point.props.id,
                    dependsOn: [selectedPoints[0].props.id, selectedShapes[0].props.id],
                    defined: true,
                    isSelected: false,
                    type: point,
                    node: this.createKonvaShape(point)
                };

                DAG.set(point.props.id, shapeNode);
                this.props.onLabelUsed(labelUsed);
                this.props.onUpdateLastFailedState();
                this.props.onUpdateAll({
                    gs: { ...this.props.geometryState },
                    dag: DAG,
                    selectedPoints: [],
                    selectedShapes: []
                });
            }

            else {
                this.props.onUpdateLastFailedState();
                this.props.onSelectedChange({
                    selectedShapes: [],
                    selectedPoints: []
                });

                return;
            }
        }

        this.newCreatedPoint = [];
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

    private updateAndPropagateBatch = (ids: string[], updateFn: (node: ShapeNode) => ShapeNode) => {
        const DAG = utils.cloneDAG(this.props.dag);
        const visited = new Set<string>();
        const allAffectedNodes = new Set<string>();

        // Set flag to prevent individual label updates
        this.isBatchUpdating = true;

        // Collect all nodes that need updating (including dependencies)
        const collectAffectedNodes = (nodeId: string) => {
            if (visited.has(nodeId)) return;
            visited.add(nodeId);
            allAffectedNodes.add(nodeId);
            
            this.findChildren(nodeId).forEach(childId => {
                collectAffectedNodes(childId);
            });
        };

        // Collect all affected nodes from all input IDs
        ids.forEach(id => {
            const node = DAG.get(id);
            if (node) {
                DAG.set(id, updateFn(node));
                collectAffectedNodes(id);
            }
        });

        // Perform topological sort on all affected nodes
        const stack: string[] = [];
        const sortVisited = new Set<string>();

        const topologicalSort = (nodeId: string) => {
            if (sortVisited.has(nodeId)) return;
            sortVisited.add(nodeId);
            
            this.findChildren(nodeId).forEach(childId => {
                if (allAffectedNodes.has(childId)) {
                    topologicalSort(childId);
                }
            });
            
            stack.push(nodeId);
        };

        // Sort all affected nodes
        allAffectedNodes.forEach(nodeId => {
            if (!sortVisited.has(nodeId)) {
                topologicalSort(nodeId);
            }
        });

        // Update all nodes in dependency order
        stack.reverse().forEach(nodeId => {
            const node = DAG.get(nodeId);
            if (node) {
                const updated = this.computeUpdateFor(node);
                DAG.set(nodeId, updated);
            }
        });

        // Clear flag
        this.isBatchUpdating = false;

        // Now update all labels at once, after all geometry is updated
        if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
            allAffectedNodes.forEach(nodeId => {
                const node = DAG.get(nodeId);
                if (node && node.node) {
                    let label = this.layerUnchangeVisualRef.current!.getChildren().find(
                        labelNode => labelNode.id().includes(node.node!.id())
                    );
                    if (label) {
                        label.setAttrs(this.createLabel(node).getAttrs());
                    }
                }
            });
            
            // Single batch draw for all label updates
            this.layerUnchangeVisualRef.current.batchDraw();
        }

        // Single state update with all changes
        this.props.onUpdateAll({
            gs: { ...this.props.geometryState },
            dag: DAG,
            selectedPoints: this.props.selectedPoints,
            selectedShapes: this.props.selectedShapes
        }, false);
    };

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
            'Incircle': this.updateIncircle3Point,
            'PerpendicularBisector': this.updatePerpendicularBisector,
            'PerpendicularLine': this.updatePerpendicularLine,
            'TangentLine': this.updateTangentLine,
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
            'RegularPolygon': this.updateRegularPoly,
            'Translation': this.updateTranslation
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
            if (!shape) return { ...node! };
            if ('x' in shape.type && 'y' in shape.type) {
                if (!node.scaleFactor || !node.rotationFactor) return { ...node! };
                let c = shape.node! as Konva.Circle;
                const cx = c.x();
                const cy = c.y();
                const r = node.scaleFactor * this.props.geometryState.spacing;
                const angle = Konva.getAngle(node.rotationFactor.degree);

                const newX = cx + r * Math.cos(angle);
                const newY = cy + r * Math.sin(angle);
                node.node!.position({ x: newX, y: newY });
                this.updatePointPos(node.type as Point, newX, newY);
                if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
                    let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
                    if (label) {
                        label.setAttrs(this.createLabel(node).getAttrs());
                    }
                }

                return { ...node! };
            }

            if ('points' in shape.type) {
                let pts = shape.type.points;
                if (node.rotationFactor !== undefined && node.scaleFactor !== undefined) {
                    const base = {x: 0, y: 0};
                    pts.forEach(pt => {
                        base.x += pt.x
                        base.y += pt.y
                    });

                    base.x /= pts.length;
                    base.y /= pts.length;
                    const pos = utils.convertToScreenCoords(
                        {x: base.x, y: base.y},
                        {x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2},
                        this.props.geometryState.spacing
                    );

                    if (node.node === undefined) return { ...node! };
                    node.node.position({
                        x: pos.x + node.scaleFactor * this.props.geometryState.spacing * Math.cos(Konva.getAngle(node.rotationFactor.degree)),
                        y: pos.y - node.scaleFactor * this.props.geometryState.spacing * Math.sin(Konva.getAngle(node.rotationFactor.degree))
                    });

                    this.updatePointPos(node.type as Point, node.node!.x(), node.node!.y());
                    if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
                        let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
                        if (label) {
                            label.setAttrs(this.createLabel(node).getAttrs());
                        }
                    }
                }

                else {
                    pts.forEach(point => {
                        if (point.props.label === node.type.props.label) {
                            const pos = utils.convertToScreenCoords(
                                {x: point.x, y: point.y},
                                {x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2},
                                this.props.geometryState.spacing
                            );

                            node.node!.position({x: pos.x, y: pos.y});
                            this.updatePointPos(node.type as Point, node.node!.x(), node.node!.y());
                            if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
                                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
                                if (label) {
                                    label.setAttrs(this.createLabel(node).getAttrs());
                                }
                            }
                        }
                    });
                }
            }

            else if (node.scaleFactor) {
                let l = shape.node!.getClassName() === 'Line' ? shape.node! as Konva.Line : shape.node! as Konva.Arrow;
                let d = {
                    x: l.points()[2] - l.points()[0],
                    y: l.points()[3] - l.points()[1]
                }

                node.node!.position({ x: l.points()[0] + node.scaleFactor * d.x, y: l.points()[1] + node.scaleFactor * d.y });
                this.updatePointPos(node.type as Point, node.node!.x(), node.node!.y());
            }

            else if (node.rotationFactor) {
                if (!(shape.type.type === 'SemiCircle')) {
                    let c = shape.node! as Konva.Circle;
                    const cx = c.x();
                    const cy = c.y();
                    const r = c.radius();
                    const angle = Konva.getAngle(node.rotationFactor.degree);

                    const newX = cx + r * Math.cos(angle);
                    const newY = cy + r * Math.sin(angle);
                    node.node!.position({ x: newX, y: newY });
                }

                else {
                    let c = shape.node! as Konva.Arc;
                    const cx = c.x();
                    const cy = c.y();
                    const r = c.outerRadius();
                    const angle = Konva.getAngle(node.rotationFactor.degree);

                    const newX = cx + r * Math.cos(angle);
                    const newY = cy - r * Math.sin(angle);
                    node.node!.position({ x: newX, y: newY });
                }

                this.updatePointPos(node.type as Point, node.node!.x(), node.node!.y());
            }

            if ('startSegment' in shape.type || 'points' in shape.type || 'centerC' in shape.type || ('start' in shape.type && 'end' in shape.type)) {
                perimeter = operation.getLength(shape.type);
                if ('points' in shape.type || 'centerC' in shape.type) {
                    area = 'points' in shape.type ? operation.getArea(shape.type) : Math.pow(shape.type.radius, 2) * Math.PI;
                }
            }
        }

        else {
            this.updatePointPos(node.type as Point, node.node!.x(), node.node!.y());
        }

        if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
            if (node.id.includes('tmpPoint')) {
                let splits = node.type.props.label.split(' = ');
                if (splits.length > 0) {
                    node.type.props.label = `${splits[0]} = ${splits[0].includes('Area') ? area.toFixed(2) : perimeter.toFixed(2)}`;
                }
            }


            let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
            if (label) {
                label.setAttrs(this.createLabel(node).getAttrs());
                node.id.includes('tmpPoint') ? label.show() : label.hide();
            }
        }

        return { ...node! }
    }

    private updateSegment = (node: ShapeNode): ShapeNode => {
        const [id1, id2] = node.dependsOn;
        const p1 = this.props.dag.get(id1);
        const p2 = this.props.dag.get(id2);
        if (!p1 || !p2) return { ...node! };

        const posA = (p1).node!.position();
        const posB = (p2).node!.position();

        const line = node.node! as Konva.Line;
        line.points([posA.x, posA.y, posB.x, posB.y]);
        if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
            let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
            if (label) {
                label.setAttrs(this.createLabel(node).getAttrs());
            }
        }

        this.updatePointPos((node.type as Segment).startSegment, posA.x, posA.y);
        this.updatePointPos((node.type as Segment).endSegment, posB.x, posB.y);
        return { ...node! };
    }

    private updateLine = (node: ShapeNode): ShapeNode => {
        const [id1, id2] = node.dependsOn;
        const p1 = this.props.dag.get(id1);
        const p2 = this.props.dag.get(id2);
        if (!p1 || !p2) return { ...node! };

        const posA = (p1).node!.position();
        const posB = (p2).node!.position();

        const dx = posB.x - posA.x;
        const dy = posB.y - posA.y;

        let length = 2 * Math.max(this.props.stageRef.current!.width(), this.props.stageRef.current!.height()) * Math.sqrt(dx * dx + dy * dy) / this.props.geometryState.zoom_level;
        let norm_dx = dx / Math.sqrt(dx * dx + dy * dy);
        let norm_dy = dy / Math.sqrt(dx * dx + dy * dy);

        const line = node.node! as Konva.Line;
        line.points([posA.x - length * norm_dx, posA.y - length * norm_dy, posB.x + length * norm_dx, posB.y + length * norm_dy]);

        if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
            let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
            if (label) {
                label.setAttrs(this.createLabel(node).getAttrs());
            }
        }

        this.updatePointPos((node.type as Line).startLine, posA.x, posA.y);
        this.updatePointPos((node.type as Line).endLine, posB.x, posB.y);
        return { ...node! };
    }

    private updateRay = (node: ShapeNode): ShapeNode => {
        const [id1, id2] = node.dependsOn;
        const p1 = this.props.dag.get(id1);
        const p2 = this.props.dag.get(id2);
        if (!p1 || !p2) return { ...node! };

        const posA = (p1).node!.position();
        const posB = (p2).node!.position();

        const dx = posB.x - posA.x;
        const dy = posB.y - posA.y;

        let length = 2 * Math.max(this.props.stageRef.current!.width(), this.props.stageRef.current!.height()) * Math.sqrt(dx * dx + dy * dy) / this.props.geometryState.zoom_level;
        let norm_dx = dx / Math.sqrt(dx * dx + dy * dy);
        let norm_dy = dy / Math.sqrt(dx * dx + dy * dy);

        const line = node.node! as Konva.Line;
        line.points([posA.x, posA.y, posB.x + length * norm_dx, posB.y + length * norm_dy]);

        if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
            let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
            if (label) {
                label.setAttrs(this.createLabel(node).getAttrs());
            }
        }

        this.updatePointPos((node.type as Ray).startRay, posA.x, posA.y);
        this.updatePointPos((node.type as Ray).endRay, posB.x, posB.y);
        return { ...node! };
    }

    private updatePolygon = (node: ShapeNode): ShapeNode => {
        const pointIds = node.dependsOn;
        const points: number[] = [];
        for (const pid of pointIds) {
            const pointNode = this.props.dag.get(pid);
            if (!pointNode) {
                return { ...node! };
            }

            const pos = (pointNode).node!.position();
            points.push(pos.x, pos.y);
        }

        const polygon = node.node! as Konva.Line;
        polygon.points(points);

        (node.type as Polygon).points.forEach((point, idx) => {
            this.updatePointPos(point, polygon.points()[2 * idx], polygon.points()[2 * idx + 1]);
        })

        if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
            let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
            if (label) {
                label.setAttrs(this.createLabel(node).getAttrs());
            }
        }

        return { ...node! };
    }

    private updateCircle = (node: ShapeNode): ShapeNode => {
        let id = node.dependsOn[0];
        let centerNode = this.props.dag.get(id);
        if (!centerNode) {
            return { ...node! };
        }

        let circleNode = node.node! as Konva.Circle;
        circleNode.position((centerNode).node!.position());

        if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
            let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
            if (label) {
                label.setAttrs(this.createLabel(node).getAttrs());
            }
        }

        this.updatePointPos((node.type as Circle).centerC, circleNode.x(), circleNode.y());
        return { ...node! };
    }

    private updateVector = (node: ShapeNode): ShapeNode => {
        const [id1, id2] = node.dependsOn;
        const [start, end] = [this.props.dag.get(id1), this.props.dag.get(id2)];
        if (!start || !end) {
            return { ...node! };
        }

        const posA = (start).node!.position();
        const posB = (end).node!.position();

        let vectorNode = node.node! as Konva.Arrow;
        vectorNode.points([posA.x, posA.y, posB.x, posB.y]);
        this.updatePointPos((node.type as Vector).startVector, posA.x, posA.y);
        this.updatePointPos((node.type as Vector).endVector, posB.x, posB.y);

        if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
            let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
            if (label) {
                label.setAttrs(this.createLabel(node).getAttrs());
            }
        }

        return { ...node! };
    }

    private updateMidpoint = (node: ShapeNode): ShapeNode => {
        if (![1, 2].includes(node.dependsOn.length)) return { ...node! };
        if (node.dependsOn.length === 2) {
            const [id1, id2] = node.dependsOn;
            const [start, end] = [this.props.dag.get(id1), this.props.dag.get(id2)];
            if (!start || !end) {
                return { ...node! };
            }

            const posA = (start).node!.position();
            const posB = (end).node!.position();

            let point = node.node! as Konva.Circle;
            point.position({ x: (posA.x + posB.x) / 2, y: (posA.y + posB.y) / 2 });

            if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
                if (label) {
                    label.setAttrs(this.createLabel(node).getAttrs());
                }
            }

            this.updatePointPos((node.type as Point), point.x(), point.y());
            return { ...node! };
        }

        else {
            const shape = this.props.dag.get(node.dependsOn[0]);
            if (!shape) return { ...node! };
            if ('startSegment' in shape.type) {
                const [start, end] = [shape.type.startSegment, shape.type.endSegment];
                const pos = utils.convertToScreenCoords(
                    { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 },
                    { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                    this.props.geometryState.spacing
                );

                let point = node.node! as Konva.Circle;
                point.position(pos);
                if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
                    let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
                    if (label) {
                        label.setAttrs(this.createLabel(node).getAttrs());
                    }
                }

                [(node.type as Point).x, (node.type as Point).y] = [(start.x + end.x) / 2, (start.y + end.y) / 2];
                return { ...node! };
            }

            else if ('centerC' in shape.type && 'radius' in shape.type) {
                let point = node.node! as Konva.Circle;
                const pos = utils.convertToScreenCoords(
                    { x: shape.type.centerC.x, y: shape.type.centerC.y },
                    { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                    this.props.geometryState.spacing
                );

                point.position(pos);
                if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
                    let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
                    if (label) {
                        label.setAttrs(this.createLabel(node).getAttrs());
                    }
                }

                [(node.type as Point).x, (node.type as Point).y] = [shape.type.centerC.x, shape.type.centerC.y];
                return { ...node! };
            }

            else return { ...node! };
        }
    }

    private updateCentroid = (node: ShapeNode): ShapeNode => {
        const [id1, id2, id3] = node.dependsOn;
        const [p1, p2, p3] = [this.props.dag.get(id1), this.props.dag.get(id2), this.props.dag.get(id3)];
        if (!p1 || !p2 || !p3) {
            return { ...node! };
        }

        const posA = (p1).node!.position();
        const posB = (p2).node!.position();
        const posC = (p3).node!.position();

        let [A, B, C] = [
            Factory.createPoint(node.type.props, posA.x, posA.y),
            Factory.createPoint(node.type.props, posB.x, posB.y),
            Factory.createPoint(node.type.props, posC.x, posC.y)
        ]

        try {
            let ortho = operation.centroid(A, B, C);
            let point = node.node! as Konva.Circle;
            point.position({ x: ortho.x, y: ortho.y });
            point.show();
            node.defined = true;

            if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
                if (label) {
                    label.show()
                    label.setAttrs(this.createLabel(node).getAttrs());
                }
            }

            this.updatePointPos((node.type as Point), point.x(), point.y());
            return { ...node! };
        }

        catch (error) {
            node.node!.hide();
            node.defined = false;
            if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
                if (label) {
                    label.hide();
                }
            }

            return { ...node! };
        }
    }

    private updateOrthocenter = (node: ShapeNode): ShapeNode => {
        const [id1, id2, id3] = node.dependsOn;
        const [p1, p2, p3] = [this.props.dag.get(id1), this.props.dag.get(id2), this.props.dag.get(id3)];
        if (!p1 || !p2 || !p3) {
            return { ...node! };
        }

        const posA = (p1).node!.position();
        const posB = (p2).node!.position();
        const posC = (p3).node!.position();

        let [A, B, C] = [
            Factory.createPoint(node.type.props, posA.x, posA.y),
            Factory.createPoint(node.type.props, posB.x, posB.y),
            Factory.createPoint(node.type.props, posC.x, posC.y)
        ]

        try {
            let ortho = operation.orthocenter(A, B, C);
            let point = node.node! as Konva.Circle;
            point.position({ x: ortho.x, y: ortho.y });
            point.show();
            node.defined = true;

            if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
                if (label) {
                    label.show()
                    label.setAttrs(this.createLabel(node).getAttrs());
                }
            }

            this.updatePointPos((node.type as Point), point.x(), point.y());
            return { ...node! };
        }

        catch (error) {
            node.node!.hide();
            node.defined = false;
            if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
                if (label) {
                    label.hide();
                }
            }

            return { ...node! };
        }
    }

    private updateCircumcenter = (node: ShapeNode): ShapeNode => {
        const [id1, id2, id3] = node.dependsOn;
        const [p1, p2, p3] = [this.props.dag.get(id1), this.props.dag.get(id2), this.props.dag.get(id3)];
        if (!p1 || !p2 || !p3) {
            return { ...node! };
        }

        const posA = (p1).node!.position();
        const posB = (p2).node!.position();
        const posC = (p3).node!.position();

        let [A, B, C] = [
            Factory.createPoint(node.type.props, posA.x, posA.y),
            Factory.createPoint(node.type.props, posB.x, posB.y),
            Factory.createPoint(node.type.props, posC.x, posC.y)
        ]

        try {
            let ortho = operation.circumcenter(A, B, C);
            let point = node.node! as Konva.Circle;
            point.position({ x: ortho.x, y: ortho.y });
            point.show();
            node.defined = true;

            if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
                if (label) {
                    label.show();
                    label.setAttrs(this.createLabel(node).getAttrs());
                }
            }

            this.updatePointPos((node.type as Point), point.x(), point.y());
            return { ...node! };
        }

        catch (error) {
            node.node!.hide();
            node.defined = false;
            if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
                if (label) {
                    label.hide();
                }
            }

            return { ...node! };
        }
    }

    private updateIncenter = (node: ShapeNode): ShapeNode => {
        const [id1, id2, id3] = node.dependsOn;
        const [p1, p2, p3] = [this.props.dag.get(id1), this.props.dag.get(id2), this.props.dag.get(id3)];
        if (!p1 || !p2 || !p3) {
            return { ...node! };
        }

        const posA = (p1).node!.position();
        const posB = (p2).node!.position();
        const posC = (p3).node!.position();

        let [A, B, C] = [
            Factory.createPoint(node.type.props, posA.x, posA.y),
            Factory.createPoint(node.type.props, posB.x, posB.y),
            Factory.createPoint(node.type.props, posC.x, posC.y)
        ]

        try {
            let ortho = operation.incenter(A, B, C);
            let point = node.node! as Konva.Circle;
            point.position({ x: ortho.x, y: ortho.y });
            point.show();
            node.defined = true;

            if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
                if (label) {
                    label.show();
                    label.setAttrs(this.createLabel(node).getAttrs());
                }
            }

            this.updatePointPos((node.type as Point), point.x(), point.y());
            return { ...node! };
        }

        catch (error) {
            node.node!.hide();
            node.defined = false;
            if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
                if (label) {
                    label.hide();
                }
            }

            return { ...node! };
        }
    }

    private updateCircle2Point = (node: ShapeNode): ShapeNode => {
        const [id1, id2] = node.dependsOn;
        const [start, end] = [this.props.dag.get(id1), this.props.dag.get(id2)];
        if (!start || !end) {
            return { ...node! };
        }

        const posA = (start).node!.position();
        const posB = (end).node!.position();

        let point = node.node! as Konva.Circle;
        point.position({ x: posA.x, y: posA.y });
        point.radius(Math.hypot(posB.x - posA.x, posB.y - posA.y));
        this.updatePointPos((node.type as Circle).centerC, posA.x, posA.y);
        (node.type as Circle).radius = point.radius() / this.props.geometryState.spacing;

        if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
            let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
            if (label) {
                label.setAttrs(this.createLabel(node).getAttrs());
            }
        }
        return { ...node! };
    }

    private updateIntersection = (node: ShapeNode): ShapeNode => {
        const [id1, id2] = node.dependsOn;
        const shape1 = this.props.dag.get(id1);
        const shape2 = this.props.dag.get(id2);

        if (!shape1 || !shape2) {
            return { ...node! };
        }

        const intersections = operation.getIntersections2D(shape1.type, shape2.type);
        if (intersections.length === 1) {
            if (intersections[0].coors === undefined || intersections[0].ambiguous) {
                node.node!.hide();
                if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
                    let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
                    if (label) {
                        label.hide();
                    }
                }

                [(node.type as Point).x, (node.type as Point).y] = [0, 0];
                node.defined = false;
                return { ...node! };

            }

            const pos = utils.convertToScreenCoords(
                { x: intersections[0].coors!.x, y: intersections[0].coors!.y },
                { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            node.node!.position({ x: pos.x, y: pos.y })
            node.node!.show();
            node.defined = true;

            if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
                if (label) {
                    label.show();
                    label.setAttrs(this.createLabel(node).getAttrs());
                }
            }

            this.updatePointPos(node.type as Point, pos.x, pos.y);
            node.defined = intersections[0].coors !== undefined && !intersections[0].ambiguous;
            return { ...node! };
        }

        let match: number = -1;
        let minDist: number = Infinity;
        const p = node.type as Point;

        for (let i = 0; i < intersections.length; i++) {
            if (intersections[i].coors === undefined || intersections[i].ambiguous) {
                continue;
            }

            // Check the closest intersection to the current point position
            if (Math.hypot(p.x - intersections[i].coors!.x, p.y - intersections[i].coors!.y) < minDist) {
                minDist = Math.hypot(p.x - intersections[i].coors!.x, p.y - intersections[i].coors!.y);
                match = i;
            }
        }

        if (match === -1) {
            node.node!.hide();
            if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
                if (label) {
                    label.hide();
                }
            }

            [(node.type as Point).x, (node.type as Point).y] = [0, 0];
            node.defined = false;
            return { ...node! };
        }

        const pos = utils.convertToScreenCoords(
            { x: intersections[match].coors!.x, y: intersections[match].coors!.y },
            { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
            this.props.geometryState.spacing
        );

        node.node!.position({ x: pos.x, y: pos.y })
        node.node!.show();
        node.defined = true;

        if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
            let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
            if (label) {
                label.show();
                label.setAttrs(this.createLabel(node).getAttrs());
            }
        }

        this.updatePointPos(node.type as Point, pos.x, pos.y);
        node.defined = intersections[match].coors !== undefined && !intersections[match].ambiguous;
        return { ...node! };
    }

    private updateAngleBisector = (node: ShapeNode): ShapeNode => {
        let ids = node.dependsOn;
        if (ids.length === 3) {
            // Handle 3 points
            let [shape1, shape2, shape3] = [this.props.dag.get(ids[0]), this.props.dag.get(ids[1]), this.props.dag.get(ids[2])];
            if (!shape1 || !shape2 || !shape3) {
                return node;
            }

            const posA = (shape1).node!.position();
            const posB = (shape2).node!.position();
            const posC = (shape3).node!.position();

            let [A, B, C] = [
                Factory.createPoint(node.type.props, posA.x, posA.y),
                Factory.createPoint(node.type.props, posB.x, posB.y),
                Factory.createPoint(node.type.props, posC.x, posC.y)
            ]

            let line = operation.bisector_angle_line1(A, B, C);
            const dx = line.direction.x;
            const dy = line.direction.y;

            let length = 2 * Math.max(this.props.stageRef.current!.width(), this.props.stageRef.current!.height()) * Math.sqrt(dx * dx + dy * dy) / this.props.geometryState.zoom_level;
            let norm_dx = dx / Math.sqrt(dx * dx + dy * dy);
            let norm_dy = dy / Math.sqrt(dx * dx + dy * dy);

            let l = node.node! as Konva.Line;
            l.points([line.point.x - length * norm_dx, line.point.y - length * norm_dy, line.point.x + length * norm_dx, line.point.y + length * norm_dy]);
            node.node!.show();
            if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
                if (label) {
                    label.show();
                    label.setAttrs(this.createLabel(node).getAttrs());
                }
            }

            this.updatePointPos((node.type as Line).startLine, l.points()[0], l.points()[1]);
            this.updatePointPos((node.type as Line).endLine, l.points()[2], l.points()[3]);
            return { ...node! };
        }

        else if (ids.length === 2) {
            // Handle 2 lines
            let [shape1, shape2] = [this.props.dag.get(ids[0]), this.props.dag.get(ids[1])];
            if (!shape1 || !shape2) {
                return node;
            }

            try {
                const newTangents = operation.bisector_angle_line2(shape1.type as Line, shape2.type as Line);
                const match = (node.side! === 0 ? newTangents[0] : newTangents[1]) || newTangents[0];
                const dx = match.direction.x;
                const dy = match.direction.y;
                let length = 2 * Math.max(this.props.stageRef.current!.width(), this.props.stageRef.current!.height()) * Math.sqrt(dx * dx + dy * dy) / this.props.geometryState.zoom_level;
                let norm_dx = dx / Math.sqrt(dx * dx + dy * dy);
                let norm_dy = dy / Math.sqrt(dx * dx + dy * dy);
                let line: Konva.Line = node.node! as Konva.Line;
                line.points([match.point.x - length * norm_dx, match.point.y - length * norm_dy, match.point.x + length * norm_dx, match.point.y + length * norm_dy]);
                this.updatePointPos((node.type as Line).startLine, line.points()[0], line.points()[1]);
                this.updatePointPos((node.type as Line).endLine, line.points()[2], line.points()[3]);
                line.show();
                node.defined = true;

                if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
                    let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
                    if (label) {
                        label.show();
                        label.setAttrs(this.createLabel(node).getAttrs());
                    }
                }

                return { ...node! };
            }

            catch (error) {
                node.node!.hide();
                node.defined = false;

                if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
                    let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
                    if (label) {
                        label.hide();
                    }
                }

                return { ...node! };
            }
        }

        else {
            return { ...node! };
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

            const posA = (shape1).node!.position();
            const posB = (shape2).node!.position();
            const posC = (shape3).node!.position();

            let [A, B, C] = [
                Factory.createPoint(node.type.props, posA.x, posA.y),
                Factory.createPoint(node.type.props, posB.x, posB.y),
                Factory.createPoint(node.type.props, posC.x, posC.y)
            ]

            const angle = (x: number, y: number): number => {
                let degree = (math.parse('atan2(y, x)').evaluate({ x: x, y: y })) * 180 / Math.PI;
                if (degree < 0) {
                    degree += 360;
                }

                return degree;
            }

            const startAngle = angle(
                (node.type as Angle).vector1.endVector.x - (node.type as Angle).vector1.startVector.x,
                (node.type as Angle).vector1.endVector.y - (node.type as Angle).vector1.startVector.y,
            );

            const endAngle = angle(
                (node.type as Angle).vector2.endVector.x - (node.type as Angle).vector2.startVector.x,
                (node.type as Angle).vector2.endVector.y - (node.type as Angle).vector2.startVector.y,
            )

            let degree = endAngle - startAngle;
            if ((node.type as Angle).range && (node.type as Angle).range[1] === 180) {
                degree = (degree < 0 ? 180 + degree : degree);
            }

            let parent = node.node!.getParent();
            if (parent) {
                let s = (Math.abs(Math.abs(degree) - 90) > constants.EPSILON) ? new Konva.Shape({
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
                    startAngle: -startAngle,
                    angle: degree,
                    fill: node.node!.fill(),
                    stroke: node.node!.stroke(),
                    strokeWidth: node.node!.strokeWidth(),
                    hitStrokeWidth: 5,
                    id: node.node!.id()
                }) : new Konva.Line({
                    x: B.x,
                    y: B.y,
                    points: [
                        0, 0,
                        10 / this.props.geometryState.zoom_level, 0,
                        10 / this.props.geometryState.zoom_level, -10 / this.props.geometryState.zoom_level,
                        0, -10 / this.props.geometryState.zoom_level
                    ],

                    fill: node.node!.fill(),
                    stroke: node.node!.stroke(),
                    strokeWidth: node.node!.strokeWidth(),
                    hitStrokeWidth: 5,
                    rotation: -startAngle,
                    closed: true,
                    draggable: false,
                    id: node.node!.id()
                });

                node.node!.setAttrs(s.getAttrs());
            }

            if (degree === 0) {
                if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
                    let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
                    if (label) {
                        label.hide();
                    }
                }
            }

            else {
                if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
                    let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
                    if (label) {
                        label.show();
                        label.setAttrs(this.createLabel(node).getAttrs());
                    }
                }
            }

            this.updatePointPos((node.type as Angle).vertex!, B.x, B.y);
            this.updatePointPos((node.type as Angle).vector1.startVector, B.x, B.y);
            this.updatePointPos((node.type as Angle).vector1.endVector, A.x, A.y);
            this.updatePointPos((node.type as Angle).vector2.startVector, B.x, B.y);
            this.updatePointPos((node.type as Angle).vector2.endVector, C.x, C.y);
        }

        else if (ids.length === 2) {
            // Handle 2 lines
            let [shape1, shape2] = [this.props.dag.get(ids[0]), this.props.dag.get(ids[1])];
            if (!shape1 || !shape2) {
                return { ...node! };
            }

            // Convert them to Line
            let [start1, end1] = operation.getStartAndEnd(shape1.type);
            let [start2, end2] = operation.getStartAndEnd(shape2.type);

            const v1 = {
                x: end1.x - start1.x,
                y: end1.y - start1.y
            }

            const v2 = {
                x: end2.x - start2.x,
                y: end2.y - start2.y
            }

            const angleFromXAxis = (v: {x: number, y: number}): number => {
                let degree = (math.parse('atan2(y, x)').evaluate({ x: v.x, y: v.y })) * 180 / Math.PI;
                if (degree < 0) {
                    degree += 360;
                }

                return degree;
            }

            let angle = angleFromXAxis(v2) - angleFromXAxis(v1);
            if ((node.type as Angle).range && (node.type as Angle).range[1] === 180) {
                angle = (angle < 0 ? angle + 180 : angle);
            }

            let intersection = operation.getIntersections2D(shape1.type as Line, shape2.type as Line);
            let vertex: Point | undefined = intersection[0].coors === undefined ? undefined :
                Factory.createPoint(
                    utils.createPointDefaultShapeProps(''),
                    intersection[0].coors.x,
                    intersection[0].coors.y
                )

            if (angle === 0 || !vertex) {
                if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
                    let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
                    if (label) {
                        label.hide();
                    }
                }

                node.node!.hide();
                node.defined = false;
            }

            else {
                let parent = node.node!.getParent();
                if (parent) {
                    let s = Math.abs(angle) !== 90 ? new Konva.Shape({
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
                        x: utils.convertToScreenCoords(
                            {x: vertex.x,y: vertex.y},
                            {x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2},
                            this.props.geometryState.spacing
                        ).x,
                        y: utils.convertToScreenCoords(
                            {x: vertex.x,y: vertex.y},
                            {x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2},
                            this.props.geometryState.spacing
                        ).y,
                        radius: 10,
                        startAngle: -angleFromXAxis(v1),
                        angle: angle,
                        fill: node.node!.fill(),
                        stroke: node.node!.stroke(),
                        strokeWidth: node.node!.strokeWidth(),
                        hitStrokeWidth: 5,
                        id: node.node!.id()
                    }) : new Konva.Line({
                        x: utils.convertToScreenCoords(
                            {x: vertex.x,y: vertex.y},
                            {x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2},
                            this.props.geometryState.spacing
                        ).x,
                        y: utils.convertToScreenCoords(
                            {x: vertex.x,y: vertex.y},
                            {x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2},
                            this.props.geometryState.spacing
                        ).y,
                        points: [
                            0, 0,
                            10, 0,
                            10, -10,
                            0, -10
                        ],

                        fill: node.node!.fill(),
                        stroke: node.node!.stroke(),
                        strokeWidth: node.node!.strokeWidth(),
                        hitStrokeWidth: 5,
                        rotation: -angleFromXAxis(v1),
                        closed: true,
                        draggable: false,
                        id: node.node!.id()
                    });

                    node.node!.setAttrs(s.getAttrs());
                }

                node.defined = true;

                if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
                    let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
                    if (label) {
                        label.show();
                        label.setAttrs(this.createLabel(node).getAttrs());
                    }
                }
            }

            if (!(node.type as Angle).vertex || !vertex) {
                (node.type as Angle).vertex = vertex;
            }

            else {
                (node.type as Angle).vertex!.x = vertex!.x;
                (node.type as Angle).vertex!.y = vertex!.y;
            }

            (node.type as Angle).vector1.startVector.x = start1.x;
            (node.type as Angle).vector1.startVector.y = start1.y;
            (node.type as Angle).vector1.endVector.x = end1.x;
            (node.type as Angle).vector1.endVector.y = end1.y;
            (node.type as Angle).vector2.startVector.x = start2.x;
            (node.type as Angle).vector2.startVector.y = start2.y;
            (node.type as Angle).vector2.endVector.x = end2.x;
            (node.type as Angle).vector2.endVector.y = end2.y;
        }

        return { ...node! };
    }

    private updateCircle3Point = (node: ShapeNode): ShapeNode => {
        const [id1, id2, id3] = node.dependsOn;
        const [p1, p2, p3] = [this.props.dag.get(id1), this.props.dag.get(id2), this.props.dag.get(id3)];
        if (!p1 || !p2 || !p3) {
            return { ...node! };
        }

        const posA = (p1).node!.position();
        const posB = (p2).node!.position();
        const posC = (p3).node!.position();

        let [A, B, C] = [
            Factory.createPoint(node.type.props, posA.x, posA.y),
            Factory.createPoint(node.type.props, posB.x, posB.y),
            Factory.createPoint(node.type.props, posC.x, posC.y)
        ]

        try {
            let [circumcenter, circumradius] = [operation.circumcenter(A, B, C), operation.circumradius(A, B, C)];
            let circle = node.node! as Konva.Circle;
            circle.position({ x: circumcenter.x, y: circumcenter.y });
            circle.radius(circumradius);
            node.node!.show();
            node.defined = true;

            this.updatePointPos((node.type as Circle).centerC, circumcenter.x, circumcenter.y);
            (node.type as Circle).radius = circumradius / this.props.geometryState.spacing;

            if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
                if (label) {
                    label.show();
                    label.setAttrs(this.createLabel(node).getAttrs());
                }
            }

            return { ...node! };
        }

        catch (error) {
            node.node!.hide();
            node.defined = false;
            if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
                if (label) {
                    label.hide();
                    label.setAttrs(this.createLabel(node).getAttrs());
                }
            }

            return { ...node! };
        }
    }

    private updateIncircle3Point = (node: ShapeNode): ShapeNode => {
        const [id1, id2, id3] = node.dependsOn;
        const [p1, p2, p3] = [this.props.dag.get(id1), this.props.dag.get(id2), this.props.dag.get(id3)];
        if (!p1 || !p2 || !p3) {
            return { ...node! };
        }

        const posA = (p1).node!.position();
        const posB = (p2).node!.position();
        const posC = (p3).node!.position();

        let [A, B, C] = [
            Factory.createPoint(node.type.props, posA.x, posA.y),
            Factory.createPoint(node.type.props, posB.x, posB.y),
            Factory.createPoint(node.type.props, posC.x, posC.y)
        ]

        try {
            let [incenter, inradius] = [operation.incenter(A, B, C), operation.inradius(A, B, C)];
            let circle = node.node! as Konva.Circle;
            circle.position({ x: incenter.x, y: incenter.y });
            circle.radius(inradius);
            node.node!.show();
            node.defined = true;

            this.updatePointPos((node.type as Circle).centerC, incenter.x, incenter.y);
            (node.type as Circle).radius = inradius / this.props.geometryState.spacing;

            if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
                if (label) {
                    label.show();
                    label.setAttrs(this.createLabel(node).getAttrs());
                }
            }

            return { ...node! };
        }

        catch (error) {
            node.node!.hide();
            node.defined = false;
            if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
                if (label) {
                    label.hide();
                }
            }

            return { ...node! };
        }
    }

    private updateSemiCircle = (node: ShapeNode): ShapeNode => {
        const [id1, id2] = node.dependsOn;
        const [start, end] = [this.props.dag.get(id1), this.props.dag.get(id2)];
        if (!start || !end) {
            return { ...node! };
        }

        const posA = (start).node!.position();
        const posB = (end).node!.position();

        let [A, B] = [
            Factory.createPoint(node.type.props, posA.x, posA.y),
            Factory.createPoint(node.type.props, posB.x, posB.y)
        ]

        let M = operation.midPoint(A, B);
        let MB = {
            x: B.x - M.x,
            y: B.y - M.y
        }

        const angleFromXAxis = (v: { x: number, y: number }) => {
            return (math.parse('atan2(y, x)').evaluate({ x: v.x, y: v.y })) * 180 / Math.PI;
        }

        let startAngle = utils.cleanAngle(angleFromXAxis(MB));

        let arc = node.node! as Konva.Arc;
        arc.innerRadius(math.hypot(MB.x, MB.y));
        arc.outerRadius(math.hypot(MB.x, MB.y));
        arc.angle(180);
        arc.position({ x: M.x, y: M.y });
        arc.rotation(startAngle);

        if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
            let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
            if (label) {
                label.setAttrs(this.createLabel(node).getAttrs());
            }
        }

        this.updatePointPos((node.type as SemiCircle).start, A.x, A.y);
        this.updatePointPos((node.type as SemiCircle).end, B.x, B.y);
        return { ...node! };
    }

    private updateReflection = (node: ShapeNode): ShapeNode => {
        const [id1, id2] = node.dependsOn;
        const shape1 = this.props.dag.get(id1);
        const shape2 = this.props.dag.get(id2);

        if (!shape1 || !shape2) {
            return { ...node! };
        }

        // shape1 is object, shape2 is mirror
        let reflected = operation.reflection(shape1.type, shape2.type);
        if ('x' in reflected && 'y' in reflected) {
            // reflected is Point
            let p = node.node! as Konva.Circle;
            const screenPos = utils.convertToScreenCoords(
                { x: reflected.x, y: reflected.y },
                { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            p.position({ x: screenPos.x, y: screenPos.y });
            (node.type as Point).x = reflected.x;
            (node.type as Point).y = reflected.y;
        }

        else if ('radius' in reflected && 'centerC' in reflected) {
            // reflected is Circle
            let p = node.node! as Konva.Circle;
            const screenPos = utils.convertToScreenCoords(
                { x: (reflected as Circle).centerC.x, y: (reflected as Circle).centerC.y },
                { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            p.position({ x: screenPos.x, y: screenPos.y });
            p.radius(reflected.radius * this.props.geometryState.spacing);
            (node.type as Circle).centerC.x = (reflected as Circle).centerC.x;
            (node.type as Circle).centerC.y = (reflected as Circle).centerC.y;
            (node.type as Circle).radius = (reflected as Circle).radius;
        }

        else if ('points' in reflected) {
            let p = node.node! as Konva.Line;
            let points: number[] = [];
            (reflected as Polygon).points.forEach((p: Point) => {
                const screenPos = utils.convertToScreenCoords(
                    { x: p.x, y: p.y },
                    { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                    this.props.geometryState.spacing
                );
                points.push(screenPos.x, screenPos.y);
            });

            p.points(points);
            (node.type as Polygon).points.forEach((point, idx) => {
                [point.x, point.y] = [(reflected as Polygon).points[idx].x, (reflected as Polygon).points[idx].y]
            });
        }

        else if ('startLine' in reflected) {
            const screenPosStart = utils.convertToScreenCoords(
                { x: (reflected as Line).startLine.x, y: (reflected as Line).startLine.y },
                { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            const screenPosEnd = utils.convertToScreenCoords(
                { x: (reflected as Line).endLine.x, y: (reflected as Line).endLine.y },
                { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            let l = node.node! as Konva.Line;
            const dx = screenPosEnd.x - screenPosStart.x;
            const dy = screenPosEnd.y - screenPosStart.y;

            let length = 2 * Math.max(this.props.stageRef.current!.width(), this.props.stageRef.current!.height()) * Math.sqrt(dx * dx + dy * dy) / this.props.geometryState.zoom_level;
            let norm_dx = dx / Math.sqrt(dx * dx + dy * dy);
            let norm_dy = dy / Math.sqrt(dx * dx + dy * dy);

            l.points([screenPosStart.x - length * norm_dx, screenPosStart.y - length * norm_dy, screenPosStart.x + length * norm_dx, screenPosStart.y + length * norm_dy]);
            [(node.type as Line).startLine.x, (node.type as Line).startLine.y] = [(reflected as Line).startLine.x, (reflected as Line).startLine.y];
            [(node.type as Line).endLine.x, (node.type as Line).endLine.y] = [(reflected as Line).endLine.x, (reflected as Line).endLine.y];
        }

        else if ('startVector' in reflected) {
            let l = node.node! as Konva.Arrow;
            const screenPosStart = utils.convertToScreenCoords(
                { x: (reflected as Vector).startVector.x, y: (reflected as Vector).startVector.y },
                { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            const screenPosEnd = utils.convertToScreenCoords(
                { x: (reflected as Vector).endVector.x, y: (reflected as Vector).endVector.y },
                { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            l.points([screenPosStart.x, screenPosStart.y, screenPosEnd.x, screenPosEnd.y]);
            [(node.type as Vector).startVector.x, (node.type as Vector).startVector.y] = [(reflected as Vector).startVector.x, (reflected as Vector).startVector.y];
            [(node.type as Vector).endVector.x, (node.type as Vector).endVector.y] = [(reflected as Vector).endVector.x, (reflected as Vector).endVector.y];
        }

        else if ('startSegment' in reflected) {
            let l = node.node! as Konva.Line;
            const screenPosStart = utils.convertToScreenCoords(
                { x: (reflected as Segment).startSegment.x, y: (reflected as Segment).startSegment.y },
                { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            const screenPosEnd = utils.convertToScreenCoords(
                { x: (reflected as Segment).endSegment.x, y: (reflected as Segment).endSegment.y },
                { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            l.points([screenPosStart.x, screenPosStart.y, screenPosEnd.x, screenPosEnd.y]);
            [(node.type as Segment).startSegment.x, (node.type as Segment).startSegment.y] = [(reflected as Segment).startSegment.x, (reflected as Segment).startSegment.y];
            [(node.type as Segment).endSegment.x, (node.type as Segment).endSegment.y] = [(reflected as Segment).endSegment.x, (reflected as Segment).endSegment.y];
        }

        else if ('startRay' in reflected) {
            let l = node.node! as Konva.Line;
            const screenPosStart = utils.convertToScreenCoords(
                { x: (reflected as Ray).startRay.x, y: (reflected as Ray).startRay.y },
                { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            const screenPosEnd = utils.convertToScreenCoords(
                { x: (reflected as Ray).endRay.x, y: (reflected as Ray).endRay.y },
                { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            const dx = screenPosEnd.x - screenPosStart.x;
            const dy = screenPosEnd.y - screenPosStart.y;

            let length = 2 * Math.max(this.props.stageRef.current!.width(), this.props.stageRef.current!.height()) * Math.sqrt(dx * dx + dy * dy) / this.props.geometryState.zoom_level;
            let norm_dx = dx / Math.sqrt(dx * dx + dy * dy);
            let norm_dy = dy / Math.sqrt(dx * dx + dy * dy);

            l.points([screenPosStart.x, screenPosStart.y, screenPosStart.x + length * norm_dx, screenPosStart.y + length * norm_dy]);
            [(node.type as Ray).startRay.x, (node.type as Ray).startRay.y] = [(reflected as Ray).startRay.x, (reflected as Ray).startRay.y];
            [(node.type as Ray).endRay.x, (node.type as Ray).endRay.y] = [(reflected as Ray).endRay.x, (reflected as Ray).endRay.y];
        }

        else if ('start' in reflected && 'end' in reflected) {
            let arc = node.node! as Konva.Arc;
            const screenPosStart = utils.convertToScreenCoords(
                { x: reflected.start.x, y: reflected.start.y },
                { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            const screenPosEnd = utils.convertToScreenCoords(
                { x: reflected.end.x, y: reflected.end.y },
                { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            arc.position({ x: (screenPosEnd.x + screenPosStart.x) / 2, y: (screenPosEnd.y + screenPosStart.y) / 2 });
            [(node.type as SemiCircle).start.x, (node.type as SemiCircle).start.y] = [reflected.start.x, reflected.start.y];
            [(node.type as SemiCircle).end.x, (node.type as SemiCircle).end.y] = [reflected.end.x, reflected.end.y];
        }

        if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
            let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
            if (label) {
                label.setAttrs(this.createLabel(node).getAttrs());
            }
        }

        return { ...node! };
    }

    private updateTangentLine = (node: ShapeNode): ShapeNode => {
        const [pointId, circleId] = node.dependsOn;
        const point = this.props.dag.get(pointId);
        const circle = this.props.dag.get(circleId);
        if (!point || !circle) return { ...node! };

        let [A, c] = [
            Factory.createPoint(
                point.type.props,
                point.node!.x(),
                point.node!.y()
            ),

            Factory.createCircle(
                circle.type.props,
                Factory.createPoint(
                    utils.createPointDefaultShapeProps(''),
                    circle.node!.x(),
                    circle.node!.y()
                ),
                (circle.node! as Konva.Circle).radius(),
            )
        ]

        const newTangents = operation.tangentLine(A, c); // returns 0-2 lines
        if (newTangents.length === 0) {
            // No tangents found, hide the line
            node.node!.hide();
            node.defined = false;
            if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
                if (label) {
                    label.hide();
                }
            }

            return { ...node! };
        }

        if (newTangents.length === 1) {
            // If there is only one tangent, we can use it directly
            let l = newTangents[0];
            const dx = l.direction.x;
            const dy = l.direction.y;
            let length = 2 * Math.max(this.props.stageRef.current!.width(), this.props.stageRef.current!.height()) * Math.sqrt(dx * dx + dy * dy) / this.props.geometryState.zoom_level;
            let norm_dx = dx / Math.sqrt(dx * dx + dy * dy);
            let norm_dy = dy / Math.sqrt(dx * dx + dy * dy);
            let line: Konva.Line = node.node! as Konva.Line;
            const pos = utils.convertToScreenCoords(
                { x: l.point.x, y: l.point.y },
                { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            line.points([pos.x - length * norm_dx, pos.y - length * norm_dy, pos.x + length * norm_dx, pos.y + length * norm_dy]);
            [(node.type as Line).startLine.x, (node.type as Line).startLine.y] = [(point.type as Point).x, (point.type as Point).y];
            [(node.type as Line).endLine.x, (node.type as Line).endLine.y] = [(point.type as Point).x + norm_dx, (point.type as Point).y + norm_dy];

            node.side! === 0 ? (node.node! as Konva.Line).show() : (node.node! as Konva.Line).hide();
            node.defined = true;
            if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
                if (label) {
                    if (node.side === 1) {
                        label.hide();
                    }

                    else {
                        label.show();
                        label.setAttrs(this.createLabel(node).getAttrs());
                    }
                }
            }

            return { ...node! };
        }

        const match = (node.side! === 0 ? newTangents[0] : newTangents[1]) || newTangents[0];
        if (match.ambiguous) {
            node.node!.hide();
            node.defined = false;

            if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
                if (label) {
                    label.hide();
                }
            }

            return { ...node! };
        }

        const dx = match.direction.x;
        const dy = match.direction.y;
        let length = 2 * Math.max(this.props.stageRef.current!.width(), this.props.stageRef.current!.height()) * Math.sqrt(dx * dx + dy * dy) / this.props.geometryState.zoom_level;
        let norm_dx = dx / Math.sqrt(dx * dx + dy * dy);
        let norm_dy = dy / Math.sqrt(dx * dx + dy * dy);

        const pos = utils.convertToScreenCoords(
            { x: match.point.x, y: match.point.y },
            { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
            this.props.geometryState.spacing
        )

        let line: Konva.Line = node.node! as Konva.Line;
        line.points([pos.x - length * norm_dx, pos.y - length * norm_dy, pos.x + length * norm_dx, pos.y + length * norm_dy]);
        [(node.type as Line).startLine.x, (node.type as Line).startLine.y] = [(point.type as Point).x, (point.type as Point).y];
        [(node.type as Line).endLine.x, (node.type as Line).endLine.y] = [(point.type as Point).x + norm_dx, (point.type as Point).y + norm_dy];
        line.show();
        node.defined = true;

        if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
            let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
            if (label) {
                label.show();
                label.setAttrs(this.createLabel(node).getAttrs());
            }
        }

        return { ...node! };
    }

    private updatePerpendicularBisector = (node: ShapeNode): ShapeNode => {
        // Only depends on segment ID or 2 points
        if (node.dependsOn.length === 1) {
            const shape = this.props.dag.get(node.dependsOn[0]);
            if (!shape) {
                return { ...node! };
            }

            const [s, e] = operation.getStartAndEnd(shape.type);
            let midPoint = {
                x: (s.x + e.x) / 2,
                y: (s.y + e.y) / 2
            }

            const dx = e.x - s.x;
            const dy = e.y - s.y;

            const ux = -dy, uy = dx;

            let length = 2 * Math.max(this.props.stageRef.current!.width(), this.props.stageRef.current!.height()) * Math.sqrt(ux * ux + uy * uy) / this.props.geometryState.zoom_level;
            let norm_ux = ux / Math.sqrt(ux * ux + uy * uy);
            let norm_uy = uy / Math.sqrt(ux * ux + uy * uy);

            const pointPos = utils.convertToScreenCoords(
                midPoint,
                { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            let line: Konva.Line = node.node! as Konva.Line;
            line.points([pointPos.x - length * norm_ux, pointPos.y - length * norm_uy, pointPos.x + length * norm_ux, pointPos.y + length * norm_uy]);
            [(node.type as Line).startLine.x, (node.type as Line).startLine.y] = [midPoint.x, midPoint.y];
            [(node.type as Line).endLine.x, (node.type as Line).endLine.y] = [midPoint.x + norm_ux, midPoint.y + norm_uy];

            if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
                if (label) {
                    label.setAttrs(this.createLabel(node).getAttrs());
                }
            }
        }

        else if (node.dependsOn.length === 2) {
            const [id1, id2] = node.dependsOn;
            const [start, end] = [this.props.dag.get(id1), this.props.dag.get(id2)];
            if (!start || !end) {
                return { ...node! };
            }

            const posA = (start).node!.position();
            const posB = (end).node!.position();

            let midPoint = {
                x: (posA.x + posB.x) / 2,
                y: (posA.y + posB.y) / 2
            }

            const dx = posB.x - posA.x;
            const dy = posB.y - posA.y;

            const ux = -dy, uy = dx;

            let length = 2 * Math.max(this.props.stageRef.current!.width(), this.props.stageRef.current!.height()) * Math.sqrt(ux * ux + uy * uy) / this.props.geometryState.zoom_level;
            let norm_ux = ux / Math.sqrt(ux * ux + uy * uy);
            let norm_uy = uy / Math.sqrt(ux * ux + uy * uy);

            const pointPos = utils.convertToCustomCoords(
                midPoint,
                { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            let line: Konva.Line = node.node! as Konva.Line;
            line.points([midPoint.x - length * norm_ux, midPoint.y - length * norm_uy, midPoint.x + length * norm_ux, midPoint.y + length * norm_uy]);
            [(node.type as Line).startLine.x, (node.type as Line).startLine.y] = [pointPos.x, pointPos.y];
            [(node.type as Line).endLine.x, (node.type as Line).endLine.y] = [pointPos.x + norm_ux, pointPos.y + norm_uy];

            if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
                if (label) {
                    label.setAttrs(this.createLabel(node).getAttrs());
                }
            }
        }

        return { ...node! };
    }

    private updatePerpendicularLine = (node: ShapeNode): ShapeNode => {
        const [id1, id2] = node.dependsOn;
        const [start, end] = [this.props.dag.get(id1), this.props.dag.get(id2)];
        if (!start || !end) {
            return { ...node! };
        }

        const pointPos = ((start).node! as Konva.Circle).position();
        const [s, e] = operation.getStartAndEnd(end.type);
        const dx = e.x - s.x;
        const dy = e.y - s.y;
        const ux = -dy, uy = dx;

        let length = 2 * Math.max(this.props.stageRef.current!.width(), this.props.stageRef.current!.height()) * Math.sqrt(ux * ux + uy * uy) / this.props.geometryState.zoom_level;
        let norm_ux = ux / Math.sqrt(ux * ux + uy * uy);
        let norm_uy = uy / Math.sqrt(ux * ux + uy * uy);

        const pointCustom = utils.convertToCustomCoords(
            pointPos,
            { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
            this.props.geometryState.spacing
        );

        let line: Konva.Line = node.node! as Konva.Line;
        line.points([pointPos.x - length * norm_ux, pointPos.y - length * norm_uy, pointPos.x + length * norm_ux, pointPos.y + length * norm_uy]);
        [(node.type as Line).startLine.x, (node.type as Line).startLine.y] = [pointCustom.x, pointCustom.y];
        [(node.type as Line).endLine.x, (node.type as Line).endLine.y] = [pointCustom.x + norm_ux, pointCustom.y + norm_uy];
        if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
            let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
            if (label) {
                label.setAttrs(this.createLabel(node).getAttrs());
            }
        }

        return { ...node! };
    }

    private updateParallelLine = (node: ShapeNode): ShapeNode => {
        const [id1, id2] = node.dependsOn;
        const [start, end] = [this.props.dag.get(id1), this.props.dag.get(id2)];
        if (!start || !end) {
            return { ...node! };
        }

        const pointPos = ((start).node! as Konva.Circle).position();
        const [s, e] = operation.getStartAndEnd(end.type);
        const dx = e.x - s.x;
        const dy = e.y - s.y;
        const ux = dx, uy = dy;

        let length = 2 * Math.max(this.props.stageRef.current!.width(), this.props.stageRef.current!.height()) * Math.sqrt(ux * ux + uy * uy) / this.props.geometryState.zoom_level;
        let norm_ux = ux / Math.sqrt(ux * ux + uy * uy);
        let norm_uy = uy / Math.sqrt(ux * ux + uy * uy);

        const pointCustom = utils.convertToCustomCoords(
            pointPos,
            { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
            this.props.geometryState.spacing
        );

        let line: Konva.Line = node.node! as Konva.Line;
        line.points([pointPos.x - length * norm_ux, pointPos.y - length * norm_uy, pointPos.x + length * norm_ux, pointPos.y + length * norm_uy]);
        [(node.type as Line).startLine.x, (node.type as Line).startLine.y] = [pointCustom.x, pointCustom.y];
        [(node.type as Line).endLine.x, (node.type as Line).endLine.y] = [pointCustom.x + norm_ux, pointCustom.y + norm_uy];
        if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
            let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
            if (label) {
                label.setAttrs(this.createLabel(node).getAttrs());
            }
        }

        return { ...node! };
    }

    private updateProjection = (node: ShapeNode): ShapeNode => {
        const [id1, id2] = node.dependsOn;
        const [shape1, shape2] = [this.props.dag.get(id1), this.props.dag.get(id2)];
        if (!shape1 || !shape2) {
            return { ...node! };
        }

        let projected_point = operation.point_projection(
            shape1.type as Point,
            shape2.type
        )

        let point = node.node! as Konva.Circle;
        const newPos = utils.convertToScreenCoords(
            { x: projected_point.x, y: projected_point.y },
            { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
            this.props.geometryState.spacing
        );

        point.position({ x: newPos.x, y: newPos.y });
        [(node.type as Point).x, (node.type as Point).y] = [projected_point.x, projected_point.y];
        if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
            let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
            if (label) {
                label.setAttrs(this.createLabel(node).getAttrs());
            }
        }

        return { ...node! };
    }

    private updateExcircle = (node: ShapeNode): ShapeNode => {
        const [id1, id2, id3] = node.dependsOn;
        const [p1, p2, p3] = [this.props.dag.get(id1), this.props.dag.get(id2), this.props.dag.get(id3)];
        if (!p1 || !p2 || !p3) {
            return { ...node! };
        }

        const posA = (p1).node!.position();
        const posB = (p2).node!.position();
        const posC = (p3).node!.position();

        let [A, B, C] = [
            Factory.createPoint(node.type.props, posA.x, posA.y),
            Factory.createPoint(node.type.props, posB.x, posB.y),
            Factory.createPoint(node.type.props, posC.x, posC.y)
        ]

        try {
            let [excenter, exradius] = [operation.excenter(A, B, C), operation.exradius(A, B, C)];
            let circle = node.node! as Konva.Circle;
            let idx = 0, minDst = math.parse('sqrt(x^2 + y^2)').evaluate({ x: excenter[0].x - circle.x(), y: excenter[0].y - circle.y() });
            excenter.forEach((center, i) => {
                const newDst = math.parse('sqrt(x^2 + y^2)').evaluate({ x: center.x - circle.x(), y: center.y - circle.y() });
                if (newDst <= minDst) {
                    minDst = newDst;
                    idx = i;
                }
            });

            circle.position({ x: excenter[idx].x, y: excenter[idx].y });
            circle.radius(exradius[idx]);
            node.node!.show();
            node.defined = true;

            this.updatePointPos((node.type as Circle).centerC, excenter[idx].x, excenter[idx].y);
            (node.type as Circle).radius = exradius[idx] / this.props.geometryState.spacing;

            if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
                if (label) {
                    label.setAttrs(this.createLabel(node).getAttrs());
                }
            }

            return { ...node! };
        }

        catch (error) {
            node.node!.hide();
            node.defined = false;
            if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
                if (label) {
                    label.show()
                    label.setAttrs(this.createLabel(node).getAttrs());
                }
            }

            return { ...node! };
        }
    }

    private updateExcenter = (node: ShapeNode): ShapeNode => {
        const [id1, id2, id3] = node.dependsOn;
        const [p1, p2, p3] = [this.props.dag.get(id1), this.props.dag.get(id2), this.props.dag.get(id3)];
        if (!p1 || !p2 || !p3) {
            return { ...node! };
        }

        const posA = (p1).node!.position();
        const posB = (p2).node!.position();
        const posC = (p3).node!.position();

        let [A, B, C] = [
            Factory.createPoint(node.type.props, posA.x, posA.y),
            Factory.createPoint(node.type.props, posB.x, posB.y),
            Factory.createPoint(node.type.props, posC.x, posC.y)
        ]

        try {
            let excenter = operation.excenter(A, B, C);
            let circle = node.node! as Konva.Circle;
            let idx = 0, minDst = math.parse('sqrt(x^2 + y^2)').evaluate({ x: excenter[0].x - circle.x(), y: excenter[0].y - circle.y() });
            excenter.forEach((center, i) => {
                const newDst = math.parse('sqrt(x^2 + y^2)').evaluate({ x: center.x - circle.x(), y: center.y - circle.y() });
                if (newDst <= minDst) {
                    minDst = newDst;
                    idx = i;
                }
            });

            let point = node.node! as Konva.Circle;
            point.position({ x: excenter[idx].x, y: excenter[idx].y });
            point.show();
            node.defined = true;
            this.updatePointPos(node.type as Point, excenter[idx].x, excenter[idx].y);

            if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
                if (label) {
                    label.show()
                    label.setAttrs(this.createLabel(node).getAttrs());
                }
            }

            this.updatePointPos((node.type as Point), point.x(), point.y());
            return { ...node! };
        }

        catch (error) {
            node.node!.hide();
            node.defined = false;

            if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
                let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
                if (label) {
                    label.hide();
                }
            }

            return { ...node! };
        }
    }

    private updateRotation = (node: ShapeNode): ShapeNode => {
        const [id1, id2] = node.dependsOn;
        const [p1, p2] = [this.props.dag.get(id1), this.props.dag.get(id2)];
        if (!p1 || !p2) {
            return { ...node! };
        }

        if (node.rotationFactor === undefined) {
            return { ...node! };
        }

        let rotated_obj = operation.rotation(
            p1.type, p2.type, node.rotationFactor.degree, node.rotationFactor.CCW
        );

        if ('x' in rotated_obj && 'y' in rotated_obj) {
            // rotated_obj is Point
            let p = node.node! as Konva.Circle;
            const screenPos = utils.convertToScreenCoords(
                { x: rotated_obj.x, y: rotated_obj.y },
                { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            p.position({ x: screenPos.x, y: screenPos.y });
            (node.type as Point).x = rotated_obj.x;
            (node.type as Point).y = rotated_obj.y;
        }

        else if ('radius' in rotated_obj && 'centerC' in rotated_obj) {
            // rotated_obj is Circle
            let p = node.node! as Konva.Circle;
            const screenPos = utils.convertToScreenCoords(
                { x: (rotated_obj as Circle).centerC.x, y: (rotated_obj as Circle).centerC.y },
                { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            p.position({ x: screenPos.x, y: screenPos.y });
            p.radius(rotated_obj.radius * this.props.geometryState.spacing);
            (node.type as Circle).centerC.x = (rotated_obj as Circle).centerC.x;
            (node.type as Circle).centerC.y = (rotated_obj as Circle).centerC.y;
            (node.type as Circle).radius = (rotated_obj as Circle).radius;
        }

        else if ('points' in rotated_obj) {
            let p = node.node! as Konva.Line;
            let points: number[] = [];
            (rotated_obj as Polygon).points.forEach((p: Point) => {
                const screenPos = utils.convertToScreenCoords(
                    { x: p.x, y: p.y },
                    { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                    this.props.geometryState.spacing
                );
                points.push(screenPos.x, screenPos.y);
            });

            p.points(points);
            (node.type as Polygon).points.forEach((point, idx) => {
                [point.x, point.y] = [(rotated_obj as Polygon).points[idx].x, (rotated_obj as Polygon).points[idx].y]
            });
        }

        else if ('startLine' in rotated_obj) {
            const screenPosStart = utils.convertToScreenCoords(
                { x: (rotated_obj as Line).startLine.x, y: (rotated_obj as Line).startLine.y },
                { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            const screenPosEnd = utils.convertToScreenCoords(
                { x: (rotated_obj as Line).endLine.x, y: (rotated_obj as Line).endLine.y },
                { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            let l = node.node! as Konva.Line;
            const dx = screenPosEnd.x - screenPosStart.x;
            const dy = screenPosEnd.y - screenPosStart.y;

            let length = 2 * Math.max(this.props.stageRef.current!.width(), this.props.stageRef.current!.height()) * Math.sqrt(dx * dx + dy * dy) / this.props.geometryState.zoom_level;
            let norm_dx = dx / Math.sqrt(dx * dx + dy * dy);
            let norm_dy = dy / Math.sqrt(dx * dx + dy * dy);

            l.points([screenPosStart.x - length * norm_dx, screenPosStart.y - length * norm_dy, screenPosStart.x + length * norm_dx, screenPosStart.y + length * norm_dy]);
            [(node.type as Line).startLine.x, (node.type as Line).startLine.y] = [(rotated_obj as Line).startLine.x, (rotated_obj as Line).startLine.y];
            [(node.type as Line).endLine.x, (node.type as Line).endLine.y] = [(rotated_obj as Line).endLine.x, (rotated_obj as Line).endLine.y];
        }

        else if ('startVector' in rotated_obj) {
            let l = node.node! as Konva.Arrow;
            const screenPosStart = utils.convertToScreenCoords(
                { x: (rotated_obj as Vector).startVector.x, y: (rotated_obj as Vector).startVector.y },
                { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            const screenPosEnd = utils.convertToScreenCoords(
                { x: (rotated_obj as Vector).endVector.x, y: (rotated_obj as Vector).endVector.y },
                { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            l.points([screenPosStart.x, screenPosStart.y, screenPosEnd.x, screenPosEnd.y]);
            [(node.type as Vector).startVector.x, (node.type as Vector).startVector.y] = [(rotated_obj as Vector).startVector.x, (rotated_obj as Vector).startVector.y];
            [(node.type as Vector).endVector.x, (node.type as Vector).endVector.y] = [(rotated_obj as Vector).endVector.x, (rotated_obj as Vector).endVector.y];
        }

        else if ('startSegment' in rotated_obj) {
            let l = node.node! as Konva.Line;
            const screenPosStart = utils.convertToScreenCoords(
                { x: (rotated_obj as Segment).startSegment.x, y: (rotated_obj as Segment).startSegment.y },
                { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            const screenPosEnd = utils.convertToScreenCoords(
                { x: (rotated_obj as Segment).endSegment.x, y: (rotated_obj as Segment).endSegment.y },
                { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            l.points([screenPosStart.x, screenPosStart.y, screenPosEnd.x, screenPosEnd.y]);
            [(node.type as Segment).startSegment.x, (node.type as Segment).startSegment.y] = [(rotated_obj as Segment).startSegment.x, (rotated_obj as Segment).startSegment.y];
            [(node.type as Segment).endSegment.x, (node.type as Segment).endSegment.y] = [(rotated_obj as Segment).endSegment.x, (rotated_obj as Segment).endSegment.y];
        }

        else if ('startRay' in rotated_obj) {
            let l = node.node! as Konva.Line;
            const screenPosStart = utils.convertToScreenCoords(
                { x: (rotated_obj as Ray).startRay.x, y: (rotated_obj as Ray).startRay.y },
                { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            const screenPosEnd = utils.convertToScreenCoords(
                { x: (rotated_obj as Ray).endRay.x, y: (rotated_obj as Ray).endRay.y },
                { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            const dx = screenPosEnd.x - screenPosStart.x;
            const dy = screenPosEnd.y - screenPosStart.y;

            let length = 2 * Math.max(this.props.stageRef.current!.width(), this.props.stageRef.current!.height()) * Math.sqrt(dx * dx + dy * dy) / this.props.geometryState.zoom_level;
            let norm_dx = dx / Math.sqrt(dx * dx + dy * dy);
            let norm_dy = dy / Math.sqrt(dx * dx + dy * dy);

            l.points([screenPosStart.x, screenPosStart.y, screenPosStart.x + length * norm_dx, screenPosStart.y + length * norm_dy]);
            [(node.type as Ray).startRay.x, (node.type as Ray).startRay.y] = [(rotated_obj as Ray).startRay.x, (rotated_obj as Ray).startRay.y];
            [(node.type as Ray).endRay.x, (node.type as Ray).endRay.y] = [(rotated_obj as Ray).endRay.x, (rotated_obj as Ray).endRay.y];
        }

        else if ('start' in rotated_obj && 'end' in rotated_obj) {
            let arc = node.node! as Konva.Arc;
            const screenPosStart = utils.convertToScreenCoords(
                { x: rotated_obj.start.x, y: rotated_obj.start.y },
                { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            const screenPosEnd = utils.convertToScreenCoords(
                { x: rotated_obj.end.x, y: rotated_obj.end.y },
                { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            arc.position({ x: (screenPosEnd.x + screenPosStart.x) / 2, y: (screenPosEnd.y + screenPosStart.y) / 2 });
            [(node.type as SemiCircle).start.x, (node.type as SemiCircle).start.y] = [rotated_obj.start.x, rotated_obj.start.y];
            [(node.type as SemiCircle).end.x, (node.type as SemiCircle).end.y] = [rotated_obj.end.x, rotated_obj.end.y];
        }

        if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
            let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
            if (label) {
                label.setAttrs(this.createLabel(node).getAttrs());
            }
        }

        return { ...node! };
    }

    private updateEnlarge = (node: ShapeNode): ShapeNode => {
        const [id1, id2] = node.dependsOn;
        const [p1, p2] = [this.props.dag.get(id1), this.props.dag.get(id2)];
        if (!p1 || !p2) {
            return { ...node! };
        }

        if (node.scaleFactor === undefined) {
            return { ...node! };
        }

        let enlarge_obj = operation.enlarge(p1.type, p2.type as Point, node.scaleFactor);
        if ('x' in enlarge_obj && 'y' in enlarge_obj) {
            // enlarge_obj is Point
            let p = node.node! as Konva.Circle;
            const screenPos = utils.convertToScreenCoords(
                { x: enlarge_obj.x, y: enlarge_obj.y },
                { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            p.position({ x: screenPos.x, y: screenPos.y });
            (node.type as Point).x = enlarge_obj.x;
            (node.type as Point).y = enlarge_obj.y;
        }

        else if ('radius' in enlarge_obj && 'centerC' in enlarge_obj) {
            // enlarge_obj is Circle
            let p = node.node! as Konva.Circle;
            const screenPos = utils.convertToScreenCoords(
                { x: (enlarge_obj as Circle).centerC.x, y: (enlarge_obj as Circle).centerC.y },
                { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            p.position({ x: screenPos.x, y: screenPos.y });
            p.radius(enlarge_obj.radius * this.props.geometryState.spacing);
            (node.type as Circle).centerC.x = (enlarge_obj as Circle).centerC.x;
            (node.type as Circle).centerC.y = (enlarge_obj as Circle).centerC.y;
            (node.type as Circle).radius = (enlarge_obj as Circle).radius;
        }

        else if ('points' in enlarge_obj) {
            let p = node.node! as Konva.Line;
            let points: number[] = [];
            (enlarge_obj as Polygon).points.forEach((p: Point) => {
                const screenPos = utils.convertToScreenCoords(
                    { x: p.x, y: p.y },
                    { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                    this.props.geometryState.spacing
                );
                points.push(screenPos.x, screenPos.y);
            });

            p.points(points);
            (node.type as Polygon).points.forEach((point, idx) => {
                [point.x, point.y] = [(enlarge_obj as Polygon).points[idx].x, (enlarge_obj as Polygon).points[idx].y]
            });
        }

        else if ('startLine' in enlarge_obj) {
            const screenPosStart = utils.convertToScreenCoords(
                { x: (enlarge_obj as Line).startLine.x, y: (enlarge_obj as Line).startLine.y },
                { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            const screenPosEnd = utils.convertToScreenCoords(
                { x: (enlarge_obj as Line).endLine.x, y: (enlarge_obj as Line).endLine.y },
                { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            let l = node.node! as Konva.Line;
            const dx = screenPosEnd.x - screenPosStart.x;
            const dy = screenPosEnd.y - screenPosStart.y;

            let length = 2 * Math.max(this.props.stageRef.current!.width(), this.props.stageRef.current!.height()) * Math.sqrt(dx * dx + dy * dy) / this.props.geometryState.zoom_level;
            let norm_dx = dx / Math.sqrt(dx * dx + dy * dy);
            let norm_dy = dy / Math.sqrt(dx * dx + dy * dy);

            l.points([screenPosStart.x - length * norm_dx, screenPosStart.y - length * norm_dy, screenPosStart.x + length * norm_dx, screenPosStart.y + length * norm_dy]);
            [(node.type as Line).startLine.x, (node.type as Line).startLine.y] = [(enlarge_obj as Line).startLine.x, (enlarge_obj as Line).startLine.y];
            [(node.type as Line).endLine.x, (node.type as Line).endLine.y] = [(enlarge_obj as Line).endLine.x, (enlarge_obj as Line).endLine.y];
        }

        else if ('startVector' in enlarge_obj) {
            let l = node.node! as Konva.Arrow;
            const screenPosStart = utils.convertToScreenCoords(
                { x: (enlarge_obj as Vector).startVector.x, y: (enlarge_obj as Vector).startVector.y },
                { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            const screenPosEnd = utils.convertToScreenCoords(
                { x: (enlarge_obj as Vector).endVector.x, y: (enlarge_obj as Vector).endVector.y },
                { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            l.points([screenPosStart.x, screenPosStart.y, screenPosEnd.x, screenPosEnd.y]);
            [(node.type as Vector).startVector.x, (node.type as Vector).startVector.y] = [(enlarge_obj as Vector).startVector.x, (enlarge_obj as Vector).startVector.y];
            [(node.type as Vector).endVector.x, (node.type as Vector).endVector.y] = [(enlarge_obj as Vector).endVector.x, (enlarge_obj as Vector).endVector.y];
        }

        else if ('startSegment' in enlarge_obj) {
            let l = node.node! as Konva.Line;
            const screenPosStart = utils.convertToScreenCoords(
                { x: (enlarge_obj as Segment).startSegment.x, y: (enlarge_obj as Segment).startSegment.y },
                { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            const screenPosEnd = utils.convertToScreenCoords(
                { x: (enlarge_obj as Segment).endSegment.x, y: (enlarge_obj as Segment).endSegment.y },
                { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            l.points([screenPosStart.x, screenPosStart.y, screenPosEnd.x, screenPosEnd.y]);
            [(node.type as Segment).startSegment.x, (node.type as Segment).startSegment.y] = [(enlarge_obj as Segment).startSegment.x, (enlarge_obj as Segment).startSegment.y];
            [(node.type as Segment).endSegment.x, (node.type as Segment).endSegment.y] = [(enlarge_obj as Segment).endSegment.x, (enlarge_obj as Segment).endSegment.y];
        }

        else if ('startRay' in enlarge_obj) {
            let l = node.node! as Konva.Line;
            const screenPosStart = utils.convertToScreenCoords(
                { x: (enlarge_obj as Ray).startRay.x, y: (enlarge_obj as Ray).startRay.y },
                { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            const screenPosEnd = utils.convertToScreenCoords(
                { x: (enlarge_obj as Ray).endRay.x, y: (enlarge_obj as Ray).endRay.y },
                { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            const dx = screenPosEnd.x - screenPosStart.x;
            const dy = screenPosEnd.y - screenPosStart.y;

            let length = 2 * Math.max(this.props.stageRef.current!.width(), this.props.stageRef.current!.height()) * Math.sqrt(dx * dx + dy * dy) / this.props.geometryState.zoom_level;
            let norm_dx = dx / Math.sqrt(dx * dx + dy * dy);
            let norm_dy = dy / Math.sqrt(dx * dx + dy * dy);

            l.points([screenPosStart.x, screenPosStart.y, screenPosStart.x + length * norm_dx, screenPosStart.y + length * norm_dy]);
            [(node.type as Ray).startRay.x, (node.type as Ray).startRay.y] = [(enlarge_obj as Ray).startRay.x, (enlarge_obj as Ray).startRay.y];
            [(node.type as Ray).endRay.x, (node.type as Ray).endRay.y] = [(enlarge_obj as Ray).endRay.x, (enlarge_obj as Ray).endRay.y];
        }

        else if ('start' in enlarge_obj && 'end' in enlarge_obj) {
            let arc = node.node! as Konva.Arc;
            const screenPosStart = utils.convertToScreenCoords(
                { x: enlarge_obj.start.x, y: enlarge_obj.start.y },
                { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            const screenPosEnd = utils.convertToScreenCoords(
                { x: enlarge_obj.end.x, y: enlarge_obj.end.y },
                { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            arc.position({ x: (screenPosEnd.x + screenPosStart.x) / 2, y: (screenPosEnd.y + screenPosStart.y) / 2 });
            [(node.type as SemiCircle).start.x, (node.type as SemiCircle).start.y] = [enlarge_obj.start.x, enlarge_obj.start.y];
            [(node.type as SemiCircle).end.x, (node.type as SemiCircle).end.y] = [enlarge_obj.end.x, enlarge_obj.end.y];
        }

        if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
            let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
            if (label) {
                label.setAttrs(this.createLabel(node).getAttrs());
            }
        }

        return { ...node! };
    }

    private updateTranslation = (node: ShapeNode): ShapeNode => {
        const [id1, id2] = node.dependsOn;
        const [p1, p2] = [this.props.dag.get(id1), this.props.dag.get(id2)];
        if (!p1 || !p2) {
            return { ...node! };
        }

        let translate_obj = operation.translation(p1.type, p2.type as Vector);
        if ('x' in translate_obj && 'y' in translate_obj) {
            // translate_obj is Point
            let p = node.node! as Konva.Circle;
            const screenPos = utils.convertToScreenCoords(
                { x: translate_obj.x, y: translate_obj.y },
                { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            p.position({ x: screenPos.x, y: screenPos.y });
            (node.type as Point).x = translate_obj.x;
            (node.type as Point).y = translate_obj.y;
        }

        else if ('radius' in translate_obj && 'centerC' in translate_obj) {
            // translate_obj is Circle
            let p = node.node! as Konva.Circle;
            const screenPos = utils.convertToScreenCoords(
                { x: (translate_obj as Circle).centerC.x, y: (translate_obj as Circle).centerC.y },
                { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            p.position({ x: screenPos.x, y: screenPos.y });
            p.radius(translate_obj.radius * this.props.geometryState.spacing);
            (node.type as Circle).centerC.x = (translate_obj as Circle).centerC.x;
            (node.type as Circle).centerC.y = (translate_obj as Circle).centerC.y;
            (node.type as Circle).radius = (translate_obj as Circle).radius;
        }

        else if ('points' in translate_obj) {
            let p = node.node! as Konva.Line;
            let points: number[] = [];
            (translate_obj as Polygon).points.forEach((p: Point) => {
                const screenPos = utils.convertToScreenCoords(
                    { x: p.x, y: p.y },
                    { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                    this.props.geometryState.spacing
                );
                points.push(screenPos.x, screenPos.y);
            });

            p.points(points);
            (node.type as Polygon).points.forEach((point, idx) => {
                [point.x, point.y] = [(translate_obj as Polygon).points[idx].x, (translate_obj as Polygon).points[idx].y]
            });
        }

        else if ('startLine' in translate_obj) {
            const screenPosStart = utils.convertToScreenCoords(
                { x: (translate_obj as Line).startLine.x, y: (translate_obj as Line).startLine.y },
                { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            const screenPosEnd = utils.convertToScreenCoords(
                { x: (translate_obj as Line).endLine.x, y: (translate_obj as Line).endLine.y },
                { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            let l = node.node! as Konva.Line;
            const dx = screenPosEnd.x - screenPosStart.x;
            const dy = screenPosEnd.y - screenPosStart.y;

            let length = 2 * Math.max(this.props.stageRef.current!.width(), this.props.stageRef.current!.height()) * Math.sqrt(dx * dx + dy * dy) / this.props.geometryState.zoom_level;
            let norm_dx = dx / Math.sqrt(dx * dx + dy * dy);
            let norm_dy = dy / Math.sqrt(dx * dx + dy * dy);

            l.points([screenPosStart.x - length * norm_dx, screenPosStart.y - length * norm_dy, screenPosStart.x + length * norm_dx, screenPosStart.y + length * norm_dy]);
            [(node.type as Line).startLine.x, (node.type as Line).startLine.y] = [(translate_obj as Line).startLine.x, (translate_obj as Line).startLine.y];
            [(node.type as Line).endLine.x, (node.type as Line).endLine.y] = [(translate_obj as Line).endLine.x, (translate_obj as Line).endLine.y];
        }

        else if ('startVector' in translate_obj) {
            let l = node.node! as Konva.Arrow;
            const screenPosStart = utils.convertToScreenCoords(
                { x: (translate_obj as Vector).startVector.x, y: (translate_obj as Vector).startVector.y },
                { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            const screenPosEnd = utils.convertToScreenCoords(
                { x: (translate_obj as Vector).endVector.x, y: (translate_obj as Vector).endVector.y },
                { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            l.points([screenPosStart.x, screenPosStart.y, screenPosEnd.x, screenPosEnd.y]);
            [(node.type as Vector).startVector.x, (node.type as Vector).startVector.y] = [(translate_obj as Vector).startVector.x, (translate_obj as Vector).startVector.y];
            [(node.type as Vector).endVector.x, (node.type as Vector).endVector.y] = [(translate_obj as Vector).endVector.x, (translate_obj as Vector).endVector.y];
        }

        else if ('startSegment' in translate_obj) {
            let l = node.node! as Konva.Line;
            const screenPosStart = utils.convertToScreenCoords(
                { x: (translate_obj as Segment).startSegment.x, y: (translate_obj as Segment).startSegment.y },
                { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            const screenPosEnd = utils.convertToScreenCoords(
                { x: (translate_obj as Segment).endSegment.x, y: (translate_obj as Segment).endSegment.y },
                { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            l.points([screenPosStart.x, screenPosStart.y, screenPosEnd.x, screenPosEnd.y]);
            [(node.type as Segment).startSegment.x, (node.type as Segment).startSegment.y] = [(translate_obj as Segment).startSegment.x, (translate_obj as Segment).startSegment.y];
            [(node.type as Segment).endSegment.x, (node.type as Segment).endSegment.y] = [(translate_obj as Segment).endSegment.x, (translate_obj as Segment).endSegment.y];
        }

        else if ('startRay' in translate_obj) {
            let l = node.node! as Konva.Line;
            const screenPosStart = utils.convertToScreenCoords(
                { x: (translate_obj as Ray).startRay.x, y: (translate_obj as Ray).startRay.y },
                { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            const screenPosEnd = utils.convertToScreenCoords(
                { x: (translate_obj as Ray).endRay.x, y: (translate_obj as Ray).endRay.y },
                { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            const dx = screenPosEnd.x - screenPosStart.x;
            const dy = screenPosEnd.y - screenPosStart.y;

            let length = 2 * Math.max(this.props.stageRef.current!.width(), this.props.stageRef.current!.height()) * Math.sqrt(dx * dx + dy * dy) / this.props.geometryState.zoom_level;
            let norm_dx = dx / Math.sqrt(dx * dx + dy * dy);
            let norm_dy = dy / Math.sqrt(dx * dx + dy * dy);

            l.points([screenPosStart.x, screenPosStart.y, screenPosStart.x + length * norm_dx, screenPosStart.y + length * norm_dy]);
            [(node.type as Ray).startRay.x, (node.type as Ray).startRay.y] = [(translate_obj as Ray).startRay.x, (translate_obj as Ray).startRay.y];
            [(node.type as Ray).endRay.x, (node.type as Ray).endRay.y] = [(translate_obj as Ray).endRay.x, (translate_obj as Ray).endRay.y];
        }

        else if ('start' in translate_obj && 'end' in translate_obj) {
            let arc = node.node! as Konva.Arc;
            const screenPosStart = utils.convertToScreenCoords(
                { x: translate_obj.start.x, y: translate_obj.start.y },
                { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            const screenPosEnd = utils.convertToScreenCoords(
                { x: translate_obj.end.x, y: translate_obj.end.y },
                { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            arc.position({ x: (screenPosEnd.x + screenPosStart.x) / 2, y: (screenPosEnd.y + screenPosStart.y) / 2 });
            [(node.type as SemiCircle).start.x, (node.type as SemiCircle).start.y] = [translate_obj.start.x, translate_obj.start.y];
            [(node.type as SemiCircle).end.x, (node.type as SemiCircle).end.y] = [translate_obj.end.x, translate_obj.end.y];
        }

        if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
            let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
            if (label) {
                label.setAttrs(this.createLabel(node).getAttrs());
            }
        }

        return { ...node! };
    }

    private updateRegularPoly = (node: ShapeNode): ShapeNode => {
        const [shape1, shape2] = [this.props.dag.get(node.dependsOn[0]), this.props.dag.get(node.dependsOn[1])];
        if (!shape1 || !shape2) return { ...node! };

        if (!node.rotationFactor) return { ...node! };
        const posA = {
            x: shape1.node!.x(),
            y: shape1.node!.y()
        }

        const posB = {
            x: shape2.node!.x(),
            y: shape2.node!.y()
        }

        let [A, B] = [
            Factory.createPoint(node.type.props, posA.x, posA.y),
            Factory.createPoint(node.type.props, posB.x, posB.y),
        ]

        let pts: number[] = [A.x, A.y, B.x, B.y];
        let points = [A, B];
        let tmpA = A, tmpB = B;
        while (pts.length < (node.node! as Konva.Line).points().length) {
            let newEnd = operation.rotation(tmpA, tmpB, node.rotationFactor.degree, node.rotationFactor.CCW) as Point;
            points.push(newEnd);
            pts.push(newEnd.x, newEnd.y);
            tmpA = tmpB;
            tmpB = newEnd;
        }

        (node.node! as Konva.Line).points(pts);
        (node.type as Polygon).points.forEach((point, idx) => {
            this.updatePointPos(point, points[idx].x, points[idx].y);
        });

        if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
            let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
            if (label) {
                label.setAttrs(this.createLabel(node).getAttrs());
            }
        }

        return { ...node! };
    }

    private updatePointPos = (point: Point, x: number, y: number): void => {
        const pos = utils.convertToCustomCoords(
            { x: x, y: y },
            { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
            this.props.geometryState.spacing
        );

        [point.x, point.y] = [pos.x, pos.y];
    }

    private createPoint = (
        position: { x: number, y: number },
        children: Konva.Shape[]
    ): void => {
        let shape = children.length > 0 ? children[children.length - 1] : undefined;
        let scaleFactor: number | undefined = undefined;
        let rotFactor: { degree: number, CCW: boolean } | undefined = undefined;
        const DAG = utils.cloneDAG(this.props.dag);

        if (children.length <= 1) {
            let posInfo = utils.snapToShape(
                DAG, children[0], position, this.layerMathObjectRef.current!, this.props.isSnapToGrid,
                this.props.stageRef.current!, this.props.geometryState.axisTickInterval
            );

            position = posInfo.position;
            rotFactor = posInfo.rotFactor;
            scaleFactor = posInfo.scaleFactor;
        }
        
        else {
            // Get the last two shapes
            const shape1 = children.at(-1);
            const shape2 = children.at(-2);

            const posCustom = utils.convertToCustomCoords(
                position,
                {x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                this.props.geometryState.spacing
            );

            if (shape1 && shape2) {
                let node1 = DAG.get(shape1.id());
                let node2 = DAG.get(shape2.id());
                if (node1 && node2) {
                    const pos = operation.getIntersections2D(node1.type, node2.type);
                    if (pos.length > 0) {
                        // Find the closest intersection point to the cursor position
                        let closestPointIdx = -1;
                        let minDist = Infinity;
                        for (let i = 0; i < pos.length; i++) {
                            if (pos[i].coors === undefined || pos[i].ambiguous === true) {
                                continue;
                            }

                            if (Math.hypot(pos[i].coors!.x - posCustom.x, pos[i].coors!.y - posCustom.y) < minDist) {
                                minDist = Math.hypot(pos[i].coors!.x - posCustom.x, pos[i].coors!.y - posCustom.y);
                                closestPointIdx = i;
                            }
                        }

                        position = closestPointIdx !== -1 && pos[closestPointIdx].coors ? utils.convertToScreenCoords(
                            pos[closestPointIdx].coors!,
                            {x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
                            this.props.geometryState.spacing
                        ) : position;
                    }
                }
            }
        }

        const selectedPoints = [...this.props.selectedPoints];
        let label = utils.getExcelLabel('A', 0);
        let index = 0;
        while (this.props.labelUsed.includes(label)) {
            index++;
            label = utils.getExcelLabel('A', index);
        }

        this.props.onLabelUsed([...this.props.labelUsed, label]);
        const pos = utils.convertToCustomCoords(
            position, { x: this.props.stageRef.current!.width() / 2, y: this.props.stageRef.current!.height() / 2 },
            this.props.geometryState.spacing
        );

        let point = Factory.createPoint(
            utils.createPointDefaultShapeProps(label),
            pos.x,
            pos.y
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
                        this.props.stageRef.current!, this.props.geometryState.axisTickInterval
                    );

                    position = posInfo.position;
                    rotFactor = posInfo.rotFactor;
                    scaleFactor = posInfo.scaleFactor;
                    node.node!.position(position);
                    this.updatePointPos(node.type as Point, position.x, position.y);

                    if (!this.isBatchUpdating && this.layerUnchangeVisualRef.current) {
                        let label = this.layerUnchangeVisualRef.current.getChildren().find(labelNode => labelNode.id().includes(node.node!.id()));
                        if (label) {
                            label.setAttrs(this.createLabel(node).getAttrs());
                        }
                    }

                    return { ...node };
                };

                this.updateAndPropagateBatch([pNode.id()], updateFn);
            })
        }

        let shapeNode: ShapeNode = {
            id: point.props.id,
            type: point,
            node: pNode,
            dependsOn: children.slice(-2).map(node => node.id()),
            scaleFactor: scaleFactor,
            rotationFactor: rotFactor,
            defined: true,
            isSelected: true,
            side: point.type === 'Intersection' ? 0 : undefined
        }

        DAG.set(point.props.id, shapeNode);
        selectedPoints.push(point);
        this.newCreatedPoint.push(point);
        this.props.onUpdateLastFailedState(this.props.mode === 'point' ? undefined : {
            selectedPoints: [...this.newCreatedPoint],
            selectedShapes: [...this.props.selectedShapes]
        });

        this.props.onUpdateAll({
            gs: { ...this.props.geometryState },
            dag: DAG,
            selectedShapes: this.props.mode === 'point' ? [] : [...this.props.selectedShapes],
            selectedPoints: this.props.mode === 'point' ? [] : selectedPoints
        });
    }

    render(): React.ReactNode {
        const { width, height, background_color } = this.props;
        return (
            <Stage
                className={"cursor_hit"}
                ref={this.props.stageRef}
                width={width}
                height={height}
                style={{ background: background_color }}
                onWheel={this.handleZoom}
                onPointerDown={this.handleMouseDown}
                onPointerMove={this.handleMouseMove}
                onPointerUp={this.handleMouseUp}
            >
                <Layer ref={this.layerGridRef} />
                <Layer ref={this.layerAxisRef} />
                <Layer ref={this.layerMathObjectRef} />
                <Layer ref={this.layerUnchangeVisualRef} />
            </Stage>
        )
    }
}

export default KonvaCanvas;