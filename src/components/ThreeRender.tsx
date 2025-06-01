import React, { RefObject } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Shape, Sphere, GeometryState, ShapeProps, ShapeNode3D, Vector, Plane } from '../types/geometry';
import {
    isPlane, isCylinder, isCone, isSphere, isPyramid, isCuboid, isPrism,
    isPoint, isLine, isVector, isSegment, isPolygon, isCircle, isRay
} from '../utils/type_guard';
import { GeometryTool3D } from './GeometryTool';
import { v4 as uuidv4 } from 'uuid';
import type { MathNode, ConstantNode, SymbolNode } from 'mathjs';
const math = require('mathjs');

interface ThreeDCanvasProps {
    width: number;
    height: number;
    background_color: string;
}

// Constants
const FONT_DEFAULTS = {
    SIZE: 12,
    FAMILY: 'Calibri',
    COLOR: 'black'
};

const LINE_EXTENSION = 10;

const ARROW_DEFAULTS = {
    POINTER_WIDTH: 0.1,
    POINTER_LENGTH: 0.1
};

// Utility functions
const createDashLine = (points: THREE.Vector3[], props: ShapeProps): THREE.Mesh | THREE.Group | null => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    let mesh: THREE.Mesh | THREE.Group | null = null;
    // Create dashed line material
    const dashedMaterial = new THREE.LineDashedMaterial({
        color: props.color,
        dashSize: props.line_style.dash_size, // Length of the dash
        gapSize: props.line_style.gap_size,   // Length of the gap
        linewidth: props.line_size || 1
    });

    // Create line instead of mesh
    const mainLine = new THREE.Line(geometry, dashedMaterial);
    mainLine.computeLineDistances(); // Required for dashed lines

    // For dot-dash pattern, we need to create multiple lines with different dash patterns
    if (props.line_style.dot_size !== undefined) {
        // Create a second line for dots
        const dotMaterial = new THREE.LineDashedMaterial({
            color: props.color,
            dashSize: props.line_style.dot_size || 0.1, // Very small dash for dots
            gapSize: props.line_style.gap_size,     // Larger gap for dots
            linewidth: props.line_size || 1
        });

        const dotLine = new THREE.Line(geometry.clone(), dotMaterial);
        dotLine.computeLineDistances();

        // Create a group to hold both lines
        const group = new THREE.Group();
        group.add(mainLine);
        group.add(dotLine);
        mesh = group as unknown as THREE.Mesh; // Type assertion since we know it's a valid object
    } else {
        mesh = mainLine as unknown as THREE.Mesh; // Type assertion for single line
    }

    return mesh;
}

const convertToVector3 = (x: number, y: number, z: number): THREE.Vector3 => {
    return new THREE.Vector3(x, z, y);
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

class ThreeDCanvas extends React.Component<ThreeDCanvasProps, GeometryState> {
    private sceneRef: RefObject<THREE.Scene | null>;
    private cameraRef: RefObject<THREE.PerspectiveCamera | null>;
    private rendererRef: RefObject<THREE.WebGLRenderer | null>;
    private controlsRef: RefObject<OrbitControls | null>;
    private canvasRef: RefObject<HTMLCanvasElement | null>;

    constructor(props: ThreeDCanvasProps) {
        super(props);
        this.sceneRef = React.createRef<THREE.Scene>();
        this.cameraRef = React.createRef<THREE.PerspectiveCamera>();
        this.rendererRef = React.createRef<THREE.WebGLRenderer>();
        this.controlsRef = React.createRef<OrbitControls>();
        this.canvasRef = React.createRef<HTMLCanvasElement>();
        this.state = {
            numLoops: 0,
            spacing: 20,
            axisTickInterval: 1,
            shapes: new Map<string, ShapeNode3D>(),
            gridVisible: true,
            axesVisible: true,
            zoom_level: 1,
            panning: false,
            dummy: false,
            pointIndex: 0,
            lineIndex: 0,
            circleIndex: 0,
            polygonIndex: 0,
            rayIndex: 0,
            segmentIndex: 0,
            vectorIndex: 0,
            selectedShapes: [],
            mode: 'none'
        }

        this.handleMouseDown = this.handleMouseDown.bind(this);
    }

    componentDidMount(): void {
        this.initializeScene();
        this.updateShapes();
        window.addEventListener("mousedown", this.handleMouseDown);
    }

    componentDidUpdate(prevProps: ThreeDCanvasProps, prevState: GeometryState): void {
        if (
            prevProps.width !== this.props.width ||
            prevProps.height !== this.props.height
        ) {
            this.updateRendererSize();
            this.updateCameraAspect();
        }

        if (prevProps.background_color !== this.props.background_color) {
            this.updateBackground();
        }

        else {
            this.updateShapes();
        }
    }

    componentWillUnmount() {
        this.disposeResources();
        window.removeEventListener('mousedown', this.handleMouseDown)
    }

    initializeScene(): void {
        const { width, height, background_color } = this.props;
        if (!this.canvasRef.current) return;
        const rect = this.canvasRef.current.getBoundingClientRect();
        this.canvasRef.current.width = rect.width * window.devicePixelRatio;
        this.canvasRef.current.height = rect.height * window.devicePixelRatio;

        // Create scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(background_color);
        this.sceneRef.current = scene;

        // Create camera
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.set(5, 5, 5);
        camera.lookAt(0, 0, 0);
        this.cameraRef.current = camera;

        // Create renderer
        const renderer = new THREE.WebGLRenderer({
            canvas: this.canvasRef.current,
            antialias: true
        });

        renderer.setSize(rect.width, rect.height);
        renderer.setPixelRatio(window.devicePixelRatio);
        this.rendererRef.current = renderer;

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);
        
        // Add grid helper
        if (this.state.gridVisible) {
            const gridHelper = new THREE.GridHelper(10, 10);
            scene.add(gridHelper);
        }

        // Add arrow axes
        if (this.state.axesVisible) {
            const xAxisLength = 5;
            const yAxisLength = 5;
            const zAxisLength = 3.5;
            const arrowHeadLength = ARROW_DEFAULTS.POINTER_LENGTH;
            const arrowHeadWidth = ARROW_DEFAULTS.POINTER_WIDTH;

            // X-axis (red)
            const xDir = new THREE.Vector3(1, 0, 0);
            const xOrigin = new THREE.Vector3(-xAxisLength, 0, 0);
            const xArrow = new THREE.ArrowHelper(xDir, xOrigin, xAxisLength * 2, 0xff0000, arrowHeadLength, arrowHeadWidth);
            scene.add(xArrow);

            // Y-axis (green)
            const yDir = new THREE.Vector3(0, 0, 1);
            const yOrigin = new THREE.Vector3(0, 0, -yAxisLength);
            const yArrow = new THREE.ArrowHelper(yDir, yOrigin, yAxisLength * 2, 0x00ff00, arrowHeadLength, arrowHeadWidth);
            scene.add(yArrow);

            // Z-axis (blue)
            const zDir = new THREE.Vector3(0, 1, 0);
            const zOrigin = new THREE.Vector3(0, -zAxisLength, 0);
            const zArrow = new THREE.ArrowHelper(zDir, zOrigin, zAxisLength * 2, 0x0000ff, arrowHeadLength, arrowHeadWidth);
            scene.add(zArrow);
        }
        
        // Add orbit controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        this.controlsRef.current = controls;

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            if (this.sceneRef.current && this.cameraRef.current && this.rendererRef.current) {
                this.rendererRef.current.render(this.sceneRef.current, this.cameraRef.current);
            }
        };

        animate();
    }

    disposeResources = () => {
        if (this.controlsRef.current) {
            this.controlsRef.current.dispose();
        }

        if (this.sceneRef.current && this.rendererRef.current) {
            this.sceneRef.current.traverse((object) => {
                if (object instanceof THREE.Mesh) {
                    object.geometry.dispose();
                    if (Array.isArray(object.material)) {
                        object.material.forEach(material => material.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            });

            this.rendererRef.current.dispose();
        }
    };

    updateRendererSize = () => {
        if (this.rendererRef.current) {
            this.rendererRef.current.setSize(this.props.width, this.props.height);
        }
    };

    updateBackground = () => {
        if (this.sceneRef.current) {
            this.sceneRef.current.background = new THREE.Color(this.props.background_color);
        }
    };

    updateCameraAspect = () => {
        if (this.cameraRef.current) {
            this.cameraRef.current.aspect = this.props.width / this.props.height;
            this.cameraRef.current.updateProjectionMatrix();
        }
    };

    createLabel (
        text: string,
        position: THREE.Vector3,
        xOffset: number,
        yOffset: number,
        zOffset: number
    ): THREE.Sprite {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        
        context.font = `${FONT_DEFAULTS.SIZE}px ${FONT_DEFAULTS.FAMILY}`;
        
        // Get size of text
        const textMetrics = context.measureText(text);
        const width = textMetrics.width + 10;
        const height = 30;

        // Set canvas size
        canvas.width = width;
        canvas.height = height;

        // Make background transparent
        context.clearRect(0, 0, width, height);

        // Draw text
        context.font = `${FONT_DEFAULTS.SIZE}px ${FONT_DEFAULTS.FAMILY}`;
        context.fillStyle = FONT_DEFAULTS.COLOR;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, width / 2, height / 2);

        // Create texture
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ 
            map: texture,
            transparent: true,
            depthTest: false,
            depthWrite: false
        });
        
        const sprite = new THREE.Sprite(spriteMaterial);
        
        // Position sprite with offsets
        const offsetPosition = new THREE.Vector3(
            position.x + xOffset,
            position.y + yOffset,
            position.z + zOffset
        );
        sprite.position.copy(offsetPosition);
        sprite.scale.set(width / 40, height / 40, 1);
        sprite.renderOrder = 999; // Ensure labels render on top

        return sprite;
    }

    create3DMesh (shape: Shape): THREE.Object3D | null {
        if (!shape.props.visible.shape) return null;

        const material = new THREE.MeshPhongMaterial({
            color: shape.props.color,
            transparent: true,
            opacity: shape.props.opacity ?? 0.1,
            side: THREE.DoubleSide
        });

        let geometry: THREE.BufferGeometry | null = null;
        let mesh: THREE.Mesh | THREE.Group | null = null;
        let labelPosition = new THREE.Vector3();

        if (isPlane(shape)) {
            geometry = new THREE.PlaneGeometry(5, 5);
            mesh = new THREE.Mesh(geometry, material);
            let point = convertToVector3(shape.point.x, shape.point.y, shape.point.z || 0);
            let norm = convertToVector3(
                shape.norm.endVector.x - shape.norm.startVector.x,
                shape.norm.endVector.y - shape.norm.startVector.y,
                (shape.norm.endVector.z ?? 0) - (shape.norm.startVector.z ?? 0)
            );

            mesh.position.set(point.x, point.y, point.z);
            const defaultNormal = new THREE.Vector3(0, 0, 1);
            const quaternion = new THREE.Quaternion().setFromUnitVectors(defaultNormal, norm);
            mesh.quaternion.copy(quaternion);
            labelPosition.copy(mesh.position).add(new THREE.Vector3(0, 2.5, 0));
        }
        
        else if (isCylinder(shape)) {
            const start = new THREE.Vector3(shape.centerBase1.x, shape.centerBase1.y, shape.centerBase1.z || 0);
            const end = new THREE.Vector3(shape.centerBase2.x, shape.centerBase2.y, shape.centerBase2.z || 0);
            const direction = new THREE.Vector3().subVectors(end, start);
            const length = direction.length();
            const radius = shape.radius;

            geometry = new THREE.CylinderGeometry(radius, radius, length, 32);
            mesh = new THREE.Mesh(geometry, material);
            mesh.position.copy(start).add(direction.multiplyScalar(0.5));
            mesh.lookAt(end);
            labelPosition = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
        }
        
        else if (isCone(shape)) {
            const center = new THREE.Vector3(shape.center.x, shape.center.y, shape.center.z || 0);
            const apex = new THREE.Vector3(shape.apex.x, shape.apex.y, shape.apex.z || 0);
            const direction = new THREE.Vector3().subVectors(apex, center);
            const height = direction.length();
            const radius = shape.radius

            geometry = new THREE.ConeGeometry(radius, height, 32);
            mesh = new THREE.Mesh(geometry, material);
            mesh.position.copy(center);
            mesh.lookAt(apex);
            labelPosition = new THREE.Vector3().addVectors(center, apex).multiplyScalar(0.5);
        }
        
        else if (isSphere(shape)) {
            geometry = new THREE.SphereGeometry(shape.radius, 32, 32);
            mesh = new THREE.Mesh(geometry, material);
            let center = convertToVector3(shape.centerS.x, shape.centerS.y, shape.centerS.z || 0)
            mesh.position.set(center.x, center.y, center.z);
            labelPosition.copy(mesh.position).add(new THREE.Vector3(0, shape.radius + 0.5, 0));
        }
        
        else if (isPyramid(shape)) {
            const apex = new THREE.Vector3(shape.apex.x, shape.apex.y, shape.apex.z || 0);
            const baseCenter = new THREE.Vector3();
            shape.base.points.forEach(point => {
                baseCenter.x += point.x;
                baseCenter.y += point.y;
                baseCenter.z += (point.z || 0);
            });
            baseCenter.divideScalar(shape.base.points.length);

            const direction = new THREE.Vector3().subVectors(apex, baseCenter);
            const height = direction.length();
            const radius = 0.5; // Default radius, could be made configurable

            geometry = new THREE.ConeGeometry(radius, height, 4); // 4 sides for pyramid
            mesh = new THREE.Mesh(geometry, material);
            mesh.position.copy(baseCenter);
            labelPosition = new THREE.Vector3().addVectors(baseCenter, apex).multiplyScalar(0.5);
        }
        
        else if (isCuboid(shape)) {
            const width = shape.bottomRightFront.x - shape.topLeftBack.x;
            const height = shape.bottomRightFront.y - shape.topLeftBack.y;
            const depth = (shape.bottomRightFront.z || 0) - (shape.topLeftBack.z || 0);

            geometry = new THREE.BoxGeometry(width, height, depth);
            mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(
                (shape.topLeftBack.x + shape.bottomRightFront.x) / 2,
                (shape.topLeftBack.y + shape.bottomRightFront.y) / 2,
                ((shape.topLeftBack.z || 0) + (shape.bottomRightFront.z || 0)) / 2
            );

            labelPosition.copy(mesh.position).add(new THREE.Vector3(0, height / 2 + 0.5, 0));
        }
        
        else if (isPrism(shape)) {
            const baseCenter = new THREE.Vector3();
            shape.base.points.forEach(point => {
                baseCenter.x += point.x;
                baseCenter.y += point.y;
                baseCenter.z += (point.z || 0);
            });
            baseCenter.divideScalar(shape.base.points.length);

            const top = new THREE.Vector3(shape.top_point.x, shape.top_point.y, shape.top_point.z || 0);
            const direction = new THREE.Vector3().subVectors(top, baseCenter);
            const height = direction.length();
            const radius = 0.5; // Default radius, could be made configurable

            geometry = new THREE.CylinderGeometry(radius, radius, height, shape.base.points.length);
            mesh = new THREE.Mesh(geometry, material);
            mesh.position.copy(baseCenter);
            mesh.lookAt(top);
            labelPosition = new THREE.Vector3().addVectors(baseCenter, top).multiplyScalar(0.5);
        }
        
        else if (isVector(shape)) {
            // Calculate direction vector
            const start = new THREE.Vector3(
                shape.startVector.x,
                shape.startVector.y,
                shape.startVector.z || 0
            );
            const end = new THREE.Vector3(
                shape.endVector.x,
                shape.endVector.y,
                shape.endVector.z || 0
            );
            const direction = new THREE.Vector3().subVectors(end, start);
            const length = direction.length();
            
            // Create arrow helper
            const arrowHelper = new THREE.ArrowHelper(
                direction.normalize(), // Normalized direction
                start,                 // Start point
                length,                // Length of the arrow
                shape.props.color,     // Color
                ARROW_DEFAULTS.POINTER_LENGTH * length, // Arrow head length
                ARROW_DEFAULTS.POINTER_WIDTH * length // Arrow head width
            );

            // Create group to hold the arrow and potential label
            const group = new THREE.Group();
            group.add(arrowHelper);

            // Calculate position for label (middle of the vector)
            const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
            labelPosition.copy(midPoint);

            mesh = group as unknown as THREE.Mesh;
        }

        if (!mesh) return null;

        // Create group to hold mesh and label
        const group = new THREE.Group();
        group.add(mesh);

        // Add label if visible
        if (shape.props.visible.label) {
            const label = this.createLabel(
                shape.props.label, 
                labelPosition,
                shape.props.labelXOffset || 0,
                shape.props.labelYOffset || 0,
                shape.props.labelZOffset || 0
            );
            group.add(label);
        }

        return group;
    }
        
    create2DShape (shape: Shape): THREE.Object3D | null {
        if (!shape.props.visible.shape) return null;

        const material = new THREE.MeshBasicMaterial({
            color: shape.props.color,
            transparent: true,
            opacity: shape.props.opacity ?? 0.1,
            wireframe: isCircle(shape)? true : false
        });

        let geometry: THREE.BufferGeometry | null = null;
        let mesh: THREE.Mesh | THREE.Group | null = null;
        let labelPosition = new THREE.Vector3();

        if (isCircle(shape)) {
            // Create points for the circle
            const points = [];
            const segments = 64; // Number of segments for the circle
            for (let i = 0; i <= segments; i++) {
                const theta = (i / segments) * Math.PI * 2;
                const x = Math.cos(theta);
                const y = Math.sin(theta);
                const z = 0;
                points.push(convertToVector3(x, y, z));
            }

            for (let p of points) {
                p.multiplyScalar(shape.radius);
            }

            let normalVec = shape.normal? new THREE.Vector3(
                shape.normal.endVector.x - shape.normal.startVector.x,
                (shape.normal.endVector.z || 0) - (shape.normal.startVector.z || 0),
                shape.normal.endVector.y - shape.normal.startVector.y
            ).normalize() : new THREE.Vector3(0, 1, 0);
            let defaultNorm = new THREE.Vector3(0, 1, 0);
            if (!defaultNorm.equals(normalVec)) {
                let quaternion = new THREE.Quaternion();
                quaternion.setFromUnitVectors(defaultNorm, normalVec);
                for (let p of points) {
                    p.applyQuaternion(quaternion);
                }
            }

            for (let p of points) {
                p.add(convertToVector3(shape.centerC.x, shape.centerC.y, shape.centerC.z || 0));
            }

            mesh = createDashLine(points, shape.props);
            labelPosition.copy(mesh!.position).add(new THREE.Vector3(0, shape.radius + 0.5, 0));
        }
        
        else if (isPoint(shape)) {
            geometry = new THREE.SphereGeometry(shape.props.radius, 32, 32);
            mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(shape.x, shape.z ?? 0, shape.y);
            labelPosition.copy(mesh.position).add(new THREE.Vector3(0, shape.props.radius + 0.5, 0));
        }
        
        else if (isLine(shape)) {
            let points = []
            let start_point = convertToVector3(shape.startLine.x, shape.startLine.y, shape.startLine.z || 0)
            let end_point = convertToVector3(shape.endLine.x, shape.endLine.y, shape.endLine.z || 0)
            let direction = new THREE.Vector3().subVectors(end_point, start_point)
            const P1 = new THREE.Vector3().copy(start_point).sub(direction.clone().multiplyScalar(LINE_EXTENSION))
            const P2 = new THREE.Vector3().copy(end_point).add(direction.clone().multiplyScalar(LINE_EXTENSION))

            points.push(P1)
            points.push(P2)

            mesh = createDashLine(points, shape.props);
            labelPosition.copy(mesh!.position).add(new THREE.Vector3(0, 0, 0));
        }

        else if (isRay(shape)) {
            let points = []
            const P1 = convertToVector3(shape.startRay.x, shape.startRay.y, shape.startRay.z || 0)
            const P2 = convertToVector3(shape.endRay.x, shape.endRay.y, shape.endRay.z || 0)
            const direction = new THREE.Vector3().subVectors(P2, P1)
            const P3 = new THREE.Vector3().copy(P2).add(direction.clone().multiplyScalar(LINE_EXTENSION))

            points.push(P1)
            points.push(P3)

            mesh = createDashLine(points, shape.props);
            labelPosition.copy(mesh!.position).add(new THREE.Vector3(0, 0, 0));
        }
        
        else if (isSegment(shape)) {
            let points = []
            const P1 = convertToVector3(shape.startSegment.x, shape.startSegment.y, shape.startSegment.z || 0)
            const P2 = convertToVector3(shape.endSegment.x, shape.endSegment.y, shape.endSegment.z || 0)
            
            points.push(P1)
            points.push(P2)

            mesh = createDashLine(points, shape.props);
            labelPosition.copy(mesh!.position).add(new THREE.Vector3(0, 0, 0));
        }
        
        else if (isPolygon(shape)) {
            // Create a polygon from the points
            const points = shape.points.map(point => new THREE.Vector3(point.x, point.y, point.z || 0));
            
            // Create a shape from the points
            const shapeGeometry = new THREE.Shape();
            shapeGeometry.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                shapeGeometry.lineTo(points[i].x, points[i].y);
            }

            shapeGeometry.closePath();

            // Create geometry from the shape
            const fillGeometry = new THREE.ShapeGeometry(shapeGeometry);
            const borderGeometry = new THREE.ShapeGeometry(shapeGeometry);

            // Create material for the filled polygon with higher opacity
            const fillMaterial = new THREE.MeshBasicMaterial({
                color: shape.props.color,
                transparent: true,
                opacity: shape.props.opacity ?? 0.5,
                side: THREE.DoubleSide
            });

            // Create material for the border with lower opacity
            const borderMaterial = new THREE.MeshBasicMaterial({
                color: shape.props.color,
                transparent: true,
                opacity: (shape.props.opacity ?? 0.5) * 0.5, // Border is half as opaque as fill
                wireframe: true
            });

            // Create meshes
            const fillMesh = new THREE.Mesh(fillGeometry, fillMaterial);
            const borderMesh = new THREE.Mesh(borderGeometry, borderMaterial);
            
            // Calculate center for label
            const center = new THREE.Vector3();
            points.forEach(point => center.add(point));
            center.divideScalar(points.length);
            
            // Create a group to hold both meshes
            const group = new THREE.Group();
            group.add(fillMesh);
            group.add(borderMesh);
            group.position.set(center.x, center.y, center.z);
            labelPosition.copy(center);

            mesh = group;
        }

        if (!mesh) return null;
        // Create group to hold mesh and label
        const group = new THREE.Group();
        group.add(mesh);

        // Add label if visible
        if (shape.props.visible.label) {
            const label = this.createLabel(
                shape.props.label, 
                labelPosition,
                shape.props.labelXOffset || 0,
                shape.props.labelYOffset || 0,
                shape.props.labelZOffset || 0
            );
            group.add(label);
        }

        return group;
    }

    createShape (shape: Shape): THREE.Object3D | null {
        // 2D shapes
        if (isCircle(shape) || isPoint(shape) || isLine(shape) || isSegment(shape) || isPolygon(shape) || isSegment(shape)) {
            return this.create2DShape(shape);
        }

        // 3D shapes
        return this.create3DMesh(shape);
    }

    updateShapes = () => {
        if (!this.sceneRef.current) return;

        // Clear existing shapes
        this.sceneRef.current.children.forEach(child => {
            if (child instanceof THREE.Group || child instanceof THREE.Mesh) {
                if (!(child instanceof THREE.GridHelper) && !(child instanceof THREE.AxesHelper)) {
                    this.sceneRef.current?.remove(child);
                }
            }
        });

        // Add new shapes
        this.state.shapes.forEach(shape => {
            const mesh = this.createShape(shape.type);
            if (mesh) {
                this.sceneRef.current!.add(mesh);
            }
        })
    }

    private handleClearClick = () => {
        this.setState({
            shapes: new Map<string, ShapeNode3D>(),
            pointIndex: 0,
            lineIndex: 0,
            circleIndex: 0,
            polygonIndex: 0,
            rayIndex: 0,
            segmentIndex: 0,
            vectorIndex: 0,
            selectedShapes: [],
            mode: 'none'
        })
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

    private handleUndoClick = () => {

    }

    private handleRedoClick = () => {

    }

    private handleAddCuboid = () => {
        this.setState({mode: 'cuboid'});
    }

    private handleAddCylinder = () => {
        this.setState({mode: 'cylinder'});
    }

    private handleAddPrism = () => {
        this.setState({mode: 'prism'});
    }

    private handleAddPyramid = () => {
        this.setState({mode: 'pyramid'});
    }

    private handleAddSphere = () => {
        this.setState({mode: 'sphere'});
    }

    private handleAddPlane = () => {
        this.setState({mode: 'plane'});
    }

    private handleAddCone = () => {
        this.setState({mode: 'cone'});
    }

    private handleMouseDown = (e: MouseEvent) => {
        if (e.button === 0 && this.state.mode !== 'none') {
            this.handleDrawing();
        }
    }

    private handleDrawing = () => {
        let mode = this.state.mode
        if (mode === "sphere") {
            let coors = prompt('Enter the center radius');
            let regex = /^\(\s*(-?\d+(\.\d+)?)\s*,\s*(-?\d+(\.\d+)?)\s*,\s*(-?\d+(\.\d+)?)\s*\)$/
            if (!coors) {
                this.setState({mode: 'none'});
                return;
            }

            let match = coors.match(regex);
            if (!match) {
                alert('Invalid coordinates format');
            }

            else {
                const x = parseFloat(match[1]); // group 1
                const y = parseFloat(match[3]); // group 3
                const z = parseFloat(match[5]); // group 5
                let r = prompt('Enter the radius of the circle');
                if (!r) return;
                try {
                    const radius = math.evaluate(r);
                    if (typeof radius !== 'number' || radius <= 0) {
                        alert('Invalid radius');
                        return;
                    }

                    let s: Sphere = {
                        centerS: {
                            x: x,
                            y: y,
                            z: z,
                            props: createPointDefaultShapeProps('O', 0.02, 0, 0.5, -0.5)
                        },
                        radius: radius,
                        props: {
                            line_style: {
                                dash_size: 0,
                                gap_size: 0,
                                dot_size: 0
                            },
                            radius: radius,
                            color: 'red',
                            fill: true,
                            opacity: 0.5,
                            visible: {
                                shape: true,
                                label: false,
                            },
                            labelXOffset: 0,
                            labelYOffset: 0,
                            labelZOffset: 0,
                            label: 'c',
                            id: uuidv4(),
                            line_size: 1
                        }
                    }

                    this.state.shapes.set(s.props.id, {
                        id: s.props.id,
                        type: s,
                        dependsOn: []
                    })

                    this.setState({mode: 'none'});
                }

                catch (error) {
                    alert('Invalid expression for radius');
                }
            }
        }

        else if (mode === "plane") {
            let expr = prompt('Input the equation of the plane');
            if (!expr) return
            const parts = expr.split('=');
            if (parts.length !== 2) {
                alert('Invalid equation of a plane');
                this.setState({mode: 'none'});
                return;
            }

            const [lhs, rhs] = parts;
            try {
                const extractVariables = (node: math.MathNode, variables = new Set<string>()): Set<string> => {
                    node.forEach?.((child: math.MathNode) => extractVariables(child, variables));
                    if (node.type === 'SymbolNode') {
                        const symbolNode = node as math.SymbolNode;
                        variables.add(symbolNode.name);
                    }
                        return variables;
                }

                let nodes: math.MathNode[] = [];
                for (const part of parts) {
                    const node = math.parse(part.trim());
                    nodes.push(node);
                }

                const allVars = new Set<string>();
                nodes.forEach(node => extractVariables(node, allVars));

                const usedVars = Array.from(allVars);
                const expectedVars = ['x', 'y', 'z'];

                if (usedVars.length > 3) {
                    alert('Invalid equation of a plane');
                    return;
                }

                const sortedUsed = [...usedVars].sort();
                const sortedExpected = expectedVars.slice(0, usedVars.length).sort();

                const isExact = sortedUsed.every((v, i) => v === sortedExpected[i]);

                if (!isExact) {
                    alert('Invalid equation of a plane');
                    this.setState({mode: 'none'});
                    return;
                }

                let left = math.parse(lhs);
                let right = math.parse(rhs);
                const eq = math.simplify(`(${left}) - (${right})`);
                let expanded = math.simplify(eq, { expand: true });
                console.log(expanded)

                // Get all terms and check degrees
                const terms = [expanded];
                for (const term of terms) {
                    const poly = math.simplify(term.toString());
                    const polyStr = poly.toString();

                    // Check if any variable appears with power > 1
                    const powerPattern = /(\w+)\^(\d+)/g;
                    let match;
                    while ((match = powerPattern.exec(polyStr)) !== null) {
                        if (parseInt(match[2]) > 1) {
                            alert('Invalid equation of a plane');
                            this.setState({mode: 'none'});
                            return;
                        }
                    }

                    // Check for non-linear operations like sin, cos, log, etc.
                    if (/sin|cos|tan|log|cot|sqrt/.test(polyStr)) {
                        alert('Invalid equation of a plane');
                        this.setState({mode: 'none'});
                        return;
                    }
                }

                let result = {
                    A: 0,
                    B: 0,
                    C: 0,
                    D: 0
                }

                const walk = (node: math.MathNode, multiplier = 1): void => {
                    console.log(node.type)
                    if (node.type === 'OperatorNode' && (node as math.OperatorNode).op === '+') {
                        (node as math.OperatorNode).args.forEach((args: math.MathNode) => walk(args, multiplier));
                    }
                    
                    else if (node.type === 'OperatorNode' && (node as math.OperatorNode).op === '-') {
                        walk((node as math.OperatorNode).args[0], multiplier);
                        walk((node as math.OperatorNode).args[1], -multiplier);
                    }
                    
                    else if (node.type === 'OperatorNode' && (node as math.OperatorNode).op === '*') {
                        let coeff = 1;
                        let variable = '';
                        (node as math.OperatorNode).args.forEach(arg => {
                            if (arg.type === 'ConstantNode') coeff *= Number((arg as math.ConstantNode).value);
                            if (arg.type === 'SymbolNode') variable = (arg as math.SymbolNode).name;
                        });
                        
                        if (variable === 'x') result.A += coeff * multiplier;
                        else if (variable === 'y') result.B += coeff * multiplier;
                        else if (variable === 'z') result.C += coeff * multiplier;
                    }
                    
                    else if (node.type === 'SymbolNode') {
                        if ((node as math.SymbolNode).name === 'x') result.A += multiplier;
                        else if ((node as math.SymbolNode).name === 'y') result.B += multiplier;
                        else if ((node as math.SymbolNode).name === 'z') result.C += multiplier;
                        
                    }
                    
                    else if (node.type === 'ConstantNode') {
                        result.D += Number((node as math.ConstantNode).value) * multiplier;
                    }
                }

                let ast = math.parse(expanded.toString());
                walk(ast);
                if (Math.pow(result.A, 2) + Math.pow(result.B, 2) + Math.pow(result.C, 2) === 0) {
                    this.setState({mode: 'none'});
                    alert('Invalid equation of a plane');
                    return;
                }

                let [x, y, z] = [0, 0, 0];

                if (result.A === 0) {
                    [x, y, z] = (result.C !== 0) ? [0, 0, -result.D / result.C] : [0, -result.D / result.B, 0];
                }

                else {
                    [x, y, z] = [-result.D / result.A, 0, 0];
                }

                console.log(result, [x, y, z]);

                let normal: Vector = {
                    startVector: {
                        x: 0,
                        y: 0,
                        z: 0,
                        props: createPointDefaultShapeProps('', 0.02, 0, 0, 0)
                    },

                    endVector: {
                        x: result.A,
                        y: result.B,
                        z: result.C,
                        props: createPointDefaultShapeProps('', 0.02, 0, 0, 0)
                    },

                    props: createLineDefaultShapeProps('', 0, 0, 0, 0)
                }

                let p: Plane = {
                    norm: normal,
                    point: {
                        x: x,
                        y: y,
                        z: z,
                        props: createPointDefaultShapeProps('', 0.02, 0, 0, 0)
                    },

                    props: createLineDefaultShapeProps('p', 0, 0, 0, 0)
                }

                p.props.color = 'blue';
                p.props.opacity = 1
                this.state.shapes.set(p.props.id, {
                    id: p.props.id,
                    type: p,
                    dependsOn: []
                })

                this.setState({mode: 'none'});
            }

            catch(error) {
                alert('Cannot parse the input expression!');
            }
        }
    }

    render(): React.ReactNode {
        const { width, height, background_color } = this.props;
        return (
            <div className="flex flex-row h-full">
                <GeometryTool3D 
                    width={width * 0.3}
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
                    onAddCuboid={this.handleAddCuboid}
                    onAddCone={this.handleAddCone}
                    onAddCylinder={this.handleAddCylinder}
                    onAddPlane={this.handleAddPlane}
                    onAddPrism={this.handleAddPrism}
                    onAddPyramid={this.handleAddPyramid}
                    onAddSphere={this.handleAddSphere}
                />

                <canvas
                    ref={this.canvasRef}
                    width={width * 0.7}
                    height={height}
                    style={{ background: background_color }}
                />
            </div>
        )
    }
}

export default ThreeDCanvas;