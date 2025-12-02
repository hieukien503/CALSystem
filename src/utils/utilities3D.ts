import * as THREE from 'three';
import { ShapeNode3D, ShapeProps, GeometryState, Shape, Point, Vector, Ray, Segment, Line, ShapeType, 
        Polygon, Circle, Plane } from '../types/geometry';
import * as constants3d from '../types/constants3D';
import * as operation from '../utils/math_operation';
import * as utils from './utilities';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { v4 as uuidv4 } from 'uuid';
import * as Factory from './Factory'

// Utility functions
export const createDashLine = (points: THREE.Vector3[], props: ShapeProps): THREE.Group => {
    const positions: number[] = [];
    points.forEach(p => positions.push(p.x, p.y, p.z));

    // Build LineGeometry
    const geometry = new LineGeometry();
    geometry.setPositions(positions);

    // --- Solid line material ---
    const solidMaterial = new LineMaterial({
        color: props.color,
        linewidth: props.line_size, // in world units
        dashed: false,
        depthTest: true,
        depthWrite: true,          // <-- prevent overwriting plane depth
        polygonOffset: true,
        polygonOffsetFactor: -10,
        polygonOffsetUnits: -10,
        transparent: false
    });

    // --- Dashed line material ---
    const dashedMaterial = new LineMaterial({
        color: props.color,
        linewidth: props.line_size,
        dashed: true,
        dashSize: props.line_style.dash_size === 0 ? 0.5 : props.line_style.dash_size,
        gapSize: props.line_style.gap_size === 0 ? 0.25 : props.line_style.gap_size,
        depthTest: false,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: 2,
        polygonOffsetUnits: 2,
    });

    // --- Create the solid and dashed Line2 objects ---
    const solidLine = new Line2(geometry, solidMaterial);
    const dashedLine = new Line2(geometry, dashedMaterial);

    solidMaterial.resolution.set(window.innerWidth, window.innerHeight);
    dashedMaterial.resolution.set(window.innerWidth, window.innerHeight);

    // Required for correct dashed rendering
    solidLine.computeLineDistances();
    dashedLine.computeLineDistances();

    // Set render order (solid below, dashed above)
    solidLine.renderOrder = 2;
    dashedLine.renderOrder = 3;

    // Scale correction (important for LineMaterial)
    solidLine.scale.set(1, 1, 1);
    dashedLine.scale.set(1, 1, 1);

    // Group both lines
    const group = new THREE.Group();
    group.add(dashedLine);
    group.add(solidLine);
    
    return group;
}

export const convertToVector3 = (x: number, y: number, z: number): THREE.Vector3 => {
    return new THREE.Vector3(x, z, y);
}

export const clone = (
    state: GeometryState,
    dag: Map<string, ShapeNode3D>,
    selectedPoints: Point[],
    selectedShapes: Shape[],
    label_used: string[],
    cloneType: boolean = false
) => {
    const copyState = structuredClone(state);
    const copySelectedPoints = structuredClone(selectedPoints);
    const copySelectedShapes = structuredClone(selectedShapes);
    const copyLabelUsed = Array.from(label_used);
    const copyDAG = new Map<string, ShapeNode3D>();
    dag.forEach((node, key) => {
        copyDAG.set(key, {
            id: key,
            type: cloneType ? structuredClone(node.type) : node.type,
            scaleFactor: node.scaleFactor,
            rotationFactor: structuredClone(node.rotationFactor),
            dependsOn: Array.from(node.dependsOn),
            defined: node.defined,
            isSelected: node.isSelected,
            side: node.side,
            isDraggable: node.isDraggable
        })
    })

    return {
        state: copyState,
        dag: copyDAG,
        selectedPoints: copySelectedPoints,
        selectedShapes: copySelectedShapes,
        label_used: copyLabelUsed
    }
}

export const cloneDAG = (dag: Map<string, ShapeNode3D>): Map<string, ShapeNode3D> => {
    const copyDAG = new Map<string, ShapeNode3D>();
    dag.forEach((node, key) => {
        copyDAG.set(key, {
            id: key,
            type: node.type,
            scaleFactor: node.scaleFactor,
            rotationFactor: structuredClone(node.rotationFactor),
            dependsOn: Array.from(node.dependsOn),
            defined: node.defined,
            isSelected: node.isSelected,
            side: node.side,
            isDraggable: node.isDraggable
        })
    });

    return copyDAG;
}

export const createLabel = (
    text: string,
    position: THREE.Vector3,
    xOffset: number,
    yOffset: number,
    zOffset: number,
    color: string
): THREE.Sprite => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    const fontSize = constants3d.FONT_DEFAULTS.SIZE;
    const fontFamily = constants3d.FONT_DEFAULTS.FAMILY;
    const padding = 10;

    context.font = `${fontSize}px ${fontFamily}`;
    const textWidth = context.measureText(text).width;
    canvas.width = textWidth + padding * 2;
    canvas.height = fontSize + padding * 2;

    // Need to set font again after resizing canvas
    context.font = `${fontSize}px ${fontFamily}`;
    context.textBaseline = 'middle';
    context.textAlign = 'center';

    context.clearRect(0, 0, canvas.width, canvas.height);

    // Optional: Add background for contrast (can be transparent)
    context.fillStyle = 'rgba(0, 0, 0, 0.0)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw text
    context.fillStyle = color;
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    // 2. Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace; // fix color shift
    texture.minFilter = THREE.LinearFilter;

    // 3. Create sprite material and sprite
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
    const sprite = new THREE.Sprite(material);
    sprite.renderOrder = 1; // draw after the plane

    // 4. Scale sprite to match text size (adjust based on your scene scale)
    const scaleFactor = 0.01; // tweak this as needed
    sprite.scale.set(canvas.width * scaleFactor, canvas.height * scaleFactor, 1);

    // 5. Position sprite with offset
    sprite.position.set(
        position.x + xOffset,
        position.y + yOffset,
        position.z + zOffset
    );

    return sprite;
}

export const getSphericalAngles = (v: THREE.Vector3) => {
    const spherical = new THREE.Spherical();
    spherical.setFromVector3(v);

    const radius = spherical.radius;           // length of the vector
    const polar = spherical.phi;              // θ, from +Z axis down (0 to π)
    const azimuth = spherical.theta;          // φ, from +X axis toward +Y (−π to π)

    return {
        radius,
        polar,         // θ in radians
        azimuth        // φ in radians
    };
}

export const projectPointOntoLineSegment = (
    p: { x: number; y: number, z: number },
    a: { x: number; y: number, z: number },
    b: { x: number; y: number, z: number }
): number => {
    const ap = { x: p.x - a.x, y: p.y - a.y, z: p.z - a.z };
    const ab = { x: b.x - a.x, y: b.y - a.y, z: b.z - a.z };
    const abLengthSq = ab.x * ab.x + ab.y * ab.y + ab.z * ab.z;

    // Dot product of ap and ab
    let t = (ap.x * ab.x + ap.y * ab.y + ap.z * ap.z) / abLengthSq;
    // Clamp t to [0, 1] to stay within segment bounds
    t = Math.max(0, Math.min(1, t));
    return t;
};

export const snapToShape3D = (
    DAG: Map<string, ShapeNode3D>,
    object: THREE.Object3D<THREE.Object3DEventMap> | undefined,
    pos: THREE.Vector3
): {
    position: THREE.Vector3,
    rotFactor: {
        center: THREE.Vector3,
        phi: number,
        theta: number,
    } | undefined;
    scaleFactor: number | undefined;
} => {
    let position = pos.clone();
    let rotFactor: { center: THREE.Vector3, phi: number; theta: number } | undefined = undefined;
    let scaleFactor: number | undefined = undefined;
    if (!object) {
        return {
            position: position,
            rotFactor: rotFactor,
            scaleFactor: scaleFactor
        }
    }

    const node = DAG.get(object.name);
    if (node) {
        if ('centerS' in node.type && 'radius' in node.type) {
            const center = new THREE.Vector3().setFromMatrixPosition(object.matrixWorld);
            const dir = pos.clone().sub(center);
            const dist = dir.length();
            if (dist === 0) {
                position = center.clone();
                rotFactor = { center: new THREE.Vector3(), phi: 0, theta: 0 };
            }

            else {
                const data = getSphericalAngles(dir);
                const getPointOnSphere = (center: THREE.Vector3, radius: number, theta: number, phi: number): THREE.Vector3 => {
                    const x = radius * Math.sin(theta) * Math.cos(phi);
                    const y = radius * Math.sin(theta) * Math.sin(phi);
                    const z = radius * Math.cos(theta);

                    return new THREE.Vector3(x, y, z).add(center);
                }

                position = getPointOnSphere(center, data.radius, data.polar, data.azimuth);
                rotFactor = {
                    center: new THREE.Vector3(),
                    phi: data.azimuth,
                    theta: data.polar
                }
            }
        }

        else if (('startSegment' in node.type) || ('startRay' in node.type) || ('startLine' in node.type) ||  ('startVector' in node.type)) {
            let l = ('startVector' in node.type) ? node.type as Vector : (
                ('startRay' in node.type) ? node.type as Ray : 
                (('startSegment' in node.type) ? node.type as Segment : node.type as Line)
            );

            const [start, end] = operation.getStartAndEnd(l);
            const s = {
                x: start.x,
                y: start.y,
                z: start.z ?? 0
            };

            const e = {
                x: end.x,
                y: end.y,
                z: end.z ?? 0
            }

            scaleFactor = projectPointOntoLineSegment (
                pos, 
                s,
                e
            );

            position.set(
                s.x + (e.x - s.x) * scaleFactor,
                s.y + (e.y - s.y) * scaleFactor,
                s.z + (e.y - s.y) * scaleFactor
            );
        }

        else if ('centerC' in node.type && 'radius' in node.type) {
            let c = node.type;
            const N: THREE.Vector3 = convertToVector3(0, 0, 1);
            if (c.direction) {
                if ('startVector' in c.direction) {
                    const dir = convertToVector3(
                        c.direction.endVector.x - c.direction.startVector.x,
                        c.direction.endVector.y - c.direction.startVector.y,
                        (c.direction.endVector.z ?? 0) - (c.direction.startVector.z ?? 0)
                    ).normalize();
                    N.copy(dir);
                }

                else if ('startLine' in c.direction) {
                    const dir = convertToVector3(
                        c.direction.endLine.x - c.direction.startLine.x,
                        c.direction.endLine.y - c.direction.startLine.y,
                        (c.direction.endLine.z ?? 0) - (c.direction.startLine.z ?? 0)
                    ).normalize();
                    N.copy(dir);
                }

                else if ('startSegment' in c.direction) {
                    const dir = convertToVector3(
                        c.direction.endSegment.x - c.direction.startSegment.x,
                        c.direction.endSegment.y - c.direction.startSegment.y,
                        (c.direction.endSegment.z ?? 0) - (c.direction.startSegment.z ?? 0)
                    ).normalize();
                    N.copy(dir);
                }

                else if ('startRay' in c.direction) {
                    const dir = convertToVector3(
                        c.direction.endRay.x - c.direction.startRay.x,
                        c.direction.endRay.y - c.direction.startRay.y,
                        (c.direction.endRay.z ?? 0) - (c.direction.startRay.z ?? 0)
                    ).normalize();
                    N.copy(dir);
                }

                else {
                    const p = c.direction as Plane;
                    const dir = convertToVector3(
                        p.norm.endVector.x - p.norm.startVector.x,
                        p.norm.endVector.y - p.norm.startVector.y,
                        (p.norm.endVector.z ?? 0) - (p.norm.startVector.z ?? 0)
                    ).normalize();
                    N.copy(dir);
                }
            }

            let C = convertToVector3(c.centerC.x, c.centerC.y, c.centerC.z ?? 0);

            const X_local = new THREE.Vector3();
            const arbitrary = Math.abs(N.x) > 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
            X_local.crossVectors(N, arbitrary).normalize();
            const Y_local = new THREE.Vector3().crossVectors(N, X_local).normalize();

            const V = new THREE.Vector3().subVectors(pos, C);
            const x = V.dot(X_local);
            const y = V.dot(Y_local);

            const azimuth = Math.atan2(y, x);
            const cosTheta = V.clone().normalize().dot(N);
            const polar = Math.acos(cosTheta);

            const x_new = c.radius * Math.cos(azimuth);
            const y_new = c.radius * Math.sin(azimuth);
            const displacement = X_local.clone().multiplyScalar(x_new).add(Y_local.clone().multiplyScalar(y_new));

            position = displacement;
            rotFactor = {
                phi: azimuth,
                theta: polar,
                center: C
            }
        }

        else if ('point' in node.type && 'norm' in node.type) {
            let plane = node.type;
            const a = plane.norm.endVector.x - plane.norm.startVector.x;
            const b = plane.norm.endVector.y - plane.norm.startVector.y;
            const c = (plane.norm.endVector.z ?? 0) - (plane.norm.startVector.z ?? 0);
            const planeNormal = convertToVector3(a, b, c).normalize();

            const numerator = planeNormal.x * pos.x + planeNormal.y * pos.y + planeNormal.z * (pos.z ?? 0) - (planeNormal.x * plane.point.x + planeNormal.y * plane.point.y + planeNormal.z * (plane.point.z ?? 0));
            const denominator = planeNormal.x * planeNormal.x + planeNormal.y * planeNormal.y + planeNormal.z * planeNormal.z;

            const t = numerator / denominator;

            const projected = pos.clone().sub(planeNormal.clone().multiplyScalar(t));
            position = projected;
        }
    }

    else {
        if (object.name.includes('Axis')) {
            let start = {
                x: object.name === 'xAxis' ? -6 : 0,
                y: object.name === 'zAxis' ? -2.6 : 0,
                z: object.name === 'yAxis' ? 6 : 0
            }

            let end = {
                x: object.name === 'xAxis' ? start.x + 12 : 0,
                y: object.name === 'zAxis' ? start.y + 7.2 : 0,
                z: object.name === 'yAxis' ? start.z + 12 : 0
            }

            scaleFactor = projectPointOntoLineSegment (
                pos, 
                start,
                end
            );

            position = new THREE.Vector3(
                start.x + (end.x - start.x) * scaleFactor,
                start.y + (end.y - start.y) * scaleFactor,
                start.z + (end.z - start.z) * scaleFactor
            );
        }

        else {
            // Plane z = 0
            const planeNormal = convertToVector3(0, 0, 1).normalize();

            const numerator = planeNormal.x * pos.x + planeNormal.y * pos.y + planeNormal.z * pos.z;
            const denominator = planeNormal.x * planeNormal.x + planeNormal.y * planeNormal.y + planeNormal.z * planeNormal.z;

            const t = numerator / denominator;

            const projected = pos.clone().sub(planeNormal.clone().multiplyScalar(t));
            position = projected;
        }
    }
    
    return {
        position: position,
        rotFactor: rotFactor,
        scaleFactor: scaleFactor
    }
}

export const snapToGrid = (position: THREE.Vector3, gridSize: number) => {
    const snapped = position.clone();
    snapped.x = Math.round(snapped.x / gridSize) * gridSize;
    snapped.z = Math.round(snapped.z / gridSize) * gridSize;
    snapped.y = 0; // Ensure it's on the XY-plane
    const distance = position.distanceTo(snapped);
    if (distance <= 0.01) {
        return snapped;
    }

    return position.clone();
}

export const updateShapeAfterTransform = (
    shape: Shape,
    transformedShape: Shape,
    labelUsed: string[],
    dag: Map<string, ShapeNode3D>,
    mode: string,
    data: {
        rotation: {
            degree: number,
            CCW: boolean
        } | undefined;
        scale_factor: number | undefined;
    },
    transformObject: Shape | undefined
): void => {
    const getNewLabel = (oldLabel: string) => {
        if (oldLabel === '') {
            return '';
        }
        
        let label = utils.incrementLabel(oldLabel);
        while (labelUsed.includes(label)) {
            label = utils.incrementLabel(label);
        }

        return label;
    }

    const shapeType: ShapeType = (mode === 'rotation' ? 'Rotation' : 
                    (mode === 'enlarge' ? 'Enlarge' : (mode === 'translation' ? 'Translation' : 'Reflection')));

    if ('points' in transformedShape) {
        let idx = 0;
        let label = `poly${idx}`;
        while (labelUsed.includes(label)) {
            idx += 1;
            label = `poly${idx}`;
        }

        labelUsed.push(label);
        transformedShape.props.label = label;
        transformedShape.props.id = `polygon-${label}`;
        const points = (transformedShape as Polygon).points;
        for(let i = 0; i < points.length; i++) {
            let label = getNewLabel((shape as Polygon).points[i].props.label);
            labelUsed.push(label);
            points[i].props.label = label;
            points[i].props.id = `point-${uuidv4()}`;

            let shapeNode: ShapeNode3D = {
                id: points[i].props.id,
                defined: true,
                isSelected: false,
                dependsOn: [(shape as Polygon).points[i].props.id, transformObject!.props.id],
                type: points[i],
                node: undefined,
                rotationFactor: mode === 'rotation' ? {
                    degree: (data.rotation ? data.rotation.degree : 0),
                    CCW: (data.rotation ? data.rotation.CCW : true)
                } : undefined,
                scaleFactor: data.scale_factor ? data.scale_factor : undefined,
                isDraggable: false
            };

            points[i].type = shapeType;
            dag.set(points[i].props.id, shapeNode);
        };

        for (let i = 0; i < points.length; i++) {
            const pNext = points[(i + 1) % points.length];
            const oldSegment = Array.from(dag.entries()).find((value: [string, ShapeNode3D]) => {
                return 'startSegment' in value[1].type && 
                (
                    (value[1].type.endSegment.props.id === (shape as Polygon).points[i].props.id && (value[1].type.startSegment.props.id === (shape as Polygon).points[(i + 1) % points.length].props.id)) ||
                    (value[1].type.startSegment.props.id === (shape as Polygon).points[i].props.id && (value[1].type.endSegment.props.id === (shape as Polygon).points[(i + 1) % points.length].props.id))
                )
            });

            label = `segment0`;
            let index = 0;
            while (labelUsed.includes(label)) {
                index++;
                label = `segment${index}`;
            }

            labelUsed.push(label);
            const segment = Factory.createSegment(
                structuredClone(oldSegment![1].type.props),
                points[i],
                pNext
            );

            segment.props.label = label;
            segment.props.id = `line-${label}`
            let anotherShapeNode: ShapeNode3D = {
                id: segment.props.id,
                defined: true,
                isSelected: false,
                dependsOn: [oldSegment![1].id, transformObject!.props.id, points[i].props.id, pNext.props.id, transformedShape.props.id],
                type: segment,
                node: undefined,
                rotationFactor: mode === 'rotation' ? {
                    degree: (data.rotation ? data.rotation.degree : 0),
                    CCW: (data.rotation ? data.rotation.CCW : true)
                } : undefined,
                scaleFactor: data.scale_factor ? data.scale_factor : undefined,
                isDraggable: false
            };

            segment.type = shapeType;
            dag.set(segment.props.id, anotherShapeNode);
        }

        let shapeNode = {
            id: transformedShape.props.id,
            type: transformedShape,
            node: undefined,
            dependsOn: [shape.props.id, transformObject!.props.id],
            defined: true,
            isSelected: false,
            rotationFactor: mode === 'rotation' ? {
                degree: (data.rotation ? data.rotation.degree : 0),
                CCW: (data.rotation ? data.rotation.CCW : true)
            } : undefined,
            scaleFactor: data.scale_factor ? data.scale_factor : undefined,
            isDraggable: false
        };

        dag.set(transformedShape.props.id, shapeNode);
    }

    else if (!('x' in transformedShape && 'y' in transformedShape)) {
        if ('startSegment' in shape) {
            const [start, end] = [(shape as Segment).startSegment, (shape as Segment).endSegment];
            (transformedShape as Segment).startSegment.props.label = getNewLabel(start.props.label);
            (transformedShape as Segment).startSegment.props.id = `point-${uuidv4()}`
            labelUsed.push((transformedShape as Segment).startSegment.props.label);
            (transformedShape as Segment).endSegment.props.label = getNewLabel(end.props.label);
            (transformedShape as Segment).endSegment.props.id = `point-${uuidv4()}`
            labelUsed.push((transformedShape as Segment).endSegment.props.label);
            let segment_label = `segment0`;
            let index = 0;
            while (labelUsed.includes(segment_label)) {
                index++;
                segment_label = `segment${index}`;
            }

            labelUsed.push(segment_label);
            transformedShape.props.label = segment_label;
            transformedShape.props.id = `line-${segment_label}`;

            let shapeNode1: ShapeNode3D = {
                id: (transformedShape as Segment).startSegment.props.id,
                defined: true,
                isSelected: false,
                dependsOn: [start.props.id, transformObject!.props.id],
                type: (transformedShape as Segment).startSegment,
                node: undefined,
                rotationFactor: mode === 'rotation' ? {
                    degree: (data.rotation ? data.rotation.degree : 0),
                    CCW: (data.rotation ? data.rotation.CCW : true)
                } : undefined,
                scaleFactor: data.scale_factor ? data.scale_factor : undefined,
                isDraggable: false
            }

            let shapeNode2: ShapeNode3D = {
                id: (transformedShape as Segment).endSegment.props.id,
                defined: true,
                isSelected: false,
                dependsOn: [end.props.id, transformObject!.props.id],
                type: (transformedShape as Segment).endSegment,
                node: undefined,
                rotationFactor: mode === 'rotation' ? {
                    degree: (data.rotation ? data.rotation.degree : 0),
                    CCW: (data.rotation ? data.rotation.CCW : true)
                } : undefined,
                scaleFactor: data.scale_factor ? data.scale_factor : undefined,
                isDraggable: false
            }

            let anotherShapeNode = {
                id: transformedShape.props.id,
                defined: true,
                isSelected: false,
                dependsOn: [shape.props.id, transformObject!.props.id, shapeNode1.id, shapeNode2.id],
                type: transformedShape,
                node: undefined,
                rotationFactor: mode === 'rotation' ? {
                    degree: (data.rotation ? data.rotation.degree : 0),
                    CCW: (data.rotation ? data.rotation.CCW : true)
                } : undefined,
                scaleFactor: data.scale_factor ? data.scale_factor : undefined,
                isDraggable: false
            };

            transformedShape.type = shapeType;
            shapeNode1.type.type = shapeType;
            shapeNode2.type.type = shapeType;
            dag.set(shapeNode1.id, shapeNode1);
            dag.set(shapeNode2.id, shapeNode2);
            dag.set(transformedShape.props.id, anotherShapeNode);
        }

        else if ('startLine' in shape) {
            const [start, end] = [(shape as Line).startLine, (shape as Line).endLine];
            (transformedShape as Line).startLine.props.label = getNewLabel(start.props.label);
            (transformedShape as Line).startLine.props.id = `point-${uuidv4()}`
            labelUsed.push((transformedShape as Line).startLine.props.label);
            (transformedShape as Line).endLine.props.label = getNewLabel(end.props.label);
            (transformedShape as Line).endLine.props.id = `point-${uuidv4()}`
            labelUsed.push((transformedShape as Line).endLine.props.label);
            let line_label = `line0`;
            let index = 0;
            while (labelUsed.includes(line_label)) {
                index++;
                line_label = `line${index}`;
            }

            labelUsed.push(line_label);
            transformedShape.props.label = line_label;
            transformedShape.props.id = `line-${line_label}`;

            let shapeNode1: ShapeNode3D = {
                id: (transformedShape as Line).startLine.props.id,
                defined: true,
                isSelected: false,
                dependsOn: [start.props.id, transformObject!.props.id],
                type: (transformedShape as Line).startLine,
                node: undefined,
                rotationFactor: mode === 'rotation' ? {
                    degree: (data.rotation ? data.rotation.degree : 0),
                    CCW: (data.rotation ? data.rotation.CCW : true)
                } : undefined,
                scaleFactor: data.scale_factor ? data.scale_factor : undefined,
                isDraggable: false
            }

            let shapeNode2: ShapeNode3D = {
                id: (transformedShape as Line).endLine.props.id,
                defined: true,
                isSelected: false,
                dependsOn: [end.props.id, transformObject!.props.id],
                type: (transformedShape as Line).endLine,
                node: undefined,
                rotationFactor: mode === 'rotation' ? {
                    degree: (data.rotation ? data.rotation.degree : 0),
                    CCW: (data.rotation ? data.rotation.CCW : true)
                } : undefined,
                scaleFactor: data.scale_factor ? data.scale_factor : undefined,
                isDraggable: false
            }

            let anotherShapeNode = {
                id: transformedShape.props.id,
                defined: true,
                isSelected: false,
                dependsOn: [shape.props.id, transformObject!.props.id, shapeNode1.id, shapeNode2.id],
                type: transformedShape,
                node: undefined,
                rotationFactor: mode === 'rotation' ? {
                    degree: (data.rotation ? data.rotation.degree : 0),
                    CCW: (data.rotation ? data.rotation.CCW : true)
                } : undefined,
                scaleFactor: data.scale_factor ? data.scale_factor : undefined,
                isDraggable: false
            };

            transformedShape.type = shapeType;
            shapeNode1.type.type = shapeType;
            shapeNode2.type.type = shapeType;
            dag.set(shapeNode1.id, shapeNode1);
            dag.set(shapeNode2.id, shapeNode2);
            dag.set(transformedShape.props.id, anotherShapeNode);
        }

        else if ('startRay' in shape) {
            const [start, end] = [(shape as Ray).startRay, (shape as Ray).endRay];
            (transformedShape as Ray).startRay.props.label = getNewLabel(start.props.label);
            (transformedShape as Ray).startRay.props.id = `point-${uuidv4()}`
            labelUsed.push((transformedShape as Ray).startRay.props.label);
            (transformedShape as Ray).endRay.props.label = getNewLabel(end.props.label);
            (transformedShape as Ray).endRay.props.id = `point-${uuidv4()}`
            labelUsed.push((transformedShape as Ray).endRay.props.label);
            let ray_label = `ray0`;
            let index = 0;
            while (labelUsed.includes(ray_label)) {
                index++;
                ray_label = `ray${index}`;
            }

            labelUsed.push(ray_label);
            transformedShape.props.label = ray_label;
            transformedShape.props.id = `line-${ray_label}`;

            let shapeNode1: ShapeNode3D = {
                id: (transformedShape as Ray).startRay.props.id,
                defined: true,
                isSelected: false,
                dependsOn: [start.props.id, transformObject!.props.id],
                type: (transformedShape as Ray).startRay,
                node: undefined,
                rotationFactor: mode === 'rotation' ? {
                    degree: (data.rotation ? data.rotation.degree : 0),
                    CCW: (data.rotation ? data.rotation.CCW : true)
                } : undefined,
                scaleFactor: data.scale_factor ? data.scale_factor : undefined,
                isDraggable: false
            }

            let shapeNode2: ShapeNode3D = {
                id: (transformedShape as Ray).endRay.props.id,
                defined: true,
                isSelected: false,
                dependsOn: [end.props.id, transformObject!.props.id],
                type: (transformedShape as Ray).endRay,
                node: undefined,
                rotationFactor: mode === 'rotation' ? {
                    degree: (data.rotation ? data.rotation.degree : 0),
                    CCW: (data.rotation ? data.rotation.CCW : true)
                } : undefined,
                scaleFactor: data.scale_factor ? data.scale_factor : undefined,
                isDraggable: false
            }

            let anotherShapeNode = {
                id: transformedShape.props.id,
                defined: true,
                isSelected: false,
                dependsOn: [shape.props.id, transformObject!.props.id, shapeNode1.id, shapeNode2.id],
                type: transformedShape,
                node: undefined,
                rotationFactor: mode === 'rotation' ? {
                    degree: (data.rotation ? data.rotation.degree : 0),
                    CCW: (data.rotation ? data.rotation.CCW : true)
                } : undefined,
                scaleFactor: data.scale_factor ? data.scale_factor : undefined,
                isDraggable: false
            };

            transformedShape.type = shapeType;
            shapeNode1.type.type = shapeType;
            shapeNode2.type.type = shapeType;
            dag.set(shapeNode1.id, shapeNode1);
            dag.set(shapeNode2.id, shapeNode2);
            dag.set(transformedShape.props.id, anotherShapeNode);
        }

        else if ('startVector' in shape) {
            const [start, end] = [(shape as Vector).startVector, (shape as Vector).endVector];
            (transformedShape as Vector).startVector.props.label = getNewLabel(start.props.label);
            (transformedShape as Vector).startVector.props.id = `point-${uuidv4()}`
            labelUsed.push((transformedShape as Vector).startVector.props.label);
            (transformedShape as Vector).endVector.props.label = getNewLabel(end.props.label);
            (transformedShape as Vector).endVector.props.id = `point-${uuidv4()}`
            labelUsed.push((transformedShape as Vector).endVector.props.label);
            let vector_label = `vector0`;
            let index = 0;
            while (labelUsed.includes(vector_label)) {
                index++;
                vector_label = `vector${index}`;
            }

            labelUsed.push(vector_label);
            transformedShape.props.label = vector_label;
            transformedShape.props.id = `vector-${vector_label}`;

            let shapeNode1: ShapeNode3D = {
                id: (transformedShape as Vector).startVector.props.id,
                defined: true,
                isSelected: false,
                dependsOn: [start.props.id, transformObject!.props.id],
                type: (transformedShape as Vector).startVector,
                node: undefined,
                rotationFactor: mode === 'rotation' ? {
                    degree: (data.rotation ? data.rotation.degree : 0),
                    CCW: (data.rotation ? data.rotation.CCW : true)
                } : undefined,
                scaleFactor: data.scale_factor ? data.scale_factor : undefined,
                isDraggable: false
            }

            let shapeNode2: ShapeNode3D = {
                id: (transformedShape as Vector).endVector.props.id,
                defined: true,
                isSelected: false,
                dependsOn: [end.props.id, transformObject!.props.id],
                type: (transformedShape as Vector).endVector,
                node: undefined,
                rotationFactor: mode === 'rotation' ? {
                    degree: (data.rotation ? data.rotation.degree : 0),
                    CCW: (data.rotation ? data.rotation.CCW : true)
                } : undefined,
                scaleFactor: data.scale_factor ? data.scale_factor : undefined,
                isDraggable: false
            }

            let anotherShapeNode = {
                id: transformedShape.props.id,
                defined: true,
                isSelected: false,
                dependsOn: [shape.props.id, transformObject!.props.id, shapeNode1.id, shapeNode2.id],
                type: transformedShape,
                node: undefined,
                rotationFactor: mode === 'rotation' ? {
                    degree: (data.rotation ? data.rotation.degree : 0),
                    CCW: (data.rotation ? data.rotation.CCW : true)
                } : undefined,
                scaleFactor: data.scale_factor ? data.scale_factor : undefined,
                isDraggable: false
            };

            transformedShape.type = shapeType;
            shapeNode1.type.type = shapeType;
            shapeNode2.type.type = shapeType;
            dag.set(shapeNode1.id, shapeNode1);
            dag.set(shapeNode2.id, shapeNode2);
            dag.set(transformedShape.props.id, anotherShapeNode);
        }

        else if ('centerC' in shape && 'radius' in shape) {
            const center = (shape as Circle).centerC;
            (transformedShape as Circle).centerC.props.label = getNewLabel(center.props.label);
            (transformedShape as Circle).centerC.props.id = `point-${uuidv4()}`;
            if ((shape as Circle).direction !== undefined) {
                updateShapeAfterTransform(
                    (shape as Circle).direction!,
                    (transformedShape as Circle).direction!,
                    labelUsed,
                    dag,
                    mode,
                    data,
                    transformObject
                )
            }
            
            labelUsed.push((transformedShape as Circle).centerC.props.label);
            let circle_label = `circle0`;
            let index = 0;
            while (labelUsed.includes(circle_label)) {
                index++;
                circle_label = `circle${index}`;
            }

            labelUsed.push(circle_label);
            transformedShape.props.label = circle_label;
            transformedShape.props.id = `circle-${circle_label}`;

            let shapeNode1: ShapeNode3D = {
                id: (transformedShape as Circle).centerC.props.id,
                defined: true,
                isSelected: false,
                dependsOn: [(shape as Circle).centerC.props.id, transformObject!.props.id],
                type: (transformedShape as Circle).centerC,
                node: undefined,
                rotationFactor: mode === 'rotation' ? {
                    degree: (data.rotation ? data.rotation.degree : 0),
                    CCW: (data.rotation ? data.rotation.CCW : true)
                } : undefined,
                scaleFactor: data.scale_factor ? data.scale_factor : undefined,
                isDraggable: false
            }

            let anotherShapeNode = {
                id: transformedShape.props.id,
                defined: true,
                isSelected: false,
                dependsOn: [shape.props.id, transformObject!.props.id, shapeNode1.id],
                type: transformedShape,
                node: undefined,
                rotationFactor: mode === 'rotation' ? {
                    degree: (data.rotation ? data.rotation.degree : 0),
                    CCW: (data.rotation ? data.rotation.CCW : true)
                } : undefined,
                scaleFactor: data.scale_factor ? data.scale_factor : undefined,
                isDraggable: false
            };

            transformedShape.type = shapeType;
            shapeNode1.type.type = shapeType;
            dag.set(shapeNode1.id, shapeNode1);
            dag.set(transformedShape.props.id, anotherShapeNode);
        }

        else if ('point' in shape && 'norm' in shape) {
            const p = (shape as Plane).point;
            (transformedShape as Plane).point.props.label = getNewLabel(p.props.label);
            (transformedShape as Plane).point.props.id = `point-${uuidv4()}`;
            const norm = (shape as Plane).norm;
            (transformedShape as Plane).norm.props.label = getNewLabel(norm.props.label);
            (transformedShape as Plane).norm.props.id = `vector-${uuidv4()}`;
        }
    }

    else {
        transformedShape.props.label = getNewLabel(shape.props.label);
        transformedShape.props.id = `point-${uuidv4()}`
        labelUsed.push(transformedShape.props.label);
        let anotherShapeNode = {
            id: transformedShape.props.id,
            defined: true,
            isSelected: false,
            dependsOn: [shape.props.id, transformObject!.props.id],
            type: transformedShape,
            node: undefined,
            rotationFactor: mode === 'rotation' ? {
                degree: (data.rotation ? data.rotation.degree : 0),
                CCW: (data.rotation ? data.rotation.CCW : true)
            } : undefined,
            scaleFactor: data.scale_factor ? data.scale_factor : undefined,
            isDraggable: false
        };

        transformedShape.type = shapeType;
        dag.set(transformedShape.props.id, anotherShapeNode);
    }
}

export function projectToScreen(v: THREE.Vector3, camera: THREE.Camera, canvas: HTMLCanvasElement) {
    const vScreen = v.clone().project(camera);
    const x = (vScreen.x + 1) * 0.5 * canvas.clientWidth;
    const y = (-vScreen.y + 1) * 0.5 * canvas.clientHeight;

    return { x, y };
}

// Distance from mouse to 2D point
function distance2D(p1: {x: number, y: number}, p2: {x: number, y: number}) {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

interface Candidate {
    group: {shape: THREE.Object3D, point: THREE.Vector3};
    priority: number; // point=3, line=2, mesh=1
    distance: number; // 2D distance to mouse
}

export function pickFromGroups(mouse: {x:number, y:number}, canvas: HTMLCanvasElement, camera: THREE.Camera,
    groups: {shape: THREE.Object3D, point: THREE.Vector3}[],
) {
    const candidates: Candidate[] = [];
    const hitRadius = 8;

    groups.forEach(g => {
        const obj = g.shape;
        const p = g.point;

        // Determine priority
        let priority = 0;
        if (obj instanceof THREE.Points || (obj instanceof THREE.Mesh && obj.geometry.type === 'SphereGeometry')) {
            priority = 3; // point
        } 
        
        else if (obj instanceof THREE.Line || obj instanceof Line2) {
            priority = 2; // line
        } 
        
        else if (obj instanceof THREE.Mesh) {
            priority = 1; // mesh/plane
        } 
        
        else {
            if ('children' in obj && obj.children.length > 0) {
                // Check children to determine type
                for (let i = 0; i < obj.children.length; i++) {
                    const child = obj.children[i];
                    if (child instanceof THREE.Points || (child instanceof THREE.Mesh && child.geometry.type === 'SphereGeometry')) {
                        priority = 3;
                        break;
                    }

                    else if (child instanceof THREE.Line || child instanceof Line2) {
                        priority = Math.max(priority, 2);
                    }

                    else if (child instanceof THREE.Mesh) {
                        priority = Math.max(priority, 1);
                    }
                }
            }

            else return; // unsupported object
        }

        // Project intersection point to screen
        const screenPos = projectToScreen(p, camera, canvas);
        const d = distance2D(mouse, screenPos);
        console.log(mouse, p, screenPos, d);

        if (d <= hitRadius) {
            candidates.push({
                group: g,
                priority,
                distance: d
            });
        }
    });

    if (candidates.length === 0) return null;

    // Sort: higher priority first, then smaller distance
    candidates.sort((a, b) => b.priority - a.priority || a.distance - b.distance);

    return candidates[0].group; // return the selected ShapeGroup
}