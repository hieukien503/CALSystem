import * as GeometryShape from '../types/geometry';

export const isPlane = (shape: GeometryShape.Shape): shape is GeometryShape.Plane => 'point' in shape && 'norm' in shape;
export const isCylinder = (shape: GeometryShape.Shape): shape is GeometryShape.Cylinder => 'point1' in shape && 'point2' in shape;
export const isCone = (shape: GeometryShape.Shape): shape is GeometryShape.Cone => 'center' in shape && 'apex' in shape;
export const isSphere = (shape: GeometryShape.Shape): shape is GeometryShape.Sphere => 'centerS' in shape && 'radius' in shape;
export const isPyramid = (shape: GeometryShape.Shape): shape is GeometryShape.Pyramid => 'apex' in shape && 'base' in shape;
export const isCuboid = (shape: GeometryShape.Shape): shape is GeometryShape.Cuboid => 'topLeftBack' in shape && 'bottomRightFront' in shape;
export const isPrism = (shape: GeometryShape.Shape): shape is GeometryShape.Prism => 'base' in shape && 'top_point' in shape;
export const isPoint = (shape: GeometryShape.Shape): shape is GeometryShape.Point => 'x' in shape;
export const isCircle = (shape: GeometryShape.Shape): shape is GeometryShape.Circle => 'centerC' in shape && 'radius' in shape;
export const isPolygon = (shape: GeometryShape.Shape): shape is GeometryShape.Polygon => 'points' in shape;
export const isVector = (shape: GeometryShape.Shape): shape is GeometryShape.Vector => 'startVector' in shape && 'endVector' in shape;
export const isLine = (shape: GeometryShape.Shape): shape is GeometryShape.Line => 'startLine' in shape && 'endLine' in shape;
export const isRay = (shape: GeometryShape.Shape): shape is GeometryShape.Ray => 'startRay' in shape && 'endRay' in shape;
export const isSegment = (shape: GeometryShape.Shape): shape is GeometryShape.Segment => 'startSegment' in shape && 'endSegment' in shape;