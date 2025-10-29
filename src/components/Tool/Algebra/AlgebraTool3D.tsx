import React from "react";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import * as utils from "../../../utils/utilities";
import * as utils3d from "../../../utils/utilities3D"
import * as GeometryShape from "../../../types/geometry"
import Latex from 'react-latex';
import * as math from 'mathjs';

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
                                    <MoreVertIcon />
                                </button>
                        </div>
                        <div className="elemText">
                            <div className="avPlainText" style={{fontSize: "16px", display: "inline-block", verticalAlign: "middle"}}>
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
    onClick: (e: React.MouseEvent) => void;
}

interface AlgebraInputItemState {
    value_from_input: string;
}

export class AlgebraInputItem extends React.Component<AlgebraInputItemProps, AlgebraInputItemState> {
    private tex: string;
    constructor(props: AlgebraInputItemProps) {
        super(props);
        this.state = {
            value_from_input: ''
        }
        this.tex = '';
    }

    private handleKeyDown = (e: React.KeyboardEvent): void => {
        if (e.key === 'Enter') {
            try {
                const node = math.parse(this.state.value_from_input);
                this.tex = node.toTex({
                    handler: (node: math.MathNode, options: any): string => {
                        if ((node as math.ParenthesisNode).isParenthesisNode === true) {
                            const innerExpr = (node as math.ParenthesisNode).content;
                            return `\\left(${innerExpr.toTex(options)}\\right)`
                        }

                        if ((node as math.OperatorNode).isOperatorNode === true) {
                            const [left, right] = (node as math.OperatorNode).args;
                           return `${left.toTex(options)}${(node as math.OperatorNode).op}${(node as math.OperatorNode).op === '^' ? '{' : ''}${right.toTex(options)}${(node as math.OperatorNode).op === '^' ? '}' : ''}`
                        }

                        if ((node as math.FunctionNode).isFunctionNode === true) {
                            switch ((node as math.FunctionNode).fn.name) {
                                case 'sqrt': {
                                    if ((node as math.FunctionNode).args.length === 1) {
                                        return node.toTex(options);
                                    }

                                    else if ((node as math.FunctionNode).args.length === 2) {
                                        const [base, arg] = (node as math.FunctionNode).args;
                                        return `\\sqrt[${base.toTex(options)}]{${arg.toTex(options)}}`
                                    }

                                    throw new Error('Invalid square root command');
                                }

                                case 'log': {
                                    if ((node as math.FunctionNode).args.length === 1) {
                                        return node.toTex(options);
                                    }

                                    if ((node as math.FunctionNode).args.length === 2) {
                                        const [base, arg] = (node as math.FunctionNode).args;
                                        return `\\log_[${base.toTex(options)}]{\\left(${arg.toTex(options)}\\right)}`
                                    }

                                    throw new Error('Invalid log command');
                                }

                                case 'sin': {
                                    if ((node as math.FunctionNode).args.length === 1) {
                                        return `\\sin\\left(${(node as math.FunctionNode).args[0].toTex(options)}\\right)`;
                                    }

                                    throw new Error('Invalid sin command');
                                }

                                case 'cos': {
                                    if ((node as math.FunctionNode).args.length === 1) {
                                        return `\\cos\\left(${(node as math.FunctionNode).args[0].toTex(options)}\\right)`;
                                    }

                                    throw new Error('Invalid cos command');
                                }

                                case 'tan': {
                                    if ((node as math.FunctionNode).args.length === 1) {
                                        return `\\tan\\left(${(node as math.FunctionNode).args[0].toTex(options)}\\right)`;
                                    }

                                    throw new Error('Invalid tan command');
                                }

                                case 'cot': {
                                    if ((node as math.FunctionNode).args.length === 1) {
                                        return `\\cot\\left(${(node as math.FunctionNode).args[0].toTex(options)}\\right)`;
                                    }

                                    throw new Error('Invalid cot command');
                                }
                            }
                        }
                        return node.toTex();
                    }
                });
            }
            
            catch (error) {
                this.tex = ''; // Avoid rendering broken math
            }
        }
    }

    render(): React.ReactNode {
        return (
            <div style={{padding: '3px 3px 3px 23px', width: this.props.width, marginLeft: '0px', position: 'relative'}}
                className={`avInputItem`}
            >
                <div 
                    className={`TreeItem newRadioButtonTreeItemParent`}
                    style={{display: "inline"}}
                >
                    <div className="elem">
                        <div className="marblePanel plus">
                            <button className="button flatButton" type="button" onClick={this.props.onClick}>
                                <AddIcon />
                            </button>
                        </div>
                        <input className="algebraInputField"
                            placeholder={"Input..."}
                            onKeyDown={this.handleKeyDown}
                            value={this.state.value_from_input}
                            onChange={(e) => this.setState({ value_from_input: e.target.value })}
                        >
                        </input>
                    </div>
                </div>
            </div>
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
    onSelect: (id: string, e: React.MouseEvent) => void;
    onUpdateDAG: (dag: Map<string, GeometryShape.ShapeNode3D>) => void;
}

class AlgebraTool3D extends React.Component<AlgebraTool3DProps, AlgebraTool3DState> {
    constructor(props: AlgebraTool3DProps) {
        super(props);
        this.state = {
            items: [{
                type: 'input',
                latex: 'string',
            }],
        };
    }

    handleInputSubmit = (latex: string) => {
        this.setState((prevState) => ({
            items: [...prevState.items, { type: 'input', latex }],
        }));
    };

    handleNewShape = (shapeId: string) => {
        this.setState((prevState) => ({
            items: [...prevState.items, { type: 'shape', id: shapeId }],
        }));
    };

    private createDescription = (shapeNode: GeometryShape.ShapeNode3D): string => {
        let label = shapeNode.type.props.label;
        const subscriptMap: Record<string, string> = {
            '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
            '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9'
        };

        const formatLabel = label.replace(/([A-Za-z]+)([₀₁₂₃₄₅₆₇₈₉]+)/g, (_, letter, subs) => {
            const normal = (subs as string).split('').map(ch => subscriptMap[ch] || ch).join('');
            return `${letter}_{${normal}}`;
        });

        const shape = shapeNode.type.type;
        if (shape === 'Point') {
            if (shapeNode.id.includes('tmpPoint')) {
                let label = shapeNode.id;
                return `$Text${label.replace('tmpPoint', '')} = "${formatLabel}"$`;
            }
            
            return `$${formatLabel} = \\left(${((shapeNode.type as GeometryShape.Point).x.toFixed(2))},${(shapeNode.type as GeometryShape.Point).y.toFixed(2)}\\right)$`
        }
        
        else if (shape === 'Line') {
            return `$${formatLabel} = Line\\left(${(shapeNode.type as GeometryShape.Line).startLine.props.label},${(shapeNode.type as GeometryShape.Line).endLine.props.label}\\right)$`
        }

        else if (shape === 'Segment') {
            return `$${formatLabel} = Segment\\left(${(shapeNode.type as GeometryShape.Segment).startSegment.props.label},${(shapeNode.type as GeometryShape.Segment).endSegment.props.label}\\right)$`
        }

        else if (shape === 'Vector') {
            return `$${formatLabel} = Vector\\left(${(shapeNode.type as GeometryShape.Vector).startVector.props.label},${(shapeNode.type as GeometryShape.Vector).endVector.props.label}\\right)$`
        }

        else if (shape === 'Ray') {
            return `$${formatLabel} = Ray\\left(${(shapeNode.type as GeometryShape.Ray).startRay.props.label},${(shapeNode.type as GeometryShape.Ray).endRay.props.label}\\right)$`
        }

        else if (['Polygon', 'RegularPolygon'].includes(shape)) {
            let stringOfLabels = '';
            let points = (shapeNode.type as GeometryShape.Polygon).points;
            points.forEach(point => {
                stringOfLabels = stringOfLabels + point.props.label;
            });

            return `$${formatLabel} = ${shape}\\left(${stringOfLabels}\\right)$`
        }

        else if (shape === 'Circle') {
            return `$${formatLabel} = Circle\\left(${(shapeNode.type as GeometryShape.Circle).centerC.props.label},${(shapeNode.type as GeometryShape.Circle).radius}\\right)$`
        }

        else if (shape === 'Intersection') {
            let str = `$${formatLabel} = ${shape}\\left(`
            let labels = shapeNode.dependsOn.map(id => {
                const node = this.props.dag.get(id)!;
                let label = node.type.props.label;
                const subscriptMap: Record<string, string> = {
                    '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
                    '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9'
                };

                return label.replace(/([A-Za-z]+)([₀₁₂₃₄₅₆₇₈₉]+)/g, (_, letter, subs) => {
                    const normal = (subs as string).split('').map(ch => subscriptMap[ch] || ch).join('');
                    return `${letter}_{${normal}}`;
                });
            });
            
            labels.slice(0, 2).forEach(label => {
                str += label + ",";
            });

            str = str.slice(0, -1) + "\\right) = ";
            if (shapeNode.defined) {
                str += `\\left(${(shapeNode.type as GeometryShape.Point).x.toFixed(2)},${(shapeNode.type as GeometryShape.Point).y.toFixed(2)}`
            }

            else {
                str += `undefined`
            }

            return str;
        }

        else if (!(['Translation', 'Rotation', 'Reflection', 'Enlarge'].includes(shape))) {
            let str = `$${formatLabel} = ${shape}\\left(`;
            let labels = shapeNode.dependsOn.map(id => {
                const node = this.props.dag.get(id)!;
                let label = node.type.props.label;
                const subscriptMap: Record<string, string> = {
                    '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
                    '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9'
                };

                return label.replace(/([A-Za-z]+)([₀₁₂₃₄₅₆₇₈₉]+)/g, (_, letter, subs) => {
                    const normal = (subs as string).split('').map(ch => subscriptMap[ch] || ch).join('');
                    return `${letter}_{${normal}}`;
                });
            });
            
            labels.slice(0, 2).forEach(label => {
                str += label + ",";
            });

            str = str.slice(0, -1) + "\\right)$";
            return str;
        }

        else {
            let verb = (shape === 'Translation' ? 'Translate' : (shape === 'Rotation' ? 'Rotate' : (shape === 'Reflection' ? 'Reflect' : 'Dilate')));
            let str: string = `$${formatLabel} = ${verb}\\left(`;
            if (verb === 'Translate' || verb === 'Reflect') {
                let labels = shapeNode.dependsOn.map(id => {
                    const node = this.props.dag.get(id)!;
                    let label = node.type.props.label;
                    const subscriptMap: Record<string, string> = {
                        '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
                        '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9'
                    };

                    return label.replace(/([A-Za-z]+)([₀₁₂₃₄₅₆₇₈₉]+)/g, (_, letter, subs) => {
                        const normal = (subs as string).split('').map(ch => subscriptMap[ch] || ch).join('');
                        return `${letter}_{${normal}}`;
                    });
                });

                labels.slice(0, 2).forEach(label => {
                    str += label + ",";
                });

                str = str.slice(0, -1) + "\\right)$"; 
            }

            else if (verb === 'Rotate') {
                let labels = shapeNode.dependsOn.map(id => {
                    const node = this.props.dag.get(id)!;
                    let label = node.type.props.label;
                    const subscriptMap: Record<string, string> = {
                        '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
                        '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9'
                    };

                    return label.replace(/([A-Za-z]+)([₀₁₂₃₄₅₆₇₈₉]+)/g, (_, letter, subs) => {
                        const normal = (subs as string).split('').map(ch => subscriptMap[ch] || ch).join('');
                        return `${letter}_{${normal}}`;
                    });
                });
                
                labels.slice(0, 2).forEach(label => {
                    str += label + ",";
                });

                str += ((shapeNode.rotationFactor!.CCW ? -1 : 1) * shapeNode.rotationFactor!.degree).toString() + "^\\circ\\right)$";
            }

            else {
                let labels = shapeNode.dependsOn.map(id => id.split('-')[id.length - 1]);
                labels.forEach(label => {
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
                    width: this.props.width,
                    height: this.props.height,
                    display: 'flex',
                    flexDirection: 'row',
                    backgroundColor: '#f9f9f9',
                    overflow: 'auto',
                }}
            >
                <div style={{position: "relative", zoom: "1",  height: "100%"}}>
                    <div
                        className="Tree algebraView"
                        style={{position: "relative", zoom: "1", minHeight: "444px"}}>
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
                                            console.log(visible);
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