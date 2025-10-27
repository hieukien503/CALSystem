// Generated from src/antlr4/parser/MathCommand.g4 by ANTLR 4.9.0-SNAPSHOT


import { ATN } from "antlr4ts/atn/ATN";
import { ATNDeserializer } from "antlr4ts/atn/ATNDeserializer";
import { FailedPredicateException } from "antlr4ts/FailedPredicateException";
import { NotNull } from "antlr4ts/Decorators";
import { NoViableAltException } from "antlr4ts/NoViableAltException";
import { Override } from "antlr4ts/Decorators";
import { Parser } from "antlr4ts/Parser";
import { ParserRuleContext } from "antlr4ts/ParserRuleContext";
import { ParserATNSimulator } from "antlr4ts/atn/ParserATNSimulator";
import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";
import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";
import { RecognitionException } from "antlr4ts/RecognitionException";
import { RuleContext } from "antlr4ts/RuleContext";
//import { RuleVersion } from "antlr4ts/RuleVersion";
import { TerminalNode } from "antlr4ts/tree/TerminalNode";
import { Token } from "antlr4ts/Token";
import { TokenStream } from "antlr4ts/TokenStream";
import { Vocabulary } from "antlr4ts/Vocabulary";
import { VocabularyImpl } from "antlr4ts/VocabularyImpl";

import * as Utils from "antlr4ts/misc/Utils";

import { MathCommandListener } from "./MathCommandListener";
import { MathCommandVisitor } from "./MathCommandVisitor";


export class MathCommandParser extends Parser {
	public static readonly CIRCLE = 1;
	public static readonly LINE = 2;
	public static readonly VECTOR = 3;
	public static readonly SEGMENT = 4;
	public static readonly RAY = 5;
	public static readonly POLYGON = 6;
	public static readonly POINT = 7;
	public static readonly SPHERE = 8;
	public static readonly PLANE = 9;
	public static readonly INTERSECT = 10;
	public static readonly ANGLE = 11;
	public static readonly TRANSLATE = 12;
	public static readonly ROTATE = 13;
	public static readonly PROJECT = 14;
	public static readonly REFLECT = 15;
	public static readonly ENLARGE = 16;
	public static readonly CYLINDER = 17;
	public static readonly TETRAHEDRON = 18;
	public static readonly PRISM = 19;
	public static readonly PYRAMID = 20;
	public static readonly CUBOID = 21;
	public static readonly CONE = 22;
	public static readonly SIN = 23;
	public static readonly COS = 24;
	public static readonly TAN = 25;
	public static readonly COT = 26;
	public static readonly LOG = 27;
	public static readonly LN = 28;
	public static readonly EXP = 29;
	public static readonly SQRT = 30;
	public static readonly CBRT = 31;
	public static readonly ABS = 32;
	public static readonly PI = 33;
	public static readonly E = 34;
	public static readonly X = 35;
	public static readonly Y = 36;
	public static readonly Z = 37;
	public static readonly POINT_ID = 38;
	public static readonly SHAPE_ID = 39;
	public static readonly LR = 40;
	public static readonly RR = 41;
	public static readonly LC = 42;
	public static readonly RC = 43;
	public static readonly COMMA = 44;
	public static readonly DIVIDE = 45;
	public static readonly ADD = 46;
	public static readonly SUB = 47;
	public static readonly MULTIPLY = 48;
	public static readonly POWER = 49;
	public static readonly INT_LIT = 50;
	public static readonly FLOAT_LIT = 51;
	public static readonly WS = 52;
	public static readonly ERROR_CHAR = 53;
	public static readonly RULE_program = 0;
	public static readonly RULE_expr = 1;
	public static readonly RULE_pointDef = 2;
	public static readonly RULE_sphereDef = 3;
	public static readonly RULE_planeDef = 4;
	public static readonly RULE_lineDef = 5;
	public static readonly RULE_angleDef = 6;
	public static readonly RULE_vectorDef = 7;
	public static readonly RULE_polygonDef = 8;
	public static readonly RULE_pointList = 9;
	public static readonly RULE_circleDef = 10;
	public static readonly RULE_segmentDef = 11;
	public static readonly RULE_rayDef = 12;
	public static readonly RULE_intersectionDef = 13;
	public static readonly RULE_transformDef = 14;
	public static readonly RULE_cylinderDef = 15;
	public static readonly RULE_tetrahedronDef = 16;
	public static readonly RULE_coneDef = 17;
	public static readonly RULE_prismDef = 18;
	public static readonly RULE_pyramidDef = 19;
	public static readonly RULE_numberExpr = 20;
	public static readonly RULE_additiveExpr = 21;
	public static readonly RULE_multiplicativeExpr = 22;
	public static readonly RULE_implicitMultiplicativeExpr = 23;
	public static readonly RULE_exponentialExpr = 24;
	public static readonly RULE_unaryExpr = 25;
	public static readonly RULE_primaryExpr = 26;
	public static readonly RULE_sinExpr = 27;
	public static readonly RULE_cosExpr = 28;
	public static readonly RULE_tanExpr = 29;
	public static readonly RULE_cotExpr = 30;
	public static readonly RULE_logExpr = 31;
	public static readonly RULE_lnExpr = 32;
	public static readonly RULE_cbrtExpr = 33;
	public static readonly RULE_sqrtExpr = 34;
	public static readonly RULE_absExpr = 35;
	public static readonly RULE_expExpr = 36;
	public static readonly RULE_pointExpr = 37;
	public static readonly RULE_lineExpr = 38;
	public static readonly RULE_dirExpr = 39;
	public static readonly RULE_vectorExpr = 40;
	public static readonly RULE_planeExpr = 41;
	public static readonly RULE_directionExpr = 42;
	public static readonly RULE_polygonExpr = 43;
	public static readonly RULE_tetrahedronExpr = 44;
	public static readonly RULE_cylinderExpr = 45;
	public static readonly RULE_coneExpr = 46;
	public static readonly RULE_prismExpr = 47;
	public static readonly RULE_segmentExpr = 48;
	public static readonly RULE_rayExpr = 49;
	public static readonly RULE_pyramidExpr = 50;
	public static readonly RULE_shapeExpr = 51;
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"program", "expr", "pointDef", "sphereDef", "planeDef", "lineDef", "angleDef", 
		"vectorDef", "polygonDef", "pointList", "circleDef", "segmentDef", "rayDef", 
		"intersectionDef", "transformDef", "cylinderDef", "tetrahedronDef", "coneDef", 
		"prismDef", "pyramidDef", "numberExpr", "additiveExpr", "multiplicativeExpr", 
		"implicitMultiplicativeExpr", "exponentialExpr", "unaryExpr", "primaryExpr", 
		"sinExpr", "cosExpr", "tanExpr", "cotExpr", "logExpr", "lnExpr", "cbrtExpr", 
		"sqrtExpr", "absExpr", "expExpr", "pointExpr", "lineExpr", "dirExpr", 
		"vectorExpr", "planeExpr", "directionExpr", "polygonExpr", "tetrahedronExpr", 
		"cylinderExpr", "coneExpr", "prismExpr", "segmentExpr", "rayExpr", "pyramidExpr", 
		"shapeExpr",
	];

	private static readonly _LITERAL_NAMES: Array<string | undefined> = [
		undefined, "'Circle'", "'Line'", "'Vector'", "'Segment'", "'Ray'", "'Polygon'", 
		"'Point'", "'Sphere'", "'Plane'", "'Intersect'", "'Angle'", "'Translate'", 
		"'Rotate'", "'Project'", "'Reflect'", "'Enlarge'", "'Cylinder'", "'Tetrahedron'", 
		"'Prism'", "'Pyramid'", "'Cuboid'", "'Cone'", "'sin'", "'cos'", "'tan'", 
		"'cot'", "'log'", "'ln'", "'exp'", "'sqrt'", "'cbrt'", "'abs'", "'pi'", 
		"'e'", "'x'", "'y'", "'z'", undefined, undefined, "'('", "')'", "'{'", 
		"'}'", "','", "'/'", "'+'", "'-'", "'*'", "'^'",
	];
	private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
		undefined, "CIRCLE", "LINE", "VECTOR", "SEGMENT", "RAY", "POLYGON", "POINT", 
		"SPHERE", "PLANE", "INTERSECT", "ANGLE", "TRANSLATE", "ROTATE", "PROJECT", 
		"REFLECT", "ENLARGE", "CYLINDER", "TETRAHEDRON", "PRISM", "PYRAMID", "CUBOID", 
		"CONE", "SIN", "COS", "TAN", "COT", "LOG", "LN", "EXP", "SQRT", "CBRT", 
		"ABS", "PI", "E", "X", "Y", "Z", "POINT_ID", "SHAPE_ID", "LR", "RR", "LC", 
		"RC", "COMMA", "DIVIDE", "ADD", "SUB", "MULTIPLY", "POWER", "INT_LIT", 
		"FLOAT_LIT", "WS", "ERROR_CHAR",
	];
	public static readonly VOCABULARY: Vocabulary = new VocabularyImpl(MathCommandParser._LITERAL_NAMES, MathCommandParser._SYMBOLIC_NAMES, []);

	// @Override
	// @NotNull
	public get vocabulary(): Vocabulary {
		return MathCommandParser.VOCABULARY;
	}
	// tslint:enable:no-trailing-whitespace

	// @Override
	public get grammarFileName(): string { return "MathCommand.g4"; }

	// @Override
	public get ruleNames(): string[] { return MathCommandParser.ruleNames; }

	// @Override
	public get serializedATN(): string { return MathCommandParser._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(MathCommandParser._ATN, this);
	}
	// @RuleVersion(0)
	public program(): ProgramContext {
		let _localctx: ProgramContext = new ProgramContext(this._ctx, this.state);
		this.enterRule(_localctx, 0, MathCommandParser.RULE_program);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 104;
			this.expr();
			this.state = 105;
			this.match(MathCommandParser.EOF);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public expr(): ExprContext {
		let _localctx: ExprContext = new ExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 2, MathCommandParser.RULE_expr);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 107;
			this.shapeExpr();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public pointDef(): PointDefContext {
		let _localctx: PointDefContext = new PointDefContext(this._ctx, this.state);
		this.enterRule(_localctx, 4, MathCommandParser.RULE_pointDef);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 110;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === MathCommandParser.POINT) {
				{
				this.state = 109;
				this.match(MathCommandParser.POINT);
				}
			}

			this.state = 112;
			this.match(MathCommandParser.LR);
			{
			this.state = 113;
			this.numberExpr();
			this.state = 114;
			this.match(MathCommandParser.COMMA);
			this.state = 115;
			this.numberExpr();
			this.state = 116;
			this.match(MathCommandParser.COMMA);
			this.state = 117;
			this.numberExpr();
			}
			this.state = 119;
			this.match(MathCommandParser.RR);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public sphereDef(): SphereDefContext {
		let _localctx: SphereDefContext = new SphereDefContext(this._ctx, this.state);
		this.enterRule(_localctx, 6, MathCommandParser.RULE_sphereDef);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 121;
			this.match(MathCommandParser.SPHERE);
			this.state = 122;
			this.match(MathCommandParser.LR);
			{
			this.state = 123;
			this.pointExpr();
			this.state = 124;
			this.match(MathCommandParser.COMMA);
			this.state = 127;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 1, this._ctx) ) {
			case 1:
				{
				this.state = 125;
				this.pointExpr();
				}
				break;

			case 2:
				{
				this.state = 126;
				this.numberExpr();
				}
				break;
			}
			}
			this.state = 129;
			this.match(MathCommandParser.RR);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public planeDef(): PlaneDefContext {
		let _localctx: PlaneDefContext = new PlaneDefContext(this._ctx, this.state);
		this.enterRule(_localctx, 8, MathCommandParser.RULE_planeDef);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 131;
			this.match(MathCommandParser.PLANE);
			this.state = 132;
			this.match(MathCommandParser.LR);
			this.state = 156;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 3, this._ctx) ) {
			case 1:
				{
				this.state = 133;
				this.match(MathCommandParser.SHAPE_ID);
				}
				break;

			case 2:
				{
				{
				this.state = 134;
				this.pointExpr();
				this.state = 135;
				this.match(MathCommandParser.COMMA);
				this.state = 138;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 2, this._ctx) ) {
				case 1:
					{
					this.state = 136;
					this.planeExpr();
					}
					break;

				case 2:
					{
					this.state = 137;
					this.lineExpr();
					}
					break;
				}
				}
				}
				break;

			case 3:
				{
				{
				this.state = 140;
				this.lineExpr();
				this.state = 141;
				this.match(MathCommandParser.COMMA);
				this.state = 142;
				this.lineExpr();
				}
				}
				break;

			case 4:
				{
				{
				this.state = 144;
				this.pointExpr();
				this.state = 145;
				this.match(MathCommandParser.COMMA);
				this.state = 146;
				this.vectorExpr();
				this.state = 147;
				this.match(MathCommandParser.COMMA);
				this.state = 148;
				this.vectorExpr();
				}
				}
				break;

			case 5:
				{
				{
				this.state = 150;
				this.pointExpr();
				this.state = 151;
				this.match(MathCommandParser.COMMA);
				this.state = 152;
				this.pointExpr();
				this.state = 153;
				this.match(MathCommandParser.COMMA);
				this.state = 154;
				this.pointExpr();
				}
				}
				break;
			}
			this.state = 158;
			this.match(MathCommandParser.RR);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public lineDef(): LineDefContext {
		let _localctx: LineDefContext = new LineDefContext(this._ctx, this.state);
		this.enterRule(_localctx, 10, MathCommandParser.RULE_lineDef);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 160;
			this.match(MathCommandParser.LINE);
			this.state = 161;
			this.match(MathCommandParser.LR);
			this.state = 174;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 4, this._ctx) ) {
			case 1:
				{
				{
				this.state = 162;
				this.pointExpr();
				this.state = 163;
				this.match(MathCommandParser.COMMA);
				this.state = 164;
				this.pointExpr();
				}
				}
				break;

			case 2:
				{
				{
				this.state = 166;
				this.pointExpr();
				this.state = 167;
				this.match(MathCommandParser.COMMA);
				this.state = 168;
				this.lineExpr();
				}
				}
				break;

			case 3:
				{
				{
				this.state = 170;
				this.pointExpr();
				this.state = 171;
				this.match(MathCommandParser.COMMA);
				this.state = 172;
				this.vectorExpr();
				}
				}
				break;
			}
			this.state = 176;
			this.match(MathCommandParser.RR);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public angleDef(): AngleDefContext {
		let _localctx: AngleDefContext = new AngleDefContext(this._ctx, this.state);
		this.enterRule(_localctx, 12, MathCommandParser.RULE_angleDef);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 178;
			this.match(MathCommandParser.ANGLE);
			this.state = 179;
			this.match(MathCommandParser.LR);
			this.state = 204;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 5, this._ctx) ) {
			case 1:
				{
				this.state = 180;
				this.vectorExpr();
				}
				break;

			case 2:
				{
				this.state = 181;
				this.pointExpr();
				}
				break;

			case 3:
				{
				{
				this.state = 182;
				this.vectorExpr();
				this.state = 183;
				this.match(MathCommandParser.COMMA);
				this.state = 184;
				this.vectorExpr();
				}
				}
				break;

			case 4:
				{
				{
				this.state = 186;
				this.lineExpr();
				this.state = 187;
				this.match(MathCommandParser.COMMA);
				this.state = 188;
				this.lineExpr();
				}
				}
				break;

			case 5:
				{
				{
				this.state = 190;
				this.lineExpr();
				this.state = 191;
				this.match(MathCommandParser.COMMA);
				this.state = 192;
				this.planeExpr();
				}
				}
				break;

			case 6:
				{
				{
				this.state = 194;
				this.planeExpr();
				this.state = 195;
				this.match(MathCommandParser.COMMA);
				this.state = 196;
				this.planeExpr();
				}
				}
				break;

			case 7:
				{
				{
				this.state = 198;
				this.pointExpr();
				this.state = 199;
				this.match(MathCommandParser.COMMA);
				this.state = 200;
				this.pointExpr();
				this.state = 201;
				this.match(MathCommandParser.COMMA);
				this.state = 202;
				this.pointExpr();
				}
				}
				break;
			}
			this.state = 206;
			this.match(MathCommandParser.RR);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public vectorDef(): VectorDefContext {
		let _localctx: VectorDefContext = new VectorDefContext(this._ctx, this.state);
		this.enterRule(_localctx, 14, MathCommandParser.RULE_vectorDef);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 208;
			this.match(MathCommandParser.VECTOR);
			this.state = 209;
			this.match(MathCommandParser.LR);
			this.state = 215;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 6, this._ctx) ) {
			case 1:
				{
				this.state = 210;
				this.pointExpr();
				}
				break;

			case 2:
				{
				{
				this.state = 211;
				this.pointExpr();
				this.state = 212;
				this.match(MathCommandParser.COMMA);
				this.state = 213;
				this.pointExpr();
				}
				}
				break;
			}
			this.state = 217;
			this.match(MathCommandParser.RR);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public polygonDef(): PolygonDefContext {
		let _localctx: PolygonDefContext = new PolygonDefContext(this._ctx, this.state);
		this.enterRule(_localctx, 16, MathCommandParser.RULE_polygonDef);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 219;
			this.match(MathCommandParser.POLYGON);
			this.state = 220;
			this.match(MathCommandParser.LR);
			this.state = 221;
			this.pointList();
			this.state = 222;
			this.match(MathCommandParser.RR);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public pointList(): PointListContext {
		let _localctx: PointListContext = new PointListContext(this._ctx, this.state);
		this.enterRule(_localctx, 18, MathCommandParser.RULE_pointList);
		try {
			this.state = 229;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 7, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 224;
				this.pointExpr();
				this.state = 225;
				this.match(MathCommandParser.COMMA);
				this.state = 226;
				this.pointList();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 228;
				this.pointExpr();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public circleDef(): CircleDefContext {
		let _localctx: CircleDefContext = new CircleDefContext(this._ctx, this.state);
		this.enterRule(_localctx, 20, MathCommandParser.RULE_circleDef);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 231;
			this.match(MathCommandParser.CIRCLE);
			this.state = 232;
			this.match(MathCommandParser.LR);
			this.state = 259;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 8, this._ctx) ) {
			case 1:
				{
				{
				this.state = 233;
				this.pointExpr();
				this.state = 234;
				this.match(MathCommandParser.COMMA);
				this.state = 235;
				this.numberExpr();
				}
				}
				break;

			case 2:
				{
				{
				this.state = 237;
				this.pointExpr();
				this.state = 238;
				this.match(MathCommandParser.COMMA);
				this.state = 239;
				this.pointExpr();
				}
				}
				break;

			case 3:
				{
				{
				this.state = 241;
				this.pointExpr();
				this.state = 242;
				this.match(MathCommandParser.COMMA);
				this.state = 243;
				this.pointExpr();
				this.state = 244;
				this.match(MathCommandParser.COMMA);
				this.state = 245;
				this.pointExpr();
				}
				}
				break;

			case 4:
				{
				{
				this.state = 247;
				this.pointExpr();
				this.state = 248;
				this.match(MathCommandParser.COMMA);
				this.state = 249;
				this.numberExpr();
				this.state = 250;
				this.match(MathCommandParser.COMMA);
				this.state = 251;
				this.directionExpr();
				}
				}
				break;

			case 5:
				{
				{
				this.state = 253;
				this.pointExpr();
				this.state = 254;
				this.match(MathCommandParser.COMMA);
				this.state = 255;
				this.pointExpr();
				this.state = 256;
				this.match(MathCommandParser.COMMA);
				this.state = 257;
				this.directionExpr();
				}
				}
				break;
			}
			this.state = 261;
			this.match(MathCommandParser.RR);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public segmentDef(): SegmentDefContext {
		let _localctx: SegmentDefContext = new SegmentDefContext(this._ctx, this.state);
		this.enterRule(_localctx, 22, MathCommandParser.RULE_segmentDef);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 263;
			this.match(MathCommandParser.SEGMENT);
			this.state = 264;
			this.match(MathCommandParser.LR);
			{
			this.state = 265;
			this.pointExpr();
			this.state = 266;
			this.match(MathCommandParser.COMMA);
			this.state = 269;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 9, this._ctx) ) {
			case 1:
				{
				this.state = 267;
				this.pointExpr();
				}
				break;

			case 2:
				{
				this.state = 268;
				this.numberExpr();
				}
				break;
			}
			}
			this.state = 271;
			this.match(MathCommandParser.RR);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public rayDef(): RayDefContext {
		let _localctx: RayDefContext = new RayDefContext(this._ctx, this.state);
		this.enterRule(_localctx, 24, MathCommandParser.RULE_rayDef);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 273;
			this.match(MathCommandParser.RAY);
			this.state = 274;
			this.match(MathCommandParser.LR);
			{
			this.state = 275;
			this.pointExpr();
			this.state = 276;
			this.match(MathCommandParser.COMMA);
			this.state = 279;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case MathCommandParser.POINT:
			case MathCommandParser.POINT_ID:
			case MathCommandParser.LR:
				{
				this.state = 277;
				this.pointExpr();
				}
				break;
			case MathCommandParser.VECTOR:
			case MathCommandParser.SHAPE_ID:
				{
				this.state = 278;
				this.vectorExpr();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			}
			this.state = 281;
			this.match(MathCommandParser.RR);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public intersectionDef(): IntersectionDefContext {
		let _localctx: IntersectionDefContext = new IntersectionDefContext(this._ctx, this.state);
		this.enterRule(_localctx, 26, MathCommandParser.RULE_intersectionDef);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 283;
			this.match(MathCommandParser.INTERSECT);
			this.state = 284;
			this.match(MathCommandParser.LR);
			{
			this.state = 285;
			this.expr();
			this.state = 286;
			this.match(MathCommandParser.COMMA);
			this.state = 287;
			this.expr();
			}
			this.state = 289;
			this.match(MathCommandParser.RR);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public transformDef(): TransformDefContext {
		let _localctx: TransformDefContext = new TransformDefContext(this._ctx, this.state);
		this.enterRule(_localctx, 28, MathCommandParser.RULE_transformDef);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 346;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case MathCommandParser.TRANSLATE:
				{
				{
				this.state = 291;
				this.match(MathCommandParser.TRANSLATE);
				this.state = 292;
				this.match(MathCommandParser.LR);
				{
				this.state = 293;
				this.shapeExpr();
				this.state = 294;
				this.match(MathCommandParser.COMMA);
				this.state = 295;
				this.vectorExpr();
				}
				this.state = 297;
				this.match(MathCommandParser.RR);
				}
				}
				break;
			case MathCommandParser.ROTATE:
				{
				{
				this.state = 299;
				this.match(MathCommandParser.ROTATE);
				this.state = 300;
				this.match(MathCommandParser.LR);
				{
				this.state = 301;
				this.shapeExpr();
				this.state = 302;
				this.match(MathCommandParser.COMMA);
				this.state = 303;
				this.numberExpr();
				this.state = 313;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 11, this._ctx) ) {
				case 1:
					{
					{
					this.state = 304;
					this.match(MathCommandParser.COMMA);
					this.state = 305;
					this.pointExpr();
					}
					}
					break;

				case 2:
					{
					{
					this.state = 306;
					this.match(MathCommandParser.COMMA);
					this.state = 307;
					this.directionExpr();
					}
					}
					break;

				case 3:
					{
					{
					this.state = 308;
					this.match(MathCommandParser.COMMA);
					this.state = 309;
					this.pointExpr();
					this.state = 310;
					this.match(MathCommandParser.COMMA);
					this.state = 311;
					this.directionExpr();
					}
					}
					break;
				}
				}
				this.state = 315;
				this.match(MathCommandParser.RR);
				}
				}
				break;
			case MathCommandParser.PROJECT:
				{
				{
				this.state = 317;
				this.match(MathCommandParser.PROJECT);
				this.state = 318;
				this.match(MathCommandParser.LR);
				{
				this.state = 319;
				this.pointExpr();
				this.state = 320;
				this.match(MathCommandParser.COMMA);
				this.state = 321;
				this.planeExpr();
				}
				this.state = 323;
				this.match(MathCommandParser.RR);
				}
				}
				break;
			case MathCommandParser.REFLECT:
				{
				{
				this.state = 325;
				this.match(MathCommandParser.REFLECT);
				this.state = 326;
				this.match(MathCommandParser.LR);
				{
				this.state = 327;
				this.shapeExpr();
				this.state = 328;
				this.match(MathCommandParser.COMMA);
				this.state = 332;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 12, this._ctx) ) {
				case 1:
					{
					this.state = 329;
					this.planeExpr();
					}
					break;

				case 2:
					{
					this.state = 330;
					this.lineExpr();
					}
					break;

				case 3:
					{
					this.state = 331;
					this.pointExpr();
					}
					break;
				}
				}
				this.state = 334;
				this.match(MathCommandParser.RR);
				}
				}
				break;
			case MathCommandParser.ENLARGE:
				{
				{
				this.state = 336;
				this.match(MathCommandParser.ENLARGE);
				this.state = 337;
				this.match(MathCommandParser.LR);
				{
				this.state = 338;
				this.shapeExpr();
				this.state = 339;
				this.match(MathCommandParser.COMMA);
				this.state = 340;
				this.numberExpr();
				this.state = 341;
				this.match(MathCommandParser.COMMA);
				this.state = 342;
				this.pointExpr();
				}
				this.state = 344;
				this.match(MathCommandParser.RR);
				}
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public cylinderDef(): CylinderDefContext {
		let _localctx: CylinderDefContext = new CylinderDefContext(this._ctx, this.state);
		this.enterRule(_localctx, 30, MathCommandParser.RULE_cylinderDef);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 348;
			this.match(MathCommandParser.CYLINDER);
			this.state = 349;
			this.match(MathCommandParser.LR);
			{
			this.state = 350;
			this.pointExpr();
			this.state = 351;
			this.match(MathCommandParser.COMMA);
			this.state = 352;
			this.pointExpr();
			this.state = 353;
			this.match(MathCommandParser.COMMA);
			this.state = 354;
			this.numberExpr();
			}
			this.state = 356;
			this.match(MathCommandParser.RR);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public tetrahedronDef(): TetrahedronDefContext {
		let _localctx: TetrahedronDefContext = new TetrahedronDefContext(this._ctx, this.state);
		this.enterRule(_localctx, 32, MathCommandParser.RULE_tetrahedronDef);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 358;
			this.match(MathCommandParser.TETRAHEDRON);
			this.state = 359;
			this.match(MathCommandParser.LR);
			{
			this.state = 367;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case MathCommandParser.POLYGON:
			case MathCommandParser.SHAPE_ID:
				{
				this.state = 360;
				this.polygonExpr();
				}
				break;
			case MathCommandParser.POINT:
			case MathCommandParser.POINT_ID:
			case MathCommandParser.LR:
				{
				{
				this.state = 361;
				this.pointExpr();
				this.state = 362;
				this.match(MathCommandParser.COMMA);
				this.state = 363;
				this.pointExpr();
				this.state = 364;
				this.match(MathCommandParser.COMMA);
				this.state = 365;
				this.pointExpr();
				}
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this.state = 369;
			this.match(MathCommandParser.COMMA);
			this.state = 370;
			this.pointExpr();
			}
			this.state = 372;
			this.match(MathCommandParser.RR);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public coneDef(): ConeDefContext {
		let _localctx: ConeDefContext = new ConeDefContext(this._ctx, this.state);
		this.enterRule(_localctx, 34, MathCommandParser.RULE_coneDef);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 374;
			this.match(MathCommandParser.CONE);
			this.state = 375;
			this.match(MathCommandParser.LR);
			{
			this.state = 376;
			this.pointExpr();
			this.state = 377;
			this.match(MathCommandParser.COMMA);
			this.state = 378;
			this.numberExpr();
			this.state = 379;
			this.match(MathCommandParser.COMMA);
			this.state = 380;
			this.pointExpr();
			}
			this.state = 382;
			this.match(MathCommandParser.RR);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public prismDef(): PrismDefContext {
		let _localctx: PrismDefContext = new PrismDefContext(this._ctx, this.state);
		this.enterRule(_localctx, 36, MathCommandParser.RULE_prismDef);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 384;
			this.match(MathCommandParser.PRISM);
			this.state = 385;
			this.match(MathCommandParser.LR);
			{
			this.state = 386;
			this.polygonExpr();
			this.state = 387;
			this.match(MathCommandParser.COMMA);
			this.state = 388;
			this.directionExpr();
			}
			this.state = 390;
			this.match(MathCommandParser.RR);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public pyramidDef(): PyramidDefContext {
		let _localctx: PyramidDefContext = new PyramidDefContext(this._ctx, this.state);
		this.enterRule(_localctx, 38, MathCommandParser.RULE_pyramidDef);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 392;
			this.match(MathCommandParser.PYRAMID);
			this.state = 393;
			this.match(MathCommandParser.LR);
			{
			this.state = 394;
			this.polygonExpr();
			this.state = 395;
			this.match(MathCommandParser.COMMA);
			this.state = 396;
			this.pointExpr();
			}
			this.state = 398;
			this.match(MathCommandParser.RR);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public numberExpr(): NumberExprContext {
		let _localctx: NumberExprContext = new NumberExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 40, MathCommandParser.RULE_numberExpr);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 400;
			this.additiveExpr(0);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public additiveExpr(): AdditiveExprContext;
	public additiveExpr(_p: number): AdditiveExprContext;
	// @RuleVersion(0)
	public additiveExpr(_p?: number): AdditiveExprContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let _localctx: AdditiveExprContext = new AdditiveExprContext(this._ctx, _parentState);
		let _prevctx: AdditiveExprContext = _localctx;
		let _startState: number = 42;
		this.enterRecursionRule(_localctx, 42, MathCommandParser.RULE_additiveExpr, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			{
			this.state = 403;
			this.multiplicativeExpr(0);
			}
			this._ctx._stop = this._input.tryLT(-1);
			this.state = 413;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 16, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = _localctx;
					{
					this.state = 411;
					this._errHandler.sync(this);
					switch ( this.interpreter.adaptivePredict(this._input, 15, this._ctx) ) {
					case 1:
						{
						_localctx = new AdditiveExprContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, MathCommandParser.RULE_additiveExpr);
						this.state = 405;
						if (!(this.precpred(this._ctx, 3))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 3)");
						}
						this.state = 406;
						this.match(MathCommandParser.ADD);
						this.state = 407;
						this.multiplicativeExpr(0);
						}
						break;

					case 2:
						{
						_localctx = new AdditiveExprContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, MathCommandParser.RULE_additiveExpr);
						this.state = 408;
						if (!(this.precpred(this._ctx, 2))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 2)");
						}
						this.state = 409;
						this.match(MathCommandParser.SUB);
						this.state = 410;
						this.multiplicativeExpr(0);
						}
						break;
					}
					}
				}
				this.state = 415;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 16, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return _localctx;
	}

	public multiplicativeExpr(): MultiplicativeExprContext;
	public multiplicativeExpr(_p: number): MultiplicativeExprContext;
	// @RuleVersion(0)
	public multiplicativeExpr(_p?: number): MultiplicativeExprContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let _localctx: MultiplicativeExprContext = new MultiplicativeExprContext(this._ctx, _parentState);
		let _prevctx: MultiplicativeExprContext = _localctx;
		let _startState: number = 44;
		this.enterRecursionRule(_localctx, 44, MathCommandParser.RULE_multiplicativeExpr, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 419;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 17, this._ctx) ) {
			case 1:
				{
				this.state = 417;
				this.implicitMultiplicativeExpr();
				}
				break;

			case 2:
				{
				this.state = 418;
				this.exponentialExpr();
				}
				break;
			}
			this._ctx._stop = this._input.tryLT(-1);
			this.state = 429;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 19, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = _localctx;
					{
					this.state = 427;
					this._errHandler.sync(this);
					switch ( this.interpreter.adaptivePredict(this._input, 18, this._ctx) ) {
					case 1:
						{
						_localctx = new MultiplicativeExprContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, MathCommandParser.RULE_multiplicativeExpr);
						this.state = 421;
						if (!(this.precpred(this._ctx, 4))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 4)");
						}
						this.state = 422;
						this.match(MathCommandParser.MULTIPLY);
						this.state = 423;
						this.exponentialExpr();
						}
						break;

					case 2:
						{
						_localctx = new MultiplicativeExprContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, MathCommandParser.RULE_multiplicativeExpr);
						this.state = 424;
						if (!(this.precpred(this._ctx, 3))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 3)");
						}
						this.state = 425;
						this.match(MathCommandParser.DIVIDE);
						this.state = 426;
						this.exponentialExpr();
						}
						break;
					}
					}
				}
				this.state = 431;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 19, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public implicitMultiplicativeExpr(): ImplicitMultiplicativeExprContext {
		let _localctx: ImplicitMultiplicativeExprContext = new ImplicitMultiplicativeExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 46, MathCommandParser.RULE_implicitMultiplicativeExpr);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 432;
			this.primaryExpr();
			this.state = 434;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 433;
					this.primaryExpr();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 436;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 20, this._ctx);
			} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public exponentialExpr(): ExponentialExprContext {
		let _localctx: ExponentialExprContext = new ExponentialExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 48, MathCommandParser.RULE_exponentialExpr);
		try {
			this.state = 443;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 21, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 438;
				this.unaryExpr();
				this.state = 439;
				this.match(MathCommandParser.POWER);
				this.state = 440;
				this.exponentialExpr();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 442;
				this.unaryExpr();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public unaryExpr(): UnaryExprContext {
		let _localctx: UnaryExprContext = new UnaryExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 50, MathCommandParser.RULE_unaryExpr);
		try {
			this.state = 450;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case MathCommandParser.SUB:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 445;
				this.match(MathCommandParser.SUB);
				this.state = 446;
				this.unaryExpr();
				}
				break;
			case MathCommandParser.ADD:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 447;
				this.match(MathCommandParser.ADD);
				this.state = 448;
				this.unaryExpr();
				}
				break;
			case MathCommandParser.SIN:
			case MathCommandParser.COS:
			case MathCommandParser.TAN:
			case MathCommandParser.COT:
			case MathCommandParser.LOG:
			case MathCommandParser.LN:
			case MathCommandParser.EXP:
			case MathCommandParser.SQRT:
			case MathCommandParser.CBRT:
			case MathCommandParser.ABS:
			case MathCommandParser.PI:
			case MathCommandParser.E:
			case MathCommandParser.LR:
			case MathCommandParser.INT_LIT:
			case MathCommandParser.FLOAT_LIT:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 449;
				this.primaryExpr();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public primaryExpr(): PrimaryExprContext {
		let _localctx: PrimaryExprContext = new PrimaryExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 52, MathCommandParser.RULE_primaryExpr);
		try {
			this.state = 470;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case MathCommandParser.INT_LIT:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 452;
				this.match(MathCommandParser.INT_LIT);
				}
				break;
			case MathCommandParser.FLOAT_LIT:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 453;
				this.match(MathCommandParser.FLOAT_LIT);
				}
				break;
			case MathCommandParser.PI:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 454;
				this.match(MathCommandParser.PI);
				}
				break;
			case MathCommandParser.E:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 455;
				this.match(MathCommandParser.E);
				}
				break;
			case MathCommandParser.LR:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 456;
				this.match(MathCommandParser.LR);
				this.state = 457;
				this.numberExpr();
				this.state = 458;
				this.match(MathCommandParser.RR);
				}
				break;
			case MathCommandParser.SIN:
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 460;
				this.sinExpr();
				}
				break;
			case MathCommandParser.COS:
				this.enterOuterAlt(_localctx, 7);
				{
				this.state = 461;
				this.cosExpr();
				}
				break;
			case MathCommandParser.TAN:
				this.enterOuterAlt(_localctx, 8);
				{
				this.state = 462;
				this.tanExpr();
				}
				break;
			case MathCommandParser.COT:
				this.enterOuterAlt(_localctx, 9);
				{
				this.state = 463;
				this.cotExpr();
				}
				break;
			case MathCommandParser.LOG:
				this.enterOuterAlt(_localctx, 10);
				{
				this.state = 464;
				this.logExpr();
				}
				break;
			case MathCommandParser.LN:
				this.enterOuterAlt(_localctx, 11);
				{
				this.state = 465;
				this.lnExpr();
				}
				break;
			case MathCommandParser.EXP:
				this.enterOuterAlt(_localctx, 12);
				{
				this.state = 466;
				this.expExpr();
				}
				break;
			case MathCommandParser.ABS:
				this.enterOuterAlt(_localctx, 13);
				{
				this.state = 467;
				this.absExpr();
				}
				break;
			case MathCommandParser.SQRT:
				this.enterOuterAlt(_localctx, 14);
				{
				this.state = 468;
				this.sqrtExpr();
				}
				break;
			case MathCommandParser.CBRT:
				this.enterOuterAlt(_localctx, 15);
				{
				this.state = 469;
				this.cbrtExpr();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public sinExpr(): SinExprContext {
		let _localctx: SinExprContext = new SinExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 54, MathCommandParser.RULE_sinExpr);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 472;
			this.match(MathCommandParser.SIN);
			this.state = 473;
			this.match(MathCommandParser.LR);
			this.state = 474;
			this.numberExpr();
			this.state = 475;
			this.match(MathCommandParser.RR);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public cosExpr(): CosExprContext {
		let _localctx: CosExprContext = new CosExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 56, MathCommandParser.RULE_cosExpr);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 477;
			this.match(MathCommandParser.COS);
			this.state = 478;
			this.match(MathCommandParser.LR);
			this.state = 479;
			this.numberExpr();
			this.state = 480;
			this.match(MathCommandParser.RR);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public tanExpr(): TanExprContext {
		let _localctx: TanExprContext = new TanExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 58, MathCommandParser.RULE_tanExpr);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 482;
			this.match(MathCommandParser.TAN);
			this.state = 483;
			this.match(MathCommandParser.LR);
			this.state = 484;
			this.numberExpr();
			this.state = 485;
			this.match(MathCommandParser.RR);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public cotExpr(): CotExprContext {
		let _localctx: CotExprContext = new CotExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 60, MathCommandParser.RULE_cotExpr);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 487;
			this.match(MathCommandParser.COT);
			this.state = 488;
			this.match(MathCommandParser.LR);
			this.state = 489;
			this.numberExpr();
			this.state = 490;
			this.match(MathCommandParser.RR);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public logExpr(): LogExprContext {
		let _localctx: LogExprContext = new LogExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 62, MathCommandParser.RULE_logExpr);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 492;
			this.match(MathCommandParser.LOG);
			this.state = 493;
			this.match(MathCommandParser.LR);
			{
			this.state = 494;
			this.numberExpr();
			this.state = 495;
			this.match(MathCommandParser.COMMA);
			this.state = 496;
			this.numberExpr();
			}
			this.state = 498;
			this.match(MathCommandParser.RR);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public lnExpr(): LnExprContext {
		let _localctx: LnExprContext = new LnExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 64, MathCommandParser.RULE_lnExpr);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 500;
			this.match(MathCommandParser.LN);
			this.state = 501;
			this.match(MathCommandParser.LR);
			this.state = 502;
			this.numberExpr();
			this.state = 503;
			this.match(MathCommandParser.RR);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public cbrtExpr(): CbrtExprContext {
		let _localctx: CbrtExprContext = new CbrtExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 66, MathCommandParser.RULE_cbrtExpr);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 505;
			this.match(MathCommandParser.CBRT);
			this.state = 506;
			this.match(MathCommandParser.LR);
			this.state = 507;
			this.numberExpr();
			this.state = 508;
			this.match(MathCommandParser.RR);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public sqrtExpr(): SqrtExprContext {
		let _localctx: SqrtExprContext = new SqrtExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 68, MathCommandParser.RULE_sqrtExpr);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 510;
			this.match(MathCommandParser.SQRT);
			this.state = 511;
			this.match(MathCommandParser.LR);
			this.state = 512;
			this.numberExpr();
			this.state = 513;
			this.match(MathCommandParser.RR);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public absExpr(): AbsExprContext {
		let _localctx: AbsExprContext = new AbsExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 70, MathCommandParser.RULE_absExpr);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 515;
			this.match(MathCommandParser.ABS);
			this.state = 516;
			this.match(MathCommandParser.LR);
			this.state = 517;
			this.numberExpr();
			this.state = 518;
			this.match(MathCommandParser.RR);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public expExpr(): ExpExprContext {
		let _localctx: ExpExprContext = new ExpExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 72, MathCommandParser.RULE_expExpr);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 520;
			this.match(MathCommandParser.EXP);
			this.state = 521;
			this.match(MathCommandParser.LR);
			this.state = 522;
			this.numberExpr();
			this.state = 523;
			this.match(MathCommandParser.RR);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public pointExpr(): PointExprContext {
		let _localctx: PointExprContext = new PointExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 74, MathCommandParser.RULE_pointExpr);
		try {
			this.state = 527;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case MathCommandParser.POINT_ID:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 525;
				this.match(MathCommandParser.POINT_ID);
				}
				break;
			case MathCommandParser.POINT:
			case MathCommandParser.LR:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 526;
				this.pointDef();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public lineExpr(): LineExprContext {
		let _localctx: LineExprContext = new LineExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 76, MathCommandParser.RULE_lineExpr);
		try {
			this.state = 531;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case MathCommandParser.LINE:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 529;
				this.lineDef();
				}
				break;
			case MathCommandParser.SHAPE_ID:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 530;
				this.match(MathCommandParser.SHAPE_ID);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public dirExpr(): DirExprContext {
		let _localctx: DirExprContext = new DirExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 78, MathCommandParser.RULE_dirExpr);
		try {
			this.state = 544;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 26, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 533;
				this.pointExpr();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 534;
				this.vectorExpr();
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 535;
				this.match(MathCommandParser.LR);
				{
				this.state = 536;
				this.numberExpr();
				this.state = 537;
				this.match(MathCommandParser.COMMA);
				this.state = 538;
				this.numberExpr();
				this.state = 539;
				this.match(MathCommandParser.COMMA);
				this.state = 540;
				this.numberExpr();
				}
				this.state = 542;
				this.match(MathCommandParser.RR);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public vectorExpr(): VectorExprContext {
		let _localctx: VectorExprContext = new VectorExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 80, MathCommandParser.RULE_vectorExpr);
		try {
			this.state = 548;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case MathCommandParser.VECTOR:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 546;
				this.vectorDef();
				}
				break;
			case MathCommandParser.SHAPE_ID:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 547;
				this.match(MathCommandParser.SHAPE_ID);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public planeExpr(): PlaneExprContext {
		let _localctx: PlaneExprContext = new PlaneExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 82, MathCommandParser.RULE_planeExpr);
		try {
			this.state = 552;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case MathCommandParser.PLANE:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 550;
				this.planeDef();
				}
				break;
			case MathCommandParser.SHAPE_ID:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 551;
				this.match(MathCommandParser.SHAPE_ID);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public directionExpr(): DirectionExprContext {
		let _localctx: DirectionExprContext = new DirectionExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 84, MathCommandParser.RULE_directionExpr);
		try {
			this.state = 560;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 29, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 554;
				this.match(MathCommandParser.SHAPE_ID);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 555;
				this.vectorExpr();
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 556;
				this.lineExpr();
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 557;
				this.segmentExpr();
				}
				break;

			case 5:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 558;
				this.rayExpr();
				}
				break;

			case 6:
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 559;
				this.planeExpr();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public polygonExpr(): PolygonExprContext {
		let _localctx: PolygonExprContext = new PolygonExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 86, MathCommandParser.RULE_polygonExpr);
		try {
			this.state = 564;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case MathCommandParser.SHAPE_ID:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 562;
				this.match(MathCommandParser.SHAPE_ID);
				}
				break;
			case MathCommandParser.POLYGON:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 563;
				this.polygonDef();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public tetrahedronExpr(): TetrahedronExprContext {
		let _localctx: TetrahedronExprContext = new TetrahedronExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 88, MathCommandParser.RULE_tetrahedronExpr);
		try {
			this.state = 568;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case MathCommandParser.SHAPE_ID:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 566;
				this.match(MathCommandParser.SHAPE_ID);
				}
				break;
			case MathCommandParser.TETRAHEDRON:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 567;
				this.tetrahedronDef();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public cylinderExpr(): CylinderExprContext {
		let _localctx: CylinderExprContext = new CylinderExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 90, MathCommandParser.RULE_cylinderExpr);
		try {
			this.state = 572;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case MathCommandParser.SHAPE_ID:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 570;
				this.match(MathCommandParser.SHAPE_ID);
				}
				break;
			case MathCommandParser.CYLINDER:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 571;
				this.cylinderDef();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public coneExpr(): ConeExprContext {
		let _localctx: ConeExprContext = new ConeExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 92, MathCommandParser.RULE_coneExpr);
		try {
			this.state = 576;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case MathCommandParser.SHAPE_ID:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 574;
				this.match(MathCommandParser.SHAPE_ID);
				}
				break;
			case MathCommandParser.CONE:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 575;
				this.coneDef();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public prismExpr(): PrismExprContext {
		let _localctx: PrismExprContext = new PrismExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 94, MathCommandParser.RULE_prismExpr);
		try {
			this.state = 580;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case MathCommandParser.SHAPE_ID:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 578;
				this.match(MathCommandParser.SHAPE_ID);
				}
				break;
			case MathCommandParser.PRISM:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 579;
				this.prismDef();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public segmentExpr(): SegmentExprContext {
		let _localctx: SegmentExprContext = new SegmentExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 96, MathCommandParser.RULE_segmentExpr);
		try {
			this.state = 584;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case MathCommandParser.SHAPE_ID:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 582;
				this.match(MathCommandParser.SHAPE_ID);
				}
				break;
			case MathCommandParser.SEGMENT:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 583;
				this.segmentDef();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public rayExpr(): RayExprContext {
		let _localctx: RayExprContext = new RayExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 98, MathCommandParser.RULE_rayExpr);
		try {
			this.state = 588;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case MathCommandParser.SHAPE_ID:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 586;
				this.match(MathCommandParser.SHAPE_ID);
				}
				break;
			case MathCommandParser.RAY:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 587;
				this.rayDef();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public pyramidExpr(): PyramidExprContext {
		let _localctx: PyramidExprContext = new PyramidExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 100, MathCommandParser.RULE_pyramidExpr);
		try {
			this.state = 592;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case MathCommandParser.SHAPE_ID:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 590;
				this.match(MathCommandParser.SHAPE_ID);
				}
				break;
			case MathCommandParser.PYRAMID:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 591;
				this.pyramidDef();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public shapeExpr(): ShapeExprContext {
		let _localctx: ShapeExprContext = new ShapeExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 102, MathCommandParser.RULE_shapeExpr);
		try {
			this.state = 611;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 38, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 594;
				this.rayExpr();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 595;
				this.coneExpr();
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 596;
				this.lineExpr();
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 597;
				this.angleDef();
				}
				break;

			case 5:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 598;
				this.planeExpr();
				}
				break;

			case 6:
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 599;
				this.pointExpr();
				}
				break;

			case 7:
				this.enterOuterAlt(_localctx, 7);
				{
				this.state = 600;
				this.prismExpr();
				}
				break;

			case 8:
				this.enterOuterAlt(_localctx, 8);
				{
				this.state = 601;
				this.circleDef();
				}
				break;

			case 9:
				this.enterOuterAlt(_localctx, 9);
				{
				this.state = 602;
				this.sphereDef();
				}
				break;

			case 10:
				this.enterOuterAlt(_localctx, 10);
				{
				this.state = 603;
				this.vectorExpr();
				}
				break;

			case 11:
				this.enterOuterAlt(_localctx, 11);
				{
				this.state = 604;
				this.polygonExpr();
				}
				break;

			case 12:
				this.enterOuterAlt(_localctx, 12);
				{
				this.state = 605;
				this.segmentExpr();
				}
				break;

			case 13:
				this.enterOuterAlt(_localctx, 13);
				{
				this.state = 606;
				this.cylinderExpr();
				}
				break;

			case 14:
				this.enterOuterAlt(_localctx, 14);
				{
				this.state = 607;
				this.transformDef();
				}
				break;

			case 15:
				this.enterOuterAlt(_localctx, 15);
				{
				this.state = 608;
				this.tetrahedronExpr();
				}
				break;

			case 16:
				this.enterOuterAlt(_localctx, 16);
				{
				this.state = 609;
				this.intersectionDef();
				}
				break;

			case 17:
				this.enterOuterAlt(_localctx, 17);
				{
				this.state = 610;
				this.pyramidExpr();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public sempred(_localctx: RuleContext, ruleIndex: number, predIndex: number): boolean {
		switch (ruleIndex) {
		case 21:
			return this.additiveExpr_sempred(_localctx as AdditiveExprContext, predIndex);

		case 22:
			return this.multiplicativeExpr_sempred(_localctx as MultiplicativeExprContext, predIndex);
		}
		return true;
	}
	private additiveExpr_sempred(_localctx: AdditiveExprContext, predIndex: number): boolean {
		switch (predIndex) {
		case 0:
			return this.precpred(this._ctx, 3);

		case 1:
			return this.precpred(this._ctx, 2);
		}
		return true;
	}
	private multiplicativeExpr_sempred(_localctx: MultiplicativeExprContext, predIndex: number): boolean {
		switch (predIndex) {
		case 2:
			return this.precpred(this._ctx, 4);

		case 3:
			return this.precpred(this._ctx, 3);
		}
		return true;
	}

	private static readonly _serializedATNSegments: number = 2;
	private static readonly _serializedATNSegment0: string =
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x037\u0268\x04\x02" +
		"\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04\x07" +
		"\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x04\f\t\f\x04\r\t\r\x04" +
		"\x0E\t\x0E\x04\x0F\t\x0F\x04\x10\t\x10\x04\x11\t\x11\x04\x12\t\x12\x04" +
		"\x13\t\x13\x04\x14\t\x14\x04\x15\t\x15\x04\x16\t\x16\x04\x17\t\x17\x04" +
		"\x18\t\x18\x04\x19\t\x19\x04\x1A\t\x1A\x04\x1B\t\x1B\x04\x1C\t\x1C\x04" +
		"\x1D\t\x1D\x04\x1E\t\x1E\x04\x1F\t\x1F\x04 \t \x04!\t!\x04\"\t\"\x04#" +
		"\t#\x04$\t$\x04%\t%\x04&\t&\x04\'\t\'\x04(\t(\x04)\t)\x04*\t*\x04+\t+" +
		"\x04,\t,\x04-\t-\x04.\t.\x04/\t/\x040\t0\x041\t1\x042\t2\x043\t3\x044" +
		"\t4\x045\t5\x03\x02\x03\x02\x03\x02\x03\x03\x03\x03\x03\x04\x05\x04q\n" +
		"\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03" +
		"\x04\x03\x05\x03\x05\x03\x05\x03\x05\x03\x05\x03\x05\x05\x05\x82\n\x05" +
		"\x03\x05\x03\x05\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06" +
		"\x05\x06\x8D\n\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03" +
		"\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03" +
		"\x06\x05\x06\x9F\n\x06\x03\x06\x03\x06\x03\x07\x03\x07\x03\x07\x03\x07" +
		"\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07" +
		"\x03\x07\x05\x07\xB1\n\x07\x03\x07\x03\x07\x03\b\x03\b\x03\b\x03\b\x03" +
		"\b\x03\b\x03\b\x03\b\x03\b\x03\b\x03\b\x03\b\x03\b\x03\b\x03\b\x03\b\x03" +
		"\b\x03\b\x03\b\x03\b\x03\b\x03\b\x03\b\x03\b\x03\b\x03\b\x05\b\xCF\n\b" +
		"\x03\b\x03\b\x03\t\x03\t\x03\t\x03\t\x03\t\x03\t\x03\t\x05\t\xDA\n\t\x03" +
		"\t\x03\t\x03\n\x03\n\x03\n\x03\n\x03\n\x03\v\x03\v\x03\v\x03\v\x03\v\x05" +
		"\v\xE8\n\v\x03\f\x03\f\x03\f\x03\f\x03\f\x03\f\x03\f\x03\f\x03\f\x03\f" +
		"\x03\f\x03\f\x03\f\x03\f\x03\f\x03\f\x03\f\x03\f\x03\f\x03\f\x03\f\x03" +
		"\f\x03\f\x03\f\x03\f\x03\f\x03\f\x03\f\x05\f\u0106\n\f\x03\f\x03\f\x03" +
		"\r\x03\r\x03\r\x03\r\x03\r\x03\r\x05\r\u0110\n\r\x03\r\x03\r\x03\x0E\x03" +
		"\x0E\x03\x0E\x03\x0E\x03\x0E\x03\x0E\x05\x0E\u011A\n\x0E\x03\x0E\x03\x0E" +
		"\x03\x0F\x03\x0F\x03\x0F\x03\x0F\x03\x0F\x03\x0F\x03\x0F\x03\x0F\x03\x10" +
		"\x03\x10\x03\x10\x03\x10\x03\x10\x03\x10\x03\x10\x03\x10\x03\x10\x03\x10" +
		"\x03\x10\x03\x10\x03\x10\x03\x10\x03\x10\x03\x10\x03\x10\x03\x10\x03\x10" +
		"\x03\x10\x03\x10\x03\x10\x05\x10\u013C\n\x10\x03\x10\x03\x10\x03\x10\x03" +
		"\x10\x03\x10\x03\x10\x03\x10\x03\x10\x03\x10\x03\x10\x03\x10\x03\x10\x03" +
		"\x10\x03\x10\x03\x10\x03\x10\x03\x10\x05\x10\u014F\n\x10\x03\x10\x03\x10" +
		"\x03\x10\x03\x10\x03\x10\x03\x10\x03\x10\x03\x10\x03\x10\x03\x10\x03\x10" +
		"\x03\x10\x05\x10\u015D\n\x10\x03\x11\x03\x11\x03\x11\x03\x11\x03\x11\x03" +
		"\x11\x03\x11\x03\x11\x03\x11\x03\x11\x03\x12\x03\x12\x03\x12\x03\x12\x03" +
		"\x12\x03\x12\x03\x12\x03\x12\x03\x12\x05\x12\u0172\n\x12\x03\x12\x03\x12" +
		"\x03\x12\x03\x12\x03\x12\x03\x13\x03\x13\x03\x13\x03\x13\x03\x13\x03\x13" +
		"\x03\x13\x03\x13\x03\x13\x03\x13\x03\x14\x03\x14\x03\x14\x03\x14\x03\x14" +
		"\x03\x14\x03\x14\x03\x14\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15" +
		"\x03\x15\x03\x15\x03\x16\x03\x16\x03\x17\x03\x17\x03\x17\x03\x17\x03\x17" +
		"\x03\x17\x03\x17\x03\x17\x03\x17\x07\x17\u019E\n\x17\f\x17\x0E\x17\u01A1" +
		"\v\x17\x03\x18\x03\x18\x03\x18\x05\x18\u01A6\n\x18\x03\x18\x03\x18\x03" +
		"\x18\x03\x18\x03\x18\x03\x18\x07\x18\u01AE\n\x18\f\x18\x0E\x18\u01B1\v" +
		"\x18\x03\x19\x03\x19\x06\x19\u01B5\n\x19\r\x19\x0E\x19\u01B6\x03\x1A\x03" +
		"\x1A\x03\x1A\x03\x1A\x03\x1A\x05\x1A\u01BE\n\x1A\x03\x1B\x03\x1B\x03\x1B" +
		"\x03\x1B\x03\x1B\x05\x1B\u01C5\n\x1B\x03\x1C\x03\x1C\x03\x1C\x03\x1C\x03" +
		"\x1C\x03\x1C\x03\x1C\x03\x1C\x03\x1C\x03\x1C\x03\x1C\x03\x1C\x03\x1C\x03" +
		"\x1C\x03\x1C\x03\x1C\x03\x1C\x03\x1C\x05\x1C\u01D9\n\x1C\x03\x1D\x03\x1D" +
		"\x03\x1D\x03\x1D\x03\x1D\x03\x1E\x03\x1E\x03\x1E\x03\x1E\x03\x1E\x03\x1F" +
		"\x03\x1F\x03\x1F\x03\x1F\x03\x1F\x03 \x03 \x03 \x03 \x03 \x03!\x03!\x03" +
		"!\x03!\x03!\x03!\x03!\x03!\x03\"\x03\"\x03\"\x03\"\x03\"\x03#\x03#\x03" +
		"#\x03#\x03#\x03$\x03$\x03$\x03$\x03$\x03%\x03%\x03%\x03%\x03%\x03&\x03" +
		"&\x03&\x03&\x03&\x03\'\x03\'\x05\'\u0212\n\'\x03(\x03(\x05(\u0216\n(\x03" +
		")\x03)\x03)\x03)\x03)\x03)\x03)\x03)\x03)\x03)\x03)\x05)\u0223\n)\x03" +
		"*\x03*\x05*\u0227\n*\x03+\x03+\x05+\u022B\n+\x03,\x03,\x03,\x03,\x03," +
		"\x03,\x05,\u0233\n,\x03-\x03-\x05-\u0237\n-\x03.\x03.\x05.\u023B\n.\x03" +
		"/\x03/\x05/\u023F\n/\x030\x030\x050\u0243\n0\x031\x031\x051\u0247\n1\x03" +
		"2\x032\x052\u024B\n2\x033\x033\x053\u024F\n3\x034\x034\x054\u0253\n4\x03" +
		"5\x035\x035\x035\x035\x035\x035\x035\x035\x035\x035\x035\x035\x035\x03" +
		"5\x035\x035\x055\u0266\n5\x035\x02\x02\x04,.6\x02\x02\x04\x02\x06\x02" +
		"\b\x02\n\x02\f\x02\x0E\x02\x10\x02\x12\x02\x14\x02\x16\x02\x18\x02\x1A" +
		"\x02\x1C\x02\x1E\x02 \x02\"\x02$\x02&\x02(\x02*\x02,\x02.\x020\x022\x02" +
		"4\x026\x028\x02:\x02<\x02>\x02@\x02B\x02D\x02F\x02H\x02J\x02L\x02N\x02" +
		"P\x02R\x02T\x02V\x02X\x02Z\x02\\\x02^\x02`\x02b\x02d\x02f\x02h\x02\x02" +
		"\x02\x02\u028E\x02j\x03\x02\x02\x02\x04m\x03\x02\x02\x02\x06p\x03\x02" +
		"\x02\x02\b{\x03\x02\x02\x02\n\x85\x03\x02\x02\x02\f\xA2\x03\x02\x02\x02" +
		"\x0E\xB4\x03\x02\x02\x02\x10\xD2\x03\x02\x02\x02\x12\xDD\x03\x02\x02\x02" +
		"\x14\xE7\x03\x02\x02\x02\x16\xE9\x03\x02\x02\x02\x18\u0109\x03\x02\x02" +
		"\x02\x1A\u0113\x03\x02\x02\x02\x1C\u011D\x03\x02\x02\x02\x1E\u015C\x03" +
		"\x02\x02\x02 \u015E\x03\x02\x02\x02\"\u0168\x03\x02\x02\x02$\u0178\x03" +
		"\x02\x02\x02&\u0182\x03\x02\x02\x02(\u018A\x03\x02\x02\x02*\u0192\x03" +
		"\x02\x02\x02,\u0194\x03\x02\x02\x02.\u01A5\x03\x02\x02\x020\u01B2\x03" +
		"\x02\x02\x022\u01BD\x03\x02\x02\x024\u01C4\x03\x02\x02\x026\u01D8\x03" +
		"\x02\x02\x028\u01DA\x03\x02\x02\x02:\u01DF\x03\x02\x02\x02<\u01E4\x03" +
		"\x02\x02\x02>\u01E9\x03\x02\x02\x02@\u01EE\x03\x02\x02\x02B\u01F6\x03" +
		"\x02\x02\x02D\u01FB\x03\x02\x02\x02F\u0200\x03\x02\x02\x02H\u0205\x03" +
		"\x02\x02\x02J\u020A\x03\x02\x02\x02L\u0211\x03\x02\x02\x02N\u0215\x03" +
		"\x02\x02\x02P\u0222\x03\x02\x02\x02R\u0226\x03\x02\x02\x02T\u022A\x03" +
		"\x02\x02\x02V\u0232\x03\x02\x02\x02X\u0236\x03\x02\x02\x02Z\u023A\x03" +
		"\x02\x02\x02\\\u023E\x03\x02\x02\x02^\u0242\x03\x02\x02\x02`\u0246\x03" +
		"\x02\x02\x02b\u024A\x03\x02\x02\x02d\u024E\x03\x02\x02\x02f\u0252\x03" +
		"\x02\x02\x02h\u0265\x03\x02\x02\x02jk\x05\x04\x03\x02kl\x07\x02\x02\x03" +
		"l\x03\x03\x02\x02\x02mn\x05h5\x02n\x05\x03\x02\x02\x02oq\x07\t\x02\x02" +
		"po\x03\x02\x02\x02pq\x03\x02\x02\x02qr\x03\x02\x02\x02rs\x07*\x02\x02" +
		"st\x05*\x16\x02tu\x07.\x02\x02uv\x05*\x16\x02vw\x07.\x02\x02wx\x05*\x16" +
		"\x02xy\x03\x02\x02\x02yz\x07+\x02\x02z\x07\x03\x02\x02\x02{|\x07\n\x02" +
		"\x02|}\x07*\x02\x02}~\x05L\'\x02~\x81\x07.\x02\x02\x7F\x82\x05L\'\x02" +
		"\x80\x82\x05*\x16\x02\x81\x7F\x03\x02\x02\x02\x81\x80\x03\x02\x02\x02" +
		"\x82\x83\x03\x02\x02\x02\x83\x84\x07+\x02\x02\x84\t\x03\x02\x02\x02\x85" +
		"\x86\x07\v\x02\x02\x86\x9E\x07*\x02\x02\x87\x9F\x07)\x02\x02\x88\x89\x05" +
		"L\'\x02\x89\x8C\x07.\x02\x02\x8A\x8D\x05T+\x02\x8B\x8D\x05N(\x02\x8C\x8A" +
		"\x03\x02\x02\x02\x8C\x8B\x03\x02\x02\x02\x8D\x9F\x03\x02\x02\x02\x8E\x8F" +
		"\x05N(\x02\x8F\x90\x07.\x02\x02\x90\x91\x05N(\x02\x91\x9F\x03\x02\x02" +
		"\x02\x92\x93\x05L\'\x02\x93\x94\x07.\x02\x02\x94\x95\x05R*\x02\x95\x96" +
		"\x07.\x02\x02\x96\x97\x05R*\x02\x97\x9F\x03\x02\x02\x02\x98\x99\x05L\'" +
		"\x02\x99\x9A\x07.\x02\x02\x9A\x9B\x05L\'\x02\x9B\x9C\x07.\x02\x02\x9C" +
		"\x9D\x05L\'\x02\x9D\x9F\x03\x02\x02\x02\x9E\x87\x03\x02\x02\x02\x9E\x88" +
		"\x03\x02\x02\x02\x9E\x8E\x03\x02\x02\x02\x9E\x92\x03\x02\x02\x02\x9E\x98" +
		"\x03\x02\x02\x02\x9F\xA0\x03\x02\x02\x02\xA0\xA1\x07+\x02\x02\xA1\v\x03" +
		"\x02\x02\x02\xA2\xA3\x07\x04\x02\x02\xA3\xB0\x07*\x02\x02\xA4\xA5\x05" +
		"L\'\x02\xA5\xA6\x07.\x02\x02\xA6\xA7\x05L\'\x02\xA7\xB1\x03\x02\x02\x02" +
		"\xA8\xA9\x05L\'\x02\xA9\xAA\x07.\x02\x02\xAA\xAB\x05N(\x02\xAB\xB1\x03" +
		"\x02\x02\x02\xAC\xAD\x05L\'\x02\xAD\xAE\x07.\x02\x02\xAE\xAF\x05R*\x02" +
		"\xAF\xB1\x03\x02\x02\x02\xB0\xA4\x03\x02\x02\x02\xB0\xA8\x03\x02\x02\x02" +
		"\xB0\xAC\x03\x02\x02\x02\xB1\xB2\x03\x02\x02\x02\xB2\xB3\x07+\x02\x02" +
		"\xB3\r\x03\x02\x02\x02\xB4\xB5\x07\r\x02\x02\xB5\xCE\x07*\x02\x02\xB6" +
		"\xCF\x05R*\x02\xB7\xCF\x05L\'\x02\xB8\xB9\x05R*\x02\xB9\xBA\x07.\x02\x02" +
		"\xBA\xBB\x05R*\x02\xBB\xCF\x03\x02\x02\x02\xBC\xBD\x05N(\x02\xBD\xBE\x07" +
		".\x02\x02\xBE\xBF\x05N(\x02\xBF\xCF\x03\x02\x02\x02\xC0\xC1\x05N(\x02" +
		"\xC1\xC2\x07.\x02\x02\xC2\xC3\x05T+\x02\xC3\xCF\x03\x02\x02\x02\xC4\xC5" +
		"\x05T+\x02\xC5\xC6\x07.\x02\x02\xC6\xC7\x05T+\x02\xC7\xCF\x03\x02\x02" +
		"\x02\xC8\xC9\x05L\'\x02\xC9\xCA\x07.\x02\x02\xCA\xCB\x05L\'\x02\xCB\xCC" +
		"\x07.\x02\x02\xCC\xCD\x05L\'\x02\xCD\xCF\x03\x02\x02\x02\xCE\xB6\x03\x02" +
		"\x02\x02\xCE\xB7\x03\x02\x02\x02\xCE\xB8\x03\x02\x02\x02\xCE\xBC\x03\x02" +
		"\x02\x02\xCE\xC0\x03\x02\x02\x02\xCE\xC4\x03\x02\x02\x02\xCE\xC8\x03\x02" +
		"\x02\x02\xCF\xD0\x03\x02\x02\x02\xD0\xD1\x07+\x02\x02\xD1\x0F\x03\x02" +
		"\x02\x02\xD2\xD3\x07\x05\x02\x02\xD3\xD9\x07*\x02\x02\xD4\xDA\x05L\'\x02" +
		"\xD5\xD6\x05L\'\x02\xD6\xD7\x07.\x02\x02\xD7\xD8\x05L\'\x02\xD8\xDA\x03" +
		"\x02\x02\x02\xD9\xD4\x03\x02\x02\x02\xD9\xD5\x03\x02\x02\x02\xDA\xDB\x03" +
		"\x02\x02\x02\xDB\xDC\x07+\x02\x02\xDC\x11\x03\x02\x02\x02\xDD\xDE\x07" +
		"\b\x02\x02\xDE\xDF\x07*\x02\x02\xDF\xE0\x05\x14\v\x02\xE0\xE1\x07+\x02" +
		"\x02\xE1\x13\x03\x02\x02\x02\xE2\xE3\x05L\'\x02\xE3\xE4\x07.\x02\x02\xE4" +
		"\xE5\x05\x14\v\x02\xE5\xE8\x03\x02\x02\x02\xE6\xE8\x05L\'\x02\xE7\xE2" +
		"\x03\x02\x02\x02\xE7\xE6\x03\x02\x02\x02\xE8\x15\x03\x02\x02\x02\xE9\xEA" +
		"\x07\x03\x02\x02\xEA\u0105\x07*\x02\x02\xEB\xEC\x05L\'\x02\xEC\xED\x07" +
		".\x02\x02\xED\xEE\x05*\x16\x02\xEE\u0106\x03\x02\x02\x02\xEF\xF0\x05L" +
		"\'\x02\xF0\xF1\x07.\x02\x02\xF1\xF2\x05L\'\x02\xF2\u0106\x03\x02\x02\x02" +
		"\xF3\xF4\x05L\'\x02\xF4\xF5\x07.\x02\x02\xF5\xF6\x05L\'\x02\xF6\xF7\x07" +
		".\x02\x02\xF7\xF8\x05L\'\x02\xF8\u0106\x03\x02\x02\x02\xF9\xFA\x05L\'" +
		"\x02\xFA\xFB\x07.\x02\x02\xFB\xFC\x05*\x16\x02\xFC\xFD\x07.\x02\x02\xFD" +
		"\xFE\x05V,\x02\xFE\u0106\x03\x02\x02\x02\xFF\u0100\x05L\'\x02\u0100\u0101" +
		"\x07.\x02\x02\u0101\u0102\x05L\'\x02\u0102\u0103\x07.\x02\x02\u0103\u0104" +
		"\x05V,\x02\u0104\u0106\x03\x02\x02\x02\u0105\xEB\x03\x02\x02\x02\u0105" +
		"\xEF\x03\x02\x02\x02\u0105\xF3\x03\x02\x02\x02\u0105\xF9\x03\x02\x02\x02" +
		"\u0105\xFF\x03\x02\x02\x02\u0106\u0107\x03\x02\x02\x02\u0107\u0108\x07" +
		"+\x02\x02\u0108\x17\x03\x02\x02\x02\u0109\u010A\x07\x06\x02\x02\u010A" +
		"\u010B\x07*\x02\x02\u010B\u010C\x05L\'\x02\u010C\u010F\x07.\x02\x02\u010D" +
		"\u0110\x05L\'\x02\u010E\u0110\x05*\x16\x02\u010F\u010D\x03\x02\x02\x02" +
		"\u010F\u010E\x03\x02\x02\x02\u0110\u0111\x03\x02\x02\x02\u0111\u0112\x07" +
		"+\x02\x02\u0112\x19\x03\x02\x02\x02\u0113\u0114\x07\x07\x02\x02\u0114" +
		"\u0115\x07*\x02\x02\u0115\u0116\x05L\'\x02\u0116\u0119\x07.\x02\x02\u0117" +
		"\u011A\x05L\'\x02\u0118\u011A\x05R*\x02\u0119\u0117\x03\x02\x02\x02\u0119" +
		"\u0118\x03\x02\x02\x02\u011A\u011B\x03\x02\x02\x02\u011B\u011C\x07+\x02" +
		"\x02\u011C\x1B\x03\x02\x02\x02\u011D\u011E\x07\f\x02\x02\u011E\u011F\x07" +
		"*\x02\x02\u011F\u0120\x05\x04\x03\x02\u0120\u0121\x07.\x02\x02\u0121\u0122" +
		"\x05\x04\x03\x02\u0122\u0123\x03\x02\x02\x02\u0123\u0124\x07+\x02\x02" +
		"\u0124\x1D\x03\x02\x02\x02\u0125\u0126\x07\x0E\x02\x02\u0126\u0127\x07" +
		"*\x02\x02\u0127\u0128\x05h5\x02\u0128\u0129\x07.\x02\x02\u0129\u012A\x05" +
		"R*\x02\u012A\u012B\x03\x02\x02\x02\u012B\u012C\x07+\x02\x02\u012C\u015D" +
		"\x03\x02\x02\x02\u012D\u012E\x07\x0F\x02\x02\u012E\u012F\x07*\x02\x02" +
		"\u012F\u0130\x05h5\x02\u0130\u0131\x07.\x02\x02\u0131\u013B\x05*\x16\x02" +
		"\u0132\u0133\x07.\x02\x02\u0133\u013C\x05L\'\x02\u0134\u0135\x07.\x02" +
		"\x02\u0135\u013C\x05V,\x02\u0136\u0137\x07.\x02\x02\u0137\u0138\x05L\'" +
		"\x02\u0138\u0139\x07.\x02\x02\u0139\u013A\x05V,\x02\u013A\u013C\x03\x02" +
		"\x02\x02\u013B\u0132\x03\x02\x02\x02\u013B\u0134\x03\x02\x02\x02\u013B" +
		"\u0136\x03\x02\x02\x02\u013B\u013C\x03\x02\x02\x02\u013C\u013D\x03\x02" +
		"\x02\x02\u013D\u013E\x07+\x02\x02\u013E\u015D\x03\x02\x02\x02\u013F\u0140" +
		"\x07\x10\x02\x02\u0140\u0141\x07*\x02\x02\u0141\u0142\x05L\'\x02\u0142" +
		"\u0143\x07.\x02\x02\u0143\u0144\x05T+\x02\u0144\u0145\x03\x02\x02\x02" +
		"\u0145\u0146\x07+\x02\x02\u0146\u015D\x03\x02\x02\x02\u0147\u0148\x07" +
		"\x11\x02\x02\u0148\u0149\x07*\x02\x02\u0149\u014A\x05h5\x02\u014A\u014E" +
		"\x07.\x02\x02\u014B\u014F\x05T+\x02\u014C\u014F\x05N(\x02\u014D\u014F" +
		"\x05L\'\x02\u014E\u014B\x03\x02\x02\x02\u014E\u014C\x03\x02\x02\x02\u014E" +
		"\u014D\x03\x02\x02\x02\u014F\u0150\x03\x02\x02\x02\u0150\u0151\x07+\x02" +
		"\x02\u0151\u015D\x03\x02\x02\x02\u0152\u0153\x07\x12\x02\x02\u0153\u0154" +
		"\x07*\x02\x02\u0154\u0155\x05h5\x02\u0155\u0156\x07.\x02\x02\u0156\u0157" +
		"\x05*\x16\x02\u0157\u0158\x07.\x02\x02\u0158\u0159\x05L\'\x02\u0159\u015A" +
		"\x03\x02\x02\x02\u015A\u015B\x07+\x02\x02\u015B\u015D\x03\x02\x02\x02" +
		"\u015C\u0125\x03\x02\x02\x02\u015C\u012D\x03\x02\x02\x02\u015C\u013F\x03" +
		"\x02\x02\x02\u015C\u0147\x03\x02\x02\x02\u015C\u0152\x03\x02\x02\x02\u015D" +
		"\x1F\x03\x02\x02\x02\u015E\u015F\x07\x13\x02\x02\u015F\u0160\x07*\x02" +
		"\x02\u0160\u0161\x05L\'\x02\u0161\u0162\x07.\x02\x02\u0162\u0163\x05L" +
		"\'\x02\u0163\u0164\x07.\x02\x02\u0164\u0165\x05*\x16\x02\u0165\u0166\x03" +
		"\x02\x02\x02\u0166\u0167\x07+\x02\x02\u0167!\x03\x02\x02\x02\u0168\u0169" +
		"\x07\x14\x02\x02\u0169\u0171\x07*\x02\x02\u016A\u0172\x05X-\x02\u016B" +
		"\u016C\x05L\'\x02\u016C\u016D\x07.\x02\x02\u016D\u016E\x05L\'\x02\u016E" +
		"\u016F\x07.\x02\x02\u016F\u0170\x05L\'\x02\u0170\u0172\x03\x02\x02\x02" +
		"\u0171\u016A\x03\x02\x02\x02\u0171\u016B\x03\x02\x02\x02\u0172\u0173\x03" +
		"\x02\x02\x02\u0173\u0174\x07.\x02\x02\u0174\u0175\x05L\'\x02\u0175\u0176" +
		"\x03\x02\x02\x02\u0176\u0177\x07+\x02\x02\u0177#\x03\x02\x02\x02\u0178" +
		"\u0179\x07\x18\x02\x02\u0179\u017A\x07*\x02\x02\u017A\u017B\x05L\'\x02" +
		"\u017B\u017C\x07.\x02\x02\u017C\u017D\x05*\x16\x02\u017D\u017E\x07.\x02" +
		"\x02\u017E\u017F\x05L\'\x02\u017F\u0180\x03\x02\x02\x02\u0180\u0181\x07" +
		"+\x02\x02\u0181%\x03\x02\x02\x02\u0182\u0183\x07\x15\x02\x02\u0183\u0184" +
		"\x07*\x02\x02\u0184\u0185\x05X-\x02\u0185\u0186\x07.\x02\x02\u0186\u0187" +
		"\x05V,\x02\u0187\u0188\x03\x02\x02\x02\u0188\u0189\x07+\x02\x02\u0189" +
		"\'\x03\x02\x02\x02\u018A\u018B\x07\x16\x02\x02\u018B\u018C\x07*\x02\x02" +
		"\u018C\u018D\x05X-\x02\u018D\u018E\x07.\x02\x02\u018E\u018F\x05L\'\x02" +
		"\u018F\u0190\x03\x02\x02\x02\u0190\u0191\x07+\x02\x02\u0191)\x03\x02\x02" +
		"\x02\u0192\u0193\x05,\x17\x02\u0193+\x03\x02\x02\x02\u0194\u0195\b\x17" +
		"\x01\x02\u0195\u0196\x05.\x18\x02\u0196\u019F\x03\x02\x02\x02\u0197\u0198" +
		"\f\x05\x02\x02\u0198\u0199\x070\x02\x02\u0199\u019E\x05.\x18\x02\u019A" +
		"\u019B\f\x04\x02\x02\u019B\u019C\x071\x02\x02\u019C\u019E\x05.\x18\x02" +
		"\u019D\u0197\x03\x02\x02\x02\u019D\u019A\x03\x02\x02\x02\u019E\u01A1\x03" +
		"\x02\x02\x02\u019F\u019D\x03\x02\x02\x02\u019F\u01A0\x03\x02\x02\x02\u01A0" +
		"-\x03\x02\x02\x02\u01A1\u019F\x03\x02\x02\x02\u01A2\u01A3\b\x18\x01\x02" +
		"\u01A3\u01A6\x050\x19\x02\u01A4\u01A6\x052\x1A\x02\u01A5\u01A2\x03\x02" +
		"\x02\x02\u01A5\u01A4\x03\x02\x02\x02\u01A6\u01AF\x03\x02\x02\x02\u01A7" +
		"\u01A8\f\x06\x02\x02\u01A8\u01A9\x072\x02\x02\u01A9\u01AE\x052\x1A\x02" +
		"\u01AA\u01AB\f\x05\x02\x02\u01AB\u01AC\x07/\x02\x02\u01AC\u01AE\x052\x1A" +
		"\x02\u01AD\u01A7\x03\x02\x02\x02\u01AD\u01AA\x03\x02\x02\x02\u01AE\u01B1" +
		"\x03\x02\x02\x02\u01AF\u01AD\x03\x02\x02\x02\u01AF\u01B0\x03\x02\x02\x02" +
		"\u01B0/\x03\x02\x02\x02\u01B1\u01AF\x03\x02\x02\x02\u01B2\u01B4\x056\x1C" +
		"\x02\u01B3\u01B5\x056\x1C\x02\u01B4\u01B3\x03\x02\x02\x02\u01B5\u01B6" +
		"\x03\x02\x02\x02\u01B6\u01B4\x03\x02\x02\x02\u01B6\u01B7\x03\x02\x02\x02" +
		"\u01B71\x03\x02\x02\x02\u01B8\u01B9\x054\x1B\x02\u01B9\u01BA\x073\x02" +
		"\x02\u01BA\u01BB\x052\x1A\x02\u01BB\u01BE\x03\x02\x02\x02\u01BC\u01BE" +
		"\x054\x1B\x02\u01BD\u01B8\x03\x02\x02\x02\u01BD\u01BC\x03\x02\x02\x02" +
		"\u01BE3\x03\x02\x02\x02\u01BF\u01C0\x071\x02\x02\u01C0\u01C5\x054\x1B" +
		"\x02\u01C1\u01C2\x070\x02\x02\u01C2\u01C5\x054\x1B\x02\u01C3\u01C5\x05" +
		"6\x1C\x02\u01C4\u01BF\x03\x02\x02\x02\u01C4\u01C1\x03\x02\x02\x02\u01C4" +
		"\u01C3\x03\x02\x02\x02\u01C55\x03\x02\x02\x02\u01C6\u01D9\x074\x02\x02" +
		"\u01C7\u01D9\x075\x02\x02\u01C8\u01D9\x07#\x02\x02\u01C9\u01D9\x07$\x02" +
		"\x02\u01CA\u01CB\x07*\x02\x02\u01CB\u01CC\x05*\x16\x02\u01CC\u01CD\x07" +
		"+\x02\x02\u01CD\u01D9\x03\x02\x02\x02\u01CE\u01D9\x058\x1D\x02\u01CF\u01D9" +
		"\x05:\x1E\x02\u01D0\u01D9\x05<\x1F\x02\u01D1\u01D9\x05> \x02\u01D2\u01D9" +
		"\x05@!\x02\u01D3\u01D9\x05B\"\x02\u01D4\u01D9\x05J&\x02\u01D5\u01D9\x05" +
		"H%\x02\u01D6\u01D9\x05F$\x02\u01D7\u01D9\x05D#\x02\u01D8\u01C6\x03\x02" +
		"\x02\x02\u01D8\u01C7\x03\x02\x02\x02\u01D8\u01C8\x03\x02\x02\x02\u01D8" +
		"\u01C9\x03\x02\x02\x02\u01D8\u01CA\x03\x02\x02\x02\u01D8\u01CE\x03\x02" +
		"\x02\x02\u01D8\u01CF\x03\x02\x02\x02\u01D8\u01D0\x03\x02\x02\x02\u01D8" +
		"\u01D1\x03\x02\x02\x02\u01D8\u01D2\x03\x02\x02\x02\u01D8\u01D3\x03\x02" +
		"\x02\x02\u01D8\u01D4\x03\x02\x02\x02\u01D8\u01D5\x03\x02\x02\x02\u01D8" +
		"\u01D6\x03\x02\x02\x02\u01D8\u01D7\x03\x02\x02\x02\u01D97\x03\x02\x02" +
		"\x02\u01DA\u01DB\x07\x19\x02\x02\u01DB\u01DC\x07*\x02\x02\u01DC\u01DD" +
		"\x05*\x16\x02\u01DD\u01DE\x07+\x02\x02\u01DE9\x03\x02\x02\x02\u01DF\u01E0" +
		"\x07\x1A\x02\x02\u01E0\u01E1\x07*\x02\x02\u01E1\u01E2\x05*\x16\x02\u01E2" +
		"\u01E3\x07+\x02\x02\u01E3;\x03\x02\x02\x02\u01E4\u01E5\x07\x1B\x02\x02" +
		"\u01E5\u01E6\x07*\x02\x02\u01E6\u01E7\x05*\x16\x02\u01E7\u01E8\x07+\x02" +
		"\x02\u01E8=\x03\x02\x02\x02\u01E9\u01EA\x07\x1C\x02\x02\u01EA\u01EB\x07" +
		"*\x02\x02\u01EB\u01EC\x05*\x16\x02\u01EC\u01ED\x07+\x02\x02\u01ED?\x03" +
		"\x02\x02\x02\u01EE\u01EF\x07\x1D\x02\x02\u01EF\u01F0\x07*\x02\x02\u01F0" +
		"\u01F1\x05*\x16\x02\u01F1\u01F2\x07.\x02\x02\u01F2\u01F3\x05*\x16\x02" +
		"\u01F3\u01F4\x03\x02\x02\x02\u01F4\u01F5\x07+\x02\x02\u01F5A\x03\x02\x02" +
		"\x02\u01F6\u01F7\x07\x1E\x02\x02\u01F7\u01F8\x07*\x02\x02\u01F8\u01F9" +
		"\x05*\x16\x02\u01F9\u01FA\x07+\x02\x02\u01FAC\x03\x02\x02\x02\u01FB\u01FC" +
		"\x07!\x02\x02\u01FC\u01FD\x07*\x02\x02\u01FD\u01FE\x05*\x16\x02\u01FE" +
		"\u01FF\x07+\x02\x02\u01FFE\x03\x02\x02\x02\u0200\u0201\x07 \x02\x02\u0201" +
		"\u0202\x07*\x02\x02\u0202\u0203\x05*\x16\x02\u0203\u0204\x07+\x02\x02" +
		"\u0204G\x03\x02\x02\x02\u0205\u0206\x07\"\x02\x02\u0206\u0207\x07*\x02" +
		"\x02\u0207\u0208\x05*\x16\x02\u0208\u0209\x07+\x02\x02\u0209I\x03\x02" +
		"\x02\x02\u020A\u020B\x07\x1F\x02\x02\u020B\u020C\x07*\x02\x02\u020C\u020D" +
		"\x05*\x16\x02\u020D\u020E\x07+\x02\x02\u020EK\x03\x02\x02\x02\u020F\u0212" +
		"\x07(\x02\x02\u0210\u0212\x05\x06\x04\x02\u0211\u020F\x03\x02\x02\x02" +
		"\u0211\u0210\x03\x02\x02\x02\u0212M\x03\x02\x02\x02\u0213\u0216\x05\f" +
		"\x07\x02\u0214\u0216\x07)\x02\x02\u0215\u0213\x03\x02\x02\x02\u0215\u0214" +
		"\x03\x02\x02\x02\u0216O\x03\x02\x02\x02\u0217\u0223\x05L\'\x02\u0218\u0223" +
		"\x05R*\x02\u0219\u021A\x07*\x02\x02\u021A\u021B\x05*\x16\x02\u021B\u021C" +
		"\x07.\x02\x02\u021C\u021D\x05*\x16\x02\u021D\u021E\x07.\x02\x02\u021E" +
		"\u021F\x05*\x16\x02\u021F\u0220\x03\x02\x02\x02\u0220\u0221\x07+\x02\x02" +
		"\u0221\u0223\x03\x02\x02\x02\u0222\u0217\x03\x02\x02\x02\u0222\u0218\x03" +
		"\x02\x02\x02\u0222\u0219\x03\x02\x02\x02\u0223Q\x03\x02\x02\x02\u0224" +
		"\u0227\x05\x10\t\x02\u0225\u0227\x07)\x02\x02\u0226\u0224\x03\x02\x02" +
		"\x02\u0226\u0225\x03\x02\x02\x02\u0227S\x03\x02\x02\x02\u0228\u022B\x05" +
		"\n\x06\x02\u0229\u022B\x07)\x02\x02\u022A\u0228\x03\x02\x02\x02\u022A" +
		"\u0229\x03\x02\x02\x02\u022BU\x03\x02\x02\x02\u022C\u0233\x07)\x02\x02" +
		"\u022D\u0233\x05R*\x02\u022E\u0233\x05N(\x02\u022F\u0233\x05b2\x02\u0230" +
		"\u0233\x05d3\x02\u0231\u0233\x05T+\x02\u0232\u022C\x03\x02\x02\x02\u0232" +
		"\u022D\x03\x02\x02\x02\u0232\u022E\x03\x02\x02\x02\u0232\u022F\x03\x02" +
		"\x02\x02\u0232\u0230\x03\x02\x02\x02\u0232\u0231\x03\x02\x02\x02\u0233" +
		"W\x03\x02\x02\x02\u0234\u0237\x07)\x02\x02\u0235\u0237\x05\x12\n\x02\u0236" +
		"\u0234\x03\x02\x02\x02\u0236\u0235\x03\x02\x02\x02\u0237Y\x03\x02\x02" +
		"\x02\u0238\u023B\x07)\x02\x02\u0239\u023B\x05\"\x12\x02\u023A\u0238\x03" +
		"\x02\x02\x02\u023A\u0239\x03\x02\x02\x02\u023B[\x03\x02\x02\x02\u023C" +
		"\u023F\x07)\x02\x02\u023D\u023F\x05 \x11\x02\u023E\u023C\x03\x02\x02\x02" +
		"\u023E\u023D\x03\x02\x02\x02\u023F]\x03\x02\x02\x02\u0240\u0243\x07)\x02" +
		"\x02\u0241\u0243\x05$\x13\x02\u0242\u0240\x03\x02\x02\x02\u0242\u0241" +
		"\x03\x02\x02\x02\u0243_\x03\x02\x02\x02\u0244\u0247\x07)\x02\x02\u0245" +
		"\u0247\x05&\x14\x02\u0246\u0244\x03\x02\x02\x02\u0246\u0245\x03\x02\x02" +
		"\x02";
	private static readonly _serializedATNSegment1: string =
		"\u0247a\x03\x02\x02\x02\u0248\u024B\x07)\x02\x02\u0249\u024B\x05\x18\r" +
		"\x02\u024A\u0248\x03\x02\x02\x02\u024A\u0249\x03\x02\x02\x02\u024Bc\x03" +
		"\x02\x02\x02\u024C\u024F\x07)\x02\x02\u024D\u024F\x05\x1A\x0E\x02\u024E" +
		"\u024C\x03\x02\x02\x02\u024E\u024D\x03\x02\x02\x02\u024Fe\x03\x02\x02" +
		"\x02\u0250\u0253\x07)\x02\x02\u0251\u0253\x05(\x15\x02\u0252\u0250\x03" +
		"\x02\x02\x02\u0252\u0251\x03\x02\x02\x02\u0253g\x03\x02\x02\x02\u0254" +
		"\u0266\x05d3\x02\u0255\u0266\x05^0\x02\u0256\u0266\x05N(\x02\u0257\u0266" +
		"\x05\x0E\b\x02\u0258\u0266\x05T+\x02\u0259\u0266\x05L\'\x02\u025A\u0266" +
		"\x05`1\x02\u025B\u0266\x05\x16\f\x02\u025C\u0266\x05\b\x05\x02\u025D\u0266" +
		"\x05R*\x02\u025E\u0266\x05X-\x02\u025F\u0266\x05b2\x02\u0260\u0266\x05" +
		"\\/\x02\u0261\u0266\x05\x1E\x10\x02\u0262\u0266\x05Z.\x02\u0263\u0266" +
		"\x05\x1C\x0F\x02\u0264\u0266\x05f4\x02\u0265\u0254\x03\x02\x02\x02\u0265" +
		"\u0255\x03\x02\x02\x02\u0265\u0256\x03\x02\x02\x02\u0265\u0257\x03\x02" +
		"\x02\x02\u0265\u0258\x03\x02\x02\x02\u0265\u0259\x03\x02\x02\x02\u0265" +
		"\u025A\x03\x02\x02\x02\u0265\u025B\x03\x02\x02\x02\u0265\u025C\x03\x02" +
		"\x02\x02\u0265\u025D\x03\x02\x02\x02\u0265\u025E\x03\x02\x02\x02\u0265" +
		"\u025F\x03\x02\x02\x02\u0265\u0260\x03\x02\x02\x02\u0265\u0261\x03\x02" +
		"\x02\x02\u0265\u0262\x03\x02\x02\x02\u0265\u0263\x03\x02\x02\x02\u0265" +
		"\u0264\x03\x02\x02\x02\u0266i\x03\x02\x02\x02)p\x81\x8C\x9E\xB0\xCE\xD9" +
		"\xE7\u0105\u010F\u0119\u013B\u014E\u015C\u0171\u019D\u019F\u01A5\u01AD" +
		"\u01AF\u01B6\u01BD\u01C4\u01D8\u0211\u0215\u0222\u0226\u022A\u0232\u0236" +
		"\u023A\u023E\u0242\u0246\u024A\u024E\u0252\u0265";
	public static readonly _serializedATN: string = Utils.join(
		[
			MathCommandParser._serializedATNSegment0,
			MathCommandParser._serializedATNSegment1,
		],
		"",
	);
	public static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!MathCommandParser.__ATN) {
			MathCommandParser.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(MathCommandParser._serializedATN));
		}

		return MathCommandParser.__ATN;
	}

}

export class ProgramContext extends ParserRuleContext {
	public expr(): ExprContext {
		return this.getRuleContext(0, ExprContext);
	}
	public EOF(): TerminalNode { return this.getToken(MathCommandParser.EOF, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_program; }
	// @Override
	public enterRule(listener: MathCommandListener): void {
		if (listener.enterProgram) {
			listener.enterProgram(this);
		}
	}
	// @Override
	public exitRule(listener: MathCommandListener): void {
		if (listener.exitProgram) {
			listener.exitProgram(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitProgram) {
			return visitor.visitProgram(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExprContext extends ParserRuleContext {
	public shapeExpr(): ShapeExprContext {
		return this.getRuleContext(0, ShapeExprContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_expr; }
	// @Override
	public enterRule(listener: MathCommandListener): void {
		if (listener.enterExpr) {
			listener.enterExpr(this);
		}
	}
	// @Override
	public exitRule(listener: MathCommandListener): void {
		if (listener.exitExpr) {
			listener.exitExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitExpr) {
			return visitor.visitExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PointDefContext extends ParserRuleContext {
	public LR(): TerminalNode { return this.getToken(MathCommandParser.LR, 0); }
	public RR(): TerminalNode { return this.getToken(MathCommandParser.RR, 0); }
	public numberExpr(): NumberExprContext[];
	public numberExpr(i: number): NumberExprContext;
	public numberExpr(i?: number): NumberExprContext | NumberExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(NumberExprContext);
		} else {
			return this.getRuleContext(i, NumberExprContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(MathCommandParser.COMMA);
		} else {
			return this.getToken(MathCommandParser.COMMA, i);
		}
	}
	public POINT(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.POINT, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_pointDef; }
	// @Override
	public enterRule(listener: MathCommandListener): void {
		if (listener.enterPointDef) {
			listener.enterPointDef(this);
		}
	}
	// @Override
	public exitRule(listener: MathCommandListener): void {
		if (listener.exitPointDef) {
			listener.exitPointDef(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitPointDef) {
			return visitor.visitPointDef(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SphereDefContext extends ParserRuleContext {
	public SPHERE(): TerminalNode { return this.getToken(MathCommandParser.SPHERE, 0); }
	public LR(): TerminalNode { return this.getToken(MathCommandParser.LR, 0); }
	public RR(): TerminalNode { return this.getToken(MathCommandParser.RR, 0); }
	public pointExpr(): PointExprContext[];
	public pointExpr(i: number): PointExprContext;
	public pointExpr(i?: number): PointExprContext | PointExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(PointExprContext);
		} else {
			return this.getRuleContext(i, PointExprContext);
		}
	}
	public COMMA(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.COMMA, 0); }
	public numberExpr(): NumberExprContext | undefined {
		return this.tryGetRuleContext(0, NumberExprContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_sphereDef; }
	// @Override
	public enterRule(listener: MathCommandListener): void {
		if (listener.enterSphereDef) {
			listener.enterSphereDef(this);
		}
	}
	// @Override
	public exitRule(listener: MathCommandListener): void {
		if (listener.exitSphereDef) {
			listener.exitSphereDef(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitSphereDef) {
			return visitor.visitSphereDef(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PlaneDefContext extends ParserRuleContext {
	public PLANE(): TerminalNode { return this.getToken(MathCommandParser.PLANE, 0); }
	public LR(): TerminalNode { return this.getToken(MathCommandParser.LR, 0); }
	public RR(): TerminalNode { return this.getToken(MathCommandParser.RR, 0); }
	public SHAPE_ID(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.SHAPE_ID, 0); }
	public pointExpr(): PointExprContext[];
	public pointExpr(i: number): PointExprContext;
	public pointExpr(i?: number): PointExprContext | PointExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(PointExprContext);
		} else {
			return this.getRuleContext(i, PointExprContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(MathCommandParser.COMMA);
		} else {
			return this.getToken(MathCommandParser.COMMA, i);
		}
	}
	public lineExpr(): LineExprContext[];
	public lineExpr(i: number): LineExprContext;
	public lineExpr(i?: number): LineExprContext | LineExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(LineExprContext);
		} else {
			return this.getRuleContext(i, LineExprContext);
		}
	}
	public vectorExpr(): VectorExprContext[];
	public vectorExpr(i: number): VectorExprContext;
	public vectorExpr(i?: number): VectorExprContext | VectorExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(VectorExprContext);
		} else {
			return this.getRuleContext(i, VectorExprContext);
		}
	}
	public planeExpr(): PlaneExprContext | undefined {
		return this.tryGetRuleContext(0, PlaneExprContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_planeDef; }
	// @Override
	public enterRule(listener: MathCommandListener): void {
		if (listener.enterPlaneDef) {
			listener.enterPlaneDef(this);
		}
	}
	// @Override
	public exitRule(listener: MathCommandListener): void {
		if (listener.exitPlaneDef) {
			listener.exitPlaneDef(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitPlaneDef) {
			return visitor.visitPlaneDef(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LineDefContext extends ParserRuleContext {
	public LINE(): TerminalNode { return this.getToken(MathCommandParser.LINE, 0); }
	public LR(): TerminalNode { return this.getToken(MathCommandParser.LR, 0); }
	public RR(): TerminalNode { return this.getToken(MathCommandParser.RR, 0); }
	public pointExpr(): PointExprContext[];
	public pointExpr(i: number): PointExprContext;
	public pointExpr(i?: number): PointExprContext | PointExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(PointExprContext);
		} else {
			return this.getRuleContext(i, PointExprContext);
		}
	}
	public COMMA(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.COMMA, 0); }
	public lineExpr(): LineExprContext | undefined {
		return this.tryGetRuleContext(0, LineExprContext);
	}
	public vectorExpr(): VectorExprContext | undefined {
		return this.tryGetRuleContext(0, VectorExprContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_lineDef; }
	// @Override
	public enterRule(listener: MathCommandListener): void {
		if (listener.enterLineDef) {
			listener.enterLineDef(this);
		}
	}
	// @Override
	public exitRule(listener: MathCommandListener): void {
		if (listener.exitLineDef) {
			listener.exitLineDef(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitLineDef) {
			return visitor.visitLineDef(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AngleDefContext extends ParserRuleContext {
	public ANGLE(): TerminalNode { return this.getToken(MathCommandParser.ANGLE, 0); }
	public LR(): TerminalNode { return this.getToken(MathCommandParser.LR, 0); }
	public RR(): TerminalNode { return this.getToken(MathCommandParser.RR, 0); }
	public vectorExpr(): VectorExprContext[];
	public vectorExpr(i: number): VectorExprContext;
	public vectorExpr(i?: number): VectorExprContext | VectorExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(VectorExprContext);
		} else {
			return this.getRuleContext(i, VectorExprContext);
		}
	}
	public pointExpr(): PointExprContext[];
	public pointExpr(i: number): PointExprContext;
	public pointExpr(i?: number): PointExprContext | PointExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(PointExprContext);
		} else {
			return this.getRuleContext(i, PointExprContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(MathCommandParser.COMMA);
		} else {
			return this.getToken(MathCommandParser.COMMA, i);
		}
	}
	public lineExpr(): LineExprContext[];
	public lineExpr(i: number): LineExprContext;
	public lineExpr(i?: number): LineExprContext | LineExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(LineExprContext);
		} else {
			return this.getRuleContext(i, LineExprContext);
		}
	}
	public planeExpr(): PlaneExprContext[];
	public planeExpr(i: number): PlaneExprContext;
	public planeExpr(i?: number): PlaneExprContext | PlaneExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(PlaneExprContext);
		} else {
			return this.getRuleContext(i, PlaneExprContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_angleDef; }
	// @Override
	public enterRule(listener: MathCommandListener): void {
		if (listener.enterAngleDef) {
			listener.enterAngleDef(this);
		}
	}
	// @Override
	public exitRule(listener: MathCommandListener): void {
		if (listener.exitAngleDef) {
			listener.exitAngleDef(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitAngleDef) {
			return visitor.visitAngleDef(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VectorDefContext extends ParserRuleContext {
	public VECTOR(): TerminalNode { return this.getToken(MathCommandParser.VECTOR, 0); }
	public LR(): TerminalNode { return this.getToken(MathCommandParser.LR, 0); }
	public RR(): TerminalNode { return this.getToken(MathCommandParser.RR, 0); }
	public pointExpr(): PointExprContext[];
	public pointExpr(i: number): PointExprContext;
	public pointExpr(i?: number): PointExprContext | PointExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(PointExprContext);
		} else {
			return this.getRuleContext(i, PointExprContext);
		}
	}
	public COMMA(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.COMMA, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_vectorDef; }
	// @Override
	public enterRule(listener: MathCommandListener): void {
		if (listener.enterVectorDef) {
			listener.enterVectorDef(this);
		}
	}
	// @Override
	public exitRule(listener: MathCommandListener): void {
		if (listener.exitVectorDef) {
			listener.exitVectorDef(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitVectorDef) {
			return visitor.visitVectorDef(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PolygonDefContext extends ParserRuleContext {
	public POLYGON(): TerminalNode { return this.getToken(MathCommandParser.POLYGON, 0); }
	public LR(): TerminalNode { return this.getToken(MathCommandParser.LR, 0); }
	public pointList(): PointListContext {
		return this.getRuleContext(0, PointListContext);
	}
	public RR(): TerminalNode { return this.getToken(MathCommandParser.RR, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_polygonDef; }
	// @Override
	public enterRule(listener: MathCommandListener): void {
		if (listener.enterPolygonDef) {
			listener.enterPolygonDef(this);
		}
	}
	// @Override
	public exitRule(listener: MathCommandListener): void {
		if (listener.exitPolygonDef) {
			listener.exitPolygonDef(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitPolygonDef) {
			return visitor.visitPolygonDef(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PointListContext extends ParserRuleContext {
	public pointExpr(): PointExprContext {
		return this.getRuleContext(0, PointExprContext);
	}
	public COMMA(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.COMMA, 0); }
	public pointList(): PointListContext | undefined {
		return this.tryGetRuleContext(0, PointListContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_pointList; }
	// @Override
	public enterRule(listener: MathCommandListener): void {
		if (listener.enterPointList) {
			listener.enterPointList(this);
		}
	}
	// @Override
	public exitRule(listener: MathCommandListener): void {
		if (listener.exitPointList) {
			listener.exitPointList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitPointList) {
			return visitor.visitPointList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class CircleDefContext extends ParserRuleContext {
	public CIRCLE(): TerminalNode { return this.getToken(MathCommandParser.CIRCLE, 0); }
	public LR(): TerminalNode { return this.getToken(MathCommandParser.LR, 0); }
	public RR(): TerminalNode { return this.getToken(MathCommandParser.RR, 0); }
	public pointExpr(): PointExprContext[];
	public pointExpr(i: number): PointExprContext;
	public pointExpr(i?: number): PointExprContext | PointExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(PointExprContext);
		} else {
			return this.getRuleContext(i, PointExprContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(MathCommandParser.COMMA);
		} else {
			return this.getToken(MathCommandParser.COMMA, i);
		}
	}
	public numberExpr(): NumberExprContext | undefined {
		return this.tryGetRuleContext(0, NumberExprContext);
	}
	public directionExpr(): DirectionExprContext | undefined {
		return this.tryGetRuleContext(0, DirectionExprContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_circleDef; }
	// @Override
	public enterRule(listener: MathCommandListener): void {
		if (listener.enterCircleDef) {
			listener.enterCircleDef(this);
		}
	}
	// @Override
	public exitRule(listener: MathCommandListener): void {
		if (listener.exitCircleDef) {
			listener.exitCircleDef(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitCircleDef) {
			return visitor.visitCircleDef(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SegmentDefContext extends ParserRuleContext {
	public SEGMENT(): TerminalNode { return this.getToken(MathCommandParser.SEGMENT, 0); }
	public LR(): TerminalNode { return this.getToken(MathCommandParser.LR, 0); }
	public RR(): TerminalNode { return this.getToken(MathCommandParser.RR, 0); }
	public pointExpr(): PointExprContext[];
	public pointExpr(i: number): PointExprContext;
	public pointExpr(i?: number): PointExprContext | PointExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(PointExprContext);
		} else {
			return this.getRuleContext(i, PointExprContext);
		}
	}
	public COMMA(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.COMMA, 0); }
	public numberExpr(): NumberExprContext | undefined {
		return this.tryGetRuleContext(0, NumberExprContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_segmentDef; }
	// @Override
	public enterRule(listener: MathCommandListener): void {
		if (listener.enterSegmentDef) {
			listener.enterSegmentDef(this);
		}
	}
	// @Override
	public exitRule(listener: MathCommandListener): void {
		if (listener.exitSegmentDef) {
			listener.exitSegmentDef(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitSegmentDef) {
			return visitor.visitSegmentDef(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RayDefContext extends ParserRuleContext {
	public RAY(): TerminalNode { return this.getToken(MathCommandParser.RAY, 0); }
	public LR(): TerminalNode { return this.getToken(MathCommandParser.LR, 0); }
	public RR(): TerminalNode { return this.getToken(MathCommandParser.RR, 0); }
	public pointExpr(): PointExprContext[];
	public pointExpr(i: number): PointExprContext;
	public pointExpr(i?: number): PointExprContext | PointExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(PointExprContext);
		} else {
			return this.getRuleContext(i, PointExprContext);
		}
	}
	public COMMA(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.COMMA, 0); }
	public vectorExpr(): VectorExprContext | undefined {
		return this.tryGetRuleContext(0, VectorExprContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_rayDef; }
	// @Override
	public enterRule(listener: MathCommandListener): void {
		if (listener.enterRayDef) {
			listener.enterRayDef(this);
		}
	}
	// @Override
	public exitRule(listener: MathCommandListener): void {
		if (listener.exitRayDef) {
			listener.exitRayDef(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitRayDef) {
			return visitor.visitRayDef(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class IntersectionDefContext extends ParserRuleContext {
	public INTERSECT(): TerminalNode { return this.getToken(MathCommandParser.INTERSECT, 0); }
	public LR(): TerminalNode { return this.getToken(MathCommandParser.LR, 0); }
	public RR(): TerminalNode { return this.getToken(MathCommandParser.RR, 0); }
	public expr(): ExprContext[];
	public expr(i: number): ExprContext;
	public expr(i?: number): ExprContext | ExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExprContext);
		} else {
			return this.getRuleContext(i, ExprContext);
		}
	}
	public COMMA(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.COMMA, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_intersectionDef; }
	// @Override
	public enterRule(listener: MathCommandListener): void {
		if (listener.enterIntersectionDef) {
			listener.enterIntersectionDef(this);
		}
	}
	// @Override
	public exitRule(listener: MathCommandListener): void {
		if (listener.exitIntersectionDef) {
			listener.exitIntersectionDef(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitIntersectionDef) {
			return visitor.visitIntersectionDef(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TransformDefContext extends ParserRuleContext {
	public TRANSLATE(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.TRANSLATE, 0); }
	public LR(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.LR, 0); }
	public RR(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.RR, 0); }
	public ROTATE(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.ROTATE, 0); }
	public PROJECT(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.PROJECT, 0); }
	public REFLECT(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.REFLECT, 0); }
	public ENLARGE(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.ENLARGE, 0); }
	public shapeExpr(): ShapeExprContext | undefined {
		return this.tryGetRuleContext(0, ShapeExprContext);
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(MathCommandParser.COMMA);
		} else {
			return this.getToken(MathCommandParser.COMMA, i);
		}
	}
	public vectorExpr(): VectorExprContext | undefined {
		return this.tryGetRuleContext(0, VectorExprContext);
	}
	public numberExpr(): NumberExprContext | undefined {
		return this.tryGetRuleContext(0, NumberExprContext);
	}
	public pointExpr(): PointExprContext | undefined {
		return this.tryGetRuleContext(0, PointExprContext);
	}
	public planeExpr(): PlaneExprContext | undefined {
		return this.tryGetRuleContext(0, PlaneExprContext);
	}
	public lineExpr(): LineExprContext | undefined {
		return this.tryGetRuleContext(0, LineExprContext);
	}
	public directionExpr(): DirectionExprContext | undefined {
		return this.tryGetRuleContext(0, DirectionExprContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_transformDef; }
	// @Override
	public enterRule(listener: MathCommandListener): void {
		if (listener.enterTransformDef) {
			listener.enterTransformDef(this);
		}
	}
	// @Override
	public exitRule(listener: MathCommandListener): void {
		if (listener.exitTransformDef) {
			listener.exitTransformDef(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitTransformDef) {
			return visitor.visitTransformDef(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class CylinderDefContext extends ParserRuleContext {
	public CYLINDER(): TerminalNode { return this.getToken(MathCommandParser.CYLINDER, 0); }
	public LR(): TerminalNode { return this.getToken(MathCommandParser.LR, 0); }
	public RR(): TerminalNode { return this.getToken(MathCommandParser.RR, 0); }
	public pointExpr(): PointExprContext[];
	public pointExpr(i: number): PointExprContext;
	public pointExpr(i?: number): PointExprContext | PointExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(PointExprContext);
		} else {
			return this.getRuleContext(i, PointExprContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(MathCommandParser.COMMA);
		} else {
			return this.getToken(MathCommandParser.COMMA, i);
		}
	}
	public numberExpr(): NumberExprContext | undefined {
		return this.tryGetRuleContext(0, NumberExprContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_cylinderDef; }
	// @Override
	public enterRule(listener: MathCommandListener): void {
		if (listener.enterCylinderDef) {
			listener.enterCylinderDef(this);
		}
	}
	// @Override
	public exitRule(listener: MathCommandListener): void {
		if (listener.exitCylinderDef) {
			listener.exitCylinderDef(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitCylinderDef) {
			return visitor.visitCylinderDef(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TetrahedronDefContext extends ParserRuleContext {
	public TETRAHEDRON(): TerminalNode { return this.getToken(MathCommandParser.TETRAHEDRON, 0); }
	public LR(): TerminalNode { return this.getToken(MathCommandParser.LR, 0); }
	public RR(): TerminalNode { return this.getToken(MathCommandParser.RR, 0); }
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(MathCommandParser.COMMA);
		} else {
			return this.getToken(MathCommandParser.COMMA, i);
		}
	}
	public pointExpr(): PointExprContext[];
	public pointExpr(i: number): PointExprContext;
	public pointExpr(i?: number): PointExprContext | PointExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(PointExprContext);
		} else {
			return this.getRuleContext(i, PointExprContext);
		}
	}
	public polygonExpr(): PolygonExprContext | undefined {
		return this.tryGetRuleContext(0, PolygonExprContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_tetrahedronDef; }
	// @Override
	public enterRule(listener: MathCommandListener): void {
		if (listener.enterTetrahedronDef) {
			listener.enterTetrahedronDef(this);
		}
	}
	// @Override
	public exitRule(listener: MathCommandListener): void {
		if (listener.exitTetrahedronDef) {
			listener.exitTetrahedronDef(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitTetrahedronDef) {
			return visitor.visitTetrahedronDef(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ConeDefContext extends ParserRuleContext {
	public CONE(): TerminalNode { return this.getToken(MathCommandParser.CONE, 0); }
	public LR(): TerminalNode { return this.getToken(MathCommandParser.LR, 0); }
	public RR(): TerminalNode { return this.getToken(MathCommandParser.RR, 0); }
	public pointExpr(): PointExprContext[];
	public pointExpr(i: number): PointExprContext;
	public pointExpr(i?: number): PointExprContext | PointExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(PointExprContext);
		} else {
			return this.getRuleContext(i, PointExprContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(MathCommandParser.COMMA);
		} else {
			return this.getToken(MathCommandParser.COMMA, i);
		}
	}
	public numberExpr(): NumberExprContext | undefined {
		return this.tryGetRuleContext(0, NumberExprContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_coneDef; }
	// @Override
	public enterRule(listener: MathCommandListener): void {
		if (listener.enterConeDef) {
			listener.enterConeDef(this);
		}
	}
	// @Override
	public exitRule(listener: MathCommandListener): void {
		if (listener.exitConeDef) {
			listener.exitConeDef(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitConeDef) {
			return visitor.visitConeDef(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PrismDefContext extends ParserRuleContext {
	public PRISM(): TerminalNode { return this.getToken(MathCommandParser.PRISM, 0); }
	public LR(): TerminalNode { return this.getToken(MathCommandParser.LR, 0); }
	public RR(): TerminalNode { return this.getToken(MathCommandParser.RR, 0); }
	public polygonExpr(): PolygonExprContext | undefined {
		return this.tryGetRuleContext(0, PolygonExprContext);
	}
	public COMMA(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.COMMA, 0); }
	public directionExpr(): DirectionExprContext | undefined {
		return this.tryGetRuleContext(0, DirectionExprContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_prismDef; }
	// @Override
	public enterRule(listener: MathCommandListener): void {
		if (listener.enterPrismDef) {
			listener.enterPrismDef(this);
		}
	}
	// @Override
	public exitRule(listener: MathCommandListener): void {
		if (listener.exitPrismDef) {
			listener.exitPrismDef(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitPrismDef) {
			return visitor.visitPrismDef(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PyramidDefContext extends ParserRuleContext {
	public PYRAMID(): TerminalNode { return this.getToken(MathCommandParser.PYRAMID, 0); }
	public LR(): TerminalNode { return this.getToken(MathCommandParser.LR, 0); }
	public RR(): TerminalNode { return this.getToken(MathCommandParser.RR, 0); }
	public polygonExpr(): PolygonExprContext | undefined {
		return this.tryGetRuleContext(0, PolygonExprContext);
	}
	public COMMA(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.COMMA, 0); }
	public pointExpr(): PointExprContext | undefined {
		return this.tryGetRuleContext(0, PointExprContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_pyramidDef; }
	// @Override
	public enterRule(listener: MathCommandListener): void {
		if (listener.enterPyramidDef) {
			listener.enterPyramidDef(this);
		}
	}
	// @Override
	public exitRule(listener: MathCommandListener): void {
		if (listener.exitPyramidDef) {
			listener.exitPyramidDef(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitPyramidDef) {
			return visitor.visitPyramidDef(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class NumberExprContext extends ParserRuleContext {
	public additiveExpr(): AdditiveExprContext {
		return this.getRuleContext(0, AdditiveExprContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_numberExpr; }
	// @Override
	public enterRule(listener: MathCommandListener): void {
		if (listener.enterNumberExpr) {
			listener.enterNumberExpr(this);
		}
	}
	// @Override
	public exitRule(listener: MathCommandListener): void {
		if (listener.exitNumberExpr) {
			listener.exitNumberExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitNumberExpr) {
			return visitor.visitNumberExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AdditiveExprContext extends ParserRuleContext {
	public additiveExpr(): AdditiveExprContext | undefined {
		return this.tryGetRuleContext(0, AdditiveExprContext);
	}
	public ADD(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.ADD, 0); }
	public multiplicativeExpr(): MultiplicativeExprContext {
		return this.getRuleContext(0, MultiplicativeExprContext);
	}
	public SUB(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.SUB, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_additiveExpr; }
	// @Override
	public enterRule(listener: MathCommandListener): void {
		if (listener.enterAdditiveExpr) {
			listener.enterAdditiveExpr(this);
		}
	}
	// @Override
	public exitRule(listener: MathCommandListener): void {
		if (listener.exitAdditiveExpr) {
			listener.exitAdditiveExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitAdditiveExpr) {
			return visitor.visitAdditiveExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class MultiplicativeExprContext extends ParserRuleContext {
	public multiplicativeExpr(): MultiplicativeExprContext | undefined {
		return this.tryGetRuleContext(0, MultiplicativeExprContext);
	}
	public MULTIPLY(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.MULTIPLY, 0); }
	public exponentialExpr(): ExponentialExprContext | undefined {
		return this.tryGetRuleContext(0, ExponentialExprContext);
	}
	public DIVIDE(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.DIVIDE, 0); }
	public implicitMultiplicativeExpr(): ImplicitMultiplicativeExprContext | undefined {
		return this.tryGetRuleContext(0, ImplicitMultiplicativeExprContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_multiplicativeExpr; }
	// @Override
	public enterRule(listener: MathCommandListener): void {
		if (listener.enterMultiplicativeExpr) {
			listener.enterMultiplicativeExpr(this);
		}
	}
	// @Override
	public exitRule(listener: MathCommandListener): void {
		if (listener.exitMultiplicativeExpr) {
			listener.exitMultiplicativeExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitMultiplicativeExpr) {
			return visitor.visitMultiplicativeExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ImplicitMultiplicativeExprContext extends ParserRuleContext {
	public primaryExpr(): PrimaryExprContext[];
	public primaryExpr(i: number): PrimaryExprContext;
	public primaryExpr(i?: number): PrimaryExprContext | PrimaryExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(PrimaryExprContext);
		} else {
			return this.getRuleContext(i, PrimaryExprContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_implicitMultiplicativeExpr; }
	// @Override
	public enterRule(listener: MathCommandListener): void {
		if (listener.enterImplicitMultiplicativeExpr) {
			listener.enterImplicitMultiplicativeExpr(this);
		}
	}
	// @Override
	public exitRule(listener: MathCommandListener): void {
		if (listener.exitImplicitMultiplicativeExpr) {
			listener.exitImplicitMultiplicativeExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitImplicitMultiplicativeExpr) {
			return visitor.visitImplicitMultiplicativeExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExponentialExprContext extends ParserRuleContext {
	public unaryExpr(): UnaryExprContext {
		return this.getRuleContext(0, UnaryExprContext);
	}
	public POWER(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.POWER, 0); }
	public exponentialExpr(): ExponentialExprContext | undefined {
		return this.tryGetRuleContext(0, ExponentialExprContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_exponentialExpr; }
	// @Override
	public enterRule(listener: MathCommandListener): void {
		if (listener.enterExponentialExpr) {
			listener.enterExponentialExpr(this);
		}
	}
	// @Override
	public exitRule(listener: MathCommandListener): void {
		if (listener.exitExponentialExpr) {
			listener.exitExponentialExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitExponentialExpr) {
			return visitor.visitExponentialExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class UnaryExprContext extends ParserRuleContext {
	public SUB(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.SUB, 0); }
	public unaryExpr(): UnaryExprContext | undefined {
		return this.tryGetRuleContext(0, UnaryExprContext);
	}
	public ADD(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.ADD, 0); }
	public primaryExpr(): PrimaryExprContext | undefined {
		return this.tryGetRuleContext(0, PrimaryExprContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_unaryExpr; }
	// @Override
	public enterRule(listener: MathCommandListener): void {
		if (listener.enterUnaryExpr) {
			listener.enterUnaryExpr(this);
		}
	}
	// @Override
	public exitRule(listener: MathCommandListener): void {
		if (listener.exitUnaryExpr) {
			listener.exitUnaryExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitUnaryExpr) {
			return visitor.visitUnaryExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PrimaryExprContext extends ParserRuleContext {
	public INT_LIT(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.INT_LIT, 0); }
	public FLOAT_LIT(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.FLOAT_LIT, 0); }
	public PI(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.PI, 0); }
	public E(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.E, 0); }
	public LR(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.LR, 0); }
	public numberExpr(): NumberExprContext | undefined {
		return this.tryGetRuleContext(0, NumberExprContext);
	}
	public RR(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.RR, 0); }
	public sinExpr(): SinExprContext | undefined {
		return this.tryGetRuleContext(0, SinExprContext);
	}
	public cosExpr(): CosExprContext | undefined {
		return this.tryGetRuleContext(0, CosExprContext);
	}
	public tanExpr(): TanExprContext | undefined {
		return this.tryGetRuleContext(0, TanExprContext);
	}
	public cotExpr(): CotExprContext | undefined {
		return this.tryGetRuleContext(0, CotExprContext);
	}
	public logExpr(): LogExprContext | undefined {
		return this.tryGetRuleContext(0, LogExprContext);
	}
	public lnExpr(): LnExprContext | undefined {
		return this.tryGetRuleContext(0, LnExprContext);
	}
	public expExpr(): ExpExprContext | undefined {
		return this.tryGetRuleContext(0, ExpExprContext);
	}
	public absExpr(): AbsExprContext | undefined {
		return this.tryGetRuleContext(0, AbsExprContext);
	}
	public sqrtExpr(): SqrtExprContext | undefined {
		return this.tryGetRuleContext(0, SqrtExprContext);
	}
	public cbrtExpr(): CbrtExprContext | undefined {
		return this.tryGetRuleContext(0, CbrtExprContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_primaryExpr; }
	// @Override
	public enterRule(listener: MathCommandListener): void {
		if (listener.enterPrimaryExpr) {
			listener.enterPrimaryExpr(this);
		}
	}
	// @Override
	public exitRule(listener: MathCommandListener): void {
		if (listener.exitPrimaryExpr) {
			listener.exitPrimaryExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitPrimaryExpr) {
			return visitor.visitPrimaryExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SinExprContext extends ParserRuleContext {
	public SIN(): TerminalNode { return this.getToken(MathCommandParser.SIN, 0); }
	public LR(): TerminalNode { return this.getToken(MathCommandParser.LR, 0); }
	public numberExpr(): NumberExprContext {
		return this.getRuleContext(0, NumberExprContext);
	}
	public RR(): TerminalNode { return this.getToken(MathCommandParser.RR, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_sinExpr; }
	// @Override
	public enterRule(listener: MathCommandListener): void {
		if (listener.enterSinExpr) {
			listener.enterSinExpr(this);
		}
	}
	// @Override
	public exitRule(listener: MathCommandListener): void {
		if (listener.exitSinExpr) {
			listener.exitSinExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitSinExpr) {
			return visitor.visitSinExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class CosExprContext extends ParserRuleContext {
	public COS(): TerminalNode { return this.getToken(MathCommandParser.COS, 0); }
	public LR(): TerminalNode { return this.getToken(MathCommandParser.LR, 0); }
	public numberExpr(): NumberExprContext {
		return this.getRuleContext(0, NumberExprContext);
	}
	public RR(): TerminalNode { return this.getToken(MathCommandParser.RR, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_cosExpr; }
	// @Override
	public enterRule(listener: MathCommandListener): void {
		if (listener.enterCosExpr) {
			listener.enterCosExpr(this);
		}
	}
	// @Override
	public exitRule(listener: MathCommandListener): void {
		if (listener.exitCosExpr) {
			listener.exitCosExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitCosExpr) {
			return visitor.visitCosExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TanExprContext extends ParserRuleContext {
	public TAN(): TerminalNode { return this.getToken(MathCommandParser.TAN, 0); }
	public LR(): TerminalNode { return this.getToken(MathCommandParser.LR, 0); }
	public numberExpr(): NumberExprContext {
		return this.getRuleContext(0, NumberExprContext);
	}
	public RR(): TerminalNode { return this.getToken(MathCommandParser.RR, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_tanExpr; }
	// @Override
	public enterRule(listener: MathCommandListener): void {
		if (listener.enterTanExpr) {
			listener.enterTanExpr(this);
		}
	}
	// @Override
	public exitRule(listener: MathCommandListener): void {
		if (listener.exitTanExpr) {
			listener.exitTanExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitTanExpr) {
			return visitor.visitTanExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class CotExprContext extends ParserRuleContext {
	public COT(): TerminalNode { return this.getToken(MathCommandParser.COT, 0); }
	public LR(): TerminalNode { return this.getToken(MathCommandParser.LR, 0); }
	public numberExpr(): NumberExprContext {
		return this.getRuleContext(0, NumberExprContext);
	}
	public RR(): TerminalNode { return this.getToken(MathCommandParser.RR, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_cotExpr; }
	// @Override
	public enterRule(listener: MathCommandListener): void {
		if (listener.enterCotExpr) {
			listener.enterCotExpr(this);
		}
	}
	// @Override
	public exitRule(listener: MathCommandListener): void {
		if (listener.exitCotExpr) {
			listener.exitCotExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitCotExpr) {
			return visitor.visitCotExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LogExprContext extends ParserRuleContext {
	public LOG(): TerminalNode { return this.getToken(MathCommandParser.LOG, 0); }
	public LR(): TerminalNode { return this.getToken(MathCommandParser.LR, 0); }
	public RR(): TerminalNode { return this.getToken(MathCommandParser.RR, 0); }
	public numberExpr(): NumberExprContext[];
	public numberExpr(i: number): NumberExprContext;
	public numberExpr(i?: number): NumberExprContext | NumberExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(NumberExprContext);
		} else {
			return this.getRuleContext(i, NumberExprContext);
		}
	}
	public COMMA(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.COMMA, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_logExpr; }
	// @Override
	public enterRule(listener: MathCommandListener): void {
		if (listener.enterLogExpr) {
			listener.enterLogExpr(this);
		}
	}
	// @Override
	public exitRule(listener: MathCommandListener): void {
		if (listener.exitLogExpr) {
			listener.exitLogExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitLogExpr) {
			return visitor.visitLogExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LnExprContext extends ParserRuleContext {
	public LN(): TerminalNode { return this.getToken(MathCommandParser.LN, 0); }
	public LR(): TerminalNode { return this.getToken(MathCommandParser.LR, 0); }
	public numberExpr(): NumberExprContext {
		return this.getRuleContext(0, NumberExprContext);
	}
	public RR(): TerminalNode { return this.getToken(MathCommandParser.RR, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_lnExpr; }
	// @Override
	public enterRule(listener: MathCommandListener): void {
		if (listener.enterLnExpr) {
			listener.enterLnExpr(this);
		}
	}
	// @Override
	public exitRule(listener: MathCommandListener): void {
		if (listener.exitLnExpr) {
			listener.exitLnExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitLnExpr) {
			return visitor.visitLnExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class CbrtExprContext extends ParserRuleContext {
	public CBRT(): TerminalNode { return this.getToken(MathCommandParser.CBRT, 0); }
	public LR(): TerminalNode { return this.getToken(MathCommandParser.LR, 0); }
	public numberExpr(): NumberExprContext {
		return this.getRuleContext(0, NumberExprContext);
	}
	public RR(): TerminalNode { return this.getToken(MathCommandParser.RR, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_cbrtExpr; }
	// @Override
	public enterRule(listener: MathCommandListener): void {
		if (listener.enterCbrtExpr) {
			listener.enterCbrtExpr(this);
		}
	}
	// @Override
	public exitRule(listener: MathCommandListener): void {
		if (listener.exitCbrtExpr) {
			listener.exitCbrtExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitCbrtExpr) {
			return visitor.visitCbrtExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SqrtExprContext extends ParserRuleContext {
	public SQRT(): TerminalNode { return this.getToken(MathCommandParser.SQRT, 0); }
	public LR(): TerminalNode { return this.getToken(MathCommandParser.LR, 0); }
	public numberExpr(): NumberExprContext {
		return this.getRuleContext(0, NumberExprContext);
	}
	public RR(): TerminalNode { return this.getToken(MathCommandParser.RR, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_sqrtExpr; }
	// @Override
	public enterRule(listener: MathCommandListener): void {
		if (listener.enterSqrtExpr) {
			listener.enterSqrtExpr(this);
		}
	}
	// @Override
	public exitRule(listener: MathCommandListener): void {
		if (listener.exitSqrtExpr) {
			listener.exitSqrtExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitSqrtExpr) {
			return visitor.visitSqrtExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AbsExprContext extends ParserRuleContext {
	public ABS(): TerminalNode { return this.getToken(MathCommandParser.ABS, 0); }
	public LR(): TerminalNode { return this.getToken(MathCommandParser.LR, 0); }
	public numberExpr(): NumberExprContext {
		return this.getRuleContext(0, NumberExprContext);
	}
	public RR(): TerminalNode { return this.getToken(MathCommandParser.RR, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_absExpr; }
	// @Override
	public enterRule(listener: MathCommandListener): void {
		if (listener.enterAbsExpr) {
			listener.enterAbsExpr(this);
		}
	}
	// @Override
	public exitRule(listener: MathCommandListener): void {
		if (listener.exitAbsExpr) {
			listener.exitAbsExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitAbsExpr) {
			return visitor.visitAbsExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExpExprContext extends ParserRuleContext {
	public EXP(): TerminalNode { return this.getToken(MathCommandParser.EXP, 0); }
	public LR(): TerminalNode { return this.getToken(MathCommandParser.LR, 0); }
	public numberExpr(): NumberExprContext {
		return this.getRuleContext(0, NumberExprContext);
	}
	public RR(): TerminalNode { return this.getToken(MathCommandParser.RR, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_expExpr; }
	// @Override
	public enterRule(listener: MathCommandListener): void {
		if (listener.enterExpExpr) {
			listener.enterExpExpr(this);
		}
	}
	// @Override
	public exitRule(listener: MathCommandListener): void {
		if (listener.exitExpExpr) {
			listener.exitExpExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitExpExpr) {
			return visitor.visitExpExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PointExprContext extends ParserRuleContext {
	public POINT_ID(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.POINT_ID, 0); }
	public pointDef(): PointDefContext | undefined {
		return this.tryGetRuleContext(0, PointDefContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_pointExpr; }
	// @Override
	public enterRule(listener: MathCommandListener): void {
		if (listener.enterPointExpr) {
			listener.enterPointExpr(this);
		}
	}
	// @Override
	public exitRule(listener: MathCommandListener): void {
		if (listener.exitPointExpr) {
			listener.exitPointExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitPointExpr) {
			return visitor.visitPointExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LineExprContext extends ParserRuleContext {
	public lineDef(): LineDefContext | undefined {
		return this.tryGetRuleContext(0, LineDefContext);
	}
	public SHAPE_ID(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.SHAPE_ID, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_lineExpr; }
	// @Override
	public enterRule(listener: MathCommandListener): void {
		if (listener.enterLineExpr) {
			listener.enterLineExpr(this);
		}
	}
	// @Override
	public exitRule(listener: MathCommandListener): void {
		if (listener.exitLineExpr) {
			listener.exitLineExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitLineExpr) {
			return visitor.visitLineExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DirExprContext extends ParserRuleContext {
	public pointExpr(): PointExprContext | undefined {
		return this.tryGetRuleContext(0, PointExprContext);
	}
	public vectorExpr(): VectorExprContext | undefined {
		return this.tryGetRuleContext(0, VectorExprContext);
	}
	public LR(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.LR, 0); }
	public RR(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.RR, 0); }
	public numberExpr(): NumberExprContext[];
	public numberExpr(i: number): NumberExprContext;
	public numberExpr(i?: number): NumberExprContext | NumberExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(NumberExprContext);
		} else {
			return this.getRuleContext(i, NumberExprContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(MathCommandParser.COMMA);
		} else {
			return this.getToken(MathCommandParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_dirExpr; }
	// @Override
	public enterRule(listener: MathCommandListener): void {
		if (listener.enterDirExpr) {
			listener.enterDirExpr(this);
		}
	}
	// @Override
	public exitRule(listener: MathCommandListener): void {
		if (listener.exitDirExpr) {
			listener.exitDirExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitDirExpr) {
			return visitor.visitDirExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VectorExprContext extends ParserRuleContext {
	public vectorDef(): VectorDefContext | undefined {
		return this.tryGetRuleContext(0, VectorDefContext);
	}
	public SHAPE_ID(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.SHAPE_ID, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_vectorExpr; }
	// @Override
	public enterRule(listener: MathCommandListener): void {
		if (listener.enterVectorExpr) {
			listener.enterVectorExpr(this);
		}
	}
	// @Override
	public exitRule(listener: MathCommandListener): void {
		if (listener.exitVectorExpr) {
			listener.exitVectorExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitVectorExpr) {
			return visitor.visitVectorExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PlaneExprContext extends ParserRuleContext {
	public planeDef(): PlaneDefContext | undefined {
		return this.tryGetRuleContext(0, PlaneDefContext);
	}
	public SHAPE_ID(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.SHAPE_ID, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_planeExpr; }
	// @Override
	public enterRule(listener: MathCommandListener): void {
		if (listener.enterPlaneExpr) {
			listener.enterPlaneExpr(this);
		}
	}
	// @Override
	public exitRule(listener: MathCommandListener): void {
		if (listener.exitPlaneExpr) {
			listener.exitPlaneExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitPlaneExpr) {
			return visitor.visitPlaneExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DirectionExprContext extends ParserRuleContext {
	public SHAPE_ID(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.SHAPE_ID, 0); }
	public vectorExpr(): VectorExprContext | undefined {
		return this.tryGetRuleContext(0, VectorExprContext);
	}
	public lineExpr(): LineExprContext | undefined {
		return this.tryGetRuleContext(0, LineExprContext);
	}
	public segmentExpr(): SegmentExprContext | undefined {
		return this.tryGetRuleContext(0, SegmentExprContext);
	}
	public rayExpr(): RayExprContext | undefined {
		return this.tryGetRuleContext(0, RayExprContext);
	}
	public planeExpr(): PlaneExprContext | undefined {
		return this.tryGetRuleContext(0, PlaneExprContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_directionExpr; }
	// @Override
	public enterRule(listener: MathCommandListener): void {
		if (listener.enterDirectionExpr) {
			listener.enterDirectionExpr(this);
		}
	}
	// @Override
	public exitRule(listener: MathCommandListener): void {
		if (listener.exitDirectionExpr) {
			listener.exitDirectionExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitDirectionExpr) {
			return visitor.visitDirectionExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PolygonExprContext extends ParserRuleContext {
	public SHAPE_ID(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.SHAPE_ID, 0); }
	public polygonDef(): PolygonDefContext | undefined {
		return this.tryGetRuleContext(0, PolygonDefContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_polygonExpr; }
	// @Override
	public enterRule(listener: MathCommandListener): void {
		if (listener.enterPolygonExpr) {
			listener.enterPolygonExpr(this);
		}
	}
	// @Override
	public exitRule(listener: MathCommandListener): void {
		if (listener.exitPolygonExpr) {
			listener.exitPolygonExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitPolygonExpr) {
			return visitor.visitPolygonExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TetrahedronExprContext extends ParserRuleContext {
	public SHAPE_ID(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.SHAPE_ID, 0); }
	public tetrahedronDef(): TetrahedronDefContext | undefined {
		return this.tryGetRuleContext(0, TetrahedronDefContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_tetrahedronExpr; }
	// @Override
	public enterRule(listener: MathCommandListener): void {
		if (listener.enterTetrahedronExpr) {
			listener.enterTetrahedronExpr(this);
		}
	}
	// @Override
	public exitRule(listener: MathCommandListener): void {
		if (listener.exitTetrahedronExpr) {
			listener.exitTetrahedronExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitTetrahedronExpr) {
			return visitor.visitTetrahedronExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class CylinderExprContext extends ParserRuleContext {
	public SHAPE_ID(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.SHAPE_ID, 0); }
	public cylinderDef(): CylinderDefContext | undefined {
		return this.tryGetRuleContext(0, CylinderDefContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_cylinderExpr; }
	// @Override
	public enterRule(listener: MathCommandListener): void {
		if (listener.enterCylinderExpr) {
			listener.enterCylinderExpr(this);
		}
	}
	// @Override
	public exitRule(listener: MathCommandListener): void {
		if (listener.exitCylinderExpr) {
			listener.exitCylinderExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitCylinderExpr) {
			return visitor.visitCylinderExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ConeExprContext extends ParserRuleContext {
	public SHAPE_ID(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.SHAPE_ID, 0); }
	public coneDef(): ConeDefContext | undefined {
		return this.tryGetRuleContext(0, ConeDefContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_coneExpr; }
	// @Override
	public enterRule(listener: MathCommandListener): void {
		if (listener.enterConeExpr) {
			listener.enterConeExpr(this);
		}
	}
	// @Override
	public exitRule(listener: MathCommandListener): void {
		if (listener.exitConeExpr) {
			listener.exitConeExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitConeExpr) {
			return visitor.visitConeExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PrismExprContext extends ParserRuleContext {
	public SHAPE_ID(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.SHAPE_ID, 0); }
	public prismDef(): PrismDefContext | undefined {
		return this.tryGetRuleContext(0, PrismDefContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_prismExpr; }
	// @Override
	public enterRule(listener: MathCommandListener): void {
		if (listener.enterPrismExpr) {
			listener.enterPrismExpr(this);
		}
	}
	// @Override
	public exitRule(listener: MathCommandListener): void {
		if (listener.exitPrismExpr) {
			listener.exitPrismExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitPrismExpr) {
			return visitor.visitPrismExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SegmentExprContext extends ParserRuleContext {
	public SHAPE_ID(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.SHAPE_ID, 0); }
	public segmentDef(): SegmentDefContext | undefined {
		return this.tryGetRuleContext(0, SegmentDefContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_segmentExpr; }
	// @Override
	public enterRule(listener: MathCommandListener): void {
		if (listener.enterSegmentExpr) {
			listener.enterSegmentExpr(this);
		}
	}
	// @Override
	public exitRule(listener: MathCommandListener): void {
		if (listener.exitSegmentExpr) {
			listener.exitSegmentExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitSegmentExpr) {
			return visitor.visitSegmentExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RayExprContext extends ParserRuleContext {
	public SHAPE_ID(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.SHAPE_ID, 0); }
	public rayDef(): RayDefContext | undefined {
		return this.tryGetRuleContext(0, RayDefContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_rayExpr; }
	// @Override
	public enterRule(listener: MathCommandListener): void {
		if (listener.enterRayExpr) {
			listener.enterRayExpr(this);
		}
	}
	// @Override
	public exitRule(listener: MathCommandListener): void {
		if (listener.exitRayExpr) {
			listener.exitRayExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitRayExpr) {
			return visitor.visitRayExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PyramidExprContext extends ParserRuleContext {
	public SHAPE_ID(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.SHAPE_ID, 0); }
	public pyramidDef(): PyramidDefContext | undefined {
		return this.tryGetRuleContext(0, PyramidDefContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_pyramidExpr; }
	// @Override
	public enterRule(listener: MathCommandListener): void {
		if (listener.enterPyramidExpr) {
			listener.enterPyramidExpr(this);
		}
	}
	// @Override
	public exitRule(listener: MathCommandListener): void {
		if (listener.exitPyramidExpr) {
			listener.exitPyramidExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitPyramidExpr) {
			return visitor.visitPyramidExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ShapeExprContext extends ParserRuleContext {
	public rayExpr(): RayExprContext | undefined {
		return this.tryGetRuleContext(0, RayExprContext);
	}
	public coneExpr(): ConeExprContext | undefined {
		return this.tryGetRuleContext(0, ConeExprContext);
	}
	public lineExpr(): LineExprContext | undefined {
		return this.tryGetRuleContext(0, LineExprContext);
	}
	public angleDef(): AngleDefContext | undefined {
		return this.tryGetRuleContext(0, AngleDefContext);
	}
	public planeExpr(): PlaneExprContext | undefined {
		return this.tryGetRuleContext(0, PlaneExprContext);
	}
	public pointExpr(): PointExprContext | undefined {
		return this.tryGetRuleContext(0, PointExprContext);
	}
	public prismExpr(): PrismExprContext | undefined {
		return this.tryGetRuleContext(0, PrismExprContext);
	}
	public circleDef(): CircleDefContext | undefined {
		return this.tryGetRuleContext(0, CircleDefContext);
	}
	public sphereDef(): SphereDefContext | undefined {
		return this.tryGetRuleContext(0, SphereDefContext);
	}
	public vectorExpr(): VectorExprContext | undefined {
		return this.tryGetRuleContext(0, VectorExprContext);
	}
	public polygonExpr(): PolygonExprContext | undefined {
		return this.tryGetRuleContext(0, PolygonExprContext);
	}
	public segmentExpr(): SegmentExprContext | undefined {
		return this.tryGetRuleContext(0, SegmentExprContext);
	}
	public cylinderExpr(): CylinderExprContext | undefined {
		return this.tryGetRuleContext(0, CylinderExprContext);
	}
	public transformDef(): TransformDefContext | undefined {
		return this.tryGetRuleContext(0, TransformDefContext);
	}
	public tetrahedronExpr(): TetrahedronExprContext | undefined {
		return this.tryGetRuleContext(0, TetrahedronExprContext);
	}
	public intersectionDef(): IntersectionDefContext | undefined {
		return this.tryGetRuleContext(0, IntersectionDefContext);
	}
	public pyramidExpr(): PyramidExprContext | undefined {
		return this.tryGetRuleContext(0, PyramidExprContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_shapeExpr; }
	// @Override
	public enterRule(listener: MathCommandListener): void {
		if (listener.enterShapeExpr) {
			listener.enterShapeExpr(this);
		}
	}
	// @Override
	public exitRule(listener: MathCommandListener): void {
		if (listener.exitShapeExpr) {
			listener.exitShapeExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitShapeExpr) {
			return visitor.visitShapeExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


