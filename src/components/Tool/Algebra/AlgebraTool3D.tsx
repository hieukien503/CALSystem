import React, { RefObject } from "react";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import * as utils from "../../../utils/utilities";
import * as utils3d from "../../../utils/utilities3D"
import * as GeometryShape from "../../../types/geometry"
import Latex from 'react-latex';
import * as operations from '../../../utils/math_operation';
import { MathCommandLexer } from "../../../antlr4/parser/MathCommandLexer";
import { CharStreams, CommonTokenStream } from "antlr4ts";
import { MathCommandParser } from "../../../antlr4/parser/MathCommandParser";
import ASTGen from "../../../antlr4/astgen/ASTGen";
import SuggestionList from "../../Suggestion";

interface AlgebraItemProps {
    color: string;
    isSelected: boolean;
    width: number;
    description: string;
    shapeVisible: boolean;
    hidden: boolean;
    onClick: (e: React.MouseEvent) => void;
    onToggleVisibility: (e: React.MouseEvent) => void;
}

class AlgebraItem extends React.Component<AlgebraItemProps, {}> {
    render(): React.ReactNode {
        const color = utils.convert2RGB(this.props.color);
        const borderColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`
        const backgroundColor = this.props.shapeVisible ? `rgb(${color[0]}, ${color[1]}, ${color[2]}, 0.4)` : "rgb(255, 255, 255)";
        return (
            <div style={{padding: '3px 3px 3px 23px', width: '100%', marginLeft: '0px', position: 'relative'}}
                className={`avItem${this.props.isSelected ? " selectedItem" : ""}`}
                onClick={this.props.onClick}
            >
                <div 
                    className={`TreeItem`}
                    style={{display: "inline"}}
                >
                    <div className="elem">
                        <div className="marblePanel">
                            <div className={`marble${this.props.hidden ? " marbleHidden" : ""}`}
                                style={this.props.hidden ? {backgroundColor: "rgb(255, 255, 255)"} : {borderWidth: '1px', borderStyle: 'solid', borderColor: borderColor, backgroundColor: backgroundColor}}
                                onClick={(e) => this.props.onToggleVisibility(e)}
                            >
                            </div>
                        </div>
                        <div className="algebraViewObjectStylebar"
                            style={{right: "0px"}}>
                                <button type="button" className="button more">
                                    <MoreVertIcon style={{backgroundColor: 'rgb(249, 249, 249)'}}/>
                                </button>
                        </div>
                        <div className="elemText">
                            <div className="avPlainText" style={{fontSize: "12px", display: "inline-block", verticalAlign: "middle"}}>
                                <Latex>{this.props.description}</Latex>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

interface AlgebraInputItemProps {
    width: number;
    dag: Map<string, GeometryShape.ShapeNode3D>;
    labelUsed: string[];
    onClick: (e: React.MouseEvent) => void;
    onUpdateDAG: (dag: Map<string, GeometryShape.ShapeNode3D>) => void;
    onUpdateLabelUsed: (labelUsed: string[]) => void;
    onRenderErrorDiaglogbox: (message: string) => void;
}

interface AlgebraInputItemState {
    value_from_input: string;
    params: {
        start: number, end: number, text: string, selected: boolean
    }[];
    suggestionIdx: {
        keywordIdx: number, commandIdx: number
    }
    suggestedItem: {
        keyword: string;
        commands: {
            instruction: string;
            description: string;
        }[]
    }[];
    matchString: string,
    position: {
        top: number,
        left: number
    }
}

export class AlgebraInputItem extends React.Component<AlgebraInputItemProps, AlgebraInputItemState> {
    private commandList: {
        keyword: string;
        commands: {
            instruction: string;
            description: string;
        }[]
    }[];
    
    private inputRef: RefObject<HTMLInputElement | null>;
    constructor(props: AlgebraInputItemProps) {
        super(props);
        this.state = {
            value_from_input: '',
            params: [],
            suggestionIdx: {
                keywordIdx: 0, commandIdx: -1
            },
            suggestedItem: [],
            matchString: '',
            position: {
                top: 0, left: 0
            }
        }
        this.inputRef = React.createRef<HTMLInputElement>();
        this.commandList = [
            {
                keyword: "Point",
                commands: [{
                    instruction: "Point(number, number, number)",
                    description: "Create point in 3D"
                }],
            },
            {
                keyword: "Sphere",
                commands: [
                    {
                        instruction: "Sphere(Point, Point)",
                        description: "Create a sphere with center and a point"
                    },
                    {
                        instruction: "Sphere(Point, number)",
                        description: "Create a sphere with center and radius"
                    }
                ]
            },
            {
                keyword: "Line",
                commands: [
                    {
                        instruction: "Line(Point, Point)",
                        description: "Create a line passes through 2 points"
                    },
                    {
                        instruction: "Line(Point, Line)",
                        description: "Create a line passes through one point and parallel to other line"
                    },
                    {
                        instruction: "Line(Point, Vector)",
                        description: "Create a line passes through one point and has given direction vector"
                    }
                ]
            },
            {
                keyword: "Plane",
                commands: [
                    {
                        instruction: "Plane(Polygon)",
                        description: "Create a plane contains the polygon"
                    },
                    {
                        instruction: "Plane(Point, Line)",
                        description: "Create a plane passes through a point and perpendicular to line"
                    },
                    {
                        instruction: "Plane(Point, Plane)",
                        description: "Create a plane passes through a point and parallel to plane"
                    },
                    {
                        instruction: "Plane(Point, Vector, Vector)",
                        description: "Create a plane from a point and 2 vectors"
                    },
                    {
                        instruction: "Plane(Point, Point, Point)",
                        description: "Create a plane passes through 3 points"
                    },
                    {
                        instruction: "Plane(Line, Line)",
                        description: "Create a plane contains 2 lines"
                    }
                ]
            },
            {
                keyword: "Angle",
                commands: [
                    {
                        instruction: "Angle(Vector)",
                        description: "Measure the angle between given vector and Ox"
                    },
                    {
                        instruction: "Angle(Point)",
                        description: "Measure the angle between the vector formed by the given point and origin, and Ox"
                    },
                    {
                        instruction: "Angle(Vector, Vector)",
                        description: "Measure the angle between 2 vectors"
                    },
                    {
                        instruction: "Angle(Line, Line)",
                        description: "Measure the angle between 2 lines"
                    },
                    {
                        instruction: "Angle(Line, Plane)",
                        description: "Measure the angle between line and plane"
                    },
                    {
                        instruction: "Angle(Plane, Plane)",
                        description: "Measure the angle between 2 planes"
                    },
                    {
                        instruction: "Angle(Point, Point, Point)",
                        description: "Measure the angle between 3 points, where second point is the vertex"
                    }
                ]
            },
            {
                keyword: "Vector",
                commands: [
                    {
                        instruction: "Vector(Point, Point)",
                        description: "Create a vector with start point and end point"
                    },
                    {
                        instruction: "Vector(Point)",
                        description: "Create a vector from point, with origin as the start point"
                    }
                ]
            },
            {
                keyword: "Polygon",
                commands: [
                    {
                        instruction: "Polygon(Point, Point, ...)",
                        description: "Create a polygon from the list of points"
                    },
                    {
                        instruction: "Polygon(Point, Point, number, Plane)",
                        description: "Create a regular polygon with 2 starting vertices and number of edges, lies on the plane"
                    }
                ]
            }
        ]
    }

    componentDidUpdate(prevProps: Readonly<AlgebraInputItemProps>, prevState: Readonly<AlgebraInputItemState>, snapshot?: any): void {
        if (prevState.value_from_input !== this.state.value_from_input) {
            const cursorPos = this.inputRef.current?.selectionStart || this.state.value_from_input.length;
    
            // Find the start of the current word by looking backwards for delimiters
            let wordStart = cursorPos - 1;
            while (wordStart >= 0 && /[a-zA-Z]/.test(this.state.value_from_input[wordStart])) {
            wordStart--;
            }
            wordStart++;
            
            const currentWord = this.state.value_from_input.substring(wordStart, cursorPos);
            
            // Only show suggestions if we're typing a word
            if (currentWord && /^[a-zA-Z]+$/.test(currentWord)) {
                const matches = this.commandList.filter(cmd =>
                    cmd.keyword.startsWith(currentWord)
                );

                this.setState({
                    suggestedItem: matches,
                    suggestionIdx: {
                        keywordIdx: 0, commandIdx: -1
                    }
                })
            } 
            
            else {
                this.setState({
                    suggestedItem: []
                })
            }
        }
    }

    private handleFocus = () => {
        if (this.inputRef.current) {
            const rect = this.inputRef.current.getBoundingClientRect();
            this.setState({position: {
                top: rect.bottom + 12, // add scroll offset
                left: rect.left + 58,
            }});
        }
    };

    private extractParams = (signature: string) => {
        const match = signature.match(/\(([^)]+)\)/);
        if (!match) return [];
        return match[1].split(',').map(p => p.trim());
    };

    private handleSubmit = (): void => {
        try {
            const DAG = utils3d.cloneDAG(this.props.dag);
            const labelUsed = [...this.props.labelUsed];
            const inputStream = CharStreams.fromString(this.state.value_from_input);
            const lexer = new MathCommandLexer(inputStream);
            const tokens = new CommonTokenStream(lexer);
            const parser = new MathCommandParser(tokens);
            const tree = parser.program();
            const ast = new ASTGen(DAG, labelUsed);
            ast.visit(tree);
            this.props.onUpdateDAG(DAG);
            this.props.onUpdateLabelUsed(labelUsed);
        }
        
        catch (error) {
            this.props.onRenderErrorDiaglogbox('Invalid command!');
        }

        finally {
            this.setState({
                value_from_input: ''
            })
        }
    }

    private handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        this.setState({ value_from_input: newValue });
    }

    private insertCommand = (command: { instruction: string, description: string }) => {
        const signature = command.instruction;
        const params = this.extractParams(signature);
        // Find where to insert the command
        const cursorPos = this.inputRef.current?.selectionStart || this.state.value_from_input.length;
        
        // Find the start of the current word
        let wordStart = cursorPos - 1;
        while (wordStart >= 0 && /[a-zA-Z]/.test(this.state.value_from_input[wordStart])) {
            wordStart--;
        }

        wordStart++;
        
        // Replace the current word with the signature
        const before = this.state.value_from_input.substring(0, wordStart);
        const after = this.state.value_from_input.substring(cursorPos);
        const newInput = before + signature + after;
        
        const placeHolders: {
            start: number, end: number, text: string, selected: boolean
        }[] = [];
        let searchStart = wordStart;

        params.forEach((param) => {
            const paramIndex = (before + signature).indexOf(param, searchStart);
            if (paramIndex !== -1) {
                placeHolders.push({
                    start: paramIndex,
                    end: paramIndex + param.length,
                    text: param,
                    selected: false
                });

                searchStart = paramIndex + param.length;
            }
        });
        
        this.setState({
            value_from_input: newInput,
            suggestedItem: [],
            suggestionIdx: { keywordIdx: 0, commandIdx: -1 },
            params: placeHolders,
            matchString: ''
        },() => {
            // 2️⃣ After state is updated, set the DOM value directly
            if (this.inputRef.current) {
                this.inputRef.current.value = newInput;
            }
        })
    };

    private handleKeyDown = (e: React.KeyboardEvent): void => {
        if (e.key === 'Enter') {
            this.handleSubmit();
        }
    }   

    render(): React.ReactNode {
        return (
            <>
                <div style={{padding: '3px 3px 3px 23px', width: '100%', marginLeft: '0px', position: 'relative'}}
                    className={`avInputItem`}
                >
                    <div 
                        className={`TreeItem newRadioButtonTreeItemParent`}
                        style={{display: "inline"}}
                    >
                        <div className="elem">
                            <div className="marblePanel plus">
                                <button className="button flatButton" type="button" onClick={this.props.onClick}>
                                    <AddIcon style={{backgroundColor: 'rgb(249, 249, 249)'}}/>
                                </button>
                            </div>
                            <input className="algebraInputField"
                                placeholder={"Input..."}
                                onKeyDown={this.handleKeyDown}
                                onFocus={this.handleFocus}
                                value={this.state.value_from_input}
                                onChange={this.handleChange}
                                style={{background: 'none', fontSize: '16px'}}
                                ref={this.inputRef}
                            >
                            </input>
                            {this.state.suggestedItem.length > 0 && <SuggestionList
                                position={this.state.position}
                                suggestedItems={this.state.suggestedItem}
                                onUpdateSuggestionIdx={(idx) => this.setState({suggestionIdx: idx})}
                                onSelectCommand={(cmd) => this.insertCommand(cmd)}
                            />}
                        </div>
                    </div>
                </div>
            </>
            
        )
    }
}

interface AlgebraTool3DState {
    items: ({ type: 'shape', id: string } | { type: 'input', latex: string })[];
}

interface AlgebraTool3DProps {
    width: number;
    height: number;
    dag: Map<string, GeometryShape.ShapeNode3D>;
    labelUsed: string[];
    onSelect: (id: string, e: React.MouseEvent) => void;
    onUpdateDAG: (dag: Map<string, GeometryShape.ShapeNode3D>) => void;
    onUpdateLabelUsed: (labelUsed: string[]) => void;
    onRenderErrorDialogbox: (message: string) => void;
}

class AlgebraTool3D extends React.Component<AlgebraTool3DProps, AlgebraTool3DState> {
    private textId: number;
    constructor(props: AlgebraTool3DProps) {
        super(props);
        this.textId = 0;
        this.state = {
            items: this.buildFromDAG(props.dag)
        };
    }

    componentDidUpdate(prevProps: Readonly<AlgebraTool3DProps>, prevState: Readonly<{}>, snapshot?: any): void {
        this.textId = 0;
        if (prevProps.dag !== this.props.dag) {
            this.setState({
                items: this.buildFromDAG(this.props.dag)
            });
        }
    }

    private producePlaneEquation = (plane: GeometryShape.Plane): string => {
        const norm = {
            x: plane.norm.endVector.x - plane.norm.startVector.x,
            y: plane.norm.endVector.y - plane.norm.startVector.y,
            z: (plane.norm.endVector.z ?? 0) - (plane.norm.startVector.z ?? 0)
        };

        const normLength = Math.sqrt(norm.x ** 2 + norm.y ** 2 + norm.z ** 2);
        norm.x /= normLength;
        norm.y /= normLength;
        norm.z /= normLength;
        const d = norm.x * plane.point.x + norm.y * plane.point.y + norm.z * (plane.point.z ?? 0);
        function simplifyPlaneEquation(a: number, b: number, c: number, d: number): string {
            const terms: string[] = [];

            a = parseFloat(a.toFixed(2));
            b = parseFloat(b.toFixed(2));
            c = parseFloat(c.toFixed(2));
            d = parseFloat(d.toFixed(2));
            if (a !== 0) terms.push(`${formatCoeff(a)}x`);
            if (b !== 0) terms.push(`${formatCoeff(b)}y`);
            if (c !== 0) terms.push(`${formatCoeff(c)}z`);
            if (d !== 0) terms.push(formatConst(d));

            const expr = terms.join(' ');
            return expr.length ? `${expr} = 0` : `0 = 0`;
        }

        function formatCoeff(coef: number): string {
            // handle + and - signs cleanly
            if (coef === 1) return '+';
            if (coef === -1) return '-';
            if (coef > 0) return `+${coef}`;
            return `${coef}`; // negative already has "-"
        }

        function formatConst(d: number): string {
            if (d > 0) return `-${d}`;
            return `+${d}`;
        }
        
        const expr = simplifyPlaneEquation(norm.x, norm.y, norm.z, d);
        return expr.replace(/^\+/, '');
    }

    private formatNumbers = (num: number): string => {
        return parseFloat(num.toFixed(2)).toString();
    }

    private produceLineEquation = (line: GeometryShape.Line | GeometryShape.Ray): string => {
        const dir = {
            x: 0,
            y: 0,
            z: 0
        }

        if ('startLine' in line) {
            dir.x = line.endLine.x - line.startLine.x
            dir.y = line.endLine.y - line.startLine.y
            dir.z = (line.endLine.z ?? 0) - (line.startLine.z ?? 0)
        }
        
        else {
            dir.x = line.endRay.x - line.startRay.x
            dir.y = line.endRay.y - line.startRay.y
            dir.z = (line.endRay.z ?? 0) - (line.startRay.z ?? 0)
        }

        const startPoint = {
            x: 'startLine' in line ? line.startLine.x : line.startRay.x,
            y: 'startLine' in line ? line.startLine.y : line.startRay.y,
            z: 'startLine' in line ? line.startLine.z ?? 0 : line.startRay.z ?? 0
        }

        const dirLength = Math.sqrt(dir.x ** 2 + dir.y ** 2 + dir.z ** 2);
        dir.x /= dirLength;
        dir.y /= dirLength;
        dir.z /= dirLength;
        const x = String.raw`${startPoint.x === 0 ? (dir.x === 0 ? '0' : '') : this.formatNumbers(startPoint.x)}${dir.x === 0 ? '' : (startPoint.x === 0 ? (this.formatNumbers(dir.x) === '1' ? '' : this.formatNumbers(dir.x)) + 't' : (dir.x > 0 ? ' + ' : ' - ') + (this.formatNumbers(Math.abs(parseFloat(dir.x.toFixed(2)))) === '1' ? '' : this.formatNumbers(Math.abs(parseFloat(dir.x.toFixed(2)))))+ 't')}`
        const y = String.raw`${startPoint.y === 0 ? (dir.y === 0 ? '0' : '') : this.formatNumbers(startPoint.y)}${dir.y === 0 ? '' : (startPoint.y === 0 ? (this.formatNumbers(dir.y) === '1' ? '' : this.formatNumbers(dir.y)) + 't' : (dir.y > 0 ? ' + ' : ' - ') + (this.formatNumbers(Math.abs(parseFloat(dir.y.toFixed(2)))) === '1' ? '' : this.formatNumbers(Math.abs(parseFloat(dir.y.toFixed(2)))))+ 't')}`
        const z = String.raw`${startPoint.z === 0 ? (dir.z === 0 ? '0' : '') : this.formatNumbers(startPoint.z)}${dir.z === 0 ? '' : (startPoint.z === 0 ? (this.formatNumbers(dir.z) === '1' ? '' : this.formatNumbers(dir.z)) + 't' : (dir.z > 0 ? ' + ' : ' - ') + (this.formatNumbers(Math.abs(parseFloat(dir.z.toFixed(2)))) === '1' ? '' : this.formatNumbers(Math.abs(parseFloat(dir.z.toFixed(2)))))+ 't')}`
        return String.raw`
            x = ${x}\\
            y = ${y}\\
            z = ${z}
        `
    }

    private buildFromDAG = (dag: Map<string, GeometryShape.ShapeNode3D>): ({ type: 'shape', id: string } | { type: 'input', latex: string })[] => {
        const array = Array.from(dag.keys());
        const shapeItems: ({ type: 'shape', id: string } | { type: 'input', latex: string })[] = [];
        array.forEach(id => {
            if (!id.includes('Axis')) {
                shapeItems.push({ type: 'shape' as const, id: id });
            }
        })
        // Keep the last input item
        return [...shapeItems, { type: 'input' as const, latex: '' }];
    }

    private createDescription = (shapeNode: GeometryShape.ShapeNode3D): string => {
        let label = shapeNode.type.props.label;
        const formatLabel = (label: string): string => {
            const subscriptMap: Record<string, string> = {
                '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
                '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9'
            };
            
            const fLabel = label.replace(/([A-Za-z]+)([₀₁₂₃₄₅₆₇₈₉]+)/g, (_, letter, subs) => {
                const normal = (subs as string).split('').map(ch => subscriptMap[ch] || ch).join('');
                return `${letter}_{${normal}}`;
            });

            return fLabel;
        }

        const createLatexString = (shape: GeometryShape.Shape): string => {
            if (shape.props.label) return `\\mathrm{${formatLabel(shape.props.label)}}`;
            if ('x' in shape && 'y' in shape) {
                return String.raw`
                    \mathrm{Point}\left(${this.formatNumbers(shape.x)},${this.formatNumbers(shape.y)},${this.formatNumbers(shape.z ?? 0)}\right)
                `
            }

            if ('startLine' in shape) {
                return String.raw`
                    \mathrm{Line}\left(${createLatexString(shape.startLine)},${createLatexString(shape.endLine)}\right)
                `
            }

            if ('startSegment' in shape) {
                return String.raw`
                    \mathrm{Segment}\left(${createLatexString(shape.startSegment)},${createLatexString(shape.endSegment)}\right)
                `
            }

            if ('startRay' in shape) {
                return String.raw`
                    \mathrm{Ray}\left(${createLatexString(shape.startRay)},${createLatexString(shape.endRay)}\right)
                `
            }

            if ('startVector' in shape) {
                return String.raw`
                    \mathrm{Vector}\left(${createLatexString(shape.startVector)},${createLatexString(shape.endVector)}\right)
                `
            }

            if ('centerC' in shape && 'radius' in shape) {
                return String.raw`
                    \mathrm{Vector}\left(${createLatexString(shape.centerC)},${this.formatNumbers(shape.radius)}${shape.direction ? ',' + createLatexString(shape.direction) : ''}\right)
                `
            }

            if (shape.type === 'Polygon' || shape.type === 'RegularPolygon') {
                let stringOfLabels: string[] = [];
                let points = (shapeNode.type as GeometryShape.Polygon).points;
                points.forEach(point => {
                    stringOfLabels.push(createLatexString(point));
                });

                let str = String.raw`\mathrm{${shape.type}}\left(${stringOfLabels.join(',')}`;
                if (shape.type === 'RegularPolygon') {
                    str += ',' + (shape as GeometryShape.Polygon).points.length.toString() + ',';
                    const plane = this.props.dag.get(shapeNode.dependsOn[2])!;
                    str += createLatexString(plane.type);
                }

                str += String.raw`\right)\\`
                return str;
            }

            if ('norm' in shape && 'point' in shape) {
                return String.raw`
                    \mathrm{Plane}\left(${createLatexString(shape.point)}${shape.norm ? ',' + createLatexString(shape.norm) : ''}\right)
                `
            }

            return '';
        }

        const shape = shapeNode.type.type;
        if (shape === 'Point') {
            if (shapeNode.id.includes('tmpPoint')) {
                this.textId += 1;
                return `$Text${this.textId}: "${formatLabel(label)}"$`;
            }
            
            return `$\\mathrm{${formatLabel(label)}} = \\left(${this.formatNumbers((shapeNode.type as GeometryShape.Point).x)},${this.formatNumbers((shapeNode.type as GeometryShape.Point).y)},${this.formatNumbers((shapeNode.type as GeometryShape.Point).z ?? 0)}\\right)$`
        }
        
        else if (shape === 'Line') {
            const str = String.raw`
            \[
            \begin{array}{l}
            \mathrm{${formatLabel(label)}}: \mathrm{Line}\left(${createLatexString((shapeNode.type as GeometryShape.Line).startLine)},${createLatexString((shapeNode.type as GeometryShape.Line).endLine)}\right)\\
            = \begin{cases}
            ${this.produceLineEquation(shapeNode.type as GeometryShape.Line)}
            \end{cases}
            \end{array}
            \]`
            return str;
        }

        else if (shape === 'Segment') {
            const v = {
                x: (shapeNode.type as GeometryShape.Segment).endSegment.x - (shapeNode.type as GeometryShape.Segment).startSegment.x,
                y: (shapeNode.type as GeometryShape.Segment).endSegment.y - (shapeNode.type as GeometryShape.Segment).startSegment.y,
                z: ((shapeNode.type as GeometryShape.Segment).endSegment.z ?? 0) - ((shapeNode.type as GeometryShape.Segment).startSegment.z ?? 0)
            }

            const segmentLength = Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);
            return String.raw`
            \[
            \begin{array}{l}
            \mathrm{${formatLabel(label)}}: \mathrm{Segment}\left(${createLatexString((shapeNode.type as GeometryShape.Segment).startSegment)},${createLatexString((shapeNode.type as GeometryShape.Segment).endSegment)}\right)\\
            Length = ${this.formatNumbers(segmentLength)}
            \end{array}
            \]`
        }

        else if (shape === 'Vector') {
            const dir = {
                x: (shapeNode.type as GeometryShape.Vector).endVector.x - (shapeNode.type as GeometryShape.Vector).startVector.x,
                y: (shapeNode.type as GeometryShape.Vector).endVector.y - (shapeNode.type as GeometryShape.Vector).startVector.y,
                z: ((shapeNode.type as GeometryShape.Vector).endVector.z ?? 0) - ((shapeNode.type as GeometryShape.Vector).startVector.z ?? 0)
            }
            
            return String.raw`
            \[
            \begin{array}{l}
            \mathrm{${formatLabel(label)}}: \mathrm{Vector}\left(${createLatexString((shapeNode.type as GeometryShape.Vector).startVector)},${createLatexString((shapeNode.type as GeometryShape.Vector).endVector)}\right)\\
            = \begin{pmatrix}
            ${this.formatNumbers(dir.x)}\\
            ${this.formatNumbers(dir.y)}\\
            ${this.formatNumbers(dir.z)}
            \end{pmatrix}
            \end{array}
            \]
            `
        }

        else if (shape === 'Ray') {
            const str = String.raw`
            \[
            \begin{array}{l}
            \mathrm{${formatLabel(label)}}: \mathrm{Ray}\left(${createLatexString((shapeNode.type as GeometryShape.Ray).startRay)},${createLatexString((shapeNode.type as GeometryShape.Ray).endRay)}\right)\\
            = \begin{cases}
            ${this.produceLineEquation(shapeNode.type as GeometryShape.Ray)}
            \end{cases}
            \end{array},t\ge 0
            \]`
            return str;
        }

        else if (['Polygon', 'RegularPolygon'].includes(shape)) {
            let stringOfLabels: string[] = [];
            let points = (shapeNode.type as GeometryShape.Polygon).points;
            points.forEach(point => {
                stringOfLabels.push(createLatexString(point));
            });

            let str = String.raw`\mathrm{${shape}}\left(${stringOfLabels.join(',')}`;
            if (shape === 'RegularPolygon') {
                str += ',' + (shapeNode.type as GeometryShape.Polygon).points.length.toString() + ',';
                const plane = this.props.dag.get(shapeNode.dependsOn[2])!;
                str += createLatexString(plane.type);
            }

            str += String.raw`\right)\\`
            return String.raw`
            \[
            \begin{array}{l}
            \mathrm{${formatLabel(label)}}: ${str}
            Area = ${this.formatNumbers((shapeNode.type as GeometryShape.Polygon).area ?? 0)}
            \end{array}
            \]
            `
        }

        else if (shape === 'Circle') {
            return String.raw`
            \[
            \begin{array}{l}
            \mathrm{${formatLabel(label)}}: \mathrm{Vector}\left(${createLatexString((shapeNode.type as GeometryShape.Circle).centerC)},${this.formatNumbers((shapeNode.type as GeometryShape.Circle).radius)}${(shapeNode.type as GeometryShape.Circle).direction ? ',' + createLatexString((shapeNode.type as GeometryShape.Circle).direction!) : ''}\right)\\
            Area = ${this.formatNumbers((shapeNode.type as GeometryShape.Circle).area ?? 0)}
            \end{array}
            `
        }

        else if (shape === 'Intersection') {
            console.log(this.props.dag);
            let str = `$\\mathrm{${formatLabel(label)}}: \\mathrm{${shape}}\\left(`
            let labels = shapeNode.dependsOn.map(id => {
                const node = this.props.dag.get(id)!;
                return createLatexString(node.type);
            });
            
            labels.slice(0, 2).forEach(label => {
                str += label + ",";
            });

            str = str.slice(0, -1) + "\\right) = ";
            if (shapeNode.defined) {
                str += `${createLatexString((shapeNode.type as GeometryShape.Point))}`
            }

            else {
                str += `undefined`
            }

            return str;
        }

        else if ('norm' in shapeNode.type && 'point' in shapeNode.type) {
            let str: string;
            if (formatLabel(label) !== 'OxyPlane') {
                str = String.raw`
                \[
                \begin{array}{l}
                \mathrm{${formatLabel(label)}}: \mathrm{${shape}}\left(
                `;
                console.log(shapeNode);
                let labels = shapeNode.dependsOn.map(id => {
                    const node = this.props.dag.get(id)!;
                    return createLatexString(node.type);
                });
                
                labels.forEach(label => {
                    str += label + ",";
                });

                str = (str[str.length - 1] === ',' ? str.slice(0, -1) : str) + "\\right)\\\\";
            }

            else {
                str = `$\\mathrm{${formatLabel(label)}}`;
            }

            str += `: ${this.producePlaneEquation(shapeNode.type as GeometryShape.Plane)}${formatLabel(label) !== 'OxyPlane' ? '\\end{array}\\]' : '$'}`;
            return str;
        }

        else if (!(['Translation', 'Rotation', 'Reflection', 'Enlarge'].includes(shape))) {
            let str: string;
            if (formatLabel(label) !== 'OxyPlane') {
                str = String.raw`
                \[
                \begin{array}{l}
                \mathrm{${formatLabel(label)}}: \mathrm{${shape}}\left(
                `;
                console.log(shapeNode);
                let labels = shapeNode.dependsOn.map(id => {
                    const node = this.props.dag.get(id)!;
                    return createLatexString(node.type);
                });
                
                labels.forEach(label => {
                    str += label + ",";
                });

                if (shape === 'Prism') {
                    str += `${this.formatNumbers(operations.distance((shapeNode.type as GeometryShape.Prism).base1, (shapeNode.type as GeometryShape.Prism).base2.points[0]))}`
                }

                str = (str[str.length - 1] === ',' ? str.slice(0, -1) : str) + "\\right)\\\\";
            }

            else {
                str = `$\\mathrm{${formatLabel(label)}}`;
            }

            str += `Area = ${this.formatNumbers(operations.surface_area(shapeNode.type))}\\\\Volume = ${this.formatNumbers(operations.volume(shapeNode.type))}\\end{array}\\]`;
            return str;
        }

        else {
            let verb = (shape === 'Translation' ? 'Translate' : (shape === 'Rotation' ? 'Rotate' : (shape === 'Reflection' ? 'Reflect' : 'Dilate')));
            let str: string = `$\\mathrm{${formatLabel(label)}}: \\mathrm{${verb}}\\left(`;
            if (verb === 'Translate' || verb === 'Reflect') {
                let labels = shapeNode.dependsOn.map(id => {
                    const node = this.props.dag.get(id)!;
                    return createLatexString(node.type);
                });
                
                labels.slice(0, 2).forEach(label => {
                    str += label + ",";
                });

                str = str.slice(0, -1) + "\\right)$"; 
            }

            else if (verb === 'Rotate') {
                let labels = shapeNode.dependsOn.map(id => {
                    const node = this.props.dag.get(id)!;
                    return createLatexString(node.type);
                });
                
                labels.slice(0, 2).forEach(label => {
                    str += label + ",";
                });

                str += ((shapeNode.rotationFactor!.CCW ? -1 : 1) * shapeNode.rotationFactor!.degree).toString() + "^\\circ\\right)$";
            }

            else {
                let labels = shapeNode.dependsOn.map(id => {
                    const node = this.props.dag.get(id)!;
                    return createLatexString(node.type);
                });
                
                labels.slice(0, 2).forEach(label => {
                    str += label + ",";
                });

                str += (shapeNode.scaleFactor!).toString() + "\\right)$"
            }

            return str;
        }
    }

    render(): React.ReactNode {
        return (
            <div 
                className="customScrollBar"
                style={{
                    position: 'relative',
                    width: '100%',
                    height: this.props.height,
                    display: 'flex',
                    flexDirection: 'row',
                    backgroundColor: '#f9f9f9',
                    overflowX: 'hidden',
                    overflowY: 'auto'
                }}
            >
                <div style={{position: "relative", zoom: "1",  height: "100%", width: '100%'}}>
                    <div
                        className="Tree algebraView"
                        style={{position: "relative", zoom: "1", height: '100%'}}>
                        {this.state.items.map((item, index) => {
                            if (item.type === 'shape') {
                                const shapeNode = this.props.dag.get(item.id);
                                if (!shapeNode) return null;
                                return (
                                    <AlgebraItem
                                        key={`shape-${item.id}`}
                                        color={shapeNode.defined ? shapeNode.type.props.color : "white"}
                                        isSelected={shapeNode.isSelected}
                                        width={this.props.width}
                                        description={this.createDescription(shapeNode)}
                                        onClick={(e) => this.props.onSelect(shapeNode.id, e)}
                                        shapeVisible={shapeNode.type.props.visible.shape}
                                        hidden={!shapeNode.defined}
                                        onToggleVisibility={() => {
                                            const visible = shapeNode.type.props.visible;
                                            shapeNode.type.props.visible.shape = !visible.shape;
                                            if ('x' in shapeNode.type && 'y' in shapeNode.type) {
                                                shapeNode.type.props.visible.label = shapeNode.type.props.visible.shape;
                                            }
        
                                            this.props.onUpdateDAG(utils3d.cloneDAG(this.props.dag));
                                        }}
                                    />
                                );
                            }
                            
                            else if (item.type === 'input') {
                                return (
                                    <AlgebraInputItem
                                        key={`input-${index}`}
                                        width={this.props.width}
                                        onClick={() => {}}
                                        dag={this.props.dag}
                                        onUpdateDAG={(dag) => this.props.onUpdateDAG(dag)}
                                        labelUsed={this.props.labelUsed}
                                        onUpdateLabelUsed={(labelUsed) => this.props.onUpdateLabelUsed(labelUsed)}
                                        onRenderErrorDiaglogbox={this.props.onRenderErrorDialogbox}
                                    />
                                );
                            }
                            return null;
                        })}
                    </div>
                </div>
            </div>
        )
    }
};

export default AlgebraTool3D;