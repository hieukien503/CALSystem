grammar MathCommand;

@lexer::header {
    import { ErrorToken, UncloseString, IllegalEscape } from "./lexererr";
}

program: expr EOF;
expr: shapeExpr;
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
intersectionDef: INTERSECT LR (expr COMMA expr) RR;
transformDef: (
    (TRANSLATE LR (shapeExpr COMMA vectorExpr) RR) |
    (ROTATE LR (shapeExpr COMMA numberExpr ((COMMA pointExpr) | (COMMA directionExpr) | (COMMA pointExpr COMMA directionExpr))?) RR) |
    (PROJECT LR (pointExpr COMMA planeExpr) RR) |
    (REFLECT LR (shapeExpr COMMA (planeExpr | lineExpr | pointExpr)) RR) |
    (ENLARGE LR (shapeExpr COMMA numberExpr COMMA pointExpr) RR)
);
cylinderDef: CYLINDER LR (pointExpr COMMA pointExpr COMMA numberExpr) RR;
tetrahedronDef: TETRAHEDRON LR ((polygonExpr | (pointExpr COMMA pointExpr COMMA pointExpr)) COMMA pointExpr) RR;
coneDef: CONE LR (pointExpr COMMA numberExpr COMMA pointExpr) RR;
prismDef: PRISM LR (polygonExpr COMMA directionExpr) RR;
pyramidDef: PYRAMID LR (polygonExpr COMMA pointExpr) RR;

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
    | nrootExpr
    ;

sinExpr: SIN LR numberExpr RR;
cosExpr: COS LR numberExpr RR;
tanExpr: TAN LR numberExpr RR;
cotExpr: COT LR numberExpr RR;
logExpr: LOG LR (numberExpr COMMA numberExpr) RR;
lnExpr: LN LR numberExpr RR;
cbrtExpr: CBRT LR numberExpr RR;
sqrtExpr: SQRT LR numberExpr RR;
nrootExpr: NROOT LR (numberExpr COMMA numberExpr) RR;
absExpr: ABS LR numberExpr RR;
expExpr: EXP LR numberExpr RR;

pointExpr: POINT_ID | pointDef;
lineExpr: lineDef | SHAPE_ID;
dirExpr: pointExpr | vectorExpr | LR (numberExpr COMMA numberExpr COMMA numberExpr) RR;
vectorExpr: vectorDef | SHAPE_ID;
planeExpr: planeDef | SHAPE_ID;
directionExpr: SHAPE_ID | vectorExpr | lineExpr | segmentExpr | rayExpr | planeExpr;
polygonExpr: SHAPE_ID | polygonDef;
tetrahedronExpr: SHAPE_ID | tetrahedronDef;
cylinderExpr: SHAPE_ID | cylinderDef;
coneExpr: SHAPE_ID | coneDef;
prismExpr: SHAPE_ID | prismDef;
segmentExpr: SHAPE_ID | segmentDef;
rayExpr: SHAPE_ID | rayDef;
pyramidExpr: SHAPE_ID | pyramidDef;
shapeExpr: rayExpr | coneExpr | lineExpr | angleDef | planeExpr | pointExpr | prismExpr | circleDef | sphereDef | vectorExpr | polygonExpr |
            segmentExpr | cylinderExpr | transformDef | tetrahedronExpr | intersectionDef | pyramidExpr;

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
NROOT: 'nroot';

X: 'x';
Y: 'y';
Z: 'z';
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

INT_LIT: '0' | ([1-9][0-9]*);
FLOAT_LIT: (FInt FDec FExp?) | (FInt FExp) | (FDec FExp);
fragment FInt: INT_LIT;
fragment FDec: '.'[0-9]+;
fragment FExp: [eE][+-]?[0-9]+;

WS: [ \t\n\r]+ -> skip;
ERROR_CHAR: .{ throw new ErrorToken(this.text); };