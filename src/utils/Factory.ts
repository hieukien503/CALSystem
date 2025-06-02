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

export const createPolygon = (props: GeometryShape.ShapeProps, points: GeometryShape.Point[]): GeometryShape.Polygon => {
    let poly: GeometryShape.Polygon = {
        points: points,
        props: props,
        type: 'Polygon'
    }

    poly.area = getArea(poly);
    return poly;
}