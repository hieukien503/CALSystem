import React, { RefObject } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer'
import { Shape, Sphere, GeometryState, ShapeProps, ShapeNode3D, Vector, Plane, Cylinder, Cone, Pyramid, Cuboid, Prism, 
        Polygon, Segment, Ray, Circle, Point, Line } from '../types/geometry';
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
        linewidth: props.line_size
    });

    // Create line instead of mesh
    const mainLine = new THREE.Line(geometry, dashedMaterial);
    mainLine.computeLineDistances(); // Required for dashed lines

    // For dot-dash pattern, we need to create multiple lines with different dash patterns
    if (props.line_style.dot_size !== undefined) {
        // Create a second line for dots
        const dotMaterial = new THREE.LineDashedMaterial({
            color: props.color,
            dashSize: props.line_style.dot_size ?? 0.1, // Very small dash for dots
            gapSize: props.line_style.gap_size,     // Larger gap for dots
            linewidth: props.line_size
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
    private labelRenderer: RefObject<CSS2DRenderer | null>;
    private mode: string;
    private DAG: Map<string, ShapeNode3D>;
    private selectedShapes: Point[];

    constructor(props: ThreeDCanvasProps) {
        super(props);
        this.sceneRef = React.createRef<THREE.Scene>();
        this.cameraRef = React.createRef<THREE.PerspectiveCamera>();
        this.rendererRef = React.createRef<THREE.WebGLRenderer>();
        this.controlsRef = React.createRef<OrbitControls>();
        this.canvasRef = React.createRef<HTMLCanvasElement>();
        this.labelRenderer = React.createRef<CSS2DRenderer>();
        this.state = {
            numLoops: 0,
            spacing: 20,
            axisTickInterval: 1,
            shapes: [],
            gridVisible: true,
            axesVisible: true,
            zoom_level: 1,
            panning: false,
            dummy: false,
            polygonIndex: 0
        }

        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.mode = 'edit';
        this.DAG = new Map<string, ShapeNode3D>();
        this.selectedShapes = new Array<Point>();
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

        // Add label renderer
        if (this.labelRenderer.current) {
            this.labelRenderer.current.setSize(rect.width, rect.height);
            this.labelRenderer.current.domElement.style.position = 'absolute';
            this.labelRenderer.current.domElement.style.top = '0px';
            this.labelRenderer.current.domElement.style.pointerEvents = 'none';
        }
        
        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            if (this.sceneRef.current && this.cameraRef.current && this.rendererRef.current && this.labelRenderer.current) {
                this.rendererRef.current.render(this.sceneRef.current, this.cameraRef.current);
                this.rendererRef.current.render(this.sceneRef.current, this.cameraRef.current)
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
    ): CSS2DObject {
        // Create the HTML element for the label
        const div = document.createElement('div');
        div.className = 'label';
        div.textContent = text;

        // Style the label with CSS directly
        div.style.color = FONT_DEFAULTS.COLOR;
        div.style.fontSize = `${FONT_DEFAULTS.SIZE}px`;
        div.style.fontFamily = FONT_DEFAULTS.FAMILY;
        div.style.padding = '2px 6px';
        div.style.backgroundColor = 'rgba(0, 0, 0, 0)';
        div.style.borderRadius = '4px';
        div.style.whiteSpace = 'nowrap';
        div.style.pointerEvents = 'none'; // so it doesn’t block mouse events
        div.style.userSelect = 'none';

        // Create CSS2DObject from the div
        const label = new CSS2DObject(div);

        // Position label with offset
        label.position.set(
            position.x + xOffset,
            position.y + yOffset,
            position.z + zOffset
        );

        return label;
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

        if (shape.type === 'Plane') {
            let pl: Plane = shape as Plane;
            geometry = new THREE.PlaneGeometry(5, 5);
            mesh = new THREE.Mesh(geometry, material);
            let point = convertToVector3(pl.point.x, pl.point.y, pl.point.z ?? 0);
            let norm = convertToVector3(
                pl.norm.endVector.x - pl.norm.startVector.x,
                pl.norm.endVector.y - pl.norm.startVector.y,
                (pl.norm.endVector.z ?? 0) - (pl.norm.startVector.z ?? 0)
            );

            mesh.position.set(point.x, point.y, point.z);
            const defaultNormal = new THREE.Vector3(0, 0, 1);
            const quaternion = new THREE.Quaternion().setFromUnitVectors(defaultNormal, norm);
            mesh.quaternion.copy(quaternion);
            labelPosition.copy(mesh.position).add(new THREE.Vector3(0, 2.5, 0));
        }
        
        else if (shape.type === 'Cylinder') {
            let cy: Cylinder = shape as Cylinder;
            const start = convertToVector3(cy.centerBase1.x, cy.centerBase1.y, cy.centerBase1.z ?? 0);
            const end = convertToVector3(cy.centerBase2.x, cy.centerBase2.y, cy.centerBase2.z ?? 0);
            const direction = new THREE.Vector3().subVectors(end, start);
            const length = direction.length();
            const radius = cy.radius;

            geometry = new THREE.CylinderGeometry(radius, radius, length, 32);
            mesh = new THREE.Mesh(geometry, material);
            mesh.position.copy(start).add(direction.multiplyScalar(0.5));
            const defaultNormal = new THREE.Vector3(0, 0, 1);
            const quaternion = new THREE.Quaternion().setFromUnitVectors(defaultNormal, direction);
            mesh.quaternion.copy(quaternion);
            labelPosition = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
        }
        
        else if (shape.type === 'Cone') {
            let co: Cone = shape as Cone;
            const center = convertToVector3(co.center.x, co.center.y, co.center.z ?? 0);
            const apex = convertToVector3(co.apex.x, co.apex.y, co.apex.z ?? 0);
            const direction = new THREE.Vector3().subVectors(apex, center);
            const height = direction.length();
            const radius = co.radius

            geometry = new THREE.ConeGeometry(radius, height, 32);
            mesh = new THREE.Mesh(geometry, material);
            mesh.position.copy(center);
            const defaultNormal = new THREE.Vector3(0, 0, 1);
            const quaternion = new THREE.Quaternion().setFromUnitVectors(defaultNormal, direction);
            mesh.quaternion.copy(quaternion);
            labelPosition = new THREE.Vector3().addVectors(center, apex).multiplyScalar(0.5);
        }
        
        else if (shape.type === 'Sphere') {
            let sp:  Sphere = shape as Sphere;
            geometry = new THREE.SphereGeometry(sp.radius, 32, 32);
            mesh = new THREE.Mesh(geometry, material);
            let center = convertToVector3(sp.centerS.x, sp.centerS.y, sp.centerS.z ?? 0)
            mesh.position.set(center.x, center.y, center.z);
            labelPosition.copy(mesh.position).add(new THREE.Vector3(0, sp.radius + 0.5, 0));
        }
        
        else if (shape.type === 'Pyramid') {
            let py: Pyramid = shape as Pyramid;
            const apex = convertToVector3(py.apex.x, py.apex.y, py.apex.z ?? 0);
            const vertices: number[] = [];
            const indices: number[] = [];

            // Add base vertices
            py.base.points.forEach(p => {
                vertices.push(p.x, p.y, p.z ?? 0);
            });

            // Add apex vertex
            const apexIndex = py.base.points.length;
            vertices.push(apex.x, apex.y, apex.z);

            // Create side faces (triangle fan)
            for (let i = 0; i < py.base.points.length; i++) {
                const next = (i + 1) % py.base.points.length;
                indices.push(i, next, apexIndex); // triangle: base[i], base[next], apex
            }

            // Optionally: add base face (triangulate polygon)
            // For simplicity, assuming base is convex and planar
            for (let i = 1; i < py.base.points.length - 1; i++) {
                indices.push(0, i, i + 1); // triangle: base[0], base[i], base[i+1]
            }

            let geometry = new THREE.BufferGeometry();
            geometry.setIndex(indices);
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
            geometry.computeVertexNormals();
            mesh = new THREE.Mesh(geometry, material);

            let baseCenter = new THREE.Vector3();
            for (const p of py.base.points) {
                baseCenter.add(convertToVector3(p.x, p.y, p.z ?? 0));
            }
            
            baseCenter.divideScalar(py.base.points.length);
            mesh.position.copy(baseCenter);
            labelPosition = new THREE.Vector3().addVectors(baseCenter, apex).multiplyScalar(0.5);
        }
        
        else if (shape.type === 'Cuboid') {
            let cube: Cuboid = shape as Cuboid
            const width = Math.abs(cube.bottomRightFront.x - cube.topLeftBack.x);
            const height = Math.abs(cube.bottomRightFront.y - cube.topLeftBack.y);
            const depth = Math.abs((cube.bottomRightFront.z ?? 0) - (cube.topLeftBack.z ?? 0));

            geometry = new THREE.BoxGeometry(width, height, depth);
            mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(
                (cube.topLeftBack.x + cube.bottomRightFront.x) / 2,
                (cube.topLeftBack.y + cube.bottomRightFront.y) / 2,
                ((cube.topLeftBack.z ?? 0) + (cube.bottomRightFront.z ?? 0)) / 2
            );

            labelPosition.copy(mesh.position).add(new THREE.Vector3(0, height / 2 + 0.5, 0));
        }
        
        else if (shape.type === 'Prism') {
            let pr: Prism = shape as Prism
            const direction = convertToVector3(
                pr.shiftVector.endVector.x - pr.shiftVector.startVector.x,
                pr.shiftVector.endVector.y - pr.shiftVector.startVector.y,
                (pr.shiftVector.endVector.z ?? 0) - (pr.shiftVector.startVector.z ?? 0),
            );

            let base: THREE.Vector3[] = [], secondBase: THREE.Vector3[] = [];
            pr.base.points.forEach(p => {
                base.push(convertToVector3(p.x, p.y, p.z ?? 0));
                let v = base[base.length - 1].clone()
                secondBase.push(v.add(direction))
            })

            const geometry = new THREE.BufferGeometry();
            // Prepare arrays for positions and indices
            const positions: number[] = [];
            const indices: number[] = [];

            // Push base vertices positions
            base.forEach(v => {
                positions.push(v.x, v.y, v.z);
            });

            // Push top vertices positions
            secondBase.forEach(v => {
                positions.push(v.x, v.y, v.z);
            });

            // --- Create base face (triangulate using triangle fan method) ---
            // Base vertices are 0..n-1
            for (let i = 1; i < base.length - 1; i++) {
                indices.push(0, i, i + 1);
            }

            // --- Create top face ---
            // Top vertices are n..2n-1
            // We reverse winding order for top to keep normals consistent (facing outward)
            for (let i = 1; i < base.length - 1; i++) {
                indices.push(base.length, base.length + i + 1, base.length + i);
            }

            // --- Create side faces ---
            for (let i = 0; i < base.length; i++) {
                const next = (i + 1) % base.length;

                // Quad between base and top vertices split into two triangles
                // vertices: i, next, n + next, n + i
                indices.push(i, next, base.length + next);
                indices.push(i, base.length + next, base.length + i);
            }

            const positionNumComponents = 3;
            const positionAttribute = new THREE.Float32BufferAttribute(positions, positionNumComponents);
            geometry.setAttribute('position', positionAttribute);

            geometry.setIndex(indices);

            // Compute normals automatically
            geometry.computeVertexNormals();

            // Mesh
            const mesh = new THREE.Mesh(geometry, material);
            const baseCenter1 = new THREE.Vector3(), baseCenter2 = new THREE.Vector3();
            base.forEach(v => {
                baseCenter1.add(v);
            })

            secondBase.forEach(v => {
                baseCenter2.add(v);
            })

            baseCenter1.divideScalar(base.length);
            baseCenter2.divideScalar(secondBase.length);
            mesh.position.copy(baseCenter1);
            labelPosition = new THREE.Vector3().addVectors(baseCenter1, baseCenter2).multiplyScalar(0.5);
        }
        
        else if (shape.type === 'Vector') {
            // Calculate direction vector
            let v: Vector = shape as Vector
            const start = new THREE.Vector3(
                v.startVector.x,
                v.startVector.y,
                v.startVector.z ?? 0
            );
            const end = new THREE.Vector3(
                v.endVector.x,
                v.endVector.y,
                v.endVector.z ?? 0
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
                shape.props.labelXOffset ?? 0,
                shape.props.labelYOffset ?? 0,
                shape.props.labelZOffset ?? 0
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
            wireframe: shape.type === 'Circle' ? true : false
        });

        let geometry: THREE.BufferGeometry | null = null;
        let mesh: THREE.Mesh | THREE.Group | null = null;
        let labelPosition = new THREE.Vector3();

        if (shape.type === 'Circle') {
            let c: Circle = shape as Circle;
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
                p.multiplyScalar(c.radius);
            }

            let normalVec = c.normal? new THREE.Vector3(
                c.normal.endVector.x - c.normal.startVector.x,
                (c.normal.endVector.z ?? 0) - (c.normal.startVector.z ?? 0),
                c.normal.endVector.y - c.normal.startVector.y
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
                p.add(convertToVector3(c.centerC.x, c.centerC.y, c.centerC.z ?? 0));
            }

            mesh = createDashLine(points, c.props);
            labelPosition.copy(mesh!.position).add(new THREE.Vector3(0, c.radius + 0.5, 0));
        }
        
        else if (shape.type === 'Point') {
            let p: Point = shape as Point;
            geometry = new THREE.SphereGeometry(shape.props.radius, 32, 32);
            mesh = new THREE.Mesh(geometry, material);
            let pConvert = convertToVector3(p.x, p.y, p.z ?? 0);
            mesh.position.set(pConvert.x, pConvert.y, pConvert.z);
            labelPosition.copy(mesh.position).add(new THREE.Vector3(0, shape.props.radius + 0.5, 0));
        }
        
        else if (shape.type === 'Line') {
            let l: Line = shape as Line;
            let points = []
            let start_point = convertToVector3(l.startLine.x, l.startLine.y, l.startLine.z ?? 0)
            let end_point = convertToVector3(l.endLine.x, l.endLine.y, l.endLine.z ?? 0)
            let direction = new THREE.Vector3().subVectors(end_point, start_point)
            const P1 = new THREE.Vector3().copy(start_point).sub(direction.clone().multiplyScalar(LINE_EXTENSION))
            const P2 = new THREE.Vector3().copy(end_point).add(direction.clone().multiplyScalar(LINE_EXTENSION))

            points.push(P1)
            points.push(P2)

            mesh = createDashLine(points, l.props);
            labelPosition.copy(mesh!.position).add(new THREE.Vector3(0, 0, 0));
        }

        else if (shape.type === 'Ray') {
            let r: Ray = shape as Ray;
            let points = [];
            const P1 = convertToVector3(r.startRay.x, r.startRay.y, r.startRay.z ?? 0);
            const P2 = convertToVector3(r.endRay.x, r.endRay.y, r.endRay.z ?? 0);
            const direction = new THREE.Vector3().subVectors(P2, P1);
            const P3 = new THREE.Vector3().copy(P2).add(direction.clone().multiplyScalar(LINE_EXTENSION));

            points.push(P1);
            points.push(P3);

            mesh = createDashLine(points, r.props);
            labelPosition.copy(mesh!.position).add(new THREE.Vector3(0, 0, 0));
        }
        
        else if (shape.type === 'Segment') {
            let s: Segment = shape as Segment;
            let points = []
            const P1 = convertToVector3(s.startSegment.x, s.startSegment.y, s.startSegment.z ?? 0)
            const P2 = convertToVector3(s.endSegment.x, s.endSegment.y, s.endSegment.z ?? 0)
            
            points.push(P1)
            points.push(P2)

            mesh = createDashLine(points, s.props);
            labelPosition.copy(mesh!.position).add(new THREE.Vector3(0, 0, 0));
        }
        
        else if (shape.type === 'Polygon') {
            // Create a polygon from the points
            let poly: Polygon = shape as Polygon;
            const points = poly.points.map(point => new THREE.Vector3(point.x, point.y, point.z ?? 0));
            
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
                shape.props.labelXOffset ?? 0,
                shape.props.labelYOffset ?? 0,
                shape.props.labelZOffset ?? 0
            );
            
            group.add(label);
        }

        return group;
    }

    createShape (shape: Shape): THREE.Object3D | null {
        // 2D shapes
        if (shape.type === 'Circle' || shape.type === 'Polygon' || shape.type === 'Line' || shape.type === 'Segment' || 
            shape.type === 'Point' || shape.type === 'Ray') {
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
        this.DAG.forEach(shape => {
            const mesh = this.createShape(shape.type);
            if (mesh) {
                this.sceneRef.current!.add(mesh);
            }
        })
    }

    private handleClearClick = () => {
        this.setState({
            shapes: [],
            polygonIndex: 0
        });

        this.selectedShapes = [];
        this.mode = 'edit';
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

    private handleUndoClick = () => {

    }

    private handleRedoClick = () => {

    }

    private handleAddCuboid = () => {
        this.mode = 'cuboid';
    }

    private handleAddCylinder = () => {
        this.mode = 'cylinder';
    }

    private handleAddPrism = () => {
        this.mode = 'prism';
    }

    private handleAddPyramid = () => {
        this.mode = 'pyramid';
    }

    private handleAddSphere = () => {
        this.mode = 'sphere';
    }

    private handleAddPlane = () => {
        this.mode = 'plane';
    }

    private handleAddCone = () => {
        this.mode = 'cone';
    }

    private handleMouseDown = (e: MouseEvent) => {
        if (e.button === 0 && this.mode !== 'edit') {
            this.handleDrawing();
        }
    }

    private handleDrawing = () => {
        let mode = this.mode;
        if (mode === "sphere") {
            let coors = prompt('Enter the center radius');
            let regex = /^\(\s*(-?\d+(\.\d+)?)\s*,\s*(-?\d+(\.\d+)?)\s*,\s*(-?\d+(\.\d+)?)\s*\)$/
            if (!coors) {
                this.mode = 'edit';
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
                            props: createPointDefaultShapeProps('O', 0.02, 0, 0.5, -0.5),
                            type: 'Point'
                        },
                        radius: radius,
                        type: 'Sphere',
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

                    this.DAG.set(s.props.id, {
                        id: s.props.id,
                        type: s,
                        dependsOn: []
                    })

                    this.mode = 'edit';
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
                this.mode = 'edit';
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
                    this.mode = 'edit';
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
                            this.mode = 'edit';
                            return;
                        }
                    }

                    // Check for non-linear operations like sin, cos, log, etc.
                    if (/sin|cos|tan|log|cot|sqrt/.test(polyStr)) {
                        alert('Invalid equation of a plane');
                        this.mode = 'edit';
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
                    this.mode = 'edit';
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
                        props: createPointDefaultShapeProps('', 0.02, 0, 0, 0),
                        type: 'Point'
                    },

                    endVector: {
                        x: result.A,
                        y: result.B,
                        z: result.C,
                        props: createPointDefaultShapeProps('', 0.02, 0, 0, 0),
                        type: 'Point'
                    },

                    props: createLineDefaultShapeProps('', 0, 0, 0, 0),
                    type: 'Vector'
                }

                let p: Plane = {
                    norm: normal,
                    point: {
                        x: x,
                        y: y,
                        z: z,
                        props: createPointDefaultShapeProps('', 0.02, 0, 0, 0),
                        type: 'Point'
                    },

                    props: createLineDefaultShapeProps('p', 0, 0, 0, 0),
                    type: 'Plane'
                }

                p.props.color = 'blue';
                p.props.opacity = 1
                this.DAG.set(p.props.id, {
                    id: p.props.id,
                    type: p,
                    dependsOn: []
                })

                this.mode = 'edit';
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
                    onAngleClick={this.handleAddSphere}
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