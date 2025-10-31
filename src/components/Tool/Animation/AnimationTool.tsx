import React from "react";
import { Point, Shape, ShapeNode } from '../../../types/geometry'
import Dialogbox from "../../Dialogbox/Dialogbox";
import ErrorDialogbox from "../../Dialogbox/ErrorDialogbox";

interface TimelineItem {
    object: string;
    start: number;
    end: number;
    action: string;
    values?: Record<string, any>;
}

interface AnimationToolProps {
    width: number;
    height: number;
    dag: Map<string, ShapeNode>;
    timeline: TimelineItem[];
    setTimeline: React.Dispatch<React.SetStateAction<TimelineItem[]>>;
    selectedPoints: Point[];
    selectedShapes: Shape[];
    stageRef: React.RefObject<any>;
}

interface AnimationToolState {
    activeButton: string | null;
    initialX: number;
    initialEnd: number;
    selectedIndex: number | null;
    pointerTime: number;      // timeline pointer
    isPlaying: boolean;       // playback status
    playInterval?: NodeJS.Timeout | null; // pointer update interval
    rotationPivotTarget: string | null;
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
            pointerTime: 0,
            isPlaying: false,
            playInterval: null,
            rotationPivotTarget: null,
        };
    }

    handleTimeEdit = (field: "start" | "end") => {
        const { selectedIndex } = this.state;
        if (selectedIndex === null) return;

        const item = this.props.timeline[selectedIndex];
        const current = item[field];
        const newVal = window.prompt(`Enter new ${field} value:`, String(current));

        if (newVal !== null) {
            const num = parseFloat(newVal);
            if (!isNaN(num)) {
                this.props.setTimeline(prev => {
                    const updated = [...prev];
                    const currentItem = { ...updated[selectedIndex], [field]: num };

                    // ✅ Ensure end > start
                    if (currentItem.start >= currentItem.end) {
                        if (field === "start") {
                            currentItem.end = currentItem.start + 1;
                        } else if (field === "end") {
                            currentItem.start = currentItem.end - 1;
                        }
                    }

                    updated[selectedIndex] = currentItem;
                    return updated;
                });
            }
        }
    };


    setActiveTool(toolKey: string) {
        // Remove stale listeners before switching tools
        this.props.dag.forEach(s => s.node?.off("click"));

        this.setState({ activeButton: toolKey, rotationPivotTarget: null });

        if (toolKey === "translate") {
            this.handleMoveObject();
        } else if (toolKey === "rotate") {
            this.handleRotateObject();
        } else if (toolKey === "scale") {
            this.handleScaleObject();
        }
    }

    /** Add or merge a transform into the timeline */
    addOrMergeTransform(objectId: string, transformType: string, value: number, label: string) {
        this.props.setTimeline(prev => {
            const updated = [...prev];
            const { selectedIndex } = this.state;

            // ✅ CASE A: Editing an active timeline item
            if (
                selectedIndex !== null &&
                updated[selectedIndex] &&
                updated[selectedIndex].object === objectId
            ) {
                const item = { ...updated[selectedIndex] };
                item.values = { ...(item.values ?? {}), [transformType]: value };

                // Optional: auto-update readable action
                item.action = this.updateActionLabel(item.values);

                updated[selectedIndex] = item;
                return updated;
            }

            // ✅ CASE B: Not editing → create a new timeline item
            const lastIndex = updated
                .map((it, i) => ({ it, i }))
                .filter(({ it }) => it.object === objectId)
                .map(({ i }) => i)
                .pop();

            const newStart = lastIndex !== undefined ? updated[lastIndex].end : 1;
            const newItem = {
                object: objectId,
                start: newStart,
                end: newStart + 2,
                action: label,
                values: { [transformType]: value },
            };

            updated.push(newItem);
            return updated;
        });
    }

    handleMoveObject() {
        const { stageRef, selectedPoints, selectedShapes } = this.props;
        const stage = stageRef?.current;
        if (!stage) {
            alert("Stage not available");
            return;
        }

        if (selectedShapes.length === 0 && selectedPoints.length === 0) return;

        const name =
            selectedShapes.length > 0
                ? selectedShapes[0].props.id
                : selectedPoints[0].props.id;

        alert("Click the destination position to move the object to.");

        // Wait for user click
        const clickHandler = (e: any) => {
            const pos = stage.getPointerPosition();
            if (!pos) return;

            // Optional: Confirm the destination
            const confirm = window.confirm(`Move ${name} to (${pos.x.toFixed(1)}, ${pos.y.toFixed(1)})?`);
            if (!confirm) {
                stage.off("click", clickHandler);
                return;
            }

            // Add or merge the transform into timeline
            this.props.setTimeline(prev => {
                const updated = [...prev];
                const { selectedIndex } = this.state;

                // --- Case A: Update existing item ---
                if (
                    selectedIndex !== null &&
                    updated[selectedIndex] &&
                    updated[selectedIndex].object === name
                ) {
                    const item = { ...updated[selectedIndex] };
                    item.values = {
                        ...(item.values ?? {}),
                        translateTo: { x: pos.x, y: pos.y },
                    };
                    item.action = `Translate (${pos.x.toFixed(1)}, ${pos.y.toFixed(1)})`;
                    updated[selectedIndex] = item;
                    return updated;
                }

                // --- Case B: Create new item ---
                const lastIndex = updated
                    .map((it, i) => ({ it, i }))
                    .filter(({ it }) => it.object === name)
                    .map(({ i }) => i)
                    .pop();

                const newStart = lastIndex !== undefined ? updated[lastIndex].end : 1;
                updated.push({
                    object: name,
                    start: newStart,
                    end: newStart + 2,
                    action: `Translate (${pos.x.toFixed(1)}, ${pos.y.toFixed(1)})`,
                    values: { translateTo: { x: pos.x, y: pos.y } },
                });

                return updated;
            });

            // Clean up
            stage.off("click", clickHandler);
        };

        stage.on("click", clickHandler);
    }

    /** Re-select translate destination for current transition */
    handleReselectDestination = () => {
        const { selectedIndex } = this.state;
        const { stageRef, timeline, setTimeline } = this.props;
        if (selectedIndex === null) return;

        const stage = stageRef?.current;
        if (!stage) {
            alert("Stage not available");
            return;
        }

        const selectedItem = timeline[selectedIndex];
        if (!selectedItem) return;

        alert("Click new destination position for transition.");

        const clickHandler = (e: any) => {
            const pos = stage.getPointerPosition();
            if (!pos) return;

            const confirm = window.confirm(`Set new destination to (${pos.x.toFixed(1)}, ${pos.y.toFixed(1)})?`);
            if (!confirm) {
                stage.off("click", clickHandler);
                return;
            }

            // Update the selected timeline item's translateTo value
            setTimeline(prev => {
                const updated = [...prev];
                const item = { ...updated[selectedIndex] };
                item.values = { ...(item.values ?? {}), translateTo: { x: pos.x, y: pos.y } };
                item.action = `Translate (${pos.x.toFixed(1)}, ${pos.y.toFixed(1)})`;
                updated[selectedIndex] = item;
                return updated;
            });

            stage.off("click", clickHandler);
        };

        stage.on("click", clickHandler);
    };


    handleRotateObject() {
        const { stageRef, selectedPoints, selectedShapes } = this.props;
        const stage = stageRef?.current;
        if (!stage) {
            alert("Stage not available");
            return;
        }

        if (selectedShapes.length === 0 && selectedPoints.length === 0) return;
        const name =
            selectedShapes.length > 0
                ? selectedShapes[0].props.id
                : selectedPoints[0].props.id;

        alert("Click a point on canvas to set the rotation center");

        const clickHandler = (e: any) => {
            const pos = stage.getPointerPosition();
            if (!pos) return;

            const angleStr = window.prompt("Enter rotation angle (degrees):", "90");
            if (angleStr === null) {
                stage.off("click", clickHandler);
                return;
            }

            const angle = parseFloat(angleStr);
            if (isNaN(angle)) {
                stage.off("click", clickHandler);
                return;
            }

            // ✅ Flat pivotX / pivotY
            this.props.setTimeline(prev => {
                const updated = [...prev];
                const lastIndex = updated
                    .map((it, i) => ({ it, i }))
                    .filter(({ it }) => it.object === name)
                    .map(({ i }) => i)
                    .pop();

                const newStart = lastIndex !== undefined ? updated[lastIndex].end : 1;
                updated.push({
                    object: name,
                    start: newStart,
                    end: newStart + 2,
                    action: `Rotate ${angle}° around (${pos.x.toFixed(1)}, ${pos.y.toFixed(1)})`,
                    values: {
                        rotate: angle,
                        pivotX: pos.x,
                        pivotY: pos.y,
                        ccw: false,
                    },
                });
                return updated;
            });

            stage.off("click", clickHandler);
        };

        stage.on("click", clickHandler);
    }



    handleReselectRotationPivot = () => {
        const { selectedIndex } = this.state;
        const { stageRef, timeline, setTimeline } = this.props;
        if (selectedIndex === null) return;

        const stage = stageRef?.current;
        if (!stage) {
            alert("Stage not available");
            return;
        }

        const selectedItem = timeline[selectedIndex];
        if (!selectedItem || !selectedItem.values?.rotate) return;

        alert("Click new pivot point for rotation.");

        const clickHandler = (e: any) => {
            const pos = stage.getPointerPosition();
            if (!pos) return;

            const confirm = window.confirm(
                `Set new pivot point to (${pos.x.toFixed(1)}, ${pos.y.toFixed(1)})?`
            );
            if (!confirm) {
                stage.off("click", clickHandler);
                return;
            }

            // ✅ Update flat pivotX/pivotY
            setTimeline(prev => {
                const updated = [...prev];
                const item = { ...updated[selectedIndex] };

                item.values = {
                    ...(item.values ?? {}),
                    pivotX: pos.x,
                    pivotY: pos.y
                };
                item.action = `Rotate ${item.values.rotate}° around (${pos.x.toFixed(1)}, ${pos.y.toFixed(1)})`;

                updated[selectedIndex] = item;
                return updated;
            });

            stage.off("click", clickHandler);
        };

        stage.on("click", clickHandler);
    };



    handleScaleObject() {
        const { selectedPoints, selectedShapes } = this.props;
        if (selectedShapes.length === 0 && selectedPoints.length === 0) return;

        const name = selectedShapes.length > 0
            ? selectedShapes[0].props.id
            : selectedPoints[0].props.id;

        const factorStr = window.prompt("Enter scale factor:", "1.5");
        if (factorStr === null) return;
        const factor = parseFloat(factorStr);
        if (isNaN(factor)) return;

        this.addOrMergeTransform(name, "scale", factor, `Scale x${factor}`);
    }

    handleExport = () => {
        console.log("Export timeline:", this.props.timeline);
        // You could serialize to JSON and trigger download here
    };

    /** Reset all objects to initial state (Return button) */
    handleReset = () => {
        this.props.dag.forEach(shapeNode => {
            const node = shapeNode.node;
            if (!node) return;
            node.to({ x: 0, y: 0, rotation: 0, scaleX: 1, scaleY: 1, duration: 0 });
        });
        this.setState({ pointerTime: 0, isPlaying: false });
        if (this.state.playInterval) clearInterval(this.state.playInterval);
        console.log("🔄 Reset all animations to original state");
    };


    handlePlay = () => {
        const sorted = [...this.props.timeline].sort((a, b) => a.start - b.start);
        const maxEnd = sorted.length ? Math.max(...sorted.map(t => t.end)) : 0;
        this.startPointerAnimation(maxEnd);

        sorted.forEach(item => {
            const delay = item.start * 1000;
            const duration = (item.end - item.start) * 1000;

            setTimeout(() => {
                console.log(`⏩ ${item.object}: Start "${item.action}"`);
                console.log(`item.values: ${item.values}`);
                if (item.values) this.applyValues(item.object, item.values, (item.end - item.start));
            }, delay);

            setTimeout(() => {
                console.log(`✅ ${item.object}: Finished "${item.action}"`);
            }, delay + duration);
        });
    };

    handlePause = () => {
        const { isPlaying, playInterval } = this.state;

        if (isPlaying) {
            // ⏸ Pause playback
            if (playInterval) clearInterval(playInterval);
            this.setState({ isPlaying: false, playInterval: null });
            console.log("⏸ Paused at", this.state.pointerTime.toFixed(2), "s");
        } else {
            // ▶ Resume playback
            const sorted = [...this.props.timeline].sort((a, b) => a.start - b.start);
            const maxEnd = sorted.length ? Math.max(...sorted.map(t => t.end)) : 0;
            this.resumePointerAnimation(maxEnd);
            console.log("▶ Resumed playback");
        }
    };

    /** Start timeline pointer animation */
    startPointerAnimation(maxTime: number) {
        const start = performance.now();
        const interval = setInterval(() => {
            const elapsed = (performance.now() - start) / 1000;
            if (elapsed >= maxTime) {
                clearInterval(interval);
                this.setState({ pointerTime: 0, isPlaying: false });
            } else {
                this.setState({ pointerTime: elapsed });
            }
        }, 50);
        this.setState({ playInterval: interval, isPlaying: true });
    }


    applyValues(objectId: string, values: Record<string, any>, durationSec: number) {
        const shapeNode = this.props.dag.get(objectId);
        if (!shapeNode || !shapeNode.node) return;

        const node = shapeNode.node;
        const anim = { duration: durationSec } as any;

        console.log("Animating:", objectId, values);

        // --- Handle Rotation ---
        if ("rotate" in values) {
            anim.rotation = node.rotation() + (values.ccw ? - values.rotate : values.rotate);
            console.log("CCW: ", values.ccw);
            shapeNode.rotationFactor = { degree: values.rotate, CCW: false };
        }

        // --- Handle Scaling ---
        if ("scale" in values) {
            anim.scaleX = node.scaleX() * values.scale;
            anim.scaleY = node.scaleY() * values.scale;
            shapeNode.scaleFactor = (shapeNode.scaleFactor ?? 1) * values.scale;
        }

        // --- Handle Absolute Move (Translate To) ---
        if ("translateTo" in values && values.translateTo) {
            const { x: targetX, y: targetY } = values.translateTo;

            const currentX = node.x();
            const currentY = node.y();

            const dx = targetX - currentX;
            const dy = targetY - currentY;

            // Compute transition speed (units per second)
            const durationSec = values.durationSec ?? 1; // fallback if missing
            const speedX = dx / durationSec;
            const speedY = dy / durationSec;

            anim.x = currentX + speedX;
            anim.y = currentY + speedY;
        }

        // --- Fallback: Relative Move ---
        else if ("translateX" in values || "translateY" in values) {
            const dx = values.translateX ?? 0;
            const dy = values.translateY ?? 0;

            const durationSec = values.durationSec ?? 1;
            const speedX = dx / durationSec;
            const speedY = dy / durationSec;

            anim.x = node.x() + speedX;
            anim.y = node.y() + speedY;
        }

        node.to(anim);
    }

    // helper
    capitalize(s: string) {
        if (!s) return s;
        return s.charAt(0).toUpperCase() + s.slice(1);
    };


    handleValueEdit = (key: string) => {
        const { selectedIndex } = this.state;
        if (selectedIndex === null) return;
        const selectedItem = this.props.timeline[selectedIndex];
        const currentVal = selectedItem.values?.[key] ?? 0;

        const newVal = window.prompt(`Enter new value for ${this.capitalize(key)}:`, String(currentVal));
        if (newVal !== null) {
            const num = parseFloat(newVal);
            if (!isNaN(num)) {
                this.props.setTimeline(prev => {
                    const updated = [...prev];
                    const item = { ...updated[selectedIndex] };
                    item.values = { ...(item.values ?? {}), [key]: num };
                    item.action = this.updateActionLabel(item.values); // ✅ auto rename
                    updated[selectedIndex] = item;
                    return updated;
                });
            } else {
                alert("Please enter a valid number.");
            }
        }
    };


    handleDeleteSelected = () => {
        const { selectedIndex } = this.state;
        if (selectedIndex === null) return;

        if (!window.confirm("Delete selected animation?")) return;

        this.props.setTimeline(prev => prev.filter((_, i) => i !== selectedIndex));
        this.setState({ selectedIndex: null });
    };

    /** Delete a specific transform (animation line) */
    handleDeleteTransform = (key: string) => {
        const { selectedIndex } = this.state;
        if (selectedIndex === null) return;
        this.props.setTimeline(prev => {
            const updated = [...prev];
            const item = { ...updated[selectedIndex] };
            if (item.values) delete item.values[key];
            item.action = this.updateActionLabel(item.values ?? {});
            updated[selectedIndex] = item;
            return updated;
        });
    };


    /** Rebuilds the action string from the values object */
    updateActionLabel(values: Record<string, number>) {
        if ("translateX" in values || "translateY" in values) {
            const dx = values.translateX ?? 0;
            const dy = values.translateY ?? 0;
            return `Translate (${dx}, ${dy})`;
        }

        if ("rotate" in values) {
            return `Rotate ${values.rotate}°`;
        }

        if ("scale" in values) {
            return `Scale ×${values.scale}`;
        }

        // fallback for unknown transforms
        const readable = Object.keys(values)
            .map(k => this.capitalize(k))
            .join(", ");
        return readable || "Transform";
    }


    resumePointerAnimation(maxTime: number) {
        const start = performance.now() - this.state.pointerTime * 1000; // resume from where left off
        const interval = setInterval(() => {
            const elapsed = (performance.now() - start) / 1000;
            if (elapsed >= maxTime) {
                clearInterval(interval);
                this.setState({ pointerTime: 0, isPlaying: false });
            } else {
                this.setState({ pointerTime: elapsed });
            }
        }, 50);
        this.setState({ playInterval: interval, isPlaying: true });
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
                        position: "relative", // add this
                        maxHeight: "200px",
                        overflowX: "auto",
                        overflowY: "auto",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        padding: "4px",
                        background: "#fff",
                    }}
                >
                    {/* Black pointer */}
                    <div
                        style={{
                            position: "absolute",
                            top: "0",
                            left: `calc(80px + ${(this.state.pointerTime / totalColumns) * (100 - 80 / totalColumns)}%)`,
                            width: "3px",
                            height: "100%",
                            background: "black",
                            transition: "left 0.05s linear",
                            overflow: "visible",
                            zIndex: 2,
                        }}
                    />
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: `80px repeat(${totalColumns}, 1fr)`, // dynamic length
                            minWidth: `${80 + totalColumns * 40}px` // 40px per time cell approx
                        }}
                        onClick={(e) => {
                            // Deselect if clicked directly on grid background
                            if (e.target === e.currentTarget) {
                                this.setState({ selectedIndex: null });
                            }
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
                                        borderRight: "1px solid #ddd",
                                        overflow: "hidden",
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
                                            background: selectedIndex === timeline.indexOf(item) ? "#87CEFA" : "white",
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
                    <div className="d-flex flex-column">
                        <div
                            style={{
                                width: "100%",
                                padding: "4px",
                                textAlign: "left",
                                background: "#f7f7f7"
                            }}
                        >
                            {selectedItem.object}
                        </div>
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
                                Basic{/*selectedItem.object*/}
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
                            <button
                                onClick={this.handleDeleteSelected}
                                style={{ border: "1px solid black", background: "white", padding: "4px 8px" }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>

                    
                )}

                {/* Timeline Animation Editor */}
                {selectedItem && selectedItem.values && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
                        {
                            Object.entries(selectedItem.values).map(([key, val]) => {
                                if (key === "translateTo" && val && typeof val === "object") {
                                    return (
                                        <div key={key} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                            <div style={{ width: "100px" }}>Translate To</div>
                                            <div
                                                style={{
                                                    width: "120px",
                                                    padding: "4px",
                                                    border: "1px solid #ccc",
                                                    borderRadius: "6px",
                                                    textAlign: "center",
                                                    background: "#f7f7f7"
                                                }}
                                            >
                                                ({val.x.toFixed(1)}, {val.y.toFixed(1)})
                                            </div>
                                            <button
                                                onClick={this.handleReselectDestination}
                                                style={{
                                                    border: "1px solid black",
                                                    background: "white",
                                                    padding: "2px 6px",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                Re-select
                                            </button>
                                            <button
                                                onClick={() => this.handleDeleteTransform(key)}
                                                style={{
                                                    border: "1px solid black",
                                                    background: "white",
                                                    padding: "2px 6px",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    );
                                }
                                else if (key === "rotate") {
                                    const pivotX = selectedItem.values?.pivotX;
                                    const pivotY = selectedItem.values?.pivotY;
                                    const ccw = selectedItem.values?.ccw ?? false;

                                    return (
                                        <div>
                                            <div key={key} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                <div style={{ width: "100px" }}>Rotate</div>

                                                <div
                                                    onClick={() => this.handleValueEdit(key)}
                                                    style={{
                                                        width: "80px",
                                                        padding: "4px",
                                                        border: "1px solid #ccc",
                                                        borderRadius: "6px",
                                                        textAlign: "center",
                                                        cursor: "pointer",
                                                        background: "#f7f7f7"
                                                    }}
                                                >
                                                    {val}°
                                                </div>

                                                {/*{pivotX !== undefined && pivotY !== undefined && (*/}
                                                {/*    <div*/}
                                                {/*        style={{*/}
                                                {/*            padding: "4px",*/}
                                                {/*            border: "1px solid #ddd",*/}
                                                {/*            background: "#fafafa",*/}
                                                {/*        }}*/}
                                                {/*    >*/}
                                                {/*        Pivot: ({pivotX.toFixed(1)}, {pivotY.toFixed(1)})*/}
                                                {/*    </div>*/}
                                                {/*)}*/}

                                                <button
                                                    onClick={this.handleReselectRotationPivot}
                                                    style={{
                                                        border: "1px solid black",
                                                        background: "white",
                                                        padding: "2px 6px",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    Re-select Pivot
                                                </button>

                                                <button
                                                    onClick={() => this.handleDeleteTransform(key)}
                                                    style={{
                                                        border: "1px solid black",
                                                        background: "white",
                                                        padding: "2px 6px",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                             {/* ✅ Editable CCW toggle (only in Edit Animation) */}
                                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                <label>CCW</label>
                                                <input
                                                    type="checkbox"
                                                    checked={ccw}
                                                    onChange={(e) => {
                                                        const newCCW = e.target.checked;
                                                        this.props.setTimeline(prev => {
                                                            const updated = [...prev];
                                                            const item = { ...updated[this.state.selectedIndex!] };
                                                            item.values = { ...(item.values ?? {}), ccw: newCCW };
                                                            updated[this.state.selectedIndex!] = item;
                                                            return updated;
                                                        });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                }
                                else if (key === "scale") {
                                    // Default for numeric values
                                    return (
                                        <div key={key} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                            <div style={{ width: "100px" }}>{this.capitalize(key)}</div>
                                            <div
                                                onClick={() => this.handleValueEdit(key)}
                                                style={{
                                                    width: "80px",
                                                    padding: "4px",
                                                    border: "1px solid #ccc",
                                                    borderRadius: "6px",
                                                    textAlign: "center",
                                                    cursor: "pointer",
                                                    background: "#f7f7f7"
                                                }}
                                                title={`Edit ${this.capitalize(key)}`}
                                            >
                                                {val}
                                            </div>
                                            <button
                                                onClick={() => this.handleDeleteTransform(key)}
                                                style={{
                                                    border: "1px solid black",
                                                    background: "white",
                                                    padding: "2px 6px",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    );
                                }
                        })}
                    </div>
                )}

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
            //{
            //    key: "reflect",
            //    label: "Reflect",
            //    title: "...",
            //    onClick: () => this.setActiveTool("reflect")
            //},
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
                        onClick={this.handleReset}
                        style={{ border: "1px solid black", background: "white", padding: "4px 8px" }}
                    >
                        ⏪ Return
                    </button>
                    {/* ▶ Play / ⏸ Pause */}
                    {this.state.isPlaying ? (
                        <button
                            onClick={this.handlePause}
                            style={{ border: "1px solid black", background: "white", padding: "4px 8px" }}
                        >
                            ⏸ Pause
                        </button>
                    ) : (
                        <button
                            onClick={this.handlePlay}
                            style={{ border: "1px solid black", background: "white", padding: "4px 8px" }}
                        >
                            ▶ Play
                        </button>
                    )}
                    <button
                        onClick={this.handleExport}
                        style={{ border: "1px solid black", background: "white", padding: "4px 8px" }}
                    >
                        Export
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
