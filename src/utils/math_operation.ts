import * as GeometryShape from '../types/geometry';
import * as Factory from './Factory'
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

const getStartAndEnd = (shape: GeometryShape.Shape) => {
    if ((shape.type === 'Line') || (shape.type === 'Ray') || (shape.type === 'Segment')) {
        let start = {
            x: ((shape.type === 'Line') ? (shape as GeometryShape.Line).startLine.x : 
                (shape.type === 'Ray') ? (shape as GeometryShape.Ray).startRay.x : (shape as GeometryShape.Segment).startSegment.x),
            y: ((shape.type === 'Line') ? (shape as GeometryShape.Line).startLine.y : 
                (shape.type === 'Ray') ? (shape as GeometryShape.Ray).startRay.y : (shape as GeometryShape.Segment).startSegment.y),
            z: ((shape.type === 'Line') ? (shape as GeometryShape.Line).startLine.z : 
                (shape.type === 'Ray') ? (shape as GeometryShape.Ray).startRay.z : (shape as GeometryShape.Segment).startSegment.z) ?? 0
        }

        let end = {
            x: ((shape.type === 'Line') ? (shape as GeometryShape.Line).endLine.x : 
                (shape.type === 'Ray') ? (shape as GeometryShape.Ray).endRay.x : (shape as GeometryShape.Segment).endSegment.x),
            y: ((shape.type === 'Line') ? (shape as GeometryShape.Line).endLine.y : 
                (shape.type === 'Ray') ? (shape as GeometryShape.Ray).endRay.y : (shape as GeometryShape.Segment).endSegment.y),
            z: ((shape.type === 'Line') ? (shape as GeometryShape.Line).endLine.z : 
                (shape.type === 'Ray') ? (shape as GeometryShape.Ray).endRay.z : (shape as GeometryShape.Segment).endSegment.z) ?? 0
        }

        return [start, end]
    }

    return [];
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

export const getIntersections2D = (shape1: GeometryShape.Shape, shape2: GeometryShape.Shape): {x: number, y: number, z: number}[] => {
    if (!(['Segment', 'Line', 'Ray', 'Polygon', 'Circle'].includes(shape1.type))) {
        throw new Error('Shape1 must be a valid shape for intersection');
    }

    if (!(['Segment', 'Line', 'Ray', 'Polygon', 'Circle'].includes(shape2.type))) {
        throw new Error('Shape2 must be a valid shape for intersection');
    }

    if ((shape1.type === 'Line') || (shape1.type === 'Ray') || (shape1.type === 'Segment')) {
        let [start, end] = getStartAndEnd(shape1);

        if ((shape2.type === 'Line') || (shape2.type === 'Ray') || (shape2.type === 'Segment')) {
            let [start2, end2] = getStartAndEnd(shape2);
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
                z: (A.length === 2 ? 0 : A[2]) - start.z
            }

            let crossProduct = cross(
                end.x - start.x,
                end.y - start.y,
                end.z - start.z,
                v.x,
                v.y,
                v.z
            )

            if (shape1.type === 'Ray') {
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

                if (shape2.type === 'Ray') {
                    if (L2_norm(crossProduct2.x, crossProduct2.y, crossProduct2.z) !== 0) {
                        return [];
                    }
                }

                else if (shape2.type === 'Segment') {
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

            else if (shape1.type === 'Segment') {
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

                if (shape2.type === 'Ray') {
                    if (L2_norm(crossProduct2.x, crossProduct2.y, crossProduct2.z) !== 0) {
                        return [];
                    }
                }

                else if (shape2.type === 'Segment') {
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

                if (shape2.type === 'Ray') {
                    if (L2_norm(crossProduct.x, crossProduct.y, crossProduct.z) !== 0) {
                        return [];
                    }
                }

                else if (shape2.type === 'Segment') {
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
        
        else if (shape2.type === 'Circle') {
            let circle: GeometryShape.Circle = shape2 as GeometryShape.Circle
            let u = {
                x: end.x - start.x,
                y: end.y - start.y,
                z: end.z - start.z
            }

            let u1 = {
                x: circle.centerC.x - start.x,
                y: circle.centerC.y - start.y,
                z: (circle.centerC.z ?? 0) - start.z
            }

            // Solve ||u1 - u * t||^2 = r^2
            const r = circle.radius;
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
                    (shape1.type === 'Ray' && t < 0) ||
                    (shape1.type === 'Segment' && (t < 0 || t > 1))
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
                if (shape1.type === 'Ray') {
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

                else if (shape1.type === 'Segment') {
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

        else if (shape2.type === 'Polygon') {
            let poly: GeometryShape.Polygon = shape2 as GeometryShape.Polygon;
            let intersections = [];
            for (let i = 0; i < poly.points.length; i++) {
                let point1 = poly.points[i];
                let point2 = poly.points[(i + 1) % poly.points.length];

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
                        (shape1.type === 'Ray' && solutions.get([0, 0]) < 0) ||
                        (shape1.type === 'Segment' && (solutions.get([0, 0]) < 0 || solutions.get([0, 0]) > 1))
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

    else if (shape1.type === 'Circle') {
        if ((shape2.type === 'Line') || (shape2.type === 'Ray') || (shape2.type === 'Segment')) {
            return getIntersections2D(shape2, shape1);
        }

        let circle1: GeometryShape.Circle = shape1 as GeometryShape.Circle

        if (shape2.type === 'Circle') {
            let circle2: GeometryShape.Circle = shape2 as GeometryShape.Circle
            // Two circles intersection
            let d = getDistance(circle1.centerC, circle2.centerC);
            if (d === 0 && circle1.radius === circle2.radius) {
                throw new Error('The circles are coincident');
            }

            if (d === 0) {
                return []; // No intersection, circles are concentric
            }
            
            if (d > circle1.radius + circle2.radius || d < Math.abs(circle1.radius - circle2.radius)) {
                return []; // No intersection
            }

            let a = (circle1.radius ** 2 - circle2.radius ** 2 + d ** 2) / (2 * d);
            let h = Math.sqrt(circle1.radius ** 2 - a ** 2);
            let p = {
                x: circle1.centerC.x + a * (circle2.centerC.x - circle1.centerC.x) / d,
                y: circle1.centerC.y + a * (circle2.centerC.y - circle1.centerC.y) / d,
                z: (circle1.centerC.z ?? 0) + a * ((circle2.centerC.z ?? 0) - (circle1.centerC.z ?? 0)) / d
            };

            if (h === 0) {
                return [p]; // One intersection point
            }

            return [
                {
                    x: p.x + h * (circle2.centerC.y - circle1.centerC.y) / d,
                    y: p.y - h * (circle2.centerC.x - circle1.centerC.x) / d,
                    z: (p.z ?? 0) + h * ((circle2.centerC.z ?? 0) - (circle1.centerC.z ?? 0)) / d
                },
                {
                    x: p.x - h * (circle2.centerC.y - circle1.centerC.y) / d,
                    y: p.y + h * (circle2.centerC.x - circle1.centerC.x) / d,
                    z: (p.z ?? 0) - h * ((circle2.centerC.z ?? 0) - (circle1.centerC.z ?? 0)) / d
                }
            ];
        }

        else if (shape2.type === 'Polygon') {
            let poly: GeometryShape.Polygon = shape2 as GeometryShape.Polygon;
            let intersections = [];
            for (let i = 0; i < poly.points.length; i++) {
                let point1 = poly.points[i];
                let point2 = poly.points[(i + 1) % poly.points.length];
                let u = {
                    x: point2.x - point1.x,
                    y: point2.y - point1.y,
                    z: (point2.z ?? 0) - (point1.z ?? 0)
                }

                let v = {
                    x: circle1.centerC.x - point1.x,
                    y: circle1.centerC.y - point1.y,
                    z: (circle1.centerC.z ?? 0) - (point1.z ?? 0)
                }

                // Solve ||v - u * t||^2 = r^2
                const r = circle1.radius;
                const a = dot(u.x, u.y, u.z, u.x, u.y, u.z);
                const b = -2 * dot(v.x, v.y, v.z, u.x, u.y, u.z);
                const c = dot(v.x, v.y, v.z, v.x, v.y, v.z) - r * r;
                const discriminant = b * b - 4 * a * c;
                if (discriminant < 0) {
                    continue; // No intersection
                }

                if (discriminant === 0) {
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

    else if (shape1.type === 'Polygon') {
        if ((shape2.type === 'Line') || (shape2.type === 'Ray') || (shape2.type === 'Segment') || (shape2.type === 'Circle')) {
            return getIntersections2D(shape2, shape1);
        }

        else if (shape2.type === 'Polygon') {
            let poly1: GeometryShape.Polygon = shape1 as GeometryShape.Polygon;
            let poly2: GeometryShape.Polygon = shape2 as GeometryShape.Polygon;
            let intersections = [];
            for (let i = 0; i < poly1.points.length; i++) {
                let point1 = poly1.points[i];
                let point2 = poly1.points[(i + 1) % poly1.points.length];
                let u = {
                    x: point2.x - point1.x,
                    y: point2.y - point1.y,
                    z: (point2.z ?? 0) - (point1.z ?? 0)
                }

                for (let j = 0; j < poly2.points.length; j++) {
                    let point3 = poly2.points[j];
                    let point4 = poly2.points[(j + 1) % poly2.points.length];
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
    if (!(['Segment', 'Line', 'Ray', 'Plane', 'Sphere'].includes(shape1.type))) {
        throw new Error('Shape1 must be a valid shape for intersection');
    }

    if (!(['Segment', 'Line', 'Ray', 'Plane', 'Sphere'].includes(shape2.type))) {
        throw new Error('Shape2 must be a valid shape for intersection');
    }

    if ((shape1.type === 'Line') || (shape1.type === 'Ray') || (shape1.type === 'Segment')) {
        if ((shape2.type === 'Line') || (shape2.type === 'Ray') || (shape2.type === 'Segment')) {
            return getIntersections2D(shape1, shape2);
        }

        let [start, end] = getStartAndEnd(shape1);

        let u = {
            x: end.x - start.x,
            y: end.y - start.y,
            z: (end.z ?? 0) - (start.z ?? 0)
        }

        if ((shape2.type === 'Plane')) {
            let pl: GeometryShape.Plane = shape2 as GeometryShape.Plane
            let n = {
                x: pl.norm.endVector.x - pl.norm.startVector.x,
                y: pl.norm.endVector.y - pl.norm.startVector.y,
                z: (pl.norm.endVector.z ?? 0) - (pl.norm.startVector.z ?? 0),
            }

            let A = math.intersect(
                [start.x, start.y, start.z],
                [end.x, end.y, end.z],
                [n.x, n.y, n.z, n.x * pl.point.x, n.y * pl.point.y, n.z * (pl.point.z ?? 0)]
            )

            if (A === null) {
                return [];
            }

            let v = {
                x: A[0] - start.x,
                y: A[1] - start.y,
                z: (A.length === 2 ? 0 : A[2]) - start.z
            }

            let crossProduct = cross(
                end.x - start.x,
                end.y - start.y,
                end.z - start.z,
                v.x,
                v.y,
                v.z
            )

            if (shape1.type === 'Ray') {
                if (L2_norm(crossProduct.x, crossProduct.y, crossProduct.z) !== 0) {
                    return [];
                }
            }

            else if (shape1.type === 'Segment') {
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

        else if (shape2.type === 'Sphere') {
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
            const discriminant = b * b - 4 * a * c;
            if (discriminant < 0) {
                return []; // No intersection
            }

            else if (discriminant === 0) {
                let t = -b / (2 * a);
                if (
                    (shape1.type === 'Ray' && t < 0) ||
                    (shape1.type === 'Segment' && (t < 0 || t > 1))
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
                if (shape1.type === 'Ray') {
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

                else if (shape1.type === 'Segment') {
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

    else if (shape1.type === 'Plane') {
        if ((shape2.type === 'Line') || (shape2.type === 'Ray') || (shape2.type === 'Segment')) {
            return getIntersections3D(shape1, shape2);
        }

        return []; // Plane intersection with sphere will not be handled here
    }

    else if (shape1.type === 'Sphere') {
        if ((shape2.type === 'Line') || (shape2.type === 'Ray') || (shape2.type === 'Segment')) {
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

export const centroid = (A: GeometryShape.Point, B: GeometryShape.Point, C: GeometryShape.Point) => {
    if (isColinear(A, B, C)) {
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
    if (shape.type === 'Cuboid') {
        let cube: GeometryShape.Cuboid = shape as GeometryShape.Cuboid;
        let x = Math.abs(cube.bottomRightFront.x - cube.topLeftBack.x);
        let y = Math.abs(cube.bottomRightFront.y - cube.topLeftBack.y);
        let z = Math.abs((cube.bottomRightFront.z ?? 0) - (cube.topLeftBack.z ?? 0));
        return x * y * z;
    }

    if (shape.type === 'Prism') {
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

    if (shape.type === 'Pyramid') {
        let py: GeometryShape.Pyramid = shape as GeometryShape.Pyramid;
        let base_area = getArea(py.base);
        let height = distance(py.base, py.apex);
        return (base_area * height) / 3;
    }
    
    if (shape.type === 'Sphere') {
        return (4 / 3) * Math.PI * Math.pow((shape as GeometryShape.Sphere).radius, 3);
    }

    if (shape.type === 'Cylinder') {
        let cy: GeometryShape.Cylinder = shape as GeometryShape.Cylinder;
        let height = getDistance(cy.centerBase1, cy.centerBase2);
        let base_area = Math.PI * Math.pow(cy.radius, 2);
        return base_area * height;
    }

    if (shape.type === 'Cone') {
        let co: GeometryShape.Cone = shape as GeometryShape.Cone;
        let height = getDistance(co.center, co.apex);
        let base_area = Math.PI * Math.pow(co.radius, 2);
        return (base_area * height) / 3;
    }

    throw new Error('Invalid shape');
}

export const surface_area = (shape: GeometryShape.Shape) => {
    if (shape.type === 'Cuboid') {
        let cube: GeometryShape.Cuboid = shape as GeometryShape.Cuboid;
        let x = Math.abs(cube.bottomRightFront.x - cube.topLeftBack.x);
        let y = Math.abs(cube.bottomRightFront.y - cube.topLeftBack.y);
        let z = Math.abs((cube.bottomRightFront.z ?? 0) - (cube.topLeftBack.z ?? 0));
        return 2 * (x * y + x * z + y * z);
    }

    if (shape.type === 'Prism') {
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

    if (shape.type === 'Pyramid') {
        let py: GeometryShape.Pyramid = shape as GeometryShape.Pyramid;
        let perimeter = getPerimeter(py.base);
        let mid = midPoint(py.base.points[0], py.base.points[1]);
        let d = L2_norm(mid.x - py.apex.x, mid.y - py.apex.y, (mid.z ?? 0) - (py.apex.z ?? 0));
        return perimeter / 2 * d + getArea(py.base);
    }

    if (shape.type === 'Sphere') {
        return 4 * Math.PI * Math.pow((shape as GeometryShape.Sphere).radius, 2);
    }
    
    if (shape.type === 'Cylinder') {
        let cy: GeometryShape.Cylinder = shape as GeometryShape.Cylinder;
        let height = getDistance(cy.centerBase1, cy.centerBase2);
        let base_area = Math.PI * Math.pow(cy.radius, 2);
        return 2 * base_area + 2 * Math.PI * cy.radius * height;
    }
    
    if (shape.type === 'Cone') {
        let co: GeometryShape.Cone = shape as GeometryShape.Cone;
        let height = getDistance(co.center, co.apex);
        let base_area = Math.PI * Math.pow(co.radius, 2);
        let slant_height = Math.sqrt(Math.pow(co.radius, 2) + Math.pow(height, 2));
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
    if (A.length === 0) {
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
        x: A[0].x,
        y: A[0].y,
        z: A[0].z
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

export const tangentLine = (p: GeometryShape.Point, c: GeometryShape.Circle) => {
    let d = getDistance(p, c.centerC);
    if (d < c.radius) {
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

    if (n.x * p.x + n.y * p.y + n.z * (p.z ?? 0) !== (n.x * c.centerC.x + n.y * c.centerC.y + n.z * (c.centerC.z ?? 0))) {
        return [];
    }

    if (d === c.radius) {
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
                }
            }
        ]
    }

    else {
        let m = midPoint(p, c.centerC)
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
                    x: intersections[0].x - p.x,
                    y: intersections[0].y - p.y,
                    z: intersections[0].z - (p.z ?? 0),
                }
            },
            {
                point:  {
                    x: p.x,
                    y: p.y,
                    z: p.z ?? 0
                },
                direction: {
                    x: intersections[1].x - p.x,
                    y: intersections[1].y - p.y,
                    z: intersections[1].z - (p.z ?? 0),
                }
            }
        ]
    }
}

export const reflection = (o1: GeometryShape.Shape, o2: GeometryShape.Shape): GeometryShape.Shape => {
    if (!(['Segment', 'Line', 'Ray', 'Point', 'Plane'].includes(o2.type))) {
        throw new Error('Cannot perform reflection');
    }

    if (o1.type === 'Vector') {
        let v: GeometryShape.Vector = o1 as GeometryShape.Vector;
        return Factory.createVector(
            v.props,
            reflection(v.startVector, o2) as GeometryShape.Point,
            reflection(v.endVector, o2) as GeometryShape.Point
        )
    }

    else if (o1.type === 'Point') {
        let p: GeometryShape.Point = o1 as GeometryShape.Point;
        if (['Segment', 'Ray', 'Line'].includes(o2.type)) {
            let [start, end] = getStartAndEnd(o2);
            let d = {
                x: end.x - start.x,
                y: end.y - start.y,
                z: end.z - start.z
            }

            let v = {
                x: start.x - p.x,
                y: start.y - p.y,
                z: start.z - (p.z ?? 0)
            }

            let cross_uv = cross(
                v.x, v.y, v.z,
                d.x, d.y, d.z
            )

            if (L2_norm(cross_uv.x, cross_uv.y, cross_uv.z) === 0) {
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
                z: start.z + v1.z
            }

            return Factory.createPoint(
                p.props,
                2 * foot.x - p.x,
                2 * foot.y - p.y,
                2 * foot.z - (p.z ?? 0)
            )
        }

        else if (o2.type === 'Point') {
            let p2: GeometryShape.Point = o2 as GeometryShape.Point;
            return Factory.createPoint(
                p.props,
                2 * p2.x - p.x,
                2 * p2.y - p.y,
                2 * (p2.z ?? 0) - (p.z ?? 0)
            )
        }

        else if (o2.type === 'Plane') {
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

    else if (o1.type === 'Circle') {
        let c: GeometryShape.Circle = o1 as GeometryShape.Circle;
        let p = reflection(c.centerC, o2) as GeometryShape.Point;
        return Factory.createCircle(
            c.props,
            p,
            c.radius,
            c.normal
        )
    }

    else if (o1.type === 'SemiCircle') {
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

    else if (o1.type === 'Polygon') {
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

    else if (['Line', 'Segment', 'Ray'].includes(o1.type)) {
        let [start2, end2] = getStartAndEnd(o1);
        let [start3, end3] = [
            reflection(Factory.createPoint(
                o2.props,
                start2.x,
                start2.y,
                start2.z
            ), o2) as GeometryShape.Point, reflection(Factory.createPoint(
                o2.props,
                end2.x,
                end2.y,
                end2.z
            ), o2) as GeometryShape.Point
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

    else if (o1.type === 'Sphere') {
        let c: GeometryShape.Sphere = o1 as GeometryShape.Sphere;
        let p = reflection(c.centerS, o2) as GeometryShape.Point;
        return Factory.createSphere(
            c.props,
            p,
            c.radius
        )
    }

    else if (o1.type === 'Plane') {
        let pl: GeometryShape.Plane = o1 as GeometryShape.Plane;
        return Factory.createPlane(
            pl.props,
            reflection(pl.point, o2) as GeometryShape.Point,
            pl.norm
        )
    }

    else if (o1.type === 'Cuboid') {
        let cube: GeometryShape.Cuboid = o1 as GeometryShape.Cuboid;
        return Factory.createCuboid(
            cube.props,
            reflection(cube.topLeftBack, o2) as GeometryShape.Point,
            reflection(cube.bottomRightFront, o2) as GeometryShape.Point 
        )
    }

    else if (o1.type === 'Cylinder') {
        let cy: GeometryShape.Cylinder = o1 as GeometryShape.Cylinder;
        return Factory.createCylinder(
            cy.props,
            reflection(cy.centerBase1, o2) as GeometryShape.Point,
            reflection(cy.centerBase2, o2) as GeometryShape.Point,
            cy.radius
        )
    }

    else if (o1.type === 'Prism') {
        let pr: GeometryShape.Prism = o1 as GeometryShape.Prism;
        return Factory.createPrism(
            pr.props,
            reflection(pr.base, o2) as GeometryShape.Polygon,
            pr.shiftVector
        )
    }

    else if (o1.type === 'Pyramid') {
        let py: GeometryShape.Pyramid = o1 as GeometryShape.Pyramid;
        return Factory.createPyramid(
            py.props,
            reflection(py.base, o2) as GeometryShape.Polygon,
            reflection(py.apex, o2) as GeometryShape.Point
        )
    }

    else if (o1.type === 'Cone') {
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

export const point_projection = (o1: GeometryShape.Point, o2: GeometryShape.Shape, project_line: GeometryShape.Line): GeometryShape.Point => {
    if (!(['Segment', 'Ray', 'Line', 'Plane'].includes(o2.type))) {
        throw new Error('Cannot perform projection');
    }

    let dir = {
        x: project_line.endLine.x - project_line.startLine.x,
        y: project_line.endLine.y - project_line.startLine.y,
        z: (project_line.endLine.z ?? 0) - (project_line.startLine.z ?? 0),
    }

    if ((['Segment', 'Ray', 'Line'].includes(o2.type))) {
        let [start, end] = getStartAndEnd(o2);
        let d = {
            x: end.x - start.x,
            y: end.y - start.y,
            z: end.z - start.z
        }

        let crossProd = cross(
            dir.x, dir.y, dir.z,
            d.x, d.y, d.z
        )

        if (L2_norm(crossProd.x, crossProd.y, crossProd.z) === 0) {
            throw new Error('Cannot perform projection');
        }

        if (dot(dir.x, dir.y, dir.z, d.x, d.y, d.z) === 0) {
            let v = {
                x: start.x - o1.x,
                y: start.y - o1.y,
                z: start.z - (o1.z ?? 0)
            }

            let cross_uv = cross(
                v.x, v.y, v.z,
                d.x, d.y, d.z
            )

            if (L2_norm(cross_uv.x, cross_uv.y, cross_uv.z) === 0) {
                return o1
            }

            let dot_uv = dot(
                v.x, v.y, v.z,
                d.x, d.y, d.z
            )

            let denom = dot(d.x, d.y, d.z, d.x, d.y, d.z);
            let t = dot_uv / denom;
            if ((o2.type === 'Segment' && (t >= 0 && t <= 1)) || (o2.type === 'Ray' && t >= 0) || (o2.type === 'Line')) {
                let v1 = {
                    x: d.x * t,
                    y: d.y * t,
                    z: d.z * t
                }

                let foot = {
                    x: start.x + v1.x,
                    y: start.y + v1.y,
                    z: start.z + v1.z
                }

                return Factory.createPoint(
                    o1.props,
                    foot.x,
                    foot.y,
                    foot.z
                )
            }
            
            else {
                throw new Error('Reflected point out of bound');
            }
        }

        else {
            let A = math.intersect(
                [o1.x, o1.y, o1.z ?? 0],
                [o1.x + dir.x, o1.y + dir.y, o1.z, dir.z],
                [start.x, start.y, start.z],
                [end.x, end.y, end.z]
            )

            return Factory.createPoint(
                o1.props,
                A[0],
                A[1],
                A.length === 2 ? 0 : A[2]
            )
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
            [o1.x + dir.x, o1.y + dir.y, (o1.z ?? 0) + dir.z],
            [n.x, n.y, n.z, n.x * pl.point.x, n.y * pl.point.y, n.z * (pl.point.z ?? 0)]
        )

        if (A === null) {
            throw new Error('Cannot perform projection');
        }

        return Factory.createPoint(
            o1.props,
            A[0],
            A[1],
            A.length === 2 ? 0 : A[2]
        )
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

    if (o2.type === 'Point') {
        // Only 2D
        let p2: GeometryShape.Point = o2 as GeometryShape.Point;
        if (o1.type === 'Point') {
            let p1: GeometryShape.Point = o1 as GeometryShape.Point;
            let rotated_point = {
                x: (p1.x - p2.x) * Math.cos(radian) - (p1.y - p2.y) * Math.sin(radian) + p2.x,
                y: (p1.x - p2.x) * Math.sin(radian) + (p1.y - p2.y) * Math.cos(radian) + p2.y
            }

            return Factory.createPoint(
                p1.props,
                rotated_point.x,
                rotated_point.y
            )
        }

        else if (['Segment', 'Ray', 'Line'].includes(o1.type)) {
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

        else if (o1.type === 'Vector') {
            let v: GeometryShape.Vector = o1 as GeometryShape.Vector;
            let [A, B] = [Factory.createPoint(p2.props, v.startVector.x, v.startVector.y), Factory.createPoint(p2.props, v.endVector.x, v.endVector.y)];
            [A, B] = [rotation(A, o2, degree, CCW) as GeometryShape.Point, rotation(B, o2, degree, CCW) as GeometryShape.Point];
            return Factory.createVector(v.props, A, B);
        }

        else if (o1.type === 'Circle') {
            let c: GeometryShape.Circle = o1 as GeometryShape.Circle;
            let center = rotation(c.centerC, o2, degree, CCW) as GeometryShape.Point;
            return Factory.createCircle(c.props, center, c.radius, c.normal);
        }

        else if (o1.type === 'SemiCircle') {
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

        else if (o1.type === 'Polygon') {
            let poly: GeometryShape.Polygon = o1 as GeometryShape.Polygon;
            let points: GeometryShape.Point[] = [];
            poly.points.forEach(p => {
                points.push(rotation(p, o2, degree, CCW) as GeometryShape.Point);
            })

            return Factory.createPolygon(poly.props, points);
        }

        else if (o1.type === 'Cuboid') {
            let cube: GeometryShape.Cuboid = o1 as GeometryShape.Cuboid;
            return Factory.createCuboid(
                cube.props,
                rotation(cube.topLeftBack, o2, degree, CCW) as GeometryShape.Point,
                rotation(cube.bottomRightFront, o2, degree, CCW) as GeometryShape.Point 
            )
        }

        else if (o1.type === 'Cylinder') {
            let cy: GeometryShape.Cylinder = o1 as GeometryShape.Cylinder;
            return Factory.createCylinder(
                cy.props,
                rotation(cy.centerBase1, o2, degree, CCW) as GeometryShape.Point,
                rotation(cy.centerBase2, o2, degree, CCW) as GeometryShape.Point,
                cy.radius
            )
        }

        else if (o1.type === 'Prism') {
            let pr: GeometryShape.Prism = o1 as GeometryShape.Prism;
            return Factory.createPrism(
                pr.props,
                rotation(pr.base, o2, degree, CCW) as GeometryShape.Polygon,
                pr.shiftVector
            )
        }

        else if (o1.type === 'Pyramid') {
            let py: GeometryShape.Pyramid = o1 as GeometryShape.Pyramid;
            return Factory.createPyramid(
                py.props,
                rotation(py.base, o2, degree, CCW) as GeometryShape.Polygon,
                rotation(py.apex, o2, degree, CCW) as GeometryShape.Point
            )
        }

        else if (o1.type === 'Cone') {
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
            z: end.z - start.z
        }
        
        if (o1.type === 'Point') {
            let p: GeometryShape.Point = o1 as GeometryShape.Point;
            let u = {
                x: p.x - start.x,
                y: p.y - start.y,
                z: (p.z ?? 0) - start.z
            }

            let crossProd = cross(v.x, v.y, v.z, u.x, u.y, u.z);
            let dot_uv = dot(v.x, v.y, v.z, u.x, u.y, u.z);

            return Factory.createPoint(
                p.props,
                start.x + u.x * Math.cos(radian) + Math.sin(radian) * crossProd.x + (1 - Math.cos(radian)) * dot_uv * v.x,
                start.y + u.y * Math.cos(radian) + Math.sin(radian) * crossProd.y + (1 - Math.cos(radian)) * dot_uv * v.y,
                start.z + u.z * Math.cos(radian) + Math.sin(radian) * crossProd.z + (1 - Math.cos(radian)) * dot_uv * v.z
            )
        }

        else if (['Segment', 'Ray', 'Line'].includes(o1.type)) {
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

        else if (o1.type === 'Vector') {
            let v: GeometryShape.Vector = o1 as GeometryShape.Vector;
            let [A, B] = [Factory.createPoint(o2.props, v.startVector.x, v.startVector.y), Factory.createPoint(o2.props, v.endVector.x, v.endVector.y)];
            [A, B] = [rotation(A, o2, degree, CCW) as GeometryShape.Point, rotation(B, o2, degree, CCW) as GeometryShape.Point];
            return Factory.createVector(v.props, A, B);
        }

        else if (o1.type === 'Circle') {
            let c: GeometryShape.Circle = o1 as GeometryShape.Circle;
            let center = rotation(c.centerC, o2, degree, CCW) as GeometryShape.Point;
            return Factory.createCircle(c.props, center, c.radius, c.normal);
        }

        else if (o1.type === 'Polygon') {
            let poly: GeometryShape.Polygon = o1 as GeometryShape.Polygon;
            let points: GeometryShape.Point[] = [];
            poly.points.forEach(p => {
                points.push(rotation(p, o2, degree, CCW) as GeometryShape.Point);
            })

            return Factory.createPolygon(poly.props, points);
        }

        else if (o1.type === 'Sphere') {
            let sp: GeometryShape.Sphere = o1 as GeometryShape.Sphere;
            let center = rotation(sp.centerS, o2, degree, CCW) as GeometryShape.Point;
            return Factory.createSphere(sp.props, center, sp.radius);
        }

        else if (o1.type === 'Plane') {
            let pl: GeometryShape.Plane = o1 as GeometryShape.Plane;
            let p_ref = rotation(pl.point, o2, degree, CCW) as GeometryShape.Point;
            return Factory.createPlane(pl.props, p_ref, pl.norm);
        }

        else {
            throw new Error('Cannot perform rotation');
        }
    }
}

export const excenter = (A: GeometryShape.Point, B: GeometryShape.Point, C: GeometryShape.Point): GeometryShape.Point => {
    if (isColinear(A, B, C)) {
        throw new Error('Cannot find the excenter of 3 colinear points');
    }

    let BC = L2_norm(C.x - B.x, C.y - B.y, (C.z ?? 0) - (B.z ?? 0));
    let CA = L2_norm(C.x - A.x, C.y - A.y, (C.z ?? 0) - (A.z ?? 0));
    let AB = L2_norm(A.x - B.x, A.y - B.y, (A.z ?? 0) - (B.z ?? 0));

    return Factory.createPoint(
        A.props,
        (-BC * A.x + CA * B.x - AB * C.x) / (AB + BC + CA),
        (-BC * A.y + CA * B.y - AB * C.y) / (AB + BC + CA),
        (-BC * (A.z ?? 0) + CA * (B.z ?? 0) - AB * (C.z ?? 0)) / (AB + BC + CA),
    )
}

export const exradius = (A: GeometryShape.Point, B: GeometryShape.Point, C: GeometryShape.Point): number => {
    if (isColinear(A, B, C)) {
        throw new Error('Cannot find the exradius of 3 colinear points');
    }

    let BC = L2_norm(C.x - B.x, C.y - B.y, (C.z ?? 0) - (B.z ?? 0));
    let CA = L2_norm(C.x - A.x, C.y - A.y, (C.z ?? 0) - (A.z ?? 0));
    let AB = L2_norm(A.x - B.x, A.y - B.y, (A.z ?? 0) - (B.z ?? 0));

    let s = (AB + BC + CA) / 2;
    return Math.sqrt(s * (s - AB) * (s - BC) * (s - CA)) / (s - CA);
}

export const enlarge = (o1: GeometryShape.Shape, o2: GeometryShape.Point, k: number): GeometryShape.Shape => {
    if (k === 0) {
        return o2;
    }

    if (o1.type === 'Point') {
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

    else if (o1.type === 'Circle') {
        let c: GeometryShape.Circle = o1 as GeometryShape.Circle;
        let p = enlarge(c.centerC, o2, k) as GeometryShape.Point;
        return Factory.createCircle(
            c.props,
            p,
            Math.abs(k) * c.radius,
            c.normal
        )
    }

    else if (o1.type === 'SemiCircle') {
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

    else if (o1.type === 'Polygon') {
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

    else if (['Line', 'Segment', 'Ray'].includes(o1.type)) {
        let [start2, end2] = getStartAndEnd(o1);
        let [start3, end3] = [
            enlarge(Factory.createPoint(
                o2.props,
                start2.x,
                start2.y,
                start2.z
            ), o2, k) as GeometryShape.Point, enlarge(Factory.createPoint(
                o2.props,
                end2.x,
                end2.y,
                end2.z
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

    else if (o1.type === 'Vector') {
        let v: GeometryShape.Vector = o1 as GeometryShape.Vector;
        return Factory.createVector(
            v.props,
            enlarge(v.startVector, o2, k) as GeometryShape.Point,
            enlarge(v.endVector, o2, k) as GeometryShape.Point
        )
    }

    else if (o1.type === 'Sphere') {
        let c: GeometryShape.Sphere = o1 as GeometryShape.Sphere;
        let p = enlarge(c.centerS, o2, k) as GeometryShape.Point;
        return Factory.createSphere(
            c.props,
            p,
            Math.abs(k) * c.radius
        )
    }

    else if (o1.type === 'Plane') {
        let pl: GeometryShape.Plane = o1 as GeometryShape.Plane;
        return Factory.createPlane(
            pl.props,
            enlarge(pl.point, o2, k) as GeometryShape.Point,
            pl.norm
        )
    }

    else if (o1.type === 'Cuboid') {
        let cube: GeometryShape.Cuboid = o1 as GeometryShape.Cuboid;
        return Factory.createCuboid(
            cube.props,
            enlarge(cube.topLeftBack, o2, k) as GeometryShape.Point,
            enlarge(cube.bottomRightFront, o2, k) as GeometryShape.Point 
        )
    }

    else if (o1.type === 'Cylinder') {
        let cy: GeometryShape.Cylinder = o1 as GeometryShape.Cylinder;
        return Factory.createCylinder(
            cy.props,
            enlarge(cy.centerBase1, o2, k) as GeometryShape.Point,
            enlarge(cy.centerBase2, o2, k) as GeometryShape.Point,
            cy.radius
        )
    }

    else if (o1.type === 'Prism') {
        let pr: GeometryShape.Prism = o1 as GeometryShape.Prism;
        return Factory.createPrism(
            pr.props,
            enlarge(pr.base, o2, k) as GeometryShape.Polygon,
            pr.shiftVector
        )
    }

    else if (o1.type === 'Pyramid') {
        let py: GeometryShape.Pyramid = o1 as GeometryShape.Pyramid;
        return Factory.createPyramid(
            py.props,
            enlarge(py.base, o2, k) as GeometryShape.Polygon,
            enlarge(py.apex, o2, k) as GeometryShape.Point
        )
    }

    else if (o1.type === 'Cone') {
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