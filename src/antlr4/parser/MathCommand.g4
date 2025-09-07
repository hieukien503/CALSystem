grammar MathCommand;

@lexer::header {
    import { ErrorToken, UncloseString, IllegalEscape } from "./lexererr.ts";
}

program: expr EOF;
expr: command | two_side_expr | pointExpr | lineExpr | vectorExpr | planeExpr | numberExpr | directionExpr;
command: pointDef | sphereDef | planeDef | lineDef | angleDef | transformDef | vectorDef | polygonDef | circleDef | segmentDef |
        rayDef | intersectionDef;
pointDef: POINT? LR (numberExpr COMMA numberExpr COMMA numberExpr) RR;
sphereDef: SPHERE LR (pointExpr COMMA (pointExpr | numberExpr)) RR;
planeDef: PLANE LR (
            SHAPE_ID | 
            (pointExpr COMMA (planeExpr | lineExpr)) | 
            (lineExpr COMMA lineExpr) |
            (pointExpr COMMA vectorExpr COMMA vectorExpr) |
            (pointExpr COMMA pointExpr COMMA pointExpr)
        ) RR;
lineDef: LINE LR (
            (pointExpr COMMA pointExpr) |
            (pointExpr COMMA lineExpr) |
            (pointExpr COMMA vectorExpr)
        ) RR;
angleDef: ANGLE LR (
            vectorExpr |
            pointExpr |
            (vectorExpr COMMA vectorExpr) |
            (lineExpr COMMA lineExpr) |
            (lineExpr COMMA planeExpr) |
            (planeExpr COMMA planeExpr) |
            (pointExpr COMMA pointExpr COMMA pointExpr)
        ) RR;
vectorDef: VECTOR LR (pointExpr | (pointExpr COMMA pointExpr)) RR;
polygonDef: POLYGON LR pointList RR;
pointList: pointExpr COMMA pointList | pointExpr;
circleDef: CIRCLE LR (
        (pointExpr COMMA numberExpr) |
        (pointExpr COMMA pointExpr) |
        (pointExpr COMMA pointExpr COMMA pointExpr) |
        (pointExpr COMMA numberExpr COMMA directionExpr) |
        (pointExpr COMMA pointExpr COMMA directionExpr)
    ) RR;
segmentDef: SEGMENT LR (
        pointExpr COMMA (pointExpr | numberExpr)
    ) RR;
rayDef: RAY LR (
        pointExpr COMMA (pointExpr | vectorExpr)
    ) RR;
intersectionDef: INTERSECT LR (expr | expr) RR;
transformDef: (
    (TRANSLATE LR (pointExpr COMMA vectorExpr) RR) |
    (ROTATE LR (shapeExpr COMMA numberExpr (COMMA shapeExpr)?) RR) |
    (PROJECT LR (pointExpr COMMA (planeExpr | lineExpr)) RR) |
    (REFLECT LR (pointExpr COMMA (planeExpr | lineExpr | pointExpr)) RR) |
    (ENLARGE LR (shapeExpr COMMA numberExpr COMMA pointExpr) RR)
);
cylinderDef: CYLINDER LR (pointExpr COMMA pointExpr COMMA numberExpr) RR;
tetrahedronDef: TETRAHEDRON LR (polygonExpr COMMA pointExpr) RR;
coneDef: CONE LR (pointExpr COMMA numberExpr COMMA pointExpr) RR;
prismDef: PRISM LR (polygonExpr COMMA directionExpr) RR;
cuboidDef: CUBOID LR (
    pointExpr COMMA numberExpr (COMMA numberExpr COMMA numberExpr COMMA numberExpr)?
) RR;

numberExpr: additiveExpr;
additiveExpr
    : additiveExpr ADD multiplicativeExpr
    | additiveExpr SUB multiplicativeExpr
    | multiplicativeExpr
    ;

multiplicativeExpr
    : multiplicativeExpr MULTIPLY exponentialExpr
    | multiplicativeExpr DIVIDE exponentialExpr
    | implicitMultiplicativeExpr            
    | exponentialExpr
    ;

implicitMultiplicativeExpr
    : primaryExpr primaryExpr+
    ;

exponentialExpr
    : unaryExpr POWER exponentialExpr
    | unaryExpr
    ;

unaryExpr
    : SUB unaryExpr
    | ADD unaryExpr
    | primaryExpr
    ;

primaryExpr
    : INT_LIT
    | FLOAT_LIT
    | PI
    | E
    | LR numberExpr RR
    | sinExpr
    | cosExpr
    | tanExpr
    | cotExpr
    | logExpr
    | lnExpr
    | expExpr
    | absExpr
    | sqrtExpr
    | cbrtExpr
    ;

sinExpr: SIN LR numberExpr RR;
cosExpr: COS LR numberExpr RR;
tanExpr: TAN LR numberExpr RR;
cotExpr: COT LR numberExpr RR;
logExpr: LOG LR (numberExpr COMMA numberExpr) RR;
lnExpr: LN LR numberExpr RR;
cbrtExpr: CBRT LR numberExpr RR;
sqrtExpr: SQRT LR numberExpr RR;
absExpr: ABS LR numberExpr RR;
expExpr: EXP LR numberExpr RR;

pointExpr: POINT_ID | pointDef;
lineExpr: lineDef | SHAPE_ID | ((pointExpr | vectorDef | LR (numberExpr COMMA numberExpr COMMA numberExpr)) (ADD | SUB) (
    SHAPE_ID MULTIPLY (vectorDef | SHAPE_ID | LR (numberExpr COMMA numberExpr COMMA numberExpr) RR)
) | (
    (vectorDef | SHAPE_ID | LR (numberExpr COMMA numberExpr COMMA numberExpr) RR) MULTIPLY SHAPE_ID)
);
vectorExpr: vectorDef | SHAPE_ID;
planeExpr: planeDef | SHAPE_ID;
directionExpr: SHAPE_ID | vectorDef;
polygonExpr: SHAPE_ID | polygonDef;
cuboidExpr: SHAPE_ID | cuboidDef;
tetrahedronExpr: SHAPE_ID | tetrahedronDef;
cylinderExpr: SHAPE_ID | cylinderDef;
coneExpr: SHAPE_ID | coneDef;
prismExpr: SHAPE_ID | prismDef;
shapeExpr: pointExpr | lineExpr | vectorExpr | polygonExpr | planeExpr | directionExpr | cuboidExpr | tetrahedronExpr | cylinderExpr | coneExpr | prismExpr;

two_side_expr: varExpr EQ varExpr;
varExpr
    : varExpr ADD varMultiplicativeExpr
    | varExpr SUB varMultiplicativeExpr
    | varMultiplicativeExpr
    ;

varMultiplicativeExpr
    : varMultiplicativeExpr MULTIPLY varExponentialExpr
    | varMultiplicativeExpr DIVIDE varExponentialExpr
    | varImplicitMultiplicativeExpr            
    | varExponentialExpr
    ;

varImplicitMultiplicativeExpr
    : varPrimaryExpr varPrimaryExpr+
    ;

varExponentialExpr
    : varUnaryExpr POWER varExponentialExpr
    | varUnaryExpr
    ;

varUnaryExpr
    : SUB varUnaryExpr
    | ADD varUnaryExpr
    | varPrimaryExpr
    ;

varPrimaryExpr
    : INT_LIT
    | FLOAT_LIT
    | PI
    | E
    | shapeExpr
    | LR varExpr RR
    | sinExpr
    | cosExpr
    | tanExpr
    | cotExpr
    | logExpr
    | lnExpr
    | expExpr
    | absExpr
    | sqrtExpr
    | cbrtExpr
    ;

/* Lexer */
CIRCLE: 'Circle';
LINE: 'Line';
VECTOR: 'Vector';
SEGMENT: 'Segment';
RAY: 'Ray';
POLYGON: 'Polygon';
POINT: 'Point';
SPHERE: 'Sphere';
PLANE: 'Plane';
INTERSECT: 'Intersect';
ANGLE: 'Angle';
TRANSLATE: 'Translate';
ROTATE: 'Rotate';
PROJECT: 'Project';
REFLECT: 'Reflect';
ENLARGE: 'Enlarge';
CYLINDER: 'Cylinder';
TETRAHEDRON: 'Tetrahedron';
PRISM: 'Prism';
PYRAMID: 'Pyramid';
CUBOID: 'Cuboid';
CONE: 'Cone';

SIN: 'sin';
COS: 'cos';
TAN: 'tan';
COT: 'cot';
LOG: 'log';
LN: 'ln';
EXP: 'exp';
SQRT: 'sqrt';
CBRT: 'cbrt';
ABS: 'abs';
PI: 'pi';
E: 'e';

POINT_ID: [A-Z][A-Za-z0-9]*[']?([_][A-Za-z0-9]+)?;
SHAPE_ID: [a-z][A-Za-z0-9]*[']?([_][A-Za-z0-9]+)?;
LR: '(';
RR: ')';
LC: '{';
RC: '}';
COMMA: ',';
DIVIDE: '/';
ADD: '+';
SUB: '-';
MULTIPLY: '*';
POWER: '^';
EQ: '=';

INT_LIT: '0' | ([1-9][0-9]*);
FLOAT_LIT: (FInt FDec FExp?) | (FInt FExp) | (FDec FExp);
fragment FInt: INT_LIT;
fragment FDec: '.'[0-9]+;
fragment FExp: [eE][+-]?[0-9]+;

WS: [ \t\n\r]+ -> skip;