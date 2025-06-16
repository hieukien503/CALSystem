import Konva from 'konva';

interface GridProps {
    width: number;
    height: number;
    gridColor: string;
    gridSize: number;
    strokeWidth: number;
    originX: number;
    originY: number;
    opacity: number;
}

export class KonvaGrid {
    private props: GridProps;

    constructor(props: GridProps) {
        this.props = props;
    }

    generateGrid(
        layerPosition: {x: number, y: number}, scale: number, split: number
    ): Konva.Group {
        const { width, height, gridColor, gridSize, strokeWidth, originX, originY, opacity } = this.props;
        const group = new Konva.Group();
        
        // Calculate visible area based on layer position and scale
        const visibleLeft = -layerPosition.x / scale;
        const visibleRight = (width - layerPosition.x) / scale;
        const visibleTop = -layerPosition.y / scale;
        const visibleBottom = (height - layerPosition.y) / scale;

        // Calculate grid spacing based on scale and split
        const scaledGridSize = gridSize * split;
        
        // Calculate the starting points for grid lines
        const startX = Math.floor(visibleLeft / scaledGridSize) * scaledGridSize;
        const startY = Math.floor(visibleTop / scaledGridSize) * scaledGridSize;
        
        // Calculate the ending points for grid lines
        const endX = Math.ceil(visibleRight / scaledGridSize) * scaledGridSize;
        const endY = Math.ceil(visibleBottom / scaledGridSize) * scaledGridSize;

        // Generate vertical grid lines
        for (let x = originX; x <= endX; x += scaledGridSize) {
            // Skip if line is too far from visible area
            if (x < visibleLeft - scaledGridSize || x > visibleRight + scaledGridSize) continue;

            group.add(new Konva.Line({
                points: [x, visibleTop, x, visibleBottom],
                stroke: gridColor,
                strokeWidth: strokeWidth,
                opacity: opacity,
                listening: false, // Improve performance by disabling event listening,
                strokeScaleEnabled: false // Disable stroke scaling for consistent appearance
            }));
        }

        for (let x = originX - scaledGridSize; x >= startX; x -= scaledGridSize) {
            // Skip if line is too far from visible area
            if (x < visibleLeft - scaledGridSize || x > visibleRight + scaledGridSize) continue;
            group.add(new Konva.Line({
                points: [x, visibleTop, x, visibleBottom],
                stroke: gridColor,
                strokeWidth: strokeWidth, // Scale stroke width inversely with zoom
                opacity: opacity,
                listening: false, // Improve performance by disabling event listening
                strokeScaleEnabled: false // Disable stroke scaling for consistent appearance
            }));
        }

        // Generate horizontal grid lines
        for (let y = originY; y <= endY; y += scaledGridSize) {
            // Skip if line is too far from visible area
            if (y < visibleTop - scaledGridSize || y > visibleBottom + scaledGridSize) continue;

            group.add(new Konva.Line({
                points: [visibleLeft, y, visibleRight, y],
                stroke: gridColor,
                strokeWidth: strokeWidth, // Scale stroke width inversely with zoom
                opacity: opacity,
                listening: false, // Improve performance by disabling event listening
                strokeScaleEnabled: false // Disable stroke scaling for consistent appearance
            }));
        }

        for (let y = originY - scaledGridSize; y >= startY; y -= scaledGridSize) {
            // Skip if line is too far from visible area
            if (y < visibleTop - scaledGridSize || y > visibleBottom + scaledGridSize) continue;

            group.add(new Konva.Line({
                points: [visibleLeft, y, visibleRight, y],
                stroke: gridColor,
                strokeWidth: strokeWidth, // Scale stroke width inversely with zoom
                opacity: opacity,
                listening: false, // Improve performance by disabling event listening
                strokeScaleEnabled: false // Disable stroke scaling for consistent appearance
            }));
        }

        return group;
    }
}
