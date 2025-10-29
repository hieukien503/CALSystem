import * as THREE from 'three';
import { ShapeNode3D, ShapeProps, GeometryState, Shape, Point, Vector, Ray, Segment, Line } from '../types/geometry';
import * as constants3d from '../types/constants3D';
import * as operation from '../utils/math_operation';

// Utility functions
export const createDashLine = (points: THREE.Vector3[], props: ShapeProps): THREE.Line => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineDashedMaterial({
        color: props.color,
        linewidth: props.line_size,
        dashSize: props.line_style.dash_size,
        gapSize: props.line_style.gap_size,
    });

    const line = new THREE.Line(geometry, material);
    line.computeLineDistances();

    // set a name
    line.name = props.id;
    return line;
}

export const convertToVector3 = (x: number, y: number, z: number): THREE.Vector3 => {
    return new THREE.Vector3(x, z, y);
}

export const clone = (
    state: GeometryState,
    dag: Map<string, ShapeNode3D>,
    selectedPoints: Point[],
    selectedShapes: Shape[],
    label_used: string[]
) => {
    const copyState = structuredClone(state);
    const copySelectedPoints = structuredClone(selectedPoints);
    const copySelectedShapes = structuredClone(selectedShapes);
    const copyLabelUsed = Array.from(label_used);
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
            side: node.side
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
            side: node.side
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
    texture.format = THREE.RGBAFormat;
    texture.minFilter = THREE.LinearFilter;
    texture.needsUpdate = true;

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
    object: THREE.Object3D<THREE.Object3DEventMap>,
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
            let N = node.type.normal ? new THREE.Vector3(
                node.type.normal.endVector.x - node.type.normal.startVector.x,
                node.type.normal.endVector.y - node.type.normal.startVector.y,
                (node.type.normal.endVector.z ?? 0) - (node.type.normal.startVector.z ?? 0),
            ).normalize() : convertToVector3(0, 0, 1);
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