import Konva from 'konva';
import * as THREE from 'three';

// Base interfaces
export interface BaseShape {
    props: ShapeProps;
    type: ShapeType;
}

export interface Shape2D extends BaseShape {

}

export interface Shape3D extends BaseShape {
    surface_area?: number;
    volume?: number;
}

export type ShapeType = 'Point' | 'Line' | 'Segment' | 'Vector' | 'Ray' | 'Circle' | 'Polygon' | 'Intersection' | 'Midpoint' | 
                        'Centroid' | 'Orthocenter' | 'Circumcenter' | 'Incenter' | 'AngleBisector' | 'PerpendicularBisector' |
                        'PerpendicularLine' | 'TangentLine' | 'ParallelLine' | 'Circumcircle' | 'Incircle' | 'SemiCircle' |
                        'Circle2Point' | 'Angle' | 'Cone' | 'Sphere' | 'Plane' | 'Prism' | 'Pyramid' | 'Cylinder' |
                        'Reflection' | 'Rotation' | 'Projection' | 'Enlarge' | 'Translation' | 'Excenter' | 'Excircle' |
                        'RegularPolygon' | 'Sphere2Point' | 'ParallelPlane' | 'PerpendicularPlane';

export interface Angle extends BaseShape {
    // Use degree for angle
    vertex?: Point;
    vector1: Vector;
    vector2: Vector;
    range: [number, number]
}

export interface SemiCircle extends BaseShape {
    start: Point,
    end: Point,
    direction?: Line | Ray | Segment | Vector | Plane;
}

// Point type
export interface Point extends BaseShape {
    x: number;
    y: number;
    z?: number;
}

// 2D Shapes
export interface Vector extends Shape2D {
    startVector: Point;
    endVector: Point;
}

export interface Segment extends Shape2D {
    startSegment: Point;
    endSegment: Point;
}

export interface Line extends Shape2D {
    startLine: Point;
    endLine: Point;
}

export interface Ray extends Shape2D {
    startRay: Point;
    endRay: Point;
}

export interface Polygon extends Shape2D {
    points: Point[];
    area?: number;
}

export interface Circle extends Shape2D {
    centerC: Point;
    radius: number;
    direction?: Line | Ray | Segment | Vector | Plane;
    area?: number;
}

// 3D Shapes
export interface Plane extends Shape3D {
    point: Point;
    norm: Vector;
}

export interface Cylinder extends Shape3D {
    centerBase1: Point;
    centerBase2: Point;
    radius: number;
}

export interface Cone extends Shape3D {
    center: Point;
    apex: Point;
    radius: number;
}

export interface Sphere extends Shape3D {
    centerS: Point;
    radius: number;
}

export interface Pyramid extends Shape3D {
    apex: Point;
    base: Polygon;
}

export interface Prism extends Shape3D {
    base1: Polygon;
    base2: Polygon;
}

// Union type for all shapes
export type Shape = 
    | Point 
    | Line 
    | Segment 
    | Vector 
    | Polygon 
    | Circle 
    | Ray
    | Angle
    | SemiCircle
    | Sphere 
    | Plane 
    | Pyramid 
    | Prism 
    | Cone 
    | Cylinder;

// Line style type
export interface LineStyle {
    dash_size: number;
    gap_size: number;
    dot_size?: number;
}

// Shape properties
export interface ShapeProps {
    /** Line width in pixels */
    line_size: number;
    
    /** Line style configuration [dash size, gap size, dot size?] */
    line_style: LineStyle;
    
    /** Radius of circle */
    radius: number;
    
    /** Opacity value (0-1) for filled shapes */
    opacity?: number;
    
    /** Label text for the shape */
    label: string;
    
    /** Visibility flags for the shape and label */
    visible: {
        shape: boolean;
        label: boolean;
    }
    
    /** Color in any valid CSS color format */
    color: string;
    
    /** Whether the shape is filled */
    fill: boolean;
    
    
    /** Label position offsets */
    labelXOffset: number;
    labelYOffset: number;
    labelZOffset: number;

    /** ID of the shape */
    id: string;
}

export interface ShapeNode {
    /** ID of KonvaShape */
    id: string;
    /** Type of shape */
    type: Shape;
    /** Konva node for the shape */
    node?: Konva.Shape;
    /** For undefined shape */
    defined: boolean;
    /** IDs of other ShapeNodes this one depends on */
    dependsOn: string[];
    /** For enlarge */
    scaleFactor?: number;
    /** For rotation */
    rotationFactor?: {
        degree: number;
        CCW: boolean;
    };
    /** For tangent line and angle bisector */
    side? : 0 | 1;
    /** Selected or not */
    isSelected: boolean;
}

export interface ShapeNode3D {
    /** ID of KonvaShape */
    id: string;
    /** Type of shape */
    type: Shape;
    /** IDs of other ShapeNodes this one depends on */
    dependsOn: string[];
    /** For undefined shape */
    defined: boolean;
    /** For enlarge */
    scaleFactor?: number;
    /** For rotation */
    rotationFactor?: {
        center: THREE.Vector3;
        phi: number;
        theta: number
    } | {
        degree: number,
        CCW: boolean
    };
    node?: THREE.Object3D;
    /** For tangent line and angle bisector */
    side? : 0 | 1;
    /** Selected or not */
    isSelected: boolean;
    /** Draggable or not */
    isDraggable: boolean;
}

// Geometry state
export interface GeometryState {    
    /** Whether the grid is visible */
    gridVisible: boolean;
    
    /** Current zoom level */
    zoom_level: number;

    /** Whether the axes are visible */
    axesVisible: boolean;

    /** Spacing of grid and axes */
    spacing: number;

    /** Interval of axes ticks */
    axisTickInterval: number;

    /** Number of loops */
    numLoops: number;

    /** Whether a panning event is happening */
    panning: boolean;
}

/** Drawing mode */
type DrawingMode = 'edit' | 'point' | 'line' | 'segment' | 'vector' | 'polygon' | 'circle' | 'ray' | 'delete' |
                   'angle' | 'undo' | 'redo' | 'clear' | 'length' | 'area' | 'volume' | 'show_label' | 'show_object' | 'intersection' |
                   'circle_2_points' | 'parallel' | 'perpendicular' | 'midpoint' | 'orthocenter' | 'incenter' | 'centroid' |
                   'circumcenter' | 'incircle' | 'circumcircle' | 'excenter' | 'excircle' | 'segment_length' | 'perpendicular_bisector' |
                   'semicircle' | 'reflect_point' | 'rotation' | 'projection' | 'enlarge' | 'translation' | 'tangent_line' | 'regular_polygon' |
                   'angle_bisector' | 'reflect_line' | 'sphere' | 'sphere_2_points' | 'circle_axis_point' | 'circle_center_direction' |
                   'plane' | 'plane_3_points' | 'parallel_plane' | 'perpendicular_plane' | 'cone' | 'cube' | 'prism' | 'pyramid' |
                   'tetrahedron' | 'cylinder' | 'extrude_pyramid' | 'extrude_prism' | 'reflect_plane' | 'changeName';

/** History */
interface HistoryEntry {
    state: GeometryState,
    dag: Map<string, ShapeNode>,
    selectedPoints: Point[],
    selectedShapes: Shape[],
    label_used: string[]
}

interface HistoryEntry3D {
    state: GeometryState,
    dag: Map<string, ShapeNode3D>,
    selectedPoints: Point[],
    selectedShapes: Shape[],
    label_used: string[]
}