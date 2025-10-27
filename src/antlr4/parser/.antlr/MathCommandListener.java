// Generated from c:/Users/VOSTRO 3490/OneDrive/Desktop/calsystem/src/antlr4/parser/MathCommand.g4 by ANTLR 4.13.1
import org.antlr.v4.runtime.tree.ParseTreeListener;

/**
 * This interface defines a complete listener for a parse tree produced by
 * {@link MathCommandParser}.
 */
public interface MathCommandListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#program}.
	 * @param ctx the parse tree
	 */
	void enterProgram(MathCommandParser.ProgramContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#program}.
	 * @param ctx the parse tree
	 */
	void exitProgram(MathCommandParser.ProgramContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#expr}.
	 * @param ctx the parse tree
	 */
	void enterExpr(MathCommandParser.ExprContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#expr}.
	 * @param ctx the parse tree
	 */
	void exitExpr(MathCommandParser.ExprContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#pointDef}.
	 * @param ctx the parse tree
	 */
	void enterPointDef(MathCommandParser.PointDefContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#pointDef}.
	 * @param ctx the parse tree
	 */
	void exitPointDef(MathCommandParser.PointDefContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#sphereDef}.
	 * @param ctx the parse tree
	 */
	void enterSphereDef(MathCommandParser.SphereDefContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#sphereDef}.
	 * @param ctx the parse tree
	 */
	void exitSphereDef(MathCommandParser.SphereDefContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#planeDef}.
	 * @param ctx the parse tree
	 */
	void enterPlaneDef(MathCommandParser.PlaneDefContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#planeDef}.
	 * @param ctx the parse tree
	 */
	void exitPlaneDef(MathCommandParser.PlaneDefContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#lineDef}.
	 * @param ctx the parse tree
	 */
	void enterLineDef(MathCommandParser.LineDefContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#lineDef}.
	 * @param ctx the parse tree
	 */
	void exitLineDef(MathCommandParser.LineDefContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#angleDef}.
	 * @param ctx the parse tree
	 */
	void enterAngleDef(MathCommandParser.AngleDefContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#angleDef}.
	 * @param ctx the parse tree
	 */
	void exitAngleDef(MathCommandParser.AngleDefContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#vectorDef}.
	 * @param ctx the parse tree
	 */
	void enterVectorDef(MathCommandParser.VectorDefContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#vectorDef}.
	 * @param ctx the parse tree
	 */
	void exitVectorDef(MathCommandParser.VectorDefContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#polygonDef}.
	 * @param ctx the parse tree
	 */
	void enterPolygonDef(MathCommandParser.PolygonDefContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#polygonDef}.
	 * @param ctx the parse tree
	 */
	void exitPolygonDef(MathCommandParser.PolygonDefContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#pointList}.
	 * @param ctx the parse tree
	 */
	void enterPointList(MathCommandParser.PointListContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#pointList}.
	 * @param ctx the parse tree
	 */
	void exitPointList(MathCommandParser.PointListContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#circleDef}.
	 * @param ctx the parse tree
	 */
	void enterCircleDef(MathCommandParser.CircleDefContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#circleDef}.
	 * @param ctx the parse tree
	 */
	void exitCircleDef(MathCommandParser.CircleDefContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#segmentDef}.
	 * @param ctx the parse tree
	 */
	void enterSegmentDef(MathCommandParser.SegmentDefContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#segmentDef}.
	 * @param ctx the parse tree
	 */
	void exitSegmentDef(MathCommandParser.SegmentDefContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#rayDef}.
	 * @param ctx the parse tree
	 */
	void enterRayDef(MathCommandParser.RayDefContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#rayDef}.
	 * @param ctx the parse tree
	 */
	void exitRayDef(MathCommandParser.RayDefContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#intersectionDef}.
	 * @param ctx the parse tree
	 */
	void enterIntersectionDef(MathCommandParser.IntersectionDefContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#intersectionDef}.
	 * @param ctx the parse tree
	 */
	void exitIntersectionDef(MathCommandParser.IntersectionDefContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#transformDef}.
	 * @param ctx the parse tree
	 */
	void enterTransformDef(MathCommandParser.TransformDefContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#transformDef}.
	 * @param ctx the parse tree
	 */
	void exitTransformDef(MathCommandParser.TransformDefContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#cylinderDef}.
	 * @param ctx the parse tree
	 */
	void enterCylinderDef(MathCommandParser.CylinderDefContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#cylinderDef}.
	 * @param ctx the parse tree
	 */
	void exitCylinderDef(MathCommandParser.CylinderDefContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#tetrahedronDef}.
	 * @param ctx the parse tree
	 */
	void enterTetrahedronDef(MathCommandParser.TetrahedronDefContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#tetrahedronDef}.
	 * @param ctx the parse tree
	 */
	void exitTetrahedronDef(MathCommandParser.TetrahedronDefContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#coneDef}.
	 * @param ctx the parse tree
	 */
	void enterConeDef(MathCommandParser.ConeDefContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#coneDef}.
	 * @param ctx the parse tree
	 */
	void exitConeDef(MathCommandParser.ConeDefContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#prismDef}.
	 * @param ctx the parse tree
	 */
	void enterPrismDef(MathCommandParser.PrismDefContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#prismDef}.
	 * @param ctx the parse tree
	 */
	void exitPrismDef(MathCommandParser.PrismDefContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#numberExpr}.
	 * @param ctx the parse tree
	 */
	void enterNumberExpr(MathCommandParser.NumberExprContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#numberExpr}.
	 * @param ctx the parse tree
	 */
	void exitNumberExpr(MathCommandParser.NumberExprContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#additiveExpr}.
	 * @param ctx the parse tree
	 */
	void enterAdditiveExpr(MathCommandParser.AdditiveExprContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#additiveExpr}.
	 * @param ctx the parse tree
	 */
	void exitAdditiveExpr(MathCommandParser.AdditiveExprContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#multiplicativeExpr}.
	 * @param ctx the parse tree
	 */
	void enterMultiplicativeExpr(MathCommandParser.MultiplicativeExprContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#multiplicativeExpr}.
	 * @param ctx the parse tree
	 */
	void exitMultiplicativeExpr(MathCommandParser.MultiplicativeExprContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#implicitMultiplicativeExpr}.
	 * @param ctx the parse tree
	 */
	void enterImplicitMultiplicativeExpr(MathCommandParser.ImplicitMultiplicativeExprContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#implicitMultiplicativeExpr}.
	 * @param ctx the parse tree
	 */
	void exitImplicitMultiplicativeExpr(MathCommandParser.ImplicitMultiplicativeExprContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#exponentialExpr}.
	 * @param ctx the parse tree
	 */
	void enterExponentialExpr(MathCommandParser.ExponentialExprContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#exponentialExpr}.
	 * @param ctx the parse tree
	 */
	void exitExponentialExpr(MathCommandParser.ExponentialExprContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#unaryExpr}.
	 * @param ctx the parse tree
	 */
	void enterUnaryExpr(MathCommandParser.UnaryExprContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#unaryExpr}.
	 * @param ctx the parse tree
	 */
	void exitUnaryExpr(MathCommandParser.UnaryExprContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#primaryExpr}.
	 * @param ctx the parse tree
	 */
	void enterPrimaryExpr(MathCommandParser.PrimaryExprContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#primaryExpr}.
	 * @param ctx the parse tree
	 */
	void exitPrimaryExpr(MathCommandParser.PrimaryExprContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#sinExpr}.
	 * @param ctx the parse tree
	 */
	void enterSinExpr(MathCommandParser.SinExprContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#sinExpr}.
	 * @param ctx the parse tree
	 */
	void exitSinExpr(MathCommandParser.SinExprContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#cosExpr}.
	 * @param ctx the parse tree
	 */
	void enterCosExpr(MathCommandParser.CosExprContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#cosExpr}.
	 * @param ctx the parse tree
	 */
	void exitCosExpr(MathCommandParser.CosExprContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#tanExpr}.
	 * @param ctx the parse tree
	 */
	void enterTanExpr(MathCommandParser.TanExprContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#tanExpr}.
	 * @param ctx the parse tree
	 */
	void exitTanExpr(MathCommandParser.TanExprContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#cotExpr}.
	 * @param ctx the parse tree
	 */
	void enterCotExpr(MathCommandParser.CotExprContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#cotExpr}.
	 * @param ctx the parse tree
	 */
	void exitCotExpr(MathCommandParser.CotExprContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#logExpr}.
	 * @param ctx the parse tree
	 */
	void enterLogExpr(MathCommandParser.LogExprContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#logExpr}.
	 * @param ctx the parse tree
	 */
	void exitLogExpr(MathCommandParser.LogExprContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#lnExpr}.
	 * @param ctx the parse tree
	 */
	void enterLnExpr(MathCommandParser.LnExprContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#lnExpr}.
	 * @param ctx the parse tree
	 */
	void exitLnExpr(MathCommandParser.LnExprContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#cbrtExpr}.
	 * @param ctx the parse tree
	 */
	void enterCbrtExpr(MathCommandParser.CbrtExprContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#cbrtExpr}.
	 * @param ctx the parse tree
	 */
	void exitCbrtExpr(MathCommandParser.CbrtExprContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#sqrtExpr}.
	 * @param ctx the parse tree
	 */
	void enterSqrtExpr(MathCommandParser.SqrtExprContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#sqrtExpr}.
	 * @param ctx the parse tree
	 */
	void exitSqrtExpr(MathCommandParser.SqrtExprContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#absExpr}.
	 * @param ctx the parse tree
	 */
	void enterAbsExpr(MathCommandParser.AbsExprContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#absExpr}.
	 * @param ctx the parse tree
	 */
	void exitAbsExpr(MathCommandParser.AbsExprContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#expExpr}.
	 * @param ctx the parse tree
	 */
	void enterExpExpr(MathCommandParser.ExpExprContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#expExpr}.
	 * @param ctx the parse tree
	 */
	void exitExpExpr(MathCommandParser.ExpExprContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#pointExpr}.
	 * @param ctx the parse tree
	 */
	void enterPointExpr(MathCommandParser.PointExprContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#pointExpr}.
	 * @param ctx the parse tree
	 */
	void exitPointExpr(MathCommandParser.PointExprContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#lineExpr}.
	 * @param ctx the parse tree
	 */
	void enterLineExpr(MathCommandParser.LineExprContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#lineExpr}.
	 * @param ctx the parse tree
	 */
	void exitLineExpr(MathCommandParser.LineExprContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#dirExpr}.
	 * @param ctx the parse tree
	 */
	void enterDirExpr(MathCommandParser.DirExprContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#dirExpr}.
	 * @param ctx the parse tree
	 */
	void exitDirExpr(MathCommandParser.DirExprContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#vectorExpr}.
	 * @param ctx the parse tree
	 */
	void enterVectorExpr(MathCommandParser.VectorExprContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#vectorExpr}.
	 * @param ctx the parse tree
	 */
	void exitVectorExpr(MathCommandParser.VectorExprContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#planeExpr}.
	 * @param ctx the parse tree
	 */
	void enterPlaneExpr(MathCommandParser.PlaneExprContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#planeExpr}.
	 * @param ctx the parse tree
	 */
	void exitPlaneExpr(MathCommandParser.PlaneExprContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#directionExpr}.
	 * @param ctx the parse tree
	 */
	void enterDirectionExpr(MathCommandParser.DirectionExprContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#directionExpr}.
	 * @param ctx the parse tree
	 */
	void exitDirectionExpr(MathCommandParser.DirectionExprContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#polygonExpr}.
	 * @param ctx the parse tree
	 */
	void enterPolygonExpr(MathCommandParser.PolygonExprContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#polygonExpr}.
	 * @param ctx the parse tree
	 */
	void exitPolygonExpr(MathCommandParser.PolygonExprContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#tetrahedronExpr}.
	 * @param ctx the parse tree
	 */
	void enterTetrahedronExpr(MathCommandParser.TetrahedronExprContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#tetrahedronExpr}.
	 * @param ctx the parse tree
	 */
	void exitTetrahedronExpr(MathCommandParser.TetrahedronExprContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#cylinderExpr}.
	 * @param ctx the parse tree
	 */
	void enterCylinderExpr(MathCommandParser.CylinderExprContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#cylinderExpr}.
	 * @param ctx the parse tree
	 */
	void exitCylinderExpr(MathCommandParser.CylinderExprContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#coneExpr}.
	 * @param ctx the parse tree
	 */
	void enterConeExpr(MathCommandParser.ConeExprContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#coneExpr}.
	 * @param ctx the parse tree
	 */
	void exitConeExpr(MathCommandParser.ConeExprContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#prismExpr}.
	 * @param ctx the parse tree
	 */
	void enterPrismExpr(MathCommandParser.PrismExprContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#prismExpr}.
	 * @param ctx the parse tree
	 */
	void exitPrismExpr(MathCommandParser.PrismExprContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#shapeExpr}.
	 * @param ctx the parse tree
	 */
	void enterShapeExpr(MathCommandParser.ShapeExprContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#shapeExpr}.
	 * @param ctx the parse tree
	 */
	void exitShapeExpr(MathCommandParser.ShapeExprContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#two_side_expr}.
	 * @param ctx the parse tree
	 */
	void enterTwo_side_expr(MathCommandParser.Two_side_exprContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#two_side_expr}.
	 * @param ctx the parse tree
	 */
	void exitTwo_side_expr(MathCommandParser.Two_side_exprContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#varExpr}.
	 * @param ctx the parse tree
	 */
	void enterVarExpr(MathCommandParser.VarExprContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#varExpr}.
	 * @param ctx the parse tree
	 */
	void exitVarExpr(MathCommandParser.VarExprContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#varMultiplicativeExpr}.
	 * @param ctx the parse tree
	 */
	void enterVarMultiplicativeExpr(MathCommandParser.VarMultiplicativeExprContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#varMultiplicativeExpr}.
	 * @param ctx the parse tree
	 */
	void exitVarMultiplicativeExpr(MathCommandParser.VarMultiplicativeExprContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#varImplicitMultiplicativeExpr}.
	 * @param ctx the parse tree
	 */
	void enterVarImplicitMultiplicativeExpr(MathCommandParser.VarImplicitMultiplicativeExprContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#varImplicitMultiplicativeExpr}.
	 * @param ctx the parse tree
	 */
	void exitVarImplicitMultiplicativeExpr(MathCommandParser.VarImplicitMultiplicativeExprContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#varExponentialExpr}.
	 * @param ctx the parse tree
	 */
	void enterVarExponentialExpr(MathCommandParser.VarExponentialExprContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#varExponentialExpr}.
	 * @param ctx the parse tree
	 */
	void exitVarExponentialExpr(MathCommandParser.VarExponentialExprContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#varUnaryExpr}.
	 * @param ctx the parse tree
	 */
	void enterVarUnaryExpr(MathCommandParser.VarUnaryExprContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#varUnaryExpr}.
	 * @param ctx the parse tree
	 */
	void exitVarUnaryExpr(MathCommandParser.VarUnaryExprContext ctx);
	/**
	 * Enter a parse tree produced by {@link MathCommandParser#varPrimaryExpr}.
	 * @param ctx the parse tree
	 */
	void enterVarPrimaryExpr(MathCommandParser.VarPrimaryExprContext ctx);
	/**
	 * Exit a parse tree produced by {@link MathCommandParser#varPrimaryExpr}.
	 * @param ctx the parse tree
	 */
	void exitVarPrimaryExpr(MathCommandParser.VarPrimaryExprContext ctx);
}