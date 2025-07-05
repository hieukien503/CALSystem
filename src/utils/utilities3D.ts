import * as THREE from 'three'
import { ShapeProps } from '../types/geometry';

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