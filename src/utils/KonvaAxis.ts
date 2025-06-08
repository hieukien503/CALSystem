import Konva from 'konva';

interface AxisProps {
    width: number;
    height: number;
    axisColor: string;
    axisWidth: number;
    pointerWidth: number;
    pointerLength: number;
    xTickSpacing: number;
    originX: number;
    originY: number;
    opacity: number;
}

// Constants for font and styling
const FONT_CONFIG = {
    fontSize: 10,
    fontFamily: 'Arial'
};

const LABEL_OFFSET = 5;

export class KonvaAxis {
    private props: AxisProps;

    constructor(props: AxisProps) {
        this.props = props;
    }

    generateAxis(
        axisTickInterval: number,
        layerPosition: {x: number, y: number},
        scale: number,
        layerText: Konva.Layer
    ): Konva.Group {
        const { width, height, axisColor, axisWidth, pointerWidth, pointerLength, xTickSpacing, originX, originY, opacity } = this.props;
        const group = new Konva.Group();
        
        // Calculate visible area based on layer position and scale
        const visibleLeft = -layerPosition.x / scale;
        const visibleRight = (0.75 * width - layerPosition.x) / scale;
        const visibleTop = -layerPosition.y / scale;
        const visibleBottom = (height - layerPosition.y) / scale;

        // Calculate scaled dimensions
        const scaledAxisWidth = axisWidth;
        const scaledPointerWidth = pointerWidth / scale;
        const scaledPointerLength = pointerLength / scale;
        const scaledTickSpacing = xTickSpacing * axisTickInterval;

        // Draw x-axis
        const xAxis = new Konva.Arrow({
            points: [visibleLeft, originY, visibleRight, originY],
            stroke: axisColor,
            strokeWidth: scaledAxisWidth,
            pointerWidth: scaledPointerWidth,
            pointerLength: scaledPointerLength,
            opacity: opacity,
            listening: false,
            fill: axisColor,
            strokeScaleEnabled: false
        });

        group.add(xAxis);

        // Draw y-axis
        const yAxis = new Konva.Arrow({
            points: [originX, visibleBottom, originX, visibleTop],
            stroke: axisColor,
            strokeWidth: scaledAxisWidth,
            pointerWidth: scaledPointerWidth,
            pointerLength: scaledPointerLength,
            opacity: opacity,
            listening: false,
            fill: axisColor,
            strokeScaleEnabled: false,
        });

        group.add(yAxis);

        // Draw x-axis ticks and labels
        const drawXTicks = (start: number, end: number, step: number, forward: boolean) => {
            for (let x = start; (forward ? x <= end : x >= end); x = forward ? x + step : x - step) {
                if (x < visibleLeft - step || x > visibleRight + step) continue;

                const x_stage = (x * scale) + layerPosition.x;
                const y_stage = (originY * scale) + layerPosition.y;

                // Draw label
                let useSci = (x !== originX) && (Math.abs((x - originX) / xTickSpacing) <= 1e-6 || Math.abs((x - originX) / xTickSpacing) >= 1e6);
                const formatTickLabel = (value: number): string => {
                    if (useSci) {
                        return value.toExponential(1);
                    }
                    
                    else {
                        return value.toFixed(6).replace(/\.?0+$/, ''); // Remove trailing zeros
                    }
                };

                const labelText = formatTickLabel((x - originX) / xTickSpacing);
                let tmpLabel = new Konva.Text({
                    text: labelText,
                    fontSize: FONT_CONFIG.fontSize,
                    fontFamily: FONT_CONFIG.fontFamily,
                });

                const label = new Konva.Text({
                    text: labelText,
                    x: x_stage - tmpLabel.width() / 2 + (x === originX ? LABEL_OFFSET : 0),
                    y: y_stage + LABEL_OFFSET,
                    fontSize: FONT_CONFIG.fontSize,
                    fontFamily: FONT_CONFIG.fontFamily,
                    opacity: opacity,
                    align: 'left',
                    verticalAlign: 'middle',
                    listening: false
                });

                layerText.add(label);
            }
        };

        // Draw y-axis ticks and labels
        const drawYTicks = (start: number, end: number, step: number, forward: boolean) => {
            for (let y = start; (forward ? y <= end : y >= end); y = forward ? y + step : y - step) {
                if (y < visibleTop - step || y > visibleBottom + step) continue;

                const x_stage = (originX * scale) + layerPosition.x;
                const y_stage = (y * scale) + layerPosition.y;

                // Draw label
                let useSci = (y !== originY) && (Math.abs((originY - y) / xTickSpacing) <= 1e-6 || Math.abs((originY - y) / xTickSpacing) >= 1e6);
                const formatTickLabel = (value: number): string => {
                    if (useSci) {
                        return value.toExponential(1);
                    }
                    
                    else {
                        return value.toFixed(6).replace(/\.?0+$/, ''); // Remove trailing zeros
                    }
                };
                const labelText = formatTickLabel((originY - y) / xTickSpacing);
                const tmpLabel = new Konva.Text({
                    text: labelText,
                    fontSize: FONT_CONFIG.fontSize,
                    fontFamily: FONT_CONFIG.fontFamily,
                });

                const label = new Konva.Text({
                    text: labelText,
                    x: x_stage - LABEL_OFFSET - tmpLabel.width(), // Position LABEL_OFFSET pixels to the left of the axis
                    y: y_stage - LABEL_OFFSET, // Center the label vertically at y_stage_center
                    fontSize: FONT_CONFIG.fontSize,
                    fontFamily: FONT_CONFIG.fontFamily,
                    opacity: opacity,
                    align: 'right', // Align text content to its right x-coordinate
                    verticalAlign: 'middle', // Position text so its middle is at `y`
                    listening: false
                });

                if (y === originY) {
                    label.x(x_stage - 2 * LABEL_OFFSET); // Move right
                    label.y(y_stage - 2 * LABEL_OFFSET); // Center vertically
                    label.align('left'); // Align left
                }

                layerText.add(label);
            }
        };

        // Draw labels
        drawXTicks(originX, visibleRight, scaledTickSpacing, true);
        drawXTicks(originX - scaledTickSpacing, visibleLeft, scaledTickSpacing, false);
        drawYTicks(originY, visibleBottom, scaledTickSpacing, true);
        drawYTicks(originY - scaledTickSpacing, visibleTop, scaledTickSpacing, false);

        return group;
    }
}