import React from "react";
import { ShapeNode } from "../types/geometry";
import MoreVertIcon from '@mui/icons-material/MoreVert'
import * as utils from "../utils/utilities"
import Latex from 'react-latex'

interface AlgebraItemProps {
    color: string;
    isSelected: boolean;
    width: number;
    description: string;
}

class AlgebraItem extends React.Component<AlgebraItemProps, {}> {
    constructor(props: AlgebraItemProps) {
        super(props);
    }

    render(): React.ReactNode {
        const color = utils.convert2RGB(this.props.color);
        const borderColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`
        const backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]}), 0.4`
        return (
            <div style={{padding: '3px 3px 3px 23px', width: this.props.width, marginLeft: '0px', position: 'relative'}}
                className="avItem"
            >
                <div 
                    className="treeItem"
                    style={{display: "inline"}}
                >
                    <div className="elem">
                        <div className="marblePanel">
                            <div className="marble"
                                style={{borderColor: borderColor, backgroundColor: backgroundColor}}>
                            </div>
                        </div>
                        <div className="algebraViewObjectStylebar"
                            style={{right: "0px"}}>
                                <button type="button" className="button more">
                                    <MoreVertIcon />
                                </button>
                        </div>
                        <div className="elemText">
                            <div className="avPlainText" style={{fontSize: "16px"}}>
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
    dag: Map<string, ShapeNode>;
}

class AlgebraTool extends React.Component<AlgebraToolProps, {}> {
    constructor(props: AlgebraToolProps) {
        super(props);
    }

    private createDescription = (shapeNode: ShapeNode): void => {
        const type = shapeNode.type;
    }
};

export default AlgebraTool;