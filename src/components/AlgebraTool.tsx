import React from "react";
import { ShapeNode, ShapeNode3D } from "../types/geometry";

interface AlgebraToolProps {
    width: number;
    height: number;
    dag: Map<string, ShapeNode>;
}

class AlgebraTool extends React.Component<AlgebraToolProps, {}> {
    constructor(props: AlgebraToolProps) {
        super(props);
    }
};

export default AlgebraTool;