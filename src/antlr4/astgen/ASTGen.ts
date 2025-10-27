import { RuleNode } from "antlr4ts/tree/RuleNode";
import { 
    AbsExprContext,
    AdditiveExprContext,
    AngleDefContext,
    CbrtExprContext,
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
    PointExprContext,
    PointListContext,
    PolygonDefContext,
    PolygonExprContext,
    LineExprContext,
    ShapeExprContext,
    SegmentDefContext,
    RayDefContext,
    DirExprContext,
    VectorExprContext,
    DirectionExprContext,
    SegmentExprContext,
    RayExprContext,
    ConeDefContext,
    ConeExprContext,
    CylinderExprContext,
    IntersectionDefContext,
    PrismDefContext,
    PrismExprContext,
    TetrahedronDefContext,
    TetrahedronExprContext,
    TransformDefContext,
    CylinderDefContext,
    PyramidDefContext,
    PyramidExprContext
} from "../parser/MathCommandParser";
import { MathCommandVisitor } from "../parser/MathCommandVisitor";
import { ParseTree } from "antlr4ts/tree/ParseTree";
import { TerminalNode } from "antlr4ts/tree/TerminalNode";
import { ErrorNode } from "antlr4ts/tree/ErrorNode";
import * as geometry from "../../types/geometry";
import {
    createAngleDefaultShapeProps,
    createCircleDefaultShapeProps,
    createCylinderDefaultShapeProps,
    createPlaneDefaultShapeProps,
    createLineDefaultShapeProps,
    createPointDefaultShapeProps,
    createPolygonDefaultShapeProps,
    createSphereDefaultShapeProps,
    createVectorDefaultShapeProps,
    getExcelLabel
} from '../../utils/utilities'
import * as operations from "../../utils/math_operation"
import * as factory from "../../utils/Factory";

const EPSILON = 1e-6;

class ASTGen implements MathCommandVisitor<unknown> {
    private DAG: Map<string, geometry.ShapeNode3D>;
    private labelUsed: Array<string>;
    constructor(DAG: Map<string, geometry.ShapeNode3D>, labelUsed: Array<string>) {
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
        const shapeInfo = this.visit(ctx.expr()) as { shape: geometry.Shape, defined: boolean };
        const shape = shapeInfo.shape;
        if ('x' in shape && 'y' in shape) {
            let label = getExcelLabel('A', 0);
            let index = 0;
            while (this.labelUsed.includes(label)) {
                index++;
                label = getExcelLabel('A', index);
            }

            this.labelUsed.push(label);
            shape.props.label = label;
            this.DAG.set(shape.props.id, {
                id: shape.props.id,
                defined: shapeInfo.defined,
                isSelected: false,
                dependsOn: [],
                type: shape
            })
        }

        else if ('startLine' in shape || 'startVector' in shape || 'startRay' in shape || 'startSegment' in shape) {
            const mode = 'startLine' in shape ? "line" : ('startVector' in shape ? "vector" : ('startRay' in shape ? "ray" : "segment"));
            let index = 0;
            let label = `${mode}${index}`;
            while (this.labelUsed.includes(label)) {
                index++;
                label = `${mode}${index}`;
            }

            this.labelUsed.push(label);
            shape.props.label = label;
            shape.props.id = mode === 'vector' ? `vector-${label}` : `line-${label}`;

            switch (mode) {
                case 'vector': {
                    const dir = {
                        x: (shape as geometry.Vector).endVector.x - (shape as geometry.Vector).startVector.x,
                        y: (shape as geometry.Vector).endVector.y - (shape as geometry.Vector).startVector.y,
                        z: ((shape as geometry.Vector).endVector.z ?? 0) - ((shape as geometry.Vector).startVector.z ?? 0),
                    }

                    if (dir.x ** 2 + dir.y ** 2 + dir.z ** 2 <= 1e-6) {
                        return; // 2 points are consider the same, no
                    }

                    let shapeNode: geometry.ShapeNode3D = {
                        id: shape.props.id,
                        type: shape,
                        dependsOn: [(shape as geometry.Vector).startVector.props.id, (shape as geometry.Vector).endVector.props.id],
                        defined: true,
                        isSelected: false
                    }

            
                    this.DAG.set(shape.props.id, shapeNode);
                    break;
                }
                    
                case 'line': {
                    const dir = {
                        x: (shape as geometry.Line).endLine.x - (shape as geometry.Line).startLine.x,
                        y: (shape as geometry.Line).endLine.y - (shape as geometry.Line).startLine.y,
                        z: ((shape as geometry.Line).endLine.z ?? 0) - ((shape as geometry.Line).startLine.z ?? 0),
                    }

                    if (dir.x ** 2 + dir.y ** 2 + dir.z ** 2 <= 1e-6) {
                        return; // 2 points are consider the same, no
                    }

                    let shapeNode: geometry.ShapeNode3D = {
                        id: shape.props.id,
                        type: shape,
                        dependsOn: [(shape as geometry.Line).startLine.props.id, (shape as geometry.Line).endLine.props.id],
                        defined: true,
                        isSelected: false
                    }

            
                    this.DAG.set(shape.props.id, shapeNode);
                    break;
                }

                case 'ray': {
                    const dir = {
                        x: (shape as geometry.Ray).endRay.x - (shape as geometry.Ray).startRay.x,
                        y: (shape as geometry.Ray).endRay.y - (shape as geometry.Ray).startRay.y,
                        z: ((shape as geometry.Ray).endRay.z ?? 0) - ((shape as geometry.Ray).startRay.z ?? 0),
                    }

                    if (dir.x ** 2 + dir.y ** 2 + dir.z ** 2 <= 1e-6) {
                        return; // 2 points are consider the same, no
                    }

                    let shapeNode: geometry.ShapeNode3D = {
                        id: shape.props.id,
                        type: shape,
                        dependsOn: [(shape as geometry.Ray).startRay.props.id, (shape as geometry.Ray).endRay.props.id],
                        defined: true,
                        isSelected: false
                    }

            
                    this.DAG.set(shape.props.id, shapeNode);
                    break;
                }
                    
                default: {
                    const dir = {
                        x: (shape as geometry.Segment).endSegment.x - (shape as geometry.Segment).startSegment.x,
                        y: (shape as geometry.Segment).endSegment.y - (shape as geometry.Segment).startSegment.y,
                        z: ((shape as geometry.Segment).endSegment.z ?? 0) - ((shape as geometry.Segment).startSegment.z ?? 0),
                    }

                    if (dir.x ** 2 + dir.y ** 2 + dir.z ** 2 <= 1e-6) {
                        return; // 2 points are consider the same, no
                    }

                    let shapeNode: geometry.ShapeNode3D = {
                        id: shape.props.id,
                        type: shape,
                        dependsOn: [(shape as geometry.Segment).startSegment.props.id, (shape as geometry.Segment).endSegment.props.id],
                        defined: true,
                        isSelected: false
                    }

            
                    this.DAG.set(shape.props.id, shapeNode);
                    break;
                }
            }
        }

        else if ('centerC' in shape && 'radius' in shape) {
            let index = 0;
            let label = `circle${index}`;
            while (this.labelUsed.includes(label)) {
                index++;
                label = `circle${index}`;
            }

            shape.props.label = label;
            shape.props.id = `circle-${label}`

            let shapeNode: geometry.ShapeNode3D = {
                id: shape.props.id,
                type: shape,
                dependsOn: [(shape as geometry.Circle).centerC.props.id],
                defined: true,
                isSelected: false
            }


            this.DAG.set(shape.props.id, shapeNode);
        }

        else if ('points' in shape) {
            let poly = shape as geometry.Polygon;
            for (let i = 0; i < poly.points.length; i++) {
                const p1 = poly.points[i], p2 = poly.points[(i + 1) % poly.points.length];
                const dir = {
                    x: p2.x - p1.x,
                    y: p2.y - p1.y,
                    z: (p2.z ?? 0) - (p1.z ?? 0),
                }

                if (dir.x ** 2 + dir.y ** 2 + dir.z ** 2 <= 1e-6) {
                    return; // 2 points are consider the same, no
                }
            }

            if (!operations.checkCoplanar(poly.points)) {
                return;
            }

            let idx = 0;
            let label = `poly${idx}`;
            while (this.labelUsed.includes(label)) {
                idx += 1;
                label = `poly${idx}`;
            }

            this.labelUsed.push(label);
            shape.props.label = label;
            shape.props.id = `polygon-${label}`;
            let dependencies: string[] = [];
            dependencies = poly.points.map(point => point.props.id);
            for (let i = 0; i < poly.points.length; i++) {
                let p = poly.points[i];
                let pNext = poly.points[(i + 1) % poly.points.length];
                let label = `segment0`
                let index = 0;
                while (this.labelUsed.includes(label)) {
                    index++;
                    label = `segment${index}`;
                }

                this.labelUsed.push(label);
                let segment = factory.createSegment(
                    createLineDefaultShapeProps(label),
                    p,
                    pNext
                );

                segment.props.color = poly.props.color;
                let shapeNode: geometry.ShapeNode3D = {
                    id: segment.props.id,
                    type: segment,
                    dependsOn: [p.props.id, pNext.props.id, poly.props.id],
                    defined: true,
                    isSelected: false
                }

                this.DAG.set(segment.props.id, shapeNode);
            }

            let shapeNode: geometry.ShapeNode3D = {
                id: poly.props.id,
                type: poly,
                dependsOn: dependencies,
                defined: true,
                isSelected: false
            }
    
            this.DAG.set(poly.props.id, shapeNode);
        }

        return;
    };

    visitExpr = (ctx: ExprContext): unknown => {
        return this.visitChildren(ctx);
    }

    visitPointDef = (ctx: PointDefContext): unknown => {
        return {
            shape: factory.createPoint(
                createPointDefaultShapeProps(''),
                this.visit(ctx.numberExpr(0)) as number,
                this.visit(ctx.numberExpr(1)) as number,
                this.visit(ctx.numberExpr(2)) as number
            ),
            defined: true
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
        let point1 = this.visit(ctx.pointExpr(0)) as { shape: geometry.Point, defined: boolean };
        if (!point1.defined) {
            return {
                shape: factory.createLine(
                    createLineDefaultShapeProps(''),
                    factory.createPoint(
                        createPointDefaultShapeProps(''),
                        0, 0, 0
                    ),
                    factory.createPoint(
                        createPointDefaultShapeProps(''),
                        0, 0, 0
                    )
                ),
                defined: false
            }
        }

        if (ctx.pointExpr().length === 2) {
            let point2 = this.visit(ctx.pointExpr(1)) as { shape:  geometry.Point, defined: boolean };
            return {
                shape: factory.createLine(
                    createLineDefaultShapeProps(''),
                    point1.shape,
                    point2.shape
                ),
                defined: point2.defined
            }
        }

        else if (ctx.lineExpr()) {
            let lineExpr = this.visit(ctx.lineExpr()!) as { shape: geometry.Line, defined: boolean };
            // Return a line parallel to the given lineExpr passing through point1
            return {
                shape: factory.createLine(
                    createLineDefaultShapeProps(''),
                    point1.shape,
                    factory.createPoint(
                        createPointDefaultShapeProps(''),
                        point1.shape.x + (lineExpr.shape.endLine.x - lineExpr.shape.startLine.x),
                        point1.shape.y + (lineExpr.shape.endLine.y - lineExpr.shape.startLine.y),
                        (point1.shape.z ?? 0) + ((lineExpr.shape.endLine.z ?? 0) - (lineExpr.shape.startLine.z ?? 0))
                    )
                ),
                defined: lineExpr.defined
            }
        }

        else {
            let vectorExpr = this.visit(ctx.vectorExpr()!) as { shape: geometry.Vector, defined: boolean };
            return {
                shape: factory.createLine(
                    createLineDefaultShapeProps(''),
                    point1.shape,
                    factory.createPoint(
                        createPointDefaultShapeProps(''),
                        point1.shape.x + (vectorExpr.shape.endVector.x - vectorExpr.shape.startVector.x),
                        point1.shape.y + (vectorExpr.shape.endVector.y - vectorExpr.shape.startVector.y),
                        (point1.shape.z ?? 0) + ((vectorExpr.shape.endVector.z ?? 0) - (vectorExpr.shape.startVector.z ?? 0))
                    )
                ),
                defined: vectorExpr.defined
            }
        }
    }

    visitSphereDef = (ctx: SphereDefContext): unknown => {
        let center = this.visit(ctx.pointExpr(0)) as { shape:  geometry.Point, defined: boolean };
        if (!center.defined) {
            return {
                shape: factory.createSphere(
                    createSphereDefaultShapeProps('', 0),
                    center.shape,
                    0
                ),
                defined: false
            }
        }

        if (ctx.pointExpr().length === 2) {
            let pointOnSphere = this.visit(ctx.pointExpr(1)) as { shape:  geometry.Point, defined: boolean };
            let radius = Math.sqrt(
                Math.pow(pointOnSphere.shape.x - center.shape.x, 2) +
                Math.pow(pointOnSphere.shape.y - center.shape.y, 2) +
                Math.pow((pointOnSphere.shape.z ?? 0) - (center.shape.z ?? 0), 2)
            );
            
            return {
                shape: factory.createSphere(
                    createSphereDefaultShapeProps('', radius),
                    center.shape,
                    radius
                ),
                defined: pointOnSphere.defined
            }
        }

        let radius = this.visit(ctx.numberExpr()!) as number;
        if (radius < 0) {
            throw new Error("Sphere radius cannot be negative.");
        }

        return {
            shape: factory.createSphere(
                createSphereDefaultShapeProps('', radius),
                center.shape,
                radius
            ),
            defined: true
        }
    }

    visitAngleDef = (ctx: AngleDefContext): unknown => {
        if (ctx.vectorExpr().length === 1) {
            let vector = this.visit(ctx.vectorExpr(0)) as { shape: geometry.Vector, defined: boolean };
            return {
                shape: factory.createAngle(
                    createAngleDefaultShapeProps(''),
                    factory.createVector(
                        createVectorDefaultShapeProps(''),
                        factory.createPoint(
                            createPointDefaultShapeProps(''),
                            0, 0, 0
                        ),
                        factory.createPoint(
                            createPointDefaultShapeProps(''),
                            1, 0, 0
                        )
                    ),
                    vector.shape
                ),
                defined: vector.defined
            }
        }

        if (ctx.pointExpr().length === 1) {
            let point = this.visit(ctx.pointExpr(0)) as { shape:  geometry.Point, defined: boolean };
            return {
                shape: factory.createAngle(
                    createAngleDefaultShapeProps(''),
                    factory.createVector(
                        createVectorDefaultShapeProps(''),
                        factory.createPoint(
                            createPointDefaultShapeProps(''),
                            0, 0, 0
                        ),
                        factory.createPoint(
                            createPointDefaultShapeProps(''),
                            1, 0, 0
                        )
                    ),
                    factory.createVector(
                        createVectorDefaultShapeProps(''),
                        factory.createPoint(
                            createPointDefaultShapeProps(''),
                            0, 0, 0
                        ),
                        point.shape
                    ),
                ),
                defined: point.defined
            }
        }

        if (ctx.vectorExpr().length === 2) {
            let vector1 = this.visit(ctx.vectorExpr(0)) as { shape: geometry.Vector, defined: boolean };
            let vector2 = this.visit(ctx.vectorExpr(1)) as { shape: geometry.Vector, defined: boolean };

            return {
                shape: factory.createAngle(
                    createAngleDefaultShapeProps(''),
                    vector1.shape,
                    vector2.shape
                ),
                defined: vector1.defined && vector2.defined
            }
        }

        if (ctx.lineExpr().length === 1) {
            let line = this.visit(ctx.lineExpr(0)) as { shape: geometry.Line, defined: boolean };
            let plane = this.visit(ctx.planeExpr(0)!) as { shape: geometry.Plane, defined: boolean };
            const intersection = operations.getIntersections3D(line.shape, plane.shape);
            const pointIntersection = intersection[0].coors;

            let v = {
                x: line.shape.endLine.x - line.shape.startLine.x,
                y: line.shape.endLine.y - line.shape.startLine.y,
                z: (line.shape.endLine.z ?? 0) - (line.shape.startLine.z ?? 0), 
            }

            let n = {
                x: plane.shape.norm.endVector.x - plane.shape.norm.startVector.x,
                y: plane.shape.norm.endVector.y - plane.shape.norm.startVector.y,
                z: (plane.shape.norm.endVector.z ?? 0) - (plane.shape.norm.startVector.z ?? 0),
            };

            let v_plane = {
                x: v.x - (operations.dot(v.x, v.y, v.z, n.x, n.y, n.z) / (n.x ** 2 + n.y ** 2 + n.z ** 2) * n.x),
                y: v.y - (operations.dot(v.y, v.y, v.z, n.y, n.y, n.z) / (n.y ** 2 + n.y ** 2 + n.z ** 2) * n.y),
                z: v.z - (operations.dot(v.z, v.y, v.z, n.z, n.y, n.z) / (n.z ** 2 + n.y ** 2 + n.z ** 2) * n.z),
            }

            return {
                shape: factory.createAngle(
                    createAngleDefaultShapeProps(''),
                    factory.createVector(
                        createVectorDefaultShapeProps(''),
                        factory.createPoint(
                            createPointDefaultShapeProps(''),
                            pointIntersection?.x ?? 0, pointIntersection?.y ?? 0, pointIntersection?.z ?? 0
                        ),
                        factory.createPoint(
                            createPointDefaultShapeProps(''),
                            (pointIntersection?.x ?? 0) + v_plane.x,
                            (pointIntersection?.y ?? 0) + v_plane.y,
                            (pointIntersection?.z ?? 0) + v_plane.z,
                        )
                    ),
                    factory.createVector(
                        createVectorDefaultShapeProps(''),
                        line.shape.startLine,
                        line.shape.endLine
                    ),
                    factory.createPoint(
                        createPointDefaultShapeProps(''),
                        pointIntersection?.x ?? 0, pointIntersection?.y ?? 0, pointIntersection?.z ?? 0
                    )
                ),
                defined: line.defined && plane.defined
            }
        }
    }

    visitVectorDef = (ctx: VectorDefContext): unknown => {
        if (ctx.COMMA() !== undefined) {
            let point1 = this.visit(ctx.pointExpr(0)) as { shape:  geometry.Point, defined: boolean };
            let point2 = this.visit(ctx.pointExpr(1)) as { shape:  geometry.Point, defined: boolean };

            return {
                shape: factory.createVector(
                    createVectorDefaultShapeProps(''),
                    point1.shape,
                    point2.shape
                ),
                defined: point1.defined && point2.defined
            }
        }

        let point = this.visit(ctx.pointExpr(0)) as { shape:  geometry.Point, defined: boolean };
        return {
            shape: factory.createVector(
                createVectorDefaultShapeProps(''),
                factory.createPoint(
                    createPointDefaultShapeProps(''),
                    0, 0, 0
                ),
                point.shape
            ),
            defined: point.defined
        }
    }

    visitCircleDef = (ctx: CircleDefContext): unknown => {
        if (ctx.pointExpr().length === 2) {
            let center = this.visit(ctx.pointExpr(0)) as { shape:  geometry.Point, defined: boolean };
            let pointOnCircle = this.visit(ctx.pointExpr(1)) as { shape:  geometry.Point, defined: boolean };
            let radius = Math.sqrt(
                Math.pow(pointOnCircle.shape.x - center.shape.x, 2) +
                Math.pow(pointOnCircle.shape.y - center.shape.y, 2) +
                Math.pow((pointOnCircle.shape.z ?? 0) - (center.shape.z ?? 0), 2)
            );

            if (ctx.directionExpr()) {
                let direction = this.visit(ctx.directionExpr()!) as { shape: geometry.Vector, defined: boolean };
                // Ensure the direction vector is a unit vector
                let dirLength = Math.sqrt(
                    (direction.shape.endVector.x - direction.shape.startVector.x) ** 2 +
                    (direction.shape.endVector.y - direction.shape.startVector.y) ** 2 +
                    ((direction.shape.endVector.z ?? 0) - (direction.shape.startVector.z ?? 0)) ** 2
                );

                if (dirLength < EPSILON) {
                    throw new Error("Direction vector cannot be zero.");
                }

                return {
                    shape: factory.createCircle(
                        createCircleDefaultShapeProps('', radius),
                        center.shape,
                        radius,
                        direction.shape
                    ),
                    defined: center.defined && direction.defined && pointOnCircle.defined
                }
            }
            
            return {
                shape: factory.createCircle(
                    createCircleDefaultShapeProps('', radius),
                    center.shape,
                    radius,
                    factory.createVector(
                        createVectorDefaultShapeProps(''),
                        center.shape,
                        factory.createPoint(
                            createPointDefaultShapeProps(''),
                            center.shape.x,
                            center.shape.y,
                            (center.shape.z ?? 0) + 1
                        )
                    )
                ),
                defined: center.defined && pointOnCircle.defined
            }
        }

        if (ctx.pointExpr().length === 3) {
            let pointOnCircle1 = this.visit(ctx.pointExpr(0)) as { shape:  geometry.Point, defined: boolean };
            let pointOnCircle2 = this.visit(ctx.pointExpr(1)) as { shape:  geometry.Point, defined: boolean };
            let pointOnCircle3 = this.visit(ctx.pointExpr(2)) as { shape:  geometry.Point, defined: boolean };

            let [center, radius] = [operations.circumcenter(pointOnCircle1.shape, pointOnCircle2.shape, pointOnCircle3.shape), operations.circumradius(pointOnCircle1.shape, pointOnCircle2.shape, pointOnCircle3.shape)];
            // Compute the normal vector of the circle plane
            const v1 = {
                x: pointOnCircle2.shape.x - pointOnCircle1.shape.x,
                y: pointOnCircle2.shape.y - pointOnCircle1.shape.y,
                z: (pointOnCircle2.shape.z ?? 0) - (pointOnCircle1.shape.z ?? 0)
            };

            const v2 = {
                x: pointOnCircle3.shape.x - pointOnCircle1.shape.x,
                y: pointOnCircle3.shape.y - pointOnCircle1.shape.y,
                z: (pointOnCircle3.shape.z ?? 0) - (pointOnCircle1.shape.z ?? 0)
            };

            const cross = operations.cross(v1.x, v1.y, v1.z, v2.x, v2.y, v2.z);
            if (Math.sqrt(cross.x ** 2 + cross.y ** 2 + cross.z ** 2) < EPSILON) {
                throw new Error("The three points are collinear, cannot define a circle.");
            }

            return {
                shape: factory.createCircle(
                    createCircleDefaultShapeProps('', radius),
                    factory.createPoint(
                        createPointDefaultShapeProps(''),
                        center.x,
                        center.y,
                        center.z ?? 0
                    ),
                    radius,
                    factory.createVector(
                        createVectorDefaultShapeProps(''),
                        factory.createPoint(
                            createPointDefaultShapeProps(''),
                            0, 0, 0
                        ),
                        factory.createPoint(
                            createPointDefaultShapeProps(''),
                            cross.x, cross.y, cross.z
                        )
                    )
                ),
                defined: pointOnCircle1.defined && pointOnCircle2.defined && pointOnCircle3.defined
            }
        }

        let center = this.visit(ctx.pointExpr(0)) as { shape:  geometry.Point, defined: boolean };
        let radius = this.visit(ctx.numberExpr()!) as number;
        if (radius < 0) {
            throw new Error("Circle radius cannot be negative.");
        }

        if (ctx.directionExpr()) {
            let direction = this.visit(ctx.directionExpr()!) as { shape: geometry.Vector, defined: boolean };
            // Ensure the direction vector is a unit vector
            let dirLength = Math.sqrt(
                (direction.shape.endVector.x - direction.shape.startVector.x) ** 2 +
                (direction.shape.endVector.y - direction.shape.startVector.y) ** 2 +
                ((direction.shape.endVector.z ?? 0) - (direction.shape.startVector.z ?? 0)) ** 2
            );

            if (dirLength < EPSILON) {
                throw new Error("Direction vector cannot be zero.");
            }

            return {
                shape: factory.createCircle(
                    createCircleDefaultShapeProps('', radius),
                    center.shape,
                    radius,
                    direction.shape
                ),
                defined: center.defined && direction.defined
            }
        }

        return {
            shape: factory.createCircle(
                createCircleDefaultShapeProps('', radius),
                center.shape,
                radius,
            ),
            defined: center.defined
        }
    }

    visitPlaneDef = (ctx: PlaneDefContext): unknown => {
        if (ctx.SHAPE_ID() !== undefined) {
            let shapeId = ctx.SHAPE_ID()!.text;
            let keys = Array.from(this.DAG.keys());
            for (let key of keys) {
                const node = this.DAG.get(key);
                if (node && node.type.props.label === shapeId) {
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
                            shape: factory.createPlane(
                                createPlaneDefaultShapeProps(''),
                                points[0],
                                factory.createVector(
                                    createVectorDefaultShapeProps(''),
                                    points[0],
                                    factory.createPoint(
                                        createPointDefaultShapeProps(''),
                                        points[0].x + normal.x,
                                        points[0].y + normal.y,
                                        (points[0].z ?? 0) + (normal.z ?? 0)
                                    )
                                )
                            ),
                            defined: node.defined
                        }
                    }
                }
            }

            throw new Error(`Shape with ID ${shapeId} not found or is not a polygon.`);
        }

        if (ctx.pointExpr().length === 3) {
            let p1 = this.visit(ctx.pointExpr(0)) as { shape:  geometry.Point, defined: boolean };
            let p2 = this.visit(ctx.pointExpr(1)) as { shape:  geometry.Point, defined: boolean };
            let p3 = this.visit(ctx.pointExpr(2)) as { shape:  geometry.Point, defined: boolean };

            let cross = operations.cross(
                p2.shape.x - p1.shape.x, p2.shape.y - p1.shape.y, (p2.shape.z ?? 0) - (p1.shape.z ?? 0),
                p3.shape.x - p1.shape.x, p3.shape.y - p1.shape.y, (p3.shape.z ?? 0) - (p1.shape.z ?? 0)
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
                shape: factory.createPlane(
                    createPlaneDefaultShapeProps(''),
                    p1.shape,
                    factory.createVector(
                        createVectorDefaultShapeProps(''),
                        p1.shape,
                        factory.createPoint(
                            createPointDefaultShapeProps(''),
                            p1.shape.x + normal.x,
                            p1.shape.y + normal.y,
                            (p1.shape.z ?? 0) + (normal.z ?? 0)
                        )
                    )
                ),
                defined: p1.defined && p2.defined && p3.defined
            }
        }

        if (ctx.lineExpr().length === 2) {
            let l1 = this.visit(ctx.lineExpr(0)) as { shape: geometry.Line, defined: boolean };
            let l2 = this.visit(ctx.lineExpr(1)) as { shape: geometry.Line, defined: boolean };
            // Check if two lines are coincident
            let dir1 = {
                x: l1.shape.endLine.x - l1.shape.startLine.x,
                y: l1.shape.endLine.y - l1.shape.startLine.y,
                z: (l1.shape.endLine.z ?? 0) - (l1.shape.startLine.z ?? 0)
            }

            let dir2 = {
                x: l2.shape.endLine.x - l2.shape.startLine.x,
                y: l2.shape.endLine.y - l2.shape.startLine.y,
                z: (l2.shape.endLine.z ?? 0) - (l2.shape.startLine.z ?? 0)
            }

            let dir = {
                x: l2.shape.startLine.x - l1.shape.startLine.x,
                y: l2.shape.startLine.y - l1.shape.startLine.y,
                z: (l2.shape.startLine.z ?? 0) - (l1.shape.startLine.z ?? 0)
            }

            let cross = operations.cross(dir1.x, dir1.y, dir1.z, dir2.x, dir2.y, dir2.z);
            let cross1 = operations.cross(dir1.x, dir1.y, dir1.z, dir.x, dir.y, dir.z);
            if (Math.sqrt(cross.x ** 2 + cross.y ** 2 + cross.z ** 2) < EPSILON) {
                // Lines are parallel, check if they are coincident
                if (Math.sqrt(cross1.x ** 2 + cross1.y ** 2 + cross1.z ** 2) < EPSILON) {
                    throw new Error("The two lines are coincident, cannot define a unique plane.");
                }

                // Parallel, form a plane using one line and a point from the other line
                let point = l2.shape.startLine;
                let normal = cross1;
                let normalLength = Math.sqrt(normal.x ** 2 + normal.y ** 2 + normal.z ** 2);
                normal = {
                    x: normal.x / normalLength,
                    y: normal.y / normalLength,
                    z: normal.z / normalLength
                }

                return {
                    shape: factory.createPlane(
                        createPlaneDefaultShapeProps(''),
                        point,
                        factory.createVector(
                            createVectorDefaultShapeProps(''),
                            point,
                            factory.createPoint(
                                createPointDefaultShapeProps(''),
                                point.x + normal.x,
                                point.y + normal.y,
                                (point.z ?? 0) + (normal.z ?? 0)
                            )
                        )
                    ),
                    defined: l1.defined && l2.defined
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
                shape: factory.createPlane(
                    createPlaneDefaultShapeProps(''),
                    l1.shape.startLine,
                    factory.createVector(
                        createVectorDefaultShapeProps(''),
                        l1.shape.startLine,
                        factory.createPoint(
                            createPointDefaultShapeProps(''),
                            l1.shape.startLine.x + normal.x,
                            l1.shape.startLine.y + normal.y,
                            (l1.shape.startLine.z ?? 0) + (normal.z ?? 0)
                        )
                    )
                ),
                defined: l1.defined && l2.defined
            }
        }

        if (ctx.pointExpr().length === 1) {
            let point = this.visit(ctx.pointExpr(0)) as { shape:  geometry.Point, defined: boolean };
            if (ctx.planeExpr()) {
                let planeExpr = this.visit(ctx.planeExpr()!) as { shape: geometry.Plane, defined: boolean };
                // Return a plane parallel to the given plane passing through the point
                return {
                    shape: factory.createPlane(
                        createPlaneDefaultShapeProps(''),
                        point.shape,
                        planeExpr.shape.norm
                    ),
                    defined: point.defined && planeExpr.defined
                }
            }

            if (ctx.lineExpr()) {
                let lineExpr = this.visit(ctx.lineExpr(0)!) as { shape: geometry.Line, defined: boolean };
                // Return a plane perpendicular to the line passing through the point
                let dir = {
                    x: lineExpr.shape.endLine.x - lineExpr.shape.startLine.x,
                    y: lineExpr.shape.endLine.y - lineExpr.shape.startLine.y,
                    z: (lineExpr.shape.endLine.z ?? 0) - (lineExpr.shape.startLine.z ?? 0)
                }

                let dirLength = Math.sqrt(dir.x ** 2 + dir.y ** 2 + dir.z ** 2);
                dir = {
                    x: dir.x / dirLength,
                    y: dir.y / dirLength,
                    z: dir.z / dirLength
                }

                return {
                    shape: factory.createPlane(
                        createPlaneDefaultShapeProps(''),
                        point.shape,
                        factory.createVector(
                            createVectorDefaultShapeProps(''),
                            factory.createPoint(
                                createPointDefaultShapeProps(''),
                                0, 0, 0
                            ),
                            factory.createPoint(
                                createPointDefaultShapeProps(''),
                                dir.x, dir.y, dir.z
                            ),
                        )
                    ),
                    defined: point.defined && lineExpr.defined
                }
            }

            if (ctx.vectorExpr()) {
                let vectorExpr1 = this.visit(ctx.vectorExpr(0)!) as { shape: geometry.Vector, defined: boolean };
                let vectorExpr2 = this.visit(ctx.vectorExpr(1)!) as { shape: geometry.Vector, defined: boolean };
                // Return a plane defined by the two vectors originating from the point
                let dir1 = {
                    x: vectorExpr1.shape.endVector.x - vectorExpr1.shape.startVector.x,
                    y: vectorExpr1.shape.endVector.y - vectorExpr1.shape.startVector.y,
                    z: (vectorExpr1.shape.endVector.z ?? 0) - (vectorExpr1.shape.startVector.z ?? 0)
                }

                let dir2 = {
                    x: vectorExpr2.shape.endVector.x - vectorExpr2.shape.startVector.x,
                    y: vectorExpr2.shape.endVector.y - vectorExpr2.shape.startVector.y,
                    z: (vectorExpr2.shape.endVector.z ?? 0) - (vectorExpr2.shape.startVector.z ?? 0)
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
                    shape: factory.createPlane(
                        createPlaneDefaultShapeProps(''),
                        point.shape,
                        factory.createVector(
                            createVectorDefaultShapeProps(''),
                            factory.createPoint(
                                createPointDefaultShapeProps(''),
                                0, 0, 0
                            ),
                            factory.createPoint(
                                createPointDefaultShapeProps(''),
                                normal.x, normal.y, normal.z
                            ),
                        )
                    ),
                    defined: point.defined && vectorExpr1.defined && vectorExpr2.defined
                }
            }
        }
    }

    visitPointExpr = (ctx: PointExprContext): unknown => {
        if (ctx.POINT_ID() !== undefined) {
            let label = ctx.POINT_ID()!.text;
            let keys = Array.from(this.DAG.keys());
            for (let key of keys) {
                const node = this.DAG.get(key);
                if (node && node.type.props.label === label) {
                    // Check if the shape is a point
                    if ('x' in node.type && 'y' in node.type) {
                        return { shape: node.type, defined: node.defined };
                    }

                    throw new Error(`Shape with ID ${label} is not a point.`);
                }
            }

            throw new Error(`Shape with ID ${label} not found.`);
        }

        return this.visitChildren(ctx);
    }

    visitPointList = (ctx: PointListContext): unknown => {
        let arr: { shape:  geometry.Point, defined: boolean }[] = [];
        if (ctx.pointList() !== undefined) {
            let point = this.visit(ctx.pointExpr()!) as { shape:  geometry.Point, defined: boolean };
            arr = this.visit(ctx.pointList()!) as { shape:  geometry.Point, defined: boolean }[];
            arr.unshift(point);
            return arr;
        }

        let point = this.visit(ctx.pointExpr()) as { shape:  geometry.Point, defined: boolean };
        arr.push(point);
        return arr;
    }

    visitPolygonDef = (ctx: PolygonDefContext): unknown => {
        let points = this.visit(ctx.pointList()) as { shape: geometry.Point, defined: boolean }[];
        if (points.length < 3) {
            throw new Error("A polygon must have at least 3 points.");
        }

        return {
            shape: factory.createPolygon(
                createPolygonDefaultShapeProps(''),
                points.map(p => p.shape)
            ),
            defined: points.every(p => p.defined === true)
        }
    }

    visitPolygonExpr = (ctx: PolygonExprContext): unknown => {
        if (ctx.SHAPE_ID() !== undefined) {
            let shapeId = ctx.SHAPE_ID()!.text;
            let keys = Array.from(this.DAG.keys());
            for (let key of keys) {
                const node = this.DAG.get(key);
                if (node && node.type.props.label === shapeId) {
                    // Check if the shape is a polygon
                    if ('points' in node.type) {
                        return { shape: node.type, defined: node.defined };
                    }

                    throw new Error(`Shape with ID ${shapeId} is not a polygon.`);
                }
            }

            throw new Error(`Shape with ID ${shapeId} not found.`);
        }

        return this.visitChildren(ctx);
    }

    visitLineExpr = (ctx: LineExprContext): unknown => {
        if (ctx.SHAPE_ID() !== undefined) {
            let shapeId = ctx.SHAPE_ID()!.text;
            let keys = Array.from(this.DAG.keys());
            for (let key of keys) {
                const node = this.DAG.get(key);
                if (node && node.type.props.label === shapeId) {
                    // Check if the shape is a line
                    if ('startLine' in node.type && 'endLine' in node.type) {
                        return { shape: node.type, defined: node.defined };
                    }

                    throw new Error(`Shape with ID ${shapeId} is not a line.`);
                }
            }

            throw new Error(`Shape with ID ${shapeId} not found.`);
        }

        return this.visitChildren(ctx);
    }

    visitDirExpr = (ctx: DirExprContext): unknown => {
        if (ctx.pointExpr() !== undefined) {
            let point = this.visit(ctx.pointExpr()!) as { shape: geometry.Point, defined: boolean };
            return {
                shape: point.shape,
                defined: point.defined
            };
        }

        if (ctx.vectorExpr() !== undefined) {
            let vector = this.visit(ctx.vectorExpr()!) as { shape: geometry.Vector, defined: boolean };
            return {
                shape: vector.shape,
                defined: vector.defined
            }
        }

        return {
            x: this.visit(ctx.numberExpr(0)) as number,
            y: this.visit(ctx.numberExpr(1)) as number,
            z: this.visit(ctx.numberExpr(2)) as number
        }
    }

    visitShapeExpr = (ctx: ShapeExprContext): unknown => {
        return this.visitChildren(ctx);
    }

    visitSegmentDef = (ctx: SegmentDefContext): unknown => {
        let point1 = this.visit(ctx.pointExpr(0)) as { shape:  geometry.Point, defined: boolean };
        if (ctx.pointExpr().length === 2) {
            let point2 = this.visit(ctx.pointExpr(1)) as { shape:  geometry.Point, defined: boolean };
            return {
                shape: factory.createSegment(
                    createLineDefaultShapeProps(''),
                    point1.shape,
                    point2.shape
                ),
                defined: point1.defined && point2.defined
            }
        }

        let length = this.visit(ctx.numberExpr()!) as number;
        if (length <= 0) {
            throw new Error("Segment length must be positive.");
        }

        return {
            shape: factory.createSegment(
                createLineDefaultShapeProps(''),
                point1.shape,
                factory.createPoint(
                    createPointDefaultShapeProps(''),
                    point1.shape.x + length,
                    point1.shape.y,
                    point1.shape.z
                )
            ),
            defined: point1.defined
        }
    }

    visitRayDef = (ctx: RayDefContext): unknown => {
        let point1 = this.visit(ctx.pointExpr(0)) as { shape:  geometry.Point, defined: boolean };
        if (ctx.pointExpr().length === 2) {
            let point2 = this.visit(ctx.pointExpr(1)) as { shape:  geometry.Point, defined: boolean };
            return {
                shape: factory.createRay(
                    createLineDefaultShapeProps(''),
                    point1.shape,
                    point2.shape
                ),
                defined: point1.defined && point2.defined
            }
        }

        let vectorExpr = this.visit(ctx.vectorExpr()!) as { shape: geometry.Vector, defined: boolean };
        return {
            shape: factory.createRay(
                createLineDefaultShapeProps(''),
                point1.shape,
                factory.createPoint(
                    createLineDefaultShapeProps(''),
                    point1.shape.x + (vectorExpr.shape.endVector.x - vectorExpr.shape.startVector.x),
                    point1.shape.y + (vectorExpr.shape.endVector.y - vectorExpr.shape.startVector.y),
                    (point1.shape.z ?? 0) + ((vectorExpr.shape.endVector.z ?? 0) - (vectorExpr.shape.startVector.z ?? 0))
                )
            ),
            defined: point1.defined && vectorExpr.defined
        }
    }

    visitVectorExpr = (ctx: VectorExprContext): unknown => {
        if (ctx.SHAPE_ID() !== undefined) {
            let label = ctx.SHAPE_ID()!.text;
            let keys = Array.from(this.DAG.keys());
            for (let key of keys) {
                const node = this.DAG.get(key);
                if (node && node.type.props.label === label) {
                    // Check if the shape is a vector
                    if ('startVector' in node.type && 'endVector' in node.type) {
                        return { shape: node.type, defined: node.defined };
                    }

                    throw new Error(`Shape with ID ${label} is not a vector.`);
                }
            }

            throw new Error(`Shape with ID ${label} not found.`);
        }
        
        return this.visitChildren(ctx);
    }

    visitDirectionExpr = (ctx: DirectionExprContext): unknown => {
        if (ctx.SHAPE_ID() !== undefined) {
            let label = ctx.SHAPE_ID()!.text;
            let keys = Array.from(this.DAG.keys());
            for (let key of keys) {
                const node = this.DAG.get(key);
                if (node && node.type.props.label === label) {
                    // Check if the shape is a line, vector, ray, segment or plane
                    if (('startVector' in node.type && 'endVector' in node.type) ||
                        ('startSegment' in node.type && 'endSegment' in node.type) ||
                        ('startLine' in node.type && 'endLine' in node.type) ||
                        ('startRay' in node.type && 'endRay' in node.type) ||
                        ('norm' in node.type && 'point' in node.type)
                    ) {
                        return ('startVector' in node.type ? { shape: node.type, defined: node.defined } : (
                            'startSegment' in node.type ? {
                                shape: factory.createVector(
                                    createVectorDefaultShapeProps(''),
                                    node.type.startSegment,
                                    node.type.endSegment
                                ),
                                defined: node.defined
                            } : (
                                'startLine' in node.type ? {
                                    shape: factory.createVector(
                                        createVectorDefaultShapeProps(''),
                                        node.type.startLine,
                                        node.type.endLine
                                    ),
                                    defined: node.defined
                                } : (
                                    'startRay' in node.type ? {
                                        shape: factory.createVector(
                                            createVectorDefaultShapeProps(''),
                                            node.type.startRay,
                                            node.type.endRay
                                        ),
                                        defined: node.defined
                                    } : { shape: node.type.norm, defined: node.defined }
                                )
                            )
                        ))
                    }

                    throw new Error(`Shape with ID ${label} cannot represent a direction.`);
                }
            }

            throw new Error(`Shape with ID ${label} not found.`);
        }

        const shape = this.visitChildren(ctx);
        if (typeof shape === 'object' && shape !== null && 
            ('shape' in shape && typeof shape.shape === 'object' && shape.shape !== null) &&
            ('defined' in shape && typeof shape.defined === 'boolean')
        ) {
            if ('startVector' in shape.shape) return { shape: shape.shape as geometry.Vector, defined: true };
            if ('startLine' in shape.shape && 'endLine' in shape.shape) {
                return {
                    shape: factory.createVector(
                        createVectorDefaultShapeProps(''),
                        shape.shape.startLine as geometry.Point,
                        shape.shape.endLine as geometry.Point
                    ),
                    defined: shape.defined as boolean
                }
            }

            if ('startSegment' in shape.shape && 'endSegment' in shape.shape) {
                return {
                    shape: factory.createVector(
                        createVectorDefaultShapeProps(''),
                        shape.shape.startSegment as geometry.Point,
                        shape.shape.endSegment as geometry.Point
                    ),
                    defined: shape.defined as boolean
                }
            }

            if ('startRay' in shape.shape && 'endRay' in shape.shape) {
                return {
                    shape: factory.createVector(
                        createVectorDefaultShapeProps(''),
                        shape.shape.startRay as geometry.Point,
                        shape.shape.endRay as geometry.Point
                    ),
                    defined: shape.defined as boolean
                }
            }

            if ('norm' in shape.shape) return shape.shape.norm as geometry.Vector;
        }

        throw new Error('Cannot determine direction from shape');
    }

    visitPlaneExpr = (ctx: PlaneExprContext): unknown => {
        if (ctx.SHAPE_ID() !== undefined) {
            let label = ctx.SHAPE_ID()!.text;
            let keys = Array.from(this.DAG.keys());
            for (let key of keys) {
                const node = this.DAG.get(key);
                if (node && node.type.props.label === label) {
                    // Check if the shape is a line, vector, ray, segment or plane
                    if (
                        ('norm' in node.type && 'point' in node.type)
                    ) {
                        return { shape: node.type, defined: node.defined };
                    }

                    throw new Error(`Shape with ID ${label} is not a plane.`);
                }
            }

            throw new Error(`Shape with ID ${label} not found.`);
        }

        return this.visitChildren(ctx);
    }

    visitSegmentExpr = (ctx: SegmentExprContext): unknown => {
        if (ctx.SHAPE_ID() !== undefined) {
            let shapeId = ctx.SHAPE_ID()!.text;
            let keys = Array.from(this.DAG.keys());
            for (let key of keys) {
                const node = this.DAG.get(key);
                if (node && node.type.props.label === shapeId) {
                    // Check if the shape is a line
                    if ('startSegment' in node.type && 'endSegment' in node.type) {
                        return { shape: node.type, defined: node.defined };
                    }

                    throw new Error(`Shape with ID ${shapeId} is not a segment.`);
                }
            }

            throw new Error(`Shape with ID ${shapeId} not found.`);
        }

        return this.visitChildren(ctx);
    }

    visitRayExpr = (ctx: RayExprContext): unknown => {
        if (ctx.SHAPE_ID() !== undefined) {
            let shapeId = ctx.SHAPE_ID()!.text;
            let keys = Array.from(this.DAG.keys());
            for (let key of keys) {
                const node = this.DAG.get(key);
                if (node && node.type.props.label === shapeId) {
                    // Check if the shape is a line
                    if ('startRay' in node.type && 'endRay' in node.type) {
                        return { shape: node.type, defined: node.defined };
                    }

                    throw new Error(`Shape with ID ${shapeId} is not a ray.`);
                }
            }

            throw new Error(`Shape with ID ${shapeId} not found.`);
        }

        return this.visitChildren(ctx);
    }

    visitConeDef = (ctx: ConeDefContext): unknown => {
        let center = this.visit(ctx.pointExpr(0)) as { shape:  geometry.Point, defined: boolean };
        let apex = this.visit(ctx.pointExpr(1)) as { shape:  geometry.Point, defined: boolean };
        if (!center.defined || !apex.defined) {

        }
        let radius = this.visit(ctx.numberExpr()!) as number;
        if (radius <= 0) {
            throw new Error(`Radius can not be negative or 0`);
        }

        return {
            shape: factory.createCone(
                createCylinderDefaultShapeProps('', radius),
                center.shape,
                apex.shape, radius
            ),
            defined: true
        };
    }

    visitConeExpr = (ctx: ConeExprContext): unknown => {
        if (ctx.SHAPE_ID() !== undefined) {
            let shapeId = ctx.SHAPE_ID()!.text;
            let keys = Array.from(this.DAG.keys());
            for (let key of keys) {
                const node = this.DAG.get(key);
                if (node && node.type.props.label === shapeId) {
                    // Check if the shape is a line
                    if ('cone' in node.type && 'apex' in node.type && 'radius' in node.type) {
                        return { shape: node.type, defined: node.defined };
                    }

                    throw new Error(`Shape with ID ${shapeId} is not a cone.`);
                }
            }

            throw new Error(`Shape with ID ${shapeId} not found.`);
        }

        return this.visitChildren(ctx);
    }

    visitCylinderDef = (ctx: CylinderDefContext): unknown => {
        let center1 = this.visit(ctx.pointExpr(0)) as { shape:  geometry.Point, defined: boolean };
        let center2 = this.visit(ctx.pointExpr(1)) as { shape:  geometry.Point, defined: boolean };
        let radius = this.visit(ctx.numberExpr()!) as number;
        if (radius <= 0) {
            throw new Error(`Radius can not be negative or 0`);
        }

        return {
            shape: factory.createCylinder(
                createCylinderDefaultShapeProps('', radius),
                center1.shape,
                center2.shape, radius
            ),
            defined: center1.defined && center2.defined
        }
    }

    visitCylinderExpr = (ctx: CylinderExprContext): unknown => {
        if (ctx.SHAPE_ID() !== undefined) {
            let shapeId = ctx.SHAPE_ID()!.text;
            let keys = Array.from(this.DAG.keys());
            for (let key of keys) {
                const node = this.DAG.get(key);
                if (node && node.type.props.label === shapeId) {
                    if ('centerBase1' in node.type && 'centerBase2' in node.type && 'radius' in node.type) {
                        return { shape: node.type, defined: node.defined };
                    }

                    throw new Error(`Shape with ID ${shapeId} is not a cylinder.`);
                }
            }

            throw new Error(`Shape with ID ${shapeId} not found.`);
        }

        return this.visitChildren(ctx);
    }

    visitIntersectionDef = (ctx: IntersectionDefContext): unknown => {
        let shape1 = this.visit(ctx.expr(0)) as { shape: geometry.Shape, defined: boolean };
        let shape2 = this.visit(ctx.expr(1)) as { shape: geometry.Shape, defined: boolean };
        if (!shape1.defined || !shape2.defined) {
            return {
                shape: factory.createPoint(
                    createPointDefaultShapeProps(''),
                    0, 0, 0
                ),
                defined: false
            }
        }

        try {
            const intersections = operations.getIntersections3D(shape1.shape, shape2.shape);
            if (intersections.length === 0) {
                throw new Error('This command is still in beta, we will update in the future');
            }

            const intersection = intersections[0];
            return {
                shape: factory.createPoint(
                    createPointDefaultShapeProps(''),
                    intersection.coors?.x ?? 0, 
                    intersection.coors?.y ?? 0, 
                    intersection.coors?.z ?? 0, 
                ),
                defined: !intersection.ambiguous
            }
        }

        catch(error) {
            throw new Error(`${(error as Error).message}`);
        }
    }

    visitPrismDef = (ctx: PrismDefContext): unknown => {
        let polygon = this.visit(ctx.polygonExpr()!) as { shape: geometry.Polygon, defined: boolean };
        let direction = this.visit(ctx.directionExpr()!) as { shape: geometry.Vector, defined: boolean };

        return {
            shape: factory.createPrism(
                createCylinderDefaultShapeProps('', 0),
                polygon.shape,
                operations.translation(polygon.shape, direction.shape) as geometry.Polygon,
            ),
            defined: polygon.defined && direction.defined
        }
    }

    visitPrismExpr = (ctx: PrismExprContext): unknown => {
        if (ctx.SHAPE_ID() !== undefined) {
            let shapeId = ctx.SHAPE_ID()!.text;
            let keys = Array.from(this.DAG.keys());
            for (let key of keys) {
                const node = this.DAG.get(key);
                if (node && node.type.props.label === shapeId) {
                    if ('base1' in node.type && 'base2' in node.type) {
                        return { shape: node.type, defined: node.defined };
                    }

                    throw new Error(`Shape with ID ${shapeId} is not a prism.`);
                }
            }

            throw new Error(`Shape with ID ${shapeId} not found.`);
        }

        return this.visitChildren(ctx);
    }

    visitTetrahedronDef = (ctx: TetrahedronDefContext): unknown => {
        if (ctx.pointExpr().length === 4) {
            let [p1, p2, p3, apex] = [
                this.visit(ctx.pointExpr(0)) as { shape: geometry.Point, defined: boolean },
                this.visit(ctx.pointExpr(1)) as { shape: geometry.Point, defined: boolean },
                this.visit(ctx.pointExpr(2)) as { shape: geometry.Point, defined: boolean },
                this.visit(ctx.pointExpr(3)) as { shape: geometry.Point, defined: boolean }
            ];

            if (operations.checkCoplanar([p1.shape, p2.shape, p3.shape, apex.shape])) {
                throw new Error('Cannot form a tetrahedron with 4 coplanar points');
            }

            const checkCollinear = (a: geometry.Point, b: geometry.Point, c: geometry.Point): boolean => {
                // If any two points coincide, treat as collinear
                const ab = {
                    x: b.x - a.x,
                    y: b.y - a.x,
                    z: (b.z ?? 0) - (a.z ?? 0)
                };
                
                const ac = {
                    x: c.x - a.x,
                    y: c.y - a.x,
                    z: (c.z ?? 0) - (a.z ?? 0)
                };

                const normSq = (v: {x: number, y: number, z: number}): number => {
                    return v.x ** 2 + v.y ** 2 + v.z ** 2;
                }

                if (normSq(ab) === 0 && normSq(ac) === 0) return true; // all three same
                if (normSq(ab) === 0) return true; // a == b, so a, b, c collinear
                if (normSq(ac) === 0) return true; // a == c

                const cr = operations.cross(ab.x, ab.y, ab.z, ac.x, ac.y, ac.z);
                return normSq(cr) === 0; // cross nearly zero vector
            }

            if (checkCollinear(p1.shape, p2.shape, p3.shape) || checkCollinear(p1.shape, p2.shape, apex.shape) ||
                checkCollinear(p1.shape, p3.shape, apex.shape) || checkCollinear(p2.shape, p3.shape, apex.shape)
            ) {
                throw new Error('Cannot form a tetrahedron with 3 collinear points');
            }

            return {
                shape: factory.createPyramid(
                    createCylinderDefaultShapeProps('', 0),
                    factory.createPolygon(
                        createPolygonDefaultShapeProps(''),
                        [p1.shape, p2.shape, p3.shape]
                    ), apex.shape
                ),
                defined: p1.defined && p2.defined && p3.defined && apex.defined
            }
        }

        let polygon = this.visit(ctx.polygonExpr()!) as { shape: geometry.Polygon, defined: boolean }
        let apex = this.visit(ctx.pointExpr(0)) as { shape: geometry.Point, defined: boolean }
        if (polygon.shape.points.length !== 3) {
            throw new Error('Use the Pyramid command instead');
        }

        if (operations.checkCoplanar([...polygon.shape.points.map(p => p), apex.shape])) {
            throw new Error('Cannot form a tetrahedron with 4 coplanar points');
        }

        return {
            shape: factory.createPyramid(
                createCylinderDefaultShapeProps('', 0),
                polygon.shape, apex.shape
            ),
            defined: polygon.defined && apex.defined
        }
    }
    
    visitTetrahedronExpr = (ctx: TetrahedronExprContext): unknown => {
        if (ctx.SHAPE_ID() !== undefined) {
            let shapeId = ctx.SHAPE_ID()!.text;
            let keys = Array.from(this.DAG.keys());
            for (let key of keys) {
                const node = this.DAG.get(key);
                if (node && node.type.props.label === shapeId) {
                    if ('apex' in node.type && 'base' in node.type) {
                        const base = node.type.base as geometry.Polygon;
                        if (base.points.length === 3) return { shape: node.type, defined: node.defined };
                    }

                    throw new Error(`Shape with ID ${shapeId} is not a tetrahedron.`);
                }
            }

            throw new Error(`Shape with ID ${shapeId} not found.`);
        }

        return this.visitChildren(ctx);
    }

    visitPyramidDef = (ctx: PyramidDefContext): unknown => {
        let polygon = this.visit(ctx.polygonExpr()!) as { shape: geometry.Polygon, defined: boolean };
        let point = this.visit(ctx.pointExpr()!) as { shape: geometry.Point, defined: boolean };

        return {
            shape: factory.createPyramid(
                createCylinderDefaultShapeProps('', 0),
                polygon.shape,
                point.shape,
            ),
            defined: polygon.defined && point.defined
        }
    }

    visitPyramidExpr =  (ctx: PyramidExprContext): unknown => {
        if (ctx.SHAPE_ID() !== undefined) {
            let shapeId = ctx.SHAPE_ID()!.text;
            let keys = Array.from(this.DAG.keys());
            for (let key of keys) {
                const node = this.DAG.get(key);
                if (node && node.type.props.label === shapeId) {
                    if ('apex' in node.type && 'base' in node.type) {
                        return { shape: node.type, defined: node.defined };
                    }

                    throw new Error(`Shape with ID ${shapeId} is not a tetrahedron.`);
                }
            }

            throw new Error(`Shape with ID ${shapeId} not found.`);
        }

        return this.visitChildren(ctx);
    }

    visitTransformDef = (ctx: TransformDefContext): unknown => {
        if (ctx.TRANSLATE()) {
            let shape = this.visit(ctx.shapeExpr()!) as { shape: geometry.Shape, defined: boolean };
            let vectorExpr = this.visit(ctx.vectorExpr()!) as { shape: geometry.Vector, defined: boolean };
            const translatedShape = operations.translation(shape.shape, vectorExpr.shape);
        }

        return;
    }
}

export default ASTGen;