import React from "react";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import * as utils from "../../../utils/utilities"
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
}

class AlgebraItem extends React.Component<AlgebraItemProps, {}> {
    render(): React.ReactNode {
        const color = utils.convert2RGB(this.props.color);
        const borderColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`
        const backgroundColor = this.props.shapeVisible ? `rgb(${color[0]}, ${color[1]}, ${color[2]}, 0.4)` : "rgb(255, 255, 255)";
        return (
            <div style={{padding: '3px 3px 3px 23px', width: this.props.width, marginLeft: '0px', position: 'relative'}}
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
                                style={this.props.hidden ? {backgroundColor: "rgb(255, 255, 255)"} : {borderWidth: '1px', borderStyle: 'solid', borderColor: borderColor, backgroundColor: backgroundColor}}>
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
                this.tex = node.toTex();
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
}

class AlgebraTool3D extends React.Component<AlgebraTool3DProps, AlgebraTool3DState> {
    constructor(props: AlgebraTool3DProps) {
        super(props);
        this.state = {
            items: [],
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
        const shape = shapeNode.type.type;
        if (shape === 'Point') {
            if (shapeNode.id.includes('tmpPoint')) {
                let label = shapeNode.id;
                return `$Text${label.replace('tmpPoint', '')} = "${shapeNode.type.props.label}"$`;
            }
            
            return `$${shapeNode.type.props.label} = \\left(${((shapeNode.type as GeometryShape.Point).x.toFixed(2))},${(shapeNode.type as GeometryShape.Point).y.toFixed(2)}\\right)$`
        }
        
        else if (shape === 'Line') {
            return `$${shapeNode.type.props.label} = Line\\left(${(shapeNode.type as GeometryShape.Line).startLine.props.label},${(shapeNode.type as GeometryShape.Line).endLine.props.label}\\right)$`
        }

        else if (shape === 'Segment') {
            return `$${shapeNode.type.props.label} = Segment\\left(${(shapeNode.type as GeometryShape.Segment).startSegment.props.label},${(shapeNode.type as GeometryShape.Segment).endSegment.props.label}\\right)$`
        }

        else if (shape === 'Vector') {
            return `$${shapeNode.type.props.label} = Vector\\left(${(shapeNode.type as GeometryShape.Vector).startVector.props.label},${(shapeNode.type as GeometryShape.Vector).endVector.props.label}\\right)$`
        }

        else if (shape === 'Ray') {
            return `$${shapeNode.type.props.label} = Ray\\left(${(shapeNode.type as GeometryShape.Ray).startRay.props.label},${(shapeNode.type as GeometryShape.Ray).endRay.props.label}\\right)$`
        }

        else if (['Polygon', 'RegularPolygon'].includes(shape)) {
            let stringOfLabels = '';
            let points = (shapeNode.type as GeometryShape.Polygon).points;
            points.forEach(point => {
                stringOfLabels = stringOfLabels + point.props.label;
            });

            return `$${shapeNode.type.props.label} = ${shape}\\left(${stringOfLabels}\\right)$`
        }

        else if (shape === 'Circle') {
            return `$${shapeNode.type.props.label} = Circle\\left(${(shapeNode.type as GeometryShape.Circle).centerC.props.label},${(shapeNode.type as GeometryShape.Circle).radius}\\right)$`
        }

        else if (shape === 'Intersection') {
            let str = `$${shapeNode.type.props.label} = ${shape}\\left(`
            let labels = shapeNode.dependsOn.map(id => id.split('-')[id.length - 1]);
            labels.forEach(label => {
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
            let str = `$${shapeNode.type.props.label} = ${shape}\\left(`
            let labels = shapeNode.dependsOn.map(id => id.split('-')[id.length - 1]);
            labels.forEach(label => {
                str += label + ",";
            });

            str = str.slice(0, -1) + "\\right)$";
            return str;
        }

        else {
            let verb = (shape === 'Translation' ? 'Translate' : (shape === 'Rotation' ? 'Rotate' : (shape === 'Reflection' ? 'Reflect' : 'Dilate')));
            let str: string = `$${shapeNode.type.props.label} = ${verb}\\left(`;
            if (verb === 'Translate' || verb === 'Reflect') {
                let labels = shapeNode.dependsOn.map(id => id.split('-')[id.length - 1]);
                labels.forEach(label => {
                    str += label + ",";
                });

                str = str.slice(0, -1) + "\\right)$"; 
            }

            else if (verb === 'Rotate') {
                let labels = shapeNode.dependsOn.map(id => id.split('-')[id.length - 1]);
                labels.forEach(label => {
                    str += label + ",";
                });

                str += (shapeNode.rotationFactor!.azimuth).toString() + "," + (shapeNode.rotationFactor!.polar).toString() + "\\right)$";
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
                                    />
                                );
                            }
                            
                            else if (item.type === 'input') {
                                return (
                                    <AlgebraItem
                                        key={`input-${index}`}
                                        color="white"
                                        isSelected={false}
                                        width={this.props.width}
                                        description={`$${item.latex}$`}
                                        onClick={() => {}}
                                        shapeVisible={true}
                                        hidden={false}
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