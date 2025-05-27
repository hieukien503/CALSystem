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

// Utility functions
function printRTL(text: string, originX: number, originY: number, opacity: number): Konva.Text[] {
    const chars = text.split('');
    let currentX = originX;
    const texts: Konva.Text[] = [];
    
    for (let i = chars.length - 1; i >= 0; i--) {
        const char = chars[i];
        const temp = new Konva.Text({
            text: char,
            fontSize: FONT_CONFIG.fontSize,
            fontFamily: FONT_CONFIG.fontFamily,
        });

        const text = new Konva.Text({
            text: char,
            fontSize: FONT_CONFIG.fontSize,
            fontFamily: FONT_CONFIG.fontFamily,
            x: currentX - (char.charCodeAt(0) >= 48 && char.charCodeAt(0) <= 57 ? 2 * temp.width() : 2.75 * temp.width()),
            y: originY,
            opacity: opacity,
            verticalAlign: 'middle',
            align: 'center',
            listening: false
        });

        texts.push(text);
        currentX -= temp.width();
    }

    return texts;
}

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

        layerText.destroyChildren(); // Clear previous text layer
        
        // Calculate visible area based on layer position and scale
        const visibleLeft = -layerPosition.x / scale;
        const visibleRight = (width - layerPosition.x) / scale;
        const visibleTop = -layerPosition.y / scale;
        const visibleBottom = (height - layerPosition.y) / scale;

        // Calculate scaled dimensions
        const scaledAxisWidth = axisWidth / scale;
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
            listening: false
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
            listening: false
        });
        group.add(yAxis);

        // Helper function to format tick labels
        const formatTickLabel = (value: number): string => {
            let format = Math.log10(axisTickInterval) >= 0 ? 0 : Math.ceil(-Math.log10(axisTickInterval));
            const formatted = Number(value.toFixed(format));
            if (Math.abs(formatted) >= 1000000 || (Math.abs(formatted) <= 0.000001 && formatted > 0)) {
                return formatted.toExponential(1);
            }

            return formatted.toString();
        };

        // Draw x-axis ticks and labels
        const drawXTicks = (start: number, end: number, step: number, forward: boolean) => {
            for (let x = start; (forward ? x <= end : x >= end); x = forward ? x + step : x - step) {
                if (x < visibleLeft - step || x > visibleRight + step) continue;

                const x_stage = (x * scale) + layerPosition.x;
                const y_stage = (originY * scale) + layerPosition.y;

                // Draw label
                const labelText = formatTickLabel((x - originX) / xTickSpacing);
                let tmpLabel = new Konva.Text({
                    text: labelText,
                    fontSize: FONT_CONFIG.fontSize,
                    fontFamily: FONT_CONFIG.fontFamily,
                })
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
                const labelText = formatTickLabel((originY - y) / xTickSpacing);
                const texts = printRTL(
                    labelText,
                    x_stage,
                    (y === originY ? y_stage - FONT_CONFIG.fontSize : y_stage - 0.6 * LABEL_OFFSET),
                    opacity
                );
                
                texts.forEach(text => layerText.add(text));
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