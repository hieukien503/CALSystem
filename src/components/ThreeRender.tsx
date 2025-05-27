import React, { RefObject } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Shape, GeometryState, ShapeProps, ShapeNode } from '../types/geometry';
import {
    isPlane, isCylinder, isCone, isSphere, isPyramid, isCuboid, isPrism,
    isPoint, isLine, isVector, isSegment, isPolygon, isCircle, isRay
} from '../utils/type_guard';

interface ThreeDCanvasProps {
    width: number;
    height: number;
    background_color: string;
    shapes: Shape[];
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
            shapes: new Map<string, ShapeNode>(),
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
    }

    componentDidMount(): void {
        this.initializeScene();
        this.updateShapes();
    }

    componentDidUpdate(prevProps: ThreeDCanvasProps): void {
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

        if (prevProps.shapes !== this.props.shapes) {
            this.updateShapes();
        }
    }

    componentWillUnmount() {
        this.disposeResources();
    }

    initializeScene(): void {
        const { width, height, background_color } = this.props;
        if (!this.canvasRef.current) return;
        this.canvasRef.current.width = width * window.devicePixelRatio;
        this.canvasRef.current.height = height * window.devicePixelRatio;

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
        renderer.setSize(width, height);
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
            opacity: shape.props.opacity ?? 0.1
        });

        let geometry: THREE.BufferGeometry | null = null;
        let mesh: THREE.Mesh | THREE.Group | null = null;
        let labelPosition = new THREE.Vector3();

        if (isPlane(shape)) {
            geometry = new THREE.PlaneGeometry(5, 5);
            mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(shape.point.x, shape.point.y, shape.point.z || 0);
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
            mesh.position.set(shape.centerS.x, shape.centerS.y, shape.centerS.z || 0);
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
            mesh.lookAt(apex);
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
        this.props.shapes.forEach(shape => {
            const mesh = this.createShape(shape);
            if (mesh) {
                this.sceneRef.current!.add(mesh);
            }
        })
    }

    render(): React.ReactNode {
        const { width, height, background_color } = this.props;
        return (
            <canvas
                ref={this.canvasRef}
                width={width}
                height={height}
                style={{ background: background_color }}
            />
        )
    }
}

export default ThreeDCanvas;