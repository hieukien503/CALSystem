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
		SQRT=30, CBRT=31, ABS=32, PI=33, E=34, POINT_ID=35, SHAPE_ID=36, LR=37, 
		RR=38, LC=39, RC=40, COMMA=41, DIVIDE=42, ADD=43, SUB=44, MULTIPLY=45, 
		POWER=46, EQ=47, INT_LIT=48, FLOAT_LIT=49, WS=50;
	public static final int
		RULE_program = 0, RULE_expr = 1, RULE_command = 2, RULE_pointDef = 3, 
		RULE_sphereDef = 4, RULE_planeDef = 5, RULE_lineDef = 6, RULE_angleDef = 7, 
		RULE_vectorDef = 8, RULE_polygonDef = 9, RULE_pointList = 10, RULE_circleDef = 11, 
		RULE_segmentDef = 12, RULE_rayDef = 13, RULE_intersectionDef = 14, RULE_transformDef = 15, 
		RULE_cylinderDef = 16, RULE_tetrahedronDef = 17, RULE_coneDef = 18, RULE_prismDef = 19, 
		RULE_cuboidDef = 20, RULE_numberExpr = 21, RULE_additiveExpr = 22, RULE_multiplicativeExpr = 23, 
		RULE_implicitMultiplicativeExpr = 24, RULE_exponentialExpr = 25, RULE_unaryExpr = 26, 
		RULE_primaryExpr = 27, RULE_sinExpr = 28, RULE_cosExpr = 29, RULE_tanExpr = 30, 
		RULE_cotExpr = 31, RULE_logExpr = 32, RULE_lnExpr = 33, RULE_cbrtExpr = 34, 
		RULE_sqrtExpr = 35, RULE_absExpr = 36, RULE_expExpr = 37, RULE_pointExpr = 38, 
		RULE_lineExpr = 39, RULE_vectorExpr = 40, RULE_planeExpr = 41, RULE_directionExpr = 42, 
		RULE_polygonExpr = 43, RULE_cubodeExpr = 44, RULE_tetrahedronExpr = 45, 
		RULE_cylinderExpr = 46, RULE_coneExpr = 47, RULE_prismExpr = 48, RULE_shapeExpr = 49, 
		RULE_two_side_expr = 50, RULE_varExpr = 51, RULE_varMultiplicativeExpr = 52, 
		RULE_varImplicitMultiplicativeExpr = 53, RULE_varExponentialExpr = 54, 
		RULE_varUnaryExpr = 55, RULE_varPrimaryExpr = 56;
	private static String[] makeRuleNames() {
		return new String[] {
			"program", "expr", "command", "pointDef", "sphereDef", "planeDef", "lineDef", 
			"angleDef", "vectorDef", "polygonDef", "pointList", "circleDef", "segmentDef", 
			"rayDef", "intersectionDef", "transformDef", "cylinderDef", "tetrahedronDef", 
			"coneDef", "prismDef", "cuboidDef", "numberExpr", "additiveExpr", "multiplicativeExpr", 
			"implicitMultiplicativeExpr", "exponentialExpr", "unaryExpr", "primaryExpr", 
			"sinExpr", "cosExpr", "tanExpr", "cotExpr", "logExpr", "lnExpr", "cbrtExpr", 
			"sqrtExpr", "absExpr", "expExpr", "pointExpr", "lineExpr", "vectorExpr", 
			"planeExpr", "directionExpr", "polygonExpr", "cubodeExpr", "tetrahedronExpr", 
			"cylinderExpr", "coneExpr", "prismExpr", "shapeExpr", "two_side_expr", 
			"varExpr", "varMultiplicativeExpr", "varImplicitMultiplicativeExpr", 
			"varExponentialExpr", "varUnaryExpr", "varPrimaryExpr"
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
			"'e'", null, null, "'('", "')'", "'{'", "'}'", "','", "'/'", "'+'", "'-'", 
			"'*'", "'^'", "'='"
		};
	}
	private static final String[] _LITERAL_NAMES = makeLiteralNames();
	private static String[] makeSymbolicNames() {
		return new String[] {
			null, "CIRCLE", "LINE", "VECTOR", "SEGMENT", "RAY", "POLYGON", "POINT", 
			"SPHERE", "PLANE", "INTERSECT", "ANGLE", "TRANSLATE", "ROTATE", "PROJECT", 
			"REFLECT", "ENLARGE", "CYLINDER", "TETRAHEDRON", "PRISM", "PYRAMID", 
			"CUBOID", "CONE", "SIN", "COS", "TAN", "COT", "LOG", "LN", "EXP", "SQRT", 
			"CBRT", "ABS", "PI", "E", "POINT_ID", "SHAPE_ID", "LR", "RR", "LC", "RC", 
			"COMMA", "DIVIDE", "ADD", "SUB", "MULTIPLY", "POWER", "EQ", "INT_LIT", 
			"FLOAT_LIT", "WS"
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
			setState(114);
			expr();
			setState(115);
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
		public CommandContext command() {
			return getRuleContext(CommandContext.class,0);
		}
		public Two_side_exprContext two_side_expr() {
			return getRuleContext(Two_side_exprContext.class,0);
		}
		public PointExprContext pointExpr() {
			return getRuleContext(PointExprContext.class,0);
		}
		public LineExprContext lineExpr() {
			return getRuleContext(LineExprContext.class,0);
		}
		public VectorExprContext vectorExpr() {
			return getRuleContext(VectorExprContext.class,0);
		}
		public PlaneExprContext planeExpr() {
			return getRuleContext(PlaneExprContext.class,0);
		}
		public NumberExprContext numberExpr() {
			return getRuleContext(NumberExprContext.class,0);
		}
		public DirectionExprContext directionExpr() {
			return getRuleContext(DirectionExprContext.class,0);
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
			setState(125);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,0,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(117);
				command();
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(118);
				two_side_expr();
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				setState(119);
				pointExpr();
				}
				break;
			case 4:
				enterOuterAlt(_localctx, 4);
				{
				setState(120);
				lineExpr();
				}
				break;
			case 5:
				enterOuterAlt(_localctx, 5);
				{
				setState(121);
				vectorExpr();
				}
				break;
			case 6:
				enterOuterAlt(_localctx, 6);
				{
				setState(122);
				planeExpr();
				}
				break;
			case 7:
				enterOuterAlt(_localctx, 7);
				{
				setState(123);
				numberExpr();
				}
				break;
			case 8:
				enterOuterAlt(_localctx, 8);
				{
				setState(124);
				directionExpr();
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
	public static class CommandContext extends ParserRuleContext {
		public PointDefContext pointDef() {
			return getRuleContext(PointDefContext.class,0);
		}
		public SphereDefContext sphereDef() {
			return getRuleContext(SphereDefContext.class,0);
		}
		public PlaneDefContext planeDef() {
			return getRuleContext(PlaneDefContext.class,0);
		}
		public LineDefContext lineDef() {
			return getRuleContext(LineDefContext.class,0);
		}
		public AngleDefContext angleDef() {
			return getRuleContext(AngleDefContext.class,0);
		}
		public TransformDefContext transformDef() {
			return getRuleContext(TransformDefContext.class,0);
		}
		public VectorDefContext vectorDef() {
			return getRuleContext(VectorDefContext.class,0);
		}
		public PolygonDefContext polygonDef() {
			return getRuleContext(PolygonDefContext.class,0);
		}
		public CircleDefContext circleDef() {
			return getRuleContext(CircleDefContext.class,0);
		}
		public SegmentDefContext segmentDef() {
			return getRuleContext(SegmentDefContext.class,0);
		}
		public RayDefContext rayDef() {
			return getRuleContext(RayDefContext.class,0);
		}
		public IntersectionDefContext intersectionDef() {
			return getRuleContext(IntersectionDefContext.class,0);
		}
		public CommandContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_command; }
	}

	public final CommandContext command() throws RecognitionException {
		CommandContext _localctx = new CommandContext(_ctx, getState());
		enterRule(_localctx, 4, RULE_command);
		try {
			setState(139);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case POINT:
			case LR:
				enterOuterAlt(_localctx, 1);
				{
				setState(127);
				pointDef();
				}
				break;
			case SPHERE:
				enterOuterAlt(_localctx, 2);
				{
				setState(128);
				sphereDef();
				}
				break;
			case PLANE:
				enterOuterAlt(_localctx, 3);
				{
				setState(129);
				planeDef();
				}
				break;
			case LINE:
				enterOuterAlt(_localctx, 4);
				{
				setState(130);
				lineDef();
				}
				break;
			case ANGLE:
				enterOuterAlt(_localctx, 5);
				{
				setState(131);
				angleDef();
				}
				break;
			case TRANSLATE:
			case ROTATE:
			case PROJECT:
			case REFLECT:
			case ENLARGE:
				enterOuterAlt(_localctx, 6);
				{
				setState(132);
				transformDef();
				}
				break;
			case VECTOR:
				enterOuterAlt(_localctx, 7);
				{
				setState(133);
				vectorDef();
				}
				break;
			case POLYGON:
				enterOuterAlt(_localctx, 8);
				{
				setState(134);
				polygonDef();
				}
				break;
			case CIRCLE:
				enterOuterAlt(_localctx, 9);
				{
				setState(135);
				circleDef();
				}
				break;
			case SEGMENT:
				enterOuterAlt(_localctx, 10);
				{
				setState(136);
				segmentDef();
				}
				break;
			case RAY:
				enterOuterAlt(_localctx, 11);
				{
				setState(137);
				rayDef();
				}
				break;
			case INTERSECT:
				enterOuterAlt(_localctx, 12);
				{
				setState(138);
				intersectionDef();
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
		enterRule(_localctx, 6, RULE_pointDef);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(142);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==POINT) {
				{
				setState(141);
				match(POINT);
				}
			}

			setState(144);
			match(LR);
			{
			setState(145);
			numberExpr();
			setState(146);
			match(COMMA);
			setState(147);
			numberExpr();
			setState(148);
			match(COMMA);
			setState(149);
			numberExpr();
			}
			setState(151);
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
		enterRule(_localctx, 8, RULE_sphereDef);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(153);
			match(SPHERE);
			setState(154);
			match(LR);
			{
			setState(155);
			pointExpr();
			setState(156);
			match(COMMA);
			setState(159);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,3,_ctx) ) {
			case 1:
				{
				setState(157);
				pointExpr();
				}
				break;
			case 2:
				{
				setState(158);
				numberExpr();
				}
				break;
			}
			}
			setState(161);
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
		enterRule(_localctx, 10, RULE_planeDef);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(163);
			match(PLANE);
			setState(164);
			match(LR);
			setState(188);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,5,_ctx) ) {
			case 1:
				{
				setState(165);
				match(SHAPE_ID);
				}
				break;
			case 2:
				{
				{
				setState(166);
				pointExpr();
				setState(167);
				match(COMMA);
				setState(170);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,4,_ctx) ) {
				case 1:
					{
					setState(168);
					planeExpr();
					}
					break;
				case 2:
					{
					setState(169);
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
				setState(172);
				lineExpr();
				setState(173);
				match(COMMA);
				setState(174);
				lineExpr();
				}
				}
				break;
			case 4:
				{
				{
				setState(176);
				pointExpr();
				setState(177);
				match(COMMA);
				setState(178);
				vectorExpr();
				setState(179);
				match(COMMA);
				setState(180);
				vectorExpr();
				}
				}
				break;
			case 5:
				{
				{
				setState(182);
				pointExpr();
				setState(183);
				match(COMMA);
				setState(184);
				pointExpr();
				setState(185);
				match(COMMA);
				setState(186);
				pointExpr();
				}
				}
				break;
			}
			setState(190);
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
		enterRule(_localctx, 12, RULE_lineDef);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(192);
			match(LINE);
			setState(193);
			match(LR);
			setState(206);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,6,_ctx) ) {
			case 1:
				{
				{
				setState(194);
				pointExpr();
				setState(195);
				match(COMMA);
				setState(196);
				pointExpr();
				}
				}
				break;
			case 2:
				{
				{
				setState(198);
				pointExpr();
				setState(199);
				match(COMMA);
				setState(200);
				lineExpr();
				}
				}
				break;
			case 3:
				{
				{
				setState(202);
				pointExpr();
				setState(203);
				match(COMMA);
				setState(204);
				vectorExpr();
				}
				}
				break;
			}
			setState(208);
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
		enterRule(_localctx, 14, RULE_angleDef);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(210);
			match(ANGLE);
			setState(211);
			match(LR);
			setState(236);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,7,_ctx) ) {
			case 1:
				{
				setState(212);
				vectorExpr();
				}
				break;
			case 2:
				{
				setState(213);
				pointExpr();
				}
				break;
			case 3:
				{
				{
				setState(214);
				vectorExpr();
				setState(215);
				match(COMMA);
				setState(216);
				vectorExpr();
				}
				}
				break;
			case 4:
				{
				{
				setState(218);
				lineExpr();
				setState(219);
				match(COMMA);
				setState(220);
				lineExpr();
				}
				}
				break;
			case 5:
				{
				{
				setState(222);
				lineExpr();
				setState(223);
				match(COMMA);
				setState(224);
				planeExpr();
				}
				}
				break;
			case 6:
				{
				{
				setState(226);
				planeExpr();
				setState(227);
				match(COMMA);
				setState(228);
				planeExpr();
				}
				}
				break;
			case 7:
				{
				{
				setState(230);
				pointExpr();
				setState(231);
				match(COMMA);
				setState(232);
				pointExpr();
				setState(233);
				match(COMMA);
				setState(234);
				pointExpr();
				}
				}
				break;
			}
			setState(238);
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
		enterRule(_localctx, 16, RULE_vectorDef);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(240);
			match(VECTOR);
			setState(241);
			match(LR);
			setState(247);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,8,_ctx) ) {
			case 1:
				{
				setState(242);
				pointExpr();
				}
				break;
			case 2:
				{
				{
				setState(243);
				pointExpr();
				setState(244);
				match(COMMA);
				setState(245);
				pointExpr();
				}
				}
				break;
			}
			setState(249);
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
		enterRule(_localctx, 18, RULE_polygonDef);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(251);
			match(POLYGON);
			setState(252);
			match(LR);
			setState(253);
			pointList();
			setState(254);
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
		enterRule(_localctx, 20, RULE_pointList);
		try {
			setState(261);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,9,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(256);
				pointExpr();
				setState(257);
				match(COMMA);
				setState(258);
				pointList();
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(260);
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
		enterRule(_localctx, 22, RULE_circleDef);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(263);
			match(CIRCLE);
			setState(264);
			match(LR);
			setState(287);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,10,_ctx) ) {
			case 1:
				{
				{
				setState(265);
				pointExpr();
				setState(266);
				match(COMMA);
				setState(267);
				numberExpr();
				}
				}
				break;
			case 2:
				{
				{
				setState(269);
				pointExpr();
				setState(270);
				match(COMMA);
				setState(271);
				pointExpr();
				setState(272);
				match(COMMA);
				setState(273);
				pointExpr();
				}
				}
				break;
			case 3:
				{
				{
				setState(275);
				pointExpr();
				setState(276);
				match(COMMA);
				setState(277);
				numberExpr();
				setState(278);
				match(COMMA);
				setState(279);
				directionExpr();
				}
				}
				break;
			case 4:
				{
				{
				setState(281);
				pointExpr();
				setState(282);
				match(COMMA);
				setState(283);
				pointExpr();
				setState(284);
				match(COMMA);
				setState(285);
				directionExpr();
				}
				}
				break;
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
		enterRule(_localctx, 24, RULE_segmentDef);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(291);
			match(SEGMENT);
			setState(292);
			match(LR);
			{
			setState(293);
			pointExpr();
			setState(294);
			match(COMMA);
			setState(297);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,11,_ctx) ) {
			case 1:
				{
				setState(295);
				pointExpr();
				}
				break;
			case 2:
				{
				setState(296);
				numberExpr();
				}
				break;
			}
			}
			setState(299);
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
		enterRule(_localctx, 26, RULE_rayDef);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(301);
			match(RAY);
			setState(302);
			match(LR);
			{
			setState(303);
			pointExpr();
			setState(304);
			match(COMMA);
			setState(307);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case POINT:
			case POINT_ID:
			case LR:
				{
				setState(305);
				pointExpr();
				}
				break;
			case VECTOR:
			case SHAPE_ID:
				{
				setState(306);
				vectorExpr();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			}
			setState(309);
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
		public ExprContext expr() {
			return getRuleContext(ExprContext.class,0);
		}
		public IntersectionDefContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_intersectionDef; }
	}

	public final IntersectionDefContext intersectionDef() throws RecognitionException {
		IntersectionDefContext _localctx = new IntersectionDefContext(_ctx, getState());
		enterRule(_localctx, 28, RULE_intersectionDef);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(311);
			match(INTERSECT);
			setState(312);
			match(LR);
			setState(315);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,13,_ctx) ) {
			case 1:
				{
				setState(313);
				expr();
				}
				break;
			case 2:
				{
				setState(314);
				expr();
				}
				break;
			}
			setState(317);
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
		public VectorExprContext vectorExpr() {
			return getRuleContext(VectorExprContext.class,0);
		}
		public List<ShapeExprContext> shapeExpr() {
			return getRuleContexts(ShapeExprContext.class);
		}
		public ShapeExprContext shapeExpr(int i) {
			return getRuleContext(ShapeExprContext.class,i);
		}
		public NumberExprContext numberExpr() {
			return getRuleContext(NumberExprContext.class,0);
		}
		public PlaneExprContext planeExpr() {
			return getRuleContext(PlaneExprContext.class,0);
		}
		public LineExprContext lineExpr() {
			return getRuleContext(LineExprContext.class,0);
		}
		public TransformDefContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_transformDef; }
	}

	public final TransformDefContext transformDef() throws RecognitionException {
		TransformDefContext _localctx = new TransformDefContext(_ctx, getState());
		enterRule(_localctx, 30, RULE_transformDef);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(369);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case TRANSLATE:
				{
				{
				setState(319);
				match(TRANSLATE);
				setState(320);
				match(LR);
				{
				setState(321);
				pointExpr();
				setState(322);
				match(COMMA);
				setState(323);
				vectorExpr();
				}
				setState(325);
				match(RR);
				}
				}
				break;
			case ROTATE:
				{
				{
				setState(327);
				match(ROTATE);
				setState(328);
				match(LR);
				{
				setState(329);
				shapeExpr();
				setState(330);
				match(COMMA);
				setState(331);
				numberExpr();
				setState(334);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==COMMA) {
					{
					setState(332);
					match(COMMA);
					setState(333);
					shapeExpr();
					}
				}

				}
				setState(336);
				match(RR);
				}
				}
				break;
			case PROJECT:
				{
				{
				setState(338);
				match(PROJECT);
				setState(339);
				match(LR);
				{
				setState(340);
				pointExpr();
				setState(341);
				match(COMMA);
				setState(344);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,15,_ctx) ) {
				case 1:
					{
					setState(342);
					planeExpr();
					}
					break;
				case 2:
					{
					setState(343);
					lineExpr();
					}
					break;
				}
				}
				setState(346);
				match(RR);
				}
				}
				break;
			case REFLECT:
				{
				{
				setState(348);
				match(REFLECT);
				setState(349);
				match(LR);
				{
				setState(350);
				pointExpr();
				setState(351);
				match(COMMA);
				setState(355);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,16,_ctx) ) {
				case 1:
					{
					setState(352);
					planeExpr();
					}
					break;
				case 2:
					{
					setState(353);
					lineExpr();
					}
					break;
				case 3:
					{
					setState(354);
					pointExpr();
					}
					break;
				}
				}
				setState(357);
				match(RR);
				}
				}
				break;
			case ENLARGE:
				{
				{
				setState(359);
				match(ENLARGE);
				setState(360);
				match(LR);
				{
				setState(361);
				shapeExpr();
				setState(362);
				match(COMMA);
				setState(363);
				numberExpr();
				setState(364);
				match(COMMA);
				setState(365);
				pointExpr();
				}
				setState(367);
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
		enterRule(_localctx, 32, RULE_cylinderDef);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(371);
			match(CYLINDER);
			setState(372);
			match(LR);
			{
			setState(373);
			pointExpr();
			setState(374);
			match(COMMA);
			setState(375);
			pointExpr();
			setState(376);
			match(COMMA);
			setState(377);
			numberExpr();
			}
			setState(379);
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
		public PolygonExprContext polygonExpr() {
			return getRuleContext(PolygonExprContext.class,0);
		}
		public TerminalNode COMMA() { return getToken(MathCommandParser.COMMA, 0); }
		public PointExprContext pointExpr() {
			return getRuleContext(PointExprContext.class,0);
		}
		public TetrahedronDefContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_tetrahedronDef; }
	}

	public final TetrahedronDefContext tetrahedronDef() throws RecognitionException {
		TetrahedronDefContext _localctx = new TetrahedronDefContext(_ctx, getState());
		enterRule(_localctx, 34, RULE_tetrahedronDef);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(381);
			match(TETRAHEDRON);
			setState(382);
			match(LR);
			{
			setState(383);
			polygonExpr();
			setState(384);
			match(COMMA);
			setState(385);
			pointExpr();
			}
			setState(387);
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
		enterRule(_localctx, 36, RULE_coneDef);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(389);
			match(CONE);
			setState(390);
			match(LR);
			{
			setState(391);
			pointExpr();
			setState(392);
			match(COMMA);
			setState(393);
			numberExpr();
			setState(394);
			match(COMMA);
			setState(395);
			pointExpr();
			}
			setState(397);
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
		enterRule(_localctx, 38, RULE_prismDef);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(399);
			match(PRISM);
			setState(400);
			match(LR);
			{
			setState(401);
			polygonExpr();
			setState(402);
			match(COMMA);
			setState(403);
			directionExpr();
			}
			setState(405);
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
	public static class CuboidDefContext extends ParserRuleContext {
		public TerminalNode CUBOID() { return getToken(MathCommandParser.CUBOID, 0); }
		public TerminalNode LR() { return getToken(MathCommandParser.LR, 0); }
		public TerminalNode RR() { return getToken(MathCommandParser.RR, 0); }
		public PointExprContext pointExpr() {
			return getRuleContext(PointExprContext.class,0);
		}
		public List<TerminalNode> COMMA() { return getTokens(MathCommandParser.COMMA); }
		public TerminalNode COMMA(int i) {
			return getToken(MathCommandParser.COMMA, i);
		}
		public List<NumberExprContext> numberExpr() {
			return getRuleContexts(NumberExprContext.class);
		}
		public NumberExprContext numberExpr(int i) {
			return getRuleContext(NumberExprContext.class,i);
		}
		public CuboidDefContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_cuboidDef; }
	}

	public final CuboidDefContext cuboidDef() throws RecognitionException {
		CuboidDefContext _localctx = new CuboidDefContext(_ctx, getState());
		enterRule(_localctx, 40, RULE_cuboidDef);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(407);
			match(CUBOID);
			setState(408);
			match(LR);
			{
			setState(409);
			pointExpr();
			setState(410);
			match(COMMA);
			setState(411);
			numberExpr();
			setState(419);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==COMMA) {
				{
				setState(412);
				match(COMMA);
				setState(413);
				numberExpr();
				setState(414);
				match(COMMA);
				setState(415);
				numberExpr();
				setState(416);
				match(COMMA);
				setState(417);
				numberExpr();
				}
			}

			}
			setState(421);
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
		enterRule(_localctx, 42, RULE_numberExpr);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(423);
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
		int _startState = 44;
		enterRecursionRule(_localctx, 44, RULE_additiveExpr, _p);
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			{
			setState(426);
			multiplicativeExpr(0);
			}
			_ctx.stop = _input.LT(-1);
			setState(436);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,20,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					if ( _parseListeners!=null ) triggerExitRuleEvent();
					_prevctx = _localctx;
					{
					setState(434);
					_errHandler.sync(this);
					switch ( getInterpreter().adaptivePredict(_input,19,_ctx) ) {
					case 1:
						{
						_localctx = new AdditiveExprContext(_parentctx, _parentState);
						pushNewRecursionContext(_localctx, _startState, RULE_additiveExpr);
						setState(428);
						if (!(precpred(_ctx, 3))) throw new FailedPredicateException(this, "precpred(_ctx, 3)");
						setState(429);
						match(ADD);
						setState(430);
						multiplicativeExpr(0);
						}
						break;
					case 2:
						{
						_localctx = new AdditiveExprContext(_parentctx, _parentState);
						pushNewRecursionContext(_localctx, _startState, RULE_additiveExpr);
						setState(431);
						if (!(precpred(_ctx, 2))) throw new FailedPredicateException(this, "precpred(_ctx, 2)");
						setState(432);
						match(SUB);
						setState(433);
						multiplicativeExpr(0);
						}
						break;
					}
					} 
				}
				setState(438);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,20,_ctx);
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
		int _startState = 46;
		enterRecursionRule(_localctx, 46, RULE_multiplicativeExpr, _p);
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(442);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,21,_ctx) ) {
			case 1:
				{
				setState(440);
				implicitMultiplicativeExpr();
				}
				break;
			case 2:
				{
				setState(441);
				exponentialExpr();
				}
				break;
			}
			_ctx.stop = _input.LT(-1);
			setState(452);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,23,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					if ( _parseListeners!=null ) triggerExitRuleEvent();
					_prevctx = _localctx;
					{
					setState(450);
					_errHandler.sync(this);
					switch ( getInterpreter().adaptivePredict(_input,22,_ctx) ) {
					case 1:
						{
						_localctx = new MultiplicativeExprContext(_parentctx, _parentState);
						pushNewRecursionContext(_localctx, _startState, RULE_multiplicativeExpr);
						setState(444);
						if (!(precpred(_ctx, 4))) throw new FailedPredicateException(this, "precpred(_ctx, 4)");
						setState(445);
						match(MULTIPLY);
						setState(446);
						exponentialExpr();
						}
						break;
					case 2:
						{
						_localctx = new MultiplicativeExprContext(_parentctx, _parentState);
						pushNewRecursionContext(_localctx, _startState, RULE_multiplicativeExpr);
						setState(447);
						if (!(precpred(_ctx, 3))) throw new FailedPredicateException(this, "precpred(_ctx, 3)");
						setState(448);
						match(DIVIDE);
						setState(449);
						exponentialExpr();
						}
						break;
					}
					} 
				}
				setState(454);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,23,_ctx);
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
		enterRule(_localctx, 48, RULE_implicitMultiplicativeExpr);
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(455);
			primaryExpr();
			setState(457); 
			_errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					setState(456);
					primaryExpr();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				setState(459); 
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,24,_ctx);
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
		enterRule(_localctx, 50, RULE_exponentialExpr);
		try {
			setState(466);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,25,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(461);
				unaryExpr();
				setState(462);
				match(POWER);
				setState(463);
				exponentialExpr();
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(465);
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
		enterRule(_localctx, 52, RULE_unaryExpr);
		try {
			setState(473);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case SUB:
				enterOuterAlt(_localctx, 1);
				{
				setState(468);
				match(SUB);
				setState(469);
				unaryExpr();
				}
				break;
			case ADD:
				enterOuterAlt(_localctx, 2);
				{
				setState(470);
				match(ADD);
				setState(471);
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
				setState(472);
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
		enterRule(_localctx, 54, RULE_primaryExpr);
		try {
			setState(493);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case INT_LIT:
				enterOuterAlt(_localctx, 1);
				{
				setState(475);
				match(INT_LIT);
				}
				break;
			case FLOAT_LIT:
				enterOuterAlt(_localctx, 2);
				{
				setState(476);
				match(FLOAT_LIT);
				}
				break;
			case PI:
				enterOuterAlt(_localctx, 3);
				{
				setState(477);
				match(PI);
				}
				break;
			case E:
				enterOuterAlt(_localctx, 4);
				{
				setState(478);
				match(E);
				}
				break;
			case LR:
				enterOuterAlt(_localctx, 5);
				{
				setState(479);
				match(LR);
				setState(480);
				numberExpr();
				setState(481);
				match(RR);
				}
				break;
			case SIN:
				enterOuterAlt(_localctx, 6);
				{
				setState(483);
				sinExpr();
				}
				break;
			case COS:
				enterOuterAlt(_localctx, 7);
				{
				setState(484);
				cosExpr();
				}
				break;
			case TAN:
				enterOuterAlt(_localctx, 8);
				{
				setState(485);
				tanExpr();
				}
				break;
			case COT:
				enterOuterAlt(_localctx, 9);
				{
				setState(486);
				cotExpr();
				}
				break;
			case LOG:
				enterOuterAlt(_localctx, 10);
				{
				setState(487);
				logExpr();
				}
				break;
			case LN:
				enterOuterAlt(_localctx, 11);
				{
				setState(488);
				lnExpr();
				}
				break;
			case EXP:
				enterOuterAlt(_localctx, 12);
				{
				setState(489);
				expExpr();
				}
				break;
			case ABS:
				enterOuterAlt(_localctx, 13);
				{
				setState(490);
				absExpr();
				}
				break;
			case SQRT:
				enterOuterAlt(_localctx, 14);
				{
				setState(491);
				sqrtExpr();
				}
				break;
			case CBRT:
				enterOuterAlt(_localctx, 15);
				{
				setState(492);
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
		enterRule(_localctx, 56, RULE_sinExpr);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(495);
			match(SIN);
			setState(496);
			match(LR);
			setState(497);
			numberExpr();
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
		enterRule(_localctx, 58, RULE_cosExpr);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(500);
			match(COS);
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
		enterRule(_localctx, 60, RULE_tanExpr);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(505);
			match(TAN);
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
		enterRule(_localctx, 62, RULE_cotExpr);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(510);
			match(COT);
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
		enterRule(_localctx, 64, RULE_logExpr);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(515);
			match(LOG);
			setState(516);
			match(LR);
			{
			setState(517);
			numberExpr();
			setState(518);
			match(COMMA);
			setState(519);
			numberExpr();
			}
			setState(521);
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
		enterRule(_localctx, 66, RULE_lnExpr);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(523);
			match(LN);
			setState(524);
			match(LR);
			setState(525);
			numberExpr();
			setState(526);
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
		enterRule(_localctx, 68, RULE_cbrtExpr);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(528);
			match(CBRT);
			setState(529);
			match(LR);
			setState(530);
			numberExpr();
			setState(531);
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
		enterRule(_localctx, 70, RULE_sqrtExpr);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(533);
			match(SQRT);
			setState(534);
			match(LR);
			setState(535);
			numberExpr();
			setState(536);
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
		enterRule(_localctx, 72, RULE_absExpr);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(538);
			match(ABS);
			setState(539);
			match(LR);
			setState(540);
			numberExpr();
			setState(541);
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
		enterRule(_localctx, 74, RULE_expExpr);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(543);
			match(EXP);
			setState(544);
			match(LR);
			setState(545);
			numberExpr();
			setState(546);
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
		enterRule(_localctx, 76, RULE_pointExpr);
		try {
			setState(550);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case POINT_ID:
				enterOuterAlt(_localctx, 1);
				{
				setState(548);
				match(POINT_ID);
				}
				break;
			case POINT:
			case LR:
				enterOuterAlt(_localctx, 2);
				{
				setState(549);
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
		public List<TerminalNode> SHAPE_ID() { return getTokens(MathCommandParser.SHAPE_ID); }
		public TerminalNode SHAPE_ID(int i) {
			return getToken(MathCommandParser.SHAPE_ID, i);
		}
		public TerminalNode ADD() { return getToken(MathCommandParser.ADD, 0); }
		public TerminalNode SUB() { return getToken(MathCommandParser.SUB, 0); }
		public PointExprContext pointExpr() {
			return getRuleContext(PointExprContext.class,0);
		}
		public List<VectorDefContext> vectorDef() {
			return getRuleContexts(VectorDefContext.class);
		}
		public VectorDefContext vectorDef(int i) {
			return getRuleContext(VectorDefContext.class,i);
		}
		public List<TerminalNode> LR() { return getTokens(MathCommandParser.LR); }
		public TerminalNode LR(int i) {
			return getToken(MathCommandParser.LR, i);
		}
		public TerminalNode MULTIPLY() { return getToken(MathCommandParser.MULTIPLY, 0); }
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
		public TerminalNode RR() { return getToken(MathCommandParser.RR, 0); }
		public LineExprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_lineExpr; }
	}

	public final LineExprContext lineExpr() throws RecognitionException {
		LineExprContext _localctx = new LineExprContext(_ctx, getState());
		enterRule(_localctx, 78, RULE_lineExpr);
		int _la;
		try {
			setState(598);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,33,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(552);
				lineDef();
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(553);
				match(SHAPE_ID);
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				setState(596);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,32,_ctx) ) {
				case 1:
					{
					setState(563);
					_errHandler.sync(this);
					switch ( getInterpreter().adaptivePredict(_input,29,_ctx) ) {
					case 1:
						{
						setState(554);
						pointExpr();
						}
						break;
					case 2:
						{
						setState(555);
						vectorDef();
						}
						break;
					case 3:
						{
						setState(556);
						match(LR);
						{
						setState(557);
						numberExpr();
						setState(558);
						match(COMMA);
						setState(559);
						numberExpr();
						setState(560);
						match(COMMA);
						setState(561);
						numberExpr();
						}
						}
						break;
					}
					setState(565);
					_la = _input.LA(1);
					if ( !(_la==ADD || _la==SUB) ) {
					_errHandler.recoverInline(this);
					}
					else {
						if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
						_errHandler.reportMatch(this);
						consume();
					}
					{
					setState(566);
					match(SHAPE_ID);
					setState(567);
					match(MULTIPLY);
					setState(579);
					_errHandler.sync(this);
					switch (_input.LA(1)) {
					case VECTOR:
						{
						setState(568);
						vectorDef();
						}
						break;
					case SHAPE_ID:
						{
						setState(569);
						match(SHAPE_ID);
						}
						break;
					case LR:
						{
						setState(570);
						match(LR);
						{
						setState(571);
						numberExpr();
						setState(572);
						match(COMMA);
						setState(573);
						numberExpr();
						setState(574);
						match(COMMA);
						setState(575);
						numberExpr();
						}
						setState(577);
						match(RR);
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					}
					}
					break;
				case 2:
					{
					{
					setState(592);
					_errHandler.sync(this);
					switch (_input.LA(1)) {
					case VECTOR:
						{
						setState(581);
						vectorDef();
						}
						break;
					case SHAPE_ID:
						{
						setState(582);
						match(SHAPE_ID);
						}
						break;
					case LR:
						{
						setState(583);
						match(LR);
						{
						setState(584);
						numberExpr();
						setState(585);
						match(COMMA);
						setState(586);
						numberExpr();
						setState(587);
						match(COMMA);
						setState(588);
						numberExpr();
						}
						setState(590);
						match(RR);
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					setState(594);
					match(MULTIPLY);
					setState(595);
					match(SHAPE_ID);
					}
					}
					break;
				}
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
			setState(602);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case VECTOR:
				enterOuterAlt(_localctx, 1);
				{
				setState(600);
				vectorDef();
				}
				break;
			case SHAPE_ID:
				enterOuterAlt(_localctx, 2);
				{
				setState(601);
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
			setState(606);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case PLANE:
				enterOuterAlt(_localctx, 1);
				{
				setState(604);
				planeDef();
				}
				break;
			case SHAPE_ID:
				enterOuterAlt(_localctx, 2);
				{
				setState(605);
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
		public VectorDefContext vectorDef() {
			return getRuleContext(VectorDefContext.class,0);
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
			setState(610);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case SHAPE_ID:
				enterOuterAlt(_localctx, 1);
				{
				setState(608);
				match(SHAPE_ID);
				}
				break;
			case VECTOR:
				enterOuterAlt(_localctx, 2);
				{
				setState(609);
				vectorDef();
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
			setState(614);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case SHAPE_ID:
				enterOuterAlt(_localctx, 1);
				{
				setState(612);
				match(SHAPE_ID);
				}
				break;
			case POLYGON:
				enterOuterAlt(_localctx, 2);
				{
				setState(613);
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
	public static class CubodeExprContext extends ParserRuleContext {
		public TerminalNode SHAPE_ID() { return getToken(MathCommandParser.SHAPE_ID, 0); }
		public CuboidDefContext cuboidDef() {
			return getRuleContext(CuboidDefContext.class,0);
		}
		public CubodeExprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_cubodeExpr; }
	}

	public final CubodeExprContext cubodeExpr() throws RecognitionException {
		CubodeExprContext _localctx = new CubodeExprContext(_ctx, getState());
		enterRule(_localctx, 88, RULE_cubodeExpr);
		try {
			setState(618);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case SHAPE_ID:
				enterOuterAlt(_localctx, 1);
				{
				setState(616);
				match(SHAPE_ID);
				}
				break;
			case CUBOID:
				enterOuterAlt(_localctx, 2);
				{
				setState(617);
				cuboidDef();
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
		enterRule(_localctx, 90, RULE_tetrahedronExpr);
		try {
			setState(622);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case SHAPE_ID:
				enterOuterAlt(_localctx, 1);
				{
				setState(620);
				match(SHAPE_ID);
				}
				break;
			case TETRAHEDRON:
				enterOuterAlt(_localctx, 2);
				{
				setState(621);
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
		enterRule(_localctx, 92, RULE_cylinderExpr);
		try {
			setState(626);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case SHAPE_ID:
				enterOuterAlt(_localctx, 1);
				{
				setState(624);
				match(SHAPE_ID);
				}
				break;
			case CYLINDER:
				enterOuterAlt(_localctx, 2);
				{
				setState(625);
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
		enterRule(_localctx, 94, RULE_coneExpr);
		try {
			setState(630);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case SHAPE_ID:
				enterOuterAlt(_localctx, 1);
				{
				setState(628);
				match(SHAPE_ID);
				}
				break;
			case CONE:
				enterOuterAlt(_localctx, 2);
				{
				setState(629);
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
		enterRule(_localctx, 96, RULE_prismExpr);
		try {
			setState(634);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case SHAPE_ID:
				enterOuterAlt(_localctx, 1);
				{
				setState(632);
				match(SHAPE_ID);
				}
				break;
			case PRISM:
				enterOuterAlt(_localctx, 2);
				{
				setState(633);
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
	public static class ShapeExprContext extends ParserRuleContext {
		public PointExprContext pointExpr() {
			return getRuleContext(PointExprContext.class,0);
		}
		public LineExprContext lineExpr() {
			return getRuleContext(LineExprContext.class,0);
		}
		public VectorExprContext vectorExpr() {
			return getRuleContext(VectorExprContext.class,0);
		}
		public PolygonExprContext polygonExpr() {
			return getRuleContext(PolygonExprContext.class,0);
		}
		public PlaneExprContext planeExpr() {
			return getRuleContext(PlaneExprContext.class,0);
		}
		public DirectionExprContext directionExpr() {
			return getRuleContext(DirectionExprContext.class,0);
		}
		public CubodeExprContext cubodeExpr() {
			return getRuleContext(CubodeExprContext.class,0);
		}
		public TetrahedronExprContext tetrahedronExpr() {
			return getRuleContext(TetrahedronExprContext.class,0);
		}
		public CylinderExprContext cylinderExpr() {
			return getRuleContext(CylinderExprContext.class,0);
		}
		public ConeExprContext coneExpr() {
			return getRuleContext(ConeExprContext.class,0);
		}
		public PrismExprContext prismExpr() {
			return getRuleContext(PrismExprContext.class,0);
		}
		public ShapeExprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_shapeExpr; }
	}

	public final ShapeExprContext shapeExpr() throws RecognitionException {
		ShapeExprContext _localctx = new ShapeExprContext(_ctx, getState());
		enterRule(_localctx, 98, RULE_shapeExpr);
		try {
			setState(647);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,43,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(636);
				pointExpr();
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(637);
				lineExpr();
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				setState(638);
				vectorExpr();
				}
				break;
			case 4:
				enterOuterAlt(_localctx, 4);
				{
				setState(639);
				polygonExpr();
				}
				break;
			case 5:
				enterOuterAlt(_localctx, 5);
				{
				setState(640);
				planeExpr();
				}
				break;
			case 6:
				enterOuterAlt(_localctx, 6);
				{
				setState(641);
				directionExpr();
				}
				break;
			case 7:
				enterOuterAlt(_localctx, 7);
				{
				setState(642);
				cubodeExpr();
				}
				break;
			case 8:
				enterOuterAlt(_localctx, 8);
				{
				setState(643);
				tetrahedronExpr();
				}
				break;
			case 9:
				enterOuterAlt(_localctx, 9);
				{
				setState(644);
				cylinderExpr();
				}
				break;
			case 10:
				enterOuterAlt(_localctx, 10);
				{
				setState(645);
				coneExpr();
				}
				break;
			case 11:
				enterOuterAlt(_localctx, 11);
				{
				setState(646);
				prismExpr();
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
	public static class Two_side_exprContext extends ParserRuleContext {
		public List<VarExprContext> varExpr() {
			return getRuleContexts(VarExprContext.class);
		}
		public VarExprContext varExpr(int i) {
			return getRuleContext(VarExprContext.class,i);
		}
		public TerminalNode EQ() { return getToken(MathCommandParser.EQ, 0); }
		public Two_side_exprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_two_side_expr; }
	}

	public final Two_side_exprContext two_side_expr() throws RecognitionException {
		Two_side_exprContext _localctx = new Two_side_exprContext(_ctx, getState());
		enterRule(_localctx, 100, RULE_two_side_expr);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(649);
			varExpr(0);
			setState(650);
			match(EQ);
			setState(651);
			varExpr(0);
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
	public static class VarExprContext extends ParserRuleContext {
		public VarMultiplicativeExprContext varMultiplicativeExpr() {
			return getRuleContext(VarMultiplicativeExprContext.class,0);
		}
		public VarExprContext varExpr() {
			return getRuleContext(VarExprContext.class,0);
		}
		public TerminalNode ADD() { return getToken(MathCommandParser.ADD, 0); }
		public TerminalNode SUB() { return getToken(MathCommandParser.SUB, 0); }
		public VarExprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_varExpr; }
	}

	public final VarExprContext varExpr() throws RecognitionException {
		return varExpr(0);
	}

	private VarExprContext varExpr(int _p) throws RecognitionException {
		ParserRuleContext _parentctx = _ctx;
		int _parentState = getState();
		VarExprContext _localctx = new VarExprContext(_ctx, _parentState);
		VarExprContext _prevctx = _localctx;
		int _startState = 102;
		enterRecursionRule(_localctx, 102, RULE_varExpr, _p);
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			{
			setState(654);
			varMultiplicativeExpr(0);
			}
			_ctx.stop = _input.LT(-1);
			setState(664);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,45,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					if ( _parseListeners!=null ) triggerExitRuleEvent();
					_prevctx = _localctx;
					{
					setState(662);
					_errHandler.sync(this);
					switch ( getInterpreter().adaptivePredict(_input,44,_ctx) ) {
					case 1:
						{
						_localctx = new VarExprContext(_parentctx, _parentState);
						pushNewRecursionContext(_localctx, _startState, RULE_varExpr);
						setState(656);
						if (!(precpred(_ctx, 3))) throw new FailedPredicateException(this, "precpred(_ctx, 3)");
						setState(657);
						match(ADD);
						setState(658);
						varMultiplicativeExpr(0);
						}
						break;
					case 2:
						{
						_localctx = new VarExprContext(_parentctx, _parentState);
						pushNewRecursionContext(_localctx, _startState, RULE_varExpr);
						setState(659);
						if (!(precpred(_ctx, 2))) throw new FailedPredicateException(this, "precpred(_ctx, 2)");
						setState(660);
						match(SUB);
						setState(661);
						varMultiplicativeExpr(0);
						}
						break;
					}
					} 
				}
				setState(666);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,45,_ctx);
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
	public static class VarMultiplicativeExprContext extends ParserRuleContext {
		public VarImplicitMultiplicativeExprContext varImplicitMultiplicativeExpr() {
			return getRuleContext(VarImplicitMultiplicativeExprContext.class,0);
		}
		public VarExponentialExprContext varExponentialExpr() {
			return getRuleContext(VarExponentialExprContext.class,0);
		}
		public VarMultiplicativeExprContext varMultiplicativeExpr() {
			return getRuleContext(VarMultiplicativeExprContext.class,0);
		}
		public TerminalNode MULTIPLY() { return getToken(MathCommandParser.MULTIPLY, 0); }
		public TerminalNode DIVIDE() { return getToken(MathCommandParser.DIVIDE, 0); }
		public VarMultiplicativeExprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_varMultiplicativeExpr; }
	}

	public final VarMultiplicativeExprContext varMultiplicativeExpr() throws RecognitionException {
		return varMultiplicativeExpr(0);
	}

	private VarMultiplicativeExprContext varMultiplicativeExpr(int _p) throws RecognitionException {
		ParserRuleContext _parentctx = _ctx;
		int _parentState = getState();
		VarMultiplicativeExprContext _localctx = new VarMultiplicativeExprContext(_ctx, _parentState);
		VarMultiplicativeExprContext _prevctx = _localctx;
		int _startState = 104;
		enterRecursionRule(_localctx, 104, RULE_varMultiplicativeExpr, _p);
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(670);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,46,_ctx) ) {
			case 1:
				{
				setState(668);
				varImplicitMultiplicativeExpr();
				}
				break;
			case 2:
				{
				setState(669);
				varExponentialExpr();
				}
				break;
			}
			_ctx.stop = _input.LT(-1);
			setState(680);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,48,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					if ( _parseListeners!=null ) triggerExitRuleEvent();
					_prevctx = _localctx;
					{
					setState(678);
					_errHandler.sync(this);
					switch ( getInterpreter().adaptivePredict(_input,47,_ctx) ) {
					case 1:
						{
						_localctx = new VarMultiplicativeExprContext(_parentctx, _parentState);
						pushNewRecursionContext(_localctx, _startState, RULE_varMultiplicativeExpr);
						setState(672);
						if (!(precpred(_ctx, 4))) throw new FailedPredicateException(this, "precpred(_ctx, 4)");
						setState(673);
						match(MULTIPLY);
						setState(674);
						varExponentialExpr();
						}
						break;
					case 2:
						{
						_localctx = new VarMultiplicativeExprContext(_parentctx, _parentState);
						pushNewRecursionContext(_localctx, _startState, RULE_varMultiplicativeExpr);
						setState(675);
						if (!(precpred(_ctx, 3))) throw new FailedPredicateException(this, "precpred(_ctx, 3)");
						setState(676);
						match(DIVIDE);
						setState(677);
						varExponentialExpr();
						}
						break;
					}
					} 
				}
				setState(682);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,48,_ctx);
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
	public static class VarImplicitMultiplicativeExprContext extends ParserRuleContext {
		public List<VarPrimaryExprContext> varPrimaryExpr() {
			return getRuleContexts(VarPrimaryExprContext.class);
		}
		public VarPrimaryExprContext varPrimaryExpr(int i) {
			return getRuleContext(VarPrimaryExprContext.class,i);
		}
		public VarImplicitMultiplicativeExprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_varImplicitMultiplicativeExpr; }
	}

	public final VarImplicitMultiplicativeExprContext varImplicitMultiplicativeExpr() throws RecognitionException {
		VarImplicitMultiplicativeExprContext _localctx = new VarImplicitMultiplicativeExprContext(_ctx, getState());
		enterRule(_localctx, 106, RULE_varImplicitMultiplicativeExpr);
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(683);
			varPrimaryExpr();
			setState(685); 
			_errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					setState(684);
					varPrimaryExpr();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				setState(687); 
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,49,_ctx);
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
	public static class VarExponentialExprContext extends ParserRuleContext {
		public VarUnaryExprContext varUnaryExpr() {
			return getRuleContext(VarUnaryExprContext.class,0);
		}
		public TerminalNode POWER() { return getToken(MathCommandParser.POWER, 0); }
		public VarExponentialExprContext varExponentialExpr() {
			return getRuleContext(VarExponentialExprContext.class,0);
		}
		public VarExponentialExprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_varExponentialExpr; }
	}

	public final VarExponentialExprContext varExponentialExpr() throws RecognitionException {
		VarExponentialExprContext _localctx = new VarExponentialExprContext(_ctx, getState());
		enterRule(_localctx, 108, RULE_varExponentialExpr);
		try {
			setState(694);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,50,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(689);
				varUnaryExpr();
				setState(690);
				match(POWER);
				setState(691);
				varExponentialExpr();
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(693);
				varUnaryExpr();
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
	public static class VarUnaryExprContext extends ParserRuleContext {
		public TerminalNode SUB() { return getToken(MathCommandParser.SUB, 0); }
		public VarUnaryExprContext varUnaryExpr() {
			return getRuleContext(VarUnaryExprContext.class,0);
		}
		public TerminalNode ADD() { return getToken(MathCommandParser.ADD, 0); }
		public VarPrimaryExprContext varPrimaryExpr() {
			return getRuleContext(VarPrimaryExprContext.class,0);
		}
		public VarUnaryExprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_varUnaryExpr; }
	}

	public final VarUnaryExprContext varUnaryExpr() throws RecognitionException {
		VarUnaryExprContext _localctx = new VarUnaryExprContext(_ctx, getState());
		enterRule(_localctx, 110, RULE_varUnaryExpr);
		try {
			setState(701);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case SUB:
				enterOuterAlt(_localctx, 1);
				{
				setState(696);
				match(SUB);
				setState(697);
				varUnaryExpr();
				}
				break;
			case ADD:
				enterOuterAlt(_localctx, 2);
				{
				setState(698);
				match(ADD);
				setState(699);
				varUnaryExpr();
				}
				break;
			case LINE:
			case VECTOR:
			case POLYGON:
			case POINT:
			case PLANE:
			case CYLINDER:
			case TETRAHEDRON:
			case PRISM:
			case CUBOID:
			case CONE:
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
			case POINT_ID:
			case SHAPE_ID:
			case LR:
			case INT_LIT:
			case FLOAT_LIT:
				enterOuterAlt(_localctx, 3);
				{
				setState(700);
				varPrimaryExpr();
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
	public static class VarPrimaryExprContext extends ParserRuleContext {
		public TerminalNode INT_LIT() { return getToken(MathCommandParser.INT_LIT, 0); }
		public TerminalNode FLOAT_LIT() { return getToken(MathCommandParser.FLOAT_LIT, 0); }
		public TerminalNode PI() { return getToken(MathCommandParser.PI, 0); }
		public TerminalNode E() { return getToken(MathCommandParser.E, 0); }
		public ShapeExprContext shapeExpr() {
			return getRuleContext(ShapeExprContext.class,0);
		}
		public TerminalNode LR() { return getToken(MathCommandParser.LR, 0); }
		public VarExprContext varExpr() {
			return getRuleContext(VarExprContext.class,0);
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
		public VarPrimaryExprContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_varPrimaryExpr; }
	}

	public final VarPrimaryExprContext varPrimaryExpr() throws RecognitionException {
		VarPrimaryExprContext _localctx = new VarPrimaryExprContext(_ctx, getState());
		enterRule(_localctx, 112, RULE_varPrimaryExpr);
		try {
			setState(722);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,52,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(703);
				match(INT_LIT);
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(704);
				match(FLOAT_LIT);
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				setState(705);
				match(PI);
				}
				break;
			case 4:
				enterOuterAlt(_localctx, 4);
				{
				setState(706);
				match(E);
				}
				break;
			case 5:
				enterOuterAlt(_localctx, 5);
				{
				setState(707);
				shapeExpr();
				}
				break;
			case 6:
				enterOuterAlt(_localctx, 6);
				{
				setState(708);
				match(LR);
				setState(709);
				varExpr(0);
				setState(710);
				match(RR);
				}
				break;
			case 7:
				enterOuterAlt(_localctx, 7);
				{
				setState(712);
				sinExpr();
				}
				break;
			case 8:
				enterOuterAlt(_localctx, 8);
				{
				setState(713);
				cosExpr();
				}
				break;
			case 9:
				enterOuterAlt(_localctx, 9);
				{
				setState(714);
				tanExpr();
				}
				break;
			case 10:
				enterOuterAlt(_localctx, 10);
				{
				setState(715);
				cotExpr();
				}
				break;
			case 11:
				enterOuterAlt(_localctx, 11);
				{
				setState(716);
				logExpr();
				}
				break;
			case 12:
				enterOuterAlt(_localctx, 12);
				{
				setState(717);
				lnExpr();
				}
				break;
			case 13:
				enterOuterAlt(_localctx, 13);
				{
				setState(718);
				expExpr();
				}
				break;
			case 14:
				enterOuterAlt(_localctx, 14);
				{
				setState(719);
				absExpr();
				}
				break;
			case 15:
				enterOuterAlt(_localctx, 15);
				{
				setState(720);
				sqrtExpr();
				}
				break;
			case 16:
				enterOuterAlt(_localctx, 16);
				{
				setState(721);
				cbrtExpr();
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
		case 22:
			return additiveExpr_sempred((AdditiveExprContext)_localctx, predIndex);
		case 23:
			return multiplicativeExpr_sempred((MultiplicativeExprContext)_localctx, predIndex);
		case 51:
			return varExpr_sempred((VarExprContext)_localctx, predIndex);
		case 52:
			return varMultiplicativeExpr_sempred((VarMultiplicativeExprContext)_localctx, predIndex);
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
	private boolean varExpr_sempred(VarExprContext _localctx, int predIndex) {
		switch (predIndex) {
		case 4:
			return precpred(_ctx, 3);
		case 5:
			return precpred(_ctx, 2);
		}
		return true;
	}
	private boolean varMultiplicativeExpr_sempred(VarMultiplicativeExprContext _localctx, int predIndex) {
		switch (predIndex) {
		case 6:
			return precpred(_ctx, 4);
		case 7:
			return precpred(_ctx, 3);
		}
		return true;
	}

	public static final String _serializedATN =
		"\u0004\u00012\u02d5\u0002\u0000\u0007\u0000\u0002\u0001\u0007\u0001\u0002"+
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
		"2\u00072\u00023\u00073\u00024\u00074\u00025\u00075\u00026\u00076\u0002"+
		"7\u00077\u00028\u00078\u0001\u0000\u0001\u0000\u0001\u0000\u0001\u0001"+
		"\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001"+
		"\u0001\u0001\u0003\u0001~\b\u0001\u0001\u0002\u0001\u0002\u0001\u0002"+
		"\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002"+
		"\u0001\u0002\u0001\u0002\u0001\u0002\u0003\u0002\u008c\b\u0002\u0001\u0003"+
		"\u0003\u0003\u008f\b\u0003\u0001\u0003\u0001\u0003\u0001\u0003\u0001\u0003"+
		"\u0001\u0003\u0001\u0003\u0001\u0003\u0001\u0003\u0001\u0003\u0001\u0004"+
		"\u0001\u0004\u0001\u0004\u0001\u0004\u0001\u0004\u0001\u0004\u0003\u0004"+
		"\u00a0\b\u0004\u0001\u0004\u0001\u0004\u0001\u0005\u0001\u0005\u0001\u0005"+
		"\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0003\u0005\u00ab\b\u0005"+
		"\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005"+
		"\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005"+
		"\u0001\u0005\u0001\u0005\u0001\u0005\u0001\u0005\u0003\u0005\u00bd\b\u0005"+
		"\u0001\u0005\u0001\u0005\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006"+
		"\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006"+
		"\u0001\u0006\u0001\u0006\u0001\u0006\u0001\u0006\u0003\u0006\u00cf\b\u0006"+
		"\u0001\u0006\u0001\u0006\u0001\u0007\u0001\u0007\u0001\u0007\u0001\u0007"+
		"\u0001\u0007\u0001\u0007\u0001\u0007\u0001\u0007\u0001\u0007\u0001\u0007"+
		"\u0001\u0007\u0001\u0007\u0001\u0007\u0001\u0007\u0001\u0007\u0001\u0007"+
		"\u0001\u0007\u0001\u0007\u0001\u0007\u0001\u0007\u0001\u0007\u0001\u0007"+
		"\u0001\u0007\u0001\u0007\u0001\u0007\u0001\u0007\u0003\u0007\u00ed\b\u0007"+
		"\u0001\u0007\u0001\u0007\u0001\b\u0001\b\u0001\b\u0001\b\u0001\b\u0001"+
		"\b\u0001\b\u0003\b\u00f8\b\b\u0001\b\u0001\b\u0001\t\u0001\t\u0001\t\u0001"+
		"\t\u0001\t\u0001\n\u0001\n\u0001\n\u0001\n\u0001\n\u0003\n\u0106\b\n\u0001"+
		"\u000b\u0001\u000b\u0001\u000b\u0001\u000b\u0001\u000b\u0001\u000b\u0001"+
		"\u000b\u0001\u000b\u0001\u000b\u0001\u000b\u0001\u000b\u0001\u000b\u0001"+
		"\u000b\u0001\u000b\u0001\u000b\u0001\u000b\u0001\u000b\u0001\u000b\u0001"+
		"\u000b\u0001\u000b\u0001\u000b\u0001\u000b\u0001\u000b\u0001\u000b\u0003"+
		"\u000b\u0120\b\u000b\u0001\u000b\u0001\u000b\u0001\f\u0001\f\u0001\f\u0001"+
		"\f\u0001\f\u0001\f\u0003\f\u012a\b\f\u0001\f\u0001\f\u0001\r\u0001\r\u0001"+
		"\r\u0001\r\u0001\r\u0001\r\u0003\r\u0134\b\r\u0001\r\u0001\r\u0001\u000e"+
		"\u0001\u000e\u0001\u000e\u0001\u000e\u0003\u000e\u013c\b\u000e\u0001\u000e"+
		"\u0001\u000e\u0001\u000f\u0001\u000f\u0001\u000f\u0001\u000f\u0001\u000f"+
		"\u0001\u000f\u0001\u000f\u0001\u000f\u0001\u000f\u0001\u000f\u0001\u000f"+
		"\u0001\u000f\u0001\u000f\u0001\u000f\u0001\u000f\u0003\u000f\u014f\b\u000f"+
		"\u0001\u000f\u0001\u000f\u0001\u000f\u0001\u000f\u0001\u000f\u0001\u000f"+
		"\u0001\u000f\u0001\u000f\u0003\u000f\u0159\b\u000f\u0001\u000f\u0001\u000f"+
		"\u0001\u000f\u0001\u000f\u0001\u000f\u0001\u000f\u0001\u000f\u0001\u000f"+
		"\u0001\u000f\u0003\u000f\u0164\b\u000f\u0001\u000f\u0001\u000f\u0001\u000f"+
		"\u0001\u000f\u0001\u000f\u0001\u000f\u0001\u000f\u0001\u000f\u0001\u000f"+
		"\u0001\u000f\u0001\u000f\u0001\u000f\u0003\u000f\u0172\b\u000f\u0001\u0010"+
		"\u0001\u0010\u0001\u0010\u0001\u0010\u0001\u0010\u0001\u0010\u0001\u0010"+
		"\u0001\u0010\u0001\u0010\u0001\u0010\u0001\u0011\u0001\u0011\u0001\u0011"+
		"\u0001\u0011\u0001\u0011\u0001\u0011\u0001\u0011\u0001\u0011\u0001\u0012"+
		"\u0001\u0012\u0001\u0012\u0001\u0012\u0001\u0012\u0001\u0012\u0001\u0012"+
		"\u0001\u0012\u0001\u0012\u0001\u0012\u0001\u0013\u0001\u0013\u0001\u0013"+
		"\u0001\u0013\u0001\u0013\u0001\u0013\u0001\u0013\u0001\u0013\u0001\u0014"+
		"\u0001\u0014\u0001\u0014\u0001\u0014\u0001\u0014\u0001\u0014\u0001\u0014"+
		"\u0001\u0014\u0001\u0014\u0001\u0014\u0001\u0014\u0001\u0014\u0003\u0014"+
		"\u01a4\b\u0014\u0001\u0014\u0001\u0014\u0001\u0015\u0001\u0015\u0001\u0016"+
		"\u0001\u0016\u0001\u0016\u0001\u0016\u0001\u0016\u0001\u0016\u0001\u0016"+
		"\u0001\u0016\u0001\u0016\u0005\u0016\u01b3\b\u0016\n\u0016\f\u0016\u01b6"+
		"\t\u0016\u0001\u0017\u0001\u0017\u0001\u0017\u0003\u0017\u01bb\b\u0017"+
		"\u0001\u0017\u0001\u0017\u0001\u0017\u0001\u0017\u0001\u0017\u0001\u0017"+
		"\u0005\u0017\u01c3\b\u0017\n\u0017\f\u0017\u01c6\t\u0017\u0001\u0018\u0001"+
		"\u0018\u0004\u0018\u01ca\b\u0018\u000b\u0018\f\u0018\u01cb\u0001\u0019"+
		"\u0001\u0019\u0001\u0019\u0001\u0019\u0001\u0019\u0003\u0019\u01d3\b\u0019"+
		"\u0001\u001a\u0001\u001a\u0001\u001a\u0001\u001a\u0001\u001a\u0003\u001a"+
		"\u01da\b\u001a\u0001\u001b\u0001\u001b\u0001\u001b\u0001\u001b\u0001\u001b"+
		"\u0001\u001b\u0001\u001b\u0001\u001b\u0001\u001b\u0001\u001b\u0001\u001b"+
		"\u0001\u001b\u0001\u001b\u0001\u001b\u0001\u001b\u0001\u001b\u0001\u001b"+
		"\u0001\u001b\u0003\u001b\u01ee\b\u001b\u0001\u001c\u0001\u001c\u0001\u001c"+
		"\u0001\u001c\u0001\u001c\u0001\u001d\u0001\u001d\u0001\u001d\u0001\u001d"+
		"\u0001\u001d\u0001\u001e\u0001\u001e\u0001\u001e\u0001\u001e\u0001\u001e"+
		"\u0001\u001f\u0001\u001f\u0001\u001f\u0001\u001f\u0001\u001f\u0001 \u0001"+
		" \u0001 \u0001 \u0001 \u0001 \u0001 \u0001 \u0001!\u0001!\u0001!\u0001"+
		"!\u0001!\u0001\"\u0001\"\u0001\"\u0001\"\u0001\"\u0001#\u0001#\u0001#"+
		"\u0001#\u0001#\u0001$\u0001$\u0001$\u0001$\u0001$\u0001%\u0001%\u0001"+
		"%\u0001%\u0001%\u0001&\u0001&\u0003&\u0227\b&\u0001\'\u0001\'\u0001\'"+
		"\u0001\'\u0001\'\u0001\'\u0001\'\u0001\'\u0001\'\u0001\'\u0001\'\u0003"+
		"\'\u0234\b\'\u0001\'\u0001\'\u0001\'\u0001\'\u0001\'\u0001\'\u0001\'\u0001"+
		"\'\u0001\'\u0001\'\u0001\'\u0001\'\u0001\'\u0001\'\u0003\'\u0244\b\'\u0001"+
		"\'\u0001\'\u0001\'\u0001\'\u0001\'\u0001\'\u0001\'\u0001\'\u0001\'\u0001"+
		"\'\u0001\'\u0003\'\u0251\b\'\u0001\'\u0001\'\u0003\'\u0255\b\'\u0003\'"+
		"\u0257\b\'\u0001(\u0001(\u0003(\u025b\b(\u0001)\u0001)\u0003)\u025f\b"+
		")\u0001*\u0001*\u0003*\u0263\b*\u0001+\u0001+\u0003+\u0267\b+\u0001,\u0001"+
		",\u0003,\u026b\b,\u0001-\u0001-\u0003-\u026f\b-\u0001.\u0001.\u0003.\u0273"+
		"\b.\u0001/\u0001/\u0003/\u0277\b/\u00010\u00010\u00030\u027b\b0\u0001"+
		"1\u00011\u00011\u00011\u00011\u00011\u00011\u00011\u00011\u00011\u0001"+
		"1\u00031\u0288\b1\u00012\u00012\u00012\u00012\u00013\u00013\u00013\u0001"+
		"3\u00013\u00013\u00013\u00013\u00013\u00053\u0297\b3\n3\f3\u029a\t3\u0001"+
		"4\u00014\u00014\u00034\u029f\b4\u00014\u00014\u00014\u00014\u00014\u0001"+
		"4\u00054\u02a7\b4\n4\f4\u02aa\t4\u00015\u00015\u00045\u02ae\b5\u000b5"+
		"\f5\u02af\u00016\u00016\u00016\u00016\u00016\u00036\u02b7\b6\u00017\u0001"+
		"7\u00017\u00017\u00017\u00037\u02be\b7\u00018\u00018\u00018\u00018\u0001"+
		"8\u00018\u00018\u00018\u00018\u00018\u00018\u00018\u00018\u00018\u0001"+
		"8\u00018\u00018\u00018\u00018\u00038\u02d3\b8\u00018\u0000\u0004,.fh9"+
		"\u0000\u0002\u0004\u0006\b\n\f\u000e\u0010\u0012\u0014\u0016\u0018\u001a"+
		"\u001c\u001e \"$&(*,.02468:<>@BDFHJLNPRTVXZ\\^`bdfhjlnp\u0000\u0001\u0001"+
		"\u0000+,\u0319\u0000r\u0001\u0000\u0000\u0000\u0002}\u0001\u0000\u0000"+
		"\u0000\u0004\u008b\u0001\u0000\u0000\u0000\u0006\u008e\u0001\u0000\u0000"+
		"\u0000\b\u0099\u0001\u0000\u0000\u0000\n\u00a3\u0001\u0000\u0000\u0000"+
		"\f\u00c0\u0001\u0000\u0000\u0000\u000e\u00d2\u0001\u0000\u0000\u0000\u0010"+
		"\u00f0\u0001\u0000\u0000\u0000\u0012\u00fb\u0001\u0000\u0000\u0000\u0014"+
		"\u0105\u0001\u0000\u0000\u0000\u0016\u0107\u0001\u0000\u0000\u0000\u0018"+
		"\u0123\u0001\u0000\u0000\u0000\u001a\u012d\u0001\u0000\u0000\u0000\u001c"+
		"\u0137\u0001\u0000\u0000\u0000\u001e\u0171\u0001\u0000\u0000\u0000 \u0173"+
		"\u0001\u0000\u0000\u0000\"\u017d\u0001\u0000\u0000\u0000$\u0185\u0001"+
		"\u0000\u0000\u0000&\u018f\u0001\u0000\u0000\u0000(\u0197\u0001\u0000\u0000"+
		"\u0000*\u01a7\u0001\u0000\u0000\u0000,\u01a9\u0001\u0000\u0000\u0000."+
		"\u01ba\u0001\u0000\u0000\u00000\u01c7\u0001\u0000\u0000\u00002\u01d2\u0001"+
		"\u0000\u0000\u00004\u01d9\u0001\u0000\u0000\u00006\u01ed\u0001\u0000\u0000"+
		"\u00008\u01ef\u0001\u0000\u0000\u0000:\u01f4\u0001\u0000\u0000\u0000<"+
		"\u01f9\u0001\u0000\u0000\u0000>\u01fe\u0001\u0000\u0000\u0000@\u0203\u0001"+
		"\u0000\u0000\u0000B\u020b\u0001\u0000\u0000\u0000D\u0210\u0001\u0000\u0000"+
		"\u0000F\u0215\u0001\u0000\u0000\u0000H\u021a\u0001\u0000\u0000\u0000J"+
		"\u021f\u0001\u0000\u0000\u0000L\u0226\u0001\u0000\u0000\u0000N\u0256\u0001"+
		"\u0000\u0000\u0000P\u025a\u0001\u0000\u0000\u0000R\u025e\u0001\u0000\u0000"+
		"\u0000T\u0262\u0001\u0000\u0000\u0000V\u0266\u0001\u0000\u0000\u0000X"+
		"\u026a\u0001\u0000\u0000\u0000Z\u026e\u0001\u0000\u0000\u0000\\\u0272"+
		"\u0001\u0000\u0000\u0000^\u0276\u0001\u0000\u0000\u0000`\u027a\u0001\u0000"+
		"\u0000\u0000b\u0287\u0001\u0000\u0000\u0000d\u0289\u0001\u0000\u0000\u0000"+
		"f\u028d\u0001\u0000\u0000\u0000h\u029e\u0001\u0000\u0000\u0000j\u02ab"+
		"\u0001\u0000\u0000\u0000l\u02b6\u0001\u0000\u0000\u0000n\u02bd\u0001\u0000"+
		"\u0000\u0000p\u02d2\u0001\u0000\u0000\u0000rs\u0003\u0002\u0001\u0000"+
		"st\u0005\u0000\u0000\u0001t\u0001\u0001\u0000\u0000\u0000u~\u0003\u0004"+
		"\u0002\u0000v~\u0003d2\u0000w~\u0003L&\u0000x~\u0003N\'\u0000y~\u0003"+
		"P(\u0000z~\u0003R)\u0000{~\u0003*\u0015\u0000|~\u0003T*\u0000}u\u0001"+
		"\u0000\u0000\u0000}v\u0001\u0000\u0000\u0000}w\u0001\u0000\u0000\u0000"+
		"}x\u0001\u0000\u0000\u0000}y\u0001\u0000\u0000\u0000}z\u0001\u0000\u0000"+
		"\u0000}{\u0001\u0000\u0000\u0000}|\u0001\u0000\u0000\u0000~\u0003\u0001"+
		"\u0000\u0000\u0000\u007f\u008c\u0003\u0006\u0003\u0000\u0080\u008c\u0003"+
		"\b\u0004\u0000\u0081\u008c\u0003\n\u0005\u0000\u0082\u008c\u0003\f\u0006"+
		"\u0000\u0083\u008c\u0003\u000e\u0007\u0000\u0084\u008c\u0003\u001e\u000f"+
		"\u0000\u0085\u008c\u0003\u0010\b\u0000\u0086\u008c\u0003\u0012\t\u0000"+
		"\u0087\u008c\u0003\u0016\u000b\u0000\u0088\u008c\u0003\u0018\f\u0000\u0089"+
		"\u008c\u0003\u001a\r\u0000\u008a\u008c\u0003\u001c\u000e\u0000\u008b\u007f"+
		"\u0001\u0000\u0000\u0000\u008b\u0080\u0001\u0000\u0000\u0000\u008b\u0081"+
		"\u0001\u0000\u0000\u0000\u008b\u0082\u0001\u0000\u0000\u0000\u008b\u0083"+
		"\u0001\u0000\u0000\u0000\u008b\u0084\u0001\u0000\u0000\u0000\u008b\u0085"+
		"\u0001\u0000\u0000\u0000\u008b\u0086\u0001\u0000\u0000\u0000\u008b\u0087"+
		"\u0001\u0000\u0000\u0000\u008b\u0088\u0001\u0000\u0000\u0000\u008b\u0089"+
		"\u0001\u0000\u0000\u0000\u008b\u008a\u0001\u0000\u0000\u0000\u008c\u0005"+
		"\u0001\u0000\u0000\u0000\u008d\u008f\u0005\u0007\u0000\u0000\u008e\u008d"+
		"\u0001\u0000\u0000\u0000\u008e\u008f\u0001\u0000\u0000\u0000\u008f\u0090"+
		"\u0001\u0000\u0000\u0000\u0090\u0091\u0005%\u0000\u0000\u0091\u0092\u0003"+
		"*\u0015\u0000\u0092\u0093\u0005)\u0000\u0000\u0093\u0094\u0003*\u0015"+
		"\u0000\u0094\u0095\u0005)\u0000\u0000\u0095\u0096\u0003*\u0015\u0000\u0096"+
		"\u0097\u0001\u0000\u0000\u0000\u0097\u0098\u0005&\u0000\u0000\u0098\u0007"+
		"\u0001\u0000\u0000\u0000\u0099\u009a\u0005\b\u0000\u0000\u009a\u009b\u0005"+
		"%\u0000\u0000\u009b\u009c\u0003L&\u0000\u009c\u009f\u0005)\u0000\u0000"+
		"\u009d\u00a0\u0003L&\u0000\u009e\u00a0\u0003*\u0015\u0000\u009f\u009d"+
		"\u0001\u0000\u0000\u0000\u009f\u009e\u0001\u0000\u0000\u0000\u00a0\u00a1"+
		"\u0001\u0000\u0000\u0000\u00a1\u00a2\u0005&\u0000\u0000\u00a2\t\u0001"+
		"\u0000\u0000\u0000\u00a3\u00a4\u0005\t\u0000\u0000\u00a4\u00bc\u0005%"+
		"\u0000\u0000\u00a5\u00bd\u0005$\u0000\u0000\u00a6\u00a7\u0003L&\u0000"+
		"\u00a7\u00aa\u0005)\u0000\u0000\u00a8\u00ab\u0003R)\u0000\u00a9\u00ab"+
		"\u0003N\'\u0000\u00aa\u00a8\u0001\u0000\u0000\u0000\u00aa\u00a9\u0001"+
		"\u0000\u0000\u0000\u00ab\u00bd\u0001\u0000\u0000\u0000\u00ac\u00ad\u0003"+
		"N\'\u0000\u00ad\u00ae\u0005)\u0000\u0000\u00ae\u00af\u0003N\'\u0000\u00af"+
		"\u00bd\u0001\u0000\u0000\u0000\u00b0\u00b1\u0003L&\u0000\u00b1\u00b2\u0005"+
		")\u0000\u0000\u00b2\u00b3\u0003P(\u0000\u00b3\u00b4\u0005)\u0000\u0000"+
		"\u00b4\u00b5\u0003P(\u0000\u00b5\u00bd\u0001\u0000\u0000\u0000\u00b6\u00b7"+
		"\u0003L&\u0000\u00b7\u00b8\u0005)\u0000\u0000\u00b8\u00b9\u0003L&\u0000"+
		"\u00b9\u00ba\u0005)\u0000\u0000\u00ba\u00bb\u0003L&\u0000\u00bb\u00bd"+
		"\u0001\u0000\u0000\u0000\u00bc\u00a5\u0001\u0000\u0000\u0000\u00bc\u00a6"+
		"\u0001\u0000\u0000\u0000\u00bc\u00ac\u0001\u0000\u0000\u0000\u00bc\u00b0"+
		"\u0001\u0000\u0000\u0000\u00bc\u00b6\u0001\u0000\u0000\u0000\u00bd\u00be"+
		"\u0001\u0000\u0000\u0000\u00be\u00bf\u0005&\u0000\u0000\u00bf\u000b\u0001"+
		"\u0000\u0000\u0000\u00c0\u00c1\u0005\u0002\u0000\u0000\u00c1\u00ce\u0005"+
		"%\u0000\u0000\u00c2\u00c3\u0003L&\u0000\u00c3\u00c4\u0005)\u0000\u0000"+
		"\u00c4\u00c5\u0003L&\u0000\u00c5\u00cf\u0001\u0000\u0000\u0000\u00c6\u00c7"+
		"\u0003L&\u0000\u00c7\u00c8\u0005)\u0000\u0000\u00c8\u00c9\u0003N\'\u0000"+
		"\u00c9\u00cf\u0001\u0000\u0000\u0000\u00ca\u00cb\u0003L&\u0000\u00cb\u00cc"+
		"\u0005)\u0000\u0000\u00cc\u00cd\u0003P(\u0000\u00cd\u00cf\u0001\u0000"+
		"\u0000\u0000\u00ce\u00c2\u0001\u0000\u0000\u0000\u00ce\u00c6\u0001\u0000"+
		"\u0000\u0000\u00ce\u00ca\u0001\u0000\u0000\u0000\u00cf\u00d0\u0001\u0000"+
		"\u0000\u0000\u00d0\u00d1\u0005&\u0000\u0000\u00d1\r\u0001\u0000\u0000"+
		"\u0000\u00d2\u00d3\u0005\u000b\u0000\u0000\u00d3\u00ec\u0005%\u0000\u0000"+
		"\u00d4\u00ed\u0003P(\u0000\u00d5\u00ed\u0003L&\u0000\u00d6\u00d7\u0003"+
		"P(\u0000\u00d7\u00d8\u0005)\u0000\u0000\u00d8\u00d9\u0003P(\u0000\u00d9"+
		"\u00ed\u0001\u0000\u0000\u0000\u00da\u00db\u0003N\'\u0000\u00db\u00dc"+
		"\u0005)\u0000\u0000\u00dc\u00dd\u0003N\'\u0000\u00dd\u00ed\u0001\u0000"+
		"\u0000\u0000\u00de\u00df\u0003N\'\u0000\u00df\u00e0\u0005)\u0000\u0000"+
		"\u00e0\u00e1\u0003R)\u0000\u00e1\u00ed\u0001\u0000\u0000\u0000\u00e2\u00e3"+
		"\u0003R)\u0000\u00e3\u00e4\u0005)\u0000\u0000\u00e4\u00e5\u0003R)\u0000"+
		"\u00e5\u00ed\u0001\u0000\u0000\u0000\u00e6\u00e7\u0003L&\u0000\u00e7\u00e8"+
		"\u0005)\u0000\u0000\u00e8\u00e9\u0003L&\u0000\u00e9\u00ea\u0005)\u0000"+
		"\u0000\u00ea\u00eb\u0003L&\u0000\u00eb\u00ed\u0001\u0000\u0000\u0000\u00ec"+
		"\u00d4\u0001\u0000\u0000\u0000\u00ec\u00d5\u0001\u0000\u0000\u0000\u00ec"+
		"\u00d6\u0001\u0000\u0000\u0000\u00ec\u00da\u0001\u0000\u0000\u0000\u00ec"+
		"\u00de\u0001\u0000\u0000\u0000\u00ec\u00e2\u0001\u0000\u0000\u0000\u00ec"+
		"\u00e6\u0001\u0000\u0000\u0000\u00ed\u00ee\u0001\u0000\u0000\u0000\u00ee"+
		"\u00ef\u0005&\u0000\u0000\u00ef\u000f\u0001\u0000\u0000\u0000\u00f0\u00f1"+
		"\u0005\u0003\u0000\u0000\u00f1\u00f7\u0005%\u0000\u0000\u00f2\u00f8\u0003"+
		"L&\u0000\u00f3\u00f4\u0003L&\u0000\u00f4\u00f5\u0005)\u0000\u0000\u00f5"+
		"\u00f6\u0003L&\u0000\u00f6\u00f8\u0001\u0000\u0000\u0000\u00f7\u00f2\u0001"+
		"\u0000\u0000\u0000\u00f7\u00f3\u0001\u0000\u0000\u0000\u00f8\u00f9\u0001"+
		"\u0000\u0000\u0000\u00f9\u00fa\u0005&\u0000\u0000\u00fa\u0011\u0001\u0000"+
		"\u0000\u0000\u00fb\u00fc\u0005\u0006\u0000\u0000\u00fc\u00fd\u0005%\u0000"+
		"\u0000\u00fd\u00fe\u0003\u0014\n\u0000\u00fe\u00ff\u0005&\u0000\u0000"+
		"\u00ff\u0013\u0001\u0000\u0000\u0000\u0100\u0101\u0003L&\u0000\u0101\u0102"+
		"\u0005)\u0000\u0000\u0102\u0103\u0003\u0014\n\u0000\u0103\u0106\u0001"+
		"\u0000\u0000\u0000\u0104\u0106\u0003L&\u0000\u0105\u0100\u0001\u0000\u0000"+
		"\u0000\u0105\u0104\u0001\u0000\u0000\u0000\u0106\u0015\u0001\u0000\u0000"+
		"\u0000\u0107\u0108\u0005\u0001\u0000\u0000\u0108\u011f\u0005%\u0000\u0000"+
		"\u0109\u010a\u0003L&\u0000\u010a\u010b\u0005)\u0000\u0000\u010b\u010c"+
		"\u0003*\u0015\u0000\u010c\u0120\u0001\u0000\u0000\u0000\u010d\u010e\u0003"+
		"L&\u0000\u010e\u010f\u0005)\u0000\u0000\u010f\u0110\u0003L&\u0000\u0110"+
		"\u0111\u0005)\u0000\u0000\u0111\u0112\u0003L&\u0000\u0112\u0120\u0001"+
		"\u0000\u0000\u0000\u0113\u0114\u0003L&\u0000\u0114\u0115\u0005)\u0000"+
		"\u0000\u0115\u0116\u0003*\u0015\u0000\u0116\u0117\u0005)\u0000\u0000\u0117"+
		"\u0118\u0003T*\u0000\u0118\u0120\u0001\u0000\u0000\u0000\u0119\u011a\u0003"+
		"L&\u0000\u011a\u011b\u0005)\u0000\u0000\u011b\u011c\u0003L&\u0000\u011c"+
		"\u011d\u0005)\u0000\u0000\u011d\u011e\u0003T*\u0000\u011e\u0120\u0001"+
		"\u0000\u0000\u0000\u011f\u0109\u0001\u0000\u0000\u0000\u011f\u010d\u0001"+
		"\u0000\u0000\u0000\u011f\u0113\u0001\u0000\u0000\u0000\u011f\u0119\u0001"+
		"\u0000\u0000\u0000\u0120\u0121\u0001\u0000\u0000\u0000\u0121\u0122\u0005"+
		"&\u0000\u0000\u0122\u0017\u0001\u0000\u0000\u0000\u0123\u0124\u0005\u0004"+
		"\u0000\u0000\u0124\u0125\u0005%\u0000\u0000\u0125\u0126\u0003L&\u0000"+
		"\u0126\u0129\u0005)\u0000\u0000\u0127\u012a\u0003L&\u0000\u0128\u012a"+
		"\u0003*\u0015\u0000\u0129\u0127\u0001\u0000\u0000\u0000\u0129\u0128\u0001"+
		"\u0000\u0000\u0000\u012a\u012b\u0001\u0000\u0000\u0000\u012b\u012c\u0005"+
		"&\u0000\u0000\u012c\u0019\u0001\u0000\u0000\u0000\u012d\u012e\u0005\u0005"+
		"\u0000\u0000\u012e\u012f\u0005%\u0000\u0000\u012f\u0130\u0003L&\u0000"+
		"\u0130\u0133\u0005)\u0000\u0000\u0131\u0134\u0003L&\u0000\u0132\u0134"+
		"\u0003P(\u0000\u0133\u0131\u0001\u0000\u0000\u0000\u0133\u0132\u0001\u0000"+
		"\u0000\u0000\u0134\u0135\u0001\u0000\u0000\u0000\u0135\u0136\u0005&\u0000"+
		"\u0000\u0136\u001b\u0001\u0000\u0000\u0000\u0137\u0138\u0005\n\u0000\u0000"+
		"\u0138\u013b\u0005%\u0000\u0000\u0139\u013c\u0003\u0002\u0001\u0000\u013a"+
		"\u013c\u0003\u0002\u0001\u0000\u013b\u0139\u0001\u0000\u0000\u0000\u013b"+
		"\u013a\u0001\u0000\u0000\u0000\u013c\u013d\u0001\u0000\u0000\u0000\u013d"+
		"\u013e\u0005&\u0000\u0000\u013e\u001d\u0001\u0000\u0000\u0000\u013f\u0140"+
		"\u0005\f\u0000\u0000\u0140\u0141\u0005%\u0000\u0000\u0141\u0142\u0003"+
		"L&\u0000\u0142\u0143\u0005)\u0000\u0000\u0143\u0144\u0003P(\u0000\u0144"+
		"\u0145\u0001\u0000\u0000\u0000\u0145\u0146\u0005&\u0000\u0000\u0146\u0172"+
		"\u0001\u0000\u0000\u0000\u0147\u0148\u0005\r\u0000\u0000\u0148\u0149\u0005"+
		"%\u0000\u0000\u0149\u014a\u0003b1\u0000\u014a\u014b\u0005)\u0000\u0000"+
		"\u014b\u014e\u0003*\u0015\u0000\u014c\u014d\u0005)\u0000\u0000\u014d\u014f"+
		"\u0003b1\u0000\u014e\u014c\u0001\u0000\u0000\u0000\u014e\u014f\u0001\u0000"+
		"\u0000\u0000\u014f\u0150\u0001\u0000\u0000\u0000\u0150\u0151\u0005&\u0000"+
		"\u0000\u0151\u0172\u0001\u0000\u0000\u0000\u0152\u0153\u0005\u000e\u0000"+
		"\u0000\u0153\u0154\u0005%\u0000\u0000\u0154\u0155\u0003L&\u0000\u0155"+
		"\u0158\u0005)\u0000\u0000\u0156\u0159\u0003R)\u0000\u0157\u0159\u0003"+
		"N\'\u0000\u0158\u0156\u0001\u0000\u0000\u0000\u0158\u0157\u0001\u0000"+
		"\u0000\u0000\u0159\u015a\u0001\u0000\u0000\u0000\u015a\u015b\u0005&\u0000"+
		"\u0000\u015b\u0172\u0001\u0000\u0000\u0000\u015c\u015d\u0005\u000f\u0000"+
		"\u0000\u015d\u015e\u0005%\u0000\u0000\u015e\u015f\u0003L&\u0000\u015f"+
		"\u0163\u0005)\u0000\u0000\u0160\u0164\u0003R)\u0000\u0161\u0164\u0003"+
		"N\'\u0000\u0162\u0164\u0003L&\u0000\u0163\u0160\u0001\u0000\u0000\u0000"+
		"\u0163\u0161\u0001\u0000\u0000\u0000\u0163\u0162\u0001\u0000\u0000\u0000"+
		"\u0164\u0165\u0001\u0000\u0000\u0000\u0165\u0166\u0005&\u0000\u0000\u0166"+
		"\u0172\u0001\u0000\u0000\u0000\u0167\u0168\u0005\u0010\u0000\u0000\u0168"+
		"\u0169\u0005%\u0000\u0000\u0169\u016a\u0003b1\u0000\u016a\u016b\u0005"+
		")\u0000\u0000\u016b\u016c\u0003*\u0015\u0000\u016c\u016d\u0005)\u0000"+
		"\u0000\u016d\u016e\u0003L&\u0000\u016e\u016f\u0001\u0000\u0000\u0000\u016f"+
		"\u0170\u0005&\u0000\u0000\u0170\u0172\u0001\u0000\u0000\u0000\u0171\u013f"+
		"\u0001\u0000\u0000\u0000\u0171\u0147\u0001\u0000\u0000\u0000\u0171\u0152"+
		"\u0001\u0000\u0000\u0000\u0171\u015c\u0001\u0000\u0000\u0000\u0171\u0167"+
		"\u0001\u0000\u0000\u0000\u0172\u001f\u0001\u0000\u0000\u0000\u0173\u0174"+
		"\u0005\u0011\u0000\u0000\u0174\u0175\u0005%\u0000\u0000\u0175\u0176\u0003"+
		"L&\u0000\u0176\u0177\u0005)\u0000\u0000\u0177\u0178\u0003L&\u0000\u0178"+
		"\u0179\u0005)\u0000\u0000\u0179\u017a\u0003*\u0015\u0000\u017a\u017b\u0001"+
		"\u0000\u0000\u0000\u017b\u017c\u0005&\u0000\u0000\u017c!\u0001\u0000\u0000"+
		"\u0000\u017d\u017e\u0005\u0012\u0000\u0000\u017e\u017f\u0005%\u0000\u0000"+
		"\u017f\u0180\u0003V+\u0000\u0180\u0181\u0005)\u0000\u0000\u0181\u0182"+
		"\u0003L&\u0000\u0182\u0183\u0001\u0000\u0000\u0000\u0183\u0184\u0005&"+
		"\u0000\u0000\u0184#\u0001\u0000\u0000\u0000\u0185\u0186\u0005\u0016\u0000"+
		"\u0000\u0186\u0187\u0005%\u0000\u0000\u0187\u0188\u0003L&\u0000\u0188"+
		"\u0189\u0005)\u0000\u0000\u0189\u018a\u0003*\u0015\u0000\u018a\u018b\u0005"+
		")\u0000\u0000\u018b\u018c\u0003L&\u0000\u018c\u018d\u0001\u0000\u0000"+
		"\u0000\u018d\u018e\u0005&\u0000\u0000\u018e%\u0001\u0000\u0000\u0000\u018f"+
		"\u0190\u0005\u0013\u0000\u0000\u0190\u0191\u0005%\u0000\u0000\u0191\u0192"+
		"\u0003V+\u0000\u0192\u0193\u0005)\u0000\u0000\u0193\u0194\u0003T*\u0000"+
		"\u0194\u0195\u0001\u0000\u0000\u0000\u0195\u0196\u0005&\u0000\u0000\u0196"+
		"\'\u0001\u0000\u0000\u0000\u0197\u0198\u0005\u0015\u0000\u0000\u0198\u0199"+
		"\u0005%\u0000\u0000\u0199\u019a\u0003L&\u0000\u019a\u019b\u0005)\u0000"+
		"\u0000\u019b\u01a3\u0003*\u0015\u0000\u019c\u019d\u0005)\u0000\u0000\u019d"+
		"\u019e\u0003*\u0015\u0000\u019e\u019f\u0005)\u0000\u0000\u019f\u01a0\u0003"+
		"*\u0015\u0000\u01a0\u01a1\u0005)\u0000\u0000\u01a1\u01a2\u0003*\u0015"+
		"\u0000\u01a2\u01a4\u0001\u0000\u0000\u0000\u01a3\u019c\u0001\u0000\u0000"+
		"\u0000\u01a3\u01a4\u0001\u0000\u0000\u0000\u01a4\u01a5\u0001\u0000\u0000"+
		"\u0000\u01a5\u01a6\u0005&\u0000\u0000\u01a6)\u0001\u0000\u0000\u0000\u01a7"+
		"\u01a8\u0003,\u0016\u0000\u01a8+\u0001\u0000\u0000\u0000\u01a9\u01aa\u0006"+
		"\u0016\uffff\uffff\u0000\u01aa\u01ab\u0003.\u0017\u0000\u01ab\u01b4\u0001"+
		"\u0000\u0000\u0000\u01ac\u01ad\n\u0003\u0000\u0000\u01ad\u01ae\u0005+"+
		"\u0000\u0000\u01ae\u01b3\u0003.\u0017\u0000\u01af\u01b0\n\u0002\u0000"+
		"\u0000\u01b0\u01b1\u0005,\u0000\u0000\u01b1\u01b3\u0003.\u0017\u0000\u01b2"+
		"\u01ac\u0001\u0000\u0000\u0000\u01b2\u01af\u0001\u0000\u0000\u0000\u01b3"+
		"\u01b6\u0001\u0000\u0000\u0000\u01b4\u01b2\u0001\u0000\u0000\u0000\u01b4"+
		"\u01b5\u0001\u0000\u0000\u0000\u01b5-\u0001\u0000\u0000\u0000\u01b6\u01b4"+
		"\u0001\u0000\u0000\u0000\u01b7\u01b8\u0006\u0017\uffff\uffff\u0000\u01b8"+
		"\u01bb\u00030\u0018\u0000\u01b9\u01bb\u00032\u0019\u0000\u01ba\u01b7\u0001"+
		"\u0000\u0000\u0000\u01ba\u01b9\u0001\u0000\u0000\u0000\u01bb\u01c4\u0001"+
		"\u0000\u0000\u0000\u01bc\u01bd\n\u0004\u0000\u0000\u01bd\u01be\u0005-"+
		"\u0000\u0000\u01be\u01c3\u00032\u0019\u0000\u01bf\u01c0\n\u0003\u0000"+
		"\u0000\u01c0\u01c1\u0005*\u0000\u0000\u01c1\u01c3\u00032\u0019\u0000\u01c2"+
		"\u01bc\u0001\u0000\u0000\u0000\u01c2\u01bf\u0001\u0000\u0000\u0000\u01c3"+
		"\u01c6\u0001\u0000\u0000\u0000\u01c4\u01c2\u0001\u0000\u0000\u0000\u01c4"+
		"\u01c5\u0001\u0000\u0000\u0000\u01c5/\u0001\u0000\u0000\u0000\u01c6\u01c4"+
		"\u0001\u0000\u0000\u0000\u01c7\u01c9\u00036\u001b\u0000\u01c8\u01ca\u0003"+
		"6\u001b\u0000\u01c9\u01c8\u0001\u0000\u0000\u0000\u01ca\u01cb\u0001\u0000"+
		"\u0000\u0000\u01cb\u01c9\u0001\u0000\u0000\u0000\u01cb\u01cc\u0001\u0000"+
		"\u0000\u0000\u01cc1\u0001\u0000\u0000\u0000\u01cd\u01ce\u00034\u001a\u0000"+
		"\u01ce\u01cf\u0005.\u0000\u0000\u01cf\u01d0\u00032\u0019\u0000\u01d0\u01d3"+
		"\u0001\u0000\u0000\u0000\u01d1\u01d3\u00034\u001a\u0000\u01d2\u01cd\u0001"+
		"\u0000\u0000\u0000\u01d2\u01d1\u0001\u0000\u0000\u0000\u01d33\u0001\u0000"+
		"\u0000\u0000\u01d4\u01d5\u0005,\u0000\u0000\u01d5\u01da\u00034\u001a\u0000"+
		"\u01d6\u01d7\u0005+\u0000\u0000\u01d7\u01da\u00034\u001a\u0000\u01d8\u01da"+
		"\u00036\u001b\u0000\u01d9\u01d4\u0001\u0000\u0000\u0000\u01d9\u01d6\u0001"+
		"\u0000\u0000\u0000\u01d9\u01d8\u0001\u0000\u0000\u0000\u01da5\u0001\u0000"+
		"\u0000\u0000\u01db\u01ee\u00050\u0000\u0000\u01dc\u01ee\u00051\u0000\u0000"+
		"\u01dd\u01ee\u0005!\u0000\u0000\u01de\u01ee\u0005\"\u0000\u0000\u01df"+
		"\u01e0\u0005%\u0000\u0000\u01e0\u01e1\u0003*\u0015\u0000\u01e1\u01e2\u0005"+
		"&\u0000\u0000\u01e2\u01ee\u0001\u0000\u0000\u0000\u01e3\u01ee\u00038\u001c"+
		"\u0000\u01e4\u01ee\u0003:\u001d\u0000\u01e5\u01ee\u0003<\u001e\u0000\u01e6"+
		"\u01ee\u0003>\u001f\u0000\u01e7\u01ee\u0003@ \u0000\u01e8\u01ee\u0003"+
		"B!\u0000\u01e9\u01ee\u0003J%\u0000\u01ea\u01ee\u0003H$\u0000\u01eb\u01ee"+
		"\u0003F#\u0000\u01ec\u01ee\u0003D\"\u0000\u01ed\u01db\u0001\u0000\u0000"+
		"\u0000\u01ed\u01dc\u0001\u0000\u0000\u0000\u01ed\u01dd\u0001\u0000\u0000"+
		"\u0000\u01ed\u01de\u0001\u0000\u0000\u0000\u01ed\u01df\u0001\u0000\u0000"+
		"\u0000\u01ed\u01e3\u0001\u0000\u0000\u0000\u01ed\u01e4\u0001\u0000\u0000"+
		"\u0000\u01ed\u01e5\u0001\u0000\u0000\u0000\u01ed\u01e6\u0001\u0000\u0000"+
		"\u0000\u01ed\u01e7\u0001\u0000\u0000\u0000\u01ed\u01e8\u0001\u0000\u0000"+
		"\u0000\u01ed\u01e9\u0001\u0000\u0000\u0000\u01ed\u01ea\u0001\u0000\u0000"+
		"\u0000\u01ed\u01eb\u0001\u0000\u0000\u0000\u01ed\u01ec\u0001\u0000\u0000"+
		"\u0000\u01ee7\u0001\u0000\u0000\u0000\u01ef\u01f0\u0005\u0017\u0000\u0000"+
		"\u01f0\u01f1\u0005%\u0000\u0000\u01f1\u01f2\u0003*\u0015\u0000\u01f2\u01f3"+
		"\u0005&\u0000\u0000\u01f39\u0001\u0000\u0000\u0000\u01f4\u01f5\u0005\u0018"+
		"\u0000\u0000\u01f5\u01f6\u0005%\u0000\u0000\u01f6\u01f7\u0003*\u0015\u0000"+
		"\u01f7\u01f8\u0005&\u0000\u0000\u01f8;\u0001\u0000\u0000\u0000\u01f9\u01fa"+
		"\u0005\u0019\u0000\u0000\u01fa\u01fb\u0005%\u0000\u0000\u01fb\u01fc\u0003"+
		"*\u0015\u0000\u01fc\u01fd\u0005&\u0000\u0000\u01fd=\u0001\u0000\u0000"+
		"\u0000\u01fe\u01ff\u0005\u001a\u0000\u0000\u01ff\u0200\u0005%\u0000\u0000"+
		"\u0200\u0201\u0003*\u0015\u0000\u0201\u0202\u0005&\u0000\u0000\u0202?"+
		"\u0001\u0000\u0000\u0000\u0203\u0204\u0005\u001b\u0000\u0000\u0204\u0205"+
		"\u0005%\u0000\u0000\u0205\u0206\u0003*\u0015\u0000\u0206\u0207\u0005)"+
		"\u0000\u0000\u0207\u0208\u0003*\u0015\u0000\u0208\u0209\u0001\u0000\u0000"+
		"\u0000\u0209\u020a\u0005&\u0000\u0000\u020aA\u0001\u0000\u0000\u0000\u020b"+
		"\u020c\u0005\u001c\u0000\u0000\u020c\u020d\u0005%\u0000\u0000\u020d\u020e"+
		"\u0003*\u0015\u0000\u020e\u020f\u0005&\u0000\u0000\u020fC\u0001\u0000"+
		"\u0000\u0000\u0210\u0211\u0005\u001f\u0000\u0000\u0211\u0212\u0005%\u0000"+
		"\u0000\u0212\u0213\u0003*\u0015\u0000\u0213\u0214\u0005&\u0000\u0000\u0214"+
		"E\u0001\u0000\u0000\u0000\u0215\u0216\u0005\u001e\u0000\u0000\u0216\u0217"+
		"\u0005%\u0000\u0000\u0217\u0218\u0003*\u0015\u0000\u0218\u0219\u0005&"+
		"\u0000\u0000\u0219G\u0001\u0000\u0000\u0000\u021a\u021b\u0005 \u0000\u0000"+
		"\u021b\u021c\u0005%\u0000\u0000\u021c\u021d\u0003*\u0015\u0000\u021d\u021e"+
		"\u0005&\u0000\u0000\u021eI\u0001\u0000\u0000\u0000\u021f\u0220\u0005\u001d"+
		"\u0000\u0000\u0220\u0221\u0005%\u0000\u0000\u0221\u0222\u0003*\u0015\u0000"+
		"\u0222\u0223\u0005&\u0000\u0000\u0223K\u0001\u0000\u0000\u0000\u0224\u0227"+
		"\u0005#\u0000\u0000\u0225\u0227\u0003\u0006\u0003\u0000\u0226\u0224\u0001"+
		"\u0000\u0000\u0000\u0226\u0225\u0001\u0000\u0000\u0000\u0227M\u0001\u0000"+
		"\u0000\u0000\u0228\u0257\u0003\f\u0006\u0000\u0229\u0257\u0005$\u0000"+
		"\u0000\u022a\u0234\u0003L&\u0000\u022b\u0234\u0003\u0010\b\u0000\u022c"+
		"\u022d\u0005%\u0000\u0000\u022d\u022e\u0003*\u0015\u0000\u022e\u022f\u0005"+
		")\u0000\u0000\u022f\u0230\u0003*\u0015\u0000\u0230\u0231\u0005)\u0000"+
		"\u0000\u0231\u0232\u0003*\u0015\u0000\u0232\u0234\u0001\u0000\u0000\u0000"+
		"\u0233\u022a\u0001\u0000\u0000\u0000\u0233\u022b\u0001\u0000\u0000\u0000"+
		"\u0233\u022c\u0001\u0000\u0000\u0000\u0234\u0235\u0001\u0000\u0000\u0000"+
		"\u0235\u0236\u0007\u0000\u0000\u0000\u0236\u0237\u0005$\u0000\u0000\u0237"+
		"\u0243\u0005-\u0000\u0000\u0238\u0244\u0003\u0010\b\u0000\u0239\u0244"+
		"\u0005$\u0000\u0000\u023a\u023b\u0005%\u0000\u0000\u023b\u023c\u0003*"+
		"\u0015\u0000\u023c\u023d\u0005)\u0000\u0000\u023d\u023e\u0003*\u0015\u0000"+
		"\u023e\u023f\u0005)\u0000\u0000\u023f\u0240\u0003*\u0015\u0000\u0240\u0241"+
		"\u0001\u0000\u0000\u0000\u0241\u0242\u0005&\u0000\u0000\u0242\u0244\u0001"+
		"\u0000\u0000\u0000\u0243\u0238\u0001\u0000\u0000\u0000\u0243\u0239\u0001"+
		"\u0000\u0000\u0000\u0243\u023a\u0001\u0000\u0000\u0000\u0244\u0255\u0001"+
		"\u0000\u0000\u0000\u0245\u0251\u0003\u0010\b\u0000\u0246\u0251\u0005$"+
		"\u0000\u0000\u0247\u0248\u0005%\u0000\u0000\u0248\u0249\u0003*\u0015\u0000"+
		"\u0249\u024a\u0005)\u0000\u0000\u024a\u024b\u0003*\u0015\u0000\u024b\u024c"+
		"\u0005)\u0000\u0000\u024c\u024d\u0003*\u0015\u0000\u024d\u024e\u0001\u0000"+
		"\u0000\u0000\u024e\u024f\u0005&\u0000\u0000\u024f\u0251\u0001\u0000\u0000"+
		"\u0000\u0250\u0245\u0001\u0000\u0000\u0000\u0250\u0246\u0001\u0000\u0000"+
		"\u0000\u0250\u0247\u0001\u0000\u0000\u0000\u0251\u0252\u0001\u0000\u0000"+
		"\u0000\u0252\u0253\u0005-\u0000\u0000\u0253\u0255\u0005$\u0000\u0000\u0254"+
		"\u0233\u0001\u0000\u0000\u0000\u0254\u0250\u0001\u0000\u0000\u0000\u0255"+
		"\u0257\u0001\u0000\u0000\u0000\u0256\u0228\u0001\u0000\u0000\u0000\u0256"+
		"\u0229\u0001\u0000\u0000\u0000\u0256\u0254\u0001\u0000\u0000\u0000\u0257"+
		"O\u0001\u0000\u0000\u0000\u0258\u025b\u0003\u0010\b\u0000\u0259\u025b"+
		"\u0005$\u0000\u0000\u025a\u0258\u0001\u0000\u0000\u0000\u025a\u0259\u0001"+
		"\u0000\u0000\u0000\u025bQ\u0001\u0000\u0000\u0000\u025c\u025f\u0003\n"+
		"\u0005\u0000\u025d\u025f\u0005$\u0000\u0000\u025e\u025c\u0001\u0000\u0000"+
		"\u0000\u025e\u025d\u0001\u0000\u0000\u0000\u025fS\u0001\u0000\u0000\u0000"+
		"\u0260\u0263\u0005$\u0000\u0000\u0261\u0263\u0003\u0010\b\u0000\u0262"+
		"\u0260\u0001\u0000\u0000\u0000\u0262\u0261\u0001\u0000\u0000\u0000\u0263"+
		"U\u0001\u0000\u0000\u0000\u0264\u0267\u0005$\u0000\u0000\u0265\u0267\u0003"+
		"\u0012\t\u0000\u0266\u0264\u0001\u0000\u0000\u0000\u0266\u0265\u0001\u0000"+
		"\u0000\u0000\u0267W\u0001\u0000\u0000\u0000\u0268\u026b\u0005$\u0000\u0000"+
		"\u0269\u026b\u0003(\u0014\u0000\u026a\u0268\u0001\u0000\u0000\u0000\u026a"+
		"\u0269\u0001\u0000\u0000\u0000\u026bY\u0001\u0000\u0000\u0000\u026c\u026f"+
		"\u0005$\u0000\u0000\u026d\u026f\u0003\"\u0011\u0000\u026e\u026c\u0001"+
		"\u0000\u0000\u0000\u026e\u026d\u0001\u0000\u0000\u0000\u026f[\u0001\u0000"+
		"\u0000\u0000\u0270\u0273\u0005$\u0000\u0000\u0271\u0273\u0003 \u0010\u0000"+
		"\u0272\u0270\u0001\u0000\u0000\u0000\u0272\u0271\u0001\u0000\u0000\u0000"+
		"\u0273]\u0001\u0000\u0000\u0000\u0274\u0277\u0005$\u0000\u0000\u0275\u0277"+
		"\u0003$\u0012\u0000\u0276\u0274\u0001\u0000\u0000\u0000\u0276\u0275\u0001"+
		"\u0000\u0000\u0000\u0277_\u0001\u0000\u0000\u0000\u0278\u027b\u0005$\u0000"+
		"\u0000\u0279\u027b\u0003&\u0013\u0000\u027a\u0278\u0001\u0000\u0000\u0000"+
		"\u027a\u0279\u0001\u0000\u0000\u0000\u027ba\u0001\u0000\u0000\u0000\u027c"+
		"\u0288\u0003L&\u0000\u027d\u0288\u0003N\'\u0000\u027e\u0288\u0003P(\u0000"+
		"\u027f\u0288\u0003V+\u0000\u0280\u0288\u0003R)\u0000\u0281\u0288\u0003"+
		"T*\u0000\u0282\u0288\u0003X,\u0000\u0283\u0288\u0003Z-\u0000\u0284\u0288"+
		"\u0003\\.\u0000\u0285\u0288\u0003^/\u0000\u0286\u0288\u0003`0\u0000\u0287"+
		"\u027c\u0001\u0000\u0000\u0000\u0287\u027d\u0001\u0000\u0000\u0000\u0287"+
		"\u027e\u0001\u0000\u0000\u0000\u0287\u027f\u0001\u0000\u0000\u0000\u0287"+
		"\u0280\u0001\u0000\u0000\u0000\u0287\u0281\u0001\u0000\u0000\u0000\u0287"+
		"\u0282\u0001\u0000\u0000\u0000\u0287\u0283\u0001\u0000\u0000\u0000\u0287"+
		"\u0284\u0001\u0000\u0000\u0000\u0287\u0285\u0001\u0000\u0000\u0000\u0287"+
		"\u0286\u0001\u0000\u0000\u0000\u0288c\u0001\u0000\u0000\u0000\u0289\u028a"+
		"\u0003f3\u0000\u028a\u028b\u0005/\u0000\u0000\u028b\u028c\u0003f3\u0000"+
		"\u028ce\u0001\u0000\u0000\u0000\u028d\u028e\u00063\uffff\uffff\u0000\u028e"+
		"\u028f\u0003h4\u0000\u028f\u0298\u0001\u0000\u0000\u0000\u0290\u0291\n"+
		"\u0003\u0000\u0000\u0291\u0292\u0005+\u0000\u0000\u0292\u0297\u0003h4"+
		"\u0000\u0293\u0294\n\u0002\u0000\u0000\u0294\u0295\u0005,\u0000\u0000"+
		"\u0295\u0297\u0003h4\u0000\u0296\u0290\u0001\u0000\u0000\u0000\u0296\u0293"+
		"\u0001\u0000\u0000\u0000\u0297\u029a\u0001\u0000\u0000\u0000\u0298\u0296"+
		"\u0001\u0000\u0000\u0000\u0298\u0299\u0001\u0000\u0000\u0000\u0299g\u0001"+
		"\u0000\u0000\u0000\u029a\u0298\u0001\u0000\u0000\u0000\u029b\u029c\u0006"+
		"4\uffff\uffff\u0000\u029c\u029f\u0003j5\u0000\u029d\u029f\u0003l6\u0000"+
		"\u029e\u029b\u0001\u0000\u0000\u0000\u029e\u029d\u0001\u0000\u0000\u0000"+
		"\u029f\u02a8\u0001\u0000\u0000\u0000\u02a0\u02a1\n\u0004\u0000\u0000\u02a1"+
		"\u02a2\u0005-\u0000\u0000\u02a2\u02a7\u0003l6\u0000\u02a3\u02a4\n\u0003"+
		"\u0000\u0000\u02a4\u02a5\u0005*\u0000\u0000\u02a5\u02a7\u0003l6\u0000"+
		"\u02a6\u02a0\u0001\u0000\u0000\u0000\u02a6\u02a3\u0001\u0000\u0000\u0000"+
		"\u02a7\u02aa\u0001\u0000\u0000\u0000\u02a8\u02a6\u0001\u0000\u0000\u0000"+
		"\u02a8\u02a9\u0001\u0000\u0000\u0000\u02a9i\u0001\u0000\u0000\u0000\u02aa"+
		"\u02a8\u0001\u0000\u0000\u0000\u02ab\u02ad\u0003p8\u0000\u02ac\u02ae\u0003"+
		"p8\u0000\u02ad\u02ac\u0001\u0000\u0000\u0000\u02ae\u02af\u0001\u0000\u0000"+
		"\u0000\u02af\u02ad\u0001\u0000\u0000\u0000\u02af\u02b0\u0001\u0000\u0000"+
		"\u0000\u02b0k\u0001\u0000\u0000\u0000\u02b1\u02b2\u0003n7\u0000\u02b2"+
		"\u02b3\u0005.\u0000\u0000\u02b3\u02b4\u0003l6\u0000\u02b4\u02b7\u0001"+
		"\u0000\u0000\u0000\u02b5\u02b7\u0003n7\u0000\u02b6\u02b1\u0001\u0000\u0000"+
		"\u0000\u02b6\u02b5\u0001\u0000\u0000\u0000\u02b7m\u0001\u0000\u0000\u0000"+
		"\u02b8\u02b9\u0005,\u0000\u0000\u02b9\u02be\u0003n7\u0000\u02ba\u02bb"+
		"\u0005+\u0000\u0000\u02bb\u02be\u0003n7\u0000\u02bc\u02be\u0003p8\u0000"+
		"\u02bd\u02b8\u0001\u0000\u0000\u0000\u02bd\u02ba\u0001\u0000\u0000\u0000"+
		"\u02bd\u02bc\u0001\u0000\u0000\u0000\u02beo\u0001\u0000\u0000\u0000\u02bf"+
		"\u02d3\u00050\u0000\u0000\u02c0\u02d3\u00051\u0000\u0000\u02c1\u02d3\u0005"+
		"!\u0000\u0000\u02c2\u02d3\u0005\"\u0000\u0000\u02c3\u02d3\u0003b1\u0000"+
		"\u02c4\u02c5\u0005%\u0000\u0000\u02c5\u02c6\u0003f3\u0000\u02c6\u02c7"+
		"\u0005&\u0000\u0000\u02c7\u02d3\u0001\u0000\u0000\u0000\u02c8\u02d3\u0003"+
		"8\u001c\u0000\u02c9\u02d3\u0003:\u001d\u0000\u02ca\u02d3\u0003<\u001e"+
		"\u0000\u02cb\u02d3\u0003>\u001f\u0000\u02cc\u02d3\u0003@ \u0000\u02cd"+
		"\u02d3\u0003B!\u0000\u02ce\u02d3\u0003J%\u0000\u02cf\u02d3\u0003H$\u0000"+
		"\u02d0\u02d3\u0003F#\u0000\u02d1\u02d3\u0003D\"\u0000\u02d2\u02bf\u0001"+
		"\u0000\u0000\u0000\u02d2\u02c0\u0001\u0000\u0000\u0000\u02d2\u02c1\u0001"+
		"\u0000\u0000\u0000\u02d2\u02c2\u0001\u0000\u0000\u0000\u02d2\u02c3\u0001"+
		"\u0000\u0000\u0000\u02d2\u02c4\u0001\u0000\u0000\u0000\u02d2\u02c8\u0001"+
		"\u0000\u0000\u0000\u02d2\u02c9\u0001\u0000\u0000\u0000\u02d2\u02ca\u0001"+
		"\u0000\u0000\u0000\u02d2\u02cb\u0001\u0000\u0000\u0000\u02d2\u02cc\u0001"+
		"\u0000\u0000\u0000\u02d2\u02cd\u0001\u0000\u0000\u0000\u02d2\u02ce\u0001"+
		"\u0000\u0000\u0000\u02d2\u02cf\u0001\u0000\u0000\u0000\u02d2\u02d0\u0001"+
		"\u0000\u0000\u0000\u02d2\u02d1\u0001\u0000\u0000\u0000\u02d3q\u0001\u0000"+
		"\u0000\u00005}\u008b\u008e\u009f\u00aa\u00bc\u00ce\u00ec\u00f7\u0105\u011f"+
		"\u0129\u0133\u013b\u014e\u0158\u0163\u0171\u01a3\u01b2\u01b4\u01ba\u01c2"+
		"\u01c4\u01cb\u01d2\u01d9\u01ed\u0226\u0233\u0243\u0250\u0254\u0256\u025a"+
		"\u025e\u0262\u0266\u026a\u026e\u0272\u0276\u027a\u0287\u0296\u0298\u029e"+
		"\u02a6\u02a8\u02af\u02b6\u02bd\u02d2";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}