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
	public static readonly POINT_ID = 35;
	public static readonly SHAPE_ID = 36;
	public static readonly LR = 37;
	public static readonly RR = 38;
	public static readonly LC = 39;
	public static readonly RC = 40;
	public static readonly COMMA = 41;
	public static readonly DIVIDE = 42;
	public static readonly ADD = 43;
	public static readonly SUB = 44;
	public static readonly MULTIPLY = 45;
	public static readonly POWER = 46;
	public static readonly EQ = 47;
	public static readonly INT_LIT = 48;
	public static readonly FLOAT_LIT = 49;
	public static readonly WS = 50;
	public static readonly RULE_program = 0;
	public static readonly RULE_expr = 1;
	public static readonly RULE_command = 2;
	public static readonly RULE_pointDef = 3;
	public static readonly RULE_sphereDef = 4;
	public static readonly RULE_planeDef = 5;
	public static readonly RULE_lineDef = 6;
	public static readonly RULE_angleDef = 7;
	public static readonly RULE_vectorDef = 8;
	public static readonly RULE_polygonDef = 9;
	public static readonly RULE_pointList = 10;
	public static readonly RULE_circleDef = 11;
	public static readonly RULE_segmentDef = 12;
	public static readonly RULE_rayDef = 13;
	public static readonly RULE_intersectionDef = 14;
	public static readonly RULE_transformDef = 15;
	public static readonly RULE_cylinderDef = 16;
	public static readonly RULE_tetrahedronDef = 17;
	public static readonly RULE_coneDef = 18;
	public static readonly RULE_prismDef = 19;
	public static readonly RULE_cuboidDef = 20;
	public static readonly RULE_numberExpr = 21;
	public static readonly RULE_additiveExpr = 22;
	public static readonly RULE_multiplicativeExpr = 23;
	public static readonly RULE_implicitMultiplicativeExpr = 24;
	public static readonly RULE_exponentialExpr = 25;
	public static readonly RULE_unaryExpr = 26;
	public static readonly RULE_primaryExpr = 27;
	public static readonly RULE_sinExpr = 28;
	public static readonly RULE_cosExpr = 29;
	public static readonly RULE_tanExpr = 30;
	public static readonly RULE_cotExpr = 31;
	public static readonly RULE_logExpr = 32;
	public static readonly RULE_lnExpr = 33;
	public static readonly RULE_cbrtExpr = 34;
	public static readonly RULE_sqrtExpr = 35;
	public static readonly RULE_absExpr = 36;
	public static readonly RULE_expExpr = 37;
	public static readonly RULE_pointExpr = 38;
	public static readonly RULE_lineExpr = 39;
	public static readonly RULE_vectorExpr = 40;
	public static readonly RULE_planeExpr = 41;
	public static readonly RULE_directionExpr = 42;
	public static readonly RULE_polygonExpr = 43;
	public static readonly RULE_cubodeExpr = 44;
	public static readonly RULE_tetrahedronExpr = 45;
	public static readonly RULE_cylinderExpr = 46;
	public static readonly RULE_coneExpr = 47;
	public static readonly RULE_prismExpr = 48;
	public static readonly RULE_shapeExpr = 49;
	public static readonly RULE_two_side_expr = 50;
	public static readonly RULE_varExpr = 51;
	public static readonly RULE_varMultiplicativeExpr = 52;
	public static readonly RULE_varImplicitMultiplicativeExpr = 53;
	public static readonly RULE_varExponentialExpr = 54;
	public static readonly RULE_varUnaryExpr = 55;
	public static readonly RULE_varPrimaryExpr = 56;
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"program", "expr", "command", "pointDef", "sphereDef", "planeDef", "lineDef", 
		"angleDef", "vectorDef", "polygonDef", "pointList", "circleDef", "segmentDef", 
		"rayDef", "intersectionDef", "transformDef", "cylinderDef", "tetrahedronDef", 
		"coneDef", "prismDef", "cuboidDef", "numberExpr", "additiveExpr", "multiplicativeExpr", 
		"implicitMultiplicativeExpr", "exponentialExpr", "unaryExpr", "primaryExpr", 
		"sinExpr", "cosExpr", "tanExpr", "cotExpr", "logExpr", "lnExpr", "cbrtExpr", 
		"sqrtExpr", "absExpr", "expExpr", "pointExpr", "lineExpr", "vectorExpr", 
		"planeExpr", "directionExpr", "polygonExpr", "cubodeExpr", "tetrahedronExpr", 
		"cylinderExpr", "coneExpr", "prismExpr", "shapeExpr", "two_side_expr", 
		"varExpr", "varMultiplicativeExpr", "varImplicitMultiplicativeExpr", "varExponentialExpr", 
		"varUnaryExpr", "varPrimaryExpr",
	];

	private static readonly _LITERAL_NAMES: Array<string | undefined> = [
		undefined, "'Circle'", "'Line'", "'Vector'", "'Segment'", "'Ray'", "'Polygon'", 
		"'Point'", "'Sphere'", "'Plane'", "'Intersect'", "'Angle'", "'Translate'", 
		"'Rotate'", "'Project'", "'Reflect'", "'Enlarge'", "'Cylinder'", "'Tetrahedron'", 
		"'Prism'", "'Pyramid'", "'Cuboid'", "'Cone'", "'sin'", "'cos'", "'tan'", 
		"'cot'", "'log'", "'ln'", "'exp'", "'sqrt'", "'cbrt'", "'abs'", "'pi'", 
		"'e'", undefined, undefined, "'('", "')'", "'{'", "'}'", "','", "'/'", 
		"'+'", "'-'", "'*'", "'^'", "'='",
	];
	private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
		undefined, "CIRCLE", "LINE", "VECTOR", "SEGMENT", "RAY", "POLYGON", "POINT", 
		"SPHERE", "PLANE", "INTERSECT", "ANGLE", "TRANSLATE", "ROTATE", "PROJECT", 
		"REFLECT", "ENLARGE", "CYLINDER", "TETRAHEDRON", "PRISM", "PYRAMID", "CUBOID", 
		"CONE", "SIN", "COS", "TAN", "COT", "LOG", "LN", "EXP", "SQRT", "CBRT", 
		"ABS", "PI", "E", "POINT_ID", "SHAPE_ID", "LR", "RR", "LC", "RC", "COMMA", 
		"DIVIDE", "ADD", "SUB", "MULTIPLY", "POWER", "EQ", "INT_LIT", "FLOAT_LIT", 
		"WS",
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
			this.state = 114;
			this.expr();
			this.state = 115;
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
			this.state = 125;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 0, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 117;
				this.command();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 118;
				this.two_side_expr();
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 119;
				this.pointExpr();
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 120;
				this.lineExpr();
				}
				break;

			case 5:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 121;
				this.vectorExpr();
				}
				break;

			case 6:
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 122;
				this.planeExpr();
				}
				break;

			case 7:
				this.enterOuterAlt(_localctx, 7);
				{
				this.state = 123;
				this.numberExpr();
				}
				break;

			case 8:
				this.enterOuterAlt(_localctx, 8);
				{
				this.state = 124;
				this.directionExpr();
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
	public command(): CommandContext {
		let _localctx: CommandContext = new CommandContext(this._ctx, this.state);
		this.enterRule(_localctx, 4, MathCommandParser.RULE_command);
		try {
			this.state = 139;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case MathCommandParser.POINT:
			case MathCommandParser.LR:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 127;
				this.pointDef();
				}
				break;
			case MathCommandParser.SPHERE:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 128;
				this.sphereDef();
				}
				break;
			case MathCommandParser.PLANE:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 129;
				this.planeDef();
				}
				break;
			case MathCommandParser.LINE:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 130;
				this.lineDef();
				}
				break;
			case MathCommandParser.ANGLE:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 131;
				this.angleDef();
				}
				break;
			case MathCommandParser.TRANSLATE:
			case MathCommandParser.ROTATE:
			case MathCommandParser.PROJECT:
			case MathCommandParser.REFLECT:
			case MathCommandParser.ENLARGE:
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 132;
				this.transformDef();
				}
				break;
			case MathCommandParser.VECTOR:
				this.enterOuterAlt(_localctx, 7);
				{
				this.state = 133;
				this.vectorDef();
				}
				break;
			case MathCommandParser.POLYGON:
				this.enterOuterAlt(_localctx, 8);
				{
				this.state = 134;
				this.polygonDef();
				}
				break;
			case MathCommandParser.CIRCLE:
				this.enterOuterAlt(_localctx, 9);
				{
				this.state = 135;
				this.circleDef();
				}
				break;
			case MathCommandParser.SEGMENT:
				this.enterOuterAlt(_localctx, 10);
				{
				this.state = 136;
				this.segmentDef();
				}
				break;
			case MathCommandParser.RAY:
				this.enterOuterAlt(_localctx, 11);
				{
				this.state = 137;
				this.rayDef();
				}
				break;
			case MathCommandParser.INTERSECT:
				this.enterOuterAlt(_localctx, 12);
				{
				this.state = 138;
				this.intersectionDef();
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
	public pointDef(): PointDefContext {
		let _localctx: PointDefContext = new PointDefContext(this._ctx, this.state);
		this.enterRule(_localctx, 6, MathCommandParser.RULE_pointDef);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 142;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === MathCommandParser.POINT) {
				{
				this.state = 141;
				this.match(MathCommandParser.POINT);
				}
			}

			this.state = 144;
			this.match(MathCommandParser.LR);
			{
			this.state = 145;
			this.numberExpr();
			this.state = 146;
			this.match(MathCommandParser.COMMA);
			this.state = 147;
			this.numberExpr();
			this.state = 148;
			this.match(MathCommandParser.COMMA);
			this.state = 149;
			this.numberExpr();
			}
			this.state = 151;
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
		this.enterRule(_localctx, 8, MathCommandParser.RULE_sphereDef);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 153;
			this.match(MathCommandParser.SPHERE);
			this.state = 154;
			this.match(MathCommandParser.LR);
			{
			this.state = 155;
			this.pointExpr();
			this.state = 156;
			this.match(MathCommandParser.COMMA);
			this.state = 159;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 3, this._ctx) ) {
			case 1:
				{
				this.state = 157;
				this.pointExpr();
				}
				break;

			case 2:
				{
				this.state = 158;
				this.numberExpr();
				}
				break;
			}
			}
			this.state = 161;
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
		this.enterRule(_localctx, 10, MathCommandParser.RULE_planeDef);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 163;
			this.match(MathCommandParser.PLANE);
			this.state = 164;
			this.match(MathCommandParser.LR);
			this.state = 188;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 5, this._ctx) ) {
			case 1:
				{
				this.state = 165;
				this.match(MathCommandParser.SHAPE_ID);
				}
				break;

			case 2:
				{
				{
				this.state = 166;
				this.pointExpr();
				this.state = 167;
				this.match(MathCommandParser.COMMA);
				this.state = 170;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 4, this._ctx) ) {
				case 1:
					{
					this.state = 168;
					this.planeExpr();
					}
					break;

				case 2:
					{
					this.state = 169;
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
				this.state = 172;
				this.lineExpr();
				this.state = 173;
				this.match(MathCommandParser.COMMA);
				this.state = 174;
				this.lineExpr();
				}
				}
				break;

			case 4:
				{
				{
				this.state = 176;
				this.pointExpr();
				this.state = 177;
				this.match(MathCommandParser.COMMA);
				this.state = 178;
				this.vectorExpr();
				this.state = 179;
				this.match(MathCommandParser.COMMA);
				this.state = 180;
				this.vectorExpr();
				}
				}
				break;

			case 5:
				{
				{
				this.state = 182;
				this.pointExpr();
				this.state = 183;
				this.match(MathCommandParser.COMMA);
				this.state = 184;
				this.pointExpr();
				this.state = 185;
				this.match(MathCommandParser.COMMA);
				this.state = 186;
				this.pointExpr();
				}
				}
				break;
			}
			this.state = 190;
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
		this.enterRule(_localctx, 12, MathCommandParser.RULE_lineDef);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 192;
			this.match(MathCommandParser.LINE);
			this.state = 193;
			this.match(MathCommandParser.LR);
			this.state = 206;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 6, this._ctx) ) {
			case 1:
				{
				{
				this.state = 194;
				this.pointExpr();
				this.state = 195;
				this.match(MathCommandParser.COMMA);
				this.state = 196;
				this.pointExpr();
				}
				}
				break;

			case 2:
				{
				{
				this.state = 198;
				this.pointExpr();
				this.state = 199;
				this.match(MathCommandParser.COMMA);
				this.state = 200;
				this.lineExpr();
				}
				}
				break;

			case 3:
				{
				{
				this.state = 202;
				this.pointExpr();
				this.state = 203;
				this.match(MathCommandParser.COMMA);
				this.state = 204;
				this.vectorExpr();
				}
				}
				break;
			}
			this.state = 208;
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
		this.enterRule(_localctx, 14, MathCommandParser.RULE_angleDef);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 210;
			this.match(MathCommandParser.ANGLE);
			this.state = 211;
			this.match(MathCommandParser.LR);
			this.state = 236;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 7, this._ctx) ) {
			case 1:
				{
				this.state = 212;
				this.vectorExpr();
				}
				break;

			case 2:
				{
				this.state = 213;
				this.pointExpr();
				}
				break;

			case 3:
				{
				{
				this.state = 214;
				this.vectorExpr();
				this.state = 215;
				this.match(MathCommandParser.COMMA);
				this.state = 216;
				this.vectorExpr();
				}
				}
				break;

			case 4:
				{
				{
				this.state = 218;
				this.lineExpr();
				this.state = 219;
				this.match(MathCommandParser.COMMA);
				this.state = 220;
				this.lineExpr();
				}
				}
				break;

			case 5:
				{
				{
				this.state = 222;
				this.lineExpr();
				this.state = 223;
				this.match(MathCommandParser.COMMA);
				this.state = 224;
				this.planeExpr();
				}
				}
				break;

			case 6:
				{
				{
				this.state = 226;
				this.planeExpr();
				this.state = 227;
				this.match(MathCommandParser.COMMA);
				this.state = 228;
				this.planeExpr();
				}
				}
				break;

			case 7:
				{
				{
				this.state = 230;
				this.pointExpr();
				this.state = 231;
				this.match(MathCommandParser.COMMA);
				this.state = 232;
				this.pointExpr();
				this.state = 233;
				this.match(MathCommandParser.COMMA);
				this.state = 234;
				this.pointExpr();
				}
				}
				break;
			}
			this.state = 238;
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
		this.enterRule(_localctx, 16, MathCommandParser.RULE_vectorDef);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 240;
			this.match(MathCommandParser.VECTOR);
			this.state = 241;
			this.match(MathCommandParser.LR);
			this.state = 247;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 8, this._ctx) ) {
			case 1:
				{
				this.state = 242;
				this.pointExpr();
				}
				break;

			case 2:
				{
				{
				this.state = 243;
				this.pointExpr();
				this.state = 244;
				this.match(MathCommandParser.COMMA);
				this.state = 245;
				this.pointExpr();
				}
				}
				break;
			}
			this.state = 249;
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
		this.enterRule(_localctx, 18, MathCommandParser.RULE_polygonDef);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 251;
			this.match(MathCommandParser.POLYGON);
			this.state = 252;
			this.match(MathCommandParser.LR);
			this.state = 253;
			this.pointList();
			this.state = 254;
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
		this.enterRule(_localctx, 20, MathCommandParser.RULE_pointList);
		try {
			this.state = 261;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 9, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 256;
				this.pointExpr();
				this.state = 257;
				this.match(MathCommandParser.COMMA);
				this.state = 258;
				this.pointList();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 260;
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
		this.enterRule(_localctx, 22, MathCommandParser.RULE_circleDef);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 263;
			this.match(MathCommandParser.CIRCLE);
			this.state = 264;
			this.match(MathCommandParser.LR);
			this.state = 287;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 10, this._ctx) ) {
			case 1:
				{
				{
				this.state = 265;
				this.pointExpr();
				this.state = 266;
				this.match(MathCommandParser.COMMA);
				this.state = 267;
				this.numberExpr();
				}
				}
				break;

			case 2:
				{
				{
				this.state = 269;
				this.pointExpr();
				this.state = 270;
				this.match(MathCommandParser.COMMA);
				this.state = 271;
				this.pointExpr();
				this.state = 272;
				this.match(MathCommandParser.COMMA);
				this.state = 273;
				this.pointExpr();
				}
				}
				break;

			case 3:
				{
				{
				this.state = 275;
				this.pointExpr();
				this.state = 276;
				this.match(MathCommandParser.COMMA);
				this.state = 277;
				this.numberExpr();
				this.state = 278;
				this.match(MathCommandParser.COMMA);
				this.state = 279;
				this.directionExpr();
				}
				}
				break;

			case 4:
				{
				{
				this.state = 281;
				this.pointExpr();
				this.state = 282;
				this.match(MathCommandParser.COMMA);
				this.state = 283;
				this.pointExpr();
				this.state = 284;
				this.match(MathCommandParser.COMMA);
				this.state = 285;
				this.directionExpr();
				}
				}
				break;
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
	public segmentDef(): SegmentDefContext {
		let _localctx: SegmentDefContext = new SegmentDefContext(this._ctx, this.state);
		this.enterRule(_localctx, 24, MathCommandParser.RULE_segmentDef);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 291;
			this.match(MathCommandParser.SEGMENT);
			this.state = 292;
			this.match(MathCommandParser.LR);
			{
			this.state = 293;
			this.pointExpr();
			this.state = 294;
			this.match(MathCommandParser.COMMA);
			this.state = 297;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 11, this._ctx) ) {
			case 1:
				{
				this.state = 295;
				this.pointExpr();
				}
				break;

			case 2:
				{
				this.state = 296;
				this.numberExpr();
				}
				break;
			}
			}
			this.state = 299;
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
		this.enterRule(_localctx, 26, MathCommandParser.RULE_rayDef);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 301;
			this.match(MathCommandParser.RAY);
			this.state = 302;
			this.match(MathCommandParser.LR);
			{
			this.state = 303;
			this.pointExpr();
			this.state = 304;
			this.match(MathCommandParser.COMMA);
			this.state = 307;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case MathCommandParser.POINT:
			case MathCommandParser.POINT_ID:
			case MathCommandParser.LR:
				{
				this.state = 305;
				this.pointExpr();
				}
				break;
			case MathCommandParser.VECTOR:
			case MathCommandParser.SHAPE_ID:
				{
				this.state = 306;
				this.vectorExpr();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			}
			this.state = 309;
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
		this.enterRule(_localctx, 28, MathCommandParser.RULE_intersectionDef);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 311;
			this.match(MathCommandParser.INTERSECT);
			this.state = 312;
			this.match(MathCommandParser.LR);
			this.state = 315;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 13, this._ctx) ) {
			case 1:
				{
				this.state = 313;
				this.expr();
				}
				break;

			case 2:
				{
				this.state = 314;
				this.expr();
				}
				break;
			}
			this.state = 317;
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
		this.enterRule(_localctx, 30, MathCommandParser.RULE_transformDef);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 369;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case MathCommandParser.TRANSLATE:
				{
				{
				this.state = 319;
				this.match(MathCommandParser.TRANSLATE);
				this.state = 320;
				this.match(MathCommandParser.LR);
				{
				this.state = 321;
				this.pointExpr();
				this.state = 322;
				this.match(MathCommandParser.COMMA);
				this.state = 323;
				this.vectorExpr();
				}
				this.state = 325;
				this.match(MathCommandParser.RR);
				}
				}
				break;
			case MathCommandParser.ROTATE:
				{
				{
				this.state = 327;
				this.match(MathCommandParser.ROTATE);
				this.state = 328;
				this.match(MathCommandParser.LR);
				{
				this.state = 329;
				this.shapeExpr();
				this.state = 330;
				this.match(MathCommandParser.COMMA);
				this.state = 331;
				this.numberExpr();
				this.state = 334;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === MathCommandParser.COMMA) {
					{
					this.state = 332;
					this.match(MathCommandParser.COMMA);
					this.state = 333;
					this.shapeExpr();
					}
				}

				}
				this.state = 336;
				this.match(MathCommandParser.RR);
				}
				}
				break;
			case MathCommandParser.PROJECT:
				{
				{
				this.state = 338;
				this.match(MathCommandParser.PROJECT);
				this.state = 339;
				this.match(MathCommandParser.LR);
				{
				this.state = 340;
				this.pointExpr();
				this.state = 341;
				this.match(MathCommandParser.COMMA);
				this.state = 344;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 15, this._ctx) ) {
				case 1:
					{
					this.state = 342;
					this.planeExpr();
					}
					break;

				case 2:
					{
					this.state = 343;
					this.lineExpr();
					}
					break;
				}
				}
				this.state = 346;
				this.match(MathCommandParser.RR);
				}
				}
				break;
			case MathCommandParser.REFLECT:
				{
				{
				this.state = 348;
				this.match(MathCommandParser.REFLECT);
				this.state = 349;
				this.match(MathCommandParser.LR);
				{
				this.state = 350;
				this.pointExpr();
				this.state = 351;
				this.match(MathCommandParser.COMMA);
				this.state = 355;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 16, this._ctx) ) {
				case 1:
					{
					this.state = 352;
					this.planeExpr();
					}
					break;

				case 2:
					{
					this.state = 353;
					this.lineExpr();
					}
					break;

				case 3:
					{
					this.state = 354;
					this.pointExpr();
					}
					break;
				}
				}
				this.state = 357;
				this.match(MathCommandParser.RR);
				}
				}
				break;
			case MathCommandParser.ENLARGE:
				{
				{
				this.state = 359;
				this.match(MathCommandParser.ENLARGE);
				this.state = 360;
				this.match(MathCommandParser.LR);
				{
				this.state = 361;
				this.shapeExpr();
				this.state = 362;
				this.match(MathCommandParser.COMMA);
				this.state = 363;
				this.numberExpr();
				this.state = 364;
				this.match(MathCommandParser.COMMA);
				this.state = 365;
				this.pointExpr();
				}
				this.state = 367;
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
		this.enterRule(_localctx, 32, MathCommandParser.RULE_cylinderDef);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 371;
			this.match(MathCommandParser.CYLINDER);
			this.state = 372;
			this.match(MathCommandParser.LR);
			{
			this.state = 373;
			this.pointExpr();
			this.state = 374;
			this.match(MathCommandParser.COMMA);
			this.state = 375;
			this.pointExpr();
			this.state = 376;
			this.match(MathCommandParser.COMMA);
			this.state = 377;
			this.numberExpr();
			}
			this.state = 379;
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
		this.enterRule(_localctx, 34, MathCommandParser.RULE_tetrahedronDef);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 381;
			this.match(MathCommandParser.TETRAHEDRON);
			this.state = 382;
			this.match(MathCommandParser.LR);
			{
			this.state = 383;
			this.polygonExpr();
			this.state = 384;
			this.match(MathCommandParser.COMMA);
			this.state = 385;
			this.pointExpr();
			}
			this.state = 387;
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
		this.enterRule(_localctx, 36, MathCommandParser.RULE_coneDef);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 389;
			this.match(MathCommandParser.CONE);
			this.state = 390;
			this.match(MathCommandParser.LR);
			{
			this.state = 391;
			this.pointExpr();
			this.state = 392;
			this.match(MathCommandParser.COMMA);
			this.state = 393;
			this.numberExpr();
			this.state = 394;
			this.match(MathCommandParser.COMMA);
			this.state = 395;
			this.pointExpr();
			}
			this.state = 397;
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
		this.enterRule(_localctx, 38, MathCommandParser.RULE_prismDef);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 399;
			this.match(MathCommandParser.PRISM);
			this.state = 400;
			this.match(MathCommandParser.LR);
			{
			this.state = 401;
			this.polygonExpr();
			this.state = 402;
			this.match(MathCommandParser.COMMA);
			this.state = 403;
			this.directionExpr();
			}
			this.state = 405;
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
	public cuboidDef(): CuboidDefContext {
		let _localctx: CuboidDefContext = new CuboidDefContext(this._ctx, this.state);
		this.enterRule(_localctx, 40, MathCommandParser.RULE_cuboidDef);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 407;
			this.match(MathCommandParser.CUBOID);
			this.state = 408;
			this.match(MathCommandParser.LR);
			{
			this.state = 409;
			this.pointExpr();
			this.state = 410;
			this.match(MathCommandParser.COMMA);
			this.state = 411;
			this.numberExpr();
			this.state = 419;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === MathCommandParser.COMMA) {
				{
				this.state = 412;
				this.match(MathCommandParser.COMMA);
				this.state = 413;
				this.numberExpr();
				this.state = 414;
				this.match(MathCommandParser.COMMA);
				this.state = 415;
				this.numberExpr();
				this.state = 416;
				this.match(MathCommandParser.COMMA);
				this.state = 417;
				this.numberExpr();
				}
			}

			}
			this.state = 421;
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
		this.enterRule(_localctx, 42, MathCommandParser.RULE_numberExpr);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 423;
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
		let _startState: number = 44;
		this.enterRecursionRule(_localctx, 44, MathCommandParser.RULE_additiveExpr, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			{
			this.state = 426;
			this.multiplicativeExpr(0);
			}
			this._ctx._stop = this._input.tryLT(-1);
			this.state = 436;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 20, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = _localctx;
					{
					this.state = 434;
					this._errHandler.sync(this);
					switch ( this.interpreter.adaptivePredict(this._input, 19, this._ctx) ) {
					case 1:
						{
						_localctx = new AdditiveExprContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, MathCommandParser.RULE_additiveExpr);
						this.state = 428;
						if (!(this.precpred(this._ctx, 3))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 3)");
						}
						this.state = 429;
						this.match(MathCommandParser.ADD);
						this.state = 430;
						this.multiplicativeExpr(0);
						}
						break;

					case 2:
						{
						_localctx = new AdditiveExprContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, MathCommandParser.RULE_additiveExpr);
						this.state = 431;
						if (!(this.precpred(this._ctx, 2))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 2)");
						}
						this.state = 432;
						this.match(MathCommandParser.SUB);
						this.state = 433;
						this.multiplicativeExpr(0);
						}
						break;
					}
					}
				}
				this.state = 438;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 20, this._ctx);
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
		let _startState: number = 46;
		this.enterRecursionRule(_localctx, 46, MathCommandParser.RULE_multiplicativeExpr, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 442;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 21, this._ctx) ) {
			case 1:
				{
				this.state = 440;
				this.implicitMultiplicativeExpr();
				}
				break;

			case 2:
				{
				this.state = 441;
				this.exponentialExpr();
				}
				break;
			}
			this._ctx._stop = this._input.tryLT(-1);
			this.state = 452;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 23, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = _localctx;
					{
					this.state = 450;
					this._errHandler.sync(this);
					switch ( this.interpreter.adaptivePredict(this._input, 22, this._ctx) ) {
					case 1:
						{
						_localctx = new MultiplicativeExprContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, MathCommandParser.RULE_multiplicativeExpr);
						this.state = 444;
						if (!(this.precpred(this._ctx, 4))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 4)");
						}
						this.state = 445;
						this.match(MathCommandParser.MULTIPLY);
						this.state = 446;
						this.exponentialExpr();
						}
						break;

					case 2:
						{
						_localctx = new MultiplicativeExprContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, MathCommandParser.RULE_multiplicativeExpr);
						this.state = 447;
						if (!(this.precpred(this._ctx, 3))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 3)");
						}
						this.state = 448;
						this.match(MathCommandParser.DIVIDE);
						this.state = 449;
						this.exponentialExpr();
						}
						break;
					}
					}
				}
				this.state = 454;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 23, this._ctx);
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
		this.enterRule(_localctx, 48, MathCommandParser.RULE_implicitMultiplicativeExpr);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 455;
			this.primaryExpr();
			this.state = 457;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 456;
					this.primaryExpr();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 459;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 24, this._ctx);
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
		this.enterRule(_localctx, 50, MathCommandParser.RULE_exponentialExpr);
		try {
			this.state = 466;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 25, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 461;
				this.unaryExpr();
				this.state = 462;
				this.match(MathCommandParser.POWER);
				this.state = 463;
				this.exponentialExpr();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 465;
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
		this.enterRule(_localctx, 52, MathCommandParser.RULE_unaryExpr);
		try {
			this.state = 473;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case MathCommandParser.SUB:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 468;
				this.match(MathCommandParser.SUB);
				this.state = 469;
				this.unaryExpr();
				}
				break;
			case MathCommandParser.ADD:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 470;
				this.match(MathCommandParser.ADD);
				this.state = 471;
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
				this.state = 472;
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
		this.enterRule(_localctx, 54, MathCommandParser.RULE_primaryExpr);
		try {
			this.state = 493;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case MathCommandParser.INT_LIT:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 475;
				this.match(MathCommandParser.INT_LIT);
				}
				break;
			case MathCommandParser.FLOAT_LIT:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 476;
				this.match(MathCommandParser.FLOAT_LIT);
				}
				break;
			case MathCommandParser.PI:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 477;
				this.match(MathCommandParser.PI);
				}
				break;
			case MathCommandParser.E:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 478;
				this.match(MathCommandParser.E);
				}
				break;
			case MathCommandParser.LR:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 479;
				this.match(MathCommandParser.LR);
				this.state = 480;
				this.numberExpr();
				this.state = 481;
				this.match(MathCommandParser.RR);
				}
				break;
			case MathCommandParser.SIN:
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 483;
				this.sinExpr();
				}
				break;
			case MathCommandParser.COS:
				this.enterOuterAlt(_localctx, 7);
				{
				this.state = 484;
				this.cosExpr();
				}
				break;
			case MathCommandParser.TAN:
				this.enterOuterAlt(_localctx, 8);
				{
				this.state = 485;
				this.tanExpr();
				}
				break;
			case MathCommandParser.COT:
				this.enterOuterAlt(_localctx, 9);
				{
				this.state = 486;
				this.cotExpr();
				}
				break;
			case MathCommandParser.LOG:
				this.enterOuterAlt(_localctx, 10);
				{
				this.state = 487;
				this.logExpr();
				}
				break;
			case MathCommandParser.LN:
				this.enterOuterAlt(_localctx, 11);
				{
				this.state = 488;
				this.lnExpr();
				}
				break;
			case MathCommandParser.EXP:
				this.enterOuterAlt(_localctx, 12);
				{
				this.state = 489;
				this.expExpr();
				}
				break;
			case MathCommandParser.ABS:
				this.enterOuterAlt(_localctx, 13);
				{
				this.state = 490;
				this.absExpr();
				}
				break;
			case MathCommandParser.SQRT:
				this.enterOuterAlt(_localctx, 14);
				{
				this.state = 491;
				this.sqrtExpr();
				}
				break;
			case MathCommandParser.CBRT:
				this.enterOuterAlt(_localctx, 15);
				{
				this.state = 492;
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
		this.enterRule(_localctx, 56, MathCommandParser.RULE_sinExpr);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 495;
			this.match(MathCommandParser.SIN);
			this.state = 496;
			this.match(MathCommandParser.LR);
			this.state = 497;
			this.numberExpr();
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
	public cosExpr(): CosExprContext {
		let _localctx: CosExprContext = new CosExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 58, MathCommandParser.RULE_cosExpr);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 500;
			this.match(MathCommandParser.COS);
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
	public tanExpr(): TanExprContext {
		let _localctx: TanExprContext = new TanExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 60, MathCommandParser.RULE_tanExpr);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 505;
			this.match(MathCommandParser.TAN);
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
	public cotExpr(): CotExprContext {
		let _localctx: CotExprContext = new CotExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 62, MathCommandParser.RULE_cotExpr);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 510;
			this.match(MathCommandParser.COT);
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
	public logExpr(): LogExprContext {
		let _localctx: LogExprContext = new LogExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 64, MathCommandParser.RULE_logExpr);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 515;
			this.match(MathCommandParser.LOG);
			this.state = 516;
			this.match(MathCommandParser.LR);
			{
			this.state = 517;
			this.numberExpr();
			this.state = 518;
			this.match(MathCommandParser.COMMA);
			this.state = 519;
			this.numberExpr();
			}
			this.state = 521;
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
		this.enterRule(_localctx, 66, MathCommandParser.RULE_lnExpr);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 523;
			this.match(MathCommandParser.LN);
			this.state = 524;
			this.match(MathCommandParser.LR);
			this.state = 525;
			this.numberExpr();
			this.state = 526;
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
		this.enterRule(_localctx, 68, MathCommandParser.RULE_cbrtExpr);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 528;
			this.match(MathCommandParser.CBRT);
			this.state = 529;
			this.match(MathCommandParser.LR);
			this.state = 530;
			this.numberExpr();
			this.state = 531;
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
		this.enterRule(_localctx, 70, MathCommandParser.RULE_sqrtExpr);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 533;
			this.match(MathCommandParser.SQRT);
			this.state = 534;
			this.match(MathCommandParser.LR);
			this.state = 535;
			this.numberExpr();
			this.state = 536;
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
		this.enterRule(_localctx, 72, MathCommandParser.RULE_absExpr);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 538;
			this.match(MathCommandParser.ABS);
			this.state = 539;
			this.match(MathCommandParser.LR);
			this.state = 540;
			this.numberExpr();
			this.state = 541;
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
		this.enterRule(_localctx, 74, MathCommandParser.RULE_expExpr);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 543;
			this.match(MathCommandParser.EXP);
			this.state = 544;
			this.match(MathCommandParser.LR);
			this.state = 545;
			this.numberExpr();
			this.state = 546;
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
		this.enterRule(_localctx, 76, MathCommandParser.RULE_pointExpr);
		try {
			this.state = 550;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case MathCommandParser.POINT_ID:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 548;
				this.match(MathCommandParser.POINT_ID);
				}
				break;
			case MathCommandParser.POINT:
			case MathCommandParser.LR:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 549;
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
		this.enterRule(_localctx, 78, MathCommandParser.RULE_lineExpr);
		let _la: number;
		try {
			this.state = 598;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 33, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 552;
				this.lineDef();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 553;
				this.match(MathCommandParser.SHAPE_ID);
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 596;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 32, this._ctx) ) {
				case 1:
					{
					this.state = 563;
					this._errHandler.sync(this);
					switch ( this.interpreter.adaptivePredict(this._input, 29, this._ctx) ) {
					case 1:
						{
						this.state = 554;
						this.pointExpr();
						}
						break;

					case 2:
						{
						this.state = 555;
						this.vectorDef();
						}
						break;

					case 3:
						{
						this.state = 556;
						this.match(MathCommandParser.LR);
						{
						this.state = 557;
						this.numberExpr();
						this.state = 558;
						this.match(MathCommandParser.COMMA);
						this.state = 559;
						this.numberExpr();
						this.state = 560;
						this.match(MathCommandParser.COMMA);
						this.state = 561;
						this.numberExpr();
						}
						}
						break;
					}
					this.state = 565;
					_la = this._input.LA(1);
					if (!(_la === MathCommandParser.ADD || _la === MathCommandParser.SUB)) {
					this._errHandler.recoverInline(this);
					} else {
						if (this._input.LA(1) === Token.EOF) {
							this.matchedEOF = true;
						}

						this._errHandler.reportMatch(this);
						this.consume();
					}
					{
					this.state = 566;
					this.match(MathCommandParser.SHAPE_ID);
					this.state = 567;
					this.match(MathCommandParser.MULTIPLY);
					this.state = 579;
					this._errHandler.sync(this);
					switch (this._input.LA(1)) {
					case MathCommandParser.VECTOR:
						{
						this.state = 568;
						this.vectorDef();
						}
						break;
					case MathCommandParser.SHAPE_ID:
						{
						this.state = 569;
						this.match(MathCommandParser.SHAPE_ID);
						}
						break;
					case MathCommandParser.LR:
						{
						this.state = 570;
						this.match(MathCommandParser.LR);
						{
						this.state = 571;
						this.numberExpr();
						this.state = 572;
						this.match(MathCommandParser.COMMA);
						this.state = 573;
						this.numberExpr();
						this.state = 574;
						this.match(MathCommandParser.COMMA);
						this.state = 575;
						this.numberExpr();
						}
						this.state = 577;
						this.match(MathCommandParser.RR);
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
					this.state = 592;
					this._errHandler.sync(this);
					switch (this._input.LA(1)) {
					case MathCommandParser.VECTOR:
						{
						this.state = 581;
						this.vectorDef();
						}
						break;
					case MathCommandParser.SHAPE_ID:
						{
						this.state = 582;
						this.match(MathCommandParser.SHAPE_ID);
						}
						break;
					case MathCommandParser.LR:
						{
						this.state = 583;
						this.match(MathCommandParser.LR);
						{
						this.state = 584;
						this.numberExpr();
						this.state = 585;
						this.match(MathCommandParser.COMMA);
						this.state = 586;
						this.numberExpr();
						this.state = 587;
						this.match(MathCommandParser.COMMA);
						this.state = 588;
						this.numberExpr();
						}
						this.state = 590;
						this.match(MathCommandParser.RR);
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 594;
					this.match(MathCommandParser.MULTIPLY);
					this.state = 595;
					this.match(MathCommandParser.SHAPE_ID);
					}
					}
					break;
				}
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
			this.state = 602;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case MathCommandParser.VECTOR:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 600;
				this.vectorDef();
				}
				break;
			case MathCommandParser.SHAPE_ID:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 601;
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
			this.state = 606;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case MathCommandParser.PLANE:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 604;
				this.planeDef();
				}
				break;
			case MathCommandParser.SHAPE_ID:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 605;
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
			this.state = 610;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case MathCommandParser.SHAPE_ID:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 608;
				this.match(MathCommandParser.SHAPE_ID);
				}
				break;
			case MathCommandParser.VECTOR:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 609;
				this.vectorDef();
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
	public polygonExpr(): PolygonExprContext {
		let _localctx: PolygonExprContext = new PolygonExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 86, MathCommandParser.RULE_polygonExpr);
		try {
			this.state = 614;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case MathCommandParser.SHAPE_ID:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 612;
				this.match(MathCommandParser.SHAPE_ID);
				}
				break;
			case MathCommandParser.POLYGON:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 613;
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
	public cubodeExpr(): CubodeExprContext {
		let _localctx: CubodeExprContext = new CubodeExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 88, MathCommandParser.RULE_cubodeExpr);
		try {
			this.state = 618;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case MathCommandParser.SHAPE_ID:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 616;
				this.match(MathCommandParser.SHAPE_ID);
				}
				break;
			case MathCommandParser.CUBOID:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 617;
				this.cuboidDef();
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
		this.enterRule(_localctx, 90, MathCommandParser.RULE_tetrahedronExpr);
		try {
			this.state = 622;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case MathCommandParser.SHAPE_ID:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 620;
				this.match(MathCommandParser.SHAPE_ID);
				}
				break;
			case MathCommandParser.TETRAHEDRON:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 621;
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
		this.enterRule(_localctx, 92, MathCommandParser.RULE_cylinderExpr);
		try {
			this.state = 626;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case MathCommandParser.SHAPE_ID:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 624;
				this.match(MathCommandParser.SHAPE_ID);
				}
				break;
			case MathCommandParser.CYLINDER:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 625;
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
		this.enterRule(_localctx, 94, MathCommandParser.RULE_coneExpr);
		try {
			this.state = 630;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case MathCommandParser.SHAPE_ID:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 628;
				this.match(MathCommandParser.SHAPE_ID);
				}
				break;
			case MathCommandParser.CONE:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 629;
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
		this.enterRule(_localctx, 96, MathCommandParser.RULE_prismExpr);
		try {
			this.state = 634;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case MathCommandParser.SHAPE_ID:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 632;
				this.match(MathCommandParser.SHAPE_ID);
				}
				break;
			case MathCommandParser.PRISM:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 633;
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
	public shapeExpr(): ShapeExprContext {
		let _localctx: ShapeExprContext = new ShapeExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 98, MathCommandParser.RULE_shapeExpr);
		try {
			this.state = 647;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 43, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 636;
				this.pointExpr();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 637;
				this.lineExpr();
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 638;
				this.vectorExpr();
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 639;
				this.polygonExpr();
				}
				break;

			case 5:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 640;
				this.planeExpr();
				}
				break;

			case 6:
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 641;
				this.directionExpr();
				}
				break;

			case 7:
				this.enterOuterAlt(_localctx, 7);
				{
				this.state = 642;
				this.cubodeExpr();
				}
				break;

			case 8:
				this.enterOuterAlt(_localctx, 8);
				{
				this.state = 643;
				this.tetrahedronExpr();
				}
				break;

			case 9:
				this.enterOuterAlt(_localctx, 9);
				{
				this.state = 644;
				this.cylinderExpr();
				}
				break;

			case 10:
				this.enterOuterAlt(_localctx, 10);
				{
				this.state = 645;
				this.coneExpr();
				}
				break;

			case 11:
				this.enterOuterAlt(_localctx, 11);
				{
				this.state = 646;
				this.prismExpr();
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
	public two_side_expr(): Two_side_exprContext {
		let _localctx: Two_side_exprContext = new Two_side_exprContext(this._ctx, this.state);
		this.enterRule(_localctx, 100, MathCommandParser.RULE_two_side_expr);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 649;
			this.varExpr(0);
			this.state = 650;
			this.match(MathCommandParser.EQ);
			this.state = 651;
			this.varExpr(0);
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

	public varExpr(): VarExprContext;
	public varExpr(_p: number): VarExprContext;
	// @RuleVersion(0)
	public varExpr(_p?: number): VarExprContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let _localctx: VarExprContext = new VarExprContext(this._ctx, _parentState);
		let _prevctx: VarExprContext = _localctx;
		let _startState: number = 102;
		this.enterRecursionRule(_localctx, 102, MathCommandParser.RULE_varExpr, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			{
			this.state = 654;
			this.varMultiplicativeExpr(0);
			}
			this._ctx._stop = this._input.tryLT(-1);
			this.state = 664;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 45, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = _localctx;
					{
					this.state = 662;
					this._errHandler.sync(this);
					switch ( this.interpreter.adaptivePredict(this._input, 44, this._ctx) ) {
					case 1:
						{
						_localctx = new VarExprContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, MathCommandParser.RULE_varExpr);
						this.state = 656;
						if (!(this.precpred(this._ctx, 3))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 3)");
						}
						this.state = 657;
						this.match(MathCommandParser.ADD);
						this.state = 658;
						this.varMultiplicativeExpr(0);
						}
						break;

					case 2:
						{
						_localctx = new VarExprContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, MathCommandParser.RULE_varExpr);
						this.state = 659;
						if (!(this.precpred(this._ctx, 2))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 2)");
						}
						this.state = 660;
						this.match(MathCommandParser.SUB);
						this.state = 661;
						this.varMultiplicativeExpr(0);
						}
						break;
					}
					}
				}
				this.state = 666;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 45, this._ctx);
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

	public varMultiplicativeExpr(): VarMultiplicativeExprContext;
	public varMultiplicativeExpr(_p: number): VarMultiplicativeExprContext;
	// @RuleVersion(0)
	public varMultiplicativeExpr(_p?: number): VarMultiplicativeExprContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let _localctx: VarMultiplicativeExprContext = new VarMultiplicativeExprContext(this._ctx, _parentState);
		let _prevctx: VarMultiplicativeExprContext = _localctx;
		let _startState: number = 104;
		this.enterRecursionRule(_localctx, 104, MathCommandParser.RULE_varMultiplicativeExpr, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 670;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 46, this._ctx) ) {
			case 1:
				{
				this.state = 668;
				this.varImplicitMultiplicativeExpr();
				}
				break;

			case 2:
				{
				this.state = 669;
				this.varExponentialExpr();
				}
				break;
			}
			this._ctx._stop = this._input.tryLT(-1);
			this.state = 680;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 48, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = _localctx;
					{
					this.state = 678;
					this._errHandler.sync(this);
					switch ( this.interpreter.adaptivePredict(this._input, 47, this._ctx) ) {
					case 1:
						{
						_localctx = new VarMultiplicativeExprContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, MathCommandParser.RULE_varMultiplicativeExpr);
						this.state = 672;
						if (!(this.precpred(this._ctx, 4))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 4)");
						}
						this.state = 673;
						this.match(MathCommandParser.MULTIPLY);
						this.state = 674;
						this.varExponentialExpr();
						}
						break;

					case 2:
						{
						_localctx = new VarMultiplicativeExprContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, MathCommandParser.RULE_varMultiplicativeExpr);
						this.state = 675;
						if (!(this.precpred(this._ctx, 3))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 3)");
						}
						this.state = 676;
						this.match(MathCommandParser.DIVIDE);
						this.state = 677;
						this.varExponentialExpr();
						}
						break;
					}
					}
				}
				this.state = 682;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 48, this._ctx);
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
	public varImplicitMultiplicativeExpr(): VarImplicitMultiplicativeExprContext {
		let _localctx: VarImplicitMultiplicativeExprContext = new VarImplicitMultiplicativeExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 106, MathCommandParser.RULE_varImplicitMultiplicativeExpr);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 683;
			this.varPrimaryExpr();
			this.state = 685;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 684;
					this.varPrimaryExpr();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 687;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 49, this._ctx);
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
	public varExponentialExpr(): VarExponentialExprContext {
		let _localctx: VarExponentialExprContext = new VarExponentialExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 108, MathCommandParser.RULE_varExponentialExpr);
		try {
			this.state = 694;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 50, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 689;
				this.varUnaryExpr();
				this.state = 690;
				this.match(MathCommandParser.POWER);
				this.state = 691;
				this.varExponentialExpr();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 693;
				this.varUnaryExpr();
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
	public varUnaryExpr(): VarUnaryExprContext {
		let _localctx: VarUnaryExprContext = new VarUnaryExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 110, MathCommandParser.RULE_varUnaryExpr);
		try {
			this.state = 701;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case MathCommandParser.SUB:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 696;
				this.match(MathCommandParser.SUB);
				this.state = 697;
				this.varUnaryExpr();
				}
				break;
			case MathCommandParser.ADD:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 698;
				this.match(MathCommandParser.ADD);
				this.state = 699;
				this.varUnaryExpr();
				}
				break;
			case MathCommandParser.LINE:
			case MathCommandParser.VECTOR:
			case MathCommandParser.POLYGON:
			case MathCommandParser.POINT:
			case MathCommandParser.PLANE:
			case MathCommandParser.CYLINDER:
			case MathCommandParser.TETRAHEDRON:
			case MathCommandParser.PRISM:
			case MathCommandParser.CUBOID:
			case MathCommandParser.CONE:
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
			case MathCommandParser.POINT_ID:
			case MathCommandParser.SHAPE_ID:
			case MathCommandParser.LR:
			case MathCommandParser.INT_LIT:
			case MathCommandParser.FLOAT_LIT:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 700;
				this.varPrimaryExpr();
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
	public varPrimaryExpr(): VarPrimaryExprContext {
		let _localctx: VarPrimaryExprContext = new VarPrimaryExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 112, MathCommandParser.RULE_varPrimaryExpr);
		try {
			this.state = 722;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 52, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 703;
				this.match(MathCommandParser.INT_LIT);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 704;
				this.match(MathCommandParser.FLOAT_LIT);
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 705;
				this.match(MathCommandParser.PI);
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 706;
				this.match(MathCommandParser.E);
				}
				break;

			case 5:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 707;
				this.shapeExpr();
				}
				break;

			case 6:
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 708;
				this.match(MathCommandParser.LR);
				this.state = 709;
				this.varExpr(0);
				this.state = 710;
				this.match(MathCommandParser.RR);
				}
				break;

			case 7:
				this.enterOuterAlt(_localctx, 7);
				{
				this.state = 712;
				this.sinExpr();
				}
				break;

			case 8:
				this.enterOuterAlt(_localctx, 8);
				{
				this.state = 713;
				this.cosExpr();
				}
				break;

			case 9:
				this.enterOuterAlt(_localctx, 9);
				{
				this.state = 714;
				this.tanExpr();
				}
				break;

			case 10:
				this.enterOuterAlt(_localctx, 10);
				{
				this.state = 715;
				this.cotExpr();
				}
				break;

			case 11:
				this.enterOuterAlt(_localctx, 11);
				{
				this.state = 716;
				this.logExpr();
				}
				break;

			case 12:
				this.enterOuterAlt(_localctx, 12);
				{
				this.state = 717;
				this.lnExpr();
				}
				break;

			case 13:
				this.enterOuterAlt(_localctx, 13);
				{
				this.state = 718;
				this.expExpr();
				}
				break;

			case 14:
				this.enterOuterAlt(_localctx, 14);
				{
				this.state = 719;
				this.absExpr();
				}
				break;

			case 15:
				this.enterOuterAlt(_localctx, 15);
				{
				this.state = 720;
				this.sqrtExpr();
				}
				break;

			case 16:
				this.enterOuterAlt(_localctx, 16);
				{
				this.state = 721;
				this.cbrtExpr();
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
		case 22:
			return this.additiveExpr_sempred(_localctx as AdditiveExprContext, predIndex);

		case 23:
			return this.multiplicativeExpr_sempred(_localctx as MultiplicativeExprContext, predIndex);

		case 51:
			return this.varExpr_sempred(_localctx as VarExprContext, predIndex);

		case 52:
			return this.varMultiplicativeExpr_sempred(_localctx as VarMultiplicativeExprContext, predIndex);
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
	private varExpr_sempred(_localctx: VarExprContext, predIndex: number): boolean {
		switch (predIndex) {
		case 4:
			return this.precpred(this._ctx, 3);

		case 5:
			return this.precpred(this._ctx, 2);
		}
		return true;
	}
	private varMultiplicativeExpr_sempred(_localctx: VarMultiplicativeExprContext, predIndex: number): boolean {
		switch (predIndex) {
		case 6:
			return this.precpred(this._ctx, 4);

		case 7:
			return this.precpred(this._ctx, 3);
		}
		return true;
	}

	private static readonly _serializedATNSegments: number = 2;
	private static readonly _serializedATNSegment0: string =
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x034\u02D7\x04\x02" +
		"\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04\x07" +
		"\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x04\f\t\f\x04\r\t\r\x04" +
		"\x0E\t\x0E\x04\x0F\t\x0F\x04\x10\t\x10\x04\x11\t\x11\x04\x12\t\x12\x04" +
		"\x13\t\x13\x04\x14\t\x14\x04\x15\t\x15\x04\x16\t\x16\x04\x17\t\x17\x04" +
		"\x18\t\x18\x04\x19\t\x19\x04\x1A\t\x1A\x04\x1B\t\x1B\x04\x1C\t\x1C\x04" +
		"\x1D\t\x1D\x04\x1E\t\x1E\x04\x1F\t\x1F\x04 \t \x04!\t!\x04\"\t\"\x04#" +
		"\t#\x04$\t$\x04%\t%\x04&\t&\x04\'\t\'\x04(\t(\x04)\t)\x04*\t*\x04+\t+" +
		"\x04,\t,\x04-\t-\x04.\t.\x04/\t/\x040\t0\x041\t1\x042\t2\x043\t3\x044" +
		"\t4\x045\t5\x046\t6\x047\t7\x048\t8\x049\t9\x04:\t:\x03\x02\x03\x02\x03" +
		"\x02\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x03\x05" +
		"\x03\x80\n\x03\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04" +
		"\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x05\x04\x8E\n\x04\x03\x05\x05" +
		"\x05\x91\n\x05\x03\x05\x03\x05\x03\x05\x03\x05\x03\x05\x03\x05\x03\x05" +
		"\x03\x05\x03\x05\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x05\x06" +
		"\xA2\n\x06\x03\x06\x03\x06\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03" +
		"\x07\x03\x07\x05\x07\xAD\n\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07" +
		"\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07" +
		"\x03\x07\x03\x07\x05\x07\xBF\n\x07\x03\x07\x03\x07\x03\b\x03\b\x03\b\x03" +
		"\b\x03\b\x03\b\x03\b\x03\b\x03\b\x03\b\x03\b\x03\b\x03\b\x03\b\x05\b\xD1" +
		"\n\b\x03\b\x03\b\x03\t\x03\t\x03\t\x03\t\x03\t\x03\t\x03\t\x03\t\x03\t" +
		"\x03\t\x03\t\x03\t\x03\t\x03\t\x03\t\x03\t\x03\t\x03\t\x03\t\x03\t\x03" +
		"\t\x03\t\x03\t\x03\t\x03\t\x03\t\x05\t\xEF\n\t\x03\t\x03\t\x03\n\x03\n" +
		"\x03\n\x03\n\x03\n\x03\n\x03\n\x05\n\xFA\n\n\x03\n\x03\n\x03\v\x03\v\x03" +
		"\v\x03\v\x03\v\x03\f\x03\f\x03\f\x03\f\x03\f\x05\f\u0108\n\f\x03\r\x03" +
		"\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03" +
		"\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x05\r\u0122" +
		"\n\r\x03\r\x03\r\x03\x0E\x03\x0E\x03\x0E\x03\x0E\x03\x0E\x03\x0E\x05\x0E" +
		"\u012C\n\x0E\x03\x0E\x03\x0E\x03\x0F\x03\x0F\x03\x0F\x03\x0F\x03\x0F\x03" +
		"\x0F\x05\x0F\u0136\n\x0F\x03\x0F\x03\x0F\x03\x10\x03\x10\x03\x10\x03\x10" +
		"\x05\x10\u013E\n\x10\x03\x10\x03\x10\x03\x11\x03\x11\x03\x11\x03\x11\x03" +
		"\x11\x03\x11\x03\x11\x03\x11\x03\x11\x03\x11\x03\x11\x03\x11\x03\x11\x03" +
		"\x11\x03\x11\x05\x11\u0151\n\x11\x03\x11\x03\x11\x03\x11\x03\x11\x03\x11" +
		"\x03\x11\x03\x11\x03\x11\x05\x11\u015B\n\x11\x03\x11\x03\x11\x03\x11\x03" +
		"\x11\x03\x11\x03\x11\x03\x11\x03\x11\x03\x11\x05\x11\u0166\n\x11\x03\x11" +
		"\x03\x11\x03\x11\x03\x11\x03\x11\x03\x11\x03\x11\x03\x11\x03\x11\x03\x11" +
		"\x03\x11\x03\x11\x05\x11\u0174\n\x11\x03\x12\x03\x12\x03\x12\x03\x12\x03" +
		"\x12\x03\x12\x03\x12\x03\x12\x03\x12\x03\x12\x03\x13\x03\x13\x03\x13\x03" +
		"\x13\x03\x13\x03\x13\x03\x13\x03\x13\x03\x14\x03\x14\x03\x14\x03\x14\x03" +
		"\x14\x03\x14\x03\x14\x03\x14\x03\x14\x03\x14\x03\x15\x03\x15\x03\x15\x03" +
		"\x15\x03\x15\x03\x15\x03\x15\x03\x15\x03\x16\x03\x16\x03\x16\x03\x16\x03" +
		"\x16\x03\x16\x03\x16\x03\x16\x03\x16\x03\x16\x03\x16\x03\x16\x05\x16\u01A6" +
		"\n\x16\x03\x16\x03\x16\x03\x17\x03\x17\x03\x18\x03\x18\x03\x18\x03\x18" +
		"\x03\x18\x03\x18\x03\x18\x03\x18\x03\x18\x07\x18\u01B5\n\x18\f\x18\x0E" +
		"\x18\u01B8\v\x18\x03\x19\x03\x19\x03\x19\x05\x19\u01BD\n\x19\x03\x19\x03" +
		"\x19\x03\x19\x03\x19\x03\x19\x03\x19\x07\x19\u01C5\n\x19\f\x19\x0E\x19" +
		"\u01C8\v\x19\x03\x1A\x03\x1A\x06\x1A\u01CC\n\x1A\r\x1A\x0E\x1A\u01CD\x03" +
		"\x1B\x03\x1B\x03\x1B\x03\x1B\x03\x1B\x05\x1B\u01D5\n\x1B\x03\x1C\x03\x1C" +
		"\x03\x1C\x03\x1C\x03\x1C\x05\x1C\u01DC\n\x1C\x03\x1D\x03\x1D\x03\x1D\x03" +
		"\x1D\x03\x1D\x03\x1D\x03\x1D\x03\x1D\x03\x1D\x03\x1D\x03\x1D\x03\x1D\x03" +
		"\x1D\x03\x1D\x03\x1D\x03\x1D\x03\x1D\x03\x1D\x05\x1D\u01F0\n\x1D\x03\x1E" +
		"\x03\x1E\x03\x1E\x03\x1E\x03\x1E\x03\x1F\x03\x1F\x03\x1F\x03\x1F\x03\x1F" +
		"\x03 \x03 \x03 \x03 \x03 \x03!\x03!\x03!\x03!\x03!\x03\"\x03\"\x03\"\x03" +
		"\"\x03\"\x03\"\x03\"\x03\"\x03#\x03#\x03#\x03#\x03#\x03$\x03$\x03$\x03" +
		"$\x03$\x03%\x03%\x03%\x03%\x03%\x03&\x03&\x03&\x03&\x03&\x03\'\x03\'\x03" +
		"\'\x03\'\x03\'\x03(\x03(\x05(\u0229\n(\x03)\x03)\x03)\x03)\x03)\x03)\x03" +
		")\x03)\x03)\x03)\x03)\x05)\u0236\n)\x03)\x03)\x03)\x03)\x03)\x03)\x03" +
		")\x03)\x03)\x03)\x03)\x03)\x03)\x03)\x05)\u0246\n)\x03)\x03)\x03)\x03" +
		")\x03)\x03)\x03)\x03)\x03)\x03)\x03)\x05)\u0253\n)\x03)\x03)\x05)\u0257" +
		"\n)\x05)\u0259\n)\x03*\x03*\x05*\u025D\n*\x03+\x03+\x05+\u0261\n+\x03" +
		",\x03,\x05,\u0265\n,\x03-\x03-\x05-\u0269\n-\x03.\x03.\x05.\u026D\n.\x03" +
		"/\x03/\x05/\u0271\n/\x030\x030\x050\u0275\n0\x031\x031\x051\u0279\n1\x03" +
		"2\x032\x052\u027D\n2\x033\x033\x033\x033\x033\x033\x033\x033\x033\x03" +
		"3\x033\x053\u028A\n3\x034\x034\x034\x034\x035\x035\x035\x035\x035\x03" +
		"5\x035\x035\x035\x075\u0299\n5\f5\x0E5\u029C\v5\x036\x036\x036\x056\u02A1" +
		"\n6\x036\x036\x036\x036\x036\x036\x076\u02A9\n6\f6\x0E6\u02AC\v6\x037" +
		"\x037\x067\u02B0\n7\r7\x0E7\u02B1\x038\x038\x038\x038\x038\x058\u02B9" +
		"\n8\x039\x039\x039\x039\x039\x059\u02C0\n9\x03:\x03:\x03:\x03:\x03:\x03" +
		":\x03:\x03:\x03:\x03:\x03:\x03:\x03:\x03:\x03:\x03:\x03:\x03:\x03:\x05" +
		":\u02D5\n:\x03:\x02\x02\x06.0hj;\x02\x02\x04\x02\x06\x02\b\x02\n\x02\f" +
		"\x02\x0E\x02\x10\x02\x12\x02\x14\x02\x16\x02\x18\x02\x1A\x02\x1C\x02\x1E" +
		"\x02 \x02\"\x02$\x02&\x02(\x02*\x02,\x02.\x020\x022\x024\x026\x028\x02" +
		":\x02<\x02>\x02@\x02B\x02D\x02F\x02H\x02J\x02L\x02N\x02P\x02R\x02T\x02" +
		"V\x02X\x02Z\x02\\\x02^\x02`\x02b\x02d\x02f\x02h\x02j\x02l\x02n\x02p\x02" +
		"r\x02\x02\x03\x03\x02-.\x02\u031B\x02t\x03\x02\x02\x02\x04\x7F\x03\x02" +
		"\x02\x02\x06\x8D\x03\x02\x02\x02\b\x90\x03\x02\x02\x02\n\x9B\x03\x02\x02" +
		"\x02\f\xA5\x03\x02\x02\x02\x0E\xC2\x03\x02\x02\x02\x10\xD4\x03\x02\x02" +
		"\x02\x12\xF2\x03\x02\x02\x02\x14\xFD\x03\x02\x02\x02\x16\u0107\x03\x02" +
		"\x02\x02\x18\u0109\x03\x02\x02\x02\x1A\u0125\x03\x02\x02\x02\x1C\u012F" +
		"\x03\x02\x02\x02\x1E\u0139\x03\x02\x02\x02 \u0173\x03\x02\x02\x02\"\u0175" +
		"\x03\x02\x02\x02$\u017F\x03\x02\x02\x02&\u0187\x03\x02\x02\x02(\u0191" +
		"\x03\x02\x02\x02*\u0199\x03\x02\x02\x02,\u01A9\x03\x02\x02\x02.\u01AB" +
		"\x03\x02\x02\x020\u01BC\x03\x02\x02\x022\u01C9\x03\x02\x02\x024\u01D4" +
		"\x03\x02\x02\x026\u01DB\x03\x02\x02\x028\u01EF\x03\x02\x02\x02:\u01F1" +
		"\x03\x02\x02\x02<\u01F6\x03\x02\x02\x02>\u01FB\x03\x02\x02\x02@\u0200" +
		"\x03\x02\x02\x02B\u0205\x03\x02\x02\x02D\u020D\x03\x02\x02\x02F\u0212" +
		"\x03\x02\x02\x02H\u0217\x03\x02\x02\x02J\u021C\x03\x02\x02\x02L\u0221" +
		"\x03\x02\x02\x02N\u0228\x03\x02\x02\x02P\u0258\x03\x02\x02\x02R\u025C" +
		"\x03\x02\x02\x02T\u0260\x03\x02\x02\x02V\u0264\x03\x02\x02\x02X\u0268" +
		"\x03\x02\x02\x02Z\u026C\x03\x02\x02\x02\\\u0270\x03\x02\x02\x02^\u0274" +
		"\x03\x02\x02\x02`\u0278\x03\x02\x02\x02b\u027C\x03\x02\x02\x02d\u0289" +
		"\x03\x02\x02\x02f\u028B\x03\x02\x02\x02h\u028F\x03\x02\x02\x02j\u02A0" +
		"\x03\x02\x02\x02l\u02AD\x03\x02\x02\x02n\u02B8\x03\x02\x02\x02p\u02BF" +
		"\x03\x02\x02\x02r\u02D4\x03\x02\x02\x02tu\x05\x04\x03\x02uv\x07\x02\x02" +
		"\x03v\x03\x03\x02\x02\x02w\x80\x05\x06\x04\x02x\x80\x05f4\x02y\x80\x05" +
		"N(\x02z\x80\x05P)\x02{\x80\x05R*\x02|\x80\x05T+\x02}\x80\x05,\x17\x02" +
		"~\x80\x05V,\x02\x7Fw\x03\x02\x02\x02\x7Fx\x03\x02\x02\x02\x7Fy\x03\x02" +
		"\x02\x02\x7Fz\x03\x02\x02\x02\x7F{\x03\x02\x02\x02\x7F|\x03\x02\x02\x02" +
		"\x7F}\x03\x02\x02\x02\x7F~\x03\x02\x02\x02\x80\x05\x03\x02\x02\x02\x81" +
		"\x8E\x05\b\x05\x02\x82\x8E\x05\n\x06\x02\x83\x8E\x05\f\x07\x02\x84\x8E" +
		"\x05\x0E\b\x02\x85\x8E\x05\x10\t\x02\x86\x8E\x05 \x11\x02\x87\x8E\x05" +
		"\x12\n\x02\x88\x8E\x05\x14\v\x02\x89\x8E\x05\x18\r\x02\x8A\x8E\x05\x1A" +
		"\x0E\x02\x8B\x8E\x05\x1C\x0F\x02\x8C\x8E\x05\x1E\x10\x02\x8D\x81\x03\x02" +
		"\x02\x02\x8D\x82\x03\x02\x02\x02\x8D\x83\x03\x02\x02\x02\x8D\x84\x03\x02" +
		"\x02\x02\x8D\x85\x03\x02\x02\x02\x8D\x86\x03\x02\x02\x02\x8D\x87\x03\x02" +
		"\x02\x02\x8D\x88\x03\x02\x02\x02\x8D\x89\x03\x02\x02\x02\x8D\x8A\x03\x02" +
		"\x02\x02\x8D\x8B\x03\x02\x02\x02\x8D\x8C\x03\x02\x02\x02\x8E\x07\x03\x02" +
		"\x02\x02\x8F\x91\x07\t\x02\x02\x90\x8F\x03\x02\x02\x02\x90\x91\x03\x02" +
		"\x02\x02\x91\x92\x03\x02\x02\x02\x92\x93\x07\'\x02\x02\x93\x94\x05,\x17" +
		"\x02\x94\x95\x07+\x02\x02\x95\x96\x05,\x17\x02\x96\x97\x07+\x02\x02\x97" +
		"\x98\x05,\x17\x02\x98\x99\x03\x02\x02\x02\x99\x9A\x07(\x02\x02\x9A\t\x03" +
		"\x02\x02\x02\x9B\x9C\x07\n\x02\x02\x9C\x9D\x07\'\x02\x02\x9D\x9E\x05N" +
		"(\x02\x9E\xA1\x07+\x02\x02\x9F\xA2\x05N(\x02\xA0\xA2\x05,\x17\x02\xA1" +
		"\x9F\x03\x02\x02\x02\xA1\xA0\x03\x02\x02\x02\xA2\xA3\x03\x02\x02\x02\xA3" +
		"\xA4\x07(\x02\x02\xA4\v\x03\x02\x02\x02\xA5\xA6\x07\v\x02\x02\xA6\xBE" +
		"\x07\'\x02\x02\xA7\xBF\x07&\x02\x02\xA8\xA9\x05N(\x02\xA9\xAC\x07+\x02" +
		"\x02\xAA\xAD\x05T+\x02\xAB\xAD\x05P)\x02\xAC\xAA\x03\x02\x02\x02\xAC\xAB" +
		"\x03\x02\x02\x02\xAD\xBF\x03\x02\x02\x02\xAE\xAF\x05P)\x02\xAF\xB0\x07" +
		"+\x02\x02\xB0\xB1\x05P)\x02\xB1\xBF\x03\x02\x02\x02\xB2\xB3\x05N(\x02" +
		"\xB3\xB4\x07+\x02\x02\xB4\xB5\x05R*\x02\xB5\xB6\x07+\x02\x02\xB6\xB7\x05" +
		"R*\x02\xB7\xBF\x03\x02\x02\x02\xB8\xB9\x05N(\x02\xB9\xBA\x07+\x02\x02" +
		"\xBA\xBB\x05N(\x02\xBB\xBC\x07+\x02\x02\xBC\xBD\x05N(\x02\xBD\xBF\x03" +
		"\x02\x02\x02\xBE\xA7\x03\x02\x02\x02\xBE\xA8\x03\x02\x02\x02\xBE\xAE\x03" +
		"\x02\x02\x02\xBE\xB2\x03\x02\x02\x02\xBE\xB8\x03\x02\x02\x02\xBF\xC0\x03" +
		"\x02\x02\x02\xC0\xC1\x07(\x02\x02\xC1\r\x03\x02\x02\x02\xC2\xC3\x07\x04" +
		"\x02\x02\xC3\xD0\x07\'\x02\x02\xC4\xC5\x05N(\x02\xC5\xC6\x07+\x02\x02" +
		"\xC6\xC7\x05N(\x02\xC7\xD1\x03\x02\x02\x02\xC8\xC9\x05N(\x02\xC9\xCA\x07" +
		"+\x02\x02\xCA\xCB\x05P)\x02\xCB\xD1\x03\x02\x02\x02\xCC\xCD\x05N(\x02" +
		"\xCD\xCE\x07+\x02\x02\xCE\xCF\x05R*\x02\xCF\xD1\x03\x02\x02\x02\xD0\xC4" +
		"\x03\x02\x02\x02\xD0\xC8\x03\x02\x02\x02\xD0\xCC\x03\x02\x02\x02\xD1\xD2" +
		"\x03\x02\x02\x02\xD2\xD3\x07(\x02\x02\xD3\x0F\x03\x02\x02\x02\xD4\xD5" +
		"\x07\r\x02\x02\xD5\xEE\x07\'\x02\x02\xD6\xEF\x05R*\x02\xD7\xEF\x05N(\x02" +
		"\xD8\xD9\x05R*\x02\xD9\xDA\x07+\x02\x02\xDA\xDB\x05R*\x02\xDB\xEF\x03" +
		"\x02\x02\x02\xDC\xDD\x05P)\x02\xDD\xDE\x07+\x02\x02\xDE\xDF\x05P)\x02" +
		"\xDF\xEF\x03\x02\x02\x02\xE0\xE1\x05P)\x02\xE1\xE2\x07+\x02\x02\xE2\xE3" +
		"\x05T+\x02\xE3\xEF\x03\x02\x02\x02\xE4\xE5\x05T+\x02\xE5\xE6\x07+\x02" +
		"\x02\xE6\xE7\x05T+\x02\xE7\xEF\x03\x02\x02\x02\xE8\xE9\x05N(\x02\xE9\xEA" +
		"\x07+\x02\x02\xEA\xEB\x05N(\x02\xEB\xEC\x07+\x02\x02\xEC\xED\x05N(\x02" +
		"\xED\xEF\x03\x02\x02\x02\xEE\xD6\x03\x02\x02\x02\xEE\xD7\x03\x02\x02\x02" +
		"\xEE\xD8\x03\x02\x02\x02\xEE\xDC\x03\x02\x02\x02\xEE\xE0\x03\x02\x02\x02" +
		"\xEE\xE4\x03\x02\x02\x02\xEE\xE8\x03\x02\x02\x02\xEF\xF0\x03\x02\x02\x02" +
		"\xF0\xF1\x07(\x02\x02\xF1\x11\x03\x02\x02\x02\xF2\xF3\x07\x05\x02\x02" +
		"\xF3\xF9\x07\'\x02\x02\xF4\xFA\x05N(\x02\xF5\xF6\x05N(\x02\xF6\xF7\x07" +
		"+\x02\x02\xF7\xF8\x05N(\x02\xF8\xFA\x03\x02\x02\x02\xF9\xF4\x03\x02\x02" +
		"\x02\xF9\xF5\x03\x02\x02\x02\xFA\xFB\x03\x02\x02\x02\xFB\xFC\x07(\x02" +
		"\x02\xFC\x13\x03\x02\x02\x02\xFD\xFE\x07\b\x02\x02\xFE\xFF\x07\'\x02\x02" +
		"\xFF\u0100\x05\x16\f\x02\u0100\u0101\x07(\x02\x02\u0101\x15\x03\x02\x02" +
		"\x02\u0102\u0103\x05N(\x02\u0103\u0104\x07+\x02\x02\u0104\u0105\x05\x16" +
		"\f\x02\u0105\u0108\x03\x02\x02\x02\u0106\u0108\x05N(\x02\u0107\u0102\x03" +
		"\x02\x02\x02\u0107\u0106\x03\x02\x02\x02\u0108\x17\x03\x02\x02\x02\u0109" +
		"\u010A\x07\x03\x02\x02\u010A\u0121\x07\'\x02\x02\u010B\u010C\x05N(\x02" +
		"\u010C\u010D\x07+\x02\x02\u010D\u010E\x05,\x17\x02\u010E\u0122\x03\x02" +
		"\x02\x02\u010F\u0110\x05N(\x02\u0110\u0111\x07+\x02\x02\u0111\u0112\x05" +
		"N(\x02\u0112\u0113\x07+\x02\x02\u0113\u0114\x05N(\x02\u0114\u0122\x03" +
		"\x02\x02\x02\u0115\u0116\x05N(\x02\u0116\u0117\x07+\x02\x02\u0117\u0118" +
		"\x05,\x17\x02\u0118\u0119\x07+\x02\x02\u0119\u011A\x05V,\x02\u011A\u0122" +
		"\x03\x02\x02\x02\u011B\u011C\x05N(\x02\u011C\u011D\x07+\x02\x02\u011D" +
		"\u011E\x05N(\x02\u011E\u011F\x07+\x02\x02\u011F\u0120\x05V,\x02\u0120" +
		"\u0122\x03\x02\x02\x02\u0121\u010B\x03\x02\x02\x02\u0121\u010F\x03\x02" +
		"\x02\x02\u0121\u0115\x03\x02\x02\x02\u0121\u011B\x03\x02\x02\x02\u0122" +
		"\u0123\x03\x02\x02\x02\u0123\u0124\x07(\x02\x02\u0124\x19\x03\x02\x02" +
		"\x02\u0125\u0126\x07\x06\x02\x02\u0126\u0127\x07\'\x02\x02\u0127\u0128" +
		"\x05N(\x02\u0128\u012B\x07+\x02\x02\u0129\u012C\x05N(\x02\u012A\u012C" +
		"\x05,\x17\x02\u012B\u0129\x03\x02\x02\x02\u012B\u012A\x03\x02\x02\x02" +
		"\u012C\u012D\x03\x02\x02\x02\u012D\u012E\x07(\x02\x02\u012E\x1B\x03\x02" +
		"\x02\x02\u012F\u0130\x07\x07\x02\x02\u0130\u0131\x07\'\x02\x02\u0131\u0132" +
		"\x05N(\x02\u0132\u0135\x07+\x02\x02\u0133\u0136\x05N(\x02\u0134\u0136" +
		"\x05R*\x02\u0135\u0133\x03\x02\x02\x02\u0135\u0134\x03\x02\x02\x02\u0136" +
		"\u0137\x03\x02\x02\x02\u0137\u0138\x07(\x02\x02\u0138\x1D\x03\x02\x02" +
		"\x02\u0139\u013A\x07\f\x02\x02\u013A\u013D\x07\'\x02\x02\u013B\u013E\x05" +
		"\x04\x03\x02\u013C\u013E\x05\x04\x03\x02\u013D\u013B\x03\x02\x02\x02\u013D" +
		"\u013C\x03\x02\x02\x02\u013E\u013F\x03\x02\x02\x02\u013F\u0140\x07(\x02" +
		"\x02\u0140\x1F\x03\x02\x02\x02\u0141\u0142\x07\x0E\x02\x02\u0142\u0143" +
		"\x07\'\x02\x02\u0143\u0144\x05N(\x02\u0144\u0145\x07+\x02\x02\u0145\u0146" +
		"\x05R*\x02\u0146\u0147\x03\x02\x02\x02\u0147\u0148\x07(\x02\x02\u0148" +
		"\u0174\x03\x02\x02\x02\u0149\u014A\x07\x0F\x02\x02\u014A\u014B\x07\'\x02" +
		"\x02\u014B\u014C\x05d3\x02\u014C\u014D\x07+\x02\x02\u014D\u0150\x05,\x17" +
		"\x02\u014E\u014F\x07+\x02\x02\u014F\u0151\x05d3\x02\u0150\u014E\x03\x02" +
		"\x02\x02\u0150\u0151\x03\x02\x02\x02\u0151\u0152\x03\x02\x02\x02\u0152" +
		"\u0153\x07(\x02\x02\u0153\u0174\x03\x02\x02\x02\u0154\u0155\x07\x10\x02" +
		"\x02\u0155\u0156\x07\'\x02\x02\u0156\u0157\x05N(\x02\u0157\u015A\x07+" +
		"\x02\x02\u0158\u015B\x05T+\x02\u0159\u015B\x05P)\x02\u015A\u0158\x03\x02" +
		"\x02\x02\u015A\u0159\x03\x02\x02\x02\u015B\u015C\x03\x02\x02\x02\u015C" +
		"\u015D\x07(\x02\x02\u015D\u0174\x03\x02\x02\x02\u015E\u015F\x07\x11\x02" +
		"\x02\u015F\u0160\x07\'\x02\x02\u0160\u0161\x05N(\x02\u0161\u0165\x07+" +
		"\x02\x02\u0162\u0166\x05T+\x02\u0163\u0166\x05P)\x02\u0164\u0166\x05N" +
		"(\x02\u0165\u0162\x03\x02\x02\x02\u0165\u0163\x03\x02\x02\x02\u0165\u0164" +
		"\x03\x02\x02\x02\u0166\u0167\x03\x02\x02\x02\u0167\u0168\x07(\x02\x02" +
		"\u0168\u0174\x03\x02\x02\x02\u0169\u016A\x07\x12\x02\x02\u016A\u016B\x07" +
		"\'\x02\x02\u016B\u016C\x05d3\x02\u016C\u016D\x07+\x02\x02\u016D\u016E" +
		"\x05,\x17\x02\u016E\u016F\x07+\x02\x02\u016F\u0170\x05N(\x02\u0170\u0171" +
		"\x03\x02\x02\x02\u0171\u0172\x07(\x02\x02\u0172\u0174\x03\x02\x02\x02" +
		"\u0173\u0141\x03\x02\x02\x02\u0173\u0149\x03\x02\x02\x02\u0173\u0154\x03" +
		"\x02\x02\x02\u0173\u015E\x03\x02\x02\x02\u0173\u0169\x03\x02\x02\x02\u0174" +
		"!\x03\x02\x02\x02\u0175\u0176\x07\x13\x02\x02\u0176\u0177\x07\'\x02\x02" +
		"\u0177\u0178\x05N(\x02\u0178\u0179\x07+\x02\x02\u0179\u017A\x05N(\x02" +
		"\u017A\u017B\x07+\x02\x02\u017B\u017C\x05,\x17\x02\u017C\u017D\x03\x02" +
		"\x02\x02\u017D\u017E\x07(\x02\x02\u017E#\x03\x02\x02\x02\u017F\u0180\x07" +
		"\x14\x02\x02\u0180\u0181\x07\'\x02\x02\u0181\u0182\x05X-\x02\u0182\u0183" +
		"\x07+\x02\x02\u0183\u0184\x05N(\x02\u0184\u0185\x03\x02\x02\x02\u0185" +
		"\u0186\x07(\x02\x02\u0186%\x03\x02\x02\x02\u0187\u0188\x07\x18\x02\x02" +
		"\u0188\u0189\x07\'\x02\x02\u0189\u018A\x05N(\x02\u018A\u018B\x07+\x02" +
		"\x02\u018B\u018C\x05,\x17\x02\u018C\u018D\x07+\x02\x02\u018D\u018E\x05" +
		"N(\x02\u018E\u018F\x03\x02\x02\x02\u018F\u0190\x07(\x02\x02\u0190\'\x03" +
		"\x02\x02\x02\u0191\u0192\x07\x15\x02\x02\u0192\u0193\x07\'\x02\x02\u0193" +
		"\u0194\x05X-\x02\u0194\u0195\x07+\x02\x02\u0195\u0196\x05V,\x02\u0196" +
		"\u0197\x03\x02\x02\x02\u0197\u0198\x07(\x02\x02\u0198)\x03\x02\x02\x02" +
		"\u0199\u019A\x07\x17\x02\x02\u019A\u019B\x07\'\x02\x02\u019B\u019C\x05" +
		"N(\x02\u019C\u019D\x07+\x02\x02\u019D\u01A5\x05,\x17\x02\u019E\u019F\x07" +
		"+\x02\x02\u019F\u01A0\x05,\x17\x02\u01A0\u01A1\x07+\x02\x02\u01A1\u01A2" +
		"\x05,\x17\x02\u01A2\u01A3\x07+\x02\x02\u01A3\u01A4\x05,\x17\x02\u01A4" +
		"\u01A6\x03\x02\x02\x02\u01A5\u019E\x03\x02\x02\x02\u01A5\u01A6\x03\x02" +
		"\x02\x02\u01A6\u01A7\x03\x02\x02\x02\u01A7\u01A8\x07(\x02\x02\u01A8+\x03" +
		"\x02\x02\x02\u01A9\u01AA\x05.\x18\x02\u01AA-\x03\x02\x02\x02\u01AB\u01AC" +
		"\b\x18\x01\x02\u01AC\u01AD\x050\x19\x02\u01AD\u01B6\x03\x02\x02\x02\u01AE" +
		"\u01AF\f\x05\x02\x02\u01AF\u01B0\x07-\x02\x02\u01B0\u01B5\x050\x19\x02" +
		"\u01B1\u01B2\f\x04\x02\x02\u01B2\u01B3\x07.\x02\x02\u01B3\u01B5\x050\x19" +
		"\x02\u01B4\u01AE\x03\x02\x02\x02\u01B4\u01B1\x03\x02\x02\x02\u01B5\u01B8" +
		"\x03\x02\x02\x02\u01B6\u01B4\x03\x02\x02\x02\u01B6\u01B7\x03\x02\x02\x02" +
		"\u01B7/\x03\x02\x02\x02\u01B8\u01B6\x03\x02\x02\x02\u01B9\u01BA\b\x19" +
		"\x01\x02\u01BA\u01BD\x052\x1A\x02\u01BB\u01BD\x054\x1B\x02\u01BC\u01B9" +
		"\x03\x02\x02\x02\u01BC\u01BB\x03\x02\x02\x02\u01BD\u01C6\x03\x02\x02\x02" +
		"\u01BE\u01BF\f\x06\x02\x02\u01BF\u01C0\x07/\x02\x02\u01C0\u01C5\x054\x1B" +
		"\x02\u01C1\u01C2\f\x05\x02\x02\u01C2\u01C3\x07,\x02\x02\u01C3\u01C5\x05" +
		"4\x1B\x02\u01C4\u01BE\x03\x02\x02\x02\u01C4\u01C1\x03\x02\x02\x02\u01C5" +
		"\u01C8\x03\x02\x02\x02\u01C6\u01C4\x03\x02\x02\x02\u01C6\u01C7\x03\x02" +
		"\x02\x02\u01C71\x03\x02\x02\x02\u01C8\u01C6\x03\x02\x02\x02\u01C9\u01CB" +
		"\x058\x1D\x02\u01CA\u01CC\x058\x1D\x02\u01CB\u01CA\x03\x02\x02\x02\u01CC" +
		"\u01CD\x03\x02\x02\x02\u01CD\u01CB\x03\x02\x02\x02\u01CD\u01CE\x03\x02" +
		"\x02\x02\u01CE3\x03\x02\x02\x02\u01CF\u01D0\x056\x1C\x02\u01D0\u01D1\x07" +
		"0\x02\x02\u01D1\u01D2\x054\x1B\x02\u01D2\u01D5\x03\x02\x02\x02\u01D3\u01D5" +
		"\x056\x1C\x02\u01D4\u01CF\x03\x02\x02\x02\u01D4\u01D3\x03\x02\x02\x02" +
		"\u01D55\x03\x02\x02\x02\u01D6\u01D7\x07.\x02\x02\u01D7\u01DC\x056\x1C" +
		"\x02\u01D8\u01D9\x07-\x02\x02\u01D9\u01DC\x056\x1C\x02\u01DA\u01DC\x05" +
		"8\x1D\x02\u01DB\u01D6\x03\x02\x02\x02\u01DB\u01D8\x03\x02\x02\x02\u01DB" +
		"\u01DA\x03\x02\x02\x02\u01DC7\x03\x02\x02\x02\u01DD\u01F0\x072\x02\x02" +
		"\u01DE\u01F0\x073\x02\x02\u01DF\u01F0\x07#\x02\x02\u01E0\u01F0\x07$\x02" +
		"\x02\u01E1\u01E2\x07\'\x02\x02\u01E2\u01E3\x05,\x17\x02\u01E3\u01E4\x07" +
		"(\x02\x02\u01E4\u01F0\x03\x02\x02\x02\u01E5\u01F0\x05:\x1E\x02\u01E6\u01F0" +
		"\x05<\x1F\x02\u01E7\u01F0\x05> \x02\u01E8\u01F0\x05@!\x02\u01E9\u01F0" +
		"\x05B\"\x02\u01EA\u01F0\x05D#\x02\u01EB\u01F0\x05L\'\x02\u01EC\u01F0\x05" +
		"J&\x02\u01ED\u01F0\x05H%\x02\u01EE\u01F0\x05F$\x02\u01EF\u01DD\x03\x02" +
		"\x02\x02\u01EF\u01DE\x03\x02\x02\x02\u01EF\u01DF\x03\x02\x02\x02\u01EF" +
		"\u01E0\x03\x02\x02\x02\u01EF\u01E1\x03\x02\x02\x02\u01EF\u01E5\x03\x02" +
		"\x02\x02\u01EF\u01E6\x03\x02\x02\x02\u01EF\u01E7\x03\x02\x02\x02\u01EF" +
		"\u01E8\x03\x02\x02\x02\u01EF\u01E9\x03\x02\x02\x02\u01EF\u01EA\x03\x02" +
		"\x02\x02\u01EF\u01EB\x03\x02\x02\x02\u01EF\u01EC\x03\x02\x02\x02\u01EF" +
		"\u01ED\x03\x02\x02\x02\u01EF\u01EE\x03\x02\x02\x02\u01F09\x03\x02\x02" +
		"\x02\u01F1\u01F2\x07\x19\x02\x02\u01F2\u01F3\x07\'\x02\x02\u01F3\u01F4" +
		"\x05,\x17\x02\u01F4\u01F5\x07(\x02\x02\u01F5;\x03\x02\x02\x02\u01F6\u01F7" +
		"\x07\x1A\x02\x02\u01F7\u01F8\x07\'\x02\x02\u01F8\u01F9\x05,\x17\x02\u01F9" +
		"\u01FA\x07(\x02\x02\u01FA=\x03\x02\x02\x02\u01FB\u01FC\x07\x1B\x02\x02" +
		"\u01FC\u01FD\x07\'\x02\x02\u01FD\u01FE\x05,\x17\x02\u01FE\u01FF\x07(\x02" +
		"\x02\u01FF?\x03\x02\x02\x02\u0200\u0201\x07\x1C\x02\x02\u0201\u0202\x07" +
		"\'\x02\x02\u0202\u0203\x05,\x17\x02\u0203\u0204\x07(\x02\x02\u0204A\x03" +
		"\x02\x02\x02\u0205\u0206\x07\x1D\x02\x02\u0206\u0207\x07\'\x02\x02\u0207" +
		"\u0208\x05,\x17\x02\u0208\u0209\x07+\x02\x02\u0209\u020A\x05,\x17\x02" +
		"\u020A\u020B\x03\x02\x02\x02\u020B\u020C\x07(\x02\x02\u020CC\x03\x02\x02" +
		"\x02\u020D\u020E\x07\x1E\x02\x02\u020E\u020F\x07\'\x02\x02\u020F\u0210" +
		"\x05,\x17\x02\u0210\u0211\x07(\x02\x02\u0211E\x03\x02\x02\x02\u0212\u0213" +
		"\x07!\x02\x02\u0213\u0214\x07\'\x02\x02\u0214\u0215\x05,\x17\x02\u0215" +
		"\u0216\x07(\x02\x02\u0216G\x03\x02\x02\x02\u0217\u0218\x07 \x02\x02\u0218" +
		"\u0219\x07\'\x02\x02\u0219\u021A\x05,\x17\x02\u021A\u021B\x07(\x02\x02" +
		"\u021BI\x03\x02\x02\x02\u021C\u021D\x07\"\x02\x02\u021D\u021E\x07\'\x02" +
		"\x02\u021E\u021F\x05,\x17\x02\u021F\u0220\x07(\x02\x02\u0220K\x03\x02" +
		"\x02";
	private static readonly _serializedATNSegment1: string =
		"\x02\u0221\u0222\x07\x1F\x02\x02\u0222\u0223\x07\'\x02\x02\u0223\u0224" +
		"\x05,\x17\x02\u0224\u0225\x07(\x02\x02\u0225M\x03\x02\x02\x02\u0226\u0229" +
		"\x07%\x02\x02\u0227\u0229\x05\b\x05\x02\u0228\u0226\x03\x02\x02\x02\u0228" +
		"\u0227\x03\x02\x02\x02\u0229O\x03\x02\x02\x02\u022A\u0259\x05\x0E\b\x02" +
		"\u022B\u0259\x07&\x02\x02\u022C\u0236\x05N(\x02\u022D\u0236\x05\x12\n" +
		"\x02\u022E\u022F\x07\'\x02\x02\u022F\u0230\x05,\x17\x02\u0230\u0231\x07" +
		"+\x02\x02\u0231\u0232\x05,\x17\x02\u0232\u0233\x07+\x02\x02\u0233\u0234" +
		"\x05,\x17\x02\u0234\u0236\x03\x02\x02\x02\u0235\u022C\x03\x02\x02\x02" +
		"\u0235\u022D\x03\x02\x02\x02\u0235\u022E\x03\x02\x02\x02\u0236\u0237\x03" +
		"\x02\x02\x02\u0237\u0238\t\x02\x02\x02\u0238\u0239\x07&\x02\x02\u0239" +
		"\u0245\x07/\x02\x02\u023A\u0246\x05\x12\n\x02\u023B\u0246\x07&\x02\x02" +
		"\u023C\u023D\x07\'\x02\x02\u023D\u023E\x05,\x17\x02\u023E\u023F\x07+\x02" +
		"\x02\u023F\u0240\x05,\x17\x02\u0240\u0241\x07+\x02\x02\u0241\u0242\x05" +
		",\x17\x02\u0242\u0243\x03\x02\x02\x02\u0243\u0244\x07(\x02\x02\u0244\u0246" +
		"\x03\x02\x02\x02\u0245\u023A\x03\x02\x02\x02\u0245\u023B\x03\x02\x02\x02" +
		"\u0245\u023C\x03\x02\x02\x02\u0246\u0257\x03\x02\x02\x02\u0247\u0253\x05" +
		"\x12\n\x02\u0248\u0253\x07&\x02\x02\u0249\u024A\x07\'\x02\x02\u024A\u024B" +
		"\x05,\x17\x02\u024B\u024C\x07+\x02\x02\u024C\u024D\x05,\x17\x02\u024D" +
		"\u024E\x07+\x02\x02\u024E\u024F\x05,\x17\x02\u024F\u0250\x03\x02\x02\x02" +
		"\u0250\u0251\x07(\x02\x02\u0251\u0253\x03\x02\x02\x02\u0252\u0247\x03" +
		"\x02\x02\x02\u0252\u0248\x03\x02\x02\x02\u0252\u0249\x03\x02\x02\x02\u0253" +
		"\u0254\x03\x02\x02\x02\u0254\u0255\x07/\x02\x02\u0255\u0257\x07&\x02\x02" +
		"\u0256\u0235\x03\x02\x02\x02\u0256\u0252\x03\x02\x02\x02\u0257\u0259\x03" +
		"\x02\x02\x02\u0258\u022A\x03\x02\x02\x02\u0258\u022B\x03\x02\x02\x02\u0258" +
		"\u0256\x03\x02\x02\x02\u0259Q\x03\x02\x02\x02\u025A\u025D\x05\x12\n\x02" +
		"\u025B\u025D\x07&\x02\x02\u025C\u025A\x03\x02\x02\x02\u025C\u025B\x03" +
		"\x02\x02\x02\u025DS\x03\x02\x02\x02\u025E\u0261\x05\f\x07\x02\u025F\u0261" +
		"\x07&\x02\x02\u0260\u025E\x03\x02\x02\x02\u0260\u025F\x03\x02\x02\x02" +
		"\u0261U\x03\x02\x02\x02\u0262\u0265\x07&\x02\x02\u0263\u0265\x05\x12\n" +
		"\x02\u0264\u0262\x03\x02\x02\x02\u0264\u0263\x03\x02\x02\x02\u0265W\x03" +
		"\x02\x02\x02\u0266\u0269\x07&\x02\x02\u0267\u0269\x05\x14\v\x02\u0268" +
		"\u0266\x03\x02\x02\x02\u0268\u0267\x03\x02\x02\x02\u0269Y\x03\x02\x02" +
		"\x02\u026A\u026D\x07&\x02\x02\u026B\u026D\x05*\x16\x02\u026C\u026A\x03" +
		"\x02\x02\x02\u026C\u026B\x03\x02\x02\x02\u026D[\x03\x02\x02\x02\u026E" +
		"\u0271\x07&\x02\x02\u026F\u0271\x05$\x13\x02\u0270\u026E\x03\x02\x02\x02" +
		"\u0270\u026F\x03\x02\x02\x02\u0271]\x03\x02\x02\x02\u0272\u0275\x07&\x02" +
		"\x02\u0273\u0275\x05\"\x12\x02\u0274\u0272\x03\x02\x02\x02\u0274\u0273" +
		"\x03\x02\x02\x02\u0275_\x03\x02\x02\x02\u0276\u0279\x07&\x02\x02\u0277" +
		"\u0279\x05&\x14\x02\u0278\u0276\x03\x02\x02\x02\u0278\u0277\x03\x02\x02" +
		"\x02\u0279a\x03\x02\x02\x02\u027A\u027D\x07&\x02\x02\u027B\u027D\x05(" +
		"\x15\x02\u027C\u027A\x03\x02\x02\x02\u027C\u027B\x03\x02\x02\x02\u027D" +
		"c\x03\x02\x02\x02\u027E\u028A\x05N(\x02\u027F\u028A\x05P)\x02\u0280\u028A" +
		"\x05R*\x02\u0281\u028A\x05X-\x02\u0282\u028A\x05T+\x02\u0283\u028A\x05" +
		"V,\x02\u0284\u028A\x05Z.\x02\u0285\u028A\x05\\/\x02\u0286\u028A\x05^0" +
		"\x02\u0287\u028A\x05`1\x02\u0288\u028A\x05b2\x02\u0289\u027E\x03\x02\x02" +
		"\x02\u0289\u027F\x03\x02\x02\x02\u0289\u0280\x03\x02\x02\x02\u0289\u0281" +
		"\x03\x02\x02\x02\u0289\u0282\x03\x02\x02\x02\u0289\u0283\x03\x02\x02\x02" +
		"\u0289\u0284\x03\x02\x02\x02\u0289\u0285\x03\x02\x02\x02\u0289\u0286\x03" +
		"\x02\x02\x02\u0289\u0287\x03\x02\x02\x02\u0289\u0288\x03\x02\x02\x02\u028A" +
		"e\x03\x02\x02\x02\u028B\u028C\x05h5\x02\u028C\u028D\x071\x02\x02\u028D" +
		"\u028E\x05h5\x02\u028Eg\x03\x02\x02\x02\u028F\u0290\b5\x01\x02\u0290\u0291" +
		"\x05j6\x02\u0291\u029A\x03\x02\x02\x02\u0292\u0293\f\x05\x02\x02\u0293" +
		"\u0294\x07-\x02\x02\u0294\u0299\x05j6\x02\u0295\u0296\f\x04\x02\x02\u0296" +
		"\u0297\x07.\x02\x02\u0297\u0299\x05j6\x02\u0298\u0292\x03\x02\x02\x02" +
		"\u0298\u0295\x03\x02\x02\x02\u0299\u029C\x03\x02\x02\x02\u029A\u0298\x03" +
		"\x02\x02\x02\u029A\u029B\x03\x02\x02\x02\u029Bi\x03\x02\x02\x02\u029C" +
		"\u029A\x03\x02\x02\x02\u029D\u029E\b6\x01\x02\u029E\u02A1\x05l7\x02\u029F" +
		"\u02A1\x05n8\x02\u02A0\u029D\x03\x02\x02\x02\u02A0\u029F\x03\x02\x02\x02" +
		"\u02A1\u02AA\x03\x02\x02\x02\u02A2\u02A3\f\x06\x02\x02\u02A3\u02A4\x07" +
		"/\x02\x02\u02A4\u02A9\x05n8\x02\u02A5\u02A6\f\x05\x02\x02\u02A6\u02A7" +
		"\x07,\x02\x02\u02A7\u02A9\x05n8\x02\u02A8\u02A2\x03\x02\x02\x02\u02A8" +
		"\u02A5\x03\x02\x02\x02\u02A9\u02AC\x03\x02\x02\x02\u02AA\u02A8\x03\x02" +
		"\x02\x02\u02AA\u02AB\x03\x02\x02\x02\u02ABk\x03\x02\x02\x02\u02AC\u02AA" +
		"\x03\x02\x02\x02\u02AD\u02AF\x05r:\x02\u02AE\u02B0\x05r:\x02\u02AF\u02AE" +
		"\x03\x02\x02\x02\u02B0\u02B1\x03\x02\x02\x02\u02B1\u02AF\x03\x02\x02\x02" +
		"\u02B1\u02B2\x03\x02\x02\x02\u02B2m\x03\x02\x02\x02\u02B3\u02B4\x05p9" +
		"\x02\u02B4\u02B5\x070\x02\x02\u02B5\u02B6\x05n8\x02\u02B6\u02B9\x03\x02" +
		"\x02\x02\u02B7\u02B9\x05p9\x02\u02B8\u02B3\x03\x02\x02\x02\u02B8\u02B7" +
		"\x03\x02\x02\x02\u02B9o\x03\x02\x02\x02\u02BA\u02BB\x07.\x02\x02\u02BB" +
		"\u02C0\x05p9\x02\u02BC\u02BD\x07-\x02\x02\u02BD\u02C0\x05p9\x02\u02BE" +
		"\u02C0\x05r:\x02\u02BF\u02BA\x03\x02\x02\x02\u02BF\u02BC\x03\x02\x02\x02" +
		"\u02BF\u02BE\x03\x02\x02\x02\u02C0q\x03\x02\x02\x02\u02C1\u02D5\x072\x02" +
		"\x02\u02C2\u02D5\x073\x02\x02\u02C3\u02D5\x07#\x02\x02\u02C4\u02D5\x07" +
		"$\x02\x02\u02C5\u02D5\x05d3\x02\u02C6\u02C7\x07\'\x02\x02\u02C7\u02C8" +
		"\x05h5\x02\u02C8\u02C9\x07(\x02\x02\u02C9\u02D5\x03\x02\x02\x02\u02CA" +
		"\u02D5\x05:\x1E\x02\u02CB\u02D5\x05<\x1F\x02\u02CC\u02D5\x05> \x02\u02CD" +
		"\u02D5\x05@!\x02\u02CE\u02D5\x05B\"\x02\u02CF\u02D5\x05D#\x02\u02D0\u02D5" +
		"\x05L\'\x02\u02D1\u02D5\x05J&\x02\u02D2\u02D5\x05H%\x02\u02D3\u02D5\x05" +
		"F$\x02\u02D4\u02C1\x03\x02\x02\x02\u02D4\u02C2\x03\x02\x02\x02\u02D4\u02C3" +
		"\x03\x02\x02\x02\u02D4\u02C4\x03\x02\x02\x02\u02D4\u02C5\x03\x02\x02\x02" +
		"\u02D4\u02C6\x03\x02\x02\x02\u02D4\u02CA\x03\x02\x02\x02\u02D4\u02CB\x03" +
		"\x02\x02\x02\u02D4\u02CC\x03\x02\x02\x02\u02D4\u02CD\x03\x02\x02\x02\u02D4" +
		"\u02CE\x03\x02\x02\x02\u02D4\u02CF\x03\x02\x02\x02\u02D4\u02D0\x03\x02" +
		"\x02\x02\u02D4\u02D1\x03\x02\x02\x02\u02D4\u02D2\x03\x02\x02\x02\u02D4" +
		"\u02D3\x03\x02\x02\x02\u02D5s\x03\x02\x02\x027\x7F\x8D\x90\xA1\xAC\xBE" +
		"\xD0\xEE\xF9\u0107\u0121\u012B\u0135\u013D\u0150\u015A\u0165\u0173\u01A5" +
		"\u01B4\u01B6\u01BC\u01C4\u01C6\u01CD\u01D4\u01DB\u01EF\u0228\u0235\u0245" +
		"\u0252\u0256\u0258\u025C\u0260\u0264\u0268\u026C\u0270\u0274\u0278\u027C" +
		"\u0289\u0298\u029A\u02A0\u02A8\u02AA\u02B1\u02B8\u02BF\u02D4";
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
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitProgram) {
			return visitor.visitProgram(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExprContext extends ParserRuleContext {
	public command(): CommandContext | undefined {
		return this.tryGetRuleContext(0, CommandContext);
	}
	public two_side_expr(): Two_side_exprContext | undefined {
		return this.tryGetRuleContext(0, Two_side_exprContext);
	}
	public pointExpr(): PointExprContext | undefined {
		return this.tryGetRuleContext(0, PointExprContext);
	}
	public lineExpr(): LineExprContext | undefined {
		return this.tryGetRuleContext(0, LineExprContext);
	}
	public vectorExpr(): VectorExprContext | undefined {
		return this.tryGetRuleContext(0, VectorExprContext);
	}
	public planeExpr(): PlaneExprContext | undefined {
		return this.tryGetRuleContext(0, PlaneExprContext);
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
	public get ruleIndex(): number { return MathCommandParser.RULE_expr; }
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitExpr) {
			return visitor.visitExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class CommandContext extends ParserRuleContext {
	public pointDef(): PointDefContext | undefined {
		return this.tryGetRuleContext(0, PointDefContext);
	}
	public sphereDef(): SphereDefContext | undefined {
		return this.tryGetRuleContext(0, SphereDefContext);
	}
	public planeDef(): PlaneDefContext | undefined {
		return this.tryGetRuleContext(0, PlaneDefContext);
	}
	public lineDef(): LineDefContext | undefined {
		return this.tryGetRuleContext(0, LineDefContext);
	}
	public angleDef(): AngleDefContext | undefined {
		return this.tryGetRuleContext(0, AngleDefContext);
	}
	public transformDef(): TransformDefContext | undefined {
		return this.tryGetRuleContext(0, TransformDefContext);
	}
	public vectorDef(): VectorDefContext | undefined {
		return this.tryGetRuleContext(0, VectorDefContext);
	}
	public polygonDef(): PolygonDefContext | undefined {
		return this.tryGetRuleContext(0, PolygonDefContext);
	}
	public circleDef(): CircleDefContext | undefined {
		return this.tryGetRuleContext(0, CircleDefContext);
	}
	public segmentDef(): SegmentDefContext | undefined {
		return this.tryGetRuleContext(0, SegmentDefContext);
	}
	public rayDef(): RayDefContext | undefined {
		return this.tryGetRuleContext(0, RayDefContext);
	}
	public intersectionDef(): IntersectionDefContext | undefined {
		return this.tryGetRuleContext(0, IntersectionDefContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_command; }
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitCommand) {
			return visitor.visitCommand(this);
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
	public expr(): ExprContext | undefined {
		return this.tryGetRuleContext(0, ExprContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_intersectionDef; }
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
	public vectorExpr(): VectorExprContext | undefined {
		return this.tryGetRuleContext(0, VectorExprContext);
	}
	public shapeExpr(): ShapeExprContext[];
	public shapeExpr(i: number): ShapeExprContext;
	public shapeExpr(i?: number): ShapeExprContext | ShapeExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ShapeExprContext);
		} else {
			return this.getRuleContext(i, ShapeExprContext);
		}
	}
	public numberExpr(): NumberExprContext | undefined {
		return this.tryGetRuleContext(0, NumberExprContext);
	}
	public planeExpr(): PlaneExprContext | undefined {
		return this.tryGetRuleContext(0, PlaneExprContext);
	}
	public lineExpr(): LineExprContext | undefined {
		return this.tryGetRuleContext(0, LineExprContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_transformDef; }
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
	public get ruleIndex(): number { return MathCommandParser.RULE_tetrahedronDef; }
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
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitPrismDef) {
			return visitor.visitPrismDef(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class CuboidDefContext extends ParserRuleContext {
	public CUBOID(): TerminalNode { return this.getToken(MathCommandParser.CUBOID, 0); }
	public LR(): TerminalNode { return this.getToken(MathCommandParser.LR, 0); }
	public RR(): TerminalNode { return this.getToken(MathCommandParser.RR, 0); }
	public pointExpr(): PointExprContext | undefined {
		return this.tryGetRuleContext(0, PointExprContext);
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
	public numberExpr(): NumberExprContext[];
	public numberExpr(i: number): NumberExprContext;
	public numberExpr(i?: number): NumberExprContext | NumberExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(NumberExprContext);
		} else {
			return this.getRuleContext(i, NumberExprContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_cuboidDef; }
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitCuboidDef) {
			return visitor.visitCuboidDef(this);
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
	public SHAPE_ID(): TerminalNode[];
	public SHAPE_ID(i: number): TerminalNode;
	public SHAPE_ID(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(MathCommandParser.SHAPE_ID);
		} else {
			return this.getToken(MathCommandParser.SHAPE_ID, i);
		}
	}
	public ADD(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.ADD, 0); }
	public SUB(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.SUB, 0); }
	public pointExpr(): PointExprContext | undefined {
		return this.tryGetRuleContext(0, PointExprContext);
	}
	public vectorDef(): VectorDefContext[];
	public vectorDef(i: number): VectorDefContext;
	public vectorDef(i?: number): VectorDefContext | VectorDefContext[] {
		if (i === undefined) {
			return this.getRuleContexts(VectorDefContext);
		} else {
			return this.getRuleContext(i, VectorDefContext);
		}
	}
	public LR(): TerminalNode[];
	public LR(i: number): TerminalNode;
	public LR(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(MathCommandParser.LR);
		} else {
			return this.getToken(MathCommandParser.LR, i);
		}
	}
	public MULTIPLY(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.MULTIPLY, 0); }
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
	public RR(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.RR, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_lineExpr; }
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitLineExpr) {
			return visitor.visitLineExpr(this);
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
	public vectorDef(): VectorDefContext | undefined {
		return this.tryGetRuleContext(0, VectorDefContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_directionExpr; }
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
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitPolygonExpr) {
			return visitor.visitPolygonExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class CubodeExprContext extends ParserRuleContext {
	public SHAPE_ID(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.SHAPE_ID, 0); }
	public cuboidDef(): CuboidDefContext | undefined {
		return this.tryGetRuleContext(0, CuboidDefContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_cubodeExpr; }
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitCubodeExpr) {
			return visitor.visitCubodeExpr(this);
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
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitPrismExpr) {
			return visitor.visitPrismExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ShapeExprContext extends ParserRuleContext {
	public pointExpr(): PointExprContext | undefined {
		return this.tryGetRuleContext(0, PointExprContext);
	}
	public lineExpr(): LineExprContext | undefined {
		return this.tryGetRuleContext(0, LineExprContext);
	}
	public vectorExpr(): VectorExprContext | undefined {
		return this.tryGetRuleContext(0, VectorExprContext);
	}
	public polygonExpr(): PolygonExprContext | undefined {
		return this.tryGetRuleContext(0, PolygonExprContext);
	}
	public planeExpr(): PlaneExprContext | undefined {
		return this.tryGetRuleContext(0, PlaneExprContext);
	}
	public directionExpr(): DirectionExprContext | undefined {
		return this.tryGetRuleContext(0, DirectionExprContext);
	}
	public cubodeExpr(): CubodeExprContext | undefined {
		return this.tryGetRuleContext(0, CubodeExprContext);
	}
	public tetrahedronExpr(): TetrahedronExprContext | undefined {
		return this.tryGetRuleContext(0, TetrahedronExprContext);
	}
	public cylinderExpr(): CylinderExprContext | undefined {
		return this.tryGetRuleContext(0, CylinderExprContext);
	}
	public coneExpr(): ConeExprContext | undefined {
		return this.tryGetRuleContext(0, ConeExprContext);
	}
	public prismExpr(): PrismExprContext | undefined {
		return this.tryGetRuleContext(0, PrismExprContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_shapeExpr; }
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitShapeExpr) {
			return visitor.visitShapeExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Two_side_exprContext extends ParserRuleContext {
	public varExpr(): VarExprContext[];
	public varExpr(i: number): VarExprContext;
	public varExpr(i?: number): VarExprContext | VarExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(VarExprContext);
		} else {
			return this.getRuleContext(i, VarExprContext);
		}
	}
	public EQ(): TerminalNode { return this.getToken(MathCommandParser.EQ, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_two_side_expr; }
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitTwo_side_expr) {
			return visitor.visitTwo_side_expr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VarExprContext extends ParserRuleContext {
	public varExpr(): VarExprContext | undefined {
		return this.tryGetRuleContext(0, VarExprContext);
	}
	public ADD(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.ADD, 0); }
	public varMultiplicativeExpr(): VarMultiplicativeExprContext {
		return this.getRuleContext(0, VarMultiplicativeExprContext);
	}
	public SUB(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.SUB, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_varExpr; }
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitVarExpr) {
			return visitor.visitVarExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VarMultiplicativeExprContext extends ParserRuleContext {
	public varMultiplicativeExpr(): VarMultiplicativeExprContext | undefined {
		return this.tryGetRuleContext(0, VarMultiplicativeExprContext);
	}
	public MULTIPLY(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.MULTIPLY, 0); }
	public varExponentialExpr(): VarExponentialExprContext | undefined {
		return this.tryGetRuleContext(0, VarExponentialExprContext);
	}
	public DIVIDE(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.DIVIDE, 0); }
	public varImplicitMultiplicativeExpr(): VarImplicitMultiplicativeExprContext | undefined {
		return this.tryGetRuleContext(0, VarImplicitMultiplicativeExprContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_varMultiplicativeExpr; }
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitVarMultiplicativeExpr) {
			return visitor.visitVarMultiplicativeExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VarImplicitMultiplicativeExprContext extends ParserRuleContext {
	public varPrimaryExpr(): VarPrimaryExprContext[];
	public varPrimaryExpr(i: number): VarPrimaryExprContext;
	public varPrimaryExpr(i?: number): VarPrimaryExprContext | VarPrimaryExprContext[] {
		if (i === undefined) {
			return this.getRuleContexts(VarPrimaryExprContext);
		} else {
			return this.getRuleContext(i, VarPrimaryExprContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_varImplicitMultiplicativeExpr; }
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitVarImplicitMultiplicativeExpr) {
			return visitor.visitVarImplicitMultiplicativeExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VarExponentialExprContext extends ParserRuleContext {
	public varUnaryExpr(): VarUnaryExprContext {
		return this.getRuleContext(0, VarUnaryExprContext);
	}
	public POWER(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.POWER, 0); }
	public varExponentialExpr(): VarExponentialExprContext | undefined {
		return this.tryGetRuleContext(0, VarExponentialExprContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_varExponentialExpr; }
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitVarExponentialExpr) {
			return visitor.visitVarExponentialExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VarUnaryExprContext extends ParserRuleContext {
	public SUB(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.SUB, 0); }
	public varUnaryExpr(): VarUnaryExprContext | undefined {
		return this.tryGetRuleContext(0, VarUnaryExprContext);
	}
	public ADD(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.ADD, 0); }
	public varPrimaryExpr(): VarPrimaryExprContext | undefined {
		return this.tryGetRuleContext(0, VarPrimaryExprContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return MathCommandParser.RULE_varUnaryExpr; }
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitVarUnaryExpr) {
			return visitor.visitVarUnaryExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VarPrimaryExprContext extends ParserRuleContext {
	public INT_LIT(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.INT_LIT, 0); }
	public FLOAT_LIT(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.FLOAT_LIT, 0); }
	public PI(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.PI, 0); }
	public E(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.E, 0); }
	public shapeExpr(): ShapeExprContext | undefined {
		return this.tryGetRuleContext(0, ShapeExprContext);
	}
	public LR(): TerminalNode | undefined { return this.tryGetToken(MathCommandParser.LR, 0); }
	public varExpr(): VarExprContext | undefined {
		return this.tryGetRuleContext(0, VarExprContext);
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
	public get ruleIndex(): number { return MathCommandParser.RULE_varPrimaryExpr; }
	// @Override
	public accept<Result>(visitor: MathCommandVisitor<Result>): Result {
		if (visitor.visitVarPrimaryExpr) {
			return visitor.visitVarPrimaryExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


