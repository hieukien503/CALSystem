import * as GeometryShape from '../types/geometry';
import * as Factory from './Factory'
const math = require('mathjs');

const epsilon = 1e-5;

const cross = (x1: number, y1: number, z1: number, x2: number, y2: number, z2: number) => {
    return {
        x: y1 * z2 - z1 * y2,
        y: z1 * x2 - x1 * z2,
        z: x1 * y2 - y1 * x2
    }
}

const dot = (x1: number, y1: number, z1: number, x2: number, y2: number, z2: number) => {
    return x1 * x2 + y1 * y2 + z1 * z2;
}

const L2_norm = (x: number, y: number, z: number) => {
    return math.parse('sqrt(x^2 + y^2 + z^2)').evaluate({x: x, y: y, z: z});
}

const symbolicSqrt = (num: number): number => {
    return math.parse('sqrt(x)').evaluate({x: num});
}

const symbolicSin = (num: number): number => {
    return math.parse('sin(x)').evaluate({x: num});
}

const symbolicCos = (num: number): number => {
    return math.parse('cos(x)').evaluate({x: num});
}

const symbolicACos = (num: number): number => {
    return math.parse('acos(x)').evaluate({x: num});
}

export const isCollinear = (A: GeometryShape.Point, B: GeometryShape.Point, C: GeometryShape.Point) => {
    const AB = {
        x: B.x - A.x,
        y: B.y - A.y,
        z: (B.z ?? 0) - (A.z ?? 0)
    }

    const AC = {
        x: C.x - A.x,
        y: C.y - A.y,
        z: (C.z ?? 0) - (A.z ?? 0)
    }
    
    let cross_product = cross(AB.x, AB.y, AB.z, AC.x, AC.y, AC.z);
    return L2_norm(cross_product.x, cross_product.y, cross_product.z) < epsilon;
}

const distance = (base: GeometryShape.Polygon, point: GeometryShape.Point) => {
    let [point1, point2, point3] = [base.points[0], base.points[1], base.points[2]];
    let norm = cross(
        point2.x - point1.x,
        point2.y - point1.y,
        (point2.z ?? 0) - (point1.z ?? 0),
        point3.x - point1.x,
        point3.y - point1.y,
        (point3.z ?? 0) - (point1.z ?? 0)
    );

    let height = Math.abs(
        norm.x * point.x + norm.y * point.y + (norm.z ?? 0) * (point.z ?? 0) - (norm.x * point1.x + norm.y * point1.y + (norm.z ?? 0) * (point1.z ?? 0))
    ) / L2_norm(norm.x, norm.y, norm.z);

    return height;
}

export const getStartAndEnd = (shape: GeometryShape.Shape) => {
    if (('startLine' in shape) || ('startRay' in shape) || ('startSegment' in shape)) {
        let start = {
            x: (('startLine' in shape) ? (shape as GeometryShape.Line).startLine.x : 
                ('startRay' in shape) ? (shape as GeometryShape.Ray).startRay.x : (shape as GeometryShape.Segment).startSegment.x),
            y: (('startLine' in shape) ? (shape as GeometryShape.Line).startLine.y : 
                ('startRay' in shape) ? (shape as GeometryShape.Ray).startRay.y : (shape as GeometryShape.Segment).startSegment.y),
            z: (('startLine' in shape) ? (shape as GeometryShape.Line).startLine.z : 
                ('startRay' in shape) ? (shape as GeometryShape.Ray).startRay.z : (shape as GeometryShape.Segment).startSegment.z)
        }

        let end = {
            x: (('startLine' in shape) ? (shape as GeometryShape.Line).endLine.x : 
                ('startRay' in shape) ? (shape as GeometryShape.Ray).endRay.x : (shape as GeometryShape.Segment).endSegment.x),
            y: (('startLine' in shape) ? (shape as GeometryShape.Line).endLine.y : 
                ('startRay' in shape) ? (shape as GeometryShape.Ray).endRay.y : (shape as GeometryShape.Segment).endSegment.y),
            z: (('startLine' in shape) ? (shape as GeometryShape.Line).endLine.z : 
                ('startRay' in shape) ? (shape as GeometryShape.Ray).endRay.z : (shape as GeometryShape.Segment).endSegment.z)
        }

        return [start, end]
    }

    return [];
}

export const getDistance = (shape1: GeometryShape.Point, shape2: GeometryShape.Point) => {
    return symbolicSqrt(Math.pow(shape1.x - shape2.x, 2) + Math.pow(shape1.y - shape2.y, 2) + Math.pow((shape1.z ?? 0) - (shape2.z ?? 0), 2));
}

const getPerimeter = (shape: GeometryShape.Polygon) => {
    let perimeter = 0;
    for (let i = 0; i < shape.points.length; i++) {
        perimeter += getDistance(shape.points[i], shape.points[i + 1]);
    }

    perimeter += getDistance(shape.points[shape.points.length - 1], shape.points[0]);
    return perimeter;
}

export const getIntersections2D = (shape1: GeometryShape.Shape, shape2: GeometryShape.Shape): {coors: {x: number, y: number, z: number} | undefined, ambiguous: boolean}[] => {
    if (!('startSegment' in shape1) && !('startRay' in shape1) && !('startLine' in shape1) && !('points' in shape1) && !('centerC' in shape1 && 'radius' in shape1) && !('start' in shape1 && 'end' in shape1)) {
        throw new Error('Shape1 must be a valid shape for intersection');
    }

    if (!('startSegment' in shape2) && !('startRay' in shape2) && !('startLine' in shape2) && !('points' in shape2) && !('centerC' in shape2 && 'radius' in shape2) && !('start' in shape2 && 'end' in shape2)) {
        throw new Error('Shape2 must be a valid shape for intersection');
    }

    if (('startSegment' in shape1) || ('startRay' in shape1) || ('startLine' in shape1)) {
        let [start, end] = getStartAndEnd(shape1);

        if (('startSegment' in shape2) || ('startRay' in shape2) || ('startLine' in shape2)) {
            let [start2, end2] = getStartAndEnd(shape2);
            let A = math.intersect(
                [start.x, start.y, (start.z ?? 0)],
                [end.x, end.y, (end.z ?? 0)],
                [start2.x, start2.y, (start2.z ?? 0)],
                [end2.x, end2.y, (end2.z ?? 0)]
            )

            if (A === null) {
                let crossProduct1 = cross(
                    end.x - start.x,
                    end.y - start.y,
                    (end.z ?? 0) - (start.z ?? 0),
                    end2.x - start2.x,
                    end2.y - start2.y,
                    (end2.z ?? 0) - (start2.z ?? 0)
                )

                let crossProduct2 = cross(
                    end.x - start.x,
                    end.y - start.y,
                    (end.z ?? 0) - (start.z ?? 0),
                    start2.x - start.x,
                    start2.y - start.y,
                    (start2.z ?? 0) - (start.z ?? 0)
                )

                if (L2_norm(crossProduct1.x, crossProduct1.y, crossProduct1.z) > epsilon || (L2_norm(crossProduct1.x, crossProduct1.y, crossProduct1.z) < epsilon && L2_norm(crossProduct2.x, crossProduct2.y, crossProduct2.z) > epsilon)) {
                    return [
                        {
                            coors: undefined,
                            ambiguous: false
                        }
                    ]
                }

                return [
                    {
                        coors: undefined,
                        ambiguous: true
                    }
                ]
            }

            let v = {
                x: A[0].valueOf() as number - start.x,
                y: A[1].valueOf() as number - start.y,
                z: (A.length === 2 ? 0 : A[2].valueOf() as number) - (start.z ?? 0)
            }

            let dotProduct = dot(v.x, v.y, v.z, end.x - start.x, end.y - start.y, (end.z ?? 0) - (start.z ?? 0));

            if ('startRay' in shape1) {
                if (Math.abs(dotProduct) < epsilon || (dotProduct < 0 && Math.abs(dotProduct) > epsilon)) {
                    return [
                        {
                            coors: {
                                x: A[0].valueOf() as number,
                                y: A[1].valueOf() as number,
                                z: A.length === 2 ? A[2].valueOf() as number : 0
                            },

                            ambiguous: true
                        }
                    ]
                }

                let v1 = {
                    x: A[0].valueOf() as number - start2.x,
                    y: A[1].valueOf() as number - start2.y,
                    z: (A.length === 2 ? 0 : A[2].valueOf() as number) - (start2.z ?? 0)
                }

                let dotProduct2 = dot(
                    end2.x - start2.x,
                    end2.y - start2.y,
                    (end2.z ?? 0) - (start2.z ?? 0),
                    v1.x,
                    v1.y,
                    v1.z
                )

                if ('startRay' in shape2) {
                    if (Math.abs(dotProduct2) < epsilon || (dotProduct2 < 0 && Math.abs(dotProduct2) > epsilon)) {
                        return [
                            {
                                coors: {
                                    x: A[0].valueOf() as number,
                                    y: A[1].valueOf() as number,
                                    z: A.length === 2 ? A[2].valueOf() as number : 0
                                },

                                ambiguous: true
                            }
                        ]
                    }
                }

                else if ('startSegment' in shape2) {
                    if (Math.abs(dotProduct2) < epsilon || (dotProduct2 < 0 && Math.abs(dotProduct2) > epsilon)) {
                        return [
                            {
                                coors: {
                                    x: A[0].valueOf() as number,
                                    y: A[1].valueOf() as number,
                                    z: A.length === 2 ? A[2].valueOf() as number : 0
                                },

                                ambiguous: true
                            }
                        ]
                    }

                    if (L2_norm(v1.x, v1.y, v1.z) > L2_norm(end2.x - start2.x, end2.y - start2.y, (end2.z ?? 0) - (start2.z ?? 0))) {
                        return [
                            {
                                coors: {
                                    x: A[0].valueOf() as number,
                                    y: A[1].valueOf() as number,
                                    z: A.length === 2 ? A[2].valueOf() as number : 0
                                },

                                ambiguous: true
                            }
                        ]
                    }
                }

                return [
                    {
                        coors: {
                            x: A[0].valueOf() as number,
                            y: A[1].valueOf() as number,
                            z: A.length === 2 ? A[2].valueOf() as number : 0
                        },

                        ambiguous: false
                    }
                ]
            }

            else if ('startSegment' in shape1) {
                if (Math.abs(dotProduct) < epsilon || (dotProduct < 0 && Math.abs(dotProduct) > epsilon)) {
                    return [
                        {
                            coors: {
                                x: A[0].valueOf() as number,
                                y: A[1].valueOf() as number,
                                z: A.length === 2 ? A[2].valueOf() as number : 0
                            },

                            ambiguous: true
                        }
                    ]
                }

                if (L2_norm(v.x, v.y, v.z) > L2_norm(end.x - start.x, end.y - start.y, (end.z ?? 0) - (start.z ?? 0))) {
                    return [
                        {
                            coors: {
                                x: A[0].valueOf() as number,
                                y: A[1].valueOf() as number,
                                z: A.length === 2 ? A[2].valueOf() as number : 0
                            },

                            ambiguous: true
                        }
                    ]
                }

                let v1 = {
                    x: A[0].valueOf() as number - start2.x,
                    y: A[1].valueOf() as number - start2.y,
                    z: (A.length === 2 ? 0 : A[2].valueOf() as number) - (start2.z ?? 0)
                }

                let dotProduct2 = dot(
                    end2.x - start2.x,
                    end2.y - start2.y,
                    (end2.z ?? 0) - (start2.z ?? 0),
                    v1.x,
                    v1.y,
                    v1.z
                )

                if ('startRay' in shape2) {
                    if (Math.abs(dotProduct2) < epsilon || (dotProduct2 < 0 && Math.abs(dotProduct2) > epsilon)) {
                        return [
                            {
                                coors: {
                                    x: A[0].valueOf() as number,
                                    y: A[1].valueOf() as number,
                                    z: A.length === 2 ? A[2].valueOf() as number : 0
                                },

                                ambiguous: true
                            }
                        ]
                    }
                }

                else if ('startSegment' in shape2) {
                    if (Math.abs(dotProduct2) < epsilon || (dotProduct2 < 0 && Math.abs(dotProduct2) > epsilon)) {
                        return [
                            {
                                coors: {
                                    x: A[0].valueOf() as number,
                                    y: A[1].valueOf() as number,
                                    z: A.length === 2 ? A[2].valueOf() as number : 0
                                },

                                ambiguous: true
                            }
                        ]
                    }

                    if (L2_norm(v1.x, v1.y, v1.z) > L2_norm(end2.x - start2.x, end2.y - start2.y, (end2.z ?? 0) - (start2.z ?? 0))) {
                        return [
                            {
                                coors: {
                                    x: A[0].valueOf() as number,
                                    y: A[1].valueOf() as number,
                                    z: A.length === 2 ? A[2].valueOf() as number : 0
                                },

                                ambiguous: true
                            }
                        ]
                    }
                }

                return [
                    {
                        coors: {
                            x: A[0].valueOf() as number,
                            y: A[1].valueOf() as number,
                            z: A.length === 2 ? A[2].valueOf() as number : 0
                        },

                        ambiguous: false
                    }
                ]
            }

            else {
                let v1 = {
                    x: A[0].valueOf() as number - start2.x,
                    y: A[1].valueOf() as number - start2.y,
                    z: (A.length === 2 ? 0 : A[2].valueOf() as number) - (start2.z ?? 0)
                }

                let dotProduct2 = dot(
                    end2.x - start2.x,
                    end2.y - start2.y,
                    (end2.z ?? 0) - (start2.z ?? 0),
                    v1.x,
                    v1.y,
                    v1.z
                )

                if ('startRay' in shape2) {
                    if (Math.abs(dotProduct2) < epsilon || (dotProduct2 < 0 && Math.abs(dotProduct2) > epsilon)) {
                        return [
                            {
                                coors: {
                                    x: A[0].valueOf() as number,
                                    y: A[1].valueOf() as number,
                                    z: A.length === 2 ? A[2].valueOf() as number : 0
                                },

                                ambiguous: true
                            }
                        ]
                    }
                }

                else if ('startSegment' in shape2) {
                    if (Math.abs(dotProduct2) < epsilon || (dotProduct2 < 0 && Math.abs(dotProduct2) > epsilon)) {
                        return [
                            {
                                coors: {
                                    x: A[0].valueOf() as number,
                                    y: A[1].valueOf() as number,
                                    z: A.length === 2 ? A[2].valueOf() as number : 0
                                },

                                ambiguous: true
                            }
                        ]
                    }

                    if (L2_norm(v1.x, v1.y, v1.z) > L2_norm(end2.x - start2.x, end2.y - start2.y, (end2.z ?? 0) - (start2.z ?? 0))) {
                        return [
                            {
                                coors: {
                                    x: A[0].valueOf() as number,
                                    y: A[1].valueOf() as number,
                                    z: A.length === 2 ? A[2].valueOf() as number : 0
                                },

                                ambiguous: true
                            }
                        ]
                    }
                }

                return [
                    {
                        coors: {
                            x: A[0].valueOf() as number,
                            y: A[1].valueOf() as number,
                            z: A.length === 2 ? A[2].valueOf() as number : 0
                        },

                        ambiguous: false
                    }
                ]
            }
        }
        
        else if ('centerC' in shape2 && 'radius' in shape2) {
            let circle: GeometryShape.Circle = shape2 as GeometryShape.Circle
            let u = {
                x: end.x - start.x,
                y: end.y - start.y,
                z: (end.z ?? 0) - (start.z ?? 0)
            }

            let u1 = {
                x: circle.centerC.x - start.x,
                y: circle.centerC.y - start.y,
                z: (circle.centerC.z ?? 0) - (start.z ?? 0)
            }

            // Solve ||u1 - u * t||^2 = r^2
            const r = circle.radius;
            const a = dot(u.x, u.y, u.z, u.x, u.y, u.z);
            const b = -2 * dot(u1.x, u1.y, u1.z, u.x, u.y, u.z);
            const c = dot(u1.x, u1.y, u1.z, u1.x, u1.y, u1.z) - r * r;
            let discriminant = b * b - 4 * a * c;
            if (Math.abs(discriminant) < epsilon) {
                discriminant = 0;
            }

            if (discriminant < 0) {
                return [
                    {
                        coors: undefined,
                        ambiguous: false
                    },
                    {
                        coors: undefined,
                        ambiguous: false
                    }
                ]
            }

            else if (discriminant === 0) {
                let t = -b / (2 * a);
                if (
                    ('startRay' in shape1 && (t < 0 && Math.abs(t) > 0)) ||
                    ('startSegment' in shape1 && ((t < 0 && Math.abs(t) > 0) || (t > 1 && Math.abs(t - 1) > 0)))
                ) {
                    return [
                        {
                            coors: {
                                x: start.x + u.x * t,
                                y: start.y + u.y * t,
                                z: (start.z ?? 0) + u.z * t
                            },

                            ambiguous: true
                        },
                        {
                            coors: {
                                x: start.x + u.x * t,
                                y: start.y + u.y * t,
                                z: (start.z ?? 0) + u.z * t
                            },

                            ambiguous: true
                        }
                    ]
                }

                return [
                    {
                        coors: {
                            x: start.x + u.x * t,
                            y: start.y + u.y * t,
                            z: (start.z ?? 0) + u.z * t
                        },

                        ambiguous: false
                    },
                    {
                        coors: {
                            x: start.x + u.x * t,
                            y: start.y + u.y * t,
                            z: (start.z ?? 0) + u.z * t
                        },

                        ambiguous: true
                    }
                ]
            }

            else {
                const t1 = (-b - symbolicSqrt(discriminant)) / (2 * a);
                const t2 = (-b + symbolicSqrt(discriminant)) / (2 * a);
                if ('startRay' in shape1) {
                    return [
                        {
                            coors: {
                                x: start.x + u.x * t1,
                                y: start.y + u.y * t1,
                                z: (start.z ?? 0) + u.z * t1
                            },

                            ambiguous: t1 < 0 && Math.abs(t1) > epsilon
                        },
                        {
                            coors: {
                                x: start.x + u.x * t2,
                                y: start.y + u.y * t2,
                                z: (start.z ?? 0) + u.z * t2
                            },

                            ambiguous: t2 < 0 && Math.abs(t2) > epsilon
                        }
                    ]
                }

                else if ('startSegment' in shape1) {
                    return [
                        {
                            coors: {
                                x: start.x + u.x * t1,
                                y: start.y + u.y * t1,
                                z: (start.z ?? 0) + u.z * t1
                            },

                            ambiguous: (t1 < 0 && Math.abs(t1) > epsilon) || (t1 > 1 && Math.abs(t1 - 1) > epsilon)
                        },
                        {
                            coors: {
                                x: start.x + u.x * t2,
                                y: start.y + u.y * t2,
                                z: (start.z ?? 0) + u.z * t2
                            },

                            ambiguous: (t2 < 0 && Math.abs(t2) > epsilon) || (t2 > 1 && Math.abs(t2 - 1) > epsilon)
                        }
                    ]
                }

                return [
                    {
                        coors: {
                            x: start.x + u.x * t1,
                            y: start.y + u.y * t1,
                            z: (start.z ?? 0) + u.z * t1
                        },

                        ambiguous: false
                    },
                    {
                        coors: {
                            x: start.x + u.x * t2,
                            y: start.y + u.y * t2,
                            z: (start.z ?? 0) + u.z * t2
                        },

                        ambiguous: false
                    }
                ]
            }
        }

        else if ('points' in shape2) {
            let poly: GeometryShape.Polygon = shape2 as GeometryShape.Polygon;
            let intersections: {coors: {x: number, y: number, z: number} | undefined, ambiguous: boolean}[] = [];
            for (let i = 0; i < poly.points.length; i++) {
                let point1 = poly.points[i];
                let point2 = poly.points[(i + 1) % poly.points.length];

                let A = math.intersect(
                    [point1.x, point1.y, point1.z ?? 0],
                    [point2.x, point2.y, point2.z ?? 0],
                    [start.x, start.y, start.z ?? 0],
                    [end.x, end.y, end.z ?? 0]
                )

                if (A === null) continue;
                let v = {
                    x: A[0].valueOf() as number - start.x,
                    y: A[1].valueOf() as number - start.y,
                    z: (A.length === 2 ? 0 : A[2].valueOf() as number) - (start.z ?? 0)
                }

                let dotProduct = dot(v.x, v.y, v.z, end.x - start.x, end.y - start.y, (end.z ?? 0) - (start.z ?? 0));
                if ('startRay' in shape1) {
                    if (Math.abs(dotProduct) < epsilon || (dotProduct < 0 && Math.abs(dotProduct) > epsilon)) {
                        continue;
                    }

                    let v1 = {
                        x: A[0].valueOf() as number - point1.x,
                        y: A[1].valueOf() as number - point1.y,
                        z: (A.length === 2 ? 0 : A[2].valueOf() as number) - (point1.z ?? 0)
                    }

                    let dotProduct2 = dot(
                        point2.x - point1.x,
                        point2.y - point1.y,
                        (point2.z ?? 0) - (point1.z ?? 0),
                        v1.x,
                        v1.y,
                        v1.z
                    )

                    if (Math.abs(dotProduct2) < epsilon || (dotProduct2 < 0 && Math.abs(dotProduct2) > epsilon)) {
                        continue;
                    }

                    if (L2_norm(v1.x, v1.y, v1.z) > L2_norm(point2.x - point1.x, point2.y - point1.y, (point2.z ?? 0) - (point1.z ?? 0))) {
                        continue;
                    }

                    intersections.push(
                        {
                            coors: {
                                x: A[0].valueOf() as number,
                                y: A[1].valueOf() as number,
                                z: A.length === 2 ? A[2].valueOf() as number : 0
                            },

                            ambiguous: false
                        }
                    )
                }

                else if ('startSegment' in shape1) {
                    if (Math.abs(dotProduct) < epsilon || (dotProduct < 0 && Math.abs(dotProduct) > epsilon)) {
                        continue;
                    }

                    if (L2_norm(v.x, v.y, v.z) > L2_norm(end.x - start.x, end.y - start.y, (end.z ?? 0) - (start.z ?? 0))) {
                        continue;
                    }

                    let v1 = {
                        x: A[0].valueOf() as number - point1.x,
                        y: A[1].valueOf() as number - point1.y,
                        z: (A.length === 2 ? 0 : A[2].valueOf() as number) - (point1.z ?? 0)
                    }

                    let dotProduct2 = dot(
                        point2.x - point1.x,
                        point2.y - point1.y,
                        (point2.z ?? 0) - (point1.z ?? 0),
                        v1.x,
                        v1.y,
                        v1.z
                    )

                    if (Math.abs(dotProduct2) < epsilon || (dotProduct2 < 0 && Math.abs(dotProduct2) > epsilon)) {
                        continue;
                    }

                    if (L2_norm(v1.x, v1.y, v1.z) > L2_norm(point2.x - point1.x, point2.y - point1.y, (point2.z ?? 0) - (point1.z ?? 0))) {
                        continue;
                    }

                    intersections.push(
                        {
                            coors: {
                                x: A[0].valueOf() as number,
                                y: A[1].valueOf() as number,
                                z: A.length === 2 ? A[2].valueOf() as number : 0
                            },

                            ambiguous: false
                        }
                    )
                }

                else {
                    let v1 = {
                        x: A[0].valueOf() as number - point1.x,
                        y: A[1].valueOf() as number - point1.y,
                        z: (A.length === 2 ? 0 : A[2].valueOf() as number) - (point1.z ?? 0)
                    }

                    let dotProduct2 = dot(
                        point2.x - point1.x,
                        point2.y - point1.y,
                        (point2.z ?? 0) - (point1.z ?? 0),
                        v1.x,
                        v1.y,
                        v1.z
                    )

                    if (Math.abs(dotProduct2) < epsilon || (dotProduct2 < 0 && Math.abs(dotProduct2) > epsilon)) {
                        continue;
                    }

                    if (L2_norm(v1.x, v1.y, v1.z) > L2_norm(point2.x - point1.x, point2.y - point1.y, (point2.z ?? 0) - (point1.z ?? 0))) {
                        continue;
                    }

                    intersections.push(
                        {
                            coors: {
                                x: A[0].valueOf() as number,
                                y: A[1].valueOf() as number,
                                z: A.length === 2 ? A[2].valueOf() as number : 0
                            },

                            ambiguous: false
                        }
                    )
                }
            }

            return intersections;
        }

        else if ('start' in shape2 && 'end' in shape2) {
            const semi = shape2 as GeometryShape.SemiCircle;
            const check = (
                A: {x: number, y: number},
                B: {x: number, y: number},
                P: {x: number, y: number}
            ): boolean => {
                let O = {
                    x: (A.x + B.x) / 2,
                    y: (A.y + B.y) / 2
                }

                let AO = {
                    x: O.x - A.x,
                    y: O.y - A.y,
                }

                let BO = {
                    x: O.x - B.x,
                    y: O.y - B.y,
                }

                let PO = {
                    x: O.x - P.x,
                    y: O.y - P.y,
                }

                const angle = (x: number, y: number): number => {
                    let degree = (math.parse('atan2(y, x)').evaluate({x: x, y: y})) * 180 / Math.PI;
                    if (degree < 0) {
                        degree += 360;
                    }

                    return degree;
                }

                const angleA = angle(AO.x, AO.y);
                const angleB = angle(BO.x, BO.y);
                const angleP = angle(PO.x, PO.y);
                return angleA > angleB
                    ? (angleP <= angleA && angleP >= angleB)
                    : (angleP <= angleA || angleP >= angleB);
            }

            let u = {
                x: end.x - start.x,
                y: end.y - start.y,
                z: (end.z ?? 0) - (start.z ?? 0)
            }

            let u1 = {
                x: (semi.start.x + semi.end.x) / 2 - start.x,
                y: (semi.start.y + semi.end.y) / 2 - start.y,
                z: ((semi.start.z ?? 0 + (semi.end.z ?? 0)) / 2) - (start.z ?? 0)
            }

            // Solve ||u1 - u * t||^2 = r^2
            const r = symbolicSqrt(Math.pow(semi.end.x - semi.start.x, 2) + Math.pow(semi.end.y - semi.start.y, 2)) / 2;
            const a = dot(u.x, u.y, u.z, u.x, u.y, u.z);
            const b = -2 * dot(u1.x, u1.y, u1.z, u.x, u.y, u.z);
            const c = dot(u1.x, u1.y, u1.z, u1.x, u1.y, u1.z) - r * r;
            let discriminant = b * b - 4 * a * c;
            if (Math.abs(discriminant) < epsilon) {
                discriminant = 0;
            }

            if (discriminant < 0) {
                return [
                    {
                        coors: undefined,
                        ambiguous: false
                    },
                    {
                        coors: undefined,
                        ambiguous: false
                    }
                ]
            }

            else if (discriminant === 0) {
                let t = -b / (2 * a);
                if (
                    ('startRay' in shape1 && (t < 0 && Math.abs(t) > 0)) ||
                    ('startSegment' in shape1 && ((t < 0 && Math.abs(t) > 0) || (t > 1 && Math.abs(t - 1) > 0)))
                ) {
                    return [
                        {
                            coors: {
                                x: start.x + u.x * t,
                                y: start.y + u.y * t,
                                z: (start.z ?? 0) + u.z * t
                            },

                            ambiguous: true
                        },
                        {
                            coors: {
                                x: start.x + u.x * t,
                                y: start.y + u.y * t,
                                z: (start.z ?? 0) + u.z * t
                            },

                            ambiguous: true
                        }
                    ]
                }

                return [
                    {
                        coors: {
                            x: start.x + u.x * t,
                            y: start.y + u.y * t,
                            z: (start.z ?? 0) + u.z * t
                        },

                        ambiguous: check(
                            {x: semi.start.x, y: semi.start.y},
                            {x: semi.end.x, y: semi.end.y},
                            {x: start.x + u.x * t, y: start.y + u.y * t}
                        )
                    },
                    {
                        coors: {
                            x: start.x + u.x * t,
                            y: start.y + u.y * t,
                            z: (start.z ?? 0) + u.z * t
                        },

                        ambiguous: check(
                            {x: semi.start.x, y: semi.start.y},
                            {x: semi.end.x, y: semi.end.y},
                            {x: start.x + u.x * t, y: start.y + u.y * t}
                        )
                    }
                ]
            }

            else {
                const t1 = (-b - symbolicSqrt(discriminant)) / (2 * a);
                const t2 = (-b + symbolicSqrt(discriminant)) / (2 * a);
                if ('startRay' in shape1) {
                    return [
                        {
                            coors: {
                                x: start.x + u.x * t1,
                                y: start.y + u.y * t1,
                                z: (start.z ?? 0) + u.z * t1
                            },

                            ambiguous: t1 < 0 && Math.abs(t1) > epsilon && check(
                                {x: semi.start.x, y: semi.start.y},
                                {x: semi.end.x, y: semi.end.y},
                                {x: start.x + u.x * t1, y: start.y + u.y * t1}
                            )
                        },
                        {
                            coors: {
                                x: start.x + u.x * t2,
                                y: start.y + u.y * t2,
                                z: (start.z ?? 0) + u.z * t2
                            },

                            ambiguous: t2 < 0 && Math.abs(t2) > epsilon && check(
                                {x: semi.start.x, y: semi.start.y},
                                {x: semi.end.x, y: semi.end.y},
                                {x: start.x + u.x * t2, y: start.y + u.y * t2}
                            )
                        }
                    ]
                }

                else if ('startSegment' in shape1) {
                    return [
                        {
                            coors: {
                                x: start.x + u.x * t1,
                                y: start.y + u.y * t1,
                                z: (start.z ?? 0) + u.z * t1
                            },

                            ambiguous: ((t1 < 0 && Math.abs(t1) > epsilon) || (t1 > 1 && Math.abs(t1 - 1) > epsilon)) && check(
                                {x: semi.start.x, y: semi.start.y},
                                {x: semi.end.x, y: semi.end.y},
                                {x: start.x + u.x * t1, y: start.y + u.y * t1}
                            )
                        },
                        {
                            coors: {
                                x: start.x + u.x * t2,
                                y: start.y + u.y * t2,
                                z: (start.z ?? 0) + u.z * t2
                            },

                            ambiguous: ((t2 < 0 && Math.abs(t2) > epsilon)  || (t2 > 1 && Math.abs(t2 - 1) > epsilon)) && check(
                                {x: semi.start.x, y: semi.start.y},
                                {x: semi.end.x, y: semi.end.y},
                                {x: start.x + u.x * t2, y: start.y + u.y * t2}
                            )
                        }
                    ]
                }

                return [
                    {
                        coors: {
                            x: start.x + u.x * t1,
                            y: start.y + u.y * t1,
                            z: (start.z ?? 0) + u.z * t1
                        },

                        ambiguous: check(
                            {x: semi.start.x, y: semi.start.y},
                            {x: semi.end.x, y: semi.end.y},
                            {x: start.x + u.x * t1, y: start.y + u.y * t1}
                        )
                    },
                    {
                        coors: {
                            x: start.x + u.x * t2,
                            y: start.y + u.y * t2,
                            z: (start.z ?? 0) + u.z * t2
                        },

                        ambiguous: check(
                            {x: semi.start.x, y: semi.start.y},
                            {x: semi.end.x, y: semi.end.y},
                            {x: start.x + u.x * t2, y: start.y + u.y * t2}
                        )
                    }
                ]
            }
        }

        else {
            throw new Error('Shape2 must be a valid shape for intersection');
        }
    }

    else if ('centerC' in shape1 && 'radius' in shape1) {
        if (('startLine' in shape2) || ('startRay' in shape2) || ('startSegment' in shape2)) {
            return getIntersections2D(shape2, shape1);
        }

        let circle1: GeometryShape.Circle = shape1 as GeometryShape.Circle

        if ('centerC' in shape2 && 'radius' in shape2) {
            let circle2: GeometryShape.Circle = shape2 as GeometryShape.Circle
            // Two circles intersection
            let d = getDistance(circle1.centerC, circle2.centerC);
            if (d < epsilon && Math.abs(circle1.radius - circle2.radius) < epsilon) {
                return [
                    {
                        coors: undefined,
                        ambiguous: true
                    },
                    {
                        coors: undefined,
                        ambiguous: true
                    }
                ]
            }

            if (d < epsilon) {
                return [
                    {
                        coors: undefined,
                        ambiguous: false
                    },
                    {
                        coors: undefined,
                        ambiguous: false
                    }
                ]
            }
            
            if ((d > circle1.radius + circle2.radius && Math.abs(circle1.radius + circle2.radius - d) > epsilon) || 
                (d < Math.abs(circle1.radius - circle2.radius) && Math.abs(d - Math.abs(circle1.radius - circle2.radius)) > epsilon)) {
                return [
                    {
                        coors: undefined,
                        ambiguous: false
                    },
                    {
                        coors: undefined,
                        ambiguous: false
                    }
                ]
            }

            let a = (circle1.radius ** 2 - circle2.radius ** 2 + d ** 2) / (2 * d);
            let h = symbolicSqrt(Math.abs(circle1.radius ** 2 - a ** 2));
            let p = {
                x: circle1.centerC.x + a * (circle2.centerC.x - circle1.centerC.x) / d,
                y: circle1.centerC.y + a * (circle2.centerC.y - circle1.centerC.y) / d,
                z: (circle1.centerC.z ?? 0) + a * ((circle2.centerC.z ?? 0) - (circle1.centerC.z ?? 0)) / d
            };

            if (h < epsilon) {
                return [
                    {
                        coors: p,
                        ambiguous: false
                    },
                    {
                        coors: p,
                        ambiguous: true
                    }
                ]
            }

            return [
                {
                    coors: {
                        x: p.x + h * (circle2.centerC.y - circle1.centerC.y) / d,
                        y: p.y - h * (circle2.centerC.x - circle1.centerC.x) / d,
                        z: (p.z ?? 0) + h * ((circle2.centerC.z ?? 0) - (circle1.centerC.z ?? 0)) / d
                    },
                    ambiguous: false
                },
                {
                    coors: {
                        x: p.x - h * (circle2.centerC.y - circle1.centerC.y) / d,
                        y: p.y + h * (circle2.centerC.x - circle1.centerC.x) / d,
                        z: (p.z ?? 0) - h * ((circle2.centerC.z ?? 0) - (circle1.centerC.z ?? 0)) / d
                    },
                    ambiguous: false
                }
            ];
        }

        else {
            throw new Error('Shape2 must be a valid shape for intersection');
        }
    }

    else if ('points' in shape1) {
        if (('startLine' in shape2) || ('startRay' in shape2) || ('startSegment' in shape2)) {
            return getIntersections2D(shape2, shape1);
        }

        else {
            throw new Error('Shape2 must be a valid shape for intersection');
        }
    }

    else if ('start' in shape1 && 'end' in shape1) {
        if (('startLine' in shape2) || ('startRay' in shape2) || ('startSegment' in shape2)) {
            return getIntersections2D(shape2, shape1);
        }

        const check = (
            A: {x: number, y: number},
            B: {x: number, y: number},
            P: {x: number, y: number}
        ): boolean => {
            let O = {
                x: (A.x + B.x) / 2,
                y: (A.y + B.y) / 2
            }

            let AO = {
                x: O.x - A.x,
                y: O.y - A.y,
            }

            let BO = {
                x: O.x - B.x,
                y: O.y - B.y,
            }

            let PO = {
                x: O.x - P.x,
                y: O.y - P.y,
            }

            const angle = (x: number, y: number): number => {
                let degree = (math.parse('atan2(y, x)').evaluate({x: x, y: y})) * 180 / Math.PI;
                if (degree < 0) {
                    degree += 360;
                }

                return degree;
            }

            const angleA = angle(AO.x, AO.y);
            const angleB = angle(BO.x, BO.y);
            const angleP = angle(PO.x, PO.y);
            return angleA > angleB
                ? (angleP <= angleA && angleP >= angleB)
                : (angleP <= angleA || angleP >= angleB);
        }

        if ('centerC' in shape2 && 'radius' in shape2) {
            let circle2: GeometryShape.Circle = shape2 as GeometryShape.Circle
            let center1 = {
                x: (shape1.start.x + shape1.end.x) / 2,
                y: (shape1.start.y + shape1.end.y) / 2,
                z: ((shape1.start.z ?? 0) + (shape1.end.z ?? 0)) / 2
            };

            let d = symbolicSqrt(Math.pow(center1.x - circle2.centerC.x, 2) + Math.pow(center1.y - circle2.centerC.y, 2) + Math.pow(center1.z - (circle2.centerC.z ?? 0), 2));
            let r = symbolicSqrt(Math.pow(center1.x - shape1.start.x, 2) + Math.pow(center1.y - shape1.end.y, 2) + Math.pow(center1.z - (shape1.end.z ?? 0), 2));
            if (d < epsilon && Math.abs(r - circle2.radius) < epsilon) {
                return [
                    {
                        coors: undefined,
                        ambiguous: true
                    },
                    {
                        coors: undefined,
                        ambiguous: true
                    }
                ]
            }

            if (d < epsilon) {
                return [
                    {
                        coors: undefined,
                        ambiguous: false
                    },
                    {
                        coors: undefined,
                        ambiguous: false
                    }
                ]
            }
            
            if ((d > r + circle2.radius && Math.abs(r + circle2.radius - d) > epsilon) || 
                (d < Math.abs(r - circle2.radius) && Math.abs(d - Math.abs(r - circle2.radius)) > epsilon)) {
                return [
                    {
                        coors: undefined,
                        ambiguous: false
                    },
                    {
                        coors: undefined,
                        ambiguous: false
                    }
                ]
            }

            let a = (r ** 2 - circle2.radius ** 2 + d ** 2) / (2 * d);
            let h = symbolicSqrt(Math.abs(r ** 2 - a ** 2));
            let p = {
                x: center1.x + a * (circle2.centerC.x - center1.x) / d,
                y: center1.y + a * (circle2.centerC.y - center1.y) / d,
                z: (center1.z ?? 0) + a * ((center1.z ?? 0) - (center1.z ?? 0)) / d
            };

            if (h < epsilon) {
                return [
                    {
                        coors: p,
                        ambiguous: check(
                            {x: shape1.start.x, y: shape1.start.y},
                            {x: shape1.end.x, y: shape1.end.y},
                            {x: center1.x + a * (circle2.centerC.x - center1.x) / d, y: center1.y + a * (circle2.centerC.y - center1.y) / d}
                        )
                    },
                    {
                        coors: p,
                        ambiguous: true
                    }
                ]
            }

            return [
                {
                    coors: {
                        x: p.x + h * (circle2.centerC.y - center1.y) / d,
                        y: p.y - h * (circle2.centerC.x - center1.x) / d,
                        z: (p.z ?? 0) + h * ((circle2.centerC.z ?? 0) - (center1.z ?? 0)) / d
                    },
                    ambiguous: check(
                        {x: shape1.start.x, y: shape1.start.y},
                        {x: shape1.end.x, y: shape1.end.y},
                        {x: p.x + h * (circle2.centerC.y - center1.y) / d, y: p.y - h * (circle2.centerC.x - center1.x) / d}
                    )
                },
                {
                    coors: {
                        x: p.x - h * (circle2.centerC.y - center1.y) / d,
                        y: p.y + h * (circle2.centerC.x - center1.x) / d,
                        z: (p.z ?? 0) - h * ((circle2.centerC.z ?? 0) - (center1.z ?? 0)) / d
                    },
                    ambiguous: check(
                        {x: shape1.start.x, y: shape1.start.y},
                        {x: shape1.end.x, y: shape1.end.y},
                        {x: p.x - h * (circle2.centerC.y - center1.y) / d, y: p.y + h * (circle2.centerC.x - center1.x) / d}
                    )
                }
            ];
        }

        else if ('start' in shape2 && 'end' in shape2) {
            let center1 = {
                x: (shape1.start.x + shape1.end.x) / 2,
                y: (shape1.start.y + shape1.end.y) / 2,
                z: ((shape1.start.z ?? 0) + (shape1.end.z ?? 0)) / 2
            };

            let center2 = {
                x: (shape2.start.x + shape2.end.x) / 2,
                y: (shape2.start.y + shape2.end.y) / 2,
                z: ((shape2.start.z ?? 0) + (shape2.end.z ?? 0)) / 2
            }

            let d = symbolicSqrt(Math.pow(center1.x - center2.x, 2) + Math.pow(center1.y - center2.y, 2) + Math.pow(center1.z - (center2.z ?? 0), 2));
            let r1 = symbolicSqrt(Math.pow(center1.x - shape1.start.x, 2) + Math.pow(center1.y - shape1.end.y, 2) + Math.pow(center1.z - (shape1.end.z ?? 0), 2));
            let r2 = symbolicSqrt(Math.pow(center2.x - shape2.start.x, 2) + Math.pow(center2.y - shape2.end.y, 2) + Math.pow(center2.z - (shape2.end.z ?? 0), 2));
            if (d < epsilon && Math.abs(r1 - r2) < epsilon) {
                return [
                    {
                        coors: undefined,
                        ambiguous: true
                    },
                    {
                        coors: undefined,
                        ambiguous: true
                    }
                ]
            }

            if (d < epsilon) {
                return [
                    {
                        coors: undefined,
                        ambiguous: false
                    },
                    {
                        coors: undefined,
                        ambiguous: false
                    }
                ]
            }
            
            if ((d > r1 + r2 && Math.abs(r1 + r2 - d) > epsilon) || 
                (d < Math.abs(r1 - r2) && Math.abs(d - Math.abs(r1 - r2)) > epsilon)) {
                return [
                    {
                        coors: undefined,
                        ambiguous: false
                    },
                    {
                        coors: undefined,
                        ambiguous: false
                    }
                ]
            }

            let a = (r1 ** 2 - r2 ** 2 + d ** 2) / (2 * d);
            let h = symbolicSqrt(Math.abs(r1 ** 2 - a ** 2));
            let p = {
                x: center1.x + a * (center2.x - center1.x) / d,
                y: center1.y + a * (center2.y - center1.y) / d,
                z: (center1.z ?? 0) + a * ((center1.z ?? 0) - (center1.z ?? 0)) / d
            };

            if (h < epsilon) {
                return [
                    {
                        coors: p,
                        ambiguous: check(
                            {x: shape1.start.x, y: shape1.start.y},
                            {x: shape1.end.x, y: shape1.end.y},
                            {x: center1.x + a * (center2.x - center1.x) / d, y: center1.y + a * (center2.y - center1.y) / d}
                        ) && check(
                            {x: shape2.start.x, y: shape2.start.y},
                            {x: shape2.end.x, y: shape2.end.y},
                            {x: center1.x + a * (center2.x - center1.x) / d, y: center1.y + a * (center2.y - center1.y) / d}
                        )
                    },
                    {
                        coors: p,
                        ambiguous: true
                    }
                ]
            }

            return [
                {
                    coors: {
                        x: p.x + h * (center2.y - center1.y) / d,
                        y: p.y - h * (center2.x - center1.x) / d,
                        z: (p.z ?? 0) + h * ((center2.z ?? 0) - (center1.z ?? 0)) / d
                    },
                    ambiguous: check(
                        {x: shape1.start.x, y: shape1.start.y},
                        {x: shape1.end.x, y: shape1.end.y},
                        {x: p.x + h * (center2.y - center1.y) / d, y: p.y - h * (center2.x - center1.x) / d}
                    ) && check(
                        {x: shape2.start.x, y: shape2.start.y},
                        {x: shape2.end.x, y: shape2.end.y},
                        {x: p.x + h * (center2.y - center1.y) / d, y: p.y - h * (center2.x - center1.x) / d}
                    )
                },
                {
                    coors: {
                        x: p.x - h * (center2.y - center1.y) / d,
                        y: p.y + h * (center2.x - center1.x) / d,
                        z: (p.z ?? 0) - h * ((center2.z ?? 0) - (center1.z ?? 0)) / d
                    },
                    ambiguous: check(
                        {x: shape1.start.x, y: shape1.start.y},
                        {x: shape1.end.x, y: shape1.end.y},
                        {x: p.x - h * (center2.y - center1.y) / d, y: p.y + h * (center2.x - center1.x) / d}
                    ) && check(
                        {x: shape2.start.x, y: shape2.start.y},
                        {x: shape2.end.x, y: shape2.end.y},
                        {x: p.x - h * (center2.y - center1.y) / d, y: p.y + h * (center2.x - center1.x) / d}
                    )
                }
            ];
        }

        else {
            throw new Error('Shape2 must be a valid shape for intersection');
        }
    }

    else {
        throw new Error('Shape1 must be a valid shape for intersection');
    }
}

export const getIntersections3D = (shape1: GeometryShape.Shape, shape2: GeometryShape.Shape): {coors: {x: number, y: number, z: number} | undefined, ambiguous: boolean}[] => {
    if (!('startSegment' in shape1 || 'startRay' in shape1 || 'startLine' in shape1 || ('point' in shape1 && 'norm' in shape1) || ('centerS' in shape1 && 'radius' in shape1))) {
        throw new Error('Shape1 must be a valid shape for intersection');
    }

    if (!(['Segment', 'Line', 'Ray', 'Plane', 'Sphere'].includes(shape2.type))) {
        throw new Error('Shape2 must be a valid shape for intersection');
    }

    if (('startSegment' in shape1) || ('startRay' in shape1) || ('startLine' in shape1)) {
        if (('startLine' in shape2) || ('startRay' in shape2) || ('startSegment' in shape2)) {
            return getIntersections2D(shape1, shape2);
        }

        let [start, end] = getStartAndEnd(shape1);

        let u = {
            x: end.x - start.x,
            y: end.y - start.y,
            z: (end.z ?? 0) - (start.z ?? 0)
        }

        if ('point' in shape2 && 'norm' in shape2) {
            let pl: GeometryShape.Plane = shape2 as GeometryShape.Plane
            let n = {
                x: pl.norm.endVector.x - pl.norm.startVector.x,
                y: pl.norm.endVector.y - pl.norm.startVector.y,
                z: (pl.norm.endVector.z ?? 0) - (pl.norm.startVector.z ?? 0),
            }

            let A = math.intersect(
                [start.x, start.y, (start.z ?? 0)],
                [end.x, end.y, (end.z ?? 0)],
                [n.x, n.y, n.z, n.x * pl.point.x, n.y * pl.point.y, n.z * (pl.point.z ?? 0)]
            )

            if (A === null) {
                if (Math.abs(n.x * (pl.point.x - start.x) + n.y * (pl.point.y - start.y) + n.z * ((pl.point.z ?? 0 - (start.z ?? 0)))) < epsilon) {
                    return [
                        {
                            coors: undefined,
                            ambiguous: true
                        }
                    ]
                }

                return [
                    {
                        coors: undefined,
                        ambiguous: false
                    }
                ]
            }

            let v = {
                x: A[0].valueOf() as number - start.x,
                y: A[1].valueOf() as number - start.y,
                z: (A.length === 2 ? 0 : A[2].valueOf() as number) - (start.z ?? 0)
            }

            let dotProduct2 = dot(
                end.x - start.x,
                end.y - start.y,
                (end.z ?? 0) - (start.z ?? 0),
                v.x,
                v.y,
                v.z
            )

            if ('startRay' in shape1) {
                if (Math.abs(dotProduct2) < epsilon || (dotProduct2 < 0 && Math.abs(dotProduct2) > epsilon)) {
                    return [
                        {
                            coors: {
                                x: A[0].valueOf() as number,
                                y: A[1].valueOf() as number,
                                z: A.length === 2 ? A[2].valueOf() as number : 0
                            },

                            ambiguous: true
                        }
                    ]
                }
            }

            else if ('startSegment' in shape1) {
                if (Math.abs(dotProduct2) < epsilon || (dotProduct2 < 0 && Math.abs(dotProduct2) > epsilon)) {
                    return [
                        {
                            coors: {
                                x: A[0].valueOf() as number,
                                y: A[1].valueOf() as number,
                                z: A.length === 2 ? A[2].valueOf() as number : 0
                            },

                            ambiguous: true
                        }
                    ]
                }

                if (L2_norm(v.x, v.y, v.z) > L2_norm(end.x - start.x, end.y - start.y, (end.z ?? 0) - (start.z ?? 0))) {
                    return [
                        {
                            coors: {
                                x: A[0].valueOf() as number,
                                y: A[1].valueOf() as number,
                                z: A.length === 2 ? A[2].valueOf() as number : 0
                            },

                            ambiguous: true
                        }
                    ]
                }
            }

            return [
                {
                    coors: {
                        x: A[0].valueOf() as number,
                        y: A[1].valueOf() as number,
                        z: A.length === 2 ? A[2].valueOf() as number : 0
                    },

                    ambiguous: false
                }
            ]
        }

        else if ('centerS' in shape2 && 'radius' in shape2) {
            // Sphere intersection with line
            let sp: GeometryShape.Sphere = shape2 as GeometryShape.Sphere
            let u1 = {
                x: sp.centerS.x - start.x,
                y: sp.centerS.y - start.y,
                z: (sp.centerS.z ?? 0) - (start.z ?? 0)
            }

            // Solve ||u1 - u * t||^2 = r^2
            const r = sp.radius;
            const a = dot(u.x, u.y, u.z, u.x, u.y, u.z);
            const b = -2 * dot(u1.x, u1.y, u1.z, u.x, u.y, u.z);
            const c = dot(u1.x, u1.y, u1.z, u1.x, u1.y, u1.z) - r * r;
            let discriminant = b * b - 4 * a * c;
            if (Math.abs(discriminant) < epsilon) {
                discriminant = 0;
            }

            if (discriminant < 0) {
                return [
                    {
                        coors: undefined,
                        ambiguous: false
                    }
                ]
            }

            else if (discriminant === 0) {
                let t = -b / (2 * a);
                if (
                    ('startRay' in shape1 && (t < 0 && Math.abs(t) > 0)) ||
                    ('startSegment' in shape1 && ((t < 0 && Math.abs(t) > 0) || (t > 1 && Math.abs(t - 1) > 0)))
                ) {
                    return [
                        {
                            coors: {
                                x: start.x + u.x * t,
                                y: start.y + u.y * t,
                                z: (start.z ?? 0) + u.z * t
                            },

                            ambiguous: true
                        }
                    ]
                }

                return [
                    {
                        coors: {
                            x: start.x + u.x * t,
                            y: start.y + u.y * t,
                            z: (start.z ?? 0) + u.z * t
                        },

                        ambiguous: false
                    }
                ]
            }

            else {
                const t1 = (-b - symbolicSqrt(discriminant)) / (2 * a);
                const t2 = (-b + symbolicSqrt(discriminant)) / (2 * a);
                if ('startRay' in shape1) {
                    return [
                        {
                            coors: {
                                x: start.x + u.x * t1,
                                y: start.y + u.y * t1,
                                z: (start.z ?? 0) + u.z * t1
                            },

                            ambiguous: t1 < 0 && Math.abs(t1) > epsilon
                        },
                        {
                            coors: {
                                x: start.x + u.x * t2,
                                y: start.y + u.y * t2,
                                z: (start.z ?? 0) + u.z * t2
                            },

                            ambiguous: t2 < 0 && Math.abs(t2) > epsilon
                        }
                    ]
                }

                else if ('startSegment' in shape1) {
                    return [
                        {
                            coors: {
                                x: start.x + u.x * t1,
                                y: start.y + u.y * t1,
                                z: (start.z ?? 0) + u.z * t1
                            },

                            ambiguous: (t1 < 0 && Math.abs(t1) > epsilon) || (t1 > 1 && Math.abs(t1 - 1) > epsilon)
                        },
                        {
                            coors: {
                                x: start.x + u.x * t2,
                                y: start.y + u.y * t2,
                                z: (start.z ?? 0) + u.z * t2
                            },

                            ambiguous: (t2 < 0 && Math.abs(t2) > epsilon)  || (t2 > 1 && Math.abs(t2 - 1) > epsilon)
                        }
                    ]
                }

                return [
                    {
                        coors: {
                            x: start.x + u.x * t1,
                            y: start.y + u.y * t1,
                            z: (start.z ?? 0) + u.z * t1
                        },

                        ambiguous: false
                    },
                    {
                        coors: {
                            x: start.x + u.x * t2,
                            y: start.y + u.y * t2,
                            z: (start.z ?? 0) + u.z * t2
                        },

                        ambiguous: false
                    }
                ]
            }
        }

        else {
            throw new Error('Shape2 must be a valid shape for intersection');
        }
    }

    else if ('point' in shape1 && 'norm' in shape1) {
        if (('startLine' in shape2) || ('startRay' in shape2) || ('startSegment' in shape2)) {
            return getIntersections3D(shape1, shape2);
        }

        return []; // Plane intersection with sphere will not be handled here
    }

    else if ('centerS' in shape1 && 'radius' in shape1) {
        if (('startLine' in shape2) || ('startRay' in shape2) || ('startSegment' in shape2)) {
            return getIntersections3D(shape1, shape2);
        }

        return []; // Sphere intersection with plane or sphere will not be handled here
    }

    else {
        throw new Error('Shape1 must be a valid shape for intersection');
    }
}

export const planeIntersection = (shape1: GeometryShape.Plane, shape2: GeometryShape.Plane) => {
    let n1 = {
        x: shape1.norm.endVector.x - shape1.norm.startVector.x,
        y: shape1.norm.endVector.y - shape1.norm.startVector.y,
        z: (shape1.norm.endVector.z ?? 0) - (shape1.norm.startVector.z ?? 0)
    }

    let n2 = {
        x: shape2.norm.endVector.x - shape2.norm.startVector.x,
        y: shape2.norm.endVector.y - shape2.norm.startVector.y,
        z: (shape2.norm.endVector.z ?? 0) - (shape2.norm.startVector.z ?? 0)
    }

    const crossProduct = cross(n1.x, n1.y, n1.z, n2.x, n2.y, n2.z);
    if (L2_norm(crossProduct.x, crossProduct.y, crossProduct.z) < epsilon) {
        // The planes are parallel or coincident
        return undefined;
    }
    
    // The planes intersect in a line
    let A =
    [
        [n1.x, n1.y, n1.z],
        [n2.x, n2.y, n2.z]
    ]

    let b = 
    [
        [n1.x * shape1.point.x + n1.y * shape1.point.y + (n1.z ?? 0) * (shape1.point.z ?? 0)],
        [n2.x * shape2.point.x + n2.y * shape2.point.y + (n2.z ?? 0) * (shape2.point.z ?? 0)]
    ]

    const A_pinv = math.pinv(A);
    const solutions = math.multiply(A_pinv, b);
    const pointOnLine = {
        x: solutions[0][0],
        y: solutions[1][0],
        z: solutions[2][0] ?? 0
    };

    return {
        startLine: pointOnLine,
        endLine: {
            x: pointOnLine.x + crossProduct.x,
            y: pointOnLine.y + crossProduct.y,
            z: (pointOnLine.z ?? 0) + crossProduct.z
        }
    }
}

export const planeIntersectionSphere = (shape1: GeometryShape.Plane, shape2: GeometryShape.Sphere) => {
    let n = {
        x: shape1.norm.endVector.x - shape1.norm.startVector.x,
        y: shape1.norm.endVector.y - shape1.norm.startVector.y,
        z: (shape1.norm.endVector.z ?? 0) - (shape1.norm.startVector.z ?? 0)
    }

    let d = Math.abs(n.x * shape2.centerS.x + n.y * shape2.centerS.y + (n.z ?? 0) * (shape2.centerS.z ?? 0) - (n.x * shape1.point.x + n.y * shape1.point.y + (n.z ?? 0) * (shape1.point.z ?? 0))) / L2_norm(n.x, n.y, n.z);
    if (d > shape2.radius) {
        return undefined; // No intersection
    }

    if (Math.abs(d - shape2.radius) < epsilon) {
        // The plane is tangent to the sphere
        let t = (n.x * shape1.point.x + n.y * shape1.point.y + (n.z ?? 0) * (shape1.point.z ?? 0) - (n.x * shape2.centerS.x + n.y * shape2.centerS.y + n.z * (shape2.centerS.z ?? 0))) / dot(n.x, n.y, n.z, n.x, n.y, n.z);
        return {
            x: shape2.centerS.x + n.x * t,
            y: shape2.centerS.y + n.y * t,
            z: (shape2.centerS.z ?? 0) + n.z * t
        }
    }

    // The plane intersects the sphere in a circle
    let t = (n.x * shape1.point.x + n.y * shape1.point.y + (n.z ?? 0) * (shape1.point.z ?? 0) - (n.x * shape2.centerS.x + n.y * shape2.centerS.y + n.z * (shape2.centerS.z ?? 0))) / dot(n.x, n.y, n.z, n.x, n.y, n.z);
    let center = {
        x: shape2.centerS.x + n.x * t,
        y: shape2.centerS.y + n.y * t,
        z: (shape2.centerS.z ?? 0) + n.z * t
    }

    let radius = symbolicSqrt(Math.abs(shape2.radius ** 2 - d ** 2));
    return {
        centerC: center,
        radius: radius,
        normal: n
    }
}

export const SphereIntersectionSphere = (shape1: GeometryShape.Sphere, shape2: GeometryShape.Sphere) => {
    let d = getDistance(shape1.centerS, shape2.centerS);
    if (d > shape1.radius + shape2.radius || d < Math.abs(shape1.radius - shape2.radius)) {
        return undefined; // No intersection
    }

    if (d < epsilon && shape1.radius === shape2.radius) {
        throw new Error('The spheres are coincident');
    }

    if (d < epsilon) {
        return undefined;
    }

    let a = (shape1.radius ** 2 - shape2.radius ** 2 + d ** 2) / (2 * d);
    let h = symbolicSqrt(Math.abs(shape1.radius ** 2 - a ** 2));
    let P = {
        x: shape1.centerS.x + a * (shape2.centerS.x - shape1.centerS.x) / d,
        y: shape1.centerS.y + a * (shape2.centerS.y - shape1.centerS.y) / d,
        z: (shape1.centerS.z ?? 0) + a * ((shape2.centerS.z ?? 0) - (shape1.centerS.z ?? 0)) / d
    }

    if (h < epsilon) {
        return P; // One intersection point
    }

    return {
        centerC: P,
        radius: h,
        normal: {
            x: (shape2.centerS.x - shape1.centerS.x) / d,
            y: (shape2.centerS.y - shape1.centerS.y) / d,
            z: ((shape2.centerS.z ?? 0) - (shape1.centerS.z ?? 0)) / d
        }
    }
}

export const midPoint = (shape1: GeometryShape.Point, shape2: GeometryShape.Point) => {
    return {
        x: (shape1.x + shape2.x) / 2,
        y: (shape1.y + shape2.y) / 2,
        z: ((shape1.z ?? 0) + (shape2.z ?? 0)) / 2
    }
}

export const centroid = (A: GeometryShape.Point, B: GeometryShape.Point, C: GeometryShape.Point) => {
    if (isCollinear(A, B, C)) {
        throw new Error('The points are collinear');
    }

    return {
        x: (A.x + B.x + C.x) / 3,
        y: (A.y + B.y + C.y) / 3,
        z: ((A.z ?? 0) + (B.z ?? 0) + (C.z ?? 0)) / 3
    };
}

export const getArea = (shape: GeometryShape.Polygon) => {
    let area = 0;

    for (let i = 0; i < shape.points.length; i++) {
        let next = (i + 1) % shape.points.length;
        area += shape.points[i].x * shape.points[next].y - shape.points[next].x * shape.points[i].y;
    }

    return Math.abs(area) / 2;
}

export const orthocenter = (A: GeometryShape.Point, B: GeometryShape.Point, C: GeometryShape.Point) => {
    if (isCollinear(A, B, C)) {
        throw new Error('The points are collinear');
    }

    const AB = {
        x: B.x - A.x,
        y: B.y - A.y,
        z: (B.z ?? 0) - (A.z ?? 0)
    }

    const AC = {
        x: C.x - A.x,
        y: C.y - A.y,
        z: (C.z ?? 0) - (A.z ?? 0)
    }

    const BC = {
        x: C.x - B.x,
        y: C.y - B.y,
        z: (C.z ?? 0) - (B.z ?? 0)
    }
    
    /** HB.AC = HC.AB = HA.BC = 0*/
    /** [B - x, B - y, B - z][AC.x, AC.y, AC.z] = 0 */
    /** [C - x, C - y, C - z][AB.x, AB.y, AB.z] = 0 */
    /** [A - x, A - y, A - z][BC.x, BC.y, BC.z] = 0 */
    const matrix = [
        [AC.x, AC.y, AC.z],
        [AB.x, AB.y, AB.z],
        [BC.x, BC.y, BC.z],
    ]

    const b = [
        AC.x * B.x + AC.y * B.y + (AC.z ?? 0) * (B.z ?? 0),
        AB.x * C.x + AB.y * C.y + (AB.z ?? 0) * (C.z ?? 0),
        BC.x * A.x + BC.y * A.y + (BC.z ?? 0) * (A.z ?? 0),
    ]

    const solution = math.lusolve(matrix, b);

    return {
        x: solution[0].valueOf() as number,
        y: solution[1].valueOf() as number,
        z: solution[2].valueOf() as number
    }
}

export const circumcenter = (A: GeometryShape.Point, B: GeometryShape.Point, C: GeometryShape.Point) => {
    if (isCollinear(A, B, C)) {
        throw new Error('The points are collinear');
    }

    if (A.z === undefined || B.z === undefined || C.z === undefined) {
        const D = 2 * (A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y));
        const Ux = (
            ((A.x ** 2 + A.y ** 2) * (B.y - C.y) +
            (B.x ** 2 + B.y ** 2) * (C.y - A.y) +
            (C.x ** 2 + C.y ** 2) * (A.y - B.y)) / D
        );

        const Uy = (
            ((A.x ** 2 + A.y ** 2) * (C.x - B.x) +
            (B.x ** 2 + B.y ** 2) * (A.x - C.x) +
            (C.x ** 2 + C.y ** 2) * (B.x - A.x)) / D
        );

        return { x: Ux, y: Uy };
    }

    else {
        const vec = (p1: GeometryShape.Point, p2: GeometryShape.Point) => ({
            x: p2.x - p1.x,
            y: p2.y - p1.y,
            z: (p2.z ?? 0) - (p1.z ?? 0),
        });

        const mid = (p1: GeometryShape.Point, p2: GeometryShape.Point) => ({
            x: (p1.x + p2.x) / 2,
            y: (p1.y + p2.y) / 2,
            z: ((p1.z ?? 0) + (p2.z ?? 0)) / 2,
        });

        // Triangle side vectors and triangle normal
        const AB = vec(A, B);
        const AC = vec(A, C);
        const N = cross(AB.x, AB.y, AB.z, AC.x, AC.y, AC.z); // triangle's plane normal

        // Perpendicular bisectors directions (in-plane, perpendicular to sides)
        const D1 = cross(N.x, N.y, N.z, AB.x, AB.y, AB.z); // direction perpendicular to AB in the triangle plane
        const D2 = cross(N.x, N.y, N.z, AC.x, AC.y, AC.z); // direction perpendicular to AC in the triangle plane

        const M1 = mid(A, B); // midpoint of AB
        const M2 = mid(A, C); // midpoint of AC

        // Solve for intersection point of two lines:
        // P = M1 + t * D1
        // Q = M2 + s * D2
        // => M1 + t * D1 = M2 + s * D2 => solve for t and s
        const sol = math.intersect(
            [M1.x, M1.y, M1.z], [M1.x + D1.x, M1.y + D1.y, M1.z + D1.z],
            [M2.x, M2.y, M2.z], [M2.x + D2.x, M2.y + D2.y, M2.z + D2.z]
        );

        return {
            x: sol[0].valueOf() as number,
            y: sol[1].valueOf() as number,
            z: sol[2].valueOf() as number
        };
    }
}

export const incenter = (A: GeometryShape.Point, B: GeometryShape.Point, C: GeometryShape.Point) => {
    if (isCollinear(A, B, C)) {
        throw new Error('The points are collinear');
    }

    let AB = L2_norm(B.x - A.x, B.y - A.y, (B.z ?? 0) - (A.z ?? 0));
    let AC = L2_norm(C.x - A.x, C.y - A.y, (C.z ?? 0) - (A.z ?? 0));
    let BC = L2_norm(C.x - B.x, C.y - B.y, (C.z ?? 0) - (B.z ?? 0));

    return {
        x: (BC * A.x + AC * B.x + AB * C.x) / (BC + AC + AB),
        y: (BC * A.y + AC * B.y + AB * C.y) / (BC + AC + AB),
        z: ((BC * (A.z ?? 0) + AC * (B.z ?? 0) + AB * (C.z ?? 0)) / (BC + AC + AB))
    }
}

export const circumradius = (A: GeometryShape.Point, B: GeometryShape.Point, C: GeometryShape.Point) => {
    if (isCollinear(A, B, C)) {
        throw new Error('The points are collinear');
    }
    
    let AB = L2_norm(B.x - A.x, B.y - A.y, (B.z ?? 0) - (A.z ?? 0));
    let AC = L2_norm(C.x - A.x, C.y - A.y, (C.z ?? 0) - (A.z ?? 0));
    let BC = L2_norm(C.x - B.x, C.y - B.y, (C.z ?? 0) - (B.z ?? 0));

    let p = (AB + AC + BC) / 2;
    let area = symbolicSqrt(p * (p - AB) * (p - AC) * (p - BC));

    return AB * AC * BC / (4 * area);
}

export const inradius = (A: GeometryShape.Point, B: GeometryShape.Point, C: GeometryShape.Point) => {
    if (isCollinear(A, B, C)) {
        throw new Error('The points are collinear');
    }

    let AB = L2_norm(B.x - A.x, B.y - A.y, (B.z ?? 0) - (A.z ?? 0));
    let AC = L2_norm(C.x - A.x, C.y - A.y, (C.z ?? 0) - (A.z ?? 0));
    let BC = L2_norm(C.x - B.x, C.y - B.y, (C.z ?? 0) - (B.z ?? 0));
    
    let p = (AB + AC + BC) / 2;
    let area = symbolicSqrt(p * (p - AB) * (p - AC) * (p - BC));

    return area / p;
}

export const volume = (shape: GeometryShape.Shape) => {
    if ('width' in shape && 'height' in shape && 'depth' in shape) {
        let cube: GeometryShape.Cuboid = shape as GeometryShape.Cuboid;
        return cube.width * cube.height * cube.depth;
    }

    if ('base' in shape && 'shiftVector' in shape) {
        let pr: GeometryShape.Prism = shape as GeometryShape.Prism;
        let base_area = getArea(pr.base);
        let top_point: GeometryShape.Point = Factory.createPoint(
            pr.base.points[0].props,
            pr.base.points[0].x + pr.shiftVector.endVector.x - pr.shiftVector.startVector.x,
            pr.base.points[0].y + pr.shiftVector.endVector.y - pr.shiftVector.startVector.y,
            (pr.base.points[0].z ?? 0) + (pr.shiftVector.endVector.x ?? 0) - (pr.shiftVector.startVector.x ?? 0)
        )

        let height = distance(pr.base, top_point);
        return base_area * height;
    }

    if ('base' in shape && 'apex' in shape) {
        let py: GeometryShape.Pyramid = shape as GeometryShape.Pyramid;
        let base_area = getArea(py.base);
        let height = distance(py.base, py.apex);
        return (base_area * height) / 3;
    }
    
    if ('centerS' in shape && 'radius' in shape) {
        return (4 / 3) * Math.PI * Math.pow((shape as GeometryShape.Sphere).radius, 3);
    }

    if ('centerBase1' in shape && 'centerBase2' in shape && 'radius' in shape) {
        let cy: GeometryShape.Cylinder = shape as GeometryShape.Cylinder;
        let height = getDistance(cy.centerBase1, cy.centerBase2);
        let base_area = Math.PI * Math.pow(cy.radius, 2);
        return base_area * height;
    }

    if ('apex' in shape && 'center' in shape && 'radius' in shape) {
        let co: GeometryShape.Cone = shape as GeometryShape.Cone;
        let height = getDistance(co.center, co.apex);
        let base_area = Math.PI * Math.pow(co.radius, 2);
        return (base_area * height) / 3;
    }

    throw new Error('Invalid shape');
}

export const surface_area = (shape: GeometryShape.Shape) => {
    if ('height' in shape && 'width' in shape && 'depth' in shape) {
        let cube: GeometryShape.Cuboid = shape as GeometryShape.Cuboid;
        return 2 * (cube.width * cube.height + cube.width * cube.depth + cube.height * cube.depth);
    }

    if ('base' in shape && 'shiftVector' in shape) {
        let pr: GeometryShape.Prism = shape as GeometryShape.Prism;
        let base_area = getArea(pr.base);
        let top_point: GeometryShape.Point = Factory.createPoint(
            pr.base.points[0].props,
            pr.base.points[0].x + pr.shiftVector.endVector.x - pr.shiftVector.startVector.x,
            pr.base.points[0].y + pr.shiftVector.endVector.y - pr.shiftVector.startVector.y,
            (pr.base.points[0].z ?? 0) + (pr.shiftVector.endVector.x ?? 0) - (pr.shiftVector.startVector.x ?? 0)
        )

        let height = distance(pr.base, top_point);
        let perimeter = getPerimeter(pr.base);
        return 2 * base_area + perimeter * height;
    }

    if ('base' in shape && 'apex' in shape) {
        let py: GeometryShape.Pyramid = shape as GeometryShape.Pyramid;
        let perimeter = getPerimeter(py.base);
        let mid = midPoint(py.base.points[0], py.base.points[1]);
        let d = L2_norm(mid.x - py.apex.x, mid.y - py.apex.y, (mid.z ?? 0) - (py.apex.z ?? 0));
        return perimeter / 2 * d + getArea(py.base);
    }

    if ('centerS' in shape && 'radius' in shape) {
        return 4 * Math.PI * Math.pow((shape as GeometryShape.Sphere).radius, 2);
    }
    
    if ('centerBase1' in shape && 'centerBase2' in shape && 'radius' in shape) {
        let cy: GeometryShape.Cylinder = shape as GeometryShape.Cylinder;
        let height = getDistance(cy.centerBase1, cy.centerBase2);
        let base_area = Math.PI * Math.pow(cy.radius, 2);
        return 2 * base_area + 2 * Math.PI * cy.radius * height;
    }
    
    if ('apex' in shape && 'center' in shape && 'radius' in shape) {
        let co: GeometryShape.Cone = shape as GeometryShape.Cone;
        let height = getDistance(co.center, co.apex);
        let base_area = Math.PI * Math.pow(co.radius, 2);
        let slant_height = symbolicSqrt(Math.pow(co.radius, 2) + Math.pow(height, 2));
        return Math.PI * co.radius * slant_height + base_area;
    }
    
    throw new Error('Invalid shape');
}

export const perpendicular_bisector = (A: GeometryShape.Point, B: GeometryShape.Point) => {
    if (A.x === B.x && A.y === B.y && (A.z ?? 0) === (B.z ?? 0)) {
        throw new Error('The points are the same');
    }

    const mid = midPoint(A, B);
    const direction = {
        x: B.x - A.x,
        y: B.y - A.y,
        z: (B.z ?? 0) - (A.z ?? 0)
    };

    return {
        point: mid,
        direction: {
            x: -direction.y,
            y: direction.x,
            z: 0
        }
    };
}

export const angleBetween3Points = (A: GeometryShape.Point, B: GeometryShape.Point, C: GeometryShape.Point) => {
    if (A.z === undefined || B.z === undefined || C.z === undefined) {
        // Handle 2D points
        const BA = { x: A.x - B.x, y: A.y - B.y };
        const BC = { x: C.x - B.x, y: C.y - B.y };
        // Normalize
        const norm1 = L2_norm(BA.x, BA.y, 0);
        const norm2 = L2_norm(BC.x, BC.y, 0)
        BA.x /= norm1;
        BA.y /= norm1;
        BC.x /= norm2;
        BC.y /= norm2;
        
        const angleA = math.parse('atan2(y, x)').evaluate({x: BA.x, y: BA.y});
        const angleC = math.parse('atan2(y, x)').evaluate({x: BC.x, y: BC.y});
        let angle = angleA - angleC;
        if (Math.abs(angle) > epsilon && angle < 0) {
            angle += 2 * Math.PI;
        }

        return angle * 180 / Math.PI;
    }

    // Handle 3D points
    const BA = { x: A.x - B.x, y: A.y - B.y, z: (A.z ?? 0) - (B.z ?? 0) };
    const BC = { x: C.x - B.x, y: C.y - B.y, z: (C.z ?? 0) - (B.z ?? 0) };
    const dotProduct = dot(BA.x, BA.y, BA.z, BC.x, BC.y, BC.z);
    const normBA = L2_norm(BA.x, BA.y, BA.z);
    const normBC = L2_norm(BC.x, BC.y, BC.z);
    const cosTheta = dotProduct / (normBA * normBC);
    const clampedCosTheta = Math.max(-1, Math.min(1, cosTheta)); // Clamp to avoid NaN due to floating point precision issues
    const angle = symbolicACos(clampedCosTheta); // Angle in radians
    return angle * 180 / Math.PI;
}

export const angleBetweenLines = (line1: GeometryShape.Shape, line2: GeometryShape.Shape) => {
    if (!(['Segment', 'Ray', 'Line'].includes(line1.type))) {
        throw new Error('Cannot calculate angle');
    }

    if (!(['Segment', 'Ray', 'Line'].includes(line2.type))) {
        throw new Error('Cannot calculate angle');
    }

    let [start1, end1] = getStartAndEnd(line1);
    let [start2, end2] = getStartAndEnd(line2);

    if (start1.z === undefined || end1.z === undefined || 
        start2.z === undefined || end2.z === undefined) {
        // Handle 2D lines
        const v1 = {
            x: end1.x - start1.x,
            y: end1.y - start1.y
        }

        const v2 = {
            x: end2.x - start2.x,
            y: end2.y - start2.y
        }

        // Normalize
        const norm1 = L2_norm(v1.x, v1.y, 0);
        const norm2 = L2_norm(v2.x, v2.y, 0)
        v1.x /= norm1;
        v1.y /= norm1;
        v2.x /= norm2;
        v2.y /= norm2;

        const angle1 = math.parse('atan2(y, x)').evaluate({x: v1.x, y: v1.y});
        const angle2 = math.parse('atan2(y, x)').evaluate({x: v2.x, y: v2.y});
        let angle = angle1 - angle2;
        if (Math.abs(angle) > epsilon && angle < 0) {
            angle += 2 * Math.PI;
        }

        return angle * 180 / Math.PI;
    }

    // Handle 3D lines
    const v1 = {
        x: end1.x - start1.x,
        y: end1.y - start1.y,
        z: (end1.z ?? 0) - (start1.z ?? 0)
    }

    const v2 = {
        x: end2.x - start2.x,
        y: end2.y - start2.y,
        z: (end2.z ?? 0) - (start2.z ?? 0)
    }

    const dotProduct = dot(v1.x, v1.y, v1.z, v2.x, v2.y, v2.z);
    const normV1 = L2_norm(v1.x, v1.y, v1.z);
    const normV2 = L2_norm(v2.x, v2.y, v2.z);
    const cosTheta = Math.abs(dotProduct) / (normV1 * normV2);
    const clampedCosTheta = Math.max(-1, Math.min(1, cosTheta)); // Clamp to avoid NaN due to floating point precision issues
    const angle = symbolicACos(clampedCosTheta); // Angle in radians
    return angle * 180 / Math.PI;
}

export const dihedralAngle = (A: GeometryShape.Point, d: GeometryShape.Line, B: GeometryShape.Point) => {
    if (A.z === undefined || d.startLine.z === undefined || d.endLine.z === undefined || B.z === undefined) {
        throw new Error('All points must have z-coordinates for dihedral angle calculation');
    }

    // Handle 3D points
    let u_line = {
        x: d.endLine.x - d.startLine.x,
        y: d.endLine.y - d.startLine.y,
        z: (d.endLine.z ?? 0) - (d.startLine.z ?? 0)
    }

    let n1 = cross(
        A.x - d.startLine.x,
        A.y - d.startLine.y,
        (A.z ?? 0) - (d.startLine.z ?? 0),
        u_line.x,
        u_line.y,
        u_line.z
    )

    let n2 = cross(
        B.x - d.startLine.x,
        B.y - d.startLine.y,
        (B.z ?? 0) - (d.startLine.z ?? 0),
        u_line.x,
        u_line.y,
        u_line.z
    )

    const dotProduct = dot(n1.x, n1.y, n1.z, n2.x, n2.y, n2.z);
    const normN1 = L2_norm(n1.x, n1.y, n1.z);
    const normN2 = L2_norm(n2.x, n2.y, n2.z);
    const cosTheta = dotProduct / (normN1 * normN2);
    const clampedCosTheta = Math.max(-1, Math.min(1, cosTheta)); // Clamp to avoid NaN due to floating point precision issues
    const angle = symbolicACos(clampedCosTheta); // Angle in radians
    return angle
}

export const bisector_angle_line1 = (A: GeometryShape.Point, B: GeometryShape.Point, C: GeometryShape.Point) => {
    if (isCollinear(A, B, C)) {
        if (A.z === undefined || B.z === undefined || C.z === undefined) {
            return {
                point: {
                    x: B.x,
                    y: B.y,
                    z: (B.z ?? 0)
                },
                direction: {
                    x: B.y - A.y,
                    y: A.x - B.x,
                    z: 0
                }
            }
        }

        throw new Error('Cannot calculate bisector angle line for collinear points in 3D');
    }

    let BA = {
        x: A.x - B.x,
        y: A.y - B.y,
        z: (A.z ?? 0) - (B.z ?? 0)
    }

    let BC = {
        x: C.x - B.x,
        y: C.y - B.y,
        z: (C.z ?? 0) - (B.z ?? 0)
    }

    let point = {
        x: B.x,
        y: B.y,
        z: B.z ?? 0
    }

    return {
        point: point,
        direction: {
            x: BA.x / L2_norm(BA.x, BA.y, BA.z) + BC.x / L2_norm(BC.x, BC.y, BC.z),
            y: BA.y / L2_norm(BA.x, BA.y, BA.z) + BC.y / L2_norm(BC.x, BC.y, BC.z),
            z: (BA.z ?? 0) / L2_norm(BA.x, BA.y, BA.z) + (BC.z ?? 0) / L2_norm(BC.x, BC.y, BC.z)
        }
    }
}

export const bisector_angle_line2 = (d1: GeometryShape.Line, d2: GeometryShape.Line) => {
    let A = getIntersections2D(d1, d2);
    if (A.length === 0 || (A.length === 1 && A[0].coors === undefined)) {
        throw new Error('Cannot construct bisector angle line from 2 parallel or coincident lines');
    }

    let u1 = {
        x: d1.endLine.x - d1.startLine.x,
        y: d1.endLine.y - d1.startLine.y,
        z: (d1.endLine.z ?? 0) - (d1.startLine.z ?? 0)
    }

    let u2 = {
        x: d2.endLine.x - d2.startLine.x,
        y: d2.endLine.y - d2.startLine.y,
        z: (d2.endLine.z ?? 0) - (d2.startLine.z ?? 0)
    }

    let B = {
        x: A[0].coors!.x,
        y: A[0].coors!.y,
        z: A[0].coors!.z
    }

    return [
        {
            point: B,
            direction: {
                x: u1.x / L2_norm(u1.x, u1.y, u1.z) + u2.x / L2_norm(u2.x, u2.y, u2.z),
                y: u1.y / L2_norm(u1.x, u1.y, u1.z) + u2.y / L2_norm(u2.x, u2.y, u2.z),
                z: (u1.z ?? 0) / L2_norm(u1.x, u1.y, u1.z) + (u2.z ?? 0) / L2_norm(u2.x, u2.y, u2.z)
            }
        },

        {
            point: B,
            direction: {
                x: u1.x / L2_norm(u1.x, u1.y, u1.z) - u2.x / L2_norm(u2.x, u2.y, u2.z),
                y: u1.y / L2_norm(u1.x, u1.y, u1.z) - u2.y / L2_norm(u2.x, u2.y, u2.z),
                z: (u1.z ?? 0) / L2_norm(u1.x, u1.y, u1.z) - (u2.z ?? 0) / L2_norm(u2.x, u2.y, u2.z)
            }
        }
    ]
}

export const tangentLine = (p: GeometryShape.Point, c: GeometryShape.Circle | GeometryShape.SemiCircle) => {
    if ('centerC' in c && 'radius' in c) {
        let d = getDistance(p, c.centerC);
        if (d < c.radius && Math.abs(d - c.radius) > epsilon) {
            return [];
        }

        let n = c.normal ? {
            x: c.normal.endVector.x - c.normal.startVector.x,
            y: c.normal.endVector.y - c.normal.startVector.y,
            z: (c.normal.endVector.z ?? 0) - (c.normal.startVector.z ?? 0)
        } : {
            x: 0,
            y: 0,
            z: 1
        } 

        if (Math.abs(n.x * p.x + n.y * p.y + n.z * (p.z ?? 0) - (n.x * c.centerC.x + n.y * c.centerC.y + n.z * (c.centerC.z ?? 0))) > epsilon) {
            return [];
        }

        if (Math.abs(d - c.radius) < epsilon) {
            let v = {
                x: c.centerC.x - p.x,
                y: c.centerC.y - p.y,
                z: (c.centerC.z ?? 0) - (p.z ?? 0)
            }
            return [
                {
                    point:  {
                        x: p.x,
                        y: p.y,
                        z: p.z ?? 0
                    },
                    direction: {
                        x: v.y,
                        y: -v.x,
                        z: 0
                    },
                    ambiguous: false
                }
            ]
        }

        else {
            let m = midPoint(p, c.centerC);
            let c1: GeometryShape.Circle = Factory.createCircle(
                c.props,
                Factory.createPoint(
                    p.props,
                    m.x,
                    m.y,
                    m.z
                ),
                d / 2,
                c.normal
            )

            let intersections = getIntersections2D(c1, c);
            console.log(intersections);
            return [
                {
                    point:  {
                        x: p.x,
                        y: p.y,
                        z: p.z ?? 0
                    },
                    direction: {
                        x: intersections[0].coors!.x - p.x,
                        y: intersections[0].coors!.y - p.y,
                        z: intersections[0].coors!.z - (p.z ?? 0),
                    },
                    ambiguous: false
                },
                {
                    point:  {
                        x: p.x,
                        y: p.y,
                        z: p.z ?? 0
                    },
                    direction: {
                        x: intersections[1].coors!.x - p.x,
                        y: intersections[1].coors!.y - p.y,
                        z: intersections[1].coors!.z - (p.z ?? 0),
                    },
                    ambiguous: false
                }
            ]
        }
    }

    else {
        let center = {
            x: (c.end.x + c.start.x) / 2,
            y: (c.end.y + c.start.y) / 2,
            z: ((c.end.z ?? 0) + (c.start.z ?? 0)) / 2
        }
        let r = symbolicSqrt(Math.pow(center.x - c.start.x, 2) + Math.pow(center.y - c.start.y, 2));
        let d = symbolicSqrt(Math.pow(center.x - p.x, 2) + Math.pow(center.y - p.y, 2));
        if (d < r && Math.abs(d - r) > epsilon) {
            return [];
        }

        let n = c.normal ? {
            x: c.normal.endVector.x - c.normal.startVector.x,
            y: c.normal.endVector.y - c.normal.startVector.y,
            z: (c.normal.endVector.z ?? 0) - (c.normal.startVector.z ?? 0)
        } : {
            x: 0,
            y: 0,
            z: 1
        }

        if (Math.abs(n.x * p.x + n.y * p.y + n.z * (p.z ?? 0) - (n.x * center.x + n.y * center.y + n.z * (center.z ?? 0))) > epsilon) {
            return [];
        }

        if (Math.abs(d - r) < epsilon) {
            let v = {
                x: center.x - p.x,
                y: center.y - p.y,
                z: (center.z ?? 0) - (p.z ?? 0)
            }
            return [
                {
                    point: {
                        x: p.x,
                        y: p.y,
                        z: p.z ?? 0
                    },
                    direction: {
                        x: v.y,
                        y: -v.x,
                        z: 0
                    },
                    ambiguous: false
                }
            ]
        }

        else {
            let m = {
                x: (p.x + center.x) / 2,
                y: (p.y + center.y) / 2,
                z: ((p.z ?? 0) + center.z) / 2
            }

            let c1: GeometryShape.Circle = Factory.createCircle(
                c.props,
                Factory.createPoint(
                    p.props,
                    m.x,
                    m.y,
                    m.z
                ),
                d / 2,
                c.normal
            )

            let intersections = getIntersections2D(c1, c);
            return [
                {
                    point:  {
                        x: p.x,
                        y: p.y,
                        z: p.z ?? 0
                    },
                    direction: {
                        x: intersections[0].coors!.x - p.x,
                        y: intersections[0].coors!.y - p.y,
                        z: intersections[0].coors!.z - (p.z ?? 0),
                    },
                    ambiguous: intersections[0].ambiguous
                },
                {
                    point:  {
                        x: p.x,
                        y: p.y,
                        z: p.z ?? 0
                    },
                    direction: {
                        x: intersections[1].coors!.x - p.x,
                        y: intersections[1].coors!.y - p.y,
                        z: intersections[1].coors!.z - (p.z ?? 0),
                    },
                    ambiguous: intersections[1].ambiguous
                }
            ]
        }
    }
}

export const reflection = (o1: GeometryShape.Shape, o2: GeometryShape.Shape): GeometryShape.Shape => {
    if (!('startSegment' in o2 || 'startRay' in o2 || 'startLine' in o2 || ('x' in o2 && 'y' in o2) || ('point' in o2 && 'norm' in o2))) {
        throw new Error('Cannot perform reflection');
    }

    if ('startVector' in o1) {
        let v: GeometryShape.Vector = o1 as GeometryShape.Vector;
        return Factory.createVector(
            v.props,
            reflection(v.startVector, o2) as GeometryShape.Point,
            reflection(v.endVector, o2) as GeometryShape.Point
        )
    }

    else if ('x' in o1 && 'y' in o1) {
        let p: GeometryShape.Point = o1 as GeometryShape.Point;
        if ('startSegment' in o2 || 'startRay' in o2 || 'startLine' in o2) {
            let [start, end] = getStartAndEnd(o2);
            let d = {
                x: end.x - start.x,
                y: end.y - start.y,
                z: (end.z ?? 0) - (start.z ?? 0)
            }

            let v = {
                x: start.x - p.x,
                y: start.y - p.y,
                z: (start.z ?? 0) - (p.z ?? 0)
            }

            let cross_uv = cross(
                v.x, v.y, v.z,
                d.x, d.y, d.z
            )

            if (L2_norm(cross_uv.x, cross_uv.y, cross_uv.z) < epsilon) {
                return o1
            }

            let dot_uv = dot(
                v.x, v.y, v.z,
                d.x, d.y, d.z
            )

            let norm = L2_norm(d.x, d.y, d.z)
            let v1 = {
                x: dot_uv / norm * d.x,
                y: dot_uv / norm * d.y,
                z: dot_uv / norm * d.z,
            }

            let foot = {
                x: start.x + v1.x,
                y: start.y + v1.y,
                z: (start.z ?? 0) + v1.z
            }

            return Factory.createPoint(
                p.props,
                2 * foot.x - p.x,
                2 * foot.y - p.y,
                2 * foot.z - (p.z ?? 0)
            )
        }

        else if ('x' in o2 && 'y' in o2) {
            let p2: GeometryShape.Point = o2 as GeometryShape.Point;
            return Factory.createPoint(
                p.props,
                2 * p2.x - p.x,
                2 * p2.y - p.y,
                2 * (p2.z ?? 0) - (p.z ?? 0)
            )
        }

        else if ('point' in o2 && 'norm' in o2) {
            let pl: GeometryShape.Plane = o2 as GeometryShape.Plane;
            let n = {
                x: pl.norm.endVector.x - pl.norm.startVector.x,
                y: pl.norm.endVector.y - pl.norm.startVector.y,
                z: (pl.norm.endVector.z ?? 0) - (pl.norm.startVector.z ?? 0),
            }

            let numerator = n.x * (p.x - pl.point.x) + n.y * (p.y - pl.point.y) + n.z * ((p.z ?? 0) - (pl.point.z ?? 0));
            let denominator = dot(n.x, n.y, n.z, n.x, n.y, n.z);
            return Factory.createPoint(
                p.props,
                p.x - (2 * n.x * numerator) / denominator,
                p.y - (2 * n.y * numerator) / denominator,
                (p.z ?? 0) - (2 * n.z * numerator) / denominator
            )
        }

        else throw new Error('Cannot perform reflection');
    }

    else if ('centerC' in o1 && 'radius' in o1) {
        let c: GeometryShape.Circle = o1 as GeometryShape.Circle;
        let p = reflection(c.centerC, o2) as GeometryShape.Point;
        return Factory.createCircle(
            c.props,
            p,
            c.radius,
            c.normal
        )
    }

    else if ('start' in o1 && 'end' in o1) {
        let sem: GeometryShape.SemiCircle = o1 as GeometryShape.SemiCircle;
        let [p1, p2] = [
            reflection(sem.start, o2) as GeometryShape.Point,
            reflection(sem.end, o2) as GeometryShape.Point,
        ];
        return Factory.createSemiCircle(
            sem.props,
            p1,
            p2,
            sem.normal
        )
    }

    else if ('points' in o1) {
        let poly: GeometryShape.Polygon = o1 as GeometryShape.Polygon;
        let points: GeometryShape.Point[] = [];
        poly.points.forEach(p => {
            points.push(reflection(p, o2) as GeometryShape.Point);
        })

        return Factory.createPolygon(
            o1.props,
            points
        )
    }

    else if ('startSegment' in o1 || 'startRay' in o1 || 'startLine' in o1) {
        let [start2, end2] = getStartAndEnd(o1);
        let [start3, end3] = [
            reflection(Factory.createPoint(
                o2.props,
                start2.x,
                start2.y,
                (start2.z ?? 0)
            ), o2) as GeometryShape.Point, reflection(Factory.createPoint(
                o2.props,
                end2.x,
                end2.y,
                (end2.z ?? 0)
            ), o2) as GeometryShape.Point
        ]

        if ('startSegment' in o1) {
            return Factory.createSegment(o2.props, start3, end3);
        }

        else if ('startRay' in o1) {
            return Factory.createRay(o2.props, start3, end3);
        }
            
        else {
            return Factory.createLine(o2.props, start3, end3);
        }
    }

    else if ('centerS' in o1 && 'radius' in o1) {
        let c: GeometryShape.Sphere = o1 as GeometryShape.Sphere;
        let p = reflection(c.centerS, o2) as GeometryShape.Point;
        return Factory.createSphere(
            c.props,
            p,
            c.radius
        )
    }

    else if ('point' in o1 && 'norm' in o1) {
        let pl: GeometryShape.Plane = o1 as GeometryShape.Plane;
        return Factory.createPlane(
            pl.props,
            reflection(pl.point, o2) as GeometryShape.Point,
            pl.norm
        )
    }

    else if ('width' in o1 && 'height' in o1 && 'depth' in o1) {
        let cube: GeometryShape.Cuboid = o1 as GeometryShape.Cuboid;
        return Factory.createCuboid(
            cube.props,
            reflection(cube.origin, o2) as GeometryShape.Point,
            reflection(cube.axisX, o2) as GeometryShape.Vector,
            reflection(cube.axisY, o2) as GeometryShape.Vector,
            cube.width, cube.height, cube.depth
        )
    }

    else if ('centerBase1' in o1 && 'centerBase2' in o1 && 'radius' in o1) {
        let cy: GeometryShape.Cylinder = o1 as GeometryShape.Cylinder;
        return Factory.createCylinder(
            cy.props,
            reflection(cy.centerBase1, o2) as GeometryShape.Point,
            reflection(cy.centerBase2, o2) as GeometryShape.Point,
            cy.radius
        )
    }

    else if ('base' in o1 && 'shiftVector' in o1) {
        let pr: GeometryShape.Prism = o1 as GeometryShape.Prism;
        return Factory.createPrism(
            pr.props,
            reflection(pr.base, o2) as GeometryShape.Polygon,
            pr.shiftVector
        )
    }

    else if ('base' in o1 && 'apex' in o1) {
        let py: GeometryShape.Pyramid = o1 as GeometryShape.Pyramid;
        return Factory.createPyramid(
            py.props,
            reflection(py.base, o2) as GeometryShape.Polygon,
            reflection(py.apex, o2) as GeometryShape.Point
        )
    }

    else if ('center' in o1 && 'apex' in o1) {
        let py: GeometryShape.Cone = o1 as GeometryShape.Cone;
        return Factory.createCone(
            py.props,
            reflection(py.center, o2) as GeometryShape.Point,
            reflection(py.apex, o2) as GeometryShape.Point,
            py.radius
        )
    }

    else {
        throw new Error('Cannot perform reflection');
    }
}

export const point_projection = (o1: GeometryShape.Point, o2: GeometryShape.Shape) => {
    if (!(['Segment', 'Ray', 'Line', 'Plane'].includes(o2.type))) {
        throw new Error('Cannot perform projection');
    }

    if ((['Segment', 'Ray', 'Line'].includes(o2.type))) {
        let [start, end] = getStartAndEnd(o2);
        let d = {
            x: end.x - start.x,
            y: end.y - start.y,
            z: (end.z ?? 0) - (start.z ?? 0)
        }

        let v = {
            x: start.x - o1.x,
            y: start.y - o1.y,
            z: (start.z ?? 0) - (o1.z ?? 0)
        }

        let cross_uv = cross(
            v.x, v.y, v.z,
            d.x, d.y, d.z
        )

        if (L2_norm(cross_uv.x, cross_uv.y, cross_uv.z) < epsilon) {
            return o1
        }

        let dot_uv = dot(
            v.x, v.y, v.z,
            d.x, d.y, d.z
        )

        let denom = dot(d.x, d.y, d.z, d.x, d.y, d.z);
        let t = dot_uv / denom;
        if (('startSegment' in o2 && ((t >= 0 && Math.abs(t) < epsilon) && (t <= 1 && Math.abs(t - 1) < epsilon))) || ('startRay' in o2 && (t >= 0 && Math.abs(t) < epsilon)) || 'startLine' in o2) {
            let v1 = {
                x: d.x * t,
                y: d.y * t,
                z: d.z * t
            }

            let foot = {
                x: start.x + v1.x,
                y: start.y + v1.y,
                z: (start.z ?? 0) + v1.z
            }

            return {
                x: foot.x,
                y: foot.y,
                z: foot.z
            }
        }
        
        else {
            throw new Error('Projected point out of bound');
        }
    }

    else {
        let pl: GeometryShape.Plane = o2 as GeometryShape.Plane;
        let n = {
            x: pl.norm.endVector.x - pl.norm.startVector.x,
            y: pl.norm.endVector.y - pl.norm.startVector.y,
            z: (pl.norm.endVector.z ?? 0) - (pl.norm.startVector.z ?? 0),
        }

        let A = math.intersect(
            [o1.x, o1.y, o1.z ?? 0],
            [o1.x + n.x, o1.y + n.y, (o1.z ?? 0) + n.z],
            [n.x, n.y, n.z, n.x * pl.point.x, n.y * pl.point.y, n.z * (pl.point.z ?? 0)]
        )

        if (A === null) {
            throw new Error('Cannot perform projection');
        }

        return {
            x: A[0].valueOf() as number,
            y: A[1].valueOf() as number,
            z: A.length === 2 ? 0 : A[2].valueOf() as number
        }
    }
}

export const rotation = (o1: GeometryShape.Shape, o2: GeometryShape.Shape, degree: number, CCW: boolean = true): GeometryShape.Shape => {
    if (!(['Segment', 'Ray', 'Line', 'Point'].includes(o2.type))) {
        throw new Error('Cannot perform rotation');
    }

    if (degree >= 360 || degree <= -360) {
        return rotation(o1, o2, degree % 360, CCW);
    }

    degree = (CCW ? degree : -degree);
    let radian = Math.PI / 180 * degree;

    if ('x' in o2 && 'y' in o2) {
        // Only 2D
        let p2: GeometryShape.Point = o2 as GeometryShape.Point;
        if ('x' in o1 && 'y' in o1) {
            let p1: GeometryShape.Point = o1 as GeometryShape.Point;
            let rotated_point = {
                x: (p2.x - p1.x) * symbolicCos(radian) - (p2.y - p1.y) * symbolicSin(radian) + p2.x,
                y: (p2.x - p1.x) * symbolicSin(radian) + (p2.y - p1.y) * symbolicCos(radian) + p2.y
            }

            return Factory.createPoint(
                p1.props,
                rotated_point.x,
                rotated_point.y
            )
        }

        else if ('startSegment' in o1 || 'startRay' in o1 || 'startLine' in o1) {
            let [start, end] = getStartAndEnd(o1);
            let [A, B] = [Factory.createPoint(p2.props, start.x, start.y), Factory.createPoint(p2.props, end.x, end.y)];
            [A, B] = [rotation(A, o2, degree, CCW) as GeometryShape.Point, rotation(B, o2, degree, CCW) as GeometryShape.Point];
            switch (o1.type) {
                case 'Segment':
                    return Factory.createSegment(o1.props, A, B);
                
                case 'Ray':
                    return Factory.createRay(o1.props, A, B);
                
                default:
                    return Factory.createLine(o1.props, A, B);
            }
        }

        else if ('startVector' in o1) {
            let v: GeometryShape.Vector = o1 as GeometryShape.Vector;
            let [A, B] = [Factory.createPoint(p2.props, v.startVector.x, v.startVector.y), Factory.createPoint(p2.props, v.endVector.x, v.endVector.y)];
            [A, B] = [rotation(A, o2, degree, CCW) as GeometryShape.Point, rotation(B, o2, degree, CCW) as GeometryShape.Point];
            return Factory.createVector(v.props, A, B);
        }

        else if ('centerC' in o1 && 'radius' in o1) {
            let c: GeometryShape.Circle = o1 as GeometryShape.Circle;
            let center = rotation(c.centerC, o2, degree, CCW) as GeometryShape.Point;
            return Factory.createCircle(c.props, center, c.radius, c.normal);
        }

        else if ('start' in o1 && 'end' in o1) {
            let sem: GeometryShape.SemiCircle = o1 as GeometryShape.SemiCircle;
            let [p1, p2] = [
                rotation(sem.start, o2, degree, CCW) as GeometryShape.Point,
                rotation(sem.end, o2, degree, CCW) as GeometryShape.Point,
            ];
            return Factory.createSemiCircle(
                sem.props,
                p1,
                p2,
                sem.normal
            )
        }

        else if ('points' in o1) {
            let poly: GeometryShape.Polygon = o1 as GeometryShape.Polygon;
            let points: GeometryShape.Point[] = [];
            poly.points.forEach(p => {
                points.push(rotation(p, o2, degree, CCW) as GeometryShape.Point);
            })

            return Factory.createPolygon(poly.props, points);
        }

        else if ('width' in o1 && 'height' in o1 && 'depth' in o1) {
            let cube: GeometryShape.Cuboid = o1 as GeometryShape.Cuboid;
            return Factory.createCuboid(
                cube.props,
                rotation(cube.origin, o2, degree, CCW) as GeometryShape.Point,
                rotation(cube.axisX, o2, degree, CCW) as GeometryShape.Vector,
                rotation(cube.axisY, o2, degree, CCW) as GeometryShape.Vector,
                cube.width, cube.height, cube.depth
            )
        }

        else if ('centerBase1' in o1 && 'centerBase2' in o1 && 'radius' in o1) {
            let cy: GeometryShape.Cylinder = o1 as GeometryShape.Cylinder;
            return Factory.createCylinder(
                cy.props,
                rotation(cy.centerBase1, o2, degree, CCW) as GeometryShape.Point,
                rotation(cy.centerBase2, o2, degree, CCW) as GeometryShape.Point,
                cy.radius
            )
        }

        else if ('base' in o1 && 'shiftVector' in o1) {
            let pr: GeometryShape.Prism = o1 as GeometryShape.Prism;
            return Factory.createPrism(
                pr.props,
                rotation(pr.base, o2, degree, CCW) as GeometryShape.Polygon,
                pr.shiftVector
            )
        }

        else if ('base' in o1 && 'apex' in o1) {
            let py: GeometryShape.Pyramid = o1 as GeometryShape.Pyramid;
            return Factory.createPyramid(
                py.props,
                rotation(py.base, o2, degree, CCW) as GeometryShape.Polygon,
                rotation(py.apex, o2, degree, CCW) as GeometryShape.Point
            )
        }

        else if ('center' in o1 && 'apex' in o1) {
            let py: GeometryShape.Cone = o1 as GeometryShape.Cone;
            return Factory.createCone(
                py.props,
                rotation(py.center, o2, degree, CCW) as GeometryShape.Point,
                rotation(py.apex, o2, degree, CCW) as GeometryShape.Point,
                py.radius
            )
        }

        else {
            throw new Error('Cannot perform rotation');
        }
    }

    else {
        // 3D rotation
        let [start, end] = getStartAndEnd(o2);
        let v = {
            x: end.x - start.x,
            y: end.y - start.y,
            z: (end.z ?? 0) - (start.z ?? 0)
        }
        
        if ('x' in o1 && 'y' in o1) {
            let p: GeometryShape.Point = o1 as GeometryShape.Point;
            let u = {
                x: p.x - start.x,
                y: p.y - start.y,
                z: (p.z ?? 0) - (start.z ?? 0)
            }

            let crossProd = cross(v.x, v.y, v.z, u.x, u.y, u.z);
            let dot_uv = dot(v.x, v.y, v.z, u.x, u.y, u.z);

            return Factory.createPoint(
                p.props,
                start.x + u.x * symbolicCos(radian) + symbolicSin(radian) * crossProd.x + (1 - symbolicCos(radian)) * dot_uv * v.x,
                start.y + u.y * symbolicCos(radian) + symbolicSin(radian) * crossProd.y + (1 - symbolicCos(radian)) * dot_uv * v.y,
                (start.z ?? 0) + u.z * symbolicCos(radian) + symbolicSin(radian) * crossProd.z + (1 - symbolicCos(radian)) * dot_uv * v.z
            )
        }

        else if ('startSegment' in o1 || 'startRay' in o1 || 'startLine' in o1) {
            let [start, end] = getStartAndEnd(o1);
            let [A, B] = [Factory.createPoint(o2.props, start.x, start.y), Factory.createPoint(o2.props, end.x, end.y)];
            [A, B] = [rotation(A, o2, degree, CCW) as GeometryShape.Point, rotation(B, o2, degree, CCW) as GeometryShape.Point];
            switch (o1.type) {
                case 'Segment':
                    return Factory.createSegment(o1.props, A, B);
                
                case 'Ray':
                    return Factory.createRay(o1.props, A, B);
                
                default:
                    return Factory.createLine(o1.props, A, B);
            }
        }

        else if ('startVector' in o1) {
            let v: GeometryShape.Vector = o1 as GeometryShape.Vector;
            let [A, B] = [Factory.createPoint(o2.props, v.startVector.x, v.startVector.y), Factory.createPoint(o2.props, v.endVector.x, v.endVector.y)];
            [A, B] = [rotation(A, o2, degree, CCW) as GeometryShape.Point, rotation(B, o2, degree, CCW) as GeometryShape.Point];
            return Factory.createVector(v.props, A, B);
        }

        else if ('centerC' in o1 && 'radius' in o1) {
            let c: GeometryShape.Circle = o1 as GeometryShape.Circle;
            let center = rotation(c.centerC, o2, degree, CCW) as GeometryShape.Point;
            return Factory.createCircle(c.props, center, c.radius, c.normal);
        }

        else if ('points' in o1) {
            let poly: GeometryShape.Polygon = o1 as GeometryShape.Polygon;
            let points: GeometryShape.Point[] = [];
            poly.points.forEach(p => {
                points.push(rotation(p, o2, degree, CCW) as GeometryShape.Point);
            })

            return Factory.createPolygon(poly.props, points);
        }

        else if ('centerS' in o1 && 'radius' in o1) {
            let sp: GeometryShape.Sphere = o1 as GeometryShape.Sphere;
            let center = rotation(sp.centerS, o2, degree, CCW) as GeometryShape.Point;
            return Factory.createSphere(sp.props, center, sp.radius);
        }

        else if ('point' in o1 && 'norm' in o1) {
            let pl: GeometryShape.Plane = o1 as GeometryShape.Plane;
            let p_ref = rotation(pl.point, o2, degree, CCW) as GeometryShape.Point;
            return Factory.createPlane(pl.props, p_ref, pl.norm);
        }

        else {
            throw new Error('Cannot perform rotation');
        }
    }
}

export const excenter = (A: GeometryShape.Point, B: GeometryShape.Point, C: GeometryShape.Point) => {
    if (isCollinear(A, B, C)) {
        throw new Error('Cannot find the excenter of 3 colinear points');
    }

    let BC = L2_norm(C.x - B.x, C.y - B.y, (C.z ?? 0) - (B.z ?? 0));
    let CA = L2_norm(C.x - A.x, C.y - A.y, (C.z ?? 0) - (A.z ?? 0));
    let AB = L2_norm(A.x - B.x, A.y - B.y, (A.z ?? 0) - (B.z ?? 0));

    return [
        {
            x: (-BC * A.x + CA * B.x + AB * C.x) / (-BC + CA + AB),
            y: (-BC * A.y + CA * B.y + AB * C.y) / (-BC + CA + AB),
            z: (-BC * (A.z ?? 0) + CA * (B.z ?? 0) + AB * (C.z ?? 0)) / (-BC + CA + AB)
        },
        {
            x: (BC * A.x - CA * B.x + AB * C.x) / (BC - CA + AB),
            y: (BC * A.y - CA * B.y + AB * C.y) / (BC - CA + AB),
            z: (BC * (A.z ?? 0) - CA * (B.z ?? 0) + AB * (C.z ?? 0)) / (BC - CA + AB)
        },
        {
            x: (BC * A.x + CA * B.x - AB * C.x) / (BC + CA - AB),
            y: (BC * A.y + CA * B.y - AB * C.y) / (BC + CA - AB),
            z: (BC * (A.z ?? 0) + CA * (B.z ?? 0) - AB * (C.z ?? 0)) / (BC + CA - AB)
        }
    ]
}

export const exradius = (A: GeometryShape.Point, B: GeometryShape.Point, C: GeometryShape.Point) => {
    if (isCollinear(A, B, C)) {
        throw new Error('Cannot find the exradius of 3 colinear points');
    }

    let BC = L2_norm(C.x - B.x, C.y - B.y, (C.z ?? 0) - (B.z ?? 0));
    let CA = L2_norm(C.x - A.x, C.y - A.y, (C.z ?? 0) - (A.z ?? 0));
    let AB = L2_norm(A.x - B.x, A.y - B.y, (A.z ?? 0) - (B.z ?? 0));

    let s = (AB + BC + CA) / 2;
    return [
        symbolicSqrt(s * (s - AB) * (s - BC) * (s - CA)) / (s - BC),
        symbolicSqrt(s * (s - AB) * (s - BC) * (s - CA)) / (s - CA),
        symbolicSqrt(s * (s - AB) * (s - BC) * (s - CA)) / (s - AB)
    ]
}

export const enlarge = (o1: GeometryShape.Shape, o2: GeometryShape.Point, k: number): GeometryShape.Shape => {
    if (k === 0) {
        return o2;
    }

    if ('x' in o1 && 'y' in o1) {
        let p: GeometryShape.Point = o1 as GeometryShape.Point;
        let v = {
            x: (p.x - o2.x) * (k > 0 ? 1 : -1),
            y: (p.y - o2.y) * (k > 0 ? 1 : -1),
            z: ((p.z ?? 0) - (o2.z ?? 0)) * (k > 0 ? 1 : -1)
        }

        // o2p' = k*o2o1 => p' - o2 = k(o1 - o2)

        return Factory.createPoint(
            o2.props,
            o2.x + k * v.x,
            o2.y + k * v.y,
            (o2.z ?? 0) + v.z
        )
    }

    else if ('centerC' in o1 && 'radius' in o1) {
        let c: GeometryShape.Circle = o1 as GeometryShape.Circle;
        let p = enlarge(c.centerC, o2, k) as GeometryShape.Point;
        return Factory.createCircle(
            c.props,
            p,
            Math.abs(k) * c.radius,
            c.normal
        )
    }

    else if ('start' in o1 && 'end' in o1) {
        let sem: GeometryShape.SemiCircle = o1 as GeometryShape.SemiCircle;
        let [p1, p2] = [
            enlarge(sem.start, o2, k) as GeometryShape.Point,
            enlarge(sem.end, o2, k) as GeometryShape.Point,
        ];
        return Factory.createSemiCircle(
            sem.props,
            p1,
            p2,
            sem.normal
        )
    }

    else if ('points' in o1) {
        let poly: GeometryShape.Polygon = o1 as GeometryShape.Polygon;
        let points: GeometryShape.Point[] = [];
        poly.points.forEach(p => {
            points.push(enlarge(p, o2, k) as GeometryShape.Point);
        })

        return Factory.createPolygon(
            o1.props,
            points
        )
    }

    else if ('startSegment' in o1 || 'startRay' in o1 || 'startLine' in o1) {
        let [start2, end2] = getStartAndEnd(o1);
        let [start3, end3] = [
            enlarge(Factory.createPoint(
                o2.props,
                start2.x,
                start2.y,
                (start2.z ?? 0)
            ), o2, k) as GeometryShape.Point, enlarge(Factory.createPoint(
                o2.props,
                end2.x,
                end2.y,
                (end2.z ?? 0)
            ), o2, k) as GeometryShape.Point
        ]

        switch (o1.type) {
            case 'Segment':
                return Factory.createSegment(o2.props, start3, end3);
            
            case 'Line':
                return Factory.createLine(o2.props, start3, end3);
            
            default:
                return Factory.createRay(o2.props, start3, end3);
        }
    }

    else if ('startVector' in o1) {
        let v: GeometryShape.Vector = o1 as GeometryShape.Vector;
        return Factory.createVector(
            v.props,
            enlarge(v.startVector, o2, k) as GeometryShape.Point,
            enlarge(v.endVector, o2, k) as GeometryShape.Point
        )
    }

    else if ('centerS' in o1 && 'radius' in o1) {
        let c: GeometryShape.Sphere = o1 as GeometryShape.Sphere;
        let p = enlarge(c.centerS, o2, k) as GeometryShape.Point;
        return Factory.createSphere(
            c.props,
            p,
            Math.abs(k) * c.radius
        )
    }

    else if ('point' in o1 && 'norm' in o1) {
        let pl: GeometryShape.Plane = o1 as GeometryShape.Plane;
        return Factory.createPlane(
            pl.props,
            enlarge(pl.point, o2, k) as GeometryShape.Point,
            pl.norm
        )
    }

    else if ('width' in o1 && 'height' in o1 && 'depth' in o1) {
        let cube: GeometryShape.Cuboid = o1 as GeometryShape.Cuboid;
        return Factory.createCuboid(
            cube.props,
            enlarge(cube.origin, o2, k) as GeometryShape.Point,
            enlarge(cube.axisX, o2, k) as GeometryShape.Vector,
            enlarge(cube.axisY, o2, k) as GeometryShape.Vector,
            cube.width, cube.height, cube.depth
        )
    }

    else if ('centerBase1' in o1 && 'centerBase2' in o1 && 'radius' in o1) {
        let cy: GeometryShape.Cylinder = o1 as GeometryShape.Cylinder;
        return Factory.createCylinder(
            cy.props,
            enlarge(cy.centerBase1, o2, k) as GeometryShape.Point,
            enlarge(cy.centerBase2, o2, k) as GeometryShape.Point,
            cy.radius
        )
    }

    else if ('base' in o1 && 'shiftVector' in o1) {
        let pr: GeometryShape.Prism = o1 as GeometryShape.Prism;
        return Factory.createPrism(
            pr.props,
            enlarge(pr.base, o2, k) as GeometryShape.Polygon,
            pr.shiftVector
        )
    }

    else if ('base' in o1 && 'apex' in o1) {
        let py: GeometryShape.Pyramid = o1 as GeometryShape.Pyramid;
        return Factory.createPyramid(
            py.props,
            enlarge(py.base, o2, k) as GeometryShape.Polygon,
            enlarge(py.apex, o2, k) as GeometryShape.Point
        )
    }

    else if ('center' in o1 && 'apex' in o1) {
        let py: GeometryShape.Cone = o1 as GeometryShape.Cone;
        return Factory.createCone(
            py.props,
            enlarge(py.center, o2, k) as GeometryShape.Point,
            enlarge(py.apex, o2, k) as GeometryShape.Point,
            py.radius
        )
    }

    else {
        throw new Error('Cannot perform reflection');
    }
}

export const getLength = (shape: GeometryShape.Segment | GeometryShape.Polygon | GeometryShape.Circle | GeometryShape.SemiCircle): number => {
    if ('startSegment' in shape) {
        return getDistance(shape.startSegment, shape.endSegment);
    }

    else if ('points' in shape) {
        let perimeter = 0;
        for (let i = 0; i < shape.points.length; i++) {
            perimeter += getDistance(shape.points[i], shape.points[(i + 1) % shape.points.length]);
        }

        return perimeter;
    }

    else if ('radius' in shape) {
        return 2 * shape.radius * Math.PI;
    }

    else {
        return getDistance(shape.start, shape.end) * Math.PI / 2;
    }
}