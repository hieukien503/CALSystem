import * as THREE from 'three';

interface GridProps {
    size: number;
    gridSpacing: number;
    originX: number;
    originY: number;
    originZ: number;
}

class ThreeGrid {
    private props: GridProps;
    constructor(props: GridProps) {
        this.props = props
    }

    generateGrid = (): THREE.GridHelper => {
        const grid = new THREE.GridHelper(this.props.size, this.props.size * this.props.gridSpacing);
        grid.position.set(this.props.originX + (this.props.size % 2 === 0 ? 0 : 0.5), this.props.originY, this.props.originZ + (this.props.size % 2 === 0 ? 0 : 0.5));
        return grid;
    }
}

export default ThreeGrid;