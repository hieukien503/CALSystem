import * as GeometryShape from '../types/geometry'
import { getArea } from './math_operation';

export const createPoint = (props: GeometryShape.ShapeProps, x: number, y: number, z: number = 0): GeometryShape.Point => {
    let p: GeometryShape.Point = {
        x: x,
        y: y,
        z: z,
        props: props,
        type: 'Point'
    }

    return p;
}

export const createLine = (props: GeometryShape.ShapeProps, start: GeometryShape.Point, end: GeometryShape.Point): GeometryShape.Line => {
    let l: GeometryShape.Line = {
        startLine: start,
        endLine: end,
        props: props,
        type: 'Line'
    }

    return l;
}

export const createSegment = (props: GeometryShape.ShapeProps, start: GeometryShape.Point, end: GeometryShape.Point): GeometryShape.Segment => {
    let s: GeometryShape.Segment = {
        startSegment: start,
        endSegment: end,
        props: props,
        type: 'Segment'
    }

    return s;
}

export const createRay = (props: GeometryShape.ShapeProps, start: GeometryShape.Point, end: GeometryShape.Point): GeometryShape.Ray => {
    let r: GeometryShape.Ray = {
        startRay: start,
        endRay: end,
        props: props,
        type: 'Ray'
    }

    return r;
}

export const createVector = (props: GeometryShape.ShapeProps, start: GeometryShape.Point, end: GeometryShape.Point): GeometryShape.Vector => {
    let r: GeometryShape.Vector = {
        startVector: start,
        endVector: end,
        props: props,
        type: 'Vector'
    }

    return r;
}

export const createCircle = (props: GeometryShape.ShapeProps, center: GeometryShape.Point, radius: number, normal?: GeometryShape.Vector): GeometryShape.Circle => {
    let c: GeometryShape.Circle = {
        centerC: center,
        radius: radius,
        props: props,
        normal: normal,
        type: 'Circle'
    }

    return c;
}

export const createSemiCircle = (props: GeometryShape.ShapeProps, start: GeometryShape.Point, end: GeometryShape.Point, normal?: GeometryShape.Vector): GeometryShape.SemiCircle => {
    let c: GeometryShape.SemiCircle = {
        start: start,
        end: end,
        props: props,
        normal: normal,
        type: 'SemiCircle'
    }

    return c;
}

export const createPolygon = (props: GeometryShape.ShapeProps, points: GeometryShape.Point[]): GeometryShape.Polygon => {
    let poly: GeometryShape.Polygon = {
        points: points,
        props: props,
        type: 'Polygon'
    }

    poly.area = getArea(poly);
    return poly;
}

export const createSphere = (props: GeometryShape.ShapeProps, center: GeometryShape.Point, radius: number): GeometryShape.Sphere => {
    let s: GeometryShape.Sphere = {
        centerS: center,
        radius: radius,
        props: props,
        type: 'Sphere'
    }

    return s;
}

export const createPlane = (props: GeometryShape.ShapeProps, point: GeometryShape.Point, norm: GeometryShape.Vector): GeometryShape.Plane => {
    let p: GeometryShape.Plane = {
        point: point,
        norm: norm,
        props: props,
        type: 'Sphere'
    }

    return p;
}

export const createCuboid = (props: GeometryShape.ShapeProps, topLeftBack: GeometryShape.Point, bottomRightFront: GeometryShape.Point): GeometryShape.Cuboid => {
    let p: GeometryShape.Cuboid = {
        topLeftBack: topLeftBack,
        bottomRightFront: bottomRightFront,
        props: props,
        type: 'Cuboid'
    }

    return p;
}

export const createCylinder = (
    props: GeometryShape.ShapeProps,
    point1: GeometryShape.Point,
    point2: GeometryShape.Point,
    radius: number
): GeometryShape.Cylinder => {
    let p: GeometryShape.Cylinder = {
        centerBase1: point1,
        centerBase2: point2,
        radius: radius,
        props: props,
        type: 'Cylinder'
    }

    return p;
}

export const createPrism = (
    props: GeometryShape.ShapeProps,
    base: GeometryShape.Polygon,
    shiftVector: GeometryShape.Vector
): GeometryShape.Prism => {
    let p: GeometryShape.Prism = {
        base: base,
        shiftVector: shiftVector,
        props: props,
        type: 'Prism'
    }

    return p;
}

export const createPyramid = (
    props: GeometryShape.ShapeProps,
    base: GeometryShape.Polygon,
    apex: GeometryShape.Point
): GeometryShape.Pyramid => {
    let p: GeometryShape.Pyramid = {
        base: base,
        apex: apex,
        props: props,
        type: 'Pyramid'
    }

    return p;
}

export const createCone = (
    props: GeometryShape.ShapeProps,
    center: GeometryShape.Point,
    apex: GeometryShape.Point,
    radius: number
): GeometryShape.Cone => {
    let p: GeometryShape.Cone = {
        center: center,
        apex: apex,
        radius: radius,
        props: props,
        type: 'Cone'
    }

    return p;
}