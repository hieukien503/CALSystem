import React, { RefObject } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Shape, Sphere, GeometryState, ShapeNode3D, Vector, Plane, Cylinder, Cone, Pyramid, Prism, 
        Polygon, Segment, Ray, Circle, Point, Line, Angle,
        DrawingMode,
        HistoryEntry3D
    } from '../../types/geometry';
import * as Factory from '../../utils/Factory'
import * as utils3d from '../../utils/utilities3D';
import * as utils from '../../utils/utilities';
import * as constants from '../../types/constants';
import * as constants3d from '../../types/constants3D';
import * as operation from '../../utils/math_operation'
import ThreeAxis from '../../utils/ThreeAxis';
import ThreeGrid from '../../utils/ThreeGrid';

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
    data: number | {
        type: string, x: number, y: number, z: number
    } | {
        degree: number;
        CCW: boolean;
    } | undefined;
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
    constructor(props: ThreeDCanvasProps) {
        super(props);
        this.sceneRef = React.createRef<THREE.Scene>();
        this.cameraRef = React.createRef<THREE.PerspectiveCamera>();
        this.rendererRef = React.createRef<THREE.WebGLRenderer>();
        this.controlsRef = React.createRef<OrbitControls>();
        this.canvasRef = React.createRef<HTMLCanvasElement>();
        this.handleMouseDown = this.handleMouseDown.bind(this);
    }

    componentDidMount(): void {
        this.initializeScene();
        this.updateShapes();
        this.rendererRef.current!.domElement.addEventListener("pointerdown", this.handleMouseDown);
        this.rendererRef.current!.domElement.addEventListener('contextmenu', this.handleContextMenu);
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

        if (
            this.props.mode === 'point' &&
            this.props.data !== prevProps.data &&
            this.props.data !== undefined &&
            typeof this.props.data === 'object' &&
            ('x' in this.props.data && 'y' in this.props.data && 'z' in this.props.data)
        ) {
            this.handleDrawing(); // ✅ call same function again
        }

        else if (
            (['segment_length', 'circle_center_direction', 'enlarge', 'sphere', 'cone', 'cylinder', 'prism'].includes(this.props.mode)) &&
            this.props.data !== prevProps.data &&
            typeof this.props.data === 'number'
        ) {
            this.handleDrawing(); // ✅ call same function again
        }

        if (prevProps.dag !== this.props.dag || prevProps.geometryState !== this.props.geometryState) {
            this.updateShapes();
        }
    }

    componentWillUnmount() {
        this.disposeResources();
        this.rendererRef.current!.domElement.removeEventListener('pointerdown', this.handleMouseDown);
        this.rendererRef.current!.domElement.removeEventListener('contextmenu', this.handleContextMenu);
    }

    private handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
    };

    animate = () => {
        requestAnimationFrame(this.animate);
        if (this.controlsRef.current && this.rendererRef.current && this.sceneRef.current && this.cameraRef.current) {
            this.controlsRef.current.update();
            this.rendererRef.current.render(this.sceneRef.current, this.cameraRef.current);
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
            length: 12,
            radius: 0.02,
            axisColor: '#ff0000',
            pointerWidth: 0.1,
            pointerLength: 0.4,
            xTickSpacing: constants3d.BASE_SPACING,
            axisInterval: this.props.geometryState.axisTickInterval,
            ratio: 1,
            rotation: [0, 0, -Math.PI / 2]
        }).generateAxis(); // Red

        const yAxis = new ThreeAxis({
            length: 12,
            radius: 0.02,
            axisColor: '#00ff00',
            pointerWidth: 0.1,
            pointerLength: 0.4,
            xTickSpacing: constants3d.BASE_SPACING,
            axisInterval: this.props.geometryState.axisTickInterval,
            ratio: 1,
            rotation: [Math.PI / 2, 0, 0]
        }).generateAxis(); // Green
        
        const zAxis = new ThreeAxis({
            length: 7.4,
            radius: 0.02,
            axisColor: '#0000ff',
            pointerWidth: 0.1,
            pointerLength: 0.4,
            xTickSpacing: constants3d.BASE_SPACING,
            axisInterval: this.props.geometryState.axisTickInterval,
            ratio: 0.51,
            rotation: [0, 0, 0]
        }).generateAxis(); // Blue

        // Grid Helper
        const grid = new ThreeGrid({
            size: constants3d.BASE_SPACING,
            gridSpacing: 1,
            originX: 0,
            originY: 0,
            originZ: 0
        }).generateGrid();

        xAxis.name = 'line-xAxis';
        yAxis.name = 'line-yAxis';
        zAxis.name = 'line-zAxis';
        grid.name = 'grid';

        this.sceneRef.current.add(grid, xAxis, yAxis, zAxis);

        // Add Oxz plane
        const geometry = new THREE.PlaneGeometry(12, 12);
        const material = new THREE.MeshPhongMaterial({
            color: 'gray',
            transparent: true,
            opacity: 0.2,
            side: THREE.DoubleSide,
            depthWrite: true
        });

        const depthMaterial = new THREE.MeshBasicMaterial({
            colorWrite: false, // Invisible but writes to depth buffer
            depthWrite: true,
            depthTest: true,
            side: THREE.DoubleSide
        });

        const visibleMesh = new THREE.Mesh(geometry, material);
        const depthMesh = new THREE.Mesh(geometry, depthMaterial);
        const group = new THREE.Group();
        group.add(visibleMesh);
        group.add(depthMesh);

        const mesh = group as unknown as THREE.Mesh;

        mesh.name = 'plane-OxyPlane';
        let point = utils3d.convertToVector3(0, 0, 0);
        let norm = utils3d.convertToVector3(0, 0, 1).normalize();

        mesh.position.set(point.x, point.y, point.z);
        const defaultNormal = utils3d.convertToVector3(0, 1, 0);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(defaultNormal, norm);
        mesh.quaternion.copy(quaternion);
        this.sceneRef.current.add(mesh);

        if (!this.props.geometryState.axesVisible) {
            xAxis.visible = false;
            yAxis.visible = false;
            zAxis.visible = false;
        }

        if (!this.props.geometryState.gridVisible) {
            grid.visible = false;
        }

        // Add axis and Oxy plane to DAG
        const DAG = utils3d.cloneDAG(this.props.dag);
        const xAxisLine = Factory.createLine(
            utils.createLineDefaultShapeProps('xAxis'),
            Factory.createPoint(
                utils.createPointDefaultShapeProps(''),
                0, 0, 0
            ),
            Factory.createPoint(
                utils.createPointDefaultShapeProps(''),
                1, 0, 0
            )
        );

        const yAxisLine = Factory.createLine(
            utils.createLineDefaultShapeProps('yAxis'),
            Factory.createPoint(
                utils.createPointDefaultShapeProps(''),
                0, 0, 0
            ),
            Factory.createPoint(
                utils.createPointDefaultShapeProps(''),
                0, 1, 0
            )
        );

        const zAxisLine = Factory.createLine(
            utils.createLineDefaultShapeProps('zAxis'),
            Factory.createPoint(
                utils.createPointDefaultShapeProps(''),
                0, 0, 0
            ),
            Factory.createPoint(
                utils.createPointDefaultShapeProps(''),
                0, 0, 1
            )
        );

        DAG.set(xAxisLine.props.id, {
            id: xAxisLine.props.id,
            type: xAxisLine,
            dependsOn: [],
            isSelected: false,
            defined: true
        });

        DAG.set(yAxisLine.props.id, {
            id: yAxisLine.props.id,
            type: yAxisLine,
            dependsOn: [],
            isSelected: false,
            defined: true
        });

        DAG.set(zAxisLine.props.id, {
            id: zAxisLine.props.id,
            type: zAxisLine,
            dependsOn: [],
            isSelected: false,
            defined: true
        });

        const oxyPlane = Factory.createPlane(
            utils.createPlaneDefaultShapeProps('OxyPlane'),
            Factory.createPoint(
                utils.createPointDefaultShapeProps(''),
                0, 0, 0
            ),
            Factory.createVector(
                utils.createVectorDefaultShapeProps(''),
                Factory.createPoint(
                    utils.createPointDefaultShapeProps(''),
                    0, 0, 0
                ),
                Factory.createPoint(
                    utils.createPointDefaultShapeProps(''),
                    0, 0, 1
                )
            )
        );

        DAG.set(oxyPlane.props.id, {
            id: oxyPlane.props.id,
            type: oxyPlane,
            dependsOn: [],
            isSelected: false,
            defined: true
        });

        this.props.onUpdateAll({
            gs: this.props.geometryState,
            dag: DAG,
            selectedShapes: this.props.selectedShapes,
            selectedPoints: this.props.selectedPoints
        })
        
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

    onMouseWheel = (event: WheelEvent) => {
        event.preventDefault();
        if (!this.cameraRef.current) return;
        const zoomFactor = 1.1;
        const scale = event.deltaY < 0 ? 1 / zoomFactor : zoomFactor;

        const targetPoint = this.screenToWorld(new THREE.Vector2(event.clientX, event.clientY));
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
            opacity: shape.props.opacity ?? 0.5,
            side: THREE.DoubleSide,
            depthWrite: true
        });

        const depthMaterial = new THREE.MeshBasicMaterial({
            colorWrite: false, // Invisible but writes to depth buffer
            depthWrite: true,
            depthTest: true,
            side: THREE.DoubleSide
        })

        let geometry: THREE.BufferGeometry | null = null;
        let mesh: THREE.Mesh | THREE.Group | null = null;
        let labelPosition = new THREE.Vector3();
        if ('point' in shape && 'norm' in shape) {
            material.polygonOffset = true;
            material.polygonOffsetFactor = 1;
            material.polygonOffsetUnits = 1;

            depthMaterial.polygonOffset = true;
            depthMaterial.polygonOffsetFactor = 1;
            depthMaterial.polygonOffsetUnits = 1;
        }

        else {
            material.polygonOffset = true;
            material.polygonOffsetFactor = -1;
            material.polygonOffsetUnits = -1;

            depthMaterial.polygonOffset = true;
            depthMaterial.polygonOffsetFactor = -1;
            depthMaterial.polygonOffsetUnits = -1;
        }

        if ('point' in shape && 'norm' in shape) {
            let pl: Plane = shape as Plane;
            geometry = new THREE.PlaneGeometry(12, 12);
            const visibleMesh = new THREE.Mesh(geometry, material);
            const depthMesh = new THREE.Mesh(geometry, depthMaterial);
            let point = utils3d.convertToVector3(pl.point.x, pl.point.y, pl.point.z ?? 0);
            let norm = utils3d.convertToVector3(
                pl.norm.endVector.x - pl.norm.startVector.x,
                pl.norm.endVector.y - pl.norm.startVector.y,
                (pl.norm.endVector.z ?? 0) - (pl.norm.startVector.z ?? 0)
            ).normalize();

            const group = new THREE.Group();
            group.add(visibleMesh);
            group.add(depthMesh);
            group.position.set(point.x, point.y, point.z);

            mesh = group as unknown as THREE.Mesh;
            const defaultNormal = utils3d.convertToVector3(0, 1, 0);
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
            const visibleMesh = new THREE.Mesh(geometry, material);
            const depthMesh = new THREE.Mesh(geometry, depthMaterial);
            const group = new THREE.Group();
            group.add(visibleMesh);
            group.add(depthMesh);

            mesh = group as unknown as THREE.Mesh;
            const defaultNormal = new THREE.Vector3(0, 1, 0);
            const quaternion = new THREE.Quaternion().setFromUnitVectors(defaultNormal, direction.clone().normalize());
            mesh.quaternion.copy(quaternion);
            mesh.position.copy(start).add(direction.clone().multiplyScalar(0.5));
            labelPosition = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);

            const base1 = Factory.createCircle(
                utils.createCircleDefaultShapeProps('', cy.radius),
                cy.centerBase1,
                cy.radius,
                Factory.createVector(
                    utils.createVectorDefaultShapeProps(''),
                    cy.centerBase1,
                    cy.centerBase2
                )
            );

            const base2 = Factory.createCircle(
                utils.createCircleDefaultShapeProps('', cy.radius),
                cy.centerBase2,
                cy.radius,
                Factory.createVector(
                    utils.createVectorDefaultShapeProps(''),
                    cy.centerBase2,
                    cy.centerBase1
                )
            );

            base1.props.color = shape.props.color;
            base2.props.color = shape.props.color;

            const base1Mesh = this.create2DShape(base1);
            const base2Mesh = this.create2DShape(base2);
            const cylinderGroup = new THREE.Group();
            if (base1Mesh) cylinderGroup.add(base1Mesh);
            if (base2Mesh) cylinderGroup.add(base2Mesh);
            cylinderGroup.add(mesh);
            mesh = cylinderGroup as unknown as THREE.Mesh;
        }
        
        else if ('center' in shape && 'apex' in shape && 'radius' in shape) {
            let co: Cone = shape as Cone;
            const center = utils3d.convertToVector3(co.center.x, co.center.y, co.center.z ?? 0);
            const apex = utils3d.convertToVector3(co.apex.x, co.apex.y, co.apex.z ?? 0);
            const direction = new THREE.Vector3().subVectors(apex, center);
            const height = direction.length();
            const radius = co.radius

            geometry = new THREE.ConeGeometry(radius, height, 32);
            const visibleMesh = new THREE.Mesh(geometry, material);
            const depthMesh = new THREE.Mesh(geometry, depthMaterial);
            const group = new THREE.Group();
            group.add(visibleMesh);
            group.add(depthMesh);

            mesh = group as unknown as THREE.Mesh;
            const defaultNormal = new THREE.Vector3(0, 1, 0);
            const quaternion = new THREE.Quaternion().setFromUnitVectors(defaultNormal, direction.clone().normalize());
            mesh.quaternion.copy(quaternion);
            mesh.position.copy(center).add(direction.clone().multiplyScalar(0.5));
            labelPosition = new THREE.Vector3().addVectors(center, apex).multiplyScalar(0.5);

            const base = Factory.createCircle(
                utils.createCircleDefaultShapeProps('', co.radius),
                co.center,
                co.radius,
                Factory.createVector(
                    utils.createVectorDefaultShapeProps(''),
                    co.center,
                    co.apex
                )
            );

            base.props.color = shape.props.color;

            const baseMesh = this.create2DShape(base);
            const coneGroup = new THREE.Group();
            if (baseMesh) coneGroup.add(baseMesh);
            coneGroup.add(mesh);
            mesh = coneGroup as unknown as THREE.Mesh;
        }
        
        else if ('centerS' in shape && 'radius' in shape) {
            let sp: Sphere = shape as Sphere;
            geometry = new THREE.SphereGeometry(sp.radius, 32, 32);
            const visibleMesh = new THREE.Mesh(geometry, material);
            const depthMesh = new THREE.Mesh(geometry, depthMaterial);
            const group = new THREE.Group();
            group.add(visibleMesh);
            group.add(depthMesh);

            mesh = group as unknown as THREE.Mesh;
            let center = utils3d.convertToVector3(sp.centerS.x, sp.centerS.y, sp.centerS.z ?? 0)
            mesh.position.set(center.x, center.y, center.z);
            labelPosition.copy(mesh.position).add(new THREE.Vector3(0, sp.radius + 0.5, 0));
        }
        
        else if ('apex' in shape && 'base' in shape) {
            let py: Pyramid = shape as Pyramid;
            const apex = utils3d.convertToVector3(py.apex.x, py.apex.y, py.apex.z ?? 0);
            const vertices: number[] = [];
            const indices: number[] = [];
            
            py.base.points.forEach(p => {
                const v = utils3d.convertToVector3(p.x, p.y, p.z ?? 0);
                vertices.push(v.x, v.y, v.z);
            });

            // Add apex vertex
            const apexIndex = py.base.points.length;
            vertices.push(apex.x, apex.y, apex.z);

            // Create side faces (triangle fan)
            for (let i = 0; i < py.base.points.length; i++) {
                const next = (i + 1) % py.base.points.length;
                indices.push(apexIndex, i, next); // triangle: base[i], base[next], apex
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
            const visibleMesh = new THREE.Mesh(geometry, material);
            const depthMesh = new THREE.Mesh(geometry, depthMaterial);
            const group = new THREE.Group();
            group.add(visibleMesh);
            group.add(depthMesh);

            const fillMesh = group as unknown as THREE.Mesh;
            const pyramidGroup = new THREE.Group();

            let baseCenter = new THREE.Vector3();
            for (const p of py.base.points) {
                baseCenter.add(utils3d.convertToVector3(p.x, p.y, p.z ?? 0));
            }

            for (let i = 0; i < py.base.points.length; i++) {
                const start = apex;
                const end   = utils3d.convertToVector3(py.base.points[i].x, py.base.points[i].y, py.base.points[i].z ?? 0);
                const props = utils.createLineDefaultShapeProps("");
                props.color = shape.props.color;

                const edge = utils3d.createDashLine([start, end], props);
                edge.renderOrder = 18; // Ensure edges render above fill
                pyramidGroup.add(edge);
            }

            for (let i = 0; i < py.base.points.length; i++) {
                const start = utils3d.convertToVector3(py.base.points[i].x, py.base.points[i].y, py.base.points[i].z ?? 0);
                const end   = utils3d.convertToVector3(py.base.points[(i + 1) % py.base.points.length].x, py.base.points[(i + 1) % py.base.points.length].y, py.base.points[(i + 1) % py.base.points.length].z ?? 0);
                const props = utils.createLineDefaultShapeProps("");
                props.color = shape.props.color;

                const edge = utils3d.createDashLine([start, end], props);
                edge.renderOrder = 18; // Ensure edges render above fill
                pyramidGroup.add(edge);
            }

            pyramidGroup.add(fillMesh);
            
            baseCenter.divideScalar(py.base.points.length);
            labelPosition = new THREE.Vector3().addVectors(baseCenter, apex).multiplyScalar(0.5);
            mesh = pyramidGroup as unknown as THREE.Mesh;
        }
        
        else if ('base1' in shape && 'base2' in shape) {
            let pr: Prism = shape as Prism
            let base: THREE.Vector3[] = [], secondBase: THREE.Vector3[] = [];
            pr.base1.points.forEach(p => {
                base.push(utils3d.convertToVector3(p.x, p.y, p.z ?? 0));
            })

            pr.base2.points.forEach(p => {
                secondBase.push(utils3d.convertToVector3(p.x, p.y, p.z ?? 0));
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
            const visibleMesh = new THREE.Mesh(geometry, material);
            const depthMesh = new THREE.Mesh(geometry, depthMaterial);
            const group = new THREE.Group();
            group.add(visibleMesh);
            group.add(depthMesh);

            mesh = group as unknown as THREE.Mesh;
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

        group.name = shape.props.id;
        return group;
    }
        
    create2DShape (shape: Shape): THREE.Object3D | null {
        if (!shape.props.visible.shape) return null;

        const material = new THREE.MeshPhongMaterial({
            color: shape.props.color,
            transparent: true,
            opacity: shape.props.opacity ?? 1,
            wireframe: 'centerC' in shape && 'radius' in shape ? true : false,
            depthTest: ('x' in shape && 'y' in shape && 'z' in shape) ? false : true
        });

        let geometry: THREE.BufferGeometry | null = null;
        let mesh: THREE.Mesh | THREE.Group | null = null;
        let labelPosition = new THREE.Vector3();

        if ('centerC' in shape && 'radius' in shape) {
            let c: Circle = shape as Circle;
            // Create points for the circle
            const points: THREE.Vector3[] = [];
            const segments = 64; // Number of segments for the circle
            for (let i = 0; i <= segments; i++) {
                const theta = (i / segments) * Math.PI * 2;
                const x = Math.cos(theta) * c.radius;
                const y = Math.sin(theta) * c.radius;
                const z = 0;
                points.push(utils3d.convertToVector3(x, y, z));
            }

            let normalVec = c.normal? utils3d.convertToVector3(
                c.normal.endVector.x - c.normal.startVector.x,
                c.normal.endVector.y - c.normal.startVector.y,
                (c.normal.endVector.z ?? 0) - (c.normal.startVector.z ?? 0)
            ).normalize() : utils3d.convertToVector3(0, 0, 1);

            let defaultNorm = utils3d.convertToVector3(0, 0, 1);
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
        
            mesh = utils3d.createDashLine(points, c.props) as unknown as THREE.Mesh;
            labelPosition.copy(mesh!.position).add(new THREE.Vector3(0, 0, 0));
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

            mesh = utils3d.createDashLine(points, l.props) as unknown as THREE.Mesh;
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

            mesh = utils3d.createDashLine(points, r.props) as unknown as THREE.Mesh;
            labelPosition.copy(mesh!.position).add(new THREE.Vector3(0, 0, 0));
        }
        
        else if ('startSegment' in shape && 'endSegment' in shape) {
            let s: Segment = shape as Segment;
            let points = []
            const P1 = utils3d.convertToVector3(s.startSegment.x, s.startSegment.y, s.startSegment.z ?? 0)
            const P2 = utils3d.convertToVector3(s.endSegment.x, s.endSegment.y, s.endSegment.z ?? 0)
            
            points.push(P1)
            points.push(P2)

            mesh = utils3d.createDashLine(points, s.props) as unknown as THREE.Mesh;
            labelPosition.copy(mesh!.position).add(new THREE.Vector3(0, 0, 0));
        }
        
        else if ("points" in shape) {
            const poly: Polygon = shape as Polygon;
            const points3D = poly.points.map(p =>
                utils3d.convertToVector3(p.x, p.y, p.z ?? 0)
            );

            // --- Step 1: Compute polygon plane ---
            const normal = new THREE.Vector3();
            new THREE.Triangle(points3D[0], points3D[1], points3D[2]).getNormal(normal);

            // Build a local basis (u,v) in the polygon plane
            const u = new THREE.Vector3().subVectors(points3D[1], points3D[0]).normalize();
            const v = new THREE.Vector3().crossVectors(normal, u).normalize();

            // --- Step 2: Project 3D points to 2D (local plane coords) ---
            const points2D: THREE.Vector2[] = points3D.map(p => {
                const relative = new THREE.Vector3().subVectors(p, points3D[0]);
                return new THREE.Vector2(relative.dot(u), relative.dot(v));
            });

            // --- Step 3: Triangulate in 2D ---
            const triangles = THREE.ShapeUtils.triangulateShape(points2D, []);

            // --- Step 4: Build 3D BufferGeometry ---
            const vertices: number[] = [];
            points3D.forEach(p => {
                vertices.push(p.x, p.y, p.z);
            });

            const indices: number[] = [];
            triangles.forEach(tri => {
                indices.push(tri[0], tri[1], tri[2]);
            });

            const fillGeometry = new THREE.BufferGeometry();
            fillGeometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
            fillGeometry.setIndex(indices);
            fillGeometry.computeVertexNormals();

            // --- Step 5: Fill material ---
            const fillMaterial = new THREE.MeshBasicMaterial({
                color: shape.props.color,
                transparent: true,
                opacity: (shape.props.opacity ?? 0.5) * 0.5,
                side: THREE.DoubleSide,
                polygonOffset: true,
                polygonOffsetFactor: 1,
                polygonOffsetUnits: 1
            });

            const fillMesh = new THREE.Mesh(fillGeometry, fillMaterial);
            fillMesh.renderOrder = 7; // Ensure fill renders below edges

            // --- Step 6: Borders ---
            const group = new THREE.Group();
            for (let i = 0; i < points3D.length; i++) {
                const start = points3D[i];
                const end   = points3D[(i + 1) % points3D.length];
                const props = utils.createLineDefaultShapeProps("");
                props.color = shape.props.color;

                const edge = utils3d.createDashLine([start, end], props);
                edge.renderOrder = 18; // Ensure edges render above fill
                group.add(edge);
            }
            group.add(fillMesh);

            // --- Step 7: Label position (centroid) ---
            const center = new THREE.Vector3();
            points3D.forEach(p => center.add(p));
            center.divideScalar(points3D.length);
            labelPosition.copy(center);

            mesh = group as unknown as THREE.Mesh;
        }

        else if ('vector1' in shape && 'vector2' in shape) {
            let a: Angle = shape as Angle;
            const startDir = utils3d.convertToVector3(
                a.vector1.endVector.x - a.vector1.startVector.x,
                a.vector1.endVector.y - a.vector1.startVector.y,
                (a.vector1.endVector.z ?? 0) - (a.vector1.startVector.z ?? 0)
            );
            
            const endDir = utils3d.convertToVector3(
                a.vector2.endVector.x - a.vector2.startVector.x,
                a.vector2.endVector.y - a.vector2.startVector.y,
                (a.vector2.endVector.z ?? 0) - (a.vector2.startVector.z ?? 0)
            );

            const vertex = (a.vertex === undefined ? new THREE.Vector3(0, 0, 0) : utils3d.convertToVector3(
                a.vertex.x, a.vertex.y, a.vertex.z ?? 0
            ))

            const angle = startDir.angleTo(endDir);
            const rotationAxis = new THREE.Vector3().crossVectors(startDir, endDir).normalize();

            const points = [];
            const segments = 32, radius = 0.1;
            
            for (let i = 0; i <= segments; i++) {
                const t = i / segments;
                const currentAngle = angle * t;
                
                const direction = startDir.clone();
                direction.applyAxisAngle(rotationAxis, currentAngle);
                
                const point = direction.multiplyScalar(radius).add(vertex);
                points.push(point);
            }
            
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({ color: a.props.color, linewidth: a.props.line_size });
            const arc = new THREE.Line(geometry, material);
            const group = new THREE.Group();
            group.add(arc);
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

        group.name = shape.props.id;
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
        const children = [...this.sceneRef.current.children];
        // Clear existing shapes
        children.forEach(child => {
            if (child instanceof THREE.Group || child instanceof THREE.Mesh) {
                const isAxis = child.name === 'line-xAxis' || child.name === 'line-yAxis' || child.name === 'line-zAxis';
                const isOxyPlane = child.name === 'plane-OxyPlane';
                if (!(child instanceof THREE.GridHelper) && !isAxis && !isOxyPlane) {
                    this.sceneRef.current!.remove(child);
                }
            }
        });

        const visualPriority: Record<string, number> = {
            // Lowest Priority - Foundational 2D and 3D Shapes
            'Plane': 0,
            'PerpendicularPlane': 0,
            'ParallelPlane': 0,
            'Circle': 1,
            'Circle2Point': 2,
            'Circumcircle': 3,
            'Incircle': 4,
            'Excircle': 5,
            'SemiCircle': 6,
            'Polygon': 7,
            'RegularPolygon': 8,

            // Middle Priority - 3D Solids
            'Cylinder': 9,
            'Cone': 10,
            'Sphere': 11,
            'Prism': 12,
            'Pyramid': 13,
            'Tetrahedron': 14,
            
            // Higher Priority - Lines, Segments, etc.
            'Line': 15,
            'Ray': 16,
            'ParallelLine': 17,
            'Segment': 18,
            'Vector': 19,
            'TangentLine': 20,
            'PerpendicularLine': 21,
            'PerpendicularBisector': 22,
            'AngleBisector': 23,

            // Highest Priority - Points and Transformations (on top of everything)
            'Centroid': 24,
            'Orthocenter': 25,
            'Circumcenter': 26,
            'Incenter': 27,
            'Excenter': 28,
            'Midpoint': 29,
            'Intersection': 30,
            'Projection': 31,
            'Reflection': 32,
            'Rotation': 33,
            'Enlarge': 34,
            'Translation': 35,
            'Angle': 36,
            'Point': 37,
        };

        // Add new shapes
        this.props.dag.forEach(shape => {
            if (shape.defined && shape.type.props.visible.shape && !['line-xAxis', 'line-yAxis', 'line-zAxis', 'plane-OxyPlane'].includes(shape.type.props.id)) {
                const mesh = this.createShape(shape.type);
                if (mesh) {
                    mesh.renderOrder = visualPriority[shape.type.type] ?? 0; // Higher priority shapes render on top
                    this.sceneRef.current!.add(mesh);
                }
            }

            else if (['line-xAxis', 'line-yAxis', 'line-zAxis'].includes(shape.type.props.id)) {
                const mesh = this.sceneRef.current!.getObjectByName(shape.type.props.id);
                if (mesh) {
                    if (['line-xAxis', 'line-yAxis', 'line-zAxis'].includes(shape.type.props.id)) {
                        mesh.visible = this.props.geometryState.axesVisible;
                    }
                }
            }
        });

        const mesh = this.sceneRef.current.getObjectByName('grid');
        if (mesh) {
            mesh.visible = this.props.geometryState.gridVisible;
        }
    }

    private handleDrawing = () => {
        const DAG = utils3d.cloneDAG(this.props.dag);
        if (this.props.mode === 'point') {
            const pointData = this.props.data;
            if (!pointData) {
                this.props.onRenderDialogbox(this.props.mode);
                return;
            }

            if (pointData && typeof pointData !== 'number' && 'x' in pointData && 'y' in pointData && 'z' in pointData) {
                const labelUsed = [...this.props.labelUsed];
                let index = 0;
                let label = utils.getExcelLabel('A', index);
                while (labelUsed.includes(label)) {
                    index++;
                    label = utils.getExcelLabel('A', index);
                }

                labelUsed.push(label);
                const point = Factory.createPoint(
                    utils.createPointDefaultShapeProps(label),
                    pointData.x, pointData.y, pointData.z
                )

                DAG.set(point.props.id, {
                    type: point,
                    id: point.props.id,
                    isSelected: false,
                    defined: true,
                    dependsOn: []
                });

                this.props.onLabelUsed(labelUsed);
                this.props.onUpdateLastFailedState();
                this.props.onUpdateAll({
                    gs: {...this.props.geometryState},
                    dag: DAG,
                    selectedPoints: [],
                    selectedShapes: []
                });
            }
        }

        else if (['segment', 'line', 'ray', 'vector'].includes(this.props.mode)) {
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

                    let shapeNode: ShapeNode3D = {
                        id: vector.props.id,
                        type: vector,
                        dependsOn: [p1.props.id, p2.props.id],
                        defined: true,
                        isSelected: false
                    }

            
                    DAG.set(vector.props.id, shapeNode);
                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: {...this.props.geometryState},
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

                    let shapeNode: ShapeNode3D = {
                        id: line.props.id,
                        type: line,
                        dependsOn: [p1.props.id, p2.props.id],
                        defined: true,
                        isSelected: false
                    };

            

                    DAG.set(line.props.id, shapeNode);
                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: {...this.props.geometryState},
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

                    let shapeNode: ShapeNode3D = {
                        id: ray.props.id,
                        type: ray,
                        dependsOn: [p1.props.id, p2.props.id],
                        defined: true,
                        isSelected: false
                    };

            
                    DAG.set(ray.props.id, shapeNode);
                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: {...this.props.geometryState},
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

                    let shapeNode: ShapeNode3D = {
                        id: segment.props.id,
                        type: segment,
                        dependsOn: [p1.props.id, p2.props.id],
                        defined: true,
                        isSelected: false
                    };

            
                    DAG.set(segment.props.id, shapeNode);
                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: {...this.props.geometryState},
                        dag: DAG,
                        selectedPoints: [],
                        selectedShapes: []
                    });

                    break;
                }
            }
        }

        else if (this.props.mode === 'sphere') {
            const selectedPoints = [...this.props.selectedPoints];
            if (selectedPoints.length !== 1) return;

            const point = selectedPoints[0];
            const radius = this.props.data;
            if (radius === undefined || typeof radius !== 'number') {
                this.props.onRenderDialogbox(this.props.mode);
                return;
            }
            
            let label = `sphere0`
            let index = 0;
            while (this.props.labelUsed.includes(label)) {
                index++;
                label = `sphere${index}`;
            }

            this.props.onLabelUsed([...this.props.labelUsed, label]);
            const sphere: Sphere = Factory.createSphere(
                utils.createSphereDefaultShapeProps(label, radius, 0, 1, 0),
                point,
                radius
            )

            let shapeNode: ShapeNode3D = {
                id: sphere.props.id,
                type: sphere,
                dependsOn: [point.props.id],
                defined: true,
                isSelected: false
            }

            DAG.set(sphere.props.id, shapeNode);
            this.props.onUpdateLastFailedState();
            this.props.onUpdateAll({
                gs: {...this.props.geometryState},
                dag: DAG,
                selectedPoints: [],
                selectedShapes: []
            });
        }

        else if (this.props.mode === 'sphere_2_points') {
            const selectedPoints = [...this.props.selectedPoints];
            if (selectedPoints.length !== 2) return;
            let label = `sphere0`
            let index = 0;
            while (this.props.labelUsed.includes(label)) {
                index++;
                label = `sphere${index}`;
            }

            this.props.onLabelUsed([...this.props.labelUsed, label]);
            const r = operation.getDistance(selectedPoints[0], selectedPoints[1]);
            const sphere: Sphere = Factory.createSphere(
                utils.createSphereDefaultShapeProps(label, r, 0, 1, 0),
                selectedPoints[0],
                r
            )

            let shapeNode: ShapeNode3D = {
                id: sphere.props.id,
                type: sphere,
                dependsOn: [selectedPoints[0].props.id, selectedPoints[1].props.id],
                defined: true,
                isSelected: false,
            }

            sphere.type = 'Sphere2Point';

            DAG.set(sphere.props.id, shapeNode);
            this.props.onUpdateLastFailedState();
            this.props.onUpdateAll({
                gs: {...this.props.geometryState},
                dag: DAG,
                selectedPoints: [],
                selectedShapes: []
            });
        }

        else if (['circumcircle'].includes(this.props.mode)) {
            const selectedPoints = [...this.props.selectedPoints];
            if (selectedPoints.length !== 3) return;
            let label = utils.getExcelLabel('A', 0);
            let index = 0;
            while (this.props.labelUsed.includes(label)) {
                index++;
                label = utils.getExcelLabel('A', index);
            }

            this.props.onLabelUsed([...this.props.labelUsed, label]);
            try {
                let p = operation.circumcenter(selectedPoints[0], selectedPoints[1], selectedPoints[2]);
                let r = operation.circumradius(selectedPoints[0], selectedPoints[1], selectedPoints[2]);

                let circle = Factory.createCircle(
                    utils.createCircleDefaultShapeProps(label, r),
                    Factory.createPoint(
                        utils.createPointDefaultShapeProps(''),
                        p.x,
                        p.y,
                        p.z
                    ),
                    r
                );

                let shapeNode: ShapeNode3D = {
                    id: circle.props.id,
                    defined: true,
                    isSelected: false,
                    type: circle,
                    dependsOn: [selectedPoints[0].props.id, selectedPoints[1].props.id, selectedPoints[2].props.id] 
                };

                circle.type = 'Circumcircle';
                DAG.set(circle.props.id, shapeNode);
                this.props.onUpdateLastFailedState();
                this.props.onUpdateAll({
                    gs: {...this.props.geometryState},
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
                        0,
                        0
                    ),
                    0
                );

                let shapeNode: ShapeNode3D = {
                    id: circle.props.id,
                    defined: false,
                    isSelected: false,
                    type: circle,
                    dependsOn: [selectedPoints[0].props.id, selectedPoints[1].props.id, selectedPoints[2].props.id] 
                };

                circle.type = 'Circumcircle';
                DAG.set(circle.props.id, shapeNode);
                this.props.onUpdateLastFailedState();
                this.props.onUpdateAll({
                    gs: {...this.props.geometryState},
                    dag: DAG,
                    selectedPoints: [],
                    selectedShapes: []
                });
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
                    (selectedPoints[0].y + selectedPoints[1].y) / 2,
                    ((selectedPoints[0].z ?? 0) + (selectedPoints[1].z ?? 0)) / 2
                )
                

                DAG.set(midpoint.props.id, {
                    id: midpoint.props.id,
                    dependsOn: [selectedPoints[0].props.id, selectedPoints[1].props.id],
                    defined: true,
                    isSelected: false,
                    type: midpoint
                });

                midpoint.type = 'Midpoint';
                this.props.onUpdateLastFailedState();
                this.props.onUpdateAll({
                    gs: {...this.props.geometryState},
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
                        (selectedShapes[0].startSegment.y + selectedShapes[0].endSegment.y) / 2,
                        ((selectedShapes[0].startSegment.z ?? 0) + (selectedShapes[0].endSegment.z ?? 0)) / 2
                    )
                    
    
                    DAG.set(midpoint.props.id, {
                        id: midpoint.props.id,
                        dependsOn: [selectedShapes[0].props.id],
                        defined: true,
                        isSelected: false,
                        type: midpoint
                    });

                    midpoint.type = 'Midpoint';
                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: {...this.props.geometryState},
                        dag: DAG,
                        selectedPoints: [],
                        selectedShapes: []
                    });
                }

                else {
                    const midpoint = Factory.createPoint(
                        utils.createPointDefaultShapeProps(label),
                        (selectedShapes[0] as Circle).centerC.x,
                        (selectedShapes[0] as Circle).centerC.y,
                        (selectedShapes[0] as Circle).centerC.z ?? 0
                    )
                    
    
                    DAG.set(midpoint.props.id, {
                        id: midpoint.props.id,
                        dependsOn: [selectedShapes[0].props.id],
                        defined: true,
                        isSelected: false,
                        type: midpoint
                    });

                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: {...this.props.geometryState},
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
            if (selectedShapes.length !== 1) {
                this.props.onUpdateLastFailedState();
                this.props.onSelectedChange({
                    selectedShapes: [],
                    selectedPoints: []
                });

                return;
            }

            if (!selectedShapes[0].props.id.includes('line-') && !selectedShapes[0].props.id.includes('plane-')) {
                this.props.onUpdateLastFailedState();
                this.props.onSelectedChange({
                    selectedShapes: [],
                    selectedPoints: []
                });

                return;
            }

            if (selectedPoints.length !== 1) return;
            if (selectedShapes[0].props.id.includes('line-')) {
                if (this.props.mode === 'perpendicular') {
                    // Cannot draw unique perpendicular line to line
                    this.props.onUpdateLastFailedState();
                    this.props.onSelectedChange({
                        selectedShapes: [],
                        selectedPoints: []
                    });

                    return;
                }

                const [start, end] = operation.getStartAndEnd(selectedShapes[0]);
                let label = `line0`
                let index = 0;
                while (this.props.labelUsed.includes(label)) {
                    index++;
                    label = `line${index}`;
                }

                this.props.onLabelUsed([...this.props.labelUsed, label]);
                let newLine = Factory.createLine(
                    utils.createLineDefaultShapeProps(label),
                    selectedPoints[0],
                    Factory.createPoint(
                        utils.createPointDefaultShapeProps(''),
                        selectedPoints[0].x + (end.x - start.x),
                        selectedPoints[0].y + (end.y - start.y),
                        (selectedPoints[0].z ?? 0) + ((end.z ?? 0) - (start.z ?? 0))
                    )
                );

                DAG.set(newLine.props.id, {
                    id: newLine.props.id,
                    dependsOn: [selectedPoints[0].props.id, selectedShapes[0].props.id],
                    defined: true,
                    isSelected: false,
                    type: newLine
                });

                newLine.type = 'ParallelLine';

                this.props.onUpdateLastFailedState();
                this.props.onUpdateAll({
                    gs: {...this.props.geometryState},
                    dag: DAG,
                    selectedPoints: [],
                    selectedShapes: []
                });
            }
            
            else {
                if (this.props.mode === 'parallel') {
                    // Cannot draw unique parallel line to plane
                    this.props.onUpdateLastFailedState();
                    this.props.onSelectedChange({
                        selectedShapes: [],
                        selectedPoints: []
                    });

                    return;
                }

                let label = `line0`
                let index = 0;
                while (this.props.labelUsed.includes(label)) {
                    index++;
                    label = `line${index}`;
                }

                const norm = (selectedShapes[0] as Plane).norm;

                this.props.onLabelUsed([...this.props.labelUsed, label]);
                let newLine = Factory.createLine(
                    utils.createLineDefaultShapeProps(label),
                    selectedPoints[0],
                    Factory.createPoint(
                        utils.createPointDefaultShapeProps(''),
                        selectedPoints[0].x + (norm.endVector.x - norm.startVector.x),
                        selectedPoints[0].y + (norm.endVector.y - norm.startVector.y),
                        (selectedPoints[0].z ?? 0) + ((norm.endVector.z ?? 0) - (norm.startVector.z ?? 0))
                    )
                );

                newLine.type = 'PerpendicularLine';

                DAG.set(newLine.props.id, {
                    id: newLine.props.id,
                    dependsOn: [selectedPoints[0].props.id, selectedShapes[0].props.id],
                    defined: true,
                    isSelected: false,
                    type: newLine
                });

                this.props.onUpdateLastFailedState();
                this.props.onUpdateAll({
                    gs: {...this.props.geometryState},
                    dag: DAG,
                    selectedPoints: [],
                    selectedShapes: []
                });
            }
        }

        else if (this.props.mode === 'segment_length') {
            const selectedPoints = [...this.props.selectedPoints];
            if (selectedPoints.length !== 1) return;
            const length = this.props.data;
            if (length === undefined || typeof length !== 'number') {
                this.props.onRenderDialogbox(this.props.mode);
                return;
            }

            let label = `segment0`
            let index = 0;
            while (this.props.labelUsed.includes(label)) {
                index++;
                label = `segment${index}`;
            }

            let point_label = utils.getExcelLabel('A', 0);
            index = 0;
            while (this.props.labelUsed.includes(point_label)) {
                index++;
                point_label = utils.getExcelLabel('A', index);
            }

            this.props.onLabelUsed([...this.props.labelUsed, point_label, label]);
            
            const point: Point = Factory.createPoint(
                utils.createPointDefaultShapeProps(point_label),
                selectedPoints[0].x + length,
                selectedPoints[0].y,
                selectedPoints[0].z ?? 0
            )

            const segment: Segment = Factory.createSegment(
                utils.createLineDefaultShapeProps(label),
                selectedPoints[0],
                point
            )

            let shapeNodePoint: ShapeNode3D = {
                id: point.props.id,
                type: point,
                dependsOn: [selectedPoints[0].props.id],
                defined: true,
                isSelected: false,
                scaleFactor: length,
            }

            let shapeNodeSegment: ShapeNode3D = {
                id: segment.props.id,
                type: segment,
                dependsOn: [selectedPoints[0].props.id, point.props.id],
                defined: true,
                isSelected: false
            }

            DAG.set(shapeNodePoint.id, shapeNodePoint);
            DAG.set(shapeNodeSegment.id, shapeNodeSegment);
            this.props.onUpdateLastFailedState();
            this.props.onUpdateAll({
                gs: {...this.props.geometryState},
                dag: DAG,
                selectedPoints: [],
                selectedShapes: []
            });
        }

        else if (this.props.mode === 'perpendicular_bisector') {
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

                const [start, end] = [selectedShapes[0].startSegment, selectedShapes[0].endSegment]
                const mid = {
                    x: (start.x + end.x) / 2,
                    y: (start.y + end.y) / 2,
                    z: ((start.z ?? 0) + (end.z ?? 0)) / 2
                }

                const v = {
                    x: end.x - start.x,
                    y: end.y - start.y,
                    z: (end.z ?? 0) - (start.z ?? 0)
                }

                let label = `plane0`
                let index = 0;
                while (this.props.labelUsed.includes(label)) {
                    index++;
                    label = `plane${index}`;
                }

                this.props.onLabelUsed([...this.props.labelUsed, label]);
                const midPoint = Factory.createPoint(
                    utils.createPointDefaultShapeProps(''),
                    mid.x,
                    mid.y,
                    mid.z
                )

                const plane: Plane = Factory.createPlane(
                    utils.createPlaneDefaultShapeProps(label),
                    midPoint,
                    Factory.createVector(
                        utils.createVectorDefaultShapeProps(''),
                        midPoint,
                        Factory.createPoint(
                            utils.createPointDefaultShapeProps(''),
                            mid.x + v.x,
                            mid.y + v.y,
                            mid.z + v.z
                        )
                    )
                );


                DAG.set(plane.props.id, {
                    id: plane.props.id,
                    dependsOn: [selectedShapes[0].props.id],
                    defined: true,
                    isSelected: false,
                    type: plane,
                });

                plane.type = 'PerpendicularBisector';
                this.props.onUpdateLastFailedState();
                this.props.onUpdateAll({
                    gs: {...this.props.geometryState},
                    dag: DAG,
                    selectedPoints: [],
                    selectedShapes: []
                });
            }

            else {
                if (selectedPoints.length !== 2) return;
                if (selectedPoints[0] === selectedPoints[1]) {
                    selectedPoints.pop();
                    this.props.onSelectedPointsChange(selectedPoints);
                    return;
                }

                const [start, end] = [selectedPoints[0], selectedPoints[1]];
                const mid = {
                    x: (start.x + end.x) / 2,
                    y: (start.y + end.y) / 2,
                    z: ((start.z ?? 0) + (end.z ?? 0)) / 2
                }

                const v = {
                    x: end.x - start.x,
                    y: end.y - start.y,
                    z: (end.z ?? 0) - (start.z ?? 0)
                }

                let label = `plane0`
                let index = 0;
                while (this.props.labelUsed.includes(label)) {
                    index++;
                    label = `plane${index}`;
                }

                this.props.onLabelUsed([...this.props.labelUsed, label]);
                const midPoint = Factory.createPoint(
                    utils.createPointDefaultShapeProps(''),
                    mid.x,
                    mid.y,
                    mid.z
                )

                const plane: Plane = Factory.createPlane(
                    utils.createPlaneDefaultShapeProps(label),
                    midPoint,
                    Factory.createVector(
                        utils.createVectorDefaultShapeProps(''),
                        midPoint,
                        Factory.createPoint(
                            utils.createPointDefaultShapeProps(''),
                            mid.x + v.x,
                            mid.y + v.y,
                            mid.z + v.z
                        )
                    )
                );


                DAG.set(plane.props.id, {
                    id: plane.props.id,
                    dependsOn: [selectedShapes[0].props.id],
                    defined: true,
                    isSelected: false,
                    type: plane,
                });

                plane.type = 'PerpendicularBisector';
                this.props.onUpdateLastFailedState();
                this.props.onUpdateAll({
                    gs: {...this.props.geometryState},
                    dag: DAG,
                    selectedPoints: [],
                    selectedShapes: []
                });
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
                    if (!operation.checkCoplanar(selectedPoints)) {
                        this.props.onSelectedPointsChange([]);
                        return;
                    }

                    selectedPoints.pop();
                    const labelUsed = [...this.props.labelUsed];
                    let idx = 0;
                    let label = `poly${idx}`;
                    while (labelUsed.includes(label)) {
                        idx += 1;
                        label = `poly${idx}`;
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
                        let shapeNode: ShapeNode3D = {
                            id: segment.props.id,
                            type: segment,
                            dependsOn: [p.props.id, pNext.props.id, polygon.props.id],
                            defined: true,
                            isSelected: false
                        }

                        DAG.set(segment.props.id, shapeNode);
                    }

                    let shapeNode: ShapeNode3D = {
                        id: polygon.props.id,
                        type: polygon,
                        dependsOn: dependencies,
                        defined: true,
                        isSelected: false
                    }
            
                    DAG.set(polygon.props.id, shapeNode);
                    this.props.onLabelUsed(labelUsed);
                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: {...this.props.geometryState},
                        dag: DAG,
                        selectedPoints: [],
                        selectedShapes: []
                    });
                }
            }
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
                        let label = `line0`
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
                                b.point.y - b.direction.y,
                                b.point.z - b.direction.z
                            ),
                            Factory.createPoint(
                                utils.createPointDefaultShapeProps(''),
                                b.point.x + b.direction.x,
                                b.point.y + b.direction.y,
                                b.point.z + b.direction.z
                            )
                        );

                        let shapeNode: ShapeNode3D = {
                            id: line.props.id,
                            dependsOn: [selectedShapes[0].props.id, selectedShapes[1].props.id],
                            type: line,
                            defined: true,
                            isSelected: false,
                            side: i === 0 ? 0 : 1
                        };

                        line.type = 'AngleBisector';
                        DAG.set(line.props.id, shapeNode);
                    });

                    this.props.onLabelUsed(labelUsed);
                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: {...this.props.geometryState},
                        dag: DAG,
                        selectedPoints: [],
                        selectedShapes: []
                    });
                }
                
                catch(error) {
                    // Create 2 perpendicular, undefined lines
                    const labelUsed = [...this.props.labelUsed];
                    for (let i = 0; i < 2; i++) {
                        let label = `line0`
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
                                0,
                                0
                            ),
                            Factory.createPoint(
                                utils.createPointDefaultShapeProps(''),
                                0 + (i === 0 ? 1 : 0),
                                0 + (i === 0 ? 0 : 1),
                                0
                            )
                        );

                        line.props.visible.shape = false;
                        let shapeNode: ShapeNode3D = {
                            id: line.props.id,
                            dependsOn: [selectedShapes[0].props.id, selectedShapes[1].props.id],
                            type: line,
                            defined: false,
                            isSelected: false,
                            side: i === 0 ? 0 : 1
                        };

                        line.type = 'AngleBisector';
                        DAG.set(line.props.id, shapeNode);
                    }

                    this.props.onLabelUsed(labelUsed);
                    this.props.onUpdateLastFailedState();
                    this.props.onUpdateAll({
                        gs: {...this.props.geometryState},
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
                let label = `line0`
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
                        line.point.y + line.direction.y,
                        line.point.z + line.direction.z
                    )
                );

                DAG.set(newLine.props.id, {
                    id: newLine.props.id,
                    dependsOn: [point1.props.id, point2.props.id, point3.props.id],
                    defined: true,
                    isSelected: false,
                    type: newLine,
                    side: 0
                });

                newLine.type = 'AngleBisector';
                this.props.onUpdateLastFailedState();
                this.props.onUpdateAll({
                    gs: {...this.props.geometryState},
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

            if (!selectedShapes[0].props.id.includes('circle-')) {
                this.props.onUpdateLastFailedState();
                this.props.onSelectedChange({
                    selectedShapes: [],
                    selectedPoints: []
                });
                return;
            }
            
            let tangentLines = operation.tangentLine(selectedPoints[0], selectedShapes[0] as Circle);
            const labelUsed = [...this.props.labelUsed];
            for (let i = 0; i < 2; i++) {
                let label = `line0`
                let index = 0;
                while (this.props.labelUsed.includes(label)) {
                    index++;
                    label = `line${index}`;
                }

                labelUsed.push(label);
                const line = Factory.createLine(
                    utils.createLineDefaultShapeProps(label),
                    Factory.createPoint(
                        utils.createPointDefaultShapeProps(''),
                        selectedPoints[0].x - (tangentLines.length > i? tangentLines[i].direction.x : 0),
                        selectedPoints[0].y - (tangentLines.length > i? tangentLines[i].direction.y : 0),
                        (selectedPoints[0].z ?? 0) - (tangentLines.length > i? tangentLines[i].direction.z : 0)
                    ),
                    Factory.createPoint(
                        utils.createPointDefaultShapeProps(''),
                        selectedPoints[0].x + (tangentLines.length > i? tangentLines[i].direction.x : 0),
                        selectedPoints[0].y + (tangentLines.length > i? tangentLines[i].direction.y : 0),
                        (selectedPoints[0].z ?? 0) + (tangentLines.length > i? tangentLines[i].direction.z : 0)
                    )
                )

                DAG.set(line.props.id, {
                    id: line.props.id,
                    dependsOn: [selectedPoints[0].props.id, selectedShapes[0].props.id],
                    side: (i === 0 ? 0 : 1),
                    defined: tangentLines.length === 0 ? false : (tangentLines.length === 1 ? i === 0 : true),
                    type: line,
                    isSelected: false
                });

                line.type = 'TangentLine'
            }

            this.props.onLabelUsed(labelUsed);
            this.props.onUpdateLastFailedState();
            this.props.onUpdateAll({
                gs: {...this.props.geometryState},
                dag: DAG,
                selectedPoints: [],
                selectedShapes: []
            })
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

                const vertices = this.props.data;
                if (!vertices || typeof vertices !== 'number') {
                    this.props.onRenderDialogbox(this.props.mode);
                    return;
                }

                const segment = selectedShapes[0] as Segment;
                let [start, end] = [segment.startSegment, segment.endSegment];
                if ((start.z !== undefined && start.z !== 0) || (end.z !== undefined && end.z !== 0)) {
                    this.props.onUpdateLastFailedState();
                    this.props.onSelectedChange({
                        selectedShapes: [],
                        selectedPoints: []
                    });
                    return;
                }

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
                    let newEnd = operation.rotation(start, end, 180 - angle, false) as Point;
                    newEnd.props = utils.createPointDefaultShapeProps(label);
                    start = end;
                    end = newEnd;
                    points.push(newEnd);
                }

                let idx = 0;
                let poly_label = `regular_poly${idx}`;
                while (labelUsed.includes(poly_label)) {
                    idx += 1;
                    poly_label = `regular_poly${idx}`;
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
                    DAG.set(point.props.id, {
                        id: point.props.id,
                        type: point,
                        dependsOn: [polygon.props.id],
                        isSelected: false,
                        defined: true
                    });
                });

                for (let i = 0; i < polygonPoints.length; i++) {
                    if (i === 0) continue;
                    let p = polygonPoints[i];
                    let pNext = polygonPoints[(i + 1) % polygonPoints.length];
                    let label = `segment0`
                    let index = 0;
                    while (this.props.labelUsed.includes(label)) {
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
                    let shapeNode: ShapeNode3D = {
                        id: segment.props.id,
                        type: segment,
                        dependsOn: [p.props.id, pNext.props.id, polygon.props.id],
                        defined: true,
                        isSelected: false
                    }

                    DAG.set(segment.props.id, shapeNode);
                }

                let shapeNode: ShapeNode3D = {
                    id: polygon.props.id,
                    type: polygon,
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
                    gs: {...this.props.geometryState},
                    dag: DAG,
                    selectedPoints: [],
                    selectedShapes: []
                });
            }

            else {
                if (selectedPoints.length !== 2) return;
                const vertices = this.props.data;
                if (!vertices || typeof vertices !== 'number') {
                    this.props.onRenderDialogbox(this.props.mode);
                    return;
                }

                let [start, end] = [selectedPoints[0], selectedPoints[1]];
                if ((start.z !== undefined && start.z !== 0) || (end.z !== undefined && end.z !== 0)) {
                    this.props.onUpdateLastFailedState();
                    this.props.onSelectedChange({
                        selectedShapes: [],
                        selectedPoints: []
                    });
                    return;
                }
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
                    let newEnd = operation.rotation(start, end, 180 - angle, false) as Point;
                    newEnd.props = utils.createPointDefaultShapeProps(label);
                    start = end;
                    end = newEnd;
                    points.push(newEnd);
                }

                let idx = 0;
                let poly_label = `regular_poly${idx}`;
                while (labelUsed.includes(poly_label)) {
                    idx += 1;
                    poly_label = `regular_poly${idx}`;
                }

                labelUsed.push(poly_label);

                const polygonPoints = [selectedPoints[0], selectedPoints[1], ...points];
                let props = utils.createPolygonDefaultShapeProps(poly_label);
                const polygon: Polygon = Factory.createPolygon(
                    props,
                    polygonPoints
                );

                points.forEach(point => {
                    DAG.set(point.props.id, {
                        id: point.props.id,
                        type: point,
                        dependsOn: [polygon.props.id],
                        isSelected: false,
                        defined: true,
                    });
                });

                for (let i = 0; i < polygonPoints.length; i++) {
                    if (i === 0) continue;
                    let p = polygonPoints[i];
                    let pNext = polygonPoints[(i + 1) % polygonPoints.length];
                    let label = `segment0`
                    let index = 0;
                    while (this.props.labelUsed.includes(label)) {
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
                    let shapeNode: ShapeNode3D = {
                        id: segment.props.id,
                        type: segment,
                        dependsOn: [p.props.id, pNext.props.id, polygon.props.id],
                        defined: true,
                        isSelected: false
                    }

                    DAG.set(segment.props.id, shapeNode);
                }

                let shapeNode: ShapeNode3D = {
                    id: polygon.props.id,
                    type: polygon,
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
                    gs: {...this.props.geometryState},
                    dag: DAG,
                    selectedPoints: [],
                    selectedShapes: []
                });
            }
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
            let intersects = operation.getIntersections3D(selectedShapes[0], selectedShapes[1]);
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
                    intersect.coors ? intersect.coors.y : 0,
                    intersect.coors ? intersect.coors.z ?? 0 : 0
                );

                point.type = 'Intersection';
                let shapeNode: ShapeNode3D = {
                    id: point.props.id,
                    type: point,
                    dependsOn: [selectedShapes[0].props.id, selectedShapes[1].props.id],
                    defined: intersect.coors !== undefined && !intersect.ambiguous,
                    isSelected: false,
                    side: idx === 0 ? 0 : 1
                }

                DAG.set(point.props.id, shapeNode);
            });
            
            this.props.onLabelUsed(labelUsed);
            this.props.onUpdateLastFailedState();
            this.props.onUpdateAll({
                gs: {...this.props.geometryState},
                dag: DAG,
                selectedPoints: [],
                selectedShapes: []
            });
        }

        else if (this.props.mode === 'plane_3_points') {
            const selectedPoints = [...this.props.selectedPoints];
            const selectedShapes = [...this.props.selectedShapes];
            if (selectedShapes.length > 0) {
                this.props.onUpdateLastFailedState();
                this.props.onSelectedChange({
                    selectedShapes: [],
                    selectedPoints: []
                });

                return;
            }

            if (selectedPoints.length < 3) {
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

            for (let i = 0; i < selectedPoints.length - 1; i++) {
                if (selectedPoints[i] === selectedPoints[selectedPoints.length - 1]) {
                    selectedPoints.splice(i, 1);
                    selectedPoints.pop();
                    this.props.onSelectedPointsChange(selectedPoints);
                    return;
                }
            }

            let [A, B, C] = selectedPoints;
            let n = operation.cross(
                B.x - A.x, B.y - A.y, (B.z ?? 0) - (A.z ?? 0),
                C.x - A.x, C.y - A.y, (C.z ?? 0) - (A.z ?? 0)
            );

            let idx = 0;
            let plane_label = `plane${idx}`;
            const labelUsed = [...this.props.labelUsed];
            while (labelUsed.includes(plane_label)) {
                idx += 1;
                plane_label = `plane${idx}`;
            }

            labelUsed.push(plane_label);
            const pl: Plane = Factory.createPlane(
                utils.createPlaneDefaultShapeProps(plane_label),
                A,
                Factory.createVector(
                    utils.createVectorDefaultShapeProps(''),
                    A,
                    Factory.createPoint(
                        utils.createPointDefaultShapeProps(''),
                        A.x + n.x,
                        A.y + n.y,
                        (A.z ?? 0) + n.z
                    )
                )
            );

            DAG.set(pl.props.id, {
                id: pl.props.id,
                type: pl,
                dependsOn: selectedPoints.map(point => point.props.id),
                defined: true,
                isSelected: false,
            });

            this.props.onUpdateLastFailedState();
            this.props.onLabelUsed(labelUsed);
            this.props.onUpdateAll({
                gs: {...this.props.geometryState},
                dag: DAG,
                selectedPoints: [],
                selectedShapes: []
            });
        }

        else if (this.props.mode === 'plane') {
            const selectedPoints = [...this.props.selectedPoints];
            const selectedShapes = [...this.props.selectedShapes];
            if (selectedShapes.length === 0) {
                if (selectedPoints.length < 3) {
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

                for (let i = 0; i < selectedPoints.length - 1; i++) {
                    if (selectedPoints[i] === selectedPoints[selectedPoints.length - 1]) {
                        selectedPoints.splice(i, 1);
                        selectedPoints.pop();
                        this.props.onSelectedPointsChange(selectedPoints);
                        return;
                    }
                }

                let [A, B, C] = selectedPoints;
                let n = operation.cross(
                    B.x - A.x, B.y - A.y, (B.z ?? 0) - (A.z ?? 0),
                    C.x - A.x, C.y - A.y, (C.z ?? 0) - (A.z ?? 0)
                );

                let idx = 0;
                let plane_label = `plane${idx}`;
                const labelUsed = [...this.props.labelUsed];
                while (labelUsed.includes(plane_label)) {
                    idx += 1;
                    plane_label = `plane${idx}`;
                }

                labelUsed.push(plane_label);
                const pl: Plane = Factory.createPlane(
                    utils.createPlaneDefaultShapeProps(plane_label),
                    A,
                    Factory.createVector(
                        utils.createVectorDefaultShapeProps(''),
                        A,
                        Factory.createPoint(
                            utils.createPointDefaultShapeProps(''),
                            A.x + n.x,
                            A.y + n.y,
                            (A.z ?? 0) + n.z
                        )
                    )
                );

                DAG.set(pl.props.id, {
                    id: pl.props.id,
                    type: pl,
                    dependsOn: selectedPoints.map(point => point.props.id),
                    defined: true,
                    isSelected: false,
                });

                this.props.onUpdateLastFailedState();
                this.props.onLabelUsed(labelUsed);
                this.props.onUpdateAll({
                    gs: {...this.props.geometryState},
                    dag: DAG,
                    selectedPoints: [],
                    selectedShapes: []
                });
            }

            else if (selectedShapes.length === 1) {
                const shape = selectedShapes[0];
                if (!shape.props.id.includes('line-') && !shape.props.id.includes('polygon-')) {
                    this.props.onUpdateLastFailedState();
                    this.props.onSelectedChange({
                        selectedShapes: [],
                        selectedPoints: []
                    });
                    return;
                }

                if (shape.props.id.includes('line-')) {
                    if (selectedPoints.length > 1) {
                        this.props.onUpdateLastFailedState();
                        this.props.onSelectedChange({
                            selectedShapes: [],
                            selectedPoints: []
                        });
                        return;
                    }

                    if (selectedPoints.length === 0) return;
                    // Check if the point is on the line
                    const point = selectedPoints[0];
                    const [start, end] = operation.getStartAndEnd(shape);
                    const direction = {
                        x: end.x - start.x,
                        y: end.y - start.y,
                        z: (end.z ?? 0) - (start.z ?? 0)
                    }

                    const v = {
                        x: point.x - start.x,
                        y: point.y - start.y,
                        z: (point.z ?? 0) - (start.z ?? 0)
                    }

                    const cross = operation.cross(
                        direction.x, direction.y, direction.z,
                        v.x, v.y, v.z
                    )

                    if (Math.abs(cross.x) < constants.EPSILON &&
                        Math.abs(cross.y) < constants.EPSILON &&
                        Math.abs(cross.z) < constants.EPSILON) {
                        // The point is on the line
                        this.props.onUpdateLastFailedState();
                        this.props.onSelectedChange({
                            selectedShapes: [],
                            selectedPoints: []
                        });
                        return;
                    }

                    // Point is off the line, form a plane
                    let idx = 0;
                    let plane_label = `plane${idx}`;
                    const labelUsed = [...this.props.labelUsed];
                    while (labelUsed.includes(plane_label)) {
                        idx += 1;
                        plane_label = `plane${idx}`;
                    }

                    labelUsed.push(plane_label);
                    const pl: Plane = Factory.createPlane(
                        utils.createPlaneDefaultShapeProps(plane_label),
                        point,
                        Factory.createVector(
                            utils.createVectorDefaultShapeProps(''),
                            point,
                            Factory.createPoint(
                                utils.createPointDefaultShapeProps(''),
                                point.x + cross.x,
                                point.y + cross.y,
                                (point.z ?? 0) + cross.z
                            )
                        )
                    );

                    DAG.set(pl.props.id, {
                        id: pl.props.id,
                        type: pl,
                        dependsOn: [point.props.id, shape.props.id],
                        defined: true,
                        isSelected: false,
                    });

                    this.props.onUpdateLastFailedState();
                    this.props.onLabelUsed(labelUsed);
                    this.props.onUpdateAll({
                        gs: {...this.props.geometryState},
                        dag: DAG,
                        selectedPoints: [],
                        selectedShapes: []
                    });
                }

                else {
                    // Polygon case
                    if (selectedPoints.length > 0) {
                        this.props.onUpdateLastFailedState();
                        this.props.onSelectedChange({
                            selectedShapes: [],
                            selectedPoints: []
                        });
                        return;
                    }

                    const polygon = selectedShapes[0] as Polygon;
                    // This polygon always has >= 3 points, so we can safely access them
                    const points = polygon.points;
                    // Get the first three points to form a plane
                    let [A, B, C] = points.slice(0, 3);
                    let n = operation.cross(
                        B.x - A.x, B.y - A.y, (B.z ?? 0) - (A.z ?? 0),
                        C.x - A.x, C.y - A.y, (C.z ?? 0) - (A.z ?? 0)
                    );

                    let idx = 0;
                    let plane_label = `plane${idx}`;
                    const labelUsed = [...this.props.labelUsed];
                    while (labelUsed.includes(plane_label)) {
                        idx += 1;
                        plane_label = `plane${idx}`;
                    }

                    labelUsed.push(plane_label);
                    const pl: Plane = Factory.createPlane(
                        utils.createPlaneDefaultShapeProps(plane_label),
                        A,
                        Factory.createVector(
                            utils.createVectorDefaultShapeProps(''),
                            A,
                            Factory.createPoint(
                                utils.createPointDefaultShapeProps(''),
                                A.x + n.x,
                                A.y + n.y,
                                (A.z ?? 0) + n.z
                            )
                        )
                    );

                    DAG.set(pl.props.id, {
                        id: pl.props.id,
                        type: pl,
                        dependsOn: points.map(point => point.props.id),
                        defined: true,
                        isSelected: false,
                    });

                    this.props.onUpdateLastFailedState();
                    this.props.onLabelUsed(labelUsed);
                    this.props.onUpdateAll({
                        gs: {...this.props.geometryState},
                        dag: DAG,
                        selectedPoints: [],
                        selectedShapes: []
                    });
                }
            }

            else if (selectedShapes.length === 2) {
                if (selectedPoints.length > 0) {
                    this.props.onUpdateLastFailedState();
                    this.props.onSelectedChange({
                        selectedShapes: [],
                        selectedPoints: []
                    });

                    return;
                }

                const shape1 = selectedShapes[0];
                const shape2 = selectedShapes[1];
                const labelUsed = [...this.props.labelUsed];
                if (shape1.props.id.includes('line-') && shape2.props.id.includes('line-')) {
                    // Two lines, form a plane
                    const [start1, end1] = operation.getStartAndEnd(shape1);
                    const [start2, end2] = operation.getStartAndEnd(shape2);
                    let n = operation.cross(
                        end1.x - start1.x, end1.y - start1.y, (end1.z ?? 0) - (start1.z ?? 0),
                        end2.x - start2.x, end2.y - start2.y, (end2.z ?? 0) - (start2.z ?? 0)
                    );

                    // Check for parallel, intersected lines
                    if (Math.abs(n.x) < constants.EPSILON &&
                        Math.abs(n.y) < constants.EPSILON &&
                        Math.abs(n.z) < constants.EPSILON) {
                        // Check for coincidence
                        const v1 = {
                            x: start2.x - start1.x,
                            y: start2.y - start1.y,
                            z: (start2.z ?? 0) - (start1.z ?? 0)
                        };

                        const cross = operation.cross(
                            v1.x, v1.y, v1.z,
                            end1.x - start1.x, end1.y - start1.y, (end1.z ?? 0) - (start1.z ?? 0)
                        );

                        if (Math.abs(cross.x) < constants.EPSILON &&
                            Math.abs(cross.y) < constants.EPSILON &&
                            Math.abs(cross.z) < constants.EPSILON) {
                            // Lines are coincident, do nothing
                            this.props.onUpdateLastFailedState();
                            this.props.onSelectedChange({
                                selectedShapes: [],
                                selectedPoints: []
                            });

                            return;
                        }

                        // Lines are strictly parallel, form a plane
                        const pointStart = Factory.createPoint(
                            utils.createPointDefaultShapeProps(''),
                            start1.x,
                            start1.y,
                            start1.z ?? 0
                        );
                        
                        let idx = 0;
                        let plane_label = `plane${idx}`;
                        while (labelUsed.includes(plane_label)) {
                            idx += 1;
                            plane_label = `plane${idx}`;
                        }

                        labelUsed.push(plane_label);
                        const pl: Plane = Factory.createPlane(
                            utils.createPlaneDefaultShapeProps(plane_label),
                            pointStart,
                            Factory.createVector(
                                utils.createVectorDefaultShapeProps(''),
                                pointStart,
                                Factory.createPoint(
                                    utils.createPointDefaultShapeProps(''),
                                    pointStart.x + n.x,
                                    pointStart.y + n.y,
                                    (pointStart.z ?? 0) + n.z
                                )
                            )
                        );

                        DAG.set(pl.props.id, {
                            id: pl.props.id,
                            type: pl,
                            dependsOn: [shape1.props.id, shape2.props.id],
                            defined: true,
                            isSelected: false,
                        });
                    }

                    else {
                        const intersections = operation.getIntersections3D(shape1, shape2);
                        // I implement the function getIntersections3D to return an array of at least one element
                        const point = intersections[0].coors;
                        if (point === undefined) {
                            this.props.onUpdateLastFailedState();
                            this.props.onSelectedChange({
                                selectedShapes: [],
                                selectedPoints: []
                            });

                            return;
                        }

                        const n = operation.cross(
                            end1.x - start1.x, end1.y - start1.y, (end1.z ?? 0) - (start1.z ?? 0),
                            end2.x - start2.x, end2.y - start2.y, (end2.z ?? 0) - (start2.z ?? 0)
                        );

                        const pointStart = Factory.createPoint(
                            utils.createPointDefaultShapeProps(''),
                            point.x,
                            point.y,
                            point.z ?? 0
                        );
                        
                        let idx = 0;
                        let plane_label = `plane${idx}`;
                        while (labelUsed.includes(plane_label)) {
                            idx += 1;
                            plane_label = `plane${idx}`;
                        }

                        labelUsed.push(plane_label);
                        const pl: Plane = Factory.createPlane(
                            utils.createPlaneDefaultShapeProps(plane_label),
                            pointStart,
                            Factory.createVector(
                                utils.createVectorDefaultShapeProps(''),
                                pointStart,
                                Factory.createPoint(
                                    utils.createPointDefaultShapeProps(''),
                                    pointStart.x + n.x,
                                    pointStart.y + n.y,
                                    (pointStart.z ?? 0) + n.z
                                )
                            )
                        );

                        DAG.set(pl.props.id, {
                            id: pl.props.id,
                            type: pl,
                            dependsOn: [shape1.props.id, shape2.props.id],
                            defined: true,
                            isSelected: false,
                        });
                    }

                    this.props.onUpdateLastFailedState();
                    this.props.onLabelUsed(labelUsed);
                    this.props.onUpdateAll({
                        gs: {...this.props.geometryState},
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
        }

        else if (this.props.mode === 'circle_axis_point') {
            const selectedShapes = [...this.props.selectedShapes];
            const selectedPoints = [...this.props.selectedPoints];
            if (selectedShapes.length !== 1) {
                this.props.onUpdateLastFailedState();
                this.props.onSelectedChange({
                    selectedShapes: [],
                    selectedPoints: []
                });

                return;
            }

            if (!selectedShapes[0].props.id.includes('Axis')) {
                this.props.onUpdateLastFailedState();
                this.props.onSelectedChange({
                    selectedShapes: [],
                    selectedPoints: []
                });

                return;
            }

            const axisDirection = selectedShapes[0].props.id.includes('xAxis') ? 'x' : (selectedShapes[0].props.id.includes('yAxis') ? 'y' : 'z');
            if (selectedPoints.length === 1) {
                const center = Factory.createPoint(
                    utils.createPointDefaultShapeProps(''),
                    axisDirection === 'x' ? selectedPoints[0].x : 0,
                    axisDirection === 'y' ? selectedPoints[0].y : 0,
                    axisDirection === 'z' ? selectedPoints[0].z ?? 0 : 0
                );

                const radius = Math.sqrt(
                    Math.pow(selectedPoints[0].x - center.x, 2) +
                    Math.pow(selectedPoints[0].y - center.y, 2) +
                    Math.pow((selectedPoints[0].z ?? 0) - (center.z ?? 0), 2)
                );

                const labelUsed = [...this.props.labelUsed];
                let label = `circle0`
                let index = 0;
                while (this.props.labelUsed.includes(label)) {
                    index++;
                    label = `circle${index}`;
                }

                labelUsed.push(label);
                const circle = Factory.createCircle(
                    utils.createCircleDefaultShapeProps(label, radius),
                    center,
                    radius,
                    Factory.createVector(
                        utils.createVectorDefaultShapeProps(''),
                        center,
                        Factory.createPoint(
                            utils.createPointDefaultShapeProps(''),
                            axisDirection === 'x' ? center.x + radius : center.x,
                            axisDirection === 'y' ? center.y + radius : center.y,
                            axisDirection === 'z' ? (center.z ?? 0) + radius : (center.z ?? 0)
                        )
                    )
                );

                const shapeNode: ShapeNode3D = {
                    id: circle.props.id,
                    type: circle,
                    dependsOn: [center.props.id, selectedShapes[0].props.id],
                    defined: true,
                    isSelected: false
                };

                
                DAG.set(circle.props.id, shapeNode);
                this.props.onLabelUsed(labelUsed);
                this.props.onUpdateLastFailedState();
                this.props.onUpdateAll({
                    gs: {...this.props.geometryState},
                    dag: DAG,
                    selectedPoints: [],
                    selectedShapes: []
                });
            }

            else return;
        }

        else if (this.props.mode === 'circle_center_direction') {
            const selectedPoints = [...this.props.selectedPoints];
            const selectedShapes = [...this.props.selectedShapes];
            if (selectedPoints.length !== 1) {
                this.props.onUpdateLastFailedState();
                this.props.onSelectedChange({
                    selectedShapes: [],
                    selectedPoints: []
                });

                return;
            }

            if (selectedShapes.length === 0) return;
            if (!selectedShapes[0].props.id.includes('line-') && !selectedShapes[0].props.id.includes('vector-') && !selectedShapes[0].props.id.includes('plane-')) {
                this.props.onUpdateLastFailedState();
                this.props.onSelectedChange({
                    selectedShapes: [],
                    selectedPoints: []
                });

                return;
            }

            const center = selectedPoints[0];
            if (this.props.data === undefined || typeof this.props.data !== 'number') {
                this.props.onRenderDialogbox(this.props.mode);
                return;
            }

            const radius = this.props.data;
            const labelUsed = [...this.props.labelUsed];
            let label = `circle0`
            let index = 0;
            while (this.props.labelUsed.includes(label)) {
                index++;
                label = `circle${index}`;
            }

            labelUsed.push(label);
            if (selectedShapes[0].props.id.includes('vector-')) {
                const vector = selectedShapes[0] as Vector;
                const circle = Factory.createCircle(
                    utils.createCircleDefaultShapeProps(label, radius),
                    center,
                    radius,
                    vector
                );

                DAG.set(circle.props.id, {
                    id: circle.props.id,
                    type: circle,
                    dependsOn: [center.props.id, selectedShapes[0].props.id],
                    defined: true,
                    isSelected: false,
                });

                this.props.onLabelUsed(labelUsed);
                this.props.onUpdateLastFailedState();
                this.props.onUpdateAll({
                    gs: {...this.props.geometryState},
                    dag: DAG,
                    selectedPoints: [],
                    selectedShapes: []
                })
            }

            else if (selectedShapes[0].props.id.includes('line-')) {
                const [start, end] = operation.getStartAndEnd(selectedShapes[0]);
                const vector = Factory.createVector(
                    utils.createVectorDefaultShapeProps(''),
                    center,
                    Factory.createPoint(
                        utils.createPointDefaultShapeProps(''),
                        center.x + (end.x - start.x),
                        center.y + (end.y - start.y),
                        (center.z ?? 0) + ((end.z ?? 0) - (start.z ?? 0))
                    )
                );

                const circle = Factory.createCircle(
                    utils.createCircleDefaultShapeProps(label, radius),
                    center,
                    radius,
                    vector
                );

                const shapeNode: ShapeNode3D = {
                    id: circle.props.id,
                    type: circle,
                    dependsOn: [center.props.id, selectedShapes[0].props.id],
                    defined: true,
                    isSelected: false
                };

                DAG.set(circle.props.id, shapeNode);
                this.props.onLabelUsed(labelUsed);
                this.props.onUpdateLastFailedState();
                this.props.onUpdateAll({
                    gs: {...this.props.geometryState},
                    dag: DAG,
                    selectedPoints: [],
                    selectedShapes: []
                });
            }

            else {
                const vector = (selectedShapes[0] as Plane).norm;
                const circle = Factory.createCircle(
                    utils.createCircleDefaultShapeProps(label, radius),
                    center,
                    radius,
                    vector
                );

                const shapeNode: ShapeNode3D = {
                    id: circle.props.id,
                    type: circle,
                    dependsOn: [center.props.id, selectedShapes[0].props.id],
                    defined: true,
                    isSelected: false
                };

                DAG.set(circle.props.id, shapeNode);
                this.props.onLabelUsed(labelUsed);
                this.props.onUpdateLastFailedState();
                this.props.onUpdateAll({
                    gs: {...this.props.geometryState},
                    dag: DAG,
                    selectedPoints: [],
                    selectedShapes: []
                });
            }
        }

        else if (this.props.mode === 'cylinder') {
            const selectedPoints = [...this.props.selectedPoints];
            const selectedShapes = [...this.props.selectedShapes];
            if (selectedShapes.length !== 0) {
                this.props.onUpdateLastFailedState();
                this.props.onSelectedChange({
                    selectedShapes: [],
                    selectedPoints: []
                });
            }

            if (selectedPoints.length !== 2) return;
            const radius = this.props.data;
            if (radius === undefined || typeof radius !== 'number') {
                this.props.onRenderDialogbox(this.props.mode);
                return;
            }

            let idx = 0;
            let cylinder_label = `cylinder${idx}`;
            const labelUsed = [...this.props.labelUsed];
            while (labelUsed.includes(cylinder_label)) {
                idx += 1;
                cylinder_label = `cylinder${idx}`;
            }

            labelUsed.push(cylinder_label);
            const cylinder = Factory.createCylinder(
                utils.createCylinderDefaultShapeProps(cylinder_label, radius),
                selectedPoints[0],
                selectedPoints[1],
                radius
            );
            
            const shapeNode: ShapeNode3D = {
                id: cylinder.props.id,
                type: cylinder,
                dependsOn: [selectedPoints[0].props.id, selectedPoints[1].props.id],
                defined: true,
                isSelected: false
            };

            DAG.set(cylinder.props.id, shapeNode);
            this.props.onUpdateLastFailedState();
            this.props.onLabelUsed(labelUsed);
            this.props.onUpdateAll({
                gs: {...this.props.geometryState},
                dag: DAG,
                selectedPoints: [],
                selectedShapes: []
            });
        }

        else if (this.props.mode === 'cone') {
            const selectedPoints = [...this.props.selectedPoints];
            const selectedShapes = [...this.props.selectedShapes];
            if (selectedShapes.length > 0) {
                this.props.onUpdateLastFailedState();
                this.props.onSelectedChange({
                    selectedShapes: [],
                    selectedPoints: []
                });

                return;
            }

            if (selectedPoints.length !== 2) return;
            const radius = this.props.data;
            if (radius === undefined || typeof radius !== 'number') {
                this.props.onRenderDialogbox(this.props.mode);
                return;
            }

            let idx = 0;
            let cone_label = `cone${idx}`;
            const labelUsed = [...this.props.labelUsed];
            while (labelUsed.includes(cone_label)) {
                idx += 1;
                cone_label = `cone${idx}`;
            }

            labelUsed.push(cone_label);
            const cone = Factory.createCone(
                utils.createCylinderDefaultShapeProps(cone_label, radius),
                selectedPoints[0],
                selectedPoints[1],
                radius
            );

            DAG.set(cone.props.id, {
                id: cone.props.id,
                defined: true,
                isSelected: false,
                type: cone,
                dependsOn: selectedPoints.map(point => point.props.id)
            });

            this.props.onUpdateLastFailedState();
            this.props.onLabelUsed(labelUsed);
            this.props.onUpdateAll({
                gs: {...this.props.geometryState},
                dag: DAG,
                selectedPoints: [],
                selectedShapes: []
            });
        }

        else if (this.props.mode === 'pyramid') {
            const selectedPoints = [...this.props.selectedPoints];
            const selectedShapes = [...this.props.selectedShapes];
            
            if (selectedShapes.length !== 1) {
                this.props.onUpdateLastFailedState();
                this.props.onSelectedChange({
                    selectedShapes: [],
                    selectedPoints: []
                });

                return;
            }

            if (selectedPoints.length === 0) return;
            if (selectedPoints.length > 1) {
                this.props.onUpdateLastFailedState();
                this.props.onSelectedChange({
                    selectedShapes: [],
                    selectedPoints: []
                });

                return;
            }

            const polygon = selectedShapes[0];
            if (!('points' in polygon)) {
                this.props.onUpdateLastFailedState();
                this.props.onSelectedChange({
                    selectedShapes: [],
                    selectedPoints: []
                });

                return;
            }

            let idx = 0;
            let pyramid_label = `pyramid${idx}`;
            const labelUsed = [...this.props.labelUsed];
            while (labelUsed.includes(pyramid_label)) {
                idx += 1;
                pyramid_label = `pyramid${idx}`;
            }

            labelUsed.push(pyramid_label);
            const pyramid = Factory.createPyramid(
                utils.createCylinderDefaultShapeProps(pyramid_label, 0),
                polygon,
                selectedPoints[0]
            );

            DAG.set(pyramid.props.id, {
                id: pyramid.props.id,
                defined: true,
                isSelected: false,
                type: pyramid,
                dependsOn: [polygon.props.id, selectedPoints[0].props.id]
            });

            this.props.onUpdateLastFailedState();
            this.props.onLabelUsed(labelUsed);
            this.props.onUpdateAll({
                gs: {...this.props.geometryState},
                dag: DAG,
                selectedPoints: [],
                selectedShapes: []
            });
        }

        else if (this.props.mode === 'prism') {
            const selectedPoints = [...this.props.selectedPoints];
            const selectedShapes = [...this.props.selectedShapes];
            if (selectedPoints.length > 0) {
                this.props.onUpdateLastFailedState();
                this.props.onSelectedChange({
                    selectedShapes: [],
                    selectedPoints: []
                });

                return;
            }

            const shape = selectedShapes[0];
            if (!('points' in shape)) {
                this.props.onUpdateLastFailedState();
                this.props.onSelectedChange({
                    selectedShapes: [],
                    selectedPoints: []
                });

                return;
            }

            const height = this.props.data;
            if (height === undefined || typeof height !== 'number') {
                this.props.onRenderDialogbox(this.props.mode);
                return;
            }

            let idx = 0;
            let prism_label = `prism${idx}`;
            const labelUsed = [...this.props.labelUsed];
            while (labelUsed.includes(prism_label)) {
                idx += 1;
                prism_label = `prism${idx}`;
            }

            labelUsed.push(prism_label);

            // Create a translation vector from the base polygon to the top polygon
            const base = shape as Polygon;
            const v1 = {
                x: base.points[1].x - base.points[0].x,
                y: base.points[1].y - base.points[0].y,
                z: (base.points[1].z ?? 0) - (base.points[0].z ?? 0)
            };

            const v2 = {
                x: base.points[2].x - base.points[1].x,
                y: base.points[2].y - base.points[1].y,
                z: (base.points[2].z ?? 0) - (base.points[1].z ?? 0)
            }

            let n = operation.cross(v1.x, v1.y, v1.z, v2.x, v2.y, v2.z);
            n = {
                x: n.x / Math.sqrt(n.x * n.x + n.y * n.y + n.z * n.z) * height,
                y: n.y / Math.sqrt(n.x * n.x + n.y * n.y + n.z * n.z) * height,
                z: n.z / Math.sqrt(n.x * n.x + n.y * n.y + n.z * n.z) * height
            };

            // Create the top polygon by translating the base polygon along the normal vector
            const topPoints = base.points.map(pt => {
                return Factory.createPoint(
                    utils.createPointDefaultShapeProps(utils.incrementLabel(pt.props.label)),
                    pt.x + n.x,
                    pt.y + n.y,
                    (pt.z ?? 0) + n.z
                )
            });

            topPoints.forEach((pt, idx) => {
                let i = 0;
                let segment_label = `segment0`;
                while (labelUsed.includes(segment_label)) {
                    i += 1;
                    segment_label = `segment${i}`;
                }

                labelUsed.push(segment_label);
                const segment = Factory.createSegment(
                    utils.createLineDefaultShapeProps(segment_label),
                    base.points[idx],
                    pt
                );

                segment.props.color = '#FF7276';

                DAG.set(pt.props.id, {
                    id: pt.props.id,
                    defined: true,
                    isSelected: false,
                    type: pt,
                    dependsOn: [base.points[idx].props.id]
                });

                DAG.set(segment.props.id, {
                    id: segment.props.id,
                    defined: true,
                    isSelected: false,
                    type: segment,
                    dependsOn: [base.points[idx].props.id, pt.props.id]
                })
            })

            let polygon_label = `poly0`;
            idx = 0;
            while (labelUsed.includes(polygon_label)) {
                idx += 1;
                polygon_label = `poly${idx}`;
            }

            labelUsed.push(polygon_label);
            const top = Factory.createPolygon(
                utils.createPolygonDefaultShapeProps(polygon_label),
                topPoints
            );

            const prism = Factory.createPrism(
                utils.createPlaneDefaultShapeProps(prism_label),
                shape,
                top
            );

            prism.props.color = '#FF7276';
            DAG.set(top.props.id, {
                id: top.props.id,
                defined: true,
                isSelected: false,
                type: top,
                dependsOn: [base.props.id]
            });

            DAG.set(prism.props.id, {
                id: prism.props.id,
                defined: true,
                isSelected: false,
                type: prism,
                dependsOn: selectedPoints.map(point => point.props.id)
            });

            this.props.onUpdateLastFailedState();
            this.props.onLabelUsed(labelUsed);
            this.props.onUpdateAll({
                gs: {...this.props.geometryState},
                dag: DAG,
                selectedPoints: [],
                selectedShapes: []
            });
        }

        else if (this.props.mode === 'tetrahedron') {
            const selectedPoints = [...this.props.selectedPoints];
            const selectedShapes = [...this.props.selectedShapes];
            if (selectedShapes.length > 0) {
                this.props.onUpdateLastFailedState();
                this.props.onSelectedChange({
                    selectedShapes: [],
                    selectedPoints: []
                });

                return;
            }

            if (selectedPoints.length < 4) {
                const lastPoint = selectedPoints[selectedPoints.length - 1];
                for (let i = 0; i < selectedPoints.length - 1; i++) {
                    if (selectedPoints[i] === lastPoint) {
                        selectedPoints.splice(i, 1);
                        selectedPoints.pop();
                        this.props.onSelectedPointsChange(selectedPoints);
                        return;
                    }
                }

                return;
            }

            if (operation.checkCoplanar(selectedPoints)) {
                this.props.onUpdateLastFailedState();
                this.props.onSelectedChange({
                    selectedShapes: [],
                    selectedPoints: []
                });

                return;
            }

            const apex = selectedPoints[selectedPoints.length - 1];
            let idx = 0;
            let tetra_label = `tetra${idx}`;
            const labelUsed = [...this.props.labelUsed];
            while (labelUsed.includes(tetra_label)) {
                idx += 1;
                tetra_label = `tetra${idx}`;
            }

            labelUsed.push(tetra_label);
            const tetra = Factory.createPyramid(
                utils.createCylinderDefaultShapeProps(tetra_label, 0),
                Factory.createPolygon(
                    utils.createPolygonDefaultShapeProps(''),
                    selectedPoints.slice(0, selectedPoints.length - 1)
                ),
                apex
            );

            DAG.set(tetra.props.id, {
                id: tetra.props.id,
                defined: true,
                isSelected: false,
                type: tetra,
                dependsOn: selectedPoints.map(point => point.props.id)
            });

            this.props.onUpdateLastFailedState();
            this.props.onLabelUsed(labelUsed);
            this.props.onUpdateAll({
                gs: {...this.props.geometryState},
                dag: DAG,
                selectedPoints: [],
                selectedShapes: []
            });
        }

        else if (['parallel_plane', 'perpendicular_plane'].includes(this.props.mode)) {
            const selectedShapes = [...this.props.selectedShapes];
            const selectedPoints = [...this.props.selectedPoints];
            if (selectedShapes.length !== 1) {
                this.props.onUpdateLastFailedState();
                this.props.onSelectedChange({
                    selectedShapes: [],
                    selectedPoints: []
                });

                return;
            }

            const shape = selectedShapes[0];
            if ((this.props.mode === 'parallel_plane' && !shape.props.id.includes('plane-')) ||
                (this.props.mode === 'perpendicular_plane' && !shape.props.id.includes('line-'))) {
                this.props.onUpdateLastFailedState();
                this.props.onSelectedChange({
                    selectedShapes: [],
                    selectedPoints: []
                });

                return;
            }

            if (selectedPoints.length !== 1) return;
            const labelUsed = [...this.props.labelUsed];
            if (this.props.mode === 'parallel_plane') {
                // shape is Plane, no need to check again
                // If point is on the plane, do nothing
                const norm = {
                    x: (shape as Plane).norm.endVector.x - (shape as Plane).norm.startVector.x,
                    y: (shape as Plane).norm.endVector.y - (shape as Plane).norm.startVector.y,
                    z: ((shape as Plane).norm.endVector.z ?? 0) - ((shape as Plane).norm.startVector.z ?? 0)
                }

                const point = selectedPoints[0];
                const p = (shape as Plane).point;
                const d = -(norm.x * p.x + norm.y * p.y + norm.z * (p.z ?? 0))
                if (Math.abs(norm.x * point.x + norm.y * point.y + norm.z * (point.z ?? 0) + d) <= constants.EPSILON) {
                    this.props.onUpdateLastFailedState();
                    this.props.onSelectedChange({
                        selectedShapes: [],
                        selectedPoints: []
                    });

                    return;
                }
                
                let idx = 0;
                let plane_label = `plane0`;
                while (labelUsed.includes(plane_label)) {
                    idx++;
                    plane_label = `plane${idx}`;
                }

                labelUsed.push(plane_label);
                const plane = Factory.createPlane(
                    utils.createPlaneDefaultShapeProps(plane_label),
                    selectedPoints[0],
                    (shape as Plane).norm
                );

                plane.type = 'ParallelPlane';

                DAG.set(plane.props.id, {
                    id: plane.props.id,
                    defined: true,
                    isSelected: false,
                    dependsOn: [shape.props.id, selectedPoints[0].props.id],
                    type: plane
                });

                this.props.onUpdateLastFailedState();
                this.props.onLabelUsed(labelUsed);
                this.props.onUpdateAll({
                    gs: {...this.props.geometryState},
                    dag: DAG,
                    selectedPoints: [],
                    selectedShapes: []
                });
            }

            else {
                // shape is Line, no need to check again
                // If point is on the line, do nothing
                const [start, end] = operation.getStartAndEnd(shape as Line);
                const point = selectedPoints[0];
                const v1 = {
                    x: end.x - start.x,
                    y: end.y - start.y,
                    z: (end.z ?? 0) - (start.z ?? 0)
                }

                let idx = 0;
                let plane_label = `plane0`;
                while (labelUsed.includes(plane_label)) {
                    idx++;
                    plane_label = `plane${idx}`;
                }

                labelUsed.push(plane_label);

                const plane = Factory.createPlane(
                    utils.createPlaneDefaultShapeProps(plane_label),
                    point,
                    Factory.createVector(
                        utils.createVectorDefaultShapeProps(''),
                        point,
                        Factory.createPoint(
                            utils.createPointDefaultShapeProps(''),
                            point.x + v1.x,
                            point.y + v1.y,
                            (point.z ?? 0) + v1.z
                        )
                    )
                );

                plane.type = 'PerpendicularPlane';
                DAG.set(plane.props.id, {
                    id: plane.props.id,
                    defined: true,
                    isSelected: false,
                    dependsOn: [shape.props.id, selectedPoints[0].props.id],
                    type: plane
                });

                this.props.onUpdateLastFailedState();
                this.props.onLabelUsed(labelUsed);
                this.props.onUpdateAll({
                    gs: {...this.props.geometryState},
                    dag: DAG,
                    selectedPoints: [],
                    selectedShapes: []
                });
            }
        }

        else if (this.props.mode === 'angle') {
            const [selectedPoints, selectedShapes] = [[...this.props.selectedPoints], [...this.props.selectedShapes]];
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
                    tmpVertex
                )


                let shapeNode: ShapeNode3D = {
                    id: a.props.id,
                    dependsOn: [selectedShapes[0].props.id, selectedShapes[1].props.id],
                    type: a,
                    defined: vertex[0].coors !== undefined && vertex[0].ambiguous === false,
                    isSelected: false
                }

                DAG.set(a.props.id, shapeNode);
                this.props.onUpdateLastFailedState();
                this.props.onUpdateAll({
                    gs: {...this.props.geometryState},
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
                    point2
                )


                let shapeNode: ShapeNode3D = {
                    id: a.props.id,
                    dependsOn: [selectedPoints[0].props.id, selectedPoints[1].props.id, selectedPoints[2].props.id],
                    type: a,
                    defined: true,
                    isSelected: false
                };

        
                DAG.set(a.props.id, shapeNode);

                this.props.onUpdateLastFailedState();
                this.props.onUpdateAll({
                    gs: {...this.props.geometryState},
                    dag: DAG,
                    selectedPoints: [],
                    selectedShapes: []
                });
            }
        }
    }

    private handleMouseDown = (e: MouseEvent) => {
        if (!this.cameraRef.current || !this.sceneRef.current || !this.rendererRef.current || !this.canvasRef.current) return;
        if (e.button !== 0) {
            this.props.onRenderMenuRightClick({x: e.clientX, y: e.clientY});
            return;
        }

        this.props.onRenderMenuRightClick();
        if (this.props.mode !== 'edit') {
            this.controlsRef.current!.enabled = false;
            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2();
            const rect = this.rendererRef.current.domElement.getBoundingClientRect();
            mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(mouse, this.cameraRef.current);

            const children = this.sceneRef.current.children.filter(obj => !(obj instanceof THREE.GridHelper));

            // Intersect with your 3D objects
            let intersects = raycaster.intersectObjects(children, true); // true = check all descendants
            const objects = intersects.filter(item => !(item.object instanceof THREE.Sprite));
            const realObjects: THREE.Object3D[] = [];
            objects.forEach(obj => {
                function getTopParent(object: THREE.Object3D): THREE.Object3D {
                    let current = object;
                    while (current.parent && !(current.parent instanceof THREE.Scene)) {
                        current = current.parent;
                    }

                    return current;
                }

                realObjects.push(getTopParent(obj.object));
            });

            const uniqueObjects = Array.from(new Set(realObjects));

            uniqueObjects.sort((a, b) => (b.renderOrder ?? 0) - (a.renderOrder ?? 0)); 

            const shape = uniqueObjects.length > 0 ? uniqueObjects[0] : undefined;
            if (shape && this.props.dag.get(shape.name) && this.props.mode === 'delete') {
                shape.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                        // Dispose geometry if present
                        if (child.geometry) {
                            child.geometry.dispose();
                        }

                        // Dispose material if present
                        if (child.material) {
                            if (Array.isArray(child.material)) {
                                child.material.forEach((material) => {
                                    if (material) material.dispose();
                                });
                            } else {
                                child.material.dispose();
                            }
                        }
                    }
                });

                // Finally, remove it from its parent (optional, depends on your use case)
                if (shape.parent) {
                    shape.parent.remove(shape);
                }

                return;
            }

            if (shape) {
                let pNode = this.props.dag.get(shape.name)!;
                if (!shape.name.includes('point-')) {
                    const newSelected = [...this.props.selectedShapes, pNode.type];
                    this.props.onSelectedShapesChange(newSelected);
                }

                else {
                    this.props.onSelectedPointsChange([...this.props.selectedPoints, pNode.type as Point]);
                }
            }

            if (this.props.mode === 'intersection' && objects.filter(item => !item.object.name.includes('point-')).length > 1) {
                this.createPoint(mouse, objects);
                return;
            }

            if (this.props.mode === 'point') {
                if (shape !== undefined) {
                    this.createPoint(mouse, objects);
                    return;
                }
            }

            else if (['show_label', 'show_object'].includes(this.props.mode)) {
                if (!shape) return;
                let shapeNode = this.props.dag.get(shape.name);
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

                    shape.visible = shapeNode.type.props.visible.shape;
                }

                else {
                    shapeNode.type.props.visible.label = !shapeNode.type.props.visible.label;
                }

                let text = shape.children.find(item => item instanceof THREE.Sprite);
                if (!text) return;
                text.visible = shapeNode.type.props.visible.label;
                return;
            }

            requestAnimationFrame(() => this.handleDrawing());
            return;
        }

        this.controlsRef.current!.enabled = true;
    }

    private screenToWorld(screen: THREE.Vector2): THREE.Vector3 {
        if (!this.cameraRef.current) return new THREE.Vector3();
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(screen, this.cameraRef.current!);
        
        const plane = new THREE.Plane(utils3d.convertToVector3(0, 0, 1), 0); // XY-plane
        const worldPoint = new THREE.Vector3();
        raycaster.ray.intersectPlane(plane, worldPoint);
        return worldPoint;
    }

    private createPoint = (position: THREE.Vector2, objects: THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>>[]) => {
        const DAG = utils3d.cloneDAG(this.props.dag); // your own DAG clone

        let pos = this.screenToWorld(position); // Use raycaster for accurate projection
        let scaleFactor: number | undefined = undefined;
        let rotFactor: { phi: number, theta: number } | undefined = undefined;

        objects.slice(-2).forEach(s => {
            const info = utils3d.snapToShape3D(DAG, s.object, pos); // your own snap logic
            pos = info.position;
            rotFactor = info.rotFactor;
            scaleFactor = info.scaleFactor;
        });

        // Label assignment
        let index = 0;
        let label = utils.getExcelLabel('A', index);
        while (this.props.labelUsed.includes(label)) {
            index++;
            label = utils.getExcelLabel('A', index);
        }

        this.props.onLabelUsed([...this.props.labelUsed, label]);

        // Create point
        const pointPos = utils3d.convertToVector3(pos.x, pos.y, pos.z);
        const point = Factory.createPoint(
            utils.createPointDefaultShapeProps(label),
            pointPos.x,
            pointPos.y,
            pointPos.z
        )

        point.type = objects.length <= 1 ? 'Point' : 'Intersection';

        const shapeNode: ShapeNode3D = {
            id: point.props.id,
            type: point,
            dependsOn: objects.slice(-2).map(child => child.object.name),
            scaleFactor,
            rotationFactor: rotFactor,
            defined: true,
            isSelected: true,
            side: point.type === 'Intersection' ? 0 : undefined
        };

        DAG.set(shapeNode.id, shapeNode);

        // Update selection & state
        const selectedPoints = [...this.props.selectedPoints, point];
        this.props.onUpdateLastFailedState(
            this.props.mode === 'point' ? undefined : {
                selectedPoints: selectedPoints,
                selectedShapes: [...this.props.selectedShapes]
            }
        );

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