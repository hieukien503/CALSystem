import * as GeometryShape from '../types/geometry';
import { lusolve } from 'mathjs';
import { isCuboid, isPrism, isPyramid, isSphere, isCylinder, isCone } from './type_guard';

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
    return Math.sqrt(x ** 2 + y ** 2 + z ** 2);
}

const mult_scalar = (x: number, y: number, z: number, scalar: number) => {
    return {
        x: x * scalar,
        y: y * scalar,
        z: z * scalar
    }
}

const isLine = (A: GeometryShape.Point, B: GeometryShape.Point, C: GeometryShape.Point) => {
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

const getPerimeter = (shape: GeometryShape.Polygon) => {
    let perimeter = 0;
    for (let i = 0; i < shape.points.length; i++) {
        perimeter += getDistance(shape.points[i], shape.points[i + 1]);
    }

    perimeter += getDistance(shape.points[shape.points.length - 1], shape.points[0]);
    return perimeter;
}

export const getDistance = (shape1: GeometryShape.Point, shape2: GeometryShape.Point) => {
    return Math.sqrt((shape1.x - shape2.x) ** 2 + (shape1.y - shape2.y) ** 2 + ((shape1.z ?? 0) - (shape2.z ?? 0)) ** 2);
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
    if (isLine(A, B, C)) {
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

    const solution = lusolve(matrix, b);

    return {
        x: solution[0],
        y: solution[1],
        z: solution[2]
    }
}

export const circumcenter = (A: GeometryShape.Point, B: GeometryShape.Point, C: GeometryShape.Point) => {
    if (isLine(A, B, C)) {
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
    if (isLine(A, B, C)) {
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
    if (isLine(A, B, C)) {
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
    if (isLine(A, B, C)) {
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
