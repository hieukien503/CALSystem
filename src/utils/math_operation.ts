import * as GeometryShape from '../types/geometry';
import { isCuboid, isPrism, isPyramid, isSphere, isCylinder, isCone, isPoint, isPolygon, isVector, isCircle, isRay, isLine, isSegment, isPlane } from './type_guard';
const math = require('mathjs');

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
    return Math.hypot(x, y, z);
}

const mult_scalar = (x: number, y: number, z: number, scalar: number) => {
    return {
        x: x * scalar,
        y: y * scalar,
        z: z * scalar
    }
}

const isColinear = (A: GeometryShape.Point, B: GeometryShape.Point, C: GeometryShape.Point) => {
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
    return L2_norm(cross_product.x, cross_product.y, cross_product.z) === 0;
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

export const getDistance = (shape1: GeometryShape.Point, shape2: GeometryShape.Point) => {
    return Math.sqrt((shape1.x - shape2.x) ** 2 + (shape1.y - shape2.y) ** 2 + ((shape1.z ?? 0) - (shape2.z ?? 0)) ** 2);
}

const getPerimeter = (shape: GeometryShape.Polygon) => {
    let perimeter = 0;
    for (let i = 0; i < shape.points.length; i++) {
        perimeter += getDistance(shape.points[i], shape.points[i + 1]);
    }

    perimeter += getDistance(shape.points[shape.points.length - 1], shape.points[0]);
    return perimeter;
}

export const getIntersections2D = (shape1: GeometryShape.Shape, shape2: GeometryShape.Shape): {x: number, y: number, z?: number}[] => {
    if (!isLine(shape1) && !isCircle(shape1) && !isSegment(shape1) && !isRay(shape1) && !isPolygon(shape1)) {
        throw new Error('Shape1 must be a valid shape for intersection');
    }

    if (!isLine(shape2) && !isCircle(shape2) && !isSegment(shape2) && !isRay(shape2) && !isPolygon(shape2)) {
        throw new Error('Shape2 must be a valid shape for intersection');
    }

    if (isLine(shape1) || isRay(shape1) || isSegment(shape1)) {
        let start = {
            x: (isLine(shape1) ? shape1.startLine.x : (isRay(shape1) ? shape1.startRay.x : shape1.startSegment.x)),
            y: (isLine(shape1) ? shape1.startLine.y : (isRay(shape1) ? shape1.startRay.y : shape1.startSegment.y)),
            z: (isLine(shape1) ? shape1.startLine.z : (isRay(shape1) ? shape1.startRay.z : shape1.startSegment.z)) ?? 0
        }

        let end = {
            x: (isLine(shape1) ? shape1.endLine.x : (isRay(shape1) ? shape1.endRay.x : shape1.endSegment.x)),
            y: (isLine(shape1) ? shape1.endLine.y : (isRay(shape1) ? shape1.endRay.y : shape1.endSegment.y)),
            z: (isLine(shape1) ? shape1.endLine.z : (isRay(shape1) ? shape1.endRay.z : shape1.endSegment.z)) ?? 0
        }

        if (isLine(shape2) || isRay(shape2) || isSegment(shape2)) {
            let start2 = {
                x: (isLine(shape2) ? shape2.startLine.x : (isRay(shape2) ? shape2.startRay.x : shape2.startSegment.x)),
                y: (isLine(shape2) ? shape2.startLine.y : (isRay(shape2) ? shape2.startRay.y : shape2.startSegment.y)),
                z: (isLine(shape2) ? shape2.startLine.z : (isRay(shape2) ? shape2.startRay.z : shape2.startSegment.z)) ?? 0
            }

            let end2 = {
                x: (isLine(shape2) ? shape2.endLine.x : (isRay(shape2) ? shape2.endRay.x : shape2.endSegment.x)),
                y: (isLine(shape2) ? shape2.endLine.y : (isRay(shape2) ? shape2.endRay.y : shape2.endSegment.y)),
                z: (isLine(shape2) ? shape2.endLine.z : (isRay(shape2) ? shape2.endRay.z : shape2.endSegment.z)) ?? 0
            }

            let A = math.intersect(
                [start.x, start.y, start.z],
                [end.x, end.y, end.z],
                [start2.x, start2.y, start2.z],
                [end2.x, end2.y, end2.z]
            )

            if (A === null) {
                return []
            }

            let v = {
                x: A[0] - start.x,
                y: A[1] - start.y,
                z: (A.length == 2 ? 0 : A[2]) - start.z
            }

            let crossProduct = cross(
                end.x - start.x,
                end.y - start.y,
                end.z - start.z,
                v.x,
                v.y,
                v.z
            )

            if (isRay(shape1)) {
                if (L2_norm(crossProduct.x, crossProduct.y, crossProduct.z) !== 0) {
                    return [];
                }

                let v1 = {
                    x: A[0] - start2.x,
                    y: A[1] - start2.y,
                    z: (A.length === 2 ? 0 : A[2]) - start2.z
                }

                let crossProduct2 = cross(
                    end2.x - start2.x,
                    end2.y - start2.y,
                    end2.z - start2.z,
                    v1.x,
                    v1.y,
                    v1.z
                )

                if (isRay(shape2)) {
                    if (L2_norm(crossProduct2.x, crossProduct2.y, crossProduct2.z) !== 0) {
                        return [];
                    }
                }

                else if (isSegment(shape2)) {
                    if (L2_norm(crossProduct2.x, crossProduct2.y, crossProduct2.z) !== 0) {
                        return [];
                    }

                    if (L2_norm(v1.x, v1.y, v1.z) > L2_norm(end2.x - start2.x, end2.y - start2.y, end2.z - start2.z)) {
                        return [];
                    }
                }

                return [
                    {
                        x: A[0],
                        y: A[1],
                        z: (A.length === 2 ? 0 : A[2])
                    }
                ]
            }

            else if (isSegment(shape1)) {
                if (L2_norm(crossProduct.x, crossProduct.y, crossProduct.z) !== 0) {
                    return [];
                }

                if (L2_norm(v.x, v.y, v.z) > L2_norm(end.x - start.x, end.y - start.y, end.z - start.z)) {
                    return [];
                }

                let v1 = {
                    x: A[0] - start2.x,
                    y: A[1] - start2.y,
                    z: (A.length === 2 ? 0 : A[2]) - start2.z
                }

                let crossProduct2 = cross(
                    end2.x - start2.x,
                    end2.y - start2.y,
                    end2.z - start2.z,
                    v1.x,
                    v1.y,
                    v1.z
                )

                if (isRay(shape2)) {
                    if (L2_norm(crossProduct2.x, crossProduct2.y, crossProduct2.z) !== 0) {
                        return [];
                    }
                }

                else if (isSegment(shape2)) {
                    if (L2_norm(crossProduct2.x, crossProduct2.y, crossProduct2.z) !== 0) {
                        return [];
                    }

                    if (L2_norm(v1.x, v1.y, v1.z) > L2_norm(end2.x - start2.x, end2.y - start2.y, end2.z - start2.z)) {
                        return [];
                    }
                }

                return [
                    {
                        x: A[0],
                        y: A[1],
                        z: (A.length === 2 ? 0 : A[2])
                    }
                ]
            }

            else {
                let v1 = {
                    x: A[0] - start2.x,
                    y: A[1] - start2.y,
                    z: (A.length === 2 ? 0 : A[2]) - start2.z
                }

                let crossProduct = cross(
                    end2.x - start2.x,
                    end2.y - start2.y,
                    end2.z - start2.z,
                    v1.x,
                    v1.y,
                    v1.z
                )

                if (isRay(shape2)) {
                    if (L2_norm(crossProduct.x, crossProduct.y, crossProduct.z) !== 0) {
                        return [];
                    }
                }

                else if (isSegment(shape2)) {
                    if (L2_norm(crossProduct.x, crossProduct.y, crossProduct.z) !== 0) {
                        return [];
                    }

                    if (L2_norm(v1.x, v1.y, v1.z) > L2_norm(end2.x - start2.x, end2.y - start2.y, end2.z - start2.z)) {
                        return [];
                    }
                }

                return [
                    {
                        x: A[0],
                        y: A[1],
                        z: (A.length === 2 ? 0 : A[2])
                    }
                ]
            }
        }
        
        else if (isCircle(shape2)) {
            let u = {
                x: end.x - start.x,
                y: end.y - start.y,
                z: end.z - start.z
            }

            let u1 = {
                x: shape2.centerC.x - start.x,
                y: shape2.centerC.y - start.y,
                z: (shape2.centerC.z ?? 0) - start.z
            }

            // Solve ||u1 - u * t||^2 = r^2
            const r = shape2.radius;
            const a = dot(u.x, u.y, u.z, u.x, u.y, u.z);
            const b = -2 * dot(u1.x, u1.y, u1.z, u.x, u.y, u.z);
            const c = dot(u1.x, u1.y, u1.z, u1.x, u1.y, u1.z) - r * r;
            const discriminant = b * b - 4 * a * c;
            if (discriminant < 0) {
                return []; // No intersection
            }

            else if (discriminant === 0) {
                let t = -b / (2 * a);
                if (
                    (isRay(shape1) && t < 0) ||
                    (isSegment(shape1) && (t < 0 || t > 1))
                ) {
                    return []; // No intersection
                }
                return [{
                    x: start.x + u.x * t,
                    y: start.y + u.y * t,
                    z: (start.z ?? 0) + u.z * t
                }]
            }

            else {
                const t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
                const t2 = (-b - Math.sqrt(discriminant)) / (2 * a);
                if (isRay(shape1)) {
                    if (t1 < 0 && t2 < 0) {
                        return []; // No intersection
                    }

                    if (t1 < 0) {
                        return [{
                            x: start.x + u.x * t2,
                            y: start.y + u.y * t2,
                            z: (start.z ?? 0) + u.z * t2
                        }]
                    }

                    if (t2 < 0) {
                        return [{
                            x: start.x + u.x * t1,
                            y: start.y + u.y * t1,
                            z: (start.z ?? 0) + u.z * t1
                        }]
                    }

                    return [
                        {
                            x: start.x + u.x * t1,
                            y: start.y + u.y * t1,
                            z: (start.z ?? 0) + u.z * t1
                        },
                        {
                            x: start.x + u.x * t2,
                            y: start.y + u.y * t2,
                            z: (start.z ?? 0) + u.z * t2
                        }
                    ]
                }

                if (isSegment(shape1)) {
                    if ((t1 < 0 || t1 > 1) && (t2 < 0 || t2 > 1)) {
                        return []; // No intersection
                    }

                    if (t1 < 0 || t1 > 1) {
                        return [{
                            x: start.x + u.x * t2,
                            y: start.y + u.y * t2,
                            z: (start.z ?? 0) + u.z * t2
                        }]
                    }

                    if (t2 < 0 || t2 > 1) {
                        return [{
                            x: start.x + u.x * t1,
                            y: start.y + u.y * t1,
                            z: (start.z ?? 0) + u.z * t1
                        }]
                    }

                    return [
                        {
                            x: start.x + u.x * t1,
                            y: start.y + u.y * t1,
                            z: (start.z ?? 0) + u.z * t1
                        },
                        {
                            x: start.x + u.x * t2,
                            y: start.y + u.y * t2,
                            z: (start.z ?? 0) + u.z * t2
                        }
                    ]
                }

                return [
                    {
                        x: start.x + u.x * t1,
                        y: start.y + u.y * t1,
                        z: (start.z ?? 0) + u.z * t1
                    },
                    {
                        x: start.x + u.x * t2,
                        y: start.y + u.y * t2,
                        z: (start.z ?? 0) + u.z * t2
                    }
                ]
            }
        }

        else if (isPolygon(shape2)) {
            let intersections = [];
            for (let i = 0; i < shape2.points.length; i++) {
                let point1 = shape2.points[i];
                let point2 = shape2.points[(i + 1) % shape2.points.length];

                let u = {
                    x: point2.x - point1.x,
                    y: point2.y - point1.y,
                    z: (point2.z ?? 0) - (point1.z ?? 0)
                }

                let v = {
                    x: end.x - start.x,
                    y: end.y - start.y,
                    z: end.z - start.z
                }

                let A = 
                [
                    [u.x, -v.x, 0],
                    [u.y, -v.y, 0],
                    [u.z, -v.z, 0]
                ]

                let b = [
                    [start.x - point1.x],
                    [start.y - point1.y],
                    [(start.z ?? 0) - (point1.z ?? 0)]
                ];

                let matrixA = math.matrix(A);
                const rankA = math.rank(matrixA);
                const augmentedMatrix = math.concat(matrixA, math.matrix(b), 1);
                const rankAug = math.rank(augmentedMatrix);
                if (rankA < rankAug) {
                    continue; // The line does not intersect this edge
                }

                else if (rankA < math.size(matrixA)[1]) {
                    continue; // The line is coincident with this edge
                }

                else {
                    const A_pinv = math.pinv(A);
                    const solutions = math.multiply(A_pinv, b);
                    if (
                        (isRay(shape1) && solutions.get([0, 0]) < 0) ||
                        (isSegment(shape1) && (solutions.get([0, 0]) < 0 || solutions.get([0, 0]) > 1))
                    ) {
                        continue; // The intersection point is not valid
                    }

                    if (solutions.get([0, 1]) < 0 || solutions.get([0, 1]) > 1) {
                        continue; // The intersection point is not valid
                    }

                    // If we reach here, the intersection point is valid
                    intersections.push({
                        x: start.x + v.x * solutions.get([0, 0]),
                        y: start.y + v.y * solutions.get([0, 0]),
                        z: (start.z ?? 0) + v.z * solutions.get([0, 0])
                    });
                }
            }

            return intersections;
        }

        else {
            throw new Error('Shape2 must be a valid shape for intersection');
        }
    }

    else if (isCircle(shape1)) {
        if (isLine(shape2) || isRay(shape2) || isSegment(shape2)) {
            return getIntersections2D(shape2, shape1);
        }

        if (isCircle(shape2)) {
            // Two circles intersection
            let d = getDistance(shape1.centerC, shape2.centerC);
            if (d === 0 && shape1.radius === shape2.radius) {
                throw new Error('The circles are coincident');
            }

            if (d === 0) {
                return []; // No intersection, circles are concentric
            }
            
            if (d > shape1.radius + shape2.radius || d < Math.abs(shape1.radius - shape2.radius)) {
                return []; // No intersection
            }

            let a = (shape1.radius ** 2 - shape2.radius ** 2 + d ** 2) / (2 * d);
            let h = Math.sqrt(shape1.radius ** 2 - a ** 2);
            let p = {
                x: shape1.centerC.x + a * (shape2.centerC.x - shape1.centerC.x) / d,
                y: shape1.centerC.y + a * (shape2.centerC.y - shape1.centerC.y) / d,
                z: (shape1.centerC.z ?? 0) + a * ((shape2.centerC.z ?? 0) - (shape1.centerC.z ?? 0)) / d
            };

            if (h === 0) {
                return [p]; // One intersection point
            }

            return [
                {
                    x: p.x + h * (shape2.centerC.y - shape1.centerC.y) / d,
                    y: p.y - h * (shape2.centerC.x - shape1.centerC.x) / d,
                    z: (p.z ?? 0) + h * ((shape2.centerC.z ?? 0) - (shape1.centerC.z ?? 0)) / d
                },
                {
                    x: p.x - h * (shape2.centerC.y - shape1.centerC.y) / d,
                    y: p.y + h * (shape2.centerC.x - shape1.centerC.x) / d,
                    z: (p.z ?? 0) - h * ((shape2.centerC.z ?? 0) - (shape1.centerC.z ?? 0)) / d
                }
            ];
        }

        else if (isPolygon(shape2)) {
            let intersections = [];
            for (let i = 0; i < shape2.points.length; i++) {
                let point1 = shape2.points[i];
                let point2 = shape2.points[(i + 1) % shape2.points.length];
                let u = {
                    x: point2.x - point1.x,
                    y: point2.y - point1.y,
                    z: (point2.z ?? 0) - (point1.z ?? 0)
                }

                let v = {
                    x: shape1.centerC.x - point1.x,
                    y: shape1.centerC.y - point1.y,
                    z: (shape1.centerC.z ?? 0) - (point1.z ?? 0)
                }

                // Solve ||v - u * t||^2 = r^2
                const r = shape1.radius;
                const a = dot(u.x, u.y, u.z, u.x, u.y, u.z);
                const b = -2 * dot(v.x, v.y, v.z, u.x, u.y, u.z);
                const c = dot(v.x, v.y, v.z, v.x, v.y, v.z) - r * r;
                const discriminant = b * b - 4 * a * c;
                if (discriminant < 0) {
                    continue; // No intersection
                }

                if (discriminant == 0) {
                    let t = -b / (2 * a);
                    if (t < 0 || t > 1) {
                        continue; // No intersection
                    }

                    intersections.push({
                        x: point1.x + u.x * t,
                        y: point1.y + u.y * t,
                        z: (point1.z ?? 0) + u.z * t
                    });
                }

                else {
                    const t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
                    const t2 = (-b - Math.sqrt(discriminant)) / (2 * a);
                    if (t1 >= 0 && t1 <= 1) {
                        intersections.push({
                            x: point1.x + u.x * t1,
                            y: point1.y + u.y * t1,
                            z: (point1.z ?? 0) + u.z * t1
                        });
                    }

                    if (t2 >= 0 && t2 <= 1) {
                        intersections.push({
                            x: point1.x + u.x * t2,
                            y: point1.y + u.y * t2,
                            z: (point1.z ?? 0) + u.z * t2
                        });
                    }
                }
            }

            return intersections;
        }

        else {
            throw new Error('Shape2 must be a valid shape for intersection');
        }
    }

    else if (isPolygon(shape1)) {
        if (isLine(shape2) || isRay(shape2) || isSegment(shape2) || isCircle(shape2)) {
            return getIntersections2D(shape2, shape1);
        }

        else if (isPolygon(shape2)) {
            let intersections = [];
            for (let i = 0; i < shape1.points.length; i++) {
                let point1 = shape1.points[i];
                let point2 = shape1.points[(i + 1) % shape1.points.length];
                let u = {
                    x: point2.x - point1.x,
                    y: point2.y - point1.y,
                    z: (point2.z ?? 0) - (point1.z ?? 0)
                }

                for (let j = 0; j < shape2.points.length; j++) {
                    let point3 = shape2.points[j];
                    let point4 = shape2.points[(j + 1) % shape2.points.length];
                    let v = {
                        x: point4.x - point3.x,
                        y: point4.y - point3.y,
                        z: (point4.z ?? 0) - (point3.z ?? 0)
                    }

                    let A = 
                    [
                        [u.x, -v.x, 0],
                        [u.y, -v.y, 0],
                        [u.z, -v.z, 0]
                    ]

                    let b = 
                    [
                        [point3.x - point1.x],
                        [point3.y - point1.y],
                        [(point3.z ?? 0) - (point1.z ?? 0)]
                    ]

                    let matrixA = math.matrix(A);
                    const rankA = math.rank(matrixA);
                    const augmentedMatrix = math.concat(matrixA, math.matrix(b), 1);
                    const rankAug = math.rank(augmentedMatrix);
                    if (rankA < rankAug) {
                        continue; // The segments do not intersect
                    }

                    if (rankA < math.size(matrixA)[1]) {
                        continue; // The segments are coincident
                    }

                    const A_pinv = math.pinv(A);
                    const solutions = math.multiply(A_pinv, b);
                    if (solutions.get([0, 0]) < 0 || solutions.get([0, 0]) > 1 || solutions.get([0, 1]) < 0 || solutions.get([0, 1]) > 1) {
                        continue; // The intersection point is not valid
                    }

                    // If we reach here, the intersection point is valid
                    intersections.push({
                        x: point1.x + u.x * solutions.get([0, 0]),
                        y: point1.y + u.y * solutions.get([0, 0]),
                        z: (point1.z ?? 0) + u.z * solutions.get([0, 0])
                    });
                }
            }

            return intersections;
        }

        else {
            throw new Error('Shape2 must be a valid shape for intersection');
        }
    }

    else {
        throw new Error('Shape1 must be a valid shape for intersection');
    }
}

export const getIntersections3D = (shape1: GeometryShape.Shape, shape2: GeometryShape.Shape): {x: number, y: number, z?: number}[] => {
    if (!isPlane(shape1) && !isLine(shape1) && !isRay(shape1) && !isSegment(shape1) && !isSphere(shape1)) {
        throw new Error('Shape1 must be a valid shape for intersection');
    }

    if (!isPlane(shape2) && !isLine(shape2) && !isRay(shape2) && !isSegment(shape2) && !isSphere(shape2)) {
        throw new Error('Shape2 must be a valid shape for intersection');
    }

    if (isLine(shape1) || isRay(shape1) || isSegment(shape1)) {
        if (isLine(shape2) || isRay(shape2) || isSegment(shape2)) {
            return getIntersections2D(shape1, shape2);
        }

        let start = {
            x: (isLine(shape1) ? shape1.startLine.x : (isRay(shape1) ? shape1.startRay.x : shape1.startSegment.x)),
            y: (isLine(shape1) ? shape1.startLine.y : (isRay(shape1) ? shape1.startRay.y : shape1.startSegment.y)),
            z: (isLine(shape1) ? shape1.startLine.z : (isRay(shape1) ? shape1.startRay.z : shape1.startSegment.z)) ?? 0
        }

        let end = {
            x: (isLine(shape1) ? shape1.endLine.x : (isRay(shape1) ? shape1.endRay.x : shape1.endSegment.x)),
            y: (isLine(shape1) ? shape1.endLine.y : (isRay(shape1) ? shape1.endRay.y : shape1.endSegment.y)),
            z: (isLine(shape1) ? shape1.endLine.z : (isRay(shape1) ? shape1.endRay.z : shape1.endSegment.z)) ?? 0
        }

        let u = {
            x: end.x - start.x,
            y: end.y - start.y,
            z: (end.z ?? 0) - (start.z ?? 0)
        }

        if (isPlane(shape2)) {
            let n = {
                x: shape2.norm.endVector.x - shape2.norm.startVector.x,
                y: shape2.norm.endVector.y - shape2.norm.startVector.y,
                z: (shape2.norm.endVector.z ?? 0) - (shape2.norm.startVector.z ?? 0),
            }

            let A = math.intersect(
                [start.x, start.y, start.z],
                [end.x, end.y, end.z],
                [n.x, n.y, n.z, n.x * shape2.point.x, n.y * shape2.point.y, n.z * (shape2.point.z ?? 0)]
            )

            if (A === null) {
                return [];
            }

            let v = {
                x: A[0] - start.x,
                y: A[1] - start.y,
                z: (A.length == 2 ? 0 : A[2]) - start.z
            }

            let crossProduct = cross(
                end.x - start.x,
                end.y - start.y,
                end.z - start.z,
                v.x,
                v.y,
                v.z
            )

            if (isRay(shape1)) {
                if (L2_norm(crossProduct.x, crossProduct.y, crossProduct.z) !== 0) {
                    return [];
                }
            }

            else if (isSegment(shape1)) {
                if (L2_norm(crossProduct.x, crossProduct.y, crossProduct.z) !== 0) {
                    return [];
                }

                if (L2_norm(v.x, v.y, v.z) > L2_norm(end.x - start.x, end.y - start.y, end.z - start.z)) {
                    return [];
                }
            }

            return [
                {
                    x: A[0],
                    y: A[1],
                    z: (A.length === 2 ? 0 : A[2])
                }
            ]
        }

        else if (isSphere(shape2)) {
            // Sphere intersection with line
            let u1 = {
                x: shape2.centerS.x - start.x,
                y: shape2.centerS.y - start.y,
                z: (shape2.centerS.z ?? 0) - (start.z ?? 0)
            }

            // Solve ||u1 - u * t||^2 = r^2
            const r = shape2.radius;
            const a = dot(u.x, u.y, u.z, u.x, u.y, u.z);
            const b = -2 * dot(u1.x, u1.y, u1.z, u.x, u.y, u.z);
            const c = dot(u1.x, u1.y, u1.z, u1.x, u1.y, u1.z) - r * r;
            const discriminant = b * b - 4 * a * c;
            if (discriminant < 0) {
                return []; // No intersection
            }

            else if (discriminant === 0) {
                let t = -b / (2 * a);
                if (
                    (isRay(shape1) && t < 0) ||
                    (isSegment(shape1) && (t < 0 || t > 1))
                ) {
                    return []; // No intersection
                }
                return [{
                    x: start.x + u.x * t,
                    y: start.y + u.y * t,
                    z: (start.z ?? 0) + u.z * t
                }];
            }

            else {
                const t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
                const t2 = (-b - Math.sqrt(discriminant)) / (2 * a);
                if (isRay(shape1)) {
                    if (t1 < 0 && t2 < 0) {
                        return []; // No intersection
                    }

                    if (t1 < 0) {
                        return [{
                            x: start.x + u.x * t2,
                            y: start.y + u.y * t2,
                            z: (start.z ?? 0) + u.z * t2
                        }];
                    }

                    if (t2 < 0) {
                        return [{
                            x: start.x + u.x * t1,
                            y: start.y + u.y * t1,
                            z: (start.z ?? 0) + u.z * t1
                        }];
                    }
                }

                else if (isSegment(shape1)) {
                    if ((t1 < 0 || t1 > 1) && (t2 < 0 || t2 > 1)) {
                        return []; // No intersection
                    }

                    if (t1 < 0 || t1 > 1) {
                        return [{
                            x: start.x + u.x * t2,
                            y: start.y + u.y * t2,
                            z: (start.z ?? 0) + u.z * t2
                        }];
                    }

                    if (t2 < 0 || t2 > 1) {
                        return [{
                            x: start.x + u.x * t1,
                            y: start.y + u.y * t1,
                            z: (start.z ?? 0) + u.z * t1
                        }];
                    }
                }

                return [
                    {
                        x: start.x + u.x * t1,
                        y: start.y + u.y * t1,
                        z: (start.z ?? 0) + u.z * t1
                    },
                    {
                        x: start.x + u.x * t2,
                        y: start.y + u.y * t2,
                        z: (start.z ?? 0) + u.z * t2
                    }
                ]
            }
        }

        else {
            throw new Error('Shape2 must be a valid shape for intersection');
        }
    }

    else if (isPlane(shape1)) {
        if (isLine(shape2) || isRay(shape2) || isSegment(shape2)) {
            return getIntersections3D(shape1, shape2);
        }

        return []; // Plane intersection with sphere will not be handled here
    }

    else if (isSphere(shape1)) {
        if (isLine(shape2) || isRay(shape2) || isSegment(shape2)) {
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
    if (L2_norm(crossProduct.x, crossProduct.y, crossProduct.z) === 0) {
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
        x: solutions.get([0, 0]),
        y: solutions.get([1, 0]),
        z: solutions.get([2, 0]) ?? 0
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

    if (d === shape2.radius) {
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

    let radius = Math.sqrt(shape2.radius ** 2 - d ** 2);
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

    if (d === 0 && shape1.radius === shape2.radius) {
        throw new Error('The spheres are coincident');
    }

    if (d === 0) {
        return undefined;
    }

    let a = (shape1.radius ** 2 - shape2.radius ** 2 + d ** 2) / (2 * d);
    let h = Math.sqrt(shape1.radius ** 2 - a ** 2);
    let P = {
        x: shape1.centerS.x + a * (shape2.centerS.x - shape1.centerS.x) / d,
        y: shape1.centerS.y + a * (shape2.centerS.y - shape1.centerS.y) / d,
        z: (shape1.centerS.z ?? 0) + a * ((shape2.centerS.z ?? 0) - (shape1.centerS.z ?? 0)) / d
    }

    if (h === 0) {
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

export const getCentroid = (shape: GeometryShape.Polygon) => {
    const centroid = {
        x: 0,
        y: 0,
        z: 0
    }

    shape.points.forEach(point => {
        centroid.x += point.x / shape.points.length;
        centroid.y += point.y / shape.points.length;
        centroid.z += (point.z ?? 0) / shape.points.length;
    });

    return centroid;
}

export const getArea = (shape: GeometryShape.Polygon) => {
    let area = 0;

    for (let i = 0; i < shape.points.length; i++) {
        area += shape.points[i].x * shape.points[i + 1].y - shape.points[i + 1].x * shape.points[i].y;
    }

    return Math.abs(area) / 2;
}

export const orthocenter = (A: GeometryShape.Point, B: GeometryShape.Point, C: GeometryShape.Point) => {
    if (isColinear(A, B, C)) {
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
        x: solution[0],
        y: solution[1],
        z: solution[2]
    }
}

export const circumcenter = (A: GeometryShape.Point, B: GeometryShape.Point, C: GeometryShape.Point) => {
    if (isColinear(A, B, C)) {
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

    const ab = cross(AB.x, AB.y, AB.z, AC.x, AC.y, AC.z);
    const denominator = 2 * Math.pow(L2_norm(ab.x, ab.y, ab.z), 2);
    const first = mult_scalar(ab.x, ab.y, ab.z, Math.pow(L2_norm(AC.x, AC.y, AC.z), 2));
    const second = mult_scalar(ab.x, ab.y, ab.z, Math.pow(L2_norm(AB.x, AB.y, AB.z), 2));
    const third = cross(first.x, first.y, first.z, AB.x, AB.y, AB.z);
    const fourth = cross(second.x, second.y, second.z, AC.x, AC.y, AC.z);

    const numerator = {
        x: third.x + fourth.x,
        y: third.y + fourth.y,
        z: third.z + fourth.z
    };

    return {
        x: A.x + numerator.x / denominator,
        y: A.y + numerator.y / denominator,
        z: (A.z ?? 0) + numerator.z / denominator
    }
}

export const incenter = (A: GeometryShape.Point, B: GeometryShape.Point, C: GeometryShape.Point) => {
    if (isColinear(A, B, C)) {
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
    if (isColinear(A, B, C)) {
        throw new Error('The points are collinear');
    }
    
    let AB = L2_norm(B.x - A.x, B.y - A.y, (B.z ?? 0) - (A.z ?? 0));
    let AC = L2_norm(C.x - A.x, C.y - A.y, (C.z ?? 0) - (A.z ?? 0));
    let BC = L2_norm(C.x - B.x, C.y - B.y, (C.z ?? 0) - (B.z ?? 0));

    let p = (AB + AC + BC) / 2;
    let area = Math.sqrt(p * (p - AB) * (p - AC) * (p - BC));

    return AB * AC * BC / (4 * area);
}

export const inradius = (A: GeometryShape.Point, B: GeometryShape.Point, C: GeometryShape.Point) => {
    if (isColinear(A, B, C)) {
        throw new Error('The points are collinear');
    }

    let AB = L2_norm(B.x - A.x, B.y - A.y, (B.z ?? 0) - (A.z ?? 0));
    let AC = L2_norm(C.x - A.x, C.y - A.y, (C.z ?? 0) - (A.z ?? 0));
    let BC = L2_norm(C.x - B.x, C.y - B.y, (C.z ?? 0) - (B.z ?? 0));
    
    let p = (AB + AC + BC) / 2;
    let area = Math.sqrt(p * (p - AB) * (p - AC) * (p - BC));

    return area / p;
}

export const volume = (shape: GeometryShape.Shape) => {
    if (isCuboid(shape)) {
        let x = Math.abs(shape.bottomRightFront.x - shape.topLeftBack.x);
        let y = Math.abs(shape.bottomRightFront.y - shape.topLeftBack.y);
        let z = Math.abs((shape.bottomRightFront.z ?? 0) - (shape.topLeftBack.z ?? 0));
        return x * y * z;
    }

    if (isPrism(shape)) {
        let base_area = getArea(shape.base);
        let height = distance(shape.base, shape.top_point);
        return base_area * height;
    }

    if (isPyramid(shape)) {
        let base_area = getArea(shape.base);
        let height = distance(shape.base, shape.apex);
        return (base_area * height) / 3;
    }
    
    if (isSphere(shape)) {
        return (4 / 3) * Math.PI * Math.pow(shape.radius, 3);
    }

    if (isCylinder(shape)) {
        let height = getDistance(shape.centerBase1, shape.centerBase2);
        let base_area = Math.PI * Math.pow(shape.radius, 2);
        return base_area * height;
    }

    if (isCone(shape)) {
        let height = getDistance(shape.center, shape.apex);
        let base_area = Math.PI * Math.pow(shape.radius, 2);
        return (base_area * height) / 3;
    }

    throw new Error('Invalid shape');
}

export const surface_area = (shape: GeometryShape.Shape) => {
    if (isCuboid(shape)) {
        let x = Math.abs(shape.bottomRightFront.x - shape.topLeftBack.x);
        let y = Math.abs(shape.bottomRightFront.y - shape.topLeftBack.y);
        let z = Math.abs((shape.bottomRightFront.z ?? 0) - (shape.topLeftBack.z ?? 0));
        return 2 * (x * y + x * z + y * z);
    }

    if (isPrism(shape)) {
        let base_area = getArea(shape.base);
        let height = distance(shape.base, shape.top_point);
        let perimeter = getPerimeter(shape.base);
        return 2 * base_area + perimeter * height;
    }

    if (isPyramid(shape)) {
        let perimeter = getPerimeter(shape.base);
        let mid = midPoint(shape.base.points[0], shape.base.points[1]);
        let d = L2_norm(mid.x - shape.apex.x, mid.y - shape.apex.y, (mid.z ?? 0) - (shape.apex.z ?? 0));
        return perimeter / 2 * d + getArea(shape.base);
    }

    if (isSphere(shape)) {
        return 4 * Math.PI * Math.pow(shape.radius, 2);
    }
    
    if (isCylinder(shape)) {
        let height = getDistance(shape.centerBase1, shape.centerBase2);
        let base_area = Math.PI * Math.pow(shape.radius, 2);
        return 2 * base_area + 2 * Math.PI * shape.radius * height;
    }
    
    if (isCone(shape)) {
        let height = getDistance(shape.center, shape.apex);
        let base_area = Math.PI * Math.pow(shape.radius, 2);
        let slant_height = Math.sqrt(Math.pow(shape.radius, 2) + Math.pow(height, 2));
        return Math.PI * shape.radius * slant_height + base_area;
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
        const angleA = Math.atan2(BA.y, BA.x);
        const angleC = Math.atan2(BC.y, BC.x);
        let angle = angleC - angleA;
        if (angle < 0) {
            angle += 2 * Math.PI;
        }

        return angle * (180 / Math.PI); // Convert to degrees
    }

    // Handle 3D points
    const BA = { x: A.x - B.x, y: A.y - B.y, z: (A.z ?? 0) - (B.z ?? 0) };
    const BC = { x: C.x - B.x, y: C.y - B.y, z: (C.z ?? 0) - (B.z ?? 0) };
    const dotProduct = dot(BA.x, BA.y, BA.z, BC.x, BC.y, BC.z);
    const normBA = L2_norm(BA.x, BA.y, BA.z);
    const normBC = L2_norm(BC.x, BC.y, BC.z);
    const cosTheta = dotProduct / (normBA * normBC);
    const clampedCosTheta = Math.max(-1, Math.min(1, cosTheta)); // Clamp to avoid NaN due to floating point precision issues
    const angle = Math.acos(clampedCosTheta); // Angle in radians
    return angle * (180 / Math.PI); // Convert to degrees
}

export const angleBetweenLines = (line1: GeometryShape.Line, line2: GeometryShape.Line) => {
    if (line1.startLine.z === undefined || line1.endLine.z === undefined || 
        line2.startLine.z === undefined || line2.endLine.z === undefined) {
        // Handle 2D lines
        const v1 = {
            x: line1.endLine.x - line1.startLine.x,
            y: line1.endLine.y - line1.startLine.y
        }

        const v2 = {
            x: line2.endLine.x - line2.startLine.x,
            y: line2.endLine.y - line2.startLine.y
        }

        const angle1 = Math.atan2(v1.y, v1.x);
        const angle2 = Math.atan2(v2.y, v2.x);
        let angle = angle2 - angle1;
        if (angle < 0) {
            angle += 2 * Math.PI;
        }

        return angle * (180 / Math.PI); // Convert to degrees
    }

    // Handle 3D lines
    const v1 = {
        x: line1.endLine.x - line1.startLine.x,
        y: line1.endLine.y - line1.startLine.y,
        z: (line1.endLine.z ?? 0) - (line1.startLine.z ?? 0)
    }

    const v2 = {
        x: line2.endLine.x - line2.startLine.x,
        y: line2.endLine.y - line2.startLine.y,
        z: (line2.endLine.z ?? 0) - (line2.startLine.z ?? 0)
    }

    const dotProduct = dot(v1.x, v1.y, v1.z, v2.x, v2.y, v2.z);
    const normV1 = L2_norm(v1.x, v1.y, v1.z);
    const normV2 = L2_norm(v2.x, v2.y, v2.z);
    const cosTheta = Math.abs(dotProduct) / (normV1 * normV2);
    const clampedCosTheta = Math.max(-1, Math.min(1, cosTheta)); // Clamp to avoid NaN due to floating point precision issues
    const angle = Math.acos(clampedCosTheta); // Angle in radians
    return angle * (180 / Math.PI); // Convert to degrees
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
    const angle = Math.acos(clampedCosTheta); // Angle in radians
    return angle * (180 / Math.PI); // Convert to degrees
}

export const bisector_angle_line1 = (A: GeometryShape.Point, B: GeometryShape.Point, C: GeometryShape.Point) => {
    if (isColinear(A, B, C)) {
        if (A.z === undefined || B.z === undefined || C.z === undefined) {
            return {
                point: B,
                direction: {
                    x: 0,
                    y: 1
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

    return {
        line1: {
            point: B,
            direction: {
                x: BA.x / L2_norm(BA.x, BA.y, BA.z) + BC.x / L2_norm(BC.x, BC.y, BC.z),
                y: BA.y / L2_norm(BA.x, BA.y, BA.z) + BC.y / L2_norm(BC.x, BC.y, BC.z),
                z: (BA.z ?? 0) / L2_norm(BA.x, BA.y, BA.z) + (BC.z ?? 0) / L2_norm(BC.x, BC.y, BC.z)
            }
        },

        line2: {
            point: B,
            direction: {
                x: BA.x / L2_norm(BA.x, BA.y, BA.z) - BC.x / L2_norm(BC.x, BC.y, BC.z),
                y: BA.y / L2_norm(BA.x, BA.y, BA.z) - BC.y / L2_norm(BC.x, BC.y, BC.z),
                z: (BA.z ?? 0) / L2_norm(BA.x, BA.y, BA.z) - (BC.z ?? 0) / L2_norm(BC.x, BC.y, BC.z)
            }
        }
    }
}

export const bisector_angle_line2 = (d1: GeometryShape.Line, d2: GeometryShape.Line) => {
    let A = getIntersections2D(d1, d2);

}