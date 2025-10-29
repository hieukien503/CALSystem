import React from "react";
import MoreVertIcon from '@mui/icons-material/MoreVert'
import * as utils from "../../../utils/utilities"
import * as GeometryShape from "../../../types/geometry"
import Latex from 'react-latex'

interface AlgebraItemProps {
    color: string;
    isSelected: boolean;
    description: string;
    shapeVisible: boolean;
    hidden: boolean;
    onClick: (e: React.MouseEvent) => void;
    onToggleVisibility: (e: React.MouseEvent) => void; // <-- added
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

interface AlgebraToolProps {
    width: number;
    height: number;
    dag: Map<string, GeometryShape.ShapeNode>;
    onSelect: (id: string, e: React.MouseEvent) => void;
    onUpdateDAG: (dag: Map<string, GeometryShape.ShapeNode>) => void;
}

class AlgebraTool extends React.Component<AlgebraToolProps, {}> {
    private createDescription = (shapeNode: GeometryShape.ShapeNode): string => {
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

                str += ((shapeNode.rotationFactor!.CCW ? 1 : -1) * shapeNode.rotationFactor!.degree).toString() + "^\\circ\\right)$";
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
        const entries = Array.from(this.props.dag.entries()).filter(value => !value[1].id.includes('tmpLine'));
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
                    overflow: 'auto',
                }}
            >
                <div style={{position: "relative", zoom: "1", height: "100%", width: '100%'}}>
                    <div
                        className="Tree algebraView"
                        style={{position: "relative", zoom: "1", height: '100%'}}>
                    {entries.map(value => {
                        return (
                            <AlgebraItem
                                key={value[1].id}
                                color={value[1].defined ? value[1].type.props.color : "white"}
                                isSelected={value[1].isSelected}
                                description={this.createDescription(value[1])}
                                onClick={(e) => this.props.onSelect(value[1].id, e)}
                                shapeVisible={value[1].type.props.visible.shape}
                                onToggleVisibility={() => {
                                    const visible = value[1].type.props.visible;
                                    console.log(visible);
                                    value[1].type.props.visible.shape = !visible.shape;
                                    if ('x' in value[1].type && 'y' in value[1].type) {
                                        value[1].type.props.visible.label = value[1].type.props.visible.shape;
                                    }

                                    this.props.onUpdateDAG(utils.cloneDAG(this.props.dag));
                                }}
                                hidden={!value[1].defined}
                            />
                        )
                    })}
                    </div>
                </div>
            </div>
        )
    }
};

export default AlgebraTool;