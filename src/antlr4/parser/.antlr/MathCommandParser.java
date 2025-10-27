// Generated from c:/Users/VOSTRO 3490/OneDrive/Desktop/calsystem/src/antlr4/parser/MathCommand.g4 by ANTLR 4.13.1
import org.antlr.v4.runtime.atn.*;
import org.antlr.v4.runtime.dfa.DFA;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.misc.*;
import org.antlr.v4.runtime.tree.*;
import java.util.List;
import java.util.Iterator;
import java.util.ArrayList;

@SuppressWarnings({"all", "warnings", "unchecked", "unused", "cast", "CheckReturnValue"})
public class MathCommandParser extends Parser {
	static { RuntimeMetaData.checkVersion("4.13.1", RuntimeMetaData.VERSION); }

	protected static final DFA[] _decisionToDFA;
	protected static final PredictionContextCache _sharedContextCache =
		new PredictionContextCache();
	public static final int
		CIRCLE=1, LINE=2, VECTOR=3, SEGMENT=4, RAY=5, POLYGON=6, POINT=7, SPHERE=8, 
		PLANE=9, INTERSECT=10, ANGLE=11, TRANSLATE=12, ROTATE=13, PROJECT=14, 
		REFLECT=15, ENLARGE=16, CYLINDER=17, TETRAHEDRON=18, PRISM=19, PYRAMID=20, 
		CUBOID=21, CONE=22, SIN=23, COS=24, TAN=25, COT=26, LOG=27, LN=28, EXP=29, 
		SQRT=30, CBRT=31, ABS=32, PI=33, E=34, X=35, Y=36, Z=37, POINT_ID=38, 
		SHAPE_ID=39, LR=40, RR=41, LC=42, RC=43, COMMA=44, DIVIDE=45, ADD=46, 
		SUB=47, MULTIPLY=48, POWER=49, INT_LIT=50, FLOAT_LIT=51, WS=52, ERROR_CHAR=53;
	public static final int
		RULE_program = 0, RULE_expr = 1, RULE_pointDef = 2, RULE_sphereDef = 3, 
		RULE_planeDef = 4, RULE_lineDef = 5, RULE_angleDef = 6, RULE_vectorDef = 7, 
		RULE_polygonDef = 8, RULE_pointList = 9, RULE_circleDef = 10, RULE_segmentDef = 11, 
		RULE_rayDef = 12, RULE_intersectionDef = 13, RULE_transformDef = 14, RULE_cylinderDef = 15, 
		RULE_tetrahedronDef = 16, RULE_coneDef = 17, RULE_prismDef = 18, RULE_pyramidDef = 19, 
		RULE_numberExpr = 20, RULE_additiveExpr = 21, RULE_multiplicativeExpr = 22, 
		RULE_implicitMultiplicativeExpr = 23, RULE_exponentialExpr = 24, RULE_unaryExpr = 25, 
		RULE_primaryExpr = 26, RULE_sinExpr = 27, RULE_cosExpr = 28, RULE_tanExpr = 29, 
		RULE_cotExpr = 30, RULE_logExpr = 31, RULE_lnExpr = 32, RULE_cbrtExpr = 33, 
		RULE_sqrtExpr = 34, RULE_absExpr = 35, RULE_expExpr = 36, RULE_pointExpr = 37, 
		RULE_lineExpr = 38, RULE_dirExpr = 39, RULE_vectorExpr = 40, RULE_planeExpr = 41, 
		RULE_directionExpr = 42, RULE_polygonExpr = 43, RULE_tetrahedronExpr = 44, 
		RULE_cylinderExpr = 45, RULE_coneExpr = 46, RULE_prismExpr = 47, RULE_segmentExpr = 48, 
		RULE_rayExpr = 49, RULE_pyramidExpr = 50, RULE_shapeExpr = 51;
	private static String[] makeRuleNames() {
		return new String[] {
			"program", "expr", "pointDef", "sphereDef", "planeDef", "lineDef", "angleDef", 
			"vectorDef", "polygonDef", "pointList", "circleDef", "segmentDef", "rayDef", 
			"intersectionDef", "transformDef", "cylinderDef", "tetrahedronDef", "coneDef", 
			"prismDef", "pyramidDef", "numberExpr", "additiveExpr", "multiplicativeExpr", 
			"implicitMultiplicativeExpr", "exponentialExpr", "unaryExpr", "primaryExpr", 
			"sinExpr", "cosExpr", "tanExpr", "cotExpr", "logExpr", "lnExpr", "cbrtExpr", 
			"sqrtExpr", "absExpr", "expExpr", "pointExpr", "lineExpr", "dirExpr", 
			"vectorExpr", "planeExpr", "directionExpr", "polygonExpr", "tetrahedronExpr", 
			"cylinderExpr", "coneExpr", "prismExpr", "segmentExpr", "rayExpr", "pyramidExpr", 
			"shapeExpr"
		};
	}
	public static final String[] ruleNames = makeRuleNames();

	private static String[] makeLiteralNames() {
		return new String[] {
			null, "'Circle'", "'Line'", "'Vector'", "'Segment'", "'Ray'", "'Polygon'", 
			"'Point'", "'Sphere'", "'Plane'", "'Intersect'", "'Angle'", "'Translate'", 
			"'Rotate'", "'Project'", "'Reflect'", "'Enlarge'", "'Cylinder'", "'Tetrahedron'", 
			"'Prism'", "'Pyramid'", "'Cuboid'", "'Cone'", "'sin'", "'cos'", "'tan'", 
			"'cot'", "'log'", "'ln'", "'exp'", "'sqrt'", "'cbrt'", "'abs'", "'pi'", 
			"'e'", "'x'", "'y'", "'z'", null, null, "'('", "')'", "'{'", "'}'", "','", 
			"'/'", "'+'", "'-'", "'*'", "'^'"
		};
	}
	private static final String[] _LITERAL_NAMES = makeLiteralNames();
	private static String[] makeSymbolicNames() {
		return new String[] {
			null, "CIRCLE", "LINE", "VECTOR", "SEGMENT", "RAY", "POLYGON", "POINT", 
			"SPHERE", "PLANE", "INTERSECT", "ANGLE", "TRANSLATE", "ROTATE", "PROJECT", 
			"REFLECT", "ENLARGE", "CYLINDER", "TETRAHEDRON", "PRISM", "PYRAMID", 
			"CUBOID", "CONE", "SIN", "COS", "TAN", "COT", "LOG", "LN", "EXP", "SQRT", 
			"CBRT", "ABS", "PI", "E", "X", "Y", "Z", "POINT_ID", "SHAPE_ID", "LR", 
			"RR", "LC", "RC", "COMMA", "DIVIDE", "ADD", "SUB", "MULTIPLY", "POWER", 
			"INT_LIT", "FLOAT_LIT", "WS", "ERROR_CHAR"
		};
	}
	private static final String[] _SYMBOLIC_NAMES = makeSymbolicNames();
	public static final Vocabulary VOCABULARY = new VocabularyImpl(_LITERAL_NAMES, _SYMBOLIC_NAMES);

	/**
	 * @deprecated Use {@link #VOCABULARY} instead.
	 */
	@Deprecated
	public static final String[] tokenNames;
	static {
		tokenNames = new String[_SYMBOLIC_NAMES.length];
		for (int i = 0; i < tokenNames.length; i++) {
			tokenNames[i] = VOCABULARY.getLiteralName(i);
			if (tokenNames[i] == null) {
				tokenNames[i] = VOCABULARY.getSymbolicName(i);
			}

			if (tokenNames[i] == null) {
				tokenNames[i] = "<INVALID>";
			}
		}
	}

	@Override
	@Deprecated
	public String[] getTokenNames() {
		return tokenNames;
	}

	@Override

	public Vocabulary getVocabulary() {
		return VOCABULARY;
	}

	@Override
	public String getGrammarFileName() { return "MathCommand.g4"; }

	@Override
	public String[] getRuleNames() { return ruleNames; }

	@Override
	public String getSerializedATN() { return _serializedATN; }

	@Override
	public ATN getATN() { return _ATN; }

	public MathCommandParser(TokenStream input) {
		super(input);
		_interp = new ParserATNSimulator(this,_ATN,_decisionToDFA,_sharedContextCache);
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ProgramContext extends ParserRuleContext {
		public ExprContext expr() {
			return getRuleContext(ExprContext.class,0);
		}
		public TerminalNode EOF() { return getToken(MathCommandParser.EOF, 0); }
		public ProgramContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_program; }
	}

	public final ProgramContext program() throws RecognitionException {
		ProgramContext _localctx = new ProgramContext(_ctx, getState());
		enterRule(_localctx, 0, RULE_program);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(104);
			expr();
			setState(105);
			match(EOF);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ExprContext extends ParserRuleContext {
		public ShapeExprContext shapeExpr() {
			return getRuleContext(ShapeExprContext.class,0);
		}
		public ExprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_expr; }
	}

	public final ExprContext expr() throws RecognitionException {
		ExprContext _localctx = new ExprContext(_ctx, getState());
		enterRule(_localctx, 2, RULE_expr);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(107);
			shapeExpr();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class PointDefContext extends ParserRuleContext {
		public TerminalNode LR() { return getToken(MathCommandParser.LR, 0); }
		public TerminalNode RR() { return getToken(MathCommandParser.RR, 0); }
		public List<NumberExprContext> numberExpr() {
			return getRuleContexts(NumberExprContext.class);
		}
		public NumberExprContext numberExpr(int i) {
			return getRuleContext(NumberExprContext.class,i);
		}
		public List<TerminalNode> COMMA() { return getTokens(MathCommandParser.COMMA); }
		public TerminalNode COMMA(int i) {
			return getToken(MathCommandParser.COMMA, i);
		}
		public TerminalNode POINT() { return getToken(MathCommandParser.POINT, 0); }
		public PointDefContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_pointDef; }
	}

	public final PointDefContext pointDef() throws RecognitionException {
		PointDefContext _localctx = new PointDefContext(_ctx, getState());
		enterRule(_localctx, 4, RULE_pointDef);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(110);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==POINT) {
				{
				setState(109);
				match(POINT);
				}
			}

			setState(112);
			match(LR);
			{
			setState(113);
			numberExpr();
			setState(114);
			match(COMMA);
			setState(115);
			numberExpr();
			setState(116);
			match(COMMA);
			setState(117);
			numberExpr();
			}
			setState(119);
			match(RR);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class SphereDefContext extends ParserRuleContext {
		public TerminalNode SPHERE() { return getToken(MathCommandParser.SPHERE, 0); }
		public TerminalNode LR() { return getToken(MathCommandParser.LR, 0); }
		public TerminalNode RR() { return getToken(MathCommandParser.RR, 0); }
		public List<PointExprContext> pointExpr() {
			return getRuleContexts(PointExprContext.class);
		}
		public PointExprContext pointExpr(int i) {
			return getRuleContext(PointExprContext.class,i);
		}
		public TerminalNode COMMA() { return getToken(MathCommandParser.COMMA, 0); }
		public NumberExprContext numberExpr() {
			return getRuleContext(NumberExprContext.class,0);
		}
		public SphereDefContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_sphereDef; }
	}

	public final SphereDefContext sphereDef() throws RecognitionException {
		SphereDefContext _localctx = new SphereDefContext(_ctx, getState());
		enterRule(_localctx, 6, RULE_sphereDef);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(121);
			match(SPHERE);
			setState(122);
			match(LR);
			{
			setState(123);
			pointExpr();
			setState(124);
			match(COMMA);
			setState(127);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,1,_ctx) ) {
			case 1:
				{
				setState(125);
				pointExpr();
				}
				break;
			case 2:
				{
				setState(126);
				numberExpr();
				}
				break;
			}
			}
			setState(129);
			match(RR);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class PlaneDefContext extends ParserRuleContext {
		public TerminalNode PLANE() { return getToken(MathCommandParser.PLANE, 0); }
		public TerminalNode LR() { return getToken(MathCommandParser.LR, 0); }
		public TerminalNode RR() { return getToken(MathCommandParser.RR, 0); }
		public TerminalNode SHAPE_ID() { return getToken(MathCommandParser.SHAPE_ID, 0); }
		public List<PointExprContext> pointExpr() {
			return getRuleContexts(PointExprContext.class);
		}
		public PointExprContext pointExpr(int i) {
			return getRuleContext(PointExprContext.class,i);
		}
		public List<TerminalNode> COMMA() { return getTokens(MathCommandParser.COMMA); }
		public TerminalNode COMMA(int i) {
			return getToken(MathCommandParser.COMMA, i);
		}
		public List<LineExprContext> lineExpr() {
			return getRuleContexts(LineExprContext.class);
		}
		public LineExprContext lineExpr(int i) {
			return getRuleContext(LineExprContext.class,i);
		}
		public List<VectorExprContext> vectorExpr() {
			return getRuleContexts(VectorExprContext.class);
		}
		public VectorExprContext vectorExpr(int i) {
			return getRuleContext(VectorExprContext.class,i);
		}
		public PlaneExprContext planeExpr() {
			return getRuleContext(PlaneExprContext.class,0);
		}
		public PlaneDefContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_planeDef; }
	}

	public final PlaneDefContext planeDef() throws RecognitionException {
		PlaneDefContext _localctx = new PlaneDefContext(_ctx, getState());
		enterRule(_localctx, 8, RULE_planeDef);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(131);
			match(PLANE);
			setState(132);
			match(LR);
			setState(156);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,3,_ctx) ) {
			case 1:
				{
				setState(133);
				match(SHAPE_ID);
				}
				break;
			case 2:
				{
				{
				setState(134);
				pointExpr();
				setState(135);
				match(COMMA);
				setState(138);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,2,_ctx) ) {
				case 1:
					{
					setState(136);
					planeExpr();
					}
					break;
				case 2:
					{
					setState(137);
					lineExpr();
					}
					break;
				}
				}
				}
				break;
			case 3:
				{
				{
				setState(140);
				lineExpr();
				setState(141);
				match(COMMA);
				setState(142);
				lineExpr();
				}
				}
				break;
			case 4:
				{
				{
				setState(144);
				pointExpr();
				setState(145);
				match(COMMA);
				setState(146);
				vectorExpr();
				setState(147);
				match(COMMA);
				setState(148);
				vectorExpr();
				}
				}
				break;
			case 5:
				{
				{
				setState(150);
				pointExpr();
				setState(151);
				match(COMMA);
				setState(152);
				pointExpr();
				setState(153);
				match(COMMA);
				setState(154);
				pointExpr();
				}
				}
				break;
			}
			setState(158);
			match(RR);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class LineDefContext extends ParserRuleContext {
		public TerminalNode LINE() { return getToken(MathCommandParser.LINE, 0); }
		public TerminalNode LR() { return getToken(MathCommandParser.LR, 0); }
		public TerminalNode RR() { return getToken(MathCommandParser.RR, 0); }
		public List<PointExprContext> pointExpr() {
			return getRuleContexts(PointExprContext.class);
		}
		public PointExprContext pointExpr(int i) {
			return getRuleContext(PointExprContext.class,i);
		}
		public TerminalNode COMMA() { return getToken(MathCommandParser.COMMA, 0); }
		public LineExprContext lineExpr() {
			return getRuleContext(LineExprContext.class,0);
		}
		public VectorExprContext vectorExpr() {
			return getRuleContext(VectorExprContext.class,0);
		}
		public LineDefContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_lineDef; }
	}

	public final LineDefContext lineDef() throws RecognitionException {
		LineDefContext _localctx = new LineDefContext(_ctx, getState());
		enterRule(_localctx, 10, RULE_lineDef);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(160);
			match(LINE);
			setState(161);
			match(LR);
			setState(174);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,4,_ctx) ) {
			case 1:
				{
				{
				setState(162);
				pointExpr();
				setState(163);
				match(COMMA);
				setState(164);
				pointExpr();
				}
				}
				break;
			case 2:
				{
				{
				setState(166);
				pointExpr();
				setState(167);
				match(COMMA);
				setState(168);
				lineExpr();
				}
				}
				break;
			case 3:
				{
				{
				setState(170);
				pointExpr();
				setState(171);
				match(COMMA);
				setState(172);
				vectorExpr();
				}
				}
				break;
			}
			setState(176);
			match(RR);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class AngleDefContext extends ParserRuleContext {
		public TerminalNode ANGLE() { return getToken(MathCommandParser.ANGLE, 0); }
		public TerminalNode LR() { return getToken(MathCommandParser.LR, 0); }
		public TerminalNode RR() { return getToken(MathCommandParser.RR, 0); }
		public List<VectorExprContext> vectorExpr() {
			return getRuleContexts(VectorExprContext.class);
		}
		public VectorExprContext vectorExpr(int i) {
			return getRuleContext(VectorExprContext.class,i);
		}
		public List<PointExprContext> pointExpr() {
			return getRuleContexts(PointExprContext.class);
		}
		public PointExprContext pointExpr(int i) {
			return getRuleContext(PointExprContext.class,i);
		}
		public List<TerminalNode> COMMA() { return getTokens(MathCommandParser.COMMA); }
		public TerminalNode COMMA(int i) {
			return getToken(MathCommandParser.COMMA, i);
		}
		public List<LineExprContext> lineExpr() {
			return getRuleContexts(LineExprContext.class);
		}
		public LineExprContext lineExpr(int i) {
			return getRuleContext(LineExprContext.class,i);
		}
		public List<PlaneExprContext> planeExpr() {
			return getRuleContexts(PlaneExprContext.class);
		}
		public PlaneExprContext planeExpr(int i) {
			return getRuleContext(PlaneExprContext.class,i);
		}
		public AngleDefContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_angleDef; }
	}

	public final AngleDefContext angleDef() throws RecognitionException {
		AngleDefContext _localctx = new AngleDefContext(_ctx, getState());
		enterRule(_localctx, 12, RULE_angleDef);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(178);
			match(ANGLE);
			setState(179);
			match(LR);
			setState(204);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,5,_ctx) ) {
			case 1:
				{
				setState(180);
				vectorExpr();
				}
				break;
			case 2:
				{
				setState(181);
				pointExpr();
				}
				break;
			case 3:
				{
				{
				setState(182);
				vectorExpr();
				setState(183);
				match(COMMA);
				setState(184);
				vectorExpr();
				}
				}
				break;
			case 4:
				{
				{
				setState(186);
				lineExpr();
				setState(187);
				match(COMMA);
				setState(188);
				lineExpr();
				}
				}
				break;
			case 5:
				{
				{
				setState(190);
				lineExpr();
				setState(191);
				match(COMMA);
				setState(192);
				planeExpr();
				}
				}
				break;
			case 6:
				{
				{
				setState(194);
				planeExpr();
				setState(195);
				match(COMMA);
				setState(196);
				planeExpr();
				}
				}
				break;
			case 7:
				{
				{
				setState(198);
				pointExpr();
				setState(199);
				match(COMMA);
				setState(200);
				pointExpr();
				setState(201);
				match(COMMA);
				setState(202);
				pointExpr();
				}
				}
				break;
			}
			setState(206);
			match(RR);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class VectorDefContext extends ParserRuleContext {
		public TerminalNode VECTOR() { return getToken(MathCommandParser.VECTOR, 0); }
		public TerminalNode LR() { return getToken(MathCommandParser.LR, 0); }
		public TerminalNode RR() { return getToken(MathCommandParser.RR, 0); }
		public List<PointExprContext> pointExpr() {
			return getRuleContexts(PointExprContext.class);
		}
		public PointExprContext pointExpr(int i) {
			return getRuleContext(PointExprContext.class,i);
		}
		public TerminalNode COMMA() { return getToken(MathCommandParser.COMMA, 0); }
		public VectorDefContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_vectorDef; }
	}

	public final VectorDefContext vectorDef() throws RecognitionException {
		VectorDefContext _localctx = new VectorDefContext(_ctx, getState());
		enterRule(_localctx, 14, RULE_vectorDef);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(208);
			match(VECTOR);
			setState(209);
			match(LR);
			setState(215);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,6,_ctx) ) {
			case 1:
				{
				setState(210);
				pointExpr();
				}
				break;
			case 2:
				{
				{
				setState(211);
				pointExpr();
				setState(212);
				match(COMMA);
				setState(213);
				pointExpr();
				}
				}
				break;
			}
			setState(217);
			match(RR);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class PolygonDefContext extends ParserRuleContext {
		public TerminalNode POLYGON() { return getToken(MathCommandParser.POLYGON, 0); }
		public TerminalNode LR() { return getToken(MathCommandParser.LR, 0); }
		public PointListContext pointList() {
			return getRuleContext(PointListContext.class,0);
		}
		public TerminalNode RR() { return getToken(MathCommandParser.RR, 0); }
		public PolygonDefContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_polygonDef; }
	}

	public final PolygonDefContext polygonDef() throws RecognitionException {
		PolygonDefContext _localctx = new PolygonDefContext(_ctx, getState());
		enterRule(_localctx, 16, RULE_polygonDef);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(219);
			match(POLYGON);
			setState(220);
			match(LR);
			setState(221);
			pointList();
			setState(222);
			match(RR);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class PointListContext extends ParserRuleContext {
		public PointExprContext pointExpr() {
			return getRuleContext(PointExprContext.class,0);
		}
		public TerminalNode COMMA() { return getToken(MathCommandParser.COMMA, 0); }
		public PointListContext pointList() {
			return getRuleContext(PointListContext.class,0);
		}
		public PointListContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_pointList; }
	}

	public final PointListContext pointList() throws RecognitionException {
		PointListContext _localctx = new PointListContext(_ctx, getState());
		enterRule(_localctx, 18, RULE_pointList);
		try {
			setState(229);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,7,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(224);
				pointExpr();
				setState(225);
				match(COMMA);
				setState(226);
				pointList();
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(228);
				pointExpr();
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class CircleDefContext extends ParserRuleContext {
		public TerminalNode CIRCLE() { return getToken(MathCommandParser.CIRCLE, 0); }
		public TerminalNode LR() { return getToken(MathCommandParser.LR, 0); }
		public TerminalNode RR() { return getToken(MathCommandParser.RR, 0); }
		public List<PointExprContext> pointExpr() {
			return getRuleContexts(PointExprContext.class);
		}
		public PointExprContext pointExpr(int i) {
			return getRuleContext(PointExprContext.class,i);
		}
		public List<TerminalNode> COMMA() { return getTokens(MathCommandParser.COMMA); }
		public TerminalNode COMMA(int i) {
			return getToken(MathCommandParser.COMMA, i);
		}
		public NumberExprContext numberExpr() {
			return getRuleContext(NumberExprContext.class,0);
		}
		public DirectionExprContext directionExpr() {
			return getRuleContext(DirectionExprContext.class,0);
		}
		public CircleDefContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_circleDef; }
	}

	public final CircleDefContext circleDef() throws RecognitionException {
		CircleDefContext _localctx = new CircleDefContext(_ctx, getState());
		enterRule(_localctx, 20, RULE_circleDef);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(231);
			match(CIRCLE);
			setState(232);
			match(LR);
			setState(259);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,8,_ctx) ) {
			case 1:
				{
				{
				setState(233);
				pointExpr();
				setState(234);
				match(COMMA);
				setState(235);
				numberExpr();
				}
				}
				break;
			case 2:
				{
				{
				setState(237);
				pointExpr();
				setState(238);
				match(COMMA);
				setState(239);
				pointExpr();
				}
				}
				break;
			case 3:
				{
				{
				setState(241);
				pointExpr();
				setState(242);
				match(COMMA);
				setState(243);
				pointExpr();
				setState(244);
				match(COMMA);
				setState(245);
				pointExpr();
				}
				}
				break;
			case 4:
				{
				{
				setState(247);
				pointExpr();
				setState(248);
				match(COMMA);
				setState(249);
				numberExpr();
				setState(250);
				match(COMMA);
				setState(251);
				directionExpr();
				}
				}
				break;
			case 5:
				{
				{
				setState(253);
				pointExpr();
				setState(254);
				match(COMMA);
				setState(255);
				pointExpr();
				setState(256);
				match(COMMA);
				setState(257);
				directionExpr();
				}
				}
				break;
			}
			setState(261);
			match(RR);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class SegmentDefContext extends ParserRuleContext {
		public TerminalNode SEGMENT() { return getToken(MathCommandParser.SEGMENT, 0); }
		public TerminalNode LR() { return getToken(MathCommandParser.LR, 0); }
		public TerminalNode RR() { return getToken(MathCommandParser.RR, 0); }
		public List<PointExprContext> pointExpr() {
			return getRuleContexts(PointExprContext.class);
		}
		public PointExprContext pointExpr(int i) {
			return getRuleContext(PointExprContext.class,i);
		}
		public TerminalNode COMMA() { return getToken(MathCommandParser.COMMA, 0); }
		public NumberExprContext numberExpr() {
			return getRuleContext(NumberExprContext.class,0);
		}
		public SegmentDefContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_segmentDef; }
	}

	public final SegmentDefContext segmentDef() throws RecognitionException {
		SegmentDefContext _localctx = new SegmentDefContext(_ctx, getState());
		enterRule(_localctx, 22, RULE_segmentDef);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(263);
			match(SEGMENT);
			setState(264);
			match(LR);
			{
			setState(265);
			pointExpr();
			setState(266);
			match(COMMA);
			setState(269);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,9,_ctx) ) {
			case 1:
				{
				setState(267);
				pointExpr();
				}
				break;
			case 2:
				{
				setState(268);
				numberExpr();
				}
				break;
			}
			}
			setState(271);
			match(RR);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class RayDefContext extends ParserRuleContext {
		public TerminalNode RAY() { return getToken(MathCommandParser.RAY, 0); }
		public TerminalNode LR() { return getToken(MathCommandParser.LR, 0); }
		public TerminalNode RR() { return getToken(MathCommandParser.RR, 0); }
		public List<PointExprContext> pointExpr() {
			return getRuleContexts(PointExprContext.class);
		}
		public PointExprContext pointExpr(int i) {
			return getRuleContext(PointExprContext.class,i);
		}
		public TerminalNode COMMA() { return getToken(MathCommandParser.COMMA, 0); }
		public VectorExprContext vectorExpr() {
			return getRuleContext(VectorExprContext.class,0);
		}
		public RayDefContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_rayDef; }
	}

	public final RayDefContext rayDef() throws RecognitionException {
		RayDefContext _localctx = new RayDefContext(_ctx, getState());
		enterRule(_localctx, 24, RULE_rayDef);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(273);
			match(RAY);
			setState(274);
			match(LR);
			{
			setState(275);
			pointExpr();
			setState(276);
			match(COMMA);
			setState(279);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case POINT:
			case POINT_ID:
			case LR:
				{
				setState(277);
				pointExpr();
				}
				break;
			case VECTOR:
			case SHAPE_ID:
				{
				setState(278);
				vectorExpr();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			}
			setState(281);
			match(RR);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class IntersectionDefContext extends ParserRuleContext {
		public TerminalNode INTERSECT() { return getToken(MathCommandParser.INTERSECT, 0); }
		public TerminalNode LR() { return getToken(MathCommandParser.LR, 0); }
		public TerminalNode RR() { return getToken(MathCommandParser.RR, 0); }
		public List<ExprContext> expr() {
			return getRuleContexts(ExprContext.class);
		}
		public ExprContext expr(int i) {
			return getRuleContext(ExprContext.class,i);
		}
		public TerminalNode COMMA() { return getToken(MathCommandParser.COMMA, 0); }
		public IntersectionDefContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_intersectionDef; }
	}

	public final IntersectionDefContext intersectionDef() throws RecognitionException {
		IntersectionDefContext _localctx = new IntersectionDefContext(_ctx, getState());
		enterRule(_localctx, 26, RULE_intersectionDef);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(283);
			match(INTERSECT);
			setState(284);
			match(LR);
			{
			setState(285);
			expr();
			setState(286);
			match(COMMA);
			setState(287);
			expr();
			}
			setState(289);
			match(RR);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class TransformDefContext extends ParserRuleContext {
		public TerminalNode TRANSLATE() { return getToken(MathCommandParser.TRANSLATE, 0); }
		public TerminalNode LR() { return getToken(MathCommandParser.LR, 0); }
		public TerminalNode RR() { return getToken(MathCommandParser.RR, 0); }
		public TerminalNode ROTATE() { return getToken(MathCommandParser.ROTATE, 0); }
		public TerminalNode PROJECT() { return getToken(MathCommandParser.PROJECT, 0); }
		public TerminalNode REFLECT() { return getToken(MathCommandParser.REFLECT, 0); }
		public TerminalNode ENLARGE() { return getToken(MathCommandParser.ENLARGE, 0); }
		public ShapeExprContext shapeExpr() {
			return getRuleContext(ShapeExprContext.class,0);
		}
		public List<TerminalNode> COMMA() { return getTokens(MathCommandParser.COMMA); }
		public TerminalNode COMMA(int i) {
			return getToken(MathCommandParser.COMMA, i);
		}
		public VectorExprContext vectorExpr() {
			return getRuleContext(VectorExprContext.class,0);
		}
		public NumberExprContext numberExpr() {
			return getRuleContext(NumberExprContext.class,0);
		}
		public PointExprContext pointExpr() {
			return getRuleContext(PointExprContext.class,0);
		}
		public PlaneExprContext planeExpr() {
			return getRuleContext(PlaneExprContext.class,0);
		}
		public LineExprContext lineExpr() {
			return getRuleContext(LineExprContext.class,0);
		}
		public DirectionExprContext directionExpr() {
			return getRuleContext(DirectionExprContext.class,0);
		}
		public TransformDefContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_transformDef; }
	}

	public final TransformDefContext transformDef() throws RecognitionException {
		TransformDefContext _localctx = new TransformDefContext(_ctx, getState());
		enterRule(_localctx, 28, RULE_transformDef);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(346);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case TRANSLATE:
				{
				{
				setState(291);
				match(TRANSLATE);
				setState(292);
				match(LR);
				{
				setState(293);
				shapeExpr();
				setState(294);
				match(COMMA);
				setState(295);
				vectorExpr();
				}
				setState(297);
				match(RR);
				}
				}
				break;
			case ROTATE:
				{
				{
				setState(299);
				match(ROTATE);
				setState(300);
				match(LR);
				{
				setState(301);
				shapeExpr();
				setState(302);
				match(COMMA);
				setState(303);
				numberExpr();
				setState(313);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,11,_ctx) ) {
				case 1:
					{
					{
					setState(304);
					match(COMMA);
					setState(305);
					pointExpr();
					}
					}
					break;
				case 2:
					{
					{
					setState(306);
					match(COMMA);
					setState(307);
					directionExpr();
					}
					}
					break;
				case 3:
					{
					{
					setState(308);
					match(COMMA);
					setState(309);
					pointExpr();
					setState(310);
					match(COMMA);
					setState(311);
					directionExpr();
					}
					}
					break;
				}
				}
				setState(315);
				match(RR);
				}
				}
				break;
			case PROJECT:
				{
				{
				setState(317);
				match(PROJECT);
				setState(318);
				match(LR);
				{
				setState(319);
				pointExpr();
				setState(320);
				match(COMMA);
				setState(321);
				planeExpr();
				}
				setState(323);
				match(RR);
				}
				}
				break;
			case REFLECT:
				{
				{
				setState(325);
				match(REFLECT);
				setState(326);
				match(LR);
				{
				setState(327);
				shapeExpr();
				setState(328);
				match(COMMA);
				setState(332);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,12,_ctx) ) {
				case 1:
					{
					setState(329);
					planeExpr();
					}
					break;
				case 2:
					{
					setState(330);
					lineExpr();
					}
					break;
				case 3:
					{
					setState(331);
					pointExpr();
					}
					break;
				}
				}
				setState(334);
				match(RR);
				}
				}
				break;
			case ENLARGE:
				{
				{
				setState(336);
				match(ENLARGE);
				setState(337);
				match(LR);
				{
				setState(338);
				shapeExpr();
				setState(339);
				match(COMMA);
				setState(340);
				numberExpr();
				setState(341);
				match(COMMA);
				setState(342);
				pointExpr();
				}
				setState(344);
				match(RR);
				}
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class CylinderDefContext extends ParserRuleContext {
		public TerminalNode CYLINDER() { return getToken(MathCommandParser.CYLINDER, 0); }
		public TerminalNode LR() { return getToken(MathCommandParser.LR, 0); }
		public TerminalNode RR() { return getToken(MathCommandParser.RR, 0); }
		public List<PointExprContext> pointExpr() {
			return getRuleContexts(PointExprContext.class);
		}
		public PointExprContext pointExpr(int i) {
			return getRuleContext(PointExprContext.class,i);
		}
		public List<TerminalNode> COMMA() { return getTokens(MathCommandParser.COMMA); }
		public TerminalNode COMMA(int i) {
			return getToken(MathCommandParser.COMMA, i);
		}
		public NumberExprContext numberExpr() {
			return getRuleContext(NumberExprContext.class,0);
		}
		public CylinderDefContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_cylinderDef; }
	}

	public final CylinderDefContext cylinderDef() throws RecognitionException {
		CylinderDefContext _localctx = new CylinderDefContext(_ctx, getState());
		enterRule(_localctx, 30, RULE_cylinderDef);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(348);
			match(CYLINDER);
			setState(349);
			match(LR);
			{
			setState(350);
			pointExpr();
			setState(351);
			match(COMMA);
			setState(352);
			pointExpr();
			setState(353);
			match(COMMA);
			setState(354);
			numberExpr();
			}
			setState(356);
			match(RR);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class TetrahedronDefContext extends ParserRuleContext {
		public TerminalNode TETRAHEDRON() { return getToken(MathCommandParser.TETRAHEDRON, 0); }
		public TerminalNode LR() { return getToken(MathCommandParser.LR, 0); }
		public TerminalNode RR() { return getToken(MathCommandParser.RR, 0); }
		public List<TerminalNode> COMMA() { return getTokens(MathCommandParser.COMMA); }
		public TerminalNode COMMA(int i) {
			return getToken(MathCommandParser.COMMA, i);
		}
		public List<PointExprContext> pointExpr() {
			return getRuleContexts(PointExprContext.class);
		}
		public PointExprContext pointExpr(int i) {
			return getRuleContext(PointExprContext.class,i);
		}
		public PolygonExprContext polygonExpr() {
			return getRuleContext(PolygonExprContext.class,0);
		}
		public TetrahedronDefContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_tetrahedronDef; }
	}

	public final TetrahedronDefContext tetrahedronDef() throws RecognitionException {
		TetrahedronDefContext _localctx = new TetrahedronDefContext(_ctx, getState());
		enterRule(_localctx, 32, RULE_tetrahedronDef);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(358);
			match(TETRAHEDRON);
			setState(359);
			match(LR);
			{
			setState(367);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case POLYGON:
			case SHAPE_ID:
				{
				setState(360);
				polygonExpr();
				}
				break;
			case POINT:
			case POINT_ID:
			case LR:
				{
				{
				setState(361);
				pointExpr();
				setState(362);
				match(COMMA);
				setState(363);
				pointExpr();
				setState(364);
				match(COMMA);
				setState(365);
				pointExpr();
				}
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			setState(369);
			match(COMMA);
			setState(370);
			pointExpr();
			}
			setState(372);
			match(RR);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ConeDefContext extends ParserRuleContext {
		public TerminalNode CONE() { return getToken(MathCommandParser.CONE, 0); }
		public TerminalNode LR() { return getToken(MathCommandParser.LR, 0); }
		public TerminalNode RR() { return getToken(MathCommandParser.RR, 0); }
		public List<PointExprContext> pointExpr() {
			return getRuleContexts(PointExprContext.class);
		}
		public PointExprContext pointExpr(int i) {
			return getRuleContext(PointExprContext.class,i);
		}
		public List<TerminalNode> COMMA() { return getTokens(MathCommandParser.COMMA); }
		public TerminalNode COMMA(int i) {
			return getToken(MathCommandParser.COMMA, i);
		}
		public NumberExprContext numberExpr() {
			return getRuleContext(NumberExprContext.class,0);
		}
		public ConeDefContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_coneDef; }
	}

	public final ConeDefContext coneDef() throws RecognitionException {
		ConeDefContext _localctx = new ConeDefContext(_ctx, getState());
		enterRule(_localctx, 34, RULE_coneDef);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(374);
			match(CONE);
			setState(375);
			match(LR);
			{
			setState(376);
			pointExpr();
			setState(377);
			match(COMMA);
			setState(378);
			numberExpr();
			setState(379);
			match(COMMA);
			setState(380);
			pointExpr();
			}
			setState(382);
			match(RR);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class PrismDefContext extends ParserRuleContext {
		public TerminalNode PRISM() { return getToken(MathCommandParser.PRISM, 0); }
		public TerminalNode LR() { return getToken(MathCommandParser.LR, 0); }
		public TerminalNode RR() { return getToken(MathCommandParser.RR, 0); }
		public PolygonExprContext polygonExpr() {
			return getRuleContext(PolygonExprContext.class,0);
		}
		public TerminalNode COMMA() { return getToken(MathCommandParser.COMMA, 0); }
		public DirectionExprContext directionExpr() {
			return getRuleContext(DirectionExprContext.class,0);
		}
		public PrismDefContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_prismDef; }
	}

	public final PrismDefContext prismDef() throws RecognitionException {
		PrismDefContext _localctx = new PrismDefContext(_ctx, getState());
		enterRule(_localctx, 36, RULE_prismDef);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(384);
			match(PRISM);
			setState(385);
			match(LR);
			{
			setState(386);
			polygonExpr();
			setState(387);
			match(COMMA);
			setState(388);
			directionExpr();
			}
			setState(390);
			match(RR);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class PyramidDefContext extends ParserRuleContext {
		public TerminalNode PYRAMID() { return getToken(MathCommandParser.PYRAMID, 0); }
		public TerminalNode LR() { return getToken(MathCommandParser.LR, 0); }
		public TerminalNode RR() { return getToken(MathCommandParser.RR, 0); }
		public PolygonExprContext polygonExpr() {
			return getRuleContext(PolygonExprContext.class,0);
		}
		public TerminalNode COMMA() { return getToken(MathCommandParser.COMMA, 0); }
		public PointExprContext pointExpr() {
			return getRuleContext(PointExprContext.class,0);
		}
		public PyramidDefContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_pyramidDef; }
	}

	public final PyramidDefContext pyramidDef() throws RecognitionException {
		PyramidDefContext _localctx = new PyramidDefContext(_ctx, getState());
		enterRule(_localctx, 38, RULE_pyramidDef);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(392);
			match(PYRAMID);
			setState(393);
			match(LR);
			{
			setState(394);
			polygonExpr();
			setState(395);
			match(COMMA);
			setState(396);
			pointExpr();
			}
			setState(398);
			match(RR);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class NumberExprContext extends ParserRuleContext {
		public AdditiveExprContext additiveExpr() {
			return getRuleContext(AdditiveExprContext.class,0);
		}
		public NumberExprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_numberExpr; }
	}

	public final NumberExprContext numberExpr() throws RecognitionException {
		NumberExprContext _localctx = new NumberExprContext(_ctx, getState());
		enterRule(_localctx, 40, RULE_numberExpr);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(400);
			additiveExpr(0);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class AdditiveExprContext extends ParserRuleContext {
		public MultiplicativeExprContext multiplicativeExpr() {
			return getRuleContext(MultiplicativeExprContext.class,0);
		}
		public AdditiveExprContext additiveExpr() {
			return getRuleContext(AdditiveExprContext.class,0);
		}
		public TerminalNode ADD() { return getToken(MathCommandParser.ADD, 0); }
		public TerminalNode SUB() { return getToken(MathCommandParser.SUB, 0); }
		public AdditiveExprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_additiveExpr; }
	}

	public final AdditiveExprContext additiveExpr() throws RecognitionException {
		return additiveExpr(0);
	}

	private AdditiveExprContext additiveExpr(int _p) throws RecognitionException {
		ParserRuleContext _parentctx = _ctx;
		int _parentState = getState();
		AdditiveExprContext _localctx = new AdditiveExprContext(_ctx, _parentState);
		AdditiveExprContext _prevctx = _localctx;
		int _startState = 42;
		enterRecursionRule(_localctx, 42, RULE_additiveExpr, _p);
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			{
			setState(403);
			multiplicativeExpr(0);
			}
			_ctx.stop = _input.LT(-1);
			setState(413);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,16,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					if ( _parseListeners!=null ) triggerExitRuleEvent();
					_prevctx = _localctx;
					{
					setState(411);
					_errHandler.sync(this);
					switch ( getInterpreter().adaptivePredict(_input,15,_ctx) ) {
					case 1:
						{
						_localctx = new AdditiveExprContext(_parentctx, _parentState);
						pushNewRecursionContext(_localctx, _startState, RULE_additiveExpr);
						setState(405);
						if (!(precpred(_ctx, 3))) throw new FailedPredicateException(this, "precpred(_ctx, 3)");
						setState(406);
						match(ADD);
						setState(407);
						multiplicativeExpr(0);
						}
						break;
					case 2:
						{
						_localctx = new AdditiveExprContext(_parentctx, _parentState);
						pushNewRecursionContext(_localctx, _startState, RULE_additiveExpr);
						setState(408);
						if (!(precpred(_ctx, 2))) throw new FailedPredicateException(this, "precpred(_ctx, 2)");
						setState(409);
						match(SUB);
						setState(410);
						multiplicativeExpr(0);
						}
						break;
					}
					} 
				}
				setState(415);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,16,_ctx);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			unrollRecursionContexts(_parentctx);
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class MultiplicativeExprContext extends ParserRuleContext {
		public ImplicitMultiplicativeExprContext implicitMultiplicativeExpr() {
			return getRuleContext(ImplicitMultiplicativeExprContext.class,0);
		}
		public ExponentialExprContext exponentialExpr() {
			return getRuleContext(ExponentialExprContext.class,0);
		}
		public MultiplicativeExprContext multiplicativeExpr() {
			return getRuleContext(MultiplicativeExprContext.class,0);
		}
		public TerminalNode MULTIPLY() { return getToken(MathCommandParser.MULTIPLY, 0); }
		public TerminalNode DIVIDE() { return getToken(MathCommandParser.DIVIDE, 0); }
		public MultiplicativeExprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_multiplicativeExpr; }
	}

	public final MultiplicativeExprContext multiplicativeExpr() throws RecognitionException {
		return multiplicativeExpr(0);
	}

	private MultiplicativeExprContext multiplicativeExpr(int _p) throws RecognitionException {
		ParserRuleContext _parentctx = _ctx;
		int _parentState = getState();
		MultiplicativeExprContext _localctx = new MultiplicativeExprContext(_ctx, _parentState);
		MultiplicativeExprContext _prevctx = _localctx;
		int _startState = 44;
		enterRecursionRule(_localctx, 44, RULE_multiplicativeExpr, _p);
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(419);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,17,_ctx) ) {
			case 1:
				{
				setState(417);
				implicitMultiplicativeExpr();
				}
				break;
			case 2:
				{
				setState(418);
				exponentialExpr();
				}
				break;
			}
			_ctx.stop = _input.LT(-1);
			setState(429);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,19,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					if ( _parseListeners!=null ) triggerExitRuleEvent();
					_prevctx = _localctx;
					{
					setState(427);
					_errHandler.sync(this);
					switch ( getInterpreter().adaptivePredict(_input,18,_ctx) ) {
					case 1:
						{
						_localctx = new MultiplicativeExprContext(_parentctx, _parentState);
						pushNewRecursionContext(_localctx, _startState, RULE_multiplicativeExpr);
						setState(421);
						if (!(precpred(_ctx, 4))) throw new FailedPredicateException(this, "precpred(_ctx, 4)");
						setState(422);
						match(MULTIPLY);
						setState(423);
						exponentialExpr();
						}
						break;
					case 2:
						{
						_localctx = new MultiplicativeExprContext(_parentctx, _parentState);
						pushNewRecursionContext(_localctx, _startState, RULE_multiplicativeExpr);
						setState(424);
						if (!(precpred(_ctx, 3))) throw new FailedPredicateException(this, "precpred(_ctx, 3)");
						setState(425);
						match(DIVIDE);
						setState(426);
						exponentialExpr();
						}
						break;
					}
					} 
				}
				setState(431);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,19,_ctx);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			unrollRecursionContexts(_parentctx);
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ImplicitMultiplicativeExprContext extends ParserRuleContext {
		public List<PrimaryExprContext> primaryExpr() {
			return getRuleContexts(PrimaryExprContext.class);
		}
		public PrimaryExprContext primaryExpr(int i) {
			return getRuleContext(PrimaryExprContext.class,i);
		}
		public ImplicitMultiplicativeExprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_implicitMultiplicativeExpr; }
	}

	public final ImplicitMultiplicativeExprContext implicitMultiplicativeExpr() throws RecognitionException {
		ImplicitMultiplicativeExprContext _localctx = new ImplicitMultiplicativeExprContext(_ctx, getState());
		enterRule(_localctx, 46, RULE_implicitMultiplicativeExpr);
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(432);
			primaryExpr();
			setState(434); 
			_errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					setState(433);
					primaryExpr();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				setState(436); 
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,20,_ctx);
			} while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER );
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ExponentialExprContext extends ParserRuleContext {
		public UnaryExprContext unaryExpr() {
			return getRuleContext(UnaryExprContext.class,0);
		}
		public TerminalNode POWER() { return getToken(MathCommandParser.POWER, 0); }
		public ExponentialExprContext exponentialExpr() {
			return getRuleContext(ExponentialExprContext.class,0);
		}
		public ExponentialExprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_exponentialExpr; }
	}

	public final ExponentialExprContext exponentialExpr() throws RecognitionException {
		ExponentialExprContext _localctx = new ExponentialExprContext(_ctx, getState());
		enterRule(_localctx, 48, RULE_exponentialExpr);
		try {
			setState(443);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,21,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(438);
				unaryExpr();
				setState(439);
				match(POWER);
				setState(440);
				exponentialExpr();
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(442);
				unaryExpr();
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class UnaryExprContext extends ParserRuleContext {
		public TerminalNode SUB() { return getToken(MathCommandParser.SUB, 0); }
		public UnaryExprContext unaryExpr() {
			return getRuleContext(UnaryExprContext.class,0);
		}
		public TerminalNode ADD() { return getToken(MathCommandParser.ADD, 0); }
		public PrimaryExprContext primaryExpr() {
			return getRuleContext(PrimaryExprContext.class,0);
		}
		public UnaryExprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_unaryExpr; }
	}

	public final UnaryExprContext unaryExpr() throws RecognitionException {
		UnaryExprContext _localctx = new UnaryExprContext(_ctx, getState());
		enterRule(_localctx, 50, RULE_unaryExpr);
		try {
			setState(450);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case SUB:
				enterOuterAlt(_localctx, 1);
				{
				setState(445);
				match(SUB);
				setState(446);
				unaryExpr();
				}
				break;
			case ADD:
				enterOuterAlt(_localctx, 2);
				{
				setState(447);
				match(ADD);
				setState(448);
				unaryExpr();
				}
				break;
			case SIN:
			case COS:
			case TAN:
			case COT:
			case LOG:
			case LN:
			case EXP:
			case SQRT:
			case CBRT:
			case ABS:
			case PI:
			case E:
			case LR:
			case INT_LIT:
			case FLOAT_LIT:
				enterOuterAlt(_localctx, 3);
				{
				setState(449);
				primaryExpr();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class PrimaryExprContext extends ParserRuleContext {
		public TerminalNode INT_LIT() { return getToken(MathCommandParser.INT_LIT, 0); }
		public TerminalNode FLOAT_LIT() { return getToken(MathCommandParser.FLOAT_LIT, 0); }
		public TerminalNode PI() { return getToken(MathCommandParser.PI, 0); }
		public TerminalNode E() { return getToken(MathCommandParser.E, 0); }
		public TerminalNode LR() { return getToken(MathCommandParser.LR, 0); }
		public NumberExprContext numberExpr() {
			return getRuleContext(NumberExprContext.class,0);
		}
		public TerminalNode RR() { return getToken(MathCommandParser.RR, 0); }
		public SinExprContext sinExpr() {
			return getRuleContext(SinExprContext.class,0);
		}
		public CosExprContext cosExpr() {
			return getRuleContext(CosExprContext.class,0);
		}
		public TanExprContext tanExpr() {
			return getRuleContext(TanExprContext.class,0);
		}
		public CotExprContext cotExpr() {
			return getRuleContext(CotExprContext.class,0);
		}
		public LogExprContext logExpr() {
			return getRuleContext(LogExprContext.class,0);
		}
		public LnExprContext lnExpr() {
			return getRuleContext(LnExprContext.class,0);
		}
		public ExpExprContext expExpr() {
			return getRuleContext(ExpExprContext.class,0);
		}
		public AbsExprContext absExpr() {
			return getRuleContext(AbsExprContext.class,0);
		}
		public SqrtExprContext sqrtExpr() {
			return getRuleContext(SqrtExprContext.class,0);
		}
		public CbrtExprContext cbrtExpr() {
			return getRuleContext(CbrtExprContext.class,0);
		}
		public PrimaryExprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_primaryExpr; }
	}

	public final PrimaryExprContext primaryExpr() throws RecognitionException {
		PrimaryExprContext _localctx = new PrimaryExprContext(_ctx, getState());
		enterRule(_localctx, 52, RULE_primaryExpr);
		try {
			setState(470);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case INT_LIT:
				enterOuterAlt(_localctx, 1);
				{
				setState(452);
				match(INT_LIT);
				}
				break;
			case FLOAT_LIT:
				enterOuterAlt(_localctx, 2);
				{
				setState(453);
				match(FLOAT_LIT);
				}
				break;
			case PI:
				enterOuterAlt(_localctx, 3);
				{
				setState(454);
				match(PI);
				}
				break;
			case E:
				enterOuterAlt(_localctx, 4);
				{
				setState(455);
				match(E);
				}
				break;
			case LR:
				enterOuterAlt(_localctx, 5);
				{
				setState(456);
				match(LR);
				setState(457);
				numberExpr();
				setState(458);
				match(RR);
				}
				break;
			case SIN:
				enterOuterAlt(_localctx, 6);
				{
				setState(460);
				sinExpr();
				}
				break;
			case COS:
				enterOuterAlt(_localctx, 7);
				{
				setState(461);
				cosExpr();
				}
				break;
			case TAN:
				enterOuterAlt(_localctx, 8);
				{
				setState(462);
				tanExpr();
				}
				break;
			case COT:
				enterOuterAlt(_localctx, 9);
				{
				setState(463);
				cotExpr();
				}
				break;
			case LOG:
				enterOuterAlt(_localctx, 10);
				{
				setState(464);
				logExpr();
				}
				break;
			case LN:
				enterOuterAlt(_localctx, 11);
				{
				setState(465);
				lnExpr();
				}
				break;
			case EXP:
				enterOuterAlt(_localctx, 12);
				{
				setState(466);
				expExpr();
				}
				break;
			case ABS:
				enterOuterAlt(_localctx, 13);
				{
				setState(467);
				absExpr();
				}
				break;
			case SQRT:
				enterOuterAlt(_localctx, 14);
				{
				setState(468);
				sqrtExpr();
				}
				break;
			case CBRT:
				enterOuterAlt(_localctx, 15);
				{
				setState(469);
				cbrtExpr();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class SinExprContext extends ParserRuleContext {
		public TerminalNode SIN() { return getToken(MathCommandParser.SIN, 0); }
		public TerminalNode LR() { return getToken(MathCommandParser.LR, 0); }
		public NumberExprContext numberExpr() {
			return getRuleContext(NumberExprContext.class,0);
		}
		public TerminalNode RR() { return getToken(MathCommandParser.RR, 0); }
		public SinExprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_sinExpr; }
	}

	public final SinExprContext sinExpr() throws RecognitionException {
		SinExprContext _localctx = new SinExprContext(_ctx, getState());
		enterRule(_localctx, 54, RULE_sinExpr);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(472);
			match(SIN);
			setState(473);
			match(LR);
			setState(474);
			numberExpr();
			setState(475);
			match(RR);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class CosExprContext extends ParserRuleContext {
		public TerminalNode COS() { return getToken(MathCommandParser.COS, 0); }
		public TerminalNode LR() { return getToken(MathCommandParser.LR, 0); }
		public NumberExprContext numberExpr() {
			return getRuleContext(NumberExprContext.class,0);
		}
		public TerminalNode RR() { return getToken(MathCommandParser.RR, 0); }
		public CosExprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_cosExpr; }
	}

	public final CosExprContext cosExpr() throws RecognitionException {
		CosExprContext _localctx = new CosExprContext(_ctx, getState());
		enterRule(_localctx, 56, RULE_cosExpr);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(477);
			match(COS);
			setState(478);
			match(LR);
			setState(479);
			numberExpr();
			setState(480);
			match(RR);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class TanExprContext extends ParserRuleContext {
		public TerminalNode TAN() { return getToken(MathCommandParser.TAN, 0); }
		public TerminalNode LR() { return getToken(MathCommandParser.LR, 0); }
		public NumberExprContext numberExpr() {
			return getRuleContext(NumberExprContext.class,0);
		}
		public TerminalNode RR() { return getToken(MathCommandParser.RR, 0); }
		public TanExprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_tanExpr; }
	}

	public final TanExprContext tanExpr() throws RecognitionException {
		TanExprContext _localctx = new TanExprContext(_ctx, getState());
		enterRule(_localctx, 58, RULE_tanExpr);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(482);
			match(TAN);
			setState(483);
			match(LR);
			setState(484);
			numberExpr();
			setState(485);
			match(RR);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class CotExprContext extends ParserRuleContext {
		public TerminalNode COT() { return getToken(MathCommandParser.COT, 0); }
		public TerminalNode LR() { return getToken(MathCommandParser.LR, 0); }
		public NumberExprContext numberExpr() {
			return getRuleContext(NumberExprContext.class,0);
		}
		public TerminalNode RR() { return getToken(MathCommandParser.RR, 0); }
		public CotExprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_cotExpr; }
	}

	public final CotExprContext cotExpr() throws RecognitionException {
		CotExprContext _localctx = new CotExprContext(_ctx, getState());
		enterRule(_localctx, 60, RULE_cotExpr);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(487);
			match(COT);
			setState(488);
			match(LR);
			setState(489);
			numberExpr();
			setState(490);
			match(RR);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class LogExprContext extends ParserRuleContext {
		public TerminalNode LOG() { return getToken(MathCommandParser.LOG, 0); }
		public TerminalNode LR() { return getToken(MathCommandParser.LR, 0); }
		public TerminalNode RR() { return getToken(MathCommandParser.RR, 0); }
		public List<NumberExprContext> numberExpr() {
			return getRuleContexts(NumberExprContext.class);
		}
		public NumberExprContext numberExpr(int i) {
			return getRuleContext(NumberExprContext.class,i);
		}
		public TerminalNode COMMA() { return getToken(MathCommandParser.COMMA, 0); }
		public LogExprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_logExpr; }
	}

	public final LogExprContext logExpr() throws RecognitionException {
		LogExprContext _localctx = new LogExprContext(_ctx, getState());
		enterRule(_localctx, 62, RULE_logExpr);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(492);
			match(LOG);
			setState(493);
			match(LR);
			{
			setState(494);
			numberExpr();
			setState(495);
			match(COMMA);
			setState(496);
			numberExpr();
			}
			setState(498);
			match(RR);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class LnExprContext extends ParserRuleContext {
		public TerminalNode LN() { return getToken(MathCommandParser.LN, 0); }
		public TerminalNode LR() { return getToken(MathCommandParser.LR, 0); }
		public NumberExprContext numberExpr() {
			return getRuleContext(NumberExprContext.class,0);
		}
		public TerminalNode RR() { return getToken(MathCommandParser.RR, 0); }
		public LnExprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_lnExpr; }
	}

	public final LnExprContext lnExpr() throws RecognitionException {
		LnExprContext _localctx = new LnExprContext(_ctx, getState());
		enterRule(_localctx, 64, RULE_lnExpr);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(500);
			match(LN);
			setState(501);
			match(LR);
			setState(502);
			numberExpr();
			setState(503);
			match(RR);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class CbrtExprContext extends ParserRuleContext {
		public TerminalNode CBRT() { return getToken(MathCommandParser.CBRT, 0); }
		public TerminalNode LR() { return getToken(MathCommandParser.LR, 0); }
		public NumberExprContext numberExpr() {
			return getRuleContext(NumberExprContext.class,0);
		}
		public TerminalNode RR() { return getToken(MathCommandParser.RR, 0); }
		public CbrtExprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_cbrtExpr; }
	}

	public final CbrtExprContext cbrtExpr() throws RecognitionException {
		CbrtExprContext _localctx = new CbrtExprContext(_ctx, getState());
		enterRule(_localctx, 66, RULE_cbrtExpr);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(505);
			match(CBRT);
			setState(506);
			match(LR);
			setState(507);
			numberExpr();
			setState(508);
			match(RR);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class SqrtExprContext extends ParserRuleContext {
		public TerminalNode SQRT() { return getToken(MathCommandParser.SQRT, 0); }
		public TerminalNode LR() { return getToken(MathCommandParser.LR, 0); }
		public NumberExprContext numberExpr() {
			return getRuleContext(NumberExprContext.class,0);
		}
		public TerminalNode RR() { return getToken(MathCommandParser.RR, 0); }
		public SqrtExprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_sqrtExpr; }
	}

	public final SqrtExprContext sqrtExpr() throws RecognitionException {
		SqrtExprContext _localctx = new SqrtExprContext(_ctx, getState());
		enterRule(_localctx, 68, RULE_sqrtExpr);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(510);
			match(SQRT);
			setState(511);
			match(LR);
			setState(512);
			numberExpr();
			setState(513);
			match(RR);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class AbsExprContext extends ParserRuleContext {
		public TerminalNode ABS() { return getToken(MathCommandParser.ABS, 0); }
		public TerminalNode LR() { return getToken(MathCommandParser.LR, 0); }
		public NumberExprContext numberExpr() {
			return getRuleContext(NumberExprContext.class,0);
		}
		public TerminalNode RR() { return getToken(MathCommandParser.RR, 0); }
		public AbsExprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_absExpr; }
	}

	public final AbsExprContext absExpr() throws RecognitionException {
		AbsExprContext _localctx = new AbsExprContext(_ctx, getState());
		enterRule(_localctx, 70, RULE_absExpr);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(515);
			match(ABS);
			setState(516);
			match(LR);
			setState(517);
			numberExpr();
			setState(518);
			match(RR);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ExpExprContext extends ParserRuleContext {
		public TerminalNode EXP() { return getToken(MathCommandParser.EXP, 0); }
		public TerminalNode LR() { return getToken(MathCommandParser.LR, 0); }
		public NumberExprContext numberExpr() {
			return getRuleContext(NumberExprContext.class,0);
		}
		public TerminalNode RR() { return getToken(MathCommandParser.RR, 0); }
		public ExpExprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_expExpr; }
	}

	public final ExpExprContext expExpr() throws RecognitionException {
		ExpExprContext _localctx = new ExpExprContext(_ctx, getState());
		enterRule(_localctx, 72, RULE_expExpr);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(520);
			match(EXP);
			setState(521);
			match(LR);
			setState(522);
			numberExpr();
			setState(523);
			match(RR);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class PointExprContext extends ParserRuleContext {
		public TerminalNode POINT_ID() { return getToken(MathCommandParser.POINT_ID, 0); }
		public PointDefContext pointDef() {
			return getRuleContext(PointDefContext.class,0);
		}
		public PointExprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_pointExpr; }
	}

	public final PointExprContext pointExpr() throws RecognitionException {
		PointExprContext _localctx = new PointExprContext(_ctx, getState());
		enterRule(_localctx, 74, RULE_pointExpr);
		try {
			setState(527);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case POINT_ID:
				enterOuterAlt(_localctx, 1);
				{
				setState(525);
				match(POINT_ID);
				}
				break;
			case POINT:
			case LR:
				enterOuterAlt(_localctx, 2);
				{
				setState(526);
				pointDef();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class LineExprContext extends ParserRuleContext {
		public LineDefContext lineDef() {
			return getRuleContext(LineDefContext.class,0);
		}
		public TerminalNode SHAPE_ID() { return getToken(MathCommandParser.SHAPE_ID, 0); }
		public LineExprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_lineExpr; }
	}

	public final LineExprContext lineExpr() throws RecognitionException {
		LineExprContext _localctx = new LineExprContext(_ctx, getState());
		enterRule(_localctx, 76, RULE_lineExpr);
		try {
			setState(531);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case LINE:
				enterOuterAlt(_localctx, 1);
				{
				setState(529);
				lineDef();
				}
				break;
			case SHAPE_ID:
				enterOuterAlt(_localctx, 2);
				{
				setState(530);
				match(SHAPE_ID);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class DirExprContext extends ParserRuleContext {
		public PointExprContext pointExpr() {
			return getRuleContext(PointExprContext.class,0);
		}
		public VectorExprContext vectorExpr() {
			return getRuleContext(VectorExprContext.class,0);
		}
		public TerminalNode LR() { return getToken(MathCommandParser.LR, 0); }
		public TerminalNode RR() { return getToken(MathCommandParser.RR, 0); }
		public List<NumberExprContext> numberExpr() {
			return getRuleContexts(NumberExprContext.class);
		}
		public NumberExprContext numberExpr(int i) {
			return getRuleContext(NumberExprContext.class,i);
		}
		public List<TerminalNode> COMMA() { return getTokens(MathCommandParser.COMMA); }
		public TerminalNode COMMA(int i) {
			return getToken(MathCommandParser.COMMA, i);
		}
		public DirExprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_dirExpr; }
	}

	public final DirExprContext dirExpr() throws RecognitionException {
		DirExprContext _localctx = new DirExprContext(_ctx, getState());
		enterRule(_localctx, 78, RULE_dirExpr);
		try {
			setState(544);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,26,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(533);
				pointExpr();
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(534);
				vectorExpr();
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				setState(535);
				match(LR);
				{
				setState(536);
				numberExpr();
				setState(537);
				match(COMMA);
				setState(538);
				numberExpr();
				setState(539);
				match(COMMA);
				setState(540);
				numberExpr();
				}
				setState(542);
				match(RR);
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class VectorExprContext extends ParserRuleContext {
		public VectorDefContext vectorDef() {
			return getRuleContext(VectorDefContext.class,0);
		}
		public TerminalNode SHAPE_ID() { return getToken(MathCommandParser.SHAPE_ID, 0); }
		public VectorExprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_vectorExpr; }
	}

	public final VectorExprContext vectorExpr() throws RecognitionException {
		VectorExprContext _localctx = new VectorExprContext(_ctx, getState());
		enterRule(_localctx, 80, RULE_vectorExpr);
		try {
			setState(548);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case VECTOR:
				enterOuterAlt(_localctx, 1);
				{
				setState(546);
				vectorDef();
				}
				break;
			case SHAPE_ID:
				enterOuterAlt(_localctx, 2);
				{
				setState(547);
				match(SHAPE_ID);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class PlaneExprContext extends ParserRuleContext {
		public PlaneDefContext planeDef() {
			return getRuleContext(PlaneDefContext.class,0);
		}
		public TerminalNode SHAPE_ID() { return getToken(MathCommandParser.SHAPE_ID, 0); }
		public PlaneExprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_planeExpr; }
	}

	public final PlaneExprContext planeExpr() throws RecognitionException {
		PlaneExprContext _localctx = new PlaneExprContext(_ctx, getState());
		enterRule(_localctx, 82, RULE_planeExpr);
		try {
			setState(552);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case PLANE:
				enterOuterAlt(_localctx, 1);
				{
				setState(550);
				planeDef();
				}
				break;
			case SHAPE_ID:
				enterOuterAlt(_localctx, 2);
				{
				setState(551);
				match(SHAPE_ID);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class DirectionExprContext extends ParserRuleContext {
		public TerminalNode SHAPE_ID() { return getToken(MathCommandParser.SHAPE_ID, 0); }
		public VectorExprContext vectorExpr() {
			return getRuleContext(VectorExprContext.class,0);
		}
		public LineExprContext lineExpr() {
			return getRuleContext(LineExprContext.class,0);
		}
		public SegmentExprContext segmentExpr() {
			return getRuleContext(SegmentExprContext.class,0);
		}
		public RayExprContext rayExpr() {
			return getRuleContext(RayExprContext.class,0);
		}
		public PlaneExprContext planeExpr() {
			return getRuleContext(PlaneExprContext.class,0);
		}
		public DirectionExprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_directionExpr; }
	}

	public final DirectionExprContext directionExpr() throws RecognitionException {
		DirectionExprContext _localctx = new DirectionExprContext(_ctx, getState());
		enterRule(_localctx, 84, RULE_directionExpr);
		try {
			setState(560);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,29,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(554);
				match(SHAPE_ID);
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(555);
				vectorExpr();
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				setState(556);
				lineExpr();
				}
				break;
			case 4:
				enterOuterAlt(_localctx, 4);
				{
				setState(557);
				segmentExpr();
				}
				break;
			case 5:
				enterOuterAlt(_localctx, 5);
				{
				setState(558);
				rayExpr();
				}
				break;
			case 6:
				enterOuterAlt(_localctx, 6);
				{
				setState(559);
				planeExpr();
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class PolygonExprContext extends ParserRuleContext {
		public TerminalNode SHAPE_ID() { return getToken(MathCommandParser.SHAPE_ID, 0); }
		public PolygonDefContext polygonDef() {
			return getRuleContext(PolygonDefContext.class,0);
		}
		public PolygonExprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_polygonExpr; }
	}

	public final PolygonExprContext polygonExpr() throws RecognitionException {
		PolygonExprContext _localctx = new PolygonExprContext(_ctx, getState());
		enterRule(_localctx, 86, RULE_polygonExpr);
		try {
			setState(564);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case SHAPE_ID:
				enterOuterAlt(_localctx, 1);
				{
				setState(562);
				match(SHAPE_ID);
				}
				break;
			case POLYGON:
				enterOuterAlt(_localctx, 2);
				{
				setState(563);
				polygonDef();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class TetrahedronExprContext extends ParserRuleContext {
		public TerminalNode SHAPE_ID() { return getToken(MathCommandParser.SHAPE_ID, 0); }
		public TetrahedronDefContext tetrahedronDef() {
			return getRuleContext(TetrahedronDefContext.class,0);
		}
		public TetrahedronExprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_tetrahedronExpr; }
	}

	public final TetrahedronExprContext tetrahedronExpr() throws RecognitionException {
		TetrahedronExprContext _localctx = new TetrahedronExprContext(_ctx, getState());
		enterRule(_localctx, 88, RULE_tetrahedronExpr);
		try {
			setState(568);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case SHAPE_ID:
				enterOuterAlt(_localctx, 1);
				{
				setState(566);
				match(SHAPE_ID);
				}
				break;
			case TETRAHEDRON:
				enterOuterAlt(_localctx, 2);
				{
				setState(567);
				tetrahedronDef();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class CylinderExprContext extends ParserRuleContext {
		public TerminalNode SHAPE_ID() { return getToken(MathCommandParser.SHAPE_ID, 0); }
		public CylinderDefContext cylinderDef() {
			return getRuleContext(CylinderDefContext.class,0);
		}
		public CylinderExprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_cylinderExpr; }
	}

	public final CylinderExprContext cylinderExpr() throws RecognitionException {
		CylinderExprContext _localctx = new CylinderExprContext(_ctx, getState());
		enterRule(_localctx, 90, RULE_cylinderExpr);
		try {
			setState(572);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case SHAPE_ID:
				enterOuterAlt(_localctx, 1);
				{
				setState(570);
				match(SHAPE_ID);
				}
				break;
			case CYLINDER:
				enterOuterAlt(_localctx, 2);
				{
				setState(571);
				cylinderDef();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ConeExprContext extends ParserRuleContext {
		public TerminalNode SHAPE_ID() { return getToken(MathCommandParser.SHAPE_ID, 0); }
		public ConeDefContext coneDef() {
			return getRuleContext(ConeDefContext.class,0);
		}
		public ConeExprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_coneExpr; }
	}

	public final ConeExprContext coneExpr() throws RecognitionException {
		ConeExprContext _localctx = new ConeExprContext(_ctx, getState());
		enterRule(_localctx, 92, RULE_coneExpr);
		try {
			setState(576);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case SHAPE_ID:
				enterOuterAlt(_localctx, 1);
				{
				setState(574);
				match(SHAPE_ID);
				}
				break;
			case CONE:
				enterOuterAlt(_localctx, 2);
				{
				setState(575);
				coneDef();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class PrismExprContext extends ParserRuleContext {
		public TerminalNode SHAPE_ID() { return getToken(MathCommandParser.SHAPE_ID, 0); }
		public PrismDefContext prismDef() {
			return getRuleContext(PrismDefContext.class,0);
		}
		public PrismExprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_prismExpr; }
	}

	public final PrismExprContext prismExpr() throws RecognitionException {
		PrismExprContext _localctx = new PrismExprContext(_ctx, getState());
		enterRule(_localctx, 94, RULE_prismExpr);
		try {
			setState(580);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case SHAPE_ID:
				enterOuterAlt(_localctx, 1);
				{
				setState(578);
				match(SHAPE_ID);
				}
				break;
			case PRISM:
				enterOuterAlt(_localctx, 2);
				{
				setState(579);
				prismDef();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class SegmentExprContext extends ParserRuleContext {
		public TerminalNode SHAPE_ID() { return getToken(MathCommandParser.SHAPE_ID, 0); }
		public SegmentDefContext segmentDef() {
			return getRuleContext(SegmentDefContext.class,0);
		}
		public SegmentExprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_segmentExpr; }
	}

	public final SegmentExprContext segmentExpr() throws RecognitionException {
		SegmentExprContext _localctx = new SegmentExprContext(_ctx, getState());
		enterRule(_localctx, 96, RULE_segmentExpr);
		try {
			setState(584);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case SHAPE_ID:
				enterOuterAlt(_localctx, 1);
				{
				setState(582);
				match(SHAPE_ID);
				}
				break;
			case SEGMENT:
				enterOuterAlt(_localctx, 2);
				{
				setState(583);
				segmentDef();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class RayExprContext extends ParserRuleContext {
		public TerminalNode SHAPE_ID() { return getToken(MathCommandParser.SHAPE_ID, 0); }
		public RayDefContext rayDef() {
			return getRuleContext(RayDefContext.class,0);
		}
		public RayExprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_rayExpr; }
	}

	public final RayExprContext rayExpr() throws RecognitionException {
		RayExprContext _localctx = new RayExprContext(_ctx, getState());
		enterRule(_localctx, 98, RULE_rayExpr);
		try {
			setState(588);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case SHAPE_ID:
				enterOuterAlt(_localctx, 1);
				{
				setState(586);
				match(SHAPE_ID);
				}
				break;
			case RAY:
				enterOuterAlt(_localctx, 2);
				{
				setState(587);
				rayDef();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class PyramidExprContext extends ParserRuleContext {
		public TerminalNode SHAPE_ID() { return getToken(MathCommandParser.SHAPE_ID, 0); }
		public PyramidDefContext pyramidDef() {
			return getRuleContext(PyramidDefContext.class,0);
		}
		public PyramidExprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_pyramidExpr; }
	}

	public final PyramidExprContext pyramidExpr() throws RecognitionException {
		PyramidExprContext _localctx = new PyramidExprContext(_ctx, getState());
		enterRule(_localctx, 100, RULE_pyramidExpr);
		try {
			setState(592);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case SHAPE_ID:
				enterOuterAlt(_localctx, 1);
				{
				setState(590);
				match(SHAPE_ID);
				}
				break;
			case PYRAMID:
				enterOuterAlt(_localctx, 2);
				{
				setState(591);
				pyramidDef();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ShapeExprContext extends ParserRuleContext {
		public RayExprContext rayExpr() {
			return getRuleContext(RayExprContext.class,0);
		}
		public ConeExprContext coneExpr() {
			return getRuleContext(ConeExprContext.class,0);
		}
		public LineExprContext lineExpr() {
			return getRuleContext(LineExprContext.class,0);
		}
		public AngleDefContext angleDef() {
			return getRuleContext(AngleDefContext.class,0);
		}
		public PlaneExprContext planeExpr() {
			return getRuleContext(PlaneExprContext.class,0);
		}
		public PointExprContext pointExpr() {
			return getRuleContext(PointExprContext.class,0);
		}
		public PrismExprContext prismExpr() {
			return getRuleContext(PrismExprContext.class,0);
		}
		public CircleDefContext circleDef() {
			return getRuleContext(CircleDefContext.class,0);
		}
		public SphereDefContext sphereDef() {
			return getRuleContext(SphereDefContext.class,0);
		}
		public VectorExprContext vectorExpr() {
			return getRuleContext(VectorExprContext.class,0);
		}
		public PolygonExprContext polygonExpr() {
			return getRuleContext(PolygonExprContext.class,0);
		}
		public SegmentExprContext segmentExpr() {
			return getRuleContext(SegmentExprContext.class,0);
		}
		public CylinderExprContext cylinderExpr() {
			return getRuleContext(CylinderExprContext.class,0);
		}
		public TransformDefContext transformDef() {
			return getRuleContext(TransformDefContext.class,0);
		}
		public TetrahedronExprContext tetrahedronExpr() {
			return getRuleContext(TetrahedronExprContext.class,0);
		}
		public IntersectionDefContext intersectionDef() {
			return getRuleContext(IntersectionDefContext.class,0);
		}
		public PyramidExprContext pyramidExpr() {
			return getRuleContext(PyramidExprContext.class,0);
		}
		public ShapeExprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_shapeExpr; }
	}

	public final ShapeExprContext shapeExpr() throws RecognitionException {
		ShapeExprContext _localctx = new ShapeExprContext(_ctx, getState());
		enterRule(_localctx, 102, RULE_shapeExpr);
		try {
			setState(611);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,38,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(594);
				rayExpr();
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(595);
				coneExpr();
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				setState(596);
				lineExpr();
				}
				break;
			case 4:
				enterOuterAlt(_localctx, 4);
				{
				setState(597);
				angleDef();
				}
				break;
			case 5:
				enterOuterAlt(_localctx, 5);
				{
				setState(598);
				planeExpr();
				}
				break;
			case 6:
				enterOuterAlt(_localctx, 6);
				{
				setState(599);
				pointExpr();
				}
				break;
			case 7:
				enterOuterAlt(_localctx, 7);
				{
				setState(600);
				prismExpr();
				}
				break;
			case 8:
				enterOuterAlt(_localctx, 8);
				{
				setState(601);
				circleDef();
				}
				break;
			case 9:
				enterOuterAlt(_localctx, 9);
				{
				setState(602);
				sphereDef();
				}
				break;
			case 10:
				enterOuterAlt(_localctx, 10);
				{
				setState(603);
				vectorExpr();
				}
				break;
			case 11:
				enterOuterAlt(_localctx, 11);
				{
				setState(604);
				polygonExpr();
				}
				break;
			case 12:
				enterOuterAlt(_localctx, 12);
				{
				setState(605);
				segmentExpr();
				}
				break;
			case 13:
				enterOuterAlt(_localctx, 13);
				{
				setState(606);
				cylinderExpr();
				}
				break;
			case 14:
				enterOuterAlt(_localctx, 14);
				{
				setState(607);
				transformDef();
				}
				break;
			case 15:
				enterOuterAlt(_localctx, 15);
				{
				setState(608);
				tetrahedronExpr();
				}
				break;
			case 16:
				enterOuterAlt(_localctx, 16);
				{
				setState(609);
				intersectionDef();
				}
				break;
			case 17:
				enterOuterAlt(_localctx, 17);
				{
				setState(610);
				pyramidExpr();
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public boolean sempred(RuleContext _localctx, int ruleIndex, int predIndex) {
		switch (ruleIndex) {
		case 21:
			return additiveExpr_sempred((AdditiveExprContext)_localctx, predIndex);
		case 22:
			return multiplicativeExpr_sempred((MultiplicativeExprContext)_localctx, predIndex);
		}
		return true;
	}
	private boolean additiveExpr_sempred(AdditiveExprContext _localctx, int predIndex) {
		switch (predIndex) {
		case 0:
			return precpred(_ctx, 3);
		case 1:
			return precpred(_ctx, 2);
		}
		return true;
	}
	private boolean multiplicativeExpr_sempred(MultiplicativeExprContext _localctx, int predIndex) {
		switch (predIndex) {
		case 2:
			return precpred(_ctx, 4);
		case 3:
			return precpred(_ctx, 3);
		}
		return true;
	}

	public static final String _serializedATN =
		"\u0004\u00015\u0266\u0002\u0000\u0007\u0000\u0002\u0001\u0007\u0001\u0002"+
		"\u0002\u0007\u0002\u0002\u0003\u0007\u0003\u0002\u0004\u0007\u0004\u0002"+
		"\u0005\u0007\u0005\u0002\u0006\u0007\u0006\u0002\u0007\u0007\u0007\u0002"+
		"\b\u0007\b\u0002\t\u0007\t\u0002\n\u0007\n\u0002\u000b\u0007\u000b\u0002"+
		"\f\u0007\f\u0002\r\u0007\r\u0002\u000e\u0007\u000e\u0002\u000f\u0007\u000f"+
		"\u0002\u0010\u0007\u0010\u0002\u0011\u0007\u0011\u0002\u0012\u0007\u0012"+
		"\u0002\u0013\u0007\u0013\u0002\u0014\u0007\u0014\u0002\u0015\u0007\u0015"+
		"\u0002\u0016\u0007\u0016\u0002\u0017\u0007\u0017\u0002\u0018\u0007\u0018"+
		"\u0002\u0019\u0007\u0019\u0002\u001a\u0007\u001a\u0002\u001b\u0007\u001b"+
		"\u0002\u001c\u0007\u001c\u0002\u001d\u0007\u001d\u0002\u001e\u0007\u001e"+
		"\u0002\u001f\u0007\u001f\u0002 \u0007 \u0002!\u0007!\u0002\"\u0007\"\u0002"+
		"#\u0007#\u0002$\u0007$\u0002%\u0007%\u0002&\u0007&\u0002\'\u0007\'\u0002"+
		"(\u0007(\u0002)\u0007)\u0002*\u0007*\u0002+\u0007+\u0002,\u0007,\u0002"+
		"-\u0007-\u0002.\u0007.\u0002/\u0007/\u00020\u00070\u00021\u00071\u0002"+
		"2\u00072\u00023\u00073\u0001\u0000\u0001\u0000\u0001\u0000\u0001\u0001"+
		"\u0001\u0001\u0001\u0002\u0003\u0002o\b\u0002\u0001\u0002\u0001\u0002"+
		"\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002"+
		"\u0001\u0002\u0001\u0003\u0001\u0003\u0001\u0003\u0001\u0003\u0001\u0003"+
		"\u0001\u0003\u0003\u0003\u0080\b\u0003\u0001\u0003\u0001\u0003\u0001\u0004"+
		"\u0001\u0004\u0001\u0004\u0001\u0004\u0001\u0004\u0001\u0004\u0001\u0004"+
		"\u0003\u0004\u008b\b\u0004\u0001\u0004\u0001\u0004\u0001\u0004\u0001\u0004"+
		"\u0001\u0004\u0001\u0004\u0001\u0004\u0001\u0004\u0001\u0004\u0001\u0004"+
		"\u0001\u0004\u0001\u0004\u0001\u0004\u0001\u0004\u0001\u0004\u0001\u0004"+
		"\u0003\u0004\u009d\b\u0004\u0001\u0004\u0001\u0004\u0001\u0005\u0001\u0005"+
		"\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005"+
		"\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005"+
		"\u0003\u0005\u00af\b\u0005\u0001\u0005\u0001\u0005\u0001\u0006\u0001\u0006"+
		"\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006"+
		"\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006"+
		"\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006"+
		"\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006"+
		"\u0003\u0006\u00cd\b\u0006\u0001\u0006\u0001\u0006\u0001\u0007\u0001\u0007"+
		"\u0001\u0007\u0001\u0007\u0001\u0007\u0001\u0007\u0001\u0007\u0003\u0007"+
		"\u00d8\b\u0007\u0001\u0007\u0001\u0007\u0001\b\u0001\b\u0001\b\u0001\b"+
		"\u0001\b\u0001\t\u0001\t\u0001\t\u0001\t\u0001\t\u0003\t\u00e6\b\t\u0001"+
		"\n\u0001\n\u0001\n\u0001\n\u0001\n\u0001\n\u0001\n\u0001\n\u0001\n\u0001"+
		"\n\u0001\n\u0001\n\u0001\n\u0001\n\u0001\n\u0001\n\u0001\n\u0001\n\u0001"+
		"\n\u0001\n\u0001\n\u0001\n\u0001\n\u0001\n\u0001\n\u0001\n\u0001\n\u0001"+
		"\n\u0003\n\u0104\b\n\u0001\n\u0001\n\u0001\u000b\u0001\u000b\u0001\u000b"+
		"\u0001\u000b\u0001\u000b\u0001\u000b\u0003\u000b\u010e\b\u000b\u0001\u000b"+
		"\u0001\u000b\u0001\f\u0001\f\u0001\f\u0001\f\u0001\f\u0001\f\u0003\f\u0118"+
		"\b\f\u0001\f\u0001\f\u0001\r\u0001\r\u0001\r\u0001\r\u0001\r\u0001\r\u0001"+
		"\r\u0001\r\u0001\u000e\u0001\u000e\u0001\u000e\u0001\u000e\u0001\u000e"+
		"\u0001\u000e\u0001\u000e\u0001\u000e\u0001\u000e\u0001\u000e\u0001\u000e"+
		"\u0001\u000e\u0001\u000e\u0001\u000e\u0001\u000e\u0001\u000e\u0001\u000e"+
		"\u0001\u000e\u0001\u000e\u0001\u000e\u0001\u000e\u0001\u000e\u0003\u000e"+
		"\u013a\b\u000e\u0001\u000e\u0001\u000e\u0001\u000e\u0001\u000e\u0001\u000e"+
		"\u0001\u000e\u0001\u000e\u0001\u000e\u0001\u000e\u0001\u000e\u0001\u000e"+
		"\u0001\u000e\u0001\u000e\u0001\u000e\u0001\u000e\u0001\u000e\u0001\u000e"+
		"\u0003\u000e\u014d\b\u000e\u0001\u000e\u0001\u000e\u0001\u000e\u0001\u000e"+
		"\u0001\u000e\u0001\u000e\u0001\u000e\u0001\u000e\u0001\u000e\u0001\u000e"+
		"\u0001\u000e\u0001\u000e\u0003\u000e\u015b\b\u000e\u0001\u000f\u0001\u000f"+
		"\u0001\u000f\u0001\u000f\u0001\u000f\u0001\u000f\u0001\u000f\u0001\u000f"+
		"\u0001\u000f\u0001\u000f\u0001\u0010\u0001\u0010\u0001\u0010\u0001\u0010"+
		"\u0001\u0010\u0001\u0010\u0001\u0010\u0001\u0010\u0001\u0010\u0003\u0010"+
		"\u0170\b\u0010\u0001\u0010\u0001\u0010\u0001\u0010\u0001\u0010\u0001\u0010"+
		"\u0001\u0011\u0001\u0011\u0001\u0011\u0001\u0011\u0001\u0011\u0001\u0011"+
		"\u0001\u0011\u0001\u0011\u0001\u0011\u0001\u0011\u0001\u0012\u0001\u0012"+
		"\u0001\u0012\u0001\u0012\u0001\u0012\u0001\u0012\u0001\u0012\u0001\u0012"+
		"\u0001\u0013\u0001\u0013\u0001\u0013\u0001\u0013\u0001\u0013\u0001\u0013"+
		"\u0001\u0013\u0001\u0013\u0001\u0014\u0001\u0014\u0001\u0015\u0001\u0015"+
		"\u0001\u0015\u0001\u0015\u0001\u0015\u0001\u0015\u0001\u0015\u0001\u0015"+
		"\u0001\u0015\u0005\u0015\u019c\b\u0015\n\u0015\f\u0015\u019f\t\u0015\u0001"+
		"\u0016\u0001\u0016\u0001\u0016\u0003\u0016\u01a4\b\u0016\u0001\u0016\u0001"+
		"\u0016\u0001\u0016\u0001\u0016\u0001\u0016\u0001\u0016\u0005\u0016\u01ac"+
		"\b\u0016\n\u0016\f\u0016\u01af\t\u0016\u0001\u0017\u0001\u0017\u0004\u0017"+
		"\u01b3\b\u0017\u000b\u0017\f\u0017\u01b4\u0001\u0018\u0001\u0018\u0001"+
		"\u0018\u0001\u0018\u0001\u0018\u0003\u0018\u01bc\b\u0018\u0001\u0019\u0001"+
		"\u0019\u0001\u0019\u0001\u0019\u0001\u0019\u0003\u0019\u01c3\b\u0019\u0001"+
		"\u001a\u0001\u001a\u0001\u001a\u0001\u001a\u0001\u001a\u0001\u001a\u0001"+
		"\u001a\u0001\u001a\u0001\u001a\u0001\u001a\u0001\u001a\u0001\u001a\u0001"+
		"\u001a\u0001\u001a\u0001\u001a\u0001\u001a\u0001\u001a\u0001\u001a\u0003"+
		"\u001a\u01d7\b\u001a\u0001\u001b\u0001\u001b\u0001\u001b\u0001\u001b\u0001"+
		"\u001b\u0001\u001c\u0001\u001c\u0001\u001c\u0001\u001c\u0001\u001c\u0001"+
		"\u001d\u0001\u001d\u0001\u001d\u0001\u001d\u0001\u001d\u0001\u001e\u0001"+
		"\u001e\u0001\u001e\u0001\u001e\u0001\u001e\u0001\u001f\u0001\u001f\u0001"+
		"\u001f\u0001\u001f\u0001\u001f\u0001\u001f\u0001\u001f\u0001\u001f\u0001"+
		" \u0001 \u0001 \u0001 \u0001 \u0001!\u0001!\u0001!\u0001!\u0001!\u0001"+
		"\"\u0001\"\u0001\"\u0001\"\u0001\"\u0001#\u0001#\u0001#\u0001#\u0001#"+
		"\u0001$\u0001$\u0001$\u0001$\u0001$\u0001%\u0001%\u0003%\u0210\b%\u0001"+
		"&\u0001&\u0003&\u0214\b&\u0001\'\u0001\'\u0001\'\u0001\'\u0001\'\u0001"+
		"\'\u0001\'\u0001\'\u0001\'\u0001\'\u0001\'\u0003\'\u0221\b\'\u0001(\u0001"+
		"(\u0003(\u0225\b(\u0001)\u0001)\u0003)\u0229\b)\u0001*\u0001*\u0001*\u0001"+
		"*\u0001*\u0001*\u0003*\u0231\b*\u0001+\u0001+\u0003+\u0235\b+\u0001,\u0001"+
		",\u0003,\u0239\b,\u0001-\u0001-\u0003-\u023d\b-\u0001.\u0001.\u0003.\u0241"+
		"\b.\u0001/\u0001/\u0003/\u0245\b/\u00010\u00010\u00030\u0249\b0\u0001"+
		"1\u00011\u00031\u024d\b1\u00012\u00012\u00032\u0251\b2\u00013\u00013\u0001"+
		"3\u00013\u00013\u00013\u00013\u00013\u00013\u00013\u00013\u00013\u0001"+
		"3\u00013\u00013\u00013\u00013\u00033\u0264\b3\u00013\u0000\u0002*,4\u0000"+
		"\u0002\u0004\u0006\b\n\f\u000e\u0010\u0012\u0014\u0016\u0018\u001a\u001c"+
		"\u001e \"$&(*,.02468:<>@BDFHJLNPRTVXZ\\^`bdf\u0000\u0000\u028c\u0000h"+
		"\u0001\u0000\u0000\u0000\u0002k\u0001\u0000\u0000\u0000\u0004n\u0001\u0000"+
		"\u0000\u0000\u0006y\u0001\u0000\u0000\u0000\b\u0083\u0001\u0000\u0000"+
		"\u0000\n\u00a0\u0001\u0000\u0000\u0000\f\u00b2\u0001\u0000\u0000\u0000"+
		"\u000e\u00d0\u0001\u0000\u0000\u0000\u0010\u00db\u0001\u0000\u0000\u0000"+
		"\u0012\u00e5\u0001\u0000\u0000\u0000\u0014\u00e7\u0001\u0000\u0000\u0000"+
		"\u0016\u0107\u0001\u0000\u0000\u0000\u0018\u0111\u0001\u0000\u0000\u0000"+
		"\u001a\u011b\u0001\u0000\u0000\u0000\u001c\u015a\u0001\u0000\u0000\u0000"+
		"\u001e\u015c\u0001\u0000\u0000\u0000 \u0166\u0001\u0000\u0000\u0000\""+
		"\u0176\u0001\u0000\u0000\u0000$\u0180\u0001\u0000\u0000\u0000&\u0188\u0001"+
		"\u0000\u0000\u0000(\u0190\u0001\u0000\u0000\u0000*\u0192\u0001\u0000\u0000"+
		"\u0000,\u01a3\u0001\u0000\u0000\u0000.\u01b0\u0001\u0000\u0000\u00000"+
		"\u01bb\u0001\u0000\u0000\u00002\u01c2\u0001\u0000\u0000\u00004\u01d6\u0001"+
		"\u0000\u0000\u00006\u01d8\u0001\u0000\u0000\u00008\u01dd\u0001\u0000\u0000"+
		"\u0000:\u01e2\u0001\u0000\u0000\u0000<\u01e7\u0001\u0000\u0000\u0000>"+
		"\u01ec\u0001\u0000\u0000\u0000@\u01f4\u0001\u0000\u0000\u0000B\u01f9\u0001"+
		"\u0000\u0000\u0000D\u01fe\u0001\u0000\u0000\u0000F\u0203\u0001\u0000\u0000"+
		"\u0000H\u0208\u0001\u0000\u0000\u0000J\u020f\u0001\u0000\u0000\u0000L"+
		"\u0213\u0001\u0000\u0000\u0000N\u0220\u0001\u0000\u0000\u0000P\u0224\u0001"+
		"\u0000\u0000\u0000R\u0228\u0001\u0000\u0000\u0000T\u0230\u0001\u0000\u0000"+
		"\u0000V\u0234\u0001\u0000\u0000\u0000X\u0238\u0001\u0000\u0000\u0000Z"+
		"\u023c\u0001\u0000\u0000\u0000\\\u0240\u0001\u0000\u0000\u0000^\u0244"+
		"\u0001\u0000\u0000\u0000`\u0248\u0001\u0000\u0000\u0000b\u024c\u0001\u0000"+
		"\u0000\u0000d\u0250\u0001\u0000\u0000\u0000f\u0263\u0001\u0000\u0000\u0000"+
		"hi\u0003\u0002\u0001\u0000ij\u0005\u0000\u0000\u0001j\u0001\u0001\u0000"+
		"\u0000\u0000kl\u0003f3\u0000l\u0003\u0001\u0000\u0000\u0000mo\u0005\u0007"+
		"\u0000\u0000nm\u0001\u0000\u0000\u0000no\u0001\u0000\u0000\u0000op\u0001"+
		"\u0000\u0000\u0000pq\u0005(\u0000\u0000qr\u0003(\u0014\u0000rs\u0005,"+
		"\u0000\u0000st\u0003(\u0014\u0000tu\u0005,\u0000\u0000uv\u0003(\u0014"+
		"\u0000vw\u0001\u0000\u0000\u0000wx\u0005)\u0000\u0000x\u0005\u0001\u0000"+
		"\u0000\u0000yz\u0005\b\u0000\u0000z{\u0005(\u0000\u0000{|\u0003J%\u0000"+
		"|\u007f\u0005,\u0000\u0000}\u0080\u0003J%\u0000~\u0080\u0003(\u0014\u0000"+
		"\u007f}\u0001\u0000\u0000\u0000\u007f~\u0001\u0000\u0000\u0000\u0080\u0081"+
		"\u0001\u0000\u0000\u0000\u0081\u0082\u0005)\u0000\u0000\u0082\u0007\u0001"+
		"\u0000\u0000\u0000\u0083\u0084\u0005\t\u0000\u0000\u0084\u009c\u0005("+
		"\u0000\u0000\u0085\u009d\u0005\'\u0000\u0000\u0086\u0087\u0003J%\u0000"+
		"\u0087\u008a\u0005,\u0000\u0000\u0088\u008b\u0003R)\u0000\u0089\u008b"+
		"\u0003L&\u0000\u008a\u0088\u0001\u0000\u0000\u0000\u008a\u0089\u0001\u0000"+
		"\u0000\u0000\u008b\u009d\u0001\u0000\u0000\u0000\u008c\u008d\u0003L&\u0000"+
		"\u008d\u008e\u0005,\u0000\u0000\u008e\u008f\u0003L&\u0000\u008f\u009d"+
		"\u0001\u0000\u0000\u0000\u0090\u0091\u0003J%\u0000\u0091\u0092\u0005,"+
		"\u0000\u0000\u0092\u0093\u0003P(\u0000\u0093\u0094\u0005,\u0000\u0000"+
		"\u0094\u0095\u0003P(\u0000\u0095\u009d\u0001\u0000\u0000\u0000\u0096\u0097"+
		"\u0003J%\u0000\u0097\u0098\u0005,\u0000\u0000\u0098\u0099\u0003J%\u0000"+
		"\u0099\u009a\u0005,\u0000\u0000\u009a\u009b\u0003J%\u0000\u009b\u009d"+
		"\u0001\u0000\u0000\u0000\u009c\u0085\u0001\u0000\u0000\u0000\u009c\u0086"+
		"\u0001\u0000\u0000\u0000\u009c\u008c\u0001\u0000\u0000\u0000\u009c\u0090"+
		"\u0001\u0000\u0000\u0000\u009c\u0096\u0001\u0000\u0000\u0000\u009d\u009e"+
		"\u0001\u0000\u0000\u0000\u009e\u009f\u0005)\u0000\u0000\u009f\t\u0001"+
		"\u0000\u0000\u0000\u00a0\u00a1\u0005\u0002\u0000\u0000\u00a1\u00ae\u0005"+
		"(\u0000\u0000\u00a2\u00a3\u0003J%\u0000\u00a3\u00a4\u0005,\u0000\u0000"+
		"\u00a4\u00a5\u0003J%\u0000\u00a5\u00af\u0001\u0000\u0000\u0000\u00a6\u00a7"+
		"\u0003J%\u0000\u00a7\u00a8\u0005,\u0000\u0000\u00a8\u00a9\u0003L&\u0000"+
		"\u00a9\u00af\u0001\u0000\u0000\u0000\u00aa\u00ab\u0003J%\u0000\u00ab\u00ac"+
		"\u0005,\u0000\u0000\u00ac\u00ad\u0003P(\u0000\u00ad\u00af\u0001\u0000"+
		"\u0000\u0000\u00ae\u00a2\u0001\u0000\u0000\u0000\u00ae\u00a6\u0001\u0000"+
		"\u0000\u0000\u00ae\u00aa\u0001\u0000\u0000\u0000\u00af\u00b0\u0001\u0000"+
		"\u0000\u0000\u00b0\u00b1\u0005)\u0000\u0000\u00b1\u000b\u0001\u0000\u0000"+
		"\u0000\u00b2\u00b3\u0005\u000b\u0000\u0000\u00b3\u00cc\u0005(\u0000\u0000"+
		"\u00b4\u00cd\u0003P(\u0000\u00b5\u00cd\u0003J%\u0000\u00b6\u00b7\u0003"+
		"P(\u0000\u00b7\u00b8\u0005,\u0000\u0000\u00b8\u00b9\u0003P(\u0000\u00b9"+
		"\u00cd\u0001\u0000\u0000\u0000\u00ba\u00bb\u0003L&\u0000\u00bb\u00bc\u0005"+
		",\u0000\u0000\u00bc\u00bd\u0003L&\u0000\u00bd\u00cd\u0001\u0000\u0000"+
		"\u0000\u00be\u00bf\u0003L&\u0000\u00bf\u00c0\u0005,\u0000\u0000\u00c0"+
		"\u00c1\u0003R)\u0000\u00c1\u00cd\u0001\u0000\u0000\u0000\u00c2\u00c3\u0003"+
		"R)\u0000\u00c3\u00c4\u0005,\u0000\u0000\u00c4\u00c5\u0003R)\u0000\u00c5"+
		"\u00cd\u0001\u0000\u0000\u0000\u00c6\u00c7\u0003J%\u0000\u00c7\u00c8\u0005"+
		",\u0000\u0000\u00c8\u00c9\u0003J%\u0000\u00c9\u00ca\u0005,\u0000\u0000"+
		"\u00ca\u00cb\u0003J%\u0000\u00cb\u00cd\u0001\u0000\u0000\u0000\u00cc\u00b4"+
		"\u0001\u0000\u0000\u0000\u00cc\u00b5\u0001\u0000\u0000\u0000\u00cc\u00b6"+
		"\u0001\u0000\u0000\u0000\u00cc\u00ba\u0001\u0000\u0000\u0000\u00cc\u00be"+
		"\u0001\u0000\u0000\u0000\u00cc\u00c2\u0001\u0000\u0000\u0000\u00cc\u00c6"+
		"\u0001\u0000\u0000\u0000\u00cd\u00ce\u0001\u0000\u0000\u0000\u00ce\u00cf"+
		"\u0005)\u0000\u0000\u00cf\r\u0001\u0000\u0000\u0000\u00d0\u00d1\u0005"+
		"\u0003\u0000\u0000\u00d1\u00d7\u0005(\u0000\u0000\u00d2\u00d8\u0003J%"+
		"\u0000\u00d3\u00d4\u0003J%\u0000\u00d4\u00d5\u0005,\u0000\u0000\u00d5"+
		"\u00d6\u0003J%\u0000\u00d6\u00d8\u0001\u0000\u0000\u0000\u00d7\u00d2\u0001"+
		"\u0000\u0000\u0000\u00d7\u00d3\u0001\u0000\u0000\u0000\u00d8\u00d9\u0001"+
		"\u0000\u0000\u0000\u00d9\u00da\u0005)\u0000\u0000\u00da\u000f\u0001\u0000"+
		"\u0000\u0000\u00db\u00dc\u0005\u0006\u0000\u0000\u00dc\u00dd\u0005(\u0000"+
		"\u0000\u00dd\u00de\u0003\u0012\t\u0000\u00de\u00df\u0005)\u0000\u0000"+
		"\u00df\u0011\u0001\u0000\u0000\u0000\u00e0\u00e1\u0003J%\u0000\u00e1\u00e2"+
		"\u0005,\u0000\u0000\u00e2\u00e3\u0003\u0012\t\u0000\u00e3\u00e6\u0001"+
		"\u0000\u0000\u0000\u00e4\u00e6\u0003J%\u0000\u00e5\u00e0\u0001\u0000\u0000"+
		"\u0000\u00e5\u00e4\u0001\u0000\u0000\u0000\u00e6\u0013\u0001\u0000\u0000"+
		"\u0000\u00e7\u00e8\u0005\u0001\u0000\u0000\u00e8\u0103\u0005(\u0000\u0000"+
		"\u00e9\u00ea\u0003J%\u0000\u00ea\u00eb\u0005,\u0000\u0000\u00eb\u00ec"+
		"\u0003(\u0014\u0000\u00ec\u0104\u0001\u0000\u0000\u0000\u00ed\u00ee\u0003"+
		"J%\u0000\u00ee\u00ef\u0005,\u0000\u0000\u00ef\u00f0\u0003J%\u0000\u00f0"+
		"\u0104\u0001\u0000\u0000\u0000\u00f1\u00f2\u0003J%\u0000\u00f2\u00f3\u0005"+
		",\u0000\u0000\u00f3\u00f4\u0003J%\u0000\u00f4\u00f5\u0005,\u0000\u0000"+
		"\u00f5\u00f6\u0003J%\u0000\u00f6\u0104\u0001\u0000\u0000\u0000\u00f7\u00f8"+
		"\u0003J%\u0000\u00f8\u00f9\u0005,\u0000\u0000\u00f9\u00fa\u0003(\u0014"+
		"\u0000\u00fa\u00fb\u0005,\u0000\u0000\u00fb\u00fc\u0003T*\u0000\u00fc"+
		"\u0104\u0001\u0000\u0000\u0000\u00fd\u00fe\u0003J%\u0000\u00fe\u00ff\u0005"+
		",\u0000\u0000\u00ff\u0100\u0003J%\u0000\u0100\u0101\u0005,\u0000\u0000"+
		"\u0101\u0102\u0003T*\u0000\u0102\u0104\u0001\u0000\u0000\u0000\u0103\u00e9"+
		"\u0001\u0000\u0000\u0000\u0103\u00ed\u0001\u0000\u0000\u0000\u0103\u00f1"+
		"\u0001\u0000\u0000\u0000\u0103\u00f7\u0001\u0000\u0000\u0000\u0103\u00fd"+
		"\u0001\u0000\u0000\u0000\u0104\u0105\u0001\u0000\u0000\u0000\u0105\u0106"+
		"\u0005)\u0000\u0000\u0106\u0015\u0001\u0000\u0000\u0000\u0107\u0108\u0005"+
		"\u0004\u0000\u0000\u0108\u0109\u0005(\u0000\u0000\u0109\u010a\u0003J%"+
		"\u0000\u010a\u010d\u0005,\u0000\u0000\u010b\u010e\u0003J%\u0000\u010c"+
		"\u010e\u0003(\u0014\u0000\u010d\u010b\u0001\u0000\u0000\u0000\u010d\u010c"+
		"\u0001\u0000\u0000\u0000\u010e\u010f\u0001\u0000\u0000\u0000\u010f\u0110"+
		"\u0005)\u0000\u0000\u0110\u0017\u0001\u0000\u0000\u0000\u0111\u0112\u0005"+
		"\u0005\u0000\u0000\u0112\u0113\u0005(\u0000\u0000\u0113\u0114\u0003J%"+
		"\u0000\u0114\u0117\u0005,\u0000\u0000\u0115\u0118\u0003J%\u0000\u0116"+
		"\u0118\u0003P(\u0000\u0117\u0115\u0001\u0000\u0000\u0000\u0117\u0116\u0001"+
		"\u0000\u0000\u0000\u0118\u0119\u0001\u0000\u0000\u0000\u0119\u011a\u0005"+
		")\u0000\u0000\u011a\u0019\u0001\u0000\u0000\u0000\u011b\u011c\u0005\n"+
		"\u0000\u0000\u011c\u011d\u0005(\u0000\u0000\u011d\u011e\u0003\u0002\u0001"+
		"\u0000\u011e\u011f\u0005,\u0000\u0000\u011f\u0120\u0003\u0002\u0001\u0000"+
		"\u0120\u0121\u0001\u0000\u0000\u0000\u0121\u0122\u0005)\u0000\u0000\u0122"+
		"\u001b\u0001\u0000\u0000\u0000\u0123\u0124\u0005\f\u0000\u0000\u0124\u0125"+
		"\u0005(\u0000\u0000\u0125\u0126\u0003f3\u0000\u0126\u0127\u0005,\u0000"+
		"\u0000\u0127\u0128\u0003P(\u0000\u0128\u0129\u0001\u0000\u0000\u0000\u0129"+
		"\u012a\u0005)\u0000\u0000\u012a\u015b\u0001\u0000\u0000\u0000\u012b\u012c"+
		"\u0005\r\u0000\u0000\u012c\u012d\u0005(\u0000\u0000\u012d\u012e\u0003"+
		"f3\u0000\u012e\u012f\u0005,\u0000\u0000\u012f\u0139\u0003(\u0014\u0000"+
		"\u0130\u0131\u0005,\u0000\u0000\u0131\u013a\u0003J%\u0000\u0132\u0133"+
		"\u0005,\u0000\u0000\u0133\u013a\u0003T*\u0000\u0134\u0135\u0005,\u0000"+
		"\u0000\u0135\u0136\u0003J%\u0000\u0136\u0137\u0005,\u0000\u0000\u0137"+
		"\u0138\u0003T*\u0000\u0138\u013a\u0001\u0000\u0000\u0000\u0139\u0130\u0001"+
		"\u0000\u0000\u0000\u0139\u0132\u0001\u0000\u0000\u0000\u0139\u0134\u0001"+
		"\u0000\u0000\u0000\u0139\u013a\u0001\u0000\u0000\u0000\u013a\u013b\u0001"+
		"\u0000\u0000\u0000\u013b\u013c\u0005)\u0000\u0000\u013c\u015b\u0001\u0000"+
		"\u0000\u0000\u013d\u013e\u0005\u000e\u0000\u0000\u013e\u013f\u0005(\u0000"+
		"\u0000\u013f\u0140\u0003J%\u0000\u0140\u0141\u0005,\u0000\u0000\u0141"+
		"\u0142\u0003R)\u0000\u0142\u0143\u0001\u0000\u0000\u0000\u0143\u0144\u0005"+
		")\u0000\u0000\u0144\u015b\u0001\u0000\u0000\u0000\u0145\u0146\u0005\u000f"+
		"\u0000\u0000\u0146\u0147\u0005(\u0000\u0000\u0147\u0148\u0003f3\u0000"+
		"\u0148\u014c\u0005,\u0000\u0000\u0149\u014d\u0003R)\u0000\u014a\u014d"+
		"\u0003L&\u0000\u014b\u014d\u0003J%\u0000\u014c\u0149\u0001\u0000\u0000"+
		"\u0000\u014c\u014a\u0001\u0000\u0000\u0000\u014c\u014b\u0001\u0000\u0000"+
		"\u0000\u014d\u014e\u0001\u0000\u0000\u0000\u014e\u014f\u0005)\u0000\u0000"+
		"\u014f\u015b\u0001\u0000\u0000\u0000\u0150\u0151\u0005\u0010\u0000\u0000"+
		"\u0151\u0152\u0005(\u0000\u0000\u0152\u0153\u0003f3\u0000\u0153\u0154"+
		"\u0005,\u0000\u0000\u0154\u0155\u0003(\u0014\u0000\u0155\u0156\u0005,"+
		"\u0000\u0000\u0156\u0157\u0003J%\u0000\u0157\u0158\u0001\u0000\u0000\u0000"+
		"\u0158\u0159\u0005)\u0000\u0000\u0159\u015b\u0001\u0000\u0000\u0000\u015a"+
		"\u0123\u0001\u0000\u0000\u0000\u015a\u012b\u0001\u0000\u0000\u0000\u015a"+
		"\u013d\u0001\u0000\u0000\u0000\u015a\u0145\u0001\u0000\u0000\u0000\u015a"+
		"\u0150\u0001\u0000\u0000\u0000\u015b\u001d\u0001\u0000\u0000\u0000\u015c"+
		"\u015d\u0005\u0011\u0000\u0000\u015d\u015e\u0005(\u0000\u0000\u015e\u015f"+
		"\u0003J%\u0000\u015f\u0160\u0005,\u0000\u0000\u0160\u0161\u0003J%\u0000"+
		"\u0161\u0162\u0005,\u0000\u0000\u0162\u0163\u0003(\u0014\u0000\u0163\u0164"+
		"\u0001\u0000\u0000\u0000\u0164\u0165\u0005)\u0000\u0000\u0165\u001f\u0001"+
		"\u0000\u0000\u0000\u0166\u0167\u0005\u0012\u0000\u0000\u0167\u016f\u0005"+
		"(\u0000\u0000\u0168\u0170\u0003V+\u0000\u0169\u016a\u0003J%\u0000\u016a"+
		"\u016b\u0005,\u0000\u0000\u016b\u016c\u0003J%\u0000\u016c\u016d\u0005"+
		",\u0000\u0000\u016d\u016e\u0003J%\u0000\u016e\u0170\u0001\u0000\u0000"+
		"\u0000\u016f\u0168\u0001\u0000\u0000\u0000\u016f\u0169\u0001\u0000\u0000"+
		"\u0000\u0170\u0171\u0001\u0000\u0000\u0000\u0171\u0172\u0005,\u0000\u0000"+
		"\u0172\u0173\u0003J%\u0000\u0173\u0174\u0001\u0000\u0000\u0000\u0174\u0175"+
		"\u0005)\u0000\u0000\u0175!\u0001\u0000\u0000\u0000\u0176\u0177\u0005\u0016"+
		"\u0000\u0000\u0177\u0178\u0005(\u0000\u0000\u0178\u0179\u0003J%\u0000"+
		"\u0179\u017a\u0005,\u0000\u0000\u017a\u017b\u0003(\u0014\u0000\u017b\u017c"+
		"\u0005,\u0000\u0000\u017c\u017d\u0003J%\u0000\u017d\u017e\u0001\u0000"+
		"\u0000\u0000\u017e\u017f\u0005)\u0000\u0000\u017f#\u0001\u0000\u0000\u0000"+
		"\u0180\u0181\u0005\u0013\u0000\u0000\u0181\u0182\u0005(\u0000\u0000\u0182"+
		"\u0183\u0003V+\u0000\u0183\u0184\u0005,\u0000\u0000\u0184\u0185\u0003"+
		"T*\u0000\u0185\u0186\u0001\u0000\u0000\u0000\u0186\u0187\u0005)\u0000"+
		"\u0000\u0187%\u0001\u0000\u0000\u0000\u0188\u0189\u0005\u0014\u0000\u0000"+
		"\u0189\u018a\u0005(\u0000\u0000\u018a\u018b\u0003V+\u0000\u018b\u018c"+
		"\u0005,\u0000\u0000\u018c\u018d\u0003J%\u0000\u018d\u018e\u0001\u0000"+
		"\u0000\u0000\u018e\u018f\u0005)\u0000\u0000\u018f\'\u0001\u0000\u0000"+
		"\u0000\u0190\u0191\u0003*\u0015\u0000\u0191)\u0001\u0000\u0000\u0000\u0192"+
		"\u0193\u0006\u0015\uffff\uffff\u0000\u0193\u0194\u0003,\u0016\u0000\u0194"+
		"\u019d\u0001\u0000\u0000\u0000\u0195\u0196\n\u0003\u0000\u0000\u0196\u0197"+
		"\u0005.\u0000\u0000\u0197\u019c\u0003,\u0016\u0000\u0198\u0199\n\u0002"+
		"\u0000\u0000\u0199\u019a\u0005/\u0000\u0000\u019a\u019c\u0003,\u0016\u0000"+
		"\u019b\u0195\u0001\u0000\u0000\u0000\u019b\u0198\u0001\u0000\u0000\u0000"+
		"\u019c\u019f\u0001\u0000\u0000\u0000\u019d\u019b\u0001\u0000\u0000\u0000"+
		"\u019d\u019e\u0001\u0000\u0000\u0000\u019e+\u0001\u0000\u0000\u0000\u019f"+
		"\u019d\u0001\u0000\u0000\u0000\u01a0\u01a1\u0006\u0016\uffff\uffff\u0000"+
		"\u01a1\u01a4\u0003.\u0017\u0000\u01a2\u01a4\u00030\u0018\u0000\u01a3\u01a0"+
		"\u0001\u0000\u0000\u0000\u01a3\u01a2\u0001\u0000\u0000\u0000\u01a4\u01ad"+
		"\u0001\u0000\u0000\u0000\u01a5\u01a6\n\u0004\u0000\u0000\u01a6\u01a7\u0005"+
		"0\u0000\u0000\u01a7\u01ac\u00030\u0018\u0000\u01a8\u01a9\n\u0003\u0000"+
		"\u0000\u01a9\u01aa\u0005-\u0000\u0000\u01aa\u01ac\u00030\u0018\u0000\u01ab"+
		"\u01a5\u0001\u0000\u0000\u0000\u01ab\u01a8\u0001\u0000\u0000\u0000\u01ac"+
		"\u01af\u0001\u0000\u0000\u0000\u01ad\u01ab\u0001\u0000\u0000\u0000\u01ad"+
		"\u01ae\u0001\u0000\u0000\u0000\u01ae-\u0001\u0000\u0000\u0000\u01af\u01ad"+
		"\u0001\u0000\u0000\u0000\u01b0\u01b2\u00034\u001a\u0000\u01b1\u01b3\u0003"+
		"4\u001a\u0000\u01b2\u01b1\u0001\u0000\u0000\u0000\u01b3\u01b4\u0001\u0000"+
		"\u0000\u0000\u01b4\u01b2\u0001\u0000\u0000\u0000\u01b4\u01b5\u0001\u0000"+
		"\u0000\u0000\u01b5/\u0001\u0000\u0000\u0000\u01b6\u01b7\u00032\u0019\u0000"+
		"\u01b7\u01b8\u00051\u0000\u0000\u01b8\u01b9\u00030\u0018\u0000\u01b9\u01bc"+
		"\u0001\u0000\u0000\u0000\u01ba\u01bc\u00032\u0019\u0000\u01bb\u01b6\u0001"+
		"\u0000\u0000\u0000\u01bb\u01ba\u0001\u0000\u0000\u0000\u01bc1\u0001\u0000"+
		"\u0000\u0000\u01bd\u01be\u0005/\u0000\u0000\u01be\u01c3\u00032\u0019\u0000"+
		"\u01bf\u01c0\u0005.\u0000\u0000\u01c0\u01c3\u00032\u0019\u0000\u01c1\u01c3"+
		"\u00034\u001a\u0000\u01c2\u01bd\u0001\u0000\u0000\u0000\u01c2\u01bf\u0001"+
		"\u0000\u0000\u0000\u01c2\u01c1\u0001\u0000\u0000\u0000\u01c33\u0001\u0000"+
		"\u0000\u0000\u01c4\u01d7\u00052\u0000\u0000\u01c5\u01d7\u00053\u0000\u0000"+
		"\u01c6\u01d7\u0005!\u0000\u0000\u01c7\u01d7\u0005\"\u0000\u0000\u01c8"+
		"\u01c9\u0005(\u0000\u0000\u01c9\u01ca\u0003(\u0014\u0000\u01ca\u01cb\u0005"+
		")\u0000\u0000\u01cb\u01d7\u0001\u0000\u0000\u0000\u01cc\u01d7\u00036\u001b"+
		"\u0000\u01cd\u01d7\u00038\u001c\u0000\u01ce\u01d7\u0003:\u001d\u0000\u01cf"+
		"\u01d7\u0003<\u001e\u0000\u01d0\u01d7\u0003>\u001f\u0000\u01d1\u01d7\u0003"+
		"@ \u0000\u01d2\u01d7\u0003H$\u0000\u01d3\u01d7\u0003F#\u0000\u01d4\u01d7"+
		"\u0003D\"\u0000\u01d5\u01d7\u0003B!\u0000\u01d6\u01c4\u0001\u0000\u0000"+
		"\u0000\u01d6\u01c5\u0001\u0000\u0000\u0000\u01d6\u01c6\u0001\u0000\u0000"+
		"\u0000\u01d6\u01c7\u0001\u0000\u0000\u0000\u01d6\u01c8\u0001\u0000\u0000"+
		"\u0000\u01d6\u01cc\u0001\u0000\u0000\u0000\u01d6\u01cd\u0001\u0000\u0000"+
		"\u0000\u01d6\u01ce\u0001\u0000\u0000\u0000\u01d6\u01cf\u0001\u0000\u0000"+
		"\u0000\u01d6\u01d0\u0001\u0000\u0000\u0000\u01d6\u01d1\u0001\u0000\u0000"+
		"\u0000\u01d6\u01d2\u0001\u0000\u0000\u0000\u01d6\u01d3\u0001\u0000\u0000"+
		"\u0000\u01d6\u01d4\u0001\u0000\u0000\u0000\u01d6\u01d5\u0001\u0000\u0000"+
		"\u0000\u01d75\u0001\u0000\u0000\u0000\u01d8\u01d9\u0005\u0017\u0000\u0000"+
		"\u01d9\u01da\u0005(\u0000\u0000\u01da\u01db\u0003(\u0014\u0000\u01db\u01dc"+
		"\u0005)\u0000\u0000\u01dc7\u0001\u0000\u0000\u0000\u01dd\u01de\u0005\u0018"+
		"\u0000\u0000\u01de\u01df\u0005(\u0000\u0000\u01df\u01e0\u0003(\u0014\u0000"+
		"\u01e0\u01e1\u0005)\u0000\u0000\u01e19\u0001\u0000\u0000\u0000\u01e2\u01e3"+
		"\u0005\u0019\u0000\u0000\u01e3\u01e4\u0005(\u0000\u0000\u01e4\u01e5\u0003"+
		"(\u0014\u0000\u01e5\u01e6\u0005)\u0000\u0000\u01e6;\u0001\u0000\u0000"+
		"\u0000\u01e7\u01e8\u0005\u001a\u0000\u0000\u01e8\u01e9\u0005(\u0000\u0000"+
		"\u01e9\u01ea\u0003(\u0014\u0000\u01ea\u01eb\u0005)\u0000\u0000\u01eb="+
		"\u0001\u0000\u0000\u0000\u01ec\u01ed\u0005\u001b\u0000\u0000\u01ed\u01ee"+
		"\u0005(\u0000\u0000\u01ee\u01ef\u0003(\u0014\u0000\u01ef\u01f0\u0005,"+
		"\u0000\u0000\u01f0\u01f1\u0003(\u0014\u0000\u01f1\u01f2\u0001\u0000\u0000"+
		"\u0000\u01f2\u01f3\u0005)\u0000\u0000\u01f3?\u0001\u0000\u0000\u0000\u01f4"+
		"\u01f5\u0005\u001c\u0000\u0000\u01f5\u01f6\u0005(\u0000\u0000\u01f6\u01f7"+
		"\u0003(\u0014\u0000\u01f7\u01f8\u0005)\u0000\u0000\u01f8A\u0001\u0000"+
		"\u0000\u0000\u01f9\u01fa\u0005\u001f\u0000\u0000\u01fa\u01fb\u0005(\u0000"+
		"\u0000\u01fb\u01fc\u0003(\u0014\u0000\u01fc\u01fd\u0005)\u0000\u0000\u01fd"+
		"C\u0001\u0000\u0000\u0000\u01fe\u01ff\u0005\u001e\u0000\u0000\u01ff\u0200"+
		"\u0005(\u0000\u0000\u0200\u0201\u0003(\u0014\u0000\u0201\u0202\u0005)"+
		"\u0000\u0000\u0202E\u0001\u0000\u0000\u0000\u0203\u0204\u0005 \u0000\u0000"+
		"\u0204\u0205\u0005(\u0000\u0000\u0205\u0206\u0003(\u0014\u0000\u0206\u0207"+
		"\u0005)\u0000\u0000\u0207G\u0001\u0000\u0000\u0000\u0208\u0209\u0005\u001d"+
		"\u0000\u0000\u0209\u020a\u0005(\u0000\u0000\u020a\u020b\u0003(\u0014\u0000"+
		"\u020b\u020c\u0005)\u0000\u0000\u020cI\u0001\u0000\u0000\u0000\u020d\u0210"+
		"\u0005&\u0000\u0000\u020e\u0210\u0003\u0004\u0002\u0000\u020f\u020d\u0001"+
		"\u0000\u0000\u0000\u020f\u020e\u0001\u0000\u0000\u0000\u0210K\u0001\u0000"+
		"\u0000\u0000\u0211\u0214\u0003\n\u0005\u0000\u0212\u0214\u0005\'\u0000"+
		"\u0000\u0213\u0211\u0001\u0000\u0000\u0000\u0213\u0212\u0001\u0000\u0000"+
		"\u0000\u0214M\u0001\u0000\u0000\u0000\u0215\u0221\u0003J%\u0000\u0216"+
		"\u0221\u0003P(\u0000\u0217\u0218\u0005(\u0000\u0000\u0218\u0219\u0003"+
		"(\u0014\u0000\u0219\u021a\u0005,\u0000\u0000\u021a\u021b\u0003(\u0014"+
		"\u0000\u021b\u021c\u0005,\u0000\u0000\u021c\u021d\u0003(\u0014\u0000\u021d"+
		"\u021e\u0001\u0000\u0000\u0000\u021e\u021f\u0005)\u0000\u0000\u021f\u0221"+
		"\u0001\u0000\u0000\u0000\u0220\u0215\u0001\u0000\u0000\u0000\u0220\u0216"+
		"\u0001\u0000\u0000\u0000\u0220\u0217\u0001\u0000\u0000\u0000\u0221O\u0001"+
		"\u0000\u0000\u0000\u0222\u0225\u0003\u000e\u0007\u0000\u0223\u0225\u0005"+
		"\'\u0000\u0000\u0224\u0222\u0001\u0000\u0000\u0000\u0224\u0223\u0001\u0000"+
		"\u0000\u0000\u0225Q\u0001\u0000\u0000\u0000\u0226\u0229\u0003\b\u0004"+
		"\u0000\u0227\u0229\u0005\'\u0000\u0000\u0228\u0226\u0001\u0000\u0000\u0000"+
		"\u0228\u0227\u0001\u0000\u0000\u0000\u0229S\u0001\u0000\u0000\u0000\u022a"+
		"\u0231\u0005\'\u0000\u0000\u022b\u0231\u0003P(\u0000\u022c\u0231\u0003"+
		"L&\u0000\u022d\u0231\u0003`0\u0000\u022e\u0231\u0003b1\u0000\u022f\u0231"+
		"\u0003R)\u0000\u0230\u022a\u0001\u0000\u0000\u0000\u0230\u022b\u0001\u0000"+
		"\u0000\u0000\u0230\u022c\u0001\u0000\u0000\u0000\u0230\u022d\u0001\u0000"+
		"\u0000\u0000\u0230\u022e\u0001\u0000\u0000\u0000\u0230\u022f\u0001\u0000"+
		"\u0000\u0000\u0231U\u0001\u0000\u0000\u0000\u0232\u0235\u0005\'\u0000"+
		"\u0000\u0233\u0235\u0003\u0010\b\u0000\u0234\u0232\u0001\u0000\u0000\u0000"+
		"\u0234\u0233\u0001\u0000\u0000\u0000\u0235W\u0001\u0000\u0000\u0000\u0236"+
		"\u0239\u0005\'\u0000\u0000\u0237\u0239\u0003 \u0010\u0000\u0238\u0236"+
		"\u0001\u0000\u0000\u0000\u0238\u0237\u0001\u0000\u0000\u0000\u0239Y\u0001"+
		"\u0000\u0000\u0000\u023a\u023d\u0005\'\u0000\u0000\u023b\u023d\u0003\u001e"+
		"\u000f\u0000\u023c\u023a\u0001\u0000\u0000\u0000\u023c\u023b\u0001\u0000"+
		"\u0000\u0000\u023d[\u0001\u0000\u0000\u0000\u023e\u0241\u0005\'\u0000"+
		"\u0000\u023f\u0241\u0003\"\u0011\u0000\u0240\u023e\u0001\u0000\u0000\u0000"+
		"\u0240\u023f\u0001\u0000\u0000\u0000\u0241]\u0001\u0000\u0000\u0000\u0242"+
		"\u0245\u0005\'\u0000\u0000\u0243\u0245\u0003$\u0012\u0000\u0244\u0242"+
		"\u0001\u0000\u0000\u0000\u0244\u0243\u0001\u0000\u0000\u0000\u0245_\u0001"+
		"\u0000\u0000\u0000\u0246\u0249\u0005\'\u0000\u0000\u0247\u0249\u0003\u0016"+
		"\u000b\u0000\u0248\u0246\u0001\u0000\u0000\u0000\u0248\u0247\u0001\u0000"+
		"\u0000\u0000\u0249a\u0001\u0000\u0000\u0000\u024a\u024d\u0005\'\u0000"+
		"\u0000\u024b\u024d\u0003\u0018\f\u0000\u024c\u024a\u0001\u0000\u0000\u0000"+
		"\u024c\u024b\u0001\u0000\u0000\u0000\u024dc\u0001\u0000\u0000\u0000\u024e"+
		"\u0251\u0005\'\u0000\u0000\u024f\u0251\u0003&\u0013\u0000\u0250\u024e"+
		"\u0001\u0000\u0000\u0000\u0250\u024f\u0001\u0000\u0000\u0000\u0251e\u0001"+
		"\u0000\u0000\u0000\u0252\u0264\u0003b1\u0000\u0253\u0264\u0003\\.\u0000"+
		"\u0254\u0264\u0003L&\u0000\u0255\u0264\u0003\f\u0006\u0000\u0256\u0264"+
		"\u0003R)\u0000\u0257\u0264\u0003J%\u0000\u0258\u0264\u0003^/\u0000\u0259"+
		"\u0264\u0003\u0014\n\u0000\u025a\u0264\u0003\u0006\u0003\u0000\u025b\u0264"+
		"\u0003P(\u0000\u025c\u0264\u0003V+\u0000\u025d\u0264\u0003`0\u0000\u025e"+
		"\u0264\u0003Z-\u0000\u025f\u0264\u0003\u001c\u000e\u0000\u0260\u0264\u0003"+
		"X,\u0000\u0261\u0264\u0003\u001a\r\u0000\u0262\u0264\u0003d2\u0000\u0263"+
		"\u0252\u0001\u0000\u0000\u0000\u0263\u0253\u0001\u0000\u0000\u0000\u0263"+
		"\u0254\u0001\u0000\u0000\u0000\u0263\u0255\u0001\u0000\u0000\u0000\u0263"+
		"\u0256\u0001\u0000\u0000\u0000\u0263\u0257\u0001\u0000\u0000\u0000\u0263"+
		"\u0258\u0001\u0000\u0000\u0000\u0263\u0259\u0001\u0000\u0000\u0000\u0263"+
		"\u025a\u0001\u0000\u0000\u0000\u0263\u025b\u0001\u0000\u0000\u0000\u0263"+
		"\u025c\u0001\u0000\u0000\u0000\u0263\u025d\u0001\u0000\u0000\u0000\u0263"+
		"\u025e\u0001\u0000\u0000\u0000\u0263\u025f\u0001\u0000\u0000\u0000\u0263"+
		"\u0260\u0001\u0000\u0000\u0000\u0263\u0261\u0001\u0000\u0000\u0000\u0263"+
		"\u0262\u0001\u0000\u0000\u0000\u0264g\u0001\u0000\u0000\u0000\'n\u007f"+
		"\u008a\u009c\u00ae\u00cc\u00d7\u00e5\u0103\u010d\u0117\u0139\u014c\u015a"+
		"\u016f\u019b\u019d\u01a3\u01ab\u01ad\u01b4\u01bb\u01c2\u01d6\u020f\u0213"+
		"\u0220\u0224\u0228\u0230\u0234\u0238\u023c\u0240\u0244\u0248\u024c\u0250"+
		"\u0263";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}