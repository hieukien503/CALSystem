// Generated from src/antlr4/parser/MathCommand.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";

import { ProgramContext } from "./MathCommandParser";
import { ExprContext } from "./MathCommandParser";
import { PointDefContext } from "./MathCommandParser";
import { SphereDefContext } from "./MathCommandParser";
import { PlaneDefContext } from "./MathCommandParser";
import { LineDefContext } from "./MathCommandParser";
import { AngleDefContext } from "./MathCommandParser";
import { VectorDefContext } from "./MathCommandParser";
import { PolygonDefContext } from "./MathCommandParser";
import { PointListContext } from "./MathCommandParser";
import { CircleDefContext } from "./MathCommandParser";
import { SegmentDefContext } from "./MathCommandParser";
import { RayDefContext } from "./MathCommandParser";
import { IntersectionDefContext } from "./MathCommandParser";
import { TransformDefContext } from "./MathCommandParser";
import { CylinderDefContext } from "./MathCommandParser";
import { TetrahedronDefContext } from "./MathCommandParser";
import { ConeDefContext } from "./MathCommandParser";
import { PrismDefContext } from "./MathCommandParser";
import { PyramidDefContext } from "./MathCommandParser";
import { NumberExprContext } from "./MathCommandParser";
import { AdditiveExprContext } from "./MathCommandParser";
import { MultiplicativeExprContext } from "./MathCommandParser";
import { ImplicitMultiplicativeExprContext } from "./MathCommandParser";
import { ExponentialExprContext } from "./MathCommandParser";
import { UnaryExprContext } from "./MathCommandParser";
import { PrimaryExprContext } from "./MathCommandParser";
import { SinExprContext } from "./MathCommandParser";
import { CosExprContext } from "./MathCommandParser";
import { TanExprContext } from "./MathCommandParser";
import { CotExprContext } from "./MathCommandParser";
import { LogExprContext } from "./MathCommandParser";
import { LnExprContext } from "./MathCommandParser";
import { CbrtExprContext } from "./MathCommandParser";
import { SqrtExprContext } from "./MathCommandParser";
import { AbsExprContext } from "./MathCommandParser";
import { ExpExprContext } from "./MathCommandParser";
import { PointExprContext } from "./MathCommandParser";
import { LineExprContext } from "./MathCommandParser";
import { DirExprContext } from "./MathCommandParser";
import { VectorExprContext } from "./MathCommandParser";
import { PlaneExprContext } from "./MathCommandParser";
import { DirectionExprContext } from "./MathCommandParser";
import { PolygonExprContext } from "./MathCommandParser";
import { TetrahedronExprContext } from "./MathCommandParser";
import { CylinderExprContext } from "./MathCommandParser";
import { ConeExprContext } from "./MathCommandParser";
import { PrismExprContext } from "./MathCommandParser";
import { SegmentExprContext } from "./MathCommandParser";
import { RayExprContext } from "./MathCommandParser";
import { PyramidExprContext } from "./MathCommandParser";
import { ShapeExprContext } from "./MathCommandParser";


/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by `MathCommandParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export interface MathCommandVisitor<Result> extends ParseTreeVisitor<Result> {
	/**
	 * Visit a parse tree produced by `MathCommandParser.program`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitProgram?: (ctx: ProgramContext) => Result;

	/**
	 * Visit a parse tree produced by `MathCommandParser.expr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExpr?: (ctx: ExprContext) => Result;

	/**
	 * Visit a parse tree produced by `MathCommandParser.pointDef`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPointDef?: (ctx: PointDefContext) => Result;

	/**
	 * Visit a parse tree produced by `MathCommandParser.sphereDef`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSphereDef?: (ctx: SphereDefContext) => Result;

	/**
	 * Visit a parse tree produced by `MathCommandParser.planeDef`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPlaneDef?: (ctx: PlaneDefContext) => Result;

	/**
	 * Visit a parse tree produced by `MathCommandParser.lineDef`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLineDef?: (ctx: LineDefContext) => Result;

	/**
	 * Visit a parse tree produced by `MathCommandParser.angleDef`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAngleDef?: (ctx: AngleDefContext) => Result;

	/**
	 * Visit a parse tree produced by `MathCommandParser.vectorDef`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVectorDef?: (ctx: VectorDefContext) => Result;

	/**
	 * Visit a parse tree produced by `MathCommandParser.polygonDef`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPolygonDef?: (ctx: PolygonDefContext) => Result;

	/**
	 * Visit a parse tree produced by `MathCommandParser.pointList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPointList?: (ctx: PointListContext) => Result;

	/**
	 * Visit a parse tree produced by `MathCommandParser.circleDef`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCircleDef?: (ctx: CircleDefContext) => Result;

	/**
	 * Visit a parse tree produced by `MathCommandParser.segmentDef`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSegmentDef?: (ctx: SegmentDefContext) => Result;

	/**
	 * Visit a parse tree produced by `MathCommandParser.rayDef`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRayDef?: (ctx: RayDefContext) => Result;

	/**
	 * Visit a parse tree produced by `MathCommandParser.intersectionDef`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIntersectionDef?: (ctx: IntersectionDefContext) => Result;

	/**
	 * Visit a parse tree produced by `MathCommandParser.transformDef`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTransformDef?: (ctx: TransformDefContext) => Result;

	/**
	 * Visit a parse tree produced by `MathCommandParser.cylinderDef`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCylinderDef?: (ctx: CylinderDefContext) => Result;

	/**
	 * Visit a parse tree produced by `MathCommandParser.tetrahedronDef`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTetrahedronDef?: (ctx: TetrahedronDefContext) => Result;

	/**
	 * Visit a parse tree produced by `MathCommandParser.coneDef`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitConeDef?: (ctx: ConeDefContext) => Result;

	/**
	 * Visit a parse tree produced by `MathCommandParser.prismDef`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPrismDef?: (ctx: PrismDefContext) => Result;

	/**
	 * Visit a parse tree produced by `MathCommandParser.pyramidDef`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPyramidDef?: (ctx: PyramidDefContext) => Result;

	/**
	 * Visit a parse tree produced by `MathCommandParser.numberExpr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNumberExpr?: (ctx: NumberExprContext) => Result;

	/**
	 * Visit a parse tree produced by `MathCommandParser.additiveExpr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAdditiveExpr?: (ctx: AdditiveExprContext) => Result;

	/**
	 * Visit a parse tree produced by `MathCommandParser.multiplicativeExpr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMultiplicativeExpr?: (ctx: MultiplicativeExprContext) => Result;

	/**
	 * Visit a parse tree produced by `MathCommandParser.implicitMultiplicativeExpr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitImplicitMultiplicativeExpr?: (ctx: ImplicitMultiplicativeExprContext) => Result;

	/**
	 * Visit a parse tree produced by `MathCommandParser.exponentialExpr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExponentialExpr?: (ctx: ExponentialExprContext) => Result;

	/**
	 * Visit a parse tree produced by `MathCommandParser.unaryExpr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitUnaryExpr?: (ctx: UnaryExprContext) => Result;

	/**
	 * Visit a parse tree produced by `MathCommandParser.primaryExpr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPrimaryExpr?: (ctx: PrimaryExprContext) => Result;

	/**
	 * Visit a parse tree produced by `MathCommandParser.sinExpr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSinExpr?: (ctx: SinExprContext) => Result;

	/**
	 * Visit a parse tree produced by `MathCommandParser.cosExpr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCosExpr?: (ctx: CosExprContext) => Result;

	/**
	 * Visit a parse tree produced by `MathCommandParser.tanExpr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTanExpr?: (ctx: TanExprContext) => Result;

	/**
	 * Visit a parse tree produced by `MathCommandParser.cotExpr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCotExpr?: (ctx: CotExprContext) => Result;

	/**
	 * Visit a parse tree produced by `MathCommandParser.logExpr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLogExpr?: (ctx: LogExprContext) => Result;

	/**
	 * Visit a parse tree produced by `MathCommandParser.lnExpr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLnExpr?: (ctx: LnExprContext) => Result;

	/**
	 * Visit a parse tree produced by `MathCommandParser.cbrtExpr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCbrtExpr?: (ctx: CbrtExprContext) => Result;

	/**
	 * Visit a parse tree produced by `MathCommandParser.sqrtExpr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSqrtExpr?: (ctx: SqrtExprContext) => Result;

	/**
	 * Visit a parse tree produced by `MathCommandParser.absExpr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAbsExpr?: (ctx: AbsExprContext) => Result;

	/**
	 * Visit a parse tree produced by `MathCommandParser.expExpr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExpExpr?: (ctx: ExpExprContext) => Result;

	/**
	 * Visit a parse tree produced by `MathCommandParser.pointExpr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPointExpr?: (ctx: PointExprContext) => Result;

	/**
	 * Visit a parse tree produced by `MathCommandParser.lineExpr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLineExpr?: (ctx: LineExprContext) => Result;

	/**
	 * Visit a parse tree produced by `MathCommandParser.dirExpr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDirExpr?: (ctx: DirExprContext) => Result;

	/**
	 * Visit a parse tree produced by `MathCommandParser.vectorExpr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVectorExpr?: (ctx: VectorExprContext) => Result;

	/**
	 * Visit a parse tree produced by `MathCommandParser.planeExpr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPlaneExpr?: (ctx: PlaneExprContext) => Result;

	/**
	 * Visit a parse tree produced by `MathCommandParser.directionExpr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDirectionExpr?: (ctx: DirectionExprContext) => Result;

	/**
	 * Visit a parse tree produced by `MathCommandParser.polygonExpr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPolygonExpr?: (ctx: PolygonExprContext) => Result;

	/**
	 * Visit a parse tree produced by `MathCommandParser.tetrahedronExpr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTetrahedronExpr?: (ctx: TetrahedronExprContext) => Result;

	/**
	 * Visit a parse tree produced by `MathCommandParser.cylinderExpr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCylinderExpr?: (ctx: CylinderExprContext) => Result;

	/**
	 * Visit a parse tree produced by `MathCommandParser.coneExpr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitConeExpr?: (ctx: ConeExprContext) => Result;

	/**
	 * Visit a parse tree produced by `MathCommandParser.prismExpr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPrismExpr?: (ctx: PrismExprContext) => Result;

	/**
	 * Visit a parse tree produced by `MathCommandParser.segmentExpr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSegmentExpr?: (ctx: SegmentExprContext) => Result;

	/**
	 * Visit a parse tree produced by `MathCommandParser.rayExpr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRayExpr?: (ctx: RayExprContext) => Result;

	/**
	 * Visit a parse tree produced by `MathCommandParser.pyramidExpr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPyramidExpr?: (ctx: PyramidExprContext) => Result;

	/**
	 * Visit a parse tree produced by `MathCommandParser.shapeExpr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitShapeExpr?: (ctx: ShapeExprContext) => Result;
}

