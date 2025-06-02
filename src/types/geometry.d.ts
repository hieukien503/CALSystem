import Konva from 'konva';

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
                        'PerpendicularLine' | 'TangentLine' | 'Median' | 'ParallelLine' | 'Circle3Point' | 'SemiCircle' | 
                        'Angle' | 'Cuboid' | 'Cone' | 'Sphere' | 'Plane' | 'Prism' | 'Pyramid' | 'Cylinder'

export interface Angle extends BaseShape {
    degrees: number;
    type: 'Angle';
}

// Point type
export interface Point extends BaseShape {
    x: number;
    y: number;
    z?: number;
}

export type Intersection = Point | Line | Circle

export interface Midpoint extends Point {
    
}

export interface Centroid extends Point {
    
}

export interface Orthocenter extends Point {
    
}

export interface Circumcenter extends Point {
    
}

export interface Incenter extends Point {
    
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

export interface AngleBisector extends Line {

}

export interface PerpendicularBisector extends Line {

}

export interface PerpendicularLine extends Line {

}

export interface TangentLine extends Line {

}

export interface Median extends Line {

}

export interface ParallelLine extends Line {

}

export interface Circle3Point extends Circle {

}

export interface SemiCircle extends Circle {

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
    normal?: Vector;
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

export interface Cuboid extends Shape3D {
    topLeftBack: Point;
    bottomRightFront: Point;
}

export interface Prism extends Shape3D {
    base: Polygon;
    shiftVector: Vector;
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
    | Sphere 
    | Plane 
    | Cuboid 
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
    node: Konva.Shape;
    /** IDs of other ShapeNodes this one depends on */
    dependsOn: string[];
}

export interface ShapeNode3D {
    /** ID of KonvaShape */
    id: string;
    /** Type of shape */
    type: Shape;
    /** IDs of other ShapeNodes this one depends on */
    dependsOn: string[];
}

// Geometry state
export interface GeometryState {
    /** Array of shapes in the scene */
    shapes: Map<string, ShapeNode | ShapeNode3D>;
    
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

    /** Dummy variable to force re-render */
    dummy: boolean;

    /** Index for buttons */
    pointIndex: number;
    lineIndex: number;
    circleIndex: number;
    polygonIndex: number;
    rayIndex: number;
    segmentIndex: number;
    vectorIndex: number;

    /** Selected shapes */
    selectedShapes: Point[];
    /** Whether the tool is active */
    mode: string;
}