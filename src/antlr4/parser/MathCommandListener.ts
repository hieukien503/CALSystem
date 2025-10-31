// Generated from src/antlr4/parser/MathCommand.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";

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
import { NrootExprContext } from "./MathCommandParser";
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
 * This interface defines a complete listener for a parse tree produced by
 * `MathCommandParser`.
 */
export interface MathCommandListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by `MathCommandParser.program`.
	 * @param ctx the parse tree
	 */
	enterProgram?: (ctx: ProgramContext) => void;
	/**
	 * Exit a parse tree produced by `MathCommandParser.program`.
	 * @param ctx the parse tree
	 */
	exitProgram?: (ctx: ProgramContext) => void;

	/**
	 * Enter a parse tree produced by `MathCommandParser.expr`.
	 * @param ctx the parse tree
	 */
	enterExpr?: (ctx: ExprContext) => void;
	/**
	 * Exit a parse tree produced by `MathCommandParser.expr`.
	 * @param ctx the parse tree
	 */
	exitExpr?: (ctx: ExprContext) => void;

	/**
	 * Enter a parse tree produced by `MathCommandParser.pointDef`.
	 * @param ctx the parse tree
	 */
	enterPointDef?: (ctx: PointDefContext) => void;
	/**
	 * Exit a parse tree produced by `MathCommandParser.pointDef`.
	 * @param ctx the parse tree
	 */
	exitPointDef?: (ctx: PointDefContext) => void;

	/**
	 * Enter a parse tree produced by `MathCommandParser.sphereDef`.
	 * @param ctx the parse tree
	 */
	enterSphereDef?: (ctx: SphereDefContext) => void;
	/**
	 * Exit a parse tree produced by `MathCommandParser.sphereDef`.
	 * @param ctx the parse tree
	 */
	exitSphereDef?: (ctx: SphereDefContext) => void;

	/**
	 * Enter a parse tree produced by `MathCommandParser.planeDef`.
	 * @param ctx the parse tree
	 */
	enterPlaneDef?: (ctx: PlaneDefContext) => void;
	/**
	 * Exit a parse tree produced by `MathCommandParser.planeDef`.
	 * @param ctx the parse tree
	 */
	exitPlaneDef?: (ctx: PlaneDefContext) => void;

	/**
	 * Enter a parse tree produced by `MathCommandParser.lineDef`.
	 * @param ctx the parse tree
	 */
	enterLineDef?: (ctx: LineDefContext) => void;
	/**
	 * Exit a parse tree produced by `MathCommandParser.lineDef`.
	 * @param ctx the parse tree
	 */
	exitLineDef?: (ctx: LineDefContext) => void;

	/**
	 * Enter a parse tree produced by `MathCommandParser.angleDef`.
	 * @param ctx the parse tree
	 */
	enterAngleDef?: (ctx: AngleDefContext) => void;
	/**
	 * Exit a parse tree produced by `MathCommandParser.angleDef`.
	 * @param ctx the parse tree
	 */
	exitAngleDef?: (ctx: AngleDefContext) => void;

	/**
	 * Enter a parse tree produced by `MathCommandParser.vectorDef`.
	 * @param ctx the parse tree
	 */
	enterVectorDef?: (ctx: VectorDefContext) => void;
	/**
	 * Exit a parse tree produced by `MathCommandParser.vectorDef`.
	 * @param ctx the parse tree
	 */
	exitVectorDef?: (ctx: VectorDefContext) => void;

	/**
	 * Enter a parse tree produced by `MathCommandParser.polygonDef`.
	 * @param ctx the parse tree
	 */
	enterPolygonDef?: (ctx: PolygonDefContext) => void;
	/**
	 * Exit a parse tree produced by `MathCommandParser.polygonDef`.
	 * @param ctx the parse tree
	 */
	exitPolygonDef?: (ctx: PolygonDefContext) => void;

	/**
	 * Enter a parse tree produced by `MathCommandParser.pointList`.
	 * @param ctx the parse tree
	 */
	enterPointList?: (ctx: PointListContext) => void;
	/**
	 * Exit a parse tree produced by `MathCommandParser.pointList`.
	 * @param ctx the parse tree
	 */
	exitPointList?: (ctx: PointListContext) => void;

	/**
	 * Enter a parse tree produced by `MathCommandParser.circleDef`.
	 * @param ctx the parse tree
	 */
	enterCircleDef?: (ctx: CircleDefContext) => void;
	/**
	 * Exit a parse tree produced by `MathCommandParser.circleDef`.
	 * @param ctx the parse tree
	 */
	exitCircleDef?: (ctx: CircleDefContext) => void;

	/**
	 * Enter a parse tree produced by `MathCommandParser.segmentDef`.
	 * @param ctx the parse tree
	 */
	enterSegmentDef?: (ctx: SegmentDefContext) => void;
	/**
	 * Exit a parse tree produced by `MathCommandParser.segmentDef`.
	 * @param ctx the parse tree
	 */
	exitSegmentDef?: (ctx: SegmentDefContext) => void;

	/**
	 * Enter a parse tree produced by `MathCommandParser.rayDef`.
	 * @param ctx the parse tree
	 */
	enterRayDef?: (ctx: RayDefContext) => void;
	/**
	 * Exit a parse tree produced by `MathCommandParser.rayDef`.
	 * @param ctx the parse tree
	 */
	exitRayDef?: (ctx: RayDefContext) => void;

	/**
	 * Enter a parse tree produced by `MathCommandParser.intersectionDef`.
	 * @param ctx the parse tree
	 */
	enterIntersectionDef?: (ctx: IntersectionDefContext) => void;
	/**
	 * Exit a parse tree produced by `MathCommandParser.intersectionDef`.
	 * @param ctx the parse tree
	 */
	exitIntersectionDef?: (ctx: IntersectionDefContext) => void;

	/**
	 * Enter a parse tree produced by `MathCommandParser.transformDef`.
	 * @param ctx the parse tree
	 */
	enterTransformDef?: (ctx: TransformDefContext) => void;
	/**
	 * Exit a parse tree produced by `MathCommandParser.transformDef`.
	 * @param ctx the parse tree
	 */
	exitTransformDef?: (ctx: TransformDefContext) => void;

	/**
	 * Enter a parse tree produced by `MathCommandParser.cylinderDef`.
	 * @param ctx the parse tree
	 */
	enterCylinderDef?: (ctx: CylinderDefContext) => void;
	/**
	 * Exit a parse tree produced by `MathCommandParser.cylinderDef`.
	 * @param ctx the parse tree
	 */
	exitCylinderDef?: (ctx: CylinderDefContext) => void;

	/**
	 * Enter a parse tree produced by `MathCommandParser.tetrahedronDef`.
	 * @param ctx the parse tree
	 */
	enterTetrahedronDef?: (ctx: TetrahedronDefContext) => void;
	/**
	 * Exit a parse tree produced by `MathCommandParser.tetrahedronDef`.
	 * @param ctx the parse tree
	 */
	exitTetrahedronDef?: (ctx: TetrahedronDefContext) => void;

	/**
	 * Enter a parse tree produced by `MathCommandParser.coneDef`.
	 * @param ctx the parse tree
	 */
	enterConeDef?: (ctx: ConeDefContext) => void;
	/**
	 * Exit a parse tree produced by `MathCommandParser.coneDef`.
	 * @param ctx the parse tree
	 */
	exitConeDef?: (ctx: ConeDefContext) => void;

	/**
	 * Enter a parse tree produced by `MathCommandParser.prismDef`.
	 * @param ctx the parse tree
	 */
	enterPrismDef?: (ctx: PrismDefContext) => void;
	/**
	 * Exit a parse tree produced by `MathCommandParser.prismDef`.
	 * @param ctx the parse tree
	 */
	exitPrismDef?: (ctx: PrismDefContext) => void;

	/**
	 * Enter a parse tree produced by `MathCommandParser.pyramidDef`.
	 * @param ctx the parse tree
	 */
	enterPyramidDef?: (ctx: PyramidDefContext) => void;
	/**
	 * Exit a parse tree produced by `MathCommandParser.pyramidDef`.
	 * @param ctx the parse tree
	 */
	exitPyramidDef?: (ctx: PyramidDefContext) => void;

	/**
	 * Enter a parse tree produced by `MathCommandParser.numberExpr`.
	 * @param ctx the parse tree
	 */
	enterNumberExpr?: (ctx: NumberExprContext) => void;
	/**
	 * Exit a parse tree produced by `MathCommandParser.numberExpr`.
	 * @param ctx the parse tree
	 */
	exitNumberExpr?: (ctx: NumberExprContext) => void;

	/**
	 * Enter a parse tree produced by `MathCommandParser.additiveExpr`.
	 * @param ctx the parse tree
	 */
	enterAdditiveExpr?: (ctx: AdditiveExprContext) => void;
	/**
	 * Exit a parse tree produced by `MathCommandParser.additiveExpr`.
	 * @param ctx the parse tree
	 */
	exitAdditiveExpr?: (ctx: AdditiveExprContext) => void;

	/**
	 * Enter a parse tree produced by `MathCommandParser.multiplicativeExpr`.
	 * @param ctx the parse tree
	 */
	enterMultiplicativeExpr?: (ctx: MultiplicativeExprContext) => void;
	/**
	 * Exit a parse tree produced by `MathCommandParser.multiplicativeExpr`.
	 * @param ctx the parse tree
	 */
	exitMultiplicativeExpr?: (ctx: MultiplicativeExprContext) => void;

	/**
	 * Enter a parse tree produced by `MathCommandParser.implicitMultiplicativeExpr`.
	 * @param ctx the parse tree
	 */
	enterImplicitMultiplicativeExpr?: (ctx: ImplicitMultiplicativeExprContext) => void;
	/**
	 * Exit a parse tree produced by `MathCommandParser.implicitMultiplicativeExpr`.
	 * @param ctx the parse tree
	 */
	exitImplicitMultiplicativeExpr?: (ctx: ImplicitMultiplicativeExprContext) => void;

	/**
	 * Enter a parse tree produced by `MathCommandParser.exponentialExpr`.
	 * @param ctx the parse tree
	 */
	enterExponentialExpr?: (ctx: ExponentialExprContext) => void;
	/**
	 * Exit a parse tree produced by `MathCommandParser.exponentialExpr`.
	 * @param ctx the parse tree
	 */
	exitExponentialExpr?: (ctx: ExponentialExprContext) => void;

	/**
	 * Enter a parse tree produced by `MathCommandParser.unaryExpr`.
	 * @param ctx the parse tree
	 */
	enterUnaryExpr?: (ctx: UnaryExprContext) => void;
	/**
	 * Exit a parse tree produced by `MathCommandParser.unaryExpr`.
	 * @param ctx the parse tree
	 */
	exitUnaryExpr?: (ctx: UnaryExprContext) => void;

	/**
	 * Enter a parse tree produced by `MathCommandParser.primaryExpr`.
	 * @param ctx the parse tree
	 */
	enterPrimaryExpr?: (ctx: PrimaryExprContext) => void;
	/**
	 * Exit a parse tree produced by `MathCommandParser.primaryExpr`.
	 * @param ctx the parse tree
	 */
	exitPrimaryExpr?: (ctx: PrimaryExprContext) => void;

	/**
	 * Enter a parse tree produced by `MathCommandParser.sinExpr`.
	 * @param ctx the parse tree
	 */
	enterSinExpr?: (ctx: SinExprContext) => void;
	/**
	 * Exit a parse tree produced by `MathCommandParser.sinExpr`.
	 * @param ctx the parse tree
	 */
	exitSinExpr?: (ctx: SinExprContext) => void;

	/**
	 * Enter a parse tree produced by `MathCommandParser.cosExpr`.
	 * @param ctx the parse tree
	 */
	enterCosExpr?: (ctx: CosExprContext) => void;
	/**
	 * Exit a parse tree produced by `MathCommandParser.cosExpr`.
	 * @param ctx the parse tree
	 */
	exitCosExpr?: (ctx: CosExprContext) => void;

	/**
	 * Enter a parse tree produced by `MathCommandParser.tanExpr`.
	 * @param ctx the parse tree
	 */
	enterTanExpr?: (ctx: TanExprContext) => void;
	/**
	 * Exit a parse tree produced by `MathCommandParser.tanExpr`.
	 * @param ctx the parse tree
	 */
	exitTanExpr?: (ctx: TanExprContext) => void;

	/**
	 * Enter a parse tree produced by `MathCommandParser.cotExpr`.
	 * @param ctx the parse tree
	 */
	enterCotExpr?: (ctx: CotExprContext) => void;
	/**
	 * Exit a parse tree produced by `MathCommandParser.cotExpr`.
	 * @param ctx the parse tree
	 */
	exitCotExpr?: (ctx: CotExprContext) => void;

	/**
	 * Enter a parse tree produced by `MathCommandParser.logExpr`.
	 * @param ctx the parse tree
	 */
	enterLogExpr?: (ctx: LogExprContext) => void;
	/**
	 * Exit a parse tree produced by `MathCommandParser.logExpr`.
	 * @param ctx the parse tree
	 */
	exitLogExpr?: (ctx: LogExprContext) => void;

	/**
	 * Enter a parse tree produced by `MathCommandParser.lnExpr`.
	 * @param ctx the parse tree
	 */
	enterLnExpr?: (ctx: LnExprContext) => void;
	/**
	 * Exit a parse tree produced by `MathCommandParser.lnExpr`.
	 * @param ctx the parse tree
	 */
	exitLnExpr?: (ctx: LnExprContext) => void;

	/**
	 * Enter a parse tree produced by `MathCommandParser.cbrtExpr`.
	 * @param ctx the parse tree
	 */
	enterCbrtExpr?: (ctx: CbrtExprContext) => void;
	/**
	 * Exit a parse tree produced by `MathCommandParser.cbrtExpr`.
	 * @param ctx the parse tree
	 */
	exitCbrtExpr?: (ctx: CbrtExprContext) => void;

	/**
	 * Enter a parse tree produced by `MathCommandParser.sqrtExpr`.
	 * @param ctx the parse tree
	 */
	enterSqrtExpr?: (ctx: SqrtExprContext) => void;
	/**
	 * Exit a parse tree produced by `MathCommandParser.sqrtExpr`.
	 * @param ctx the parse tree
	 */
	exitSqrtExpr?: (ctx: SqrtExprContext) => void;

	/**
	 * Enter a parse tree produced by `MathCommandParser.nrootExpr`.
	 * @param ctx the parse tree
	 */
	enterNrootExpr?: (ctx: NrootExprContext) => void;
	/**
	 * Exit a parse tree produced by `MathCommandParser.nrootExpr`.
	 * @param ctx the parse tree
	 */
	exitNrootExpr?: (ctx: NrootExprContext) => void;

	/**
	 * Enter a parse tree produced by `MathCommandParser.absExpr`.
	 * @param ctx the parse tree
	 */
	enterAbsExpr?: (ctx: AbsExprContext) => void;
	/**
	 * Exit a parse tree produced by `MathCommandParser.absExpr`.
	 * @param ctx the parse tree
	 */
	exitAbsExpr?: (ctx: AbsExprContext) => void;

	/**
	 * Enter a parse tree produced by `MathCommandParser.expExpr`.
	 * @param ctx the parse tree
	 */
	enterExpExpr?: (ctx: ExpExprContext) => void;
	/**
	 * Exit a parse tree produced by `MathCommandParser.expExpr`.
	 * @param ctx the parse tree
	 */
	exitExpExpr?: (ctx: ExpExprContext) => void;

	/**
	 * Enter a parse tree produced by `MathCommandParser.pointExpr`.
	 * @param ctx the parse tree
	 */
	enterPointExpr?: (ctx: PointExprContext) => void;
	/**
	 * Exit a parse tree produced by `MathCommandParser.pointExpr`.
	 * @param ctx the parse tree
	 */
	exitPointExpr?: (ctx: PointExprContext) => void;

	/**
	 * Enter a parse tree produced by `MathCommandParser.lineExpr`.
	 * @param ctx the parse tree
	 */
	enterLineExpr?: (ctx: LineExprContext) => void;
	/**
	 * Exit a parse tree produced by `MathCommandParser.lineExpr`.
	 * @param ctx the parse tree
	 */
	exitLineExpr?: (ctx: LineExprContext) => void;

	/**
	 * Enter a parse tree produced by `MathCommandParser.dirExpr`.
	 * @param ctx the parse tree
	 */
	enterDirExpr?: (ctx: DirExprContext) => void;
	/**
	 * Exit a parse tree produced by `MathCommandParser.dirExpr`.
	 * @param ctx the parse tree
	 */
	exitDirExpr?: (ctx: DirExprContext) => void;

	/**
	 * Enter a parse tree produced by `MathCommandParser.vectorExpr`.
	 * @param ctx the parse tree
	 */
	enterVectorExpr?: (ctx: VectorExprContext) => void;
	/**
	 * Exit a parse tree produced by `MathCommandParser.vectorExpr`.
	 * @param ctx the parse tree
	 */
	exitVectorExpr?: (ctx: VectorExprContext) => void;

	/**
	 * Enter a parse tree produced by `MathCommandParser.planeExpr`.
	 * @param ctx the parse tree
	 */
	enterPlaneExpr?: (ctx: PlaneExprContext) => void;
	/**
	 * Exit a parse tree produced by `MathCommandParser.planeExpr`.
	 * @param ctx the parse tree
	 */
	exitPlaneExpr?: (ctx: PlaneExprContext) => void;

	/**
	 * Enter a parse tree produced by `MathCommandParser.directionExpr`.
	 * @param ctx the parse tree
	 */
	enterDirectionExpr?: (ctx: DirectionExprContext) => void;
	/**
	 * Exit a parse tree produced by `MathCommandParser.directionExpr`.
	 * @param ctx the parse tree
	 */
	exitDirectionExpr?: (ctx: DirectionExprContext) => void;

	/**
	 * Enter a parse tree produced by `MathCommandParser.polygonExpr`.
	 * @param ctx the parse tree
	 */
	enterPolygonExpr?: (ctx: PolygonExprContext) => void;
	/**
	 * Exit a parse tree produced by `MathCommandParser.polygonExpr`.
	 * @param ctx the parse tree
	 */
	exitPolygonExpr?: (ctx: PolygonExprContext) => void;

	/**
	 * Enter a parse tree produced by `MathCommandParser.tetrahedronExpr`.
	 * @param ctx the parse tree
	 */
	enterTetrahedronExpr?: (ctx: TetrahedronExprContext) => void;
	/**
	 * Exit a parse tree produced by `MathCommandParser.tetrahedronExpr`.
	 * @param ctx the parse tree
	 */
	exitTetrahedronExpr?: (ctx: TetrahedronExprContext) => void;

	/**
	 * Enter a parse tree produced by `MathCommandParser.cylinderExpr`.
	 * @param ctx the parse tree
	 */
	enterCylinderExpr?: (ctx: CylinderExprContext) => void;
	/**
	 * Exit a parse tree produced by `MathCommandParser.cylinderExpr`.
	 * @param ctx the parse tree
	 */
	exitCylinderExpr?: (ctx: CylinderExprContext) => void;

	/**
	 * Enter a parse tree produced by `MathCommandParser.coneExpr`.
	 * @param ctx the parse tree
	 */
	enterConeExpr?: (ctx: ConeExprContext) => void;
	/**
	 * Exit a parse tree produced by `MathCommandParser.coneExpr`.
	 * @param ctx the parse tree
	 */
	exitConeExpr?: (ctx: ConeExprContext) => void;

	/**
	 * Enter a parse tree produced by `MathCommandParser.prismExpr`.
	 * @param ctx the parse tree
	 */
	enterPrismExpr?: (ctx: PrismExprContext) => void;
	/**
	 * Exit a parse tree produced by `MathCommandParser.prismExpr`.
	 * @param ctx the parse tree
	 */
	exitPrismExpr?: (ctx: PrismExprContext) => void;

	/**
	 * Enter a parse tree produced by `MathCommandParser.segmentExpr`.
	 * @param ctx the parse tree
	 */
	enterSegmentExpr?: (ctx: SegmentExprContext) => void;
	/**
	 * Exit a parse tree produced by `MathCommandParser.segmentExpr`.
	 * @param ctx the parse tree
	 */
	exitSegmentExpr?: (ctx: SegmentExprContext) => void;

	/**
	 * Enter a parse tree produced by `MathCommandParser.rayExpr`.
	 * @param ctx the parse tree
	 */
	enterRayExpr?: (ctx: RayExprContext) => void;
	/**
	 * Exit a parse tree produced by `MathCommandParser.rayExpr`.
	 * @param ctx the parse tree
	 */
	exitRayExpr?: (ctx: RayExprContext) => void;

	/**
	 * Enter a parse tree produced by `MathCommandParser.pyramidExpr`.
	 * @param ctx the parse tree
	 */
	enterPyramidExpr?: (ctx: PyramidExprContext) => void;
	/**
	 * Exit a parse tree produced by `MathCommandParser.pyramidExpr`.
	 * @param ctx the parse tree
	 */
	exitPyramidExpr?: (ctx: PyramidExprContext) => void;

	/**
	 * Enter a parse tree produced by `MathCommandParser.shapeExpr`.
	 * @param ctx the parse tree
	 */
	enterShapeExpr?: (ctx: ShapeExprContext) => void;
	/**
	 * Exit a parse tree produced by `MathCommandParser.shapeExpr`.
	 * @param ctx the parse tree
	 */
	exitShapeExpr?: (ctx: ShapeExprContext) => void;
}

