import * as THREE from 'three';
import { ShapeNode3D, ShapeProps, GeometryState, Shape, Point } from '../types/geometry';
import * as constants3d from '../types/constants3D';

// Utility functions
export const createDashLine = (points: THREE.Vector3[], props: ShapeProps): THREE.Mesh | THREE.Group | null => {
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
    context.fillStyle = color;
    context.textBaseline = 'middle';
    context.textAlign = 'center';

    // Optional: Add background for contrast (can be transparent)
    context.fillStyle = 'rgba(0, 0, 0, 0.0)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw text
    context.fillStyle = color;
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    // 2. Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.needsUpdate = true;

    // 3. Create sprite material and sprite
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);

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