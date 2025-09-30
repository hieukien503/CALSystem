import React from "react";
import { Point, GeometryState, Shape, ShapeNode, DrawingMode, HistoryEntry } from '../../../types/geometry'
import Dialogbox from "../../Dialogbox/Dialogbox";
import ErrorDialogbox from "../../Dialogbox/ErrorDialogbox";

interface TimelineItem {
    object: string;
    start: number;
    end: number;
    action: string;
    tweens?: string[];
}

interface AnimationToolProps {
    width: number;
    height: number;
    dag: Map<string, ShapeNode>;
    timeline: TimelineItem[];
    setTimeline: React.Dispatch<React.SetStateAction<TimelineItem[]>>;
    selectedPoints: Point[];
    selectedShapes: Shape[];
}

interface AnimationToolState {
    activeButton: string | null;
    initialX: number;
    initialEnd: number;
    selectedIndex: number | null;
}

export class AnimationTool extends React.Component<
    AnimationToolProps,
    AnimationToolState
> {
    constructor(props: AnimationToolProps) {
        super(props);
        this.state = {
            activeButton: null,
            initialX: 0,
            initialEnd: 0,
            selectedIndex: null,
        };
    }

    ///** Add tween to selected timeline item */
    //addTweenToSelected(tween: string) {
    //    const { selectedIndex, setTimeline } = this.props;
    //    if (selectedIndex === null) return;
    //    setTimeline(prev => {
    //        const updated = [...prev];
    //        const item = updated[selectedIndex];
    //        if (!item.tweens) item.tweens = [];
    //        item.tweens.push(tween);
    //        item.action = item.action + " + " + tween;
    //        return updated;
    //    });
    //}

    handleTimeEdit = (field: "start" | "end") => {
        const { selectedIndex } = this.state;
        if (selectedIndex === null) return;
        const current = this.props.timeline[selectedIndex][field];
        const newVal = window.prompt(`Enter new ${field} value:`, String(current));
        if (newVal !== null) {
            const num = parseFloat(newVal);
            if (!isNaN(num)) {
                this.props.setTimeline(prev => {
                    const updated = [...prev];
                    updated[selectedIndex] = { ...updated[selectedIndex], [field]: num };
                    return updated;
                });
            }
        }
    };

    setActiveTool(toolKey: string) {
        this.setState({ activeButton: toolKey });

        if (toolKey === "translate") {
            this.handleMoveObject();
        } else if (toolKey === "rotate") {
            this.handleRotateObject();
        } else if (toolKey === "scale") {
            this.handleScaleObject();
        }
    }

    /** Add or merge a tween into the timeline for a specific object */
    addOrMergeTween(name: string, tween: string, actionLabel: string) {
        this.props.setTimeline(prev => {
            // Clone to avoid mutating state directly
            const updated = [...prev];

            // Find the **last timeline item** for this object
            const lastIndex = updated
                .map((item, index) => ({ item, index }))
                .filter(({ item }) => item.object === name)
                .map(({ index }) => index)
                .pop(); // get last occurrence

            if (lastIndex !== undefined) {
                const lastItem = updated[lastIndex];
                // Merge into the last item
                if (!lastItem.tweens) lastItem.tweens = [];
                lastItem.tweens.push(tween);
                lastItem.action += " + " + actionLabel;
            } else {
                // Otherwise, create a new timeline item after all others
                const existingItems = updated.filter(item => item.object === name);

                let newStart = 1;
                let newEnd = 3;
                if (existingItems.length > 0) {
                    const lastEnd = Math.max(...existingItems.map(item => item.end));
                    newStart = lastEnd;
                    newEnd = lastEnd + 2;
                }

                updated.push({
                    object: name,
                    start: newStart,
                    end: newEnd,
                    action: actionLabel,
                    tweens: [tween],
                });
            }

            return updated;
        });
    }

    /** Translate (Move) handler */
    handleMoveObject() {
        const { selectedPoints, selectedShapes } = this.props;

        if (selectedShapes.length === 0 && selectedPoints.length === 0) return;

        const name =
            selectedShapes.length > 0
                ? selectedShapes[0].props.id
                : selectedPoints[0].props.id;

        // For now: fixed tween — later you could get dx,dy from user
        const tween = "translate(10, 0)";
        const actionLabel = "Translate (10, 0)";

        this.addOrMergeTween(name, tween, actionLabel);
    }

    /** Rotate handler */
    handleRotateObject() {
        const { selectedPoints, selectedShapes } = this.props;

        if (selectedShapes.length === 0 && selectedPoints.length === 0) return;

        const name =
            selectedShapes.length > 0
                ? selectedShapes[0].props.id
                : selectedPoints[0].props.id;

        const angleStr = window.prompt("Enter rotation angle (degrees):", "90");
        if (angleStr === null) return;
        const angle = parseFloat(angleStr);
        if (isNaN(angle)) return;

        const tween = `rotate(${angle})`;
        const actionLabel = `Rotate ${angle}°`;

        this.addOrMergeTween(name, tween, actionLabel);
    }

    /** Scale handler */
    handleScaleObject() {
        const { selectedPoints, selectedShapes } = this.props;

        if (selectedShapes.length === 0 && selectedPoints.length === 0) return;

        const name =
            selectedShapes.length > 0
                ? selectedShapes[0].props.id
                : selectedPoints[0].props.id;

        const factorStr = window.prompt("Enter scale factor:", "1.5");
        if (factorStr === null) return;
        const factor = parseFloat(factorStr);
        if (isNaN(factor)) return;

        const tween = `scale(${factor})`;
        const actionLabel = `Scale x${factor}`;

        this.addOrMergeTween(name, tween, actionLabel);
    }

    renderTransformOptions() {
        const { activeButton } = this.state;
        if (!activeButton) return null;

        if (activeButton === "translate") {
            return (
                <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                    <label>dx:</label>
                    <input
                        id="translate-dx"
                        type="number"
                        defaultValue={10}
                        style={{ width: "60px" }}
                    />
                    <label>dy:</label>
                    <input
                        id="translate-dy"
                        type="number"
                        defaultValue={0}
                        style={{ width: "60px" }}
                    />
                    <button onClick={() => this.handleMoveObject()}>Apply</button>
                </div>
            );
        }

        if (activeButton === "rotate") {
            return (
                <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                    <label>Angle:</label>
                    <input
                        id="rotate-angle"
                        type="number"
                        defaultValue={90}
                        style={{ width: "60px" }}
                    />
                    <button onClick={() => this.handleRotateObject()}>Apply</button>
                </div>
            );
        }

        if (activeButton === "scale") {
            return (
                <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                    <label>Factor:</label>
                    <input
                        id="scale-factor"
                        type="number"
                        defaultValue={1.5}
                        step="0.1"
                        style={{ width: "60px" }}
                    />
                    <button onClick={() => this.handleScaleObject()}>Apply</button>
                </div>
            );
        }

        return null;
    }

    handleExport = () => {
        console.log("Export timeline:", this.props.timeline);
        // You could serialize to JSON and trigger download here
    };

    handlePlay = () => {
        const { timeline } = this.props;
        console.log("▶ Playing timeline...");

        const sortedTimeline = [...timeline].sort((a, b) => a.start - b.start);

        sortedTimeline.forEach(item => {
            const delay = item.start * 1000;
            const duration = (item.end - item.start) * 1000;

            setTimeout(() => {
                console.log(`⏩ ${item.object}: Start "${item.action}"`);
                if (item.tweens) {
                    item.tweens.forEach(tween => {
                        this.applyTween(item.object, tween);
                    });
                }
            }, delay);

            setTimeout(() => {
                console.log(`✅ ${item.object}: Finished "${item.action}"`);
            }, delay + duration);
        });
    };

    applyTween(objectId: string, tween: string) {
        const shapeNode = this.props.dag.get(objectId);
        console.log("objectId: ", objectId);
        console.log("tween: ", tween);
        console.log("shapeNode: ", shapeNode);

        if (!shapeNode) return;

        const konvaNode = shapeNode.node;

        if (!konvaNode) return;

        // ✅ Parse tween like "rotate(90)" or "move(50,30)"
        const tweenRegex = /^(\w+)\((.*)\)$/;
        const match = tween.match(tweenRegex);

        let tweenName = tween;
        let args: string[] = [];

        if (match) {
            tweenName = match[1];         // e.g. "rotate"
            args = match[2].split(",").map(a => a.trim());  // e.g. ["90"]
        }

        switch (tweenName.toLowerCase()) {
            case "translate": {
                // move(dx, dy)
                const dx = parseFloat(args[0] || "0");
                const dy = parseFloat(args[1] || "0");
                konvaNode.to({
                    x: konvaNode.x() + dx,
                    y: konvaNode.y() + dy,
                    duration: 0.5,
                });
                break;
            }

            case "rotate": {
                // rotate(degree)
                const degree = parseFloat(args[0] || "0");
                konvaNode.to({
                    rotation: konvaNode.rotation() + degree,
                    duration: 0.5,
                });

                // ✅ optionally store to ShapeNode.rotationFactor for persistent state
                shapeNode.rotationFactor = {
                    degree,
                    CCW: false, // or true if you handle direction separately
                };
                break;
            }

            case "scale": {
                // scale(factor)
                const factor = parseFloat(args[0] || "1");
                konvaNode.to({
                    scaleX: konvaNode.scaleX() * factor,
                    scaleY: konvaNode.scaleY() * factor,
                    duration: 0.5,
                });

                shapeNode.scaleFactor = (shapeNode.scaleFactor ?? 1) * factor;
                break;
            }

            default:
                console.warn(`Unknown tween type: ${tweenName}`);
        }
    }

    renderTimelineGrid() {
        const { timeline } = this.props;
        const { selectedIndex } = this.state;
        const selectedItem = selectedIndex !== null ? timeline[selectedIndex] : null;

        // Find the maximum "end" value among timeline items
        const maxEnd = timeline.length > 0 ? Math.max(...timeline.map(t => t.end)) : 0;
        const totalColumns = Math.max(6, maxEnd + 4);

        return (
            <div style={{ marginTop: "12px" }}>
                <div className="text-left mb-2 font-bold">Timeline</div>

                {/* Scrollable container */}
                <div
                    style={{
                        maxHeight: "200px",
                        overflowX: "auto",
                        overflowY: "auto",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        padding: "4px",
                        background: "#fff",
                    }}
                >
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: `80px repeat(${totalColumns}, 1fr)`, // dynamic length
                            minWidth: `${80 + totalColumns * 40}px` // 40px per time cell approx
                        }}
                    >
                        <div style={{ fontWeight: "bold" }}>Second</div>
                        {Array.from({ length: totalColumns }).map((_, i) => (
                            <div key={i} style={{ textAlign: "left" }}>
                                {i}
                            </div>
                        ))}

                        {Object.entries(
                            timeline.reduce((acc, item) => {
                                if (!acc[item.object]) acc[item.object] = [];
                                acc[item.object].push(item);
                                return acc;
                            }, {} as Record<string, TimelineItem[]>)
                        ).map(([objectName, items], rowIndex) => (
                            <React.Fragment key={objectName}>
                                {/* Object label in first column */}
                                <div
                                    style={{
                                        gridRow: `${rowIndex + 2}`,
                                        gridColumn: `1`,
                                        textAlign: "center",
                                        whiteSpace: "nowrap",
                                        background: "#f5f5f5",
                                        borderRight: "1px solid #ddd"
                                    }}
                                >
                                    {objectName}
                                </div>

                                {/* All actions for this object */}
                                {items.map((item, itemIdx) => (
                                    <div
                                        key={`${objectName}-${itemIdx}`}
                                        style={{
                                            gridRow: `${rowIndex + 2}`,
                                            gridColumn: `${item.start + 2} / ${item.end + 2}`,
                                            background: "white",
                                            border: "1px solid black",
                                            textAlign: "center",
                                            cursor: "pointer",
                                        }}
                                        onClick={() =>
                                            this.setState({
                                                selectedIndex: timeline.indexOf(item), // works since item reference matches
                                            })
                                        }
                                    >
                                        {item.action}
                                    </div>
                                ))}
                            </React.Fragment>
                        ))}

                    </div>
                </div>

                {/* Start/End Editor */}
                {selectedItem && (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            marginTop: "12px",
                            marginBottom: "12px"
                        }}
                    >
                        <div
                            style={{
                                width: "100px",
                                padding: "4px",
                                textAlign: "left",
                                background: "#f7f7f7"
                            }}
                        >
                            {selectedItem.object}
                        </div>
                        <label>Start</label>
                        <div
                            onClick={() => this.handleTimeEdit("start")}
                            style={{
                                width: "60px",
                                padding: "4px",
                                border: "1px solid #ccc",
                                borderRadius: "6px",
                                textAlign: "center",
                                cursor: "pointer",
                                background: "#f7f7f7"
                            }}
                        >
                            {selectedItem.start}
                        </div>

                        <label>End</label>
                        <div
                            onClick={() => this.handleTimeEdit("end")}
                            style={{
                                width: "60px",
                                padding: "4px",
                                border: "1px solid #ccc",
                                borderRadius: "6px",
                                textAlign: "center",
                                cursor: "pointer",
                                background: "#f7f7f7"
                            }}
                        >
                            {selectedItem.end}
                        </div>
                    </div>
                )}
                {/* Transform Options Box */}
                {this.renderTransformOptions()}
            </div>
        );
    }

    render(): React.ReactNode {
        const tools = [
            {
                key: "translate",
                label: "Translate",
                title: "Move selected object or add new",
                onClick: () => this.setActiveTool("translate")
            },
            {
                key: "rotate",
                label: "Rotate",
                title: "...",
                onClick: () => this.setActiveTool("rotate")
            },
            {
                key: "reflect",
                label: "Reflect",
                title: "...",
                onClick: () => this.setActiveTool("reflect")
            },
            {
                key: "scale",
                label: "Scale",
                title: "...",
                onClick: () => this.setActiveTool("scale")
            },
        ];

        return (
            <div
                className="customScrollBar"
                style={{
                    position: "relative",
                    width: this.props.width,
                    height: this.props.height,
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#f9f9f9",
                    overflow: "auto",
                    padding: "8px 16px 14px 16px"
                }}
            >

                {/* Timeline Grid */}
                {this.renderTimelineGrid()}

                {/* Export / Play buttons */}
                <div className="d-flex justify-content-evenly items-center mb-4" style={{ marginTop: "12px" }}>
                    <button
                        className="p-1"
                        style={{
                            background: "white",
                            border: "1px solid black",
                            textAlign: "center"
                        }}
                        onClick={this.handleExport}
                    >
                        Export
                    </button>
                    <button
                        className="p-1"
                        style={{
                            background: "white",
                            border: "1px solid black",
                            textAlign: "center"
                        }}
                        onClick={this.handlePlay}
                    >
                        ▶ Play
                    </button>

                </div>
                {/* Tool panel */}
                <div className="catLabel text-neutral-900 mb-2">Animation Tools</div>
                <div className="categoryPanel" style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                    {tools.map(tool => (
                        <button
                            key={tool.key}
                            type="button"
                            className={`toolButton${this.state.activeButton === tool.key ? " selected" : ""
                                }`}
                            onClick={tool.onClick}
                            title={tool.title}
                        >
                            <div className="label">{tool.label}</div>
                        </button>
                    ))}
                </div>
            </div>
        );
    }
}
