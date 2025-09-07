import { RuleNode } from "antlr4ts/tree/RuleNode";
import { 
    AbsExprContext,
    AdditiveExprContext,
    AngleDefContext,
    CbrtExprContext,
    CommandContext,
    CosExprContext,
    CotExprContext,
    ExpExprContext,
    ExponentialExprContext,
    ExprContext,
    ImplicitMultiplicativeExprContext,
    LineDefContext,
    LnExprContext,
    LogExprContext,
    MultiplicativeExprContext,
    NumberExprContext,
    PointDefContext,
    PrimaryExprContext,
    ProgramContext,
    SinExprContext,
    SphereDefContext,
    SqrtExprContext,
    TanExprContext,
    UnaryExprContext,
    PlaneDefContext,
    PlaneExprContext,
    VectorDefContext,
    CircleDefContext,
    CuboidExprContext
} from "../parser/MathCommandParser";
import { MathCommandVisitor } from "../parser/MathCommandVisitor";
import { ParseTree } from "antlr4ts/tree/ParseTree";
import { TerminalNode } from "antlr4ts/tree/TerminalNode";
import { ErrorNode } from "antlr4ts/tree/ErrorNode";
import { ShapeNode3D } from "../../types/geometry";
import * as utils from "../../utils/utilities";
import * as utils3d from "../../utils/utilities3D";
import * as operations from "../../utils/math_operation"
import * as factory from "../../utils/Factory";

const EPSILON = 1e-6;

class ASTGen implements MathCommandVisitor<unknown> {
    private DAG: Map<string, ShapeNode3D>;
    private labelUsed: Array<string>;
    constructor(DAG: Map<string, ShapeNode3D>, labelUsed: Array<string>) {
        this.DAG = DAG;
        this.labelUsed = labelUsed;
    }

    visit(tree: ParseTree): unknown {
        return tree.accept(this);
    }

    visitChildren(node: RuleNode): unknown {
        let result: unknown = this.defaultResult();

        const n = node.childCount;
        for (let i = 0; i < n; i++) {
            if (!this.shouldVisitNextChild(node, result)) {
                return result;
            }

            const child = node.getChild(i);
            const childResult = child.accept(this);
            result = this.aggregateResult(result, childResult);
        }

        return result;

    }

    defaultResult = (): unknown => {
        // Default result for visiting nodes
        return;
    }

    shouldVisitNextChild(node: RuleNode, currentResult: unknown): boolean {
        // By default, we always visit the next child
        return true;
    }

    aggregateResult(aggregate: unknown, nextResult: unknown): unknown {
        // Aggregate results from child nodes
        return nextResult ?? aggregate;
    }

    visitTerminal(node: TerminalNode): unknown {
        return undefined; // Terminal nodes do not produce a Shape
    }

    visitErrorNode(node: ErrorNode): unknown {
        // This is called when there's a syntax error in the parse
        throw new Error(`Parse error: ${node.text}`);
    }

    visitProgram = (ctx: ProgramContext): unknown => {
        return this.visit(ctx.expr());
    };

    visitExpr = (ctx: ExprContext): unknown => {
        return this.visitChildren(ctx);
    }

    visitCommand = (ctx: CommandContext): unknown => {
        return this.visitChildren(ctx);
    }

    visitPointDef = (ctx: PointDefContext): unknown => {
        return {
            type: "Point",
            x: this.visit(ctx.numberExpr()[0]) as number,
            y: this.visit(ctx.numberExpr()[1]) as number,
            z: this.visit(ctx.numberExpr()[2]) as number
        }
    }

    visitNumberExpr = (ctx: NumberExprContext): unknown => {
        return this.visitChildren(ctx);
    }

    visitAdditiveExpr = (ctx: AdditiveExprContext): unknown => {
        if (ctx.additiveExpr() === undefined) {
            return this.visit(ctx.multiplicativeExpr());
        }

        const left = this.visit(ctx.additiveExpr()!) as number;
        const right = this.visit(ctx.multiplicativeExpr()) as number;
        return ctx.ADD() ? left + right : left - right;
    }

    visitMultiplicativeExpr = (ctx: MultiplicativeExprContext): unknown => {
        if (ctx.implicitMultiplicativeExpr()) {
            return this.visit(ctx.implicitMultiplicativeExpr()!) as number;
        }

        if (ctx.multiplicativeExpr() === undefined) {
            return this.visit(ctx.exponentialExpr()!);
        }

        const left = this.visit(ctx.multiplicativeExpr()!) as number;
        const right = this.visit(ctx.exponentialExpr()!) as number;
        try {
            return ctx.MULTIPLY() ? left * right : left / right;
        }
        catch (error) {
            throw new Error(`Error in multiplicative expression: ${error}`);
        }
    }

    visitImplicitMultiplicativeExpr =(ctx: ImplicitMultiplicativeExprContext): unknown => {
        return ctx.primaryExpr().map(expr => this.visit(expr) as number).reduce((a, b) => a * b, 1);
    }

    visitExponentialExpr = (ctx: ExponentialExprContext): unknown => {
        if (ctx.exponentialExpr() === undefined) {
            return this.visit(ctx.unaryExpr());
        }

        const base = this.visit(ctx.unaryExpr()!) as number;
        const exponent = this.visit(ctx.exponentialExpr()!) as number;
        return Math.pow(base, exponent);
    }

    visitUnaryExpr = (ctx: UnaryExprContext): unknown => {
        if (ctx.unaryExpr() === undefined) {
            return this.visit(ctx.primaryExpr()!);
        }

        const value = this.visit(ctx.unaryExpr()!) as number;
        return ctx.SUB() ? -value : value;
    }

    visitPrimaryExpr = (ctx: PrimaryExprContext): unknown => {
        if (ctx.INT_LIT()) {
            return parseFloat(ctx.INT_LIT()!.text);
        }

        if (ctx.FLOAT_LIT()) {
            return parseFloat(ctx.FLOAT_LIT()!.text);
        }

        if (ctx.E()) {
            return Math.E;
        }

        if (ctx.PI()) {
            return Math.PI;
        }

        if (ctx.numberExpr()) {
            return this.visit(ctx.numberExpr()!);
        }

        return this.visitChildren(ctx);
    }

    visitSinExpr = (ctx: SinExprContext): unknown => {
        const value = this.visit(ctx.numberExpr()) as number;
        return Math.sin(value);
    }

    visitCosExpr = (ctx: CosExprContext): unknown => {
        const value = this.visit(ctx.numberExpr()) as number;
        return Math.cos(value);
    }

    visitTanExpr = (ctx: TanExprContext): unknown => {
        const value = this.visit(ctx.numberExpr()) as number;
        // Check if cosine is near zero to avoid division by zero
        if (Math.abs(Math.cos(value)) < EPSILON) {
            return Infinity; // Handle undefined tan values
        }

        return Math.tan(value);
    }

    visitCotExpr = (ctx: CotExprContext): unknown => {
        const value = this.visit(ctx.numberExpr()) as number;
        // Check if value is a multiple of π
        if (Math.abs(Math.sin(value)) < EPSILON) {
            return Infinity; // cotangent is undefined at multiples of π
        }

        if (Math.abs(Math.cos(value)) < EPSILON) {
            return 0; // cotangent approaches zero when cosine is near zero
        }

        return 1 / Math.tan(value);
    }

    visitLnExpr = (ctx: LnExprContext): unknown => {
        const value = this.visit(ctx.numberExpr()) as number;
        if (value <= 0) {
            throw new Error("Natural logarithm is undefined for non-positive values.");
        }

        return Math.log(value);
    }

    visitLogExpr = (ctx: LogExprContext): unknown => {
        const base = this.visit(ctx.numberExpr(0)) as number;
        const value = this.visit(ctx.numberExpr(1)) as number;
        if (base <= 0 || base === 1 || value <= 0) {
            throw new Error("Logarithm is undefined for non-positive bases or values, and base cannot be 1.");
        }

        return Math.log(value) / Math.log(base);
    }

    visitCbrtExpr = (ctx: CbrtExprContext): unknown => {
        const value = this.visit(ctx.numberExpr()) as number;
        if (value < 0) {
            return -Math.pow(-value, 1/3); // Handle negative cube roots
        }

        return Math.pow(value, 1/3);
    }

    visitSqrtExpr = (ctx: SqrtExprContext): unknown => {
        const value = this.visit(ctx.numberExpr()) as number;
        if (value < 0) {
            throw new Error("Square root is undefined for negative values.");
        }

        return Math.sqrt(value);
    }

    visitAbsExpr = (ctx: AbsExprContext): unknown => {
        const value = this.visit(ctx.numberExpr()) as number;
        return Math.abs(value);
    }

    visitExpExpr = (ctx: ExpExprContext): unknown => {
        const value = this.visit(ctx.numberExpr()) as number;
        return Math.exp(value);
    }

    visitLineDef = (ctx: LineDefContext): unknown => {
        let point1 = this.visit(ctx.pointExpr(0)) as { type: "Point", x: number, y: number, z: number };
        if (ctx.pointExpr().length === 2) {
            let point2 = this.visit(ctx.pointExpr(1)) as { type: "Point", x: number, y: number, z: number };
            return {
                type: "Line",
                point1: point1,
                point2: point2
            };
        }

        else if (ctx.lineExpr()) {
            let lineExpr = this.visit(ctx.lineExpr()!) as { type: "Line", point1: { x: number, y: number, z: number }, point2: { x: number, y: number, z: number } };
            return {
                type: "Line",
                point1: lineExpr.point1,
                point2: lineExpr.point2
            };
        }

        else {
            let vectorExpr = this.visit(ctx.vectorExpr()!) as { type: "Vector", x: number, y: number, z: number };
            return {
                type: "Line",
                point1: point1,
                point2: {
                    x: point1.x + vectorExpr.x,
                    y: point1.y + vectorExpr.y,
                    z: point1.z + vectorExpr.z
                }
            };
        }
    }

    visitSphereDef = (ctx: SphereDefContext): unknown => {
        let center = this.visit(ctx.pointExpr(0)) as { type: "Point", x: number, y: number, z: number };
        if (ctx.pointExpr().length === 2) {
            let pointOnSphere = this.visit(ctx.pointExpr(1)) as { type: "Point", x: number, y: number, z: number };
            let radius = Math.sqrt(
                Math.pow(pointOnSphere.x - center.x, 2) +
                Math.pow(pointOnSphere.y - center.y, 2) +
                Math.pow(pointOnSphere.z - center.z, 2)
            );
            
            return {
                type: "Sphere",
                center: center,
                radius: radius
            }
        }

        let radius = this.visit(ctx.numberExpr()!) as number;
        if (radius < 0) {
            throw new Error("Sphere radius cannot be negative.");
        }

        return {
            type: "Sphere",
            center: center,
            radius: radius
        };
    }

    visitAngleDef = (ctx: AngleDefContext): unknown => {
        if (ctx.vectorExpr().length === 1) {
            let vector = this.visit(ctx.vectorExpr(0)) as { type: "Vector", x: number, y: number, z: number };
            // Calculate the angle between the vector and the x-axis
            // We convert the coordinate to THREE.js coordinate, which y is up
            let v1 = utils3d.convertToVector3(vector.x, vector.y, vector.z);
            let v2 = utils3d.convertToVector3(1, 0, 0); // x-axis vector
            let angle = v1.angleTo(v2);
            return {
                type: "Angle",
                point: {x: 0, y: 0, z: 0}, // Default point at origin
                angle: angle
            };
        }

        if (ctx.pointExpr().length === 1) {
            let point = this.visit(ctx.pointExpr(0)) as { type: "Point", x: number, y: number, z: number };
            // Calculate the angle between the point and the x-axis
            let v1 = utils3d.convertToVector3(point.x, point.y, point.z);
            let v2 = utils3d.convertToVector3(1, 0, 0); // x-axis vector
            let angle = v1.angleTo(v2);
            return {
                type: "Angle",
                point: {x: 0, y: 0, z: 0},
                angle: angle
            };
        }

        if (ctx.vectorExpr().length === 2) {
            let vector1 = this.visit(ctx.vectorExpr(0)) as { type: "Vector", x: number, y: number, z: number };
            let vector2 = this.visit(ctx.vectorExpr(1)) as { type: "Vector", x: number, y: number, z: number };
            // Calculate the angle between two vectors
            let v1 = utils3d.convertToVector3(vector1.x, vector1.y, vector1.z);
            let v2 = utils3d.convertToVector3(vector2.x, vector2.y, vector2.z);
            let angle = v1.angleTo(v2);
            return {
                type: "Angle",
                point: {x: 0, y: 0, z: 0}, // Default point at origin
                angle: angle
            };
        }

        if (ctx.lineExpr().length === 1) {
            let line = this.visit(ctx.lineExpr(0)) as { type: "Line", point1: { x: number, y: number, z: number }, point2: { x: number, y: number, z: number } };
            let plane = this.visit(ctx.planeExpr(0)!) as { type: "Plane", point: { x: number, y: number, z: number }, normal: { x: number, y: number, z: number } };
            // Calculate the angle between the line and the plane
            let v1 = utils3d.convertToVector3(
                line.point2.x - line.point1.x,
                line.point2.y - line.point1.y,
                line.point2.z - line.point1.z
            );
            let v2 = utils3d.convertToVector3(plane.normal.x, plane.normal.y, plane.normal.z);
            let angle = v1.angleTo(v2);
            const tmpLine = factory.createLine(
                utils.createLineDefaultShapeProps(''),
                factory.createPoint(
                    utils.createPointDefaultShapeProps(''),
                    line.point1.x,
                    line.point1.y,
                    line.point1.z
                ),
                factory.createPoint(
                    utils.createPointDefaultShapeProps(''),
                    line.point2.x,
                    line.point2.y,
                    line.point2.z
                )
            );

            const tmpPlane = factory.createPlane(
                utils.createLineDefaultShapeProps(''),
                factory.createPoint(
                    utils.createPointDefaultShapeProps(''),
                    plane.point.x,
                    plane.point.y,
                    plane.point.z
                ),
                factory.createVector(
                    utils.createVectorDefaultShapeProps(''),
                    factory.createPoint(
                        utils.createPointDefaultShapeProps(''),
                        plane.point.x,
                        plane.point.y,
                        plane.point.z
                    ),
                    factory.createPoint(
                        utils.createPointDefaultShapeProps(''),
                        plane.point.x + plane.normal.x,
                        plane.point.y + plane.normal.y,
                        plane.point.z + plane.normal.z
                    )
                )
            );

            const intersection = operations.getIntersections3D(tmpLine, tmpPlane);
            const pointIntersection = intersection[0].coors;
            return {
                type: "Angle",
                point: pointIntersection,
                angle: angle
            };
        }
    }

    visitVectorDef = (ctx: VectorDefContext): unknown => {
        if (ctx.COMMA() !== undefined) {
            let point1 = this.visit(ctx.pointExpr(0)) as { type: "Point", x: number, y: number, z: number };
            let point2 = this.visit(ctx.pointExpr(1)) as { type: "Point", x: number, y: number, z: number };
            return {
                type: "Vector",
                point1: point1,
                point2: point2
            };
        }

        let point = this.visit(ctx.pointExpr(0)) as { type: "Point", x: number, y: number, z: number };
        return {
            type: "Vector",
            point1: { x: 0, y: 0, z: 0 },
            point2: point
        };
    }

    visitCircleDef = (ctx: CircleDefContext): unknown => {
        if (ctx.pointExpr().length === 2) {
            let center = this.visit(ctx.pointExpr(0)) as { type: "Point", x: number, y: number, z: number };
            let pointOnCircle = this.visit(ctx.pointExpr(1)) as { type: "Point", x: number, y: number, z: number };
            let radius = Math.sqrt(
                Math.pow(pointOnCircle.x - center.x, 2) +
                Math.pow(pointOnCircle.y - center.y, 2) +
                Math.pow(pointOnCircle.z - center.z, 2)
            );

            if (ctx.directionExpr()) {
                let direction = this.visit(ctx.directionExpr()!) as { type: "Direction", x: number, y: number, z: number };
                // Ensure the direction vector is a unit vector
                let dirLength = Math.sqrt(direction.x ** 2 + direction.y ** 2 + direction.z ** 2);
                if (dirLength < EPSILON) {
                    throw new Error("Direction vector cannot be zero.");
                }

                let norm = {
                    x: direction.x / dirLength,
                    y: direction.y / dirLength,
                    z: direction.z / dirLength
                };

                return {
                    type: "Circle",
                    center: center,
                    radius: radius,
                    normal: norm
                }
            }
            
            return {
                type: "Circle",
                center: center,
                radius: radius,
                normal: { x: 0, y: 0, z: 1 } // Default normal vector pointing in the z-direction
            }
        }

        if (ctx.pointExpr().length === 3) {
            let pointOnCircle1 = this.visit(ctx.pointExpr(0)) as { type: "Point", x: number, y: number, z: number };
            let pointOnCircle2 = this.visit(ctx.pointExpr(1)) as { type: "Point", x: number, y: number, z: number };
            let pointOnCircle3 = this.visit(ctx.pointExpr(2)) as { type: "Point", x: number, y: number, z: number };
            let [point1, point2, point3] = [factory.createPoint(
                utils.createPointDefaultShapeProps(''),
                pointOnCircle1.x,
                pointOnCircle1.y,
                pointOnCircle1.z
            ), factory.createPoint(
                utils.createPointDefaultShapeProps(''),
                pointOnCircle2.x,
                pointOnCircle2.y,
                pointOnCircle2.z
            ), factory.createPoint(
                utils.createPointDefaultShapeProps(''),
                pointOnCircle3.x,
                pointOnCircle3.y,
                pointOnCircle3.z
            )]

            let [center, radius] = [operations.circumcenter(point1, point2, point3), operations.circumradius(point1, point2, point3)];
            return {
                type: "Circle",
                center: center,
                radius: radius
            }
        }

        let center = this.visit(ctx.pointExpr(0)) as { type: "Point", x: number, y: number, z: number };
        let radius = this.visit(ctx.numberExpr()!) as number;
        if (radius < 0) {
            throw new Error("Circle radius cannot be negative.");
        }

        if (ctx.directionExpr()) {
            let direction = this.visit(ctx.directionExpr()!) as { type: "Direction", x: number, y: number, z: number };
            // Ensure the direction vector is a unit vector
            let dirLength = Math.sqrt(direction.x ** 2 + direction.y ** 2 + direction.z ** 2);
            if (dirLength < EPSILON) {
                throw new Error("Direction vector cannot be zero.");
            }

            let norm = {
                x: direction.x / dirLength,
                y: direction.y / dirLength,
                z: direction.z / dirLength
            };

            return {
                type: "Circle",
                center: center,
                radius: radius,
                normal: norm
            }
        }

        return {
            type: "Circle",
            center: center,
            radius: radius,
            normal: { x: 0, y: 0, z: 1 } // Default normal vector pointing in the z-direction
        };
    }

    visitPlaneDef = (ctx: PlaneDefContext): unknown => {
        if (ctx.SHAPE_ID() !== undefined) {
            let shapeId = ctx.SHAPE_ID()!.text;
            let keys = Array.from(this.DAG.keys());
            for (let key of keys) {
                if (key.includes(shapeId)) {
                    // Check if the shape is a polygon
                    let shape = this.DAG.get(key);
                    if (shape && 'points' in shape.type) {
                        // Form a plane from the polygon
                        let points = shape.type.points;
                        if (points.length < 3) {
                            throw new Error("A polygon must have at least 3 points to define a plane.");
                        }

                        // Caculate the normal vector of the plane using the first three points
                        let p1 = {
                            x: points[0].x,
                            y: points[0].y,
                            z: points[0].z
                        }

                        let p2 = {
                            x: points[1].x,
                            y: points[1].y,
                            z: points[1].z
                        }

                        let p3 = {
                            x: points[2].x,
                            y: points[2].y,
                            z: points[2].z
                        }

                        let cross = operations.cross(
                            p2.x - p1.x, p2.y - p1.y, (p2.z ?? 0) - (p1.z ?? 0),
                            p3.x - p1.x, p3.y - p1.y, (p3.z ?? 0) - (p1.z ?? 0)
                        );

                        let crossLength = Math.sqrt(cross.x ** 2 + cross.y ** 2 + cross.z ** 2);
                        if (crossLength < EPSILON) {
                            throw new Error("The first three points of the polygon are collinear, cannot define a plane.");
                        }

                        let normal = {
                            x: cross.x / Math.sqrt(cross.x ** 2 + cross.y ** 2 + cross.z ** 2),
                            y: cross.y / Math.sqrt(cross.x ** 2 + cross.y ** 2 + cross.z ** 2),
                            z: cross.z / Math.sqrt(cross.x ** 2 + cross.y ** 2 + cross.z ** 2)
                        }

                        return {
                            type: "Plane",
                            point: p1,
                            normal: normal
                        }
                    }
                }
            }

            throw new Error(`Shape with ID ${shapeId} not found or is not a polygon.`);
        }

        if (ctx.pointExpr().length === 3) {
            let p1 = this.visit(ctx.pointExpr(0)) as { type: "Point", x: number, y: number, z: number };
            let p2 = this.visit(ctx.pointExpr(1)) as { type: "Point", x: number, y: number, z: number };
            let p3 = this.visit(ctx.pointExpr(2)) as { type: "Point", x: number, y: number, z: number };

            let cross = operations.cross(
                p2.x - p1.x, p2.y - p1.y, (p2.z ?? 0) - (p1.z ?? 0),
                p3.x - p1.x, p3.y - p1.y, (p3.z ?? 0) - (p1.z ?? 0)
            );

            let crossLength = Math.sqrt(cross.x ** 2 + cross.y ** 2 + cross.z ** 2);
            if (crossLength < EPSILON) {
                throw new Error("The first three points of the polygon are collinear, cannot define a plane.");
            }

            let normal = {
                x: cross.x / Math.sqrt(cross.x ** 2 + cross.y ** 2 + cross.z ** 2),
                y: cross.y / Math.sqrt(cross.x ** 2 + cross.y ** 2 + cross.z ** 2),
                z: cross.z / Math.sqrt(cross.x ** 2 + cross.y ** 2 + cross.z ** 2)
            }

            return {
                type: "Plane",
                point: p1,
                normal: normal
            }
        }

        if (ctx.lineExpr().length === 2) {
            let l1 = this.visit(ctx.lineExpr(0)) as { type: "Line", point1: { x: number, y: number, z: number }, point2: { x: number, y: number, z: number } };
            let l2 = this.visit(ctx.lineExpr(1)) as { type: "Line", point1: { x: number, y: number, z: number }, point2: { x: number, y: number, z: number } };
            // Check if two lines are coincident
            let dir1 = {
                x: l1.point2.x - l1.point1.x,
                y: l1.point2.y - l1.point1.y,
                z: l1.point2.z - l1.point1.z
            }

            let dir2 = {
                x: l2.point2.x - l2.point1.x,
                y: l2.point2.y - l2.point1.y,
                z: l2.point2.z - l2.point1.z
            }

            let dir = {
                x: l2.point1.x - l1.point1.x,
                y: l2.point1.y - l1.point1.y,
                z: l2.point1.z - l1.point1.z
            }

            let cross = operations.cross(dir1.x, dir1.y, dir1.z, dir2.x, dir2.y, dir2.z);
            let cross1 = operations.cross(dir1.x, dir1.y, dir1.z, dir.x, dir.y, dir.z);
            if (Math.sqrt(cross.x ** 2 + cross.y ** 2 + cross.z ** 2) < EPSILON) {
                // Lines are parallel, check if they are coincident
                if (Math.sqrt(cross1.x ** 2 + cross1.y ** 2 + cross1.z ** 2) < EPSILON) {
                    throw new Error("The two lines are coincident, cannot define a unique plane.");
                }

                // Parallel, form a plane using one line and a point from the other line
                let point = l2.point1;
                let normal = cross1;
                let normalLength = Math.sqrt(normal.x ** 2 + normal.y ** 2 + normal.z ** 2);
                normal = {
                    x: normal.x / normalLength,
                    y: normal.y / normalLength,
                    z: normal.z / normalLength
                }

                return {
                    type: "Plane",
                    point: point,
                    normal: normal
                }
            }

            // Not parallel, form a plane using the two lines
            let normal = cross;
            let normalLength = Math.sqrt(normal.x ** 2 + normal.y ** 2 + normal.z ** 2);
            normal = {
                x: normal.x / normalLength,
                y: normal.y / normalLength,
                z: normal.z / normalLength
            }

            return {
                type: "Plane",
                point: l1.point1,
                normal: normal
            }
        }

        if (ctx.pointExpr().length === 1) {
            let point = this.visit(ctx.pointExpr(0)) as { type: "Point", x: number, y: number, z: number };
            if (ctx.planeExpr()) {
                let planeExpr = this.visit(ctx.planeExpr()!) as { type: "Plane", point: { x: number, y: number, z: number }, normal: { x: number, y: number, z: number } };
                // Return a plane parallel to the given plane passing through the point
                return {
                    type: "Plane",
                    point: point,
                    normal: planeExpr.normal
                }
            }

            if (ctx.lineExpr()) {
                let lineExpr = this.visit(ctx.lineExpr(0)!) as { type: "Line", point1: { x: number, y: number, z: number }, point2: { x: number, y: number, z: number } };
                // Return a plane perpendicular to the line passing through the point
                let dir = {
                    x: lineExpr.point2.x - lineExpr.point1.x,
                    y: lineExpr.point2.y - lineExpr.point1.y,
                    z: lineExpr.point2.z - lineExpr.point1.z
                }

                let dirLength = Math.sqrt(dir.x ** 2 + dir.y ** 2 + dir.z ** 2);
                dir = {
                    x: dir.x / dirLength,
                    y: dir.y / dirLength,
                    z: dir.z / dirLength
                }

                return {
                    type: "Plane",
                    point: point,
                    normal: dir
                }
            }

            if (ctx.vectorExpr()) {
                let vectorExpr1 = this.visit(ctx.vectorExpr(0)!) as { type: "Vector", x: number, y: number, z: number };
                let vectorExpr2 = this.visit(ctx.vectorExpr(1)!) as { type: "Vector", x: number, y: number, z: number };
                // Return a plane defined by the two vectors originating from the point
                let dir1 = {
                    x: vectorExpr1.x,
                    y: vectorExpr1.y,
                    z: vectorExpr1.z
                }

                let dir2 = {
                    x: vectorExpr2.x,
                    y: vectorExpr2.y,
                    z: vectorExpr2.z
                }

                let cross = operations.cross(dir1.x, dir1.y, dir1.z, dir2.x, dir2.y, dir2.z);
                let crossLength = Math.sqrt(cross.x ** 2 + cross.y ** 2 + cross.z ** 2);
                if (crossLength < EPSILON) {
                    throw new Error("The two vectors are collinear, cannot define a unique plane.");
                }

                let normal = {
                    x: cross.x / crossLength,
                    y: cross.y / crossLength,
                    z: cross.z / crossLength
                }

                return {
                    type: "Plane",
                    point: point,
                    normal: normal
                }
            }
        }
    }
}

export default ASTGen;