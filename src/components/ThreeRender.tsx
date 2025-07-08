import React, { RefObject } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer'
import { Shape, Sphere, GeometryState, ShapeProps, ShapeNode3D, Vector, Plane, Cylinder, Cone, Pyramid, Cuboid, Prism, 
        Polygon, Segment, Ray, Circle, Point, Line, 
        DrawingMode,
        HistoryEntry3D} from '../types/geometry';
import { GeometryTool3D } from './GeometryTool';
import * as utils3d from '../utils/utilities3D';
import * as utils from '../utils/utilities';
import * as constants3d from '../types/constants3D';
import ThreeAxis from '../utils/ThreeAxis';
import ThreeGrid from '../utils/ThreeGrid';
const math = require('mathjs');

interface ThreeDCanvasProps {
    width: number;
    height: number;
    background_color: string;
    geometryState: GeometryState;
    dag: Map<string, ShapeNode3D>,
    mode: DrawingMode;
    isSnapToGrid: boolean;
    isResize: boolean;
    selectedPoints: Point[];
    selectedShapes: Shape[];
    labelUsed: string[];
    data: {
        radius: number | undefined;
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
        dag: Map<string, ShapeNode3D>,
        selectedShapes: Shape[],
        selectedPoints: Point[]
    }) => void;
    onSelectedShapesChange: (s: Shape[]) => void;
    onSelectedPointsChange: (s: Point[]) => void;
    onGeometryStateChange: (s: GeometryState) => void;
    pushHistory: (history: HistoryEntry3D) => void;
    getSnapshot: () => HistoryEntry3D;
    onLabelUsed: (labelUsed: string[]) => void;
    onSelectedChange: (s: {
        selectedShapes: Shape[],
        selectedPoints: Point[]
    }) => void;
    onRenderMenuRightClick: (pos?: {x: number, y: number}) => void;
    onRemoveNode: (id: string) => void;
    onRenderDialogbox: (mode: DrawingMode) => void;
}

class ThreeDCanvas extends React.Component<ThreeDCanvasProps, GeometryState> {
    private sceneRef: RefObject<THREE.Scene | null>;
    private cameraRef: RefObject<THREE.PerspectiveCamera | null>;
    private rendererRef: RefObject<THREE.WebGLRenderer | null>;
    private controlsRef: RefObject<OrbitControls | null>;
    private canvasRef: RefObject<HTMLCanvasElement | null>;
    private labelRef: RefObject<CSS2DRenderer | null>;
    constructor(props: ThreeDCanvasProps) {
        super(props);
        this.sceneRef = React.createRef<THREE.Scene>();
        this.cameraRef = React.createRef<THREE.PerspectiveCamera>();
        this.rendererRef = React.createRef<THREE.WebGLRenderer>();
        this.controlsRef = React.createRef<OrbitControls>();
        this.canvasRef = React.createRef<HTMLCanvasElement>();
        this.labelRef = React.createRef<CSS2DRenderer>();
        this.handleMouseDown = this.handleMouseDown.bind(this);
    }

    componentDidMount(): void {
        this.initializeScene();
        this.updateShapes();
        this.rendererRef.current!.domElement.addEventListener("mousedown", this.handleMouseDown);
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
        this.rendererRef.current!.domElement.removeEventListener('mousedown', this.handleMouseDown);
    }

    animate = () => {
        requestAnimationFrame(this.animate);
        if (this.controlsRef.current && this.rendererRef.current && this.sceneRef.current && this.cameraRef.current && this.labelRef.current) {
            this.controlsRef.current.update();
            this.rendererRef.current.render(this.sceneRef.current, this.cameraRef.current);
            this.labelRef.current.render(this.sceneRef.current, this.cameraRef.current);
        }

        if (this.cameraRef.current && this.sceneRef.current) {
            const zoom = this.cameraRef.current.zoom;

            const scale = 1 / zoom; // Inverse scaling
            const xAxis = this.sceneRef.current.getObjectByName('xAxis');
            const yAxis = this.sceneRef.current.getObjectByName('yAxis');
            const zAxis = this.sceneRef.current.getObjectByName('zAxis');

            if (xAxis) xAxis.scale.set(scale, scale, scale);
            if (yAxis) yAxis.scale.set(scale, scale, scale);
            if (zAxis) zAxis.scale.set(scale, scale, scale);
        }
    }

    initializeScene = (): void => {
        const { width, height, background_color } = this.props;
        if (!this.canvasRef.current) return;
        this.canvasRef.current.width = width * window.devicePixelRatio;
        this.canvasRef.current.height = height * window.devicePixelRatio;

        // Create scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(background_color);
        this.sceneRef.current = scene;

        // Create camera
        const aspect = this.props.width / this.props.height;
        const camera = new THREE.PerspectiveCamera(
            75, aspect, 0.1, 1000
        );

        camera.zoom = 1;
        camera.updateProjectionMatrix();

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
        this.sceneRef.current.add(ambientLight);

        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        this.sceneRef.current.add(directionalLight);

        // Add axes helper
        const xAxis = new ThreeAxis({
            length: 13,
            radius: 0.02,
            axisColor: '#ff0000',
            pointerWidth: 0.1,
            pointerLength: 0.4,
            xTickSpacing: constants3d.BASE_SPACING,
            axisInterval: this.props.geometryState.axisTickInterval,
            originX: -6,
            originY: 0,
            originZ: 1,
        }).generateAxis(); // Red
        xAxis.rotation.z = -Math.PI / 2;

        const yAxis = new ThreeAxis({
            length: 13,
            radius: 0.02,
            axisColor: '#00ff00',
            pointerWidth: 0.1,
            pointerLength: 0.4,
            xTickSpacing: constants3d.BASE_SPACING,
            axisInterval: this.props.geometryState.axisTickInterval,
            originX: 1,
            originY: 0,
            originZ: 7
        }).generateAxis(); // Green
        yAxis.rotation.x = -Math.PI / 2;
        
        const zAxis = new ThreeAxis({
            length: 7,
            radius: 0.02,
            axisColor: '#0000ff',
            pointerWidth: 0.1,
            pointerLength: 0.4,
            xTickSpacing: constants3d.BASE_SPACING,
            axisInterval: this.props.geometryState.axisTickInterval,
            originX: 1,
            originY: -2,
            originZ: 1
        }).generateAxis(); // Blue

        // Grid Helper
        const grid = new ThreeGrid({
            size: this.props.geometryState.spacing,
            gridSpacing: this.props.geometryState.axisTickInterval,
            originX: 0,
            originY: 0,
            originZ: 0
        }).generateGrid();

        xAxis.name = 'xAxis';
        yAxis.name = 'yAxis';
        zAxis.name = 'zAxis';

        this.sceneRef.current.add(grid, xAxis, yAxis, zAxis);

        if (!this.props.geometryState.axesVisible) {
            xAxis.visible = false;
            yAxis.visible = false;
            zAxis.visible = false;
        }

        if (!this.props.geometryState.gridVisible) {
            grid.visible = false;
        }

        const labelRender = new CSS2DRenderer();
        labelRender.setSize(width, height);
        labelRender.domElement.style.position = 'absolute';
        labelRender.domElement.style.top = '0';
        labelRender.domElement.style.pointerEvents = 'none';
        document.body.appendChild(labelRender.domElement);
        this.labelRef.current = labelRender;
        
        // Add orbit controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableZoom = false;
        this.controlsRef.current = controls;
        
        renderer.domElement.addEventListener('wheel', this.onMouseWheel, { passive: false });
        requestAnimationFrame(this.animate);
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
                    }
                    
                    else {
                        object.material.dispose();
                    }
                }
            });

            this.rendererRef.current.dispose();
        }

        if (this.labelRef.current) {
            if (this.labelRef.current.domElement.parentNode) {
                this.labelRef.current.domElement.parentNode.removeChild(this.labelRef.current.domElement);
            }
        }
    };

    updateRendererSize = () => {
        if (this.rendererRef.current) {
            this.rendererRef.current.setSize(this.props.width, this.props.height);
        }

        if (this.labelRef.current) {
            this.labelRef.current.setSize(this.props.width, this.props.height);
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

    onMouseWheel = (event: WheelEvent) => {
        event.preventDefault();
        if (!this.cameraRef.current) return;
        const zoomFactor = 1.1;
        const scale = event.deltaY < 0 ? 1 / zoomFactor : zoomFactor;

        const rect = this.rendererRef.current!.domElement.getBoundingClientRect();
        const mouse = new THREE.Vector2(
            ((event.clientX - rect.left) / rect.width) * 2 - 1,
            -((event.clientY - rect.top) / rect.height) * 2 + 1
        );

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.cameraRef.current);

        const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); // XY-plane
        const targetPoint = new THREE.Vector3();
        const hit = raycaster.ray.intersectPlane(plane, targetPoint);
        if (!hit) return;

        const camToTarget = new THREE.Vector3().subVectors(targetPoint, this.cameraRef.current.position);

        // Apply zoom factor (interpolate between camera and targetPoint)
        const newPosition = new THREE.Vector3().addVectors(
            this.cameraRef.current.position,
            camToTarget.multiplyScalar(1 - scale) // e.g., 1 - 1/1.2 = 0.166 for zoom in
        );

        // Optional: limit zoom distance
        let newScale = this.props.geometryState.zoom_level * scale;
        if (newScale > 1000 || newScale < 0.002) {
            newScale = this.props.geometryState.zoom_level
        }

        // Update camera position and controls target
        this.cameraRef.current.position.copy(newPosition);

        // Keep orbit target fixed relative to view
        const offset = new THREE.Vector3().subVectors(this.controlsRef.current!.target, this.cameraRef.current.position);
        this.controlsRef.current!.target.copy(newPosition.clone().add(offset));
        this.controlsRef.current!.update();
        this.props.onGeometryStateChange({
            ...this.props.geometryState,
            zoom_level: newScale
        })
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

        if ('point' in shape && 'norm' in shape) {
            let pl: Plane = shape as Plane;
            geometry = new THREE.PlaneGeometry(5, 5);
            mesh = new THREE.Mesh(geometry, material);
            let point = utils3d.convertToVector3(pl.point.x, pl.point.y, pl.point.z ?? 0);
            let norm = utils3d.convertToVector3(
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
        
        else if ('centerBase1' in shape && 'centerBase2' in shape && 'radius' in shape) {
            let cy: Cylinder = shape as Cylinder;
            const start = utils3d.convertToVector3(cy.centerBase1.x, cy.centerBase1.y, cy.centerBase1.z ?? 0);
            const end = utils3d.convertToVector3(cy.centerBase2.x, cy.centerBase2.y, cy.centerBase2.z ?? 0);
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
        
        else if ('center' in shape && 'apex' in shape && 'radius' in shape) {
            let co: Cone = shape as Cone;
            const center = utils3d.convertToVector3(co.center.x, co.center.y, co.center.z ?? 0);
            const apex = utils3d.convertToVector3(co.apex.x, co.apex.y, co.apex.z ?? 0);
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
        
        else if ('centerS' in shape && 'radius' in shape) {
            let sp:  Sphere = shape as Sphere;
            geometry = new THREE.SphereGeometry(sp.radius, 32, 32);
            mesh = new THREE.Mesh(geometry, material);
            let center = utils3d.convertToVector3(sp.centerS.x, sp.centerS.y, sp.centerS.z ?? 0)
            mesh.position.set(center.x, center.y, center.z);
            labelPosition.copy(mesh.position).add(new THREE.Vector3(0, sp.radius + 0.5, 0));
        }
        
        else if ('apex' in shape && 'base' in shape) {
            let py: Pyramid = shape as Pyramid;
            const apex = utils3d.convertToVector3(py.apex.x, py.apex.y, py.apex.z ?? 0);
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
                baseCenter.add(utils3d.convertToVector3(p.x, p.y, p.z ?? 0));
            }
            
            baseCenter.divideScalar(py.base.points.length);
            mesh.position.copy(baseCenter);
            labelPosition = new THREE.Vector3().addVectors(baseCenter, apex).multiplyScalar(0.5);
        }
        
        else if ('width' in shape && 'height' in shape && 'depth' in shape) {
            let cube: Cuboid = shape as Cuboid;
            const width = cube.width;
            const height = cube.height;
            const depth = cube.depth;

            geometry = new THREE.BoxGeometry(width, height, depth);
            mesh = new THREE.Mesh(geometry, material);
            // 2. Create local axes
            const xAxis = utils3d.convertToVector3(
                cube.axisX.endVector.x - cube.axisX.startVector.x,
                cube.axisX.endVector.y - cube.axisX.startVector.y,
                (cube.axisX.endVector.z ?? 0) - (cube.axisX.startVector.z ?? 0)
            ).normalize();

            const yAxis = utils3d.convertToVector3(
                cube.axisY.endVector.x - cube.axisY.startVector.x,
                cube.axisY.endVector.y - cube.axisY.startVector.y,
                (cube.axisY.endVector.z ?? 0) - (cube.axisY.startVector.z ?? 0)
            ).normalize();

            const zAxis = new THREE.Vector3().crossVectors(xAxis, yAxis).normalize();

            // Re-orthogonalize Y to ensure perfect perpendicularity
            yAxis.crossVectors(zAxis, xAxis).normalize();

            // 3. Create rotation matrix from axes
            const rotationMatrix = new THREE.Matrix4().makeBasis(xAxis, yAxis, zAxis);

            // 4. Apply rotation
            mesh.setRotationFromMatrix(rotationMatrix);

            // 5. Move to center (Three.js BoxGeometry is centered)
            let pos = utils3d.convertToVector3(cube.origin.x, cube.origin.y, cube.origin.z ?? 0)
            mesh.position.set(pos.x, pos.y, pos.z);

            labelPosition.copy(mesh.position).add(new THREE.Vector3(0, height / 2 + 0.5, 0));
        }
        
        else if ('shiftVector' in shape && 'base' in shape) {
            let pr: Prism = shape as Prism
            const direction = utils3d.convertToVector3(
                pr.shiftVector.endVector.x - pr.shiftVector.startVector.x,
                pr.shiftVector.endVector.y - pr.shiftVector.startVector.y,
                (pr.shiftVector.endVector.z ?? 0) - (pr.shiftVector.startVector.z ?? 0),
            );

            let base: THREE.Vector3[] = [], secondBase: THREE.Vector3[] = [];
            pr.base.points.forEach(p => {
                base.push(utils3d.convertToVector3(p.x, p.y, p.z ?? 0));
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

            labelPosition = new THREE.Vector3().addVectors(baseCenter1, baseCenter2).multiplyScalar(0.5);
        }
        
        else if ('startVector' in shape && 'endVector' in shape) {
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
                constants3d.ARROW_DEFAULTS.POINTER_LENGTH * length, // Arrow head length
                constants3d.ARROW_DEFAULTS.POINTER_WIDTH * length // Arrow head width
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
            const label = utils3d.createLabel(
                shape.props.label, 
                labelPosition,
                shape.props.labelXOffset ?? 0,
                shape.props.labelYOffset ?? 0,
                shape.props.labelZOffset ?? 0,
                constants3d.FONT_DEFAULTS.COLOR
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
            wireframe: 'centerC' in shape && 'radius' in shape ? true : false
        });

        let geometry: THREE.BufferGeometry | null = null;
        let mesh: THREE.Mesh | THREE.Group | null = null;
        let labelPosition = new THREE.Vector3();

        if ('centerC' in shape && 'radius' in shape) {
            let c: Circle = shape as Circle;
            // Create points for the circle
            const points = [];
            const segments = 64; // Number of segments for the circle
            for (let i = 0; i <= segments; i++) {
                const theta = (i / segments) * Math.PI * 2;
                const x = Math.cos(theta);
                const y = Math.sin(theta);
                const z = 0;
                points.push(utils3d.convertToVector3(x, y, z));
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
                p.add(utils3d.convertToVector3(c.centerC.x, c.centerC.y, c.centerC.z ?? 0));
            }

            mesh = utils3d.createDashLine(points, c.props);
            labelPosition.copy(mesh!.position).add(new THREE.Vector3(0, c.radius + 0.5, 0));
        }
        
        else if ('x' in shape && 'y' in shape) {
            let p: Point = shape as Point;
            geometry = new THREE.SphereGeometry(shape.props.radius, 32, 32);
            mesh = new THREE.Mesh(geometry, material);
            let pConvert = utils3d.convertToVector3(p.x, p.y, p.z ?? 0);
            mesh.position.set(pConvert.x, pConvert.y, pConvert.z);
            labelPosition.copy(mesh.position).add(new THREE.Vector3(0, shape.props.radius + 0.5, 0));
        }
        
        else if ('startLine' in shape && 'endLine' in shape) {
            let l: Line = shape as Line;
            let points = []
            let start_point = utils3d.convertToVector3(l.startLine.x, l.startLine.y, l.startLine.z ?? 0)
            let end_point = utils3d.convertToVector3(l.endLine.x, l.endLine.y, l.endLine.z ?? 0)
            let direction = new THREE.Vector3().subVectors(end_point, start_point)
            const P1 = new THREE.Vector3().copy(start_point).sub(direction.clone().multiplyScalar(constants3d.LINE_EXTENSION))
            const P2 = new THREE.Vector3().copy(end_point).add(direction.clone().multiplyScalar(constants3d.LINE_EXTENSION))

            points.push(P1)
            points.push(P2)

            mesh = utils3d.createDashLine(points, l.props);
            labelPosition.copy(mesh!.position).add(new THREE.Vector3(0, 0, 0));
        }

        else if ('startRay' in shape && 'endRay' in shape) {
            let r: Ray = shape as Ray;
            let points = [];
            const P1 = utils3d.convertToVector3(r.startRay.x, r.startRay.y, r.startRay.z ?? 0);
            const P2 = utils3d.convertToVector3(r.endRay.x, r.endRay.y, r.endRay.z ?? 0);
            const direction = new THREE.Vector3().subVectors(P2, P1);
            const P3 = new THREE.Vector3().copy(P2).add(direction.clone().multiplyScalar(constants3d.LINE_EXTENSION));

            points.push(P1);
            points.push(P3);

            mesh = utils3d.createDashLine(points, r.props);
            labelPosition.copy(mesh!.position).add(new THREE.Vector3(0, 0, 0));
        }
        
        else if ('startSegment' in shape && 'endSegment' in shape) {
            let s: Segment = shape as Segment;
            let points = []
            const P1 = utils3d.convertToVector3(s.startSegment.x, s.startSegment.y, s.startSegment.z ?? 0)
            const P2 = utils3d.convertToVector3(s.endSegment.x, s.endSegment.y, s.endSegment.z ?? 0)
            
            points.push(P1)
            points.push(P2)

            mesh = utils3d.createDashLine(points, s.props);
            labelPosition.copy(mesh!.position).add(new THREE.Vector3(0, 0, 0));
        }
        
        else if ('points' in shape) {
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
            const label = utils3d.createLabel(
                shape.props.label, 
                labelPosition,
                shape.props.labelXOffset ?? 0,
                shape.props.labelYOffset ?? 0,
                shape.props.labelZOffset ?? 0,
                constants3d.FONT_DEFAULTS.COLOR
            );
            
            group.add(label);
        }

        return group;
    }

    createShape (shape: Shape): THREE.Object3D | null {
        // 2D shapes
        if (('x' in shape && 'y' in shape) || ('points' in shape) || ('startLine' in shape && 'endLine' in shape) ||
            ('startSegment' in shape && 'endSegment' in shape) || ('centerC' in shape && 'radius' in shape) ||
            ('startRay' in shape && 'endRay' in shape)
        ) {
            return this.create2DShape(shape);
        }

        // 3D shapes
        return this.create3DMesh(shape);
    }

    updateShapes = () => {
        if (!this.sceneRef.current) return;

        const children = [...this.sceneRef.current.children]
        // Clear existing shapes
        children.forEach(child => {
            if (child instanceof THREE.Group || child instanceof THREE.Mesh) {
                const isAxis = child.name === 'xAxis' || child.name === 'yAxis' || child.name === 'zAxis';
                if (!(child instanceof THREE.GridHelper) && !isAxis) {
                    this.sceneRef.current!.remove(child);
                }
            }
        });

        // Add new shapes
        this.props.dag.forEach(shape => {
            const mesh = this.createShape(shape.type);
            if (mesh) {
                this.sceneRef.current!.add(mesh);
            }
        })
    }

    private handleMouseDown = (e: MouseEvent) => {
        if (e.button !== 0) {
            this.props.onRenderMenuRightClick({x: e.clientX, y: e.clientY});
            return;
        }

        if (this.props.mode !== 'edit') {
            this.controlsRef.current!.enabled = false;
            requestAnimationFrame(() => this.handleDrawing);
            return;
        }

        this.controlsRef.current!.enabled = true;
    }

    private handleDrawing = () => {
        
    }

    render(): React.ReactNode {
        const { width, height, background_color } = this.props;
        return (
            <div className="flex flex-row h-full">
                <canvas
                    ref={this.canvasRef}
                    width={width}
                    height={height}
                    style={{ background: background_color }}
                />
            </div>
        )
    }
}

export default ThreeDCanvas;