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
                                    <MoreVertIcon style={{backgroundColor: 'rgb(249, 249, 249)'}}/>
                                </button>
                        </div>
                        <div className="elemText" style={{
                            overflow: 'hidden',
                            flex: 1,
                            minWidth: 0
                        }}>
                            <div className="avPlainText" style={{
                                fontSize: "12px",
                                display: "inline-block",
                                verticalAlign: "middle"
                            }}>
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
    private textId: number;
    constructor(props: AlgebraToolProps) {
        super(props);
        this.textId = 0;
    }

    componentDidUpdate(prevProps: Readonly<AlgebraToolProps>, prevState: Readonly<{}>, snapshot?: any): void {
        this.textId = 0;
    }

    private formatNumbers = (num: number): string => {
        return parseFloat(num.toFixed(2)).toString();
    }

    private createDescription = (shapeNode: GeometryShape.ShapeNode): string => {
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

        const shape = shapeNode.type.type;
        if (shape === 'Point') {
            if (shapeNode.id.includes('tmpPoint')) {
                this.textId += 1;
                return `$Text${this.textId}: "${formatLabel(label)}"$`;
            }
            
            return `$\\mathrm{${formatLabel(label)}} = \\left(${this.formatNumbers((shapeNode.type as GeometryShape.Point).x)},${this.formatNumbers((shapeNode.type as GeometryShape.Point).y)}\\right)$`
        }
        
        else if (shape === 'Line') {
            return `$\\mathrm{${formatLabel(label)}}: \\mathrm{Line}\\left(${formatLabel((shapeNode.type as GeometryShape.Line).startLine.props.label)},${formatLabel((shapeNode.type as GeometryShape.Line).endLine.props.label)}\\right)$`
        }

        else if (shape === 'Segment') {
            const v = {
                x: (shapeNode.type as GeometryShape.Segment).endSegment.x - (shapeNode.type as GeometryShape.Segment).startSegment.x,
                y: (shapeNode.type as GeometryShape.Segment).endSegment.y - (shapeNode.type as GeometryShape.Segment).startSegment.y,
            }

            const segmentLength = Math.sqrt(v.x ** 2 + v.y ** 2);
            return String.raw`
            \[
            \begin{array}{l}
            \mathrm{${formatLabel(label)}}: \mathrm{Segment}\left(${formatLabel((shapeNode.type as GeometryShape.Segment).startSegment.props.label)},${formatLabel((shapeNode.type as GeometryShape.Segment).endSegment.props.label)}\right)\\
            Length = ${this.formatNumbers(segmentLength)}
            \end{array}
            \]`
        }

        else if (shape === 'Vector') {
            const dir = {
                x: (shapeNode.type as GeometryShape.Vector).endVector.x - (shapeNode.type as GeometryShape.Vector).startVector.x,
                y: (shapeNode.type as GeometryShape.Vector).endVector.y - (shapeNode.type as GeometryShape.Vector).startVector.y,
            }
            return String.raw`
            \[
            \begin{array}{l}
            \mathrm{${formatLabel(label)}}: \mathrm{Vector}\left(${formatLabel((shapeNode.type as GeometryShape.Vector).startVector.props.label)},${formatLabel((shapeNode.type as GeometryShape.Vector).endVector.props.label)}\right))\\
            = = \begin{pmatrix}
            ${this.formatNumbers(dir.x)}\\
            ${this.formatNumbers(dir.y)}
            \end{pmatrix}
            \end{array}
            \]
            `
        }

        else if (shape === 'Ray') {
            return `$\\mathrm{${formatLabel(label)}}: \\mathrm{Ray}\\left(${formatLabel((shapeNode.type as GeometryShape.Ray).startRay.props.label)},${formatLabel((shapeNode.type as GeometryShape.Ray).endRay.props.label)}\\right)$`
        }

        else if (['Polygon', 'RegularPolygon'].includes(shape)) {
            let stringOfLabels: string[] = [];
            let points = (shapeNode.type as GeometryShape.Polygon).points;
            points.forEach(point => {
                stringOfLabels.push(formatLabel(point.props.label));
            });

            return String.raw`
            \[
            \begin{array}{l}
            \mathrm{${formatLabel(label)}}: \mathrm{${shape}}\left(${stringOfLabels.join(',')}\right)\\
            Area = ${this.formatNumbers((shapeNode.type as GeometryShape.Polygon).area ?? 0)}
            \end{array}
            \]
            `
        }

        else if (shape === 'Circle') {
            return String.raw`
            \[
            \begin{array}{l}
            \mathrm{${formatLabel(label)}}: \mathrm{Vector}\left(${formatLabel((shapeNode.type as GeometryShape.Circle).centerC.props.label)},${(shapeNode.type as GeometryShape.Circle).radius}\right)\\
            Area = ${this.formatNumbers((shapeNode.type as GeometryShape.Circle).area ?? 0)}
            \end{array}
            \]
            `
        }

        else if (shape === 'Intersection' || shape === 'Midpoint') {
            let str = String.raw`
                \[
                \begin{array}{l}
                \mathrm{${formatLabel(label)}}: \mathrm{${shape === 'Midpoint' && shapeNode.dependsOn.length === 1 ? 'Center' : shape}}\left(
            `
            let labels = shapeNode.dependsOn.map(id => {
                const node = this.props.dag.get(id)!;
                let label = node.type.props.label;
                return formatLabel(label);
            });
            
            if (shape === 'Intersection' || (shape === 'Midpoint' && labels.length === 2)) {
                labels.slice(0, 2).forEach(label => {
                    str += label + ",";
                });
            }
            
            else {
                console.log(labels);
                labels.forEach(label => {
                    str += label + ",";
                });
            }

            str = str.slice(0, -1) + "\\right)\\\\=";
            if (shapeNode.defined) {
                str += `\\left(${this.formatNumbers((shapeNode.type as GeometryShape.Point).x)},${this.formatNumbers((shapeNode.type as GeometryShape.Point).y)}\\right)`
            }

            else {
                str += `undefined`
            }

            str += String.raw`\end{array}\]`;

            return str;
        }

        else if (['Incircle', 'Circumcircle', 'Excircle'].includes(shape)) {
            let str = `$\\mathrm{${formatLabel(label)}}: \\mathrm{${shape}}\\left(`;
            let labels = shapeNode.dependsOn.map(id => {
                const node = this.props.dag.get(id)!;
                let label = node.type.props.label;
                return formatLabel(label);
            });

            labels.forEach(label => {
                str += label + ",";
            });

            str = str.slice(0, -1) + "\\right)$";
            return str;
        }

        else if (!(['Translation', 'Rotation', 'Reflection', 'Enlarge'].includes(shape))) {
            let str = String.raw
            `\[
            \begin{array}{l}
            \mathrm{${formatLabel(label)}}: \mathrm{${shape}}\left(`;
            let labels = shapeNode.dependsOn.map(id => {
                const node = this.props.dag.get(id)!;
                let label = node.type.props.label;
                return formatLabel(label);
            });
            
            labels.slice(0, 2).forEach(label => {
                str += label + ",";
            });

            str = str.slice(0, -1) + "\\right)";
            if (shapeNode.type.type === 'Angle') {
                const v1 = {
                    x: (shapeNode.type as GeometryShape.Angle).vector1.endVector.x - (shapeNode.type as GeometryShape.Angle).vector1.startVector.x,
                    y: (shapeNode.type as GeometryShape.Angle).vector1.endVector.y - (shapeNode.type as GeometryShape.Angle).vector1.startVector.y
                }

                const v2 = {
                    x: (shapeNode.type as GeometryShape.Angle).vector2.endVector.x - (shapeNode.type as GeometryShape.Angle).vector2.startVector.x,
                    y: (shapeNode.type as GeometryShape.Angle).vector2.endVector.y - (shapeNode.type as GeometryShape.Angle).vector2.startVector.y
                }

                const angleFromXAxis = (v: {x: number, y: number}): number => {
                    let degree = Math.atan2(v.y, v.x) * 180 / Math.PI;
                    if (degree < 0) {
                        degree += 360;
                    }

                    return degree;
                }

                let angle = angleFromXAxis(v2) - angleFromXAxis(v1);
                if ((shapeNode.type as GeometryShape.Angle).range && (shapeNode.type as GeometryShape.Angle).range[1] === 180) {
                    angle = (angle < 0 ? angle + 180 : angle);
                }

                else {
                    angle = (angle < 0 ? angle + 360 : angle);
                }

                str += String.raw`
                    \\= ${this.formatNumbers(Math.abs(angle))}^{\circ}
                `
            }

            str += String.raw`\end{array}\]`
            return str;
        }

        else {
            let verb = (shape === 'Translation' ? 'Translate' : (shape === 'Rotation' ? 'Rotate' : (shape === 'Reflection' ? 'Reflect' : 'Dilate')));
            let str: string = `$\\mathrm{${formatLabel(label)}}: \\mathrm{${verb}}\\left(`;
            if (verb === 'Translate' || verb === 'Reflect') {
                let labels = shapeNode.dependsOn.map(id => {
                    const node = this.props.dag.get(id)!;
                    let label = node.type.props.label;
                    return formatLabel(label);
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
                    return formatLabel(label);
                });
                
                labels.slice(0, 2).forEach(label => {
                    str += label + ",";
                });

                str += ((shapeNode.rotationFactor!.CCW ? 1 : -1) * shapeNode.rotationFactor!.degree).toString() + "^\\circ\\right)$";
            }

            else {
                let labels = shapeNode.dependsOn.map(id => {
                    const node = this.props.dag.get(id)!;
                    let label = node.type.props.label;
                    return formatLabel(label);
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
                    overflowX: 'hidden',
                    overflowY: 'auto'
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