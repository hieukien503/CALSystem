// AnimationTool3D.tsx
import React from "react";
import * as THREE from "three";
import { Point, Shape, ShapeNode3D } from '../../../types/geometry'
import Dialogbox from "../../Dialogbox/Dialogbox";
import ErrorDialogbox from "../../Dialogbox/ErrorDialogbox";

interface TimelineItem {
    object: string;
    start: number;
    end: number;
    action: string;
    values?: Record<string, any>;
}

interface AnimationTool3DProps {
    width: number;
    height: number;
    dag: Map<string, ShapeNode3D>;
    timeline: TimelineItem[];
    setTimeline: React.Dispatch<React.SetStateAction<TimelineItem[]>>;
    selectedPoints: Point[];
    selectedShapes: Shape[];
    stageRef?: React.RefObject<any>; // Accept stageRef (Three renderer wrapper or dom element)
}

interface AnimationTool3DState {
    activeButton: string | null;
    initialX: number;
    initialEnd: number;
    selectedIndex: number | null;
    pointerTime: number;      // timeline pointer
    isPlaying: boolean;       // playback status
    playInterval?: NodeJS.Timeout | null; // pointer update interval
    rotationPivotTarget: string | null;
}

export class AnimationTool3D extends React.Component<
    AnimationTool3DProps,
    AnimationTool3DState
> {
    constructor(props: AnimationTool3DProps) {
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

    // -----------------------
    // Helper: get stage dom & camera
    // -----------------------
    private getDomAndCamera() {
        const { stageRef } = this.props;
        if (!stageRef || !stageRef.current) return { dom: null, camera: null };
        const cur = stageRef.current;
        // Common shapes: either wrapper with domElement & camera, or raw dom element
        if (cur.domElement && cur.camera) return { dom: cur.domElement, camera: cur.camera };
        // maybe cur is the renderer
        if ((cur as any).domElement && (cur as any).camera) return { dom: (cur as any).domElement, camera: (cur as any).camera };
        // maybe stageRef.current is the dom element itself and camera passed somewhere else — best we can do:
        return { dom: cur as HTMLElement | null, camera: cur.camera ?? null };
    }

    // Compute world position on z=0 plane from a MouseEvent
    private getWorldPositionFromEvent = (event: MouseEvent): THREE.Vector3 | null => {
        const { dom, camera } = this.getDomAndCamera();
        if (!dom || !camera) {
            console.warn("Stage DOM or camera not available for pointer conversion");
            return null;
        }

        const rect = (dom as HTMLElement).getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        const ndc = new THREE.Vector2(x, y);
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(ndc, camera);

        // Intersect with plane z=0 in world space
        const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        const intersectPoint = new THREE.Vector3();
        const hit = raycaster.ray.intersectPlane(plane, intersectPoint);
        if (!hit) return null;
        return intersectPoint;
    }

    // -----------------------
    // Time editing
    // -----------------------
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

                    // Ensure end > start by at least 1
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

            // CASE A: Editing an active timeline item
            if (
                selectedIndex !== null &&
                updated[selectedIndex] &&
                updated[selectedIndex].object === objectId
            ) {
                const item = { ...updated[selectedIndex] };
                item.values = { ...(item.values ?? {}), [transformType]: value };
                item.action = this.updateActionLabel(item.values);
                updated[selectedIndex] = item;
                return updated;
            }

            // CASE B: Create new item
            const lastIndex = updated
                .map((it, i) => ({ it, i }))
                .filter(({ it }) => it.object === objectId)
                .map(({ i }) => i)
                .pop();

            const newStart = lastIndex !== undefined ? updated[lastIndex].end : 1;
            const newItem: TimelineItem = {
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

    // -----------------------
    // Move: uses world pos from click
    // -----------------------
    handleMoveObject() {
        const { selectedPoints, selectedShapes } = this.props;
        const { dom, camera } = this.getDomAndCamera();
        if (!dom || !camera) {
            alert("Stage or camera not available");
            return;
        }

        if (selectedShapes.length === 0 && selectedPoints.length === 0) return;

        const name =
            selectedShapes.length > 0
                ? selectedShapes[0].props.id
                : selectedPoints[0].props.id;

        alert("Click the destination position to move the object to.");

        const clickHandler = (ev: MouseEvent) => {
            const pos = this.getWorldPositionFromEvent(ev);
            if (!pos) return;

            const confirm = window.confirm(`Move ${name} to (${pos.x.toFixed(1)}, ${pos.y.toFixed(1)}, ${pos.z.toFixed(1)})?`);
            if (!confirm) return;

            this.props.setTimeline(prev => {
                const updated = [...prev];
                const { selectedIndex } = this.state;

                if (
                    selectedIndex !== null &&
                    updated[selectedIndex] &&
                    updated[selectedIndex].object === name
                ) {
                    const item = { ...updated[selectedIndex] };
                    item.values = {
                        ...(item.values ?? {}),
                        translateTo: { x: pos.x, y: pos.y, z: pos.z }
                    };
                    item.action = `Translate (${pos.x.toFixed(1)}, ${pos.y.toFixed(1)}, ${pos.z.toFixed(1)})`;
                    updated[selectedIndex] = item;
                    return updated;
                }

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
                    action: `Translate (${pos.x.toFixed(1)}, ${pos.y.toFixed(1)}, ${pos.z.toFixed(1)})`,
                    values: { translateTo: { x: pos.x, y: pos.y, z: pos.z } },
                });

                return updated;
            });

            // remove listener
            (dom as HTMLElement).removeEventListener("click", clickHandler);
        };

        (dom as HTMLElement).addEventListener("click", clickHandler);
    }

    /** Re-select translate destination for current transition */
    handleReselectDestination = () => {
        const { selectedIndex } = this.state;
        const { timeline, setTimeline } = this.props;
        const { dom, camera } = this.getDomAndCamera();
        if (selectedIndex === null) return;
        if (!dom || !camera) {
            alert("Stage or camera not available");
            return;
        }

        const selectedItem = timeline[selectedIndex];
        if (!selectedItem) return;

        alert("Click new destination position for transition.");

        const clickHandler = (ev: MouseEvent) => {
            const pos = this.getWorldPositionFromEvent(ev);
            if (!pos) return;

            const confirm = window.confirm(`Set new destination to (${pos.x.toFixed(1)}, ${pos.y.toFixed(1)}, ${pos.z.toFixed(1)})?`);
            if (!confirm) return;

            setTimeline(prev => {
                const updated = [...prev];
                const item = { ...updated[selectedIndex] };
                item.values = { ...(item.values ?? {}), translateTo: { x: pos.x, y: pos.y, z: pos.z } };
                item.action = `Translate (${pos.x.toFixed(1)}, ${pos.y.toFixed(1)}, ${pos.z.toFixed(1)})`;
                updated[selectedIndex] = item;
                return updated;
            });

            (dom as HTMLElement).removeEventListener("click", clickHandler);
        };

        (dom as HTMLElement).addEventListener("click", clickHandler);
    };

    // -----------------------
    // Rotate: pick pivot in world coordinates and store ccw=false by default
    // -----------------------
    handleRotateObject() {
        const { selectedPoints, selectedShapes } = this.props;
        const { dom, camera } = this.getDomAndCamera();
        if (!dom || !camera) {
            alert("Stage or camera not available");
            return;
        }

        if (selectedShapes.length === 0 && selectedPoints.length === 0) return;
        const name =
            selectedShapes.length > 0
                ? selectedShapes[0].props.id
                : selectedPoints[0].props.id;

        alert("Click a point on canvas to set the rotation center");

        const clickHandler = (ev: MouseEvent) => {
            const pos = this.getWorldPositionFromEvent(ev);
            if (!pos) return;

            const angleStr = window.prompt("Enter rotation angle (degrees):", "90");
            if (angleStr === null) {
                (dom as HTMLElement).removeEventListener("click", clickHandler);
                return;
            }

            const angle = parseFloat(angleStr);
            if (isNaN(angle)) {
                (dom as HTMLElement).removeEventListener("click", clickHandler);
                return;
            }

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
                    action: `Rotate ${angle}° around (${pos.x.toFixed(1)}, ${pos.y.toFixed(1)}, ${pos.z.toFixed(1)})`,
                    values: {
                        rotate: angle,
                        pivotX: pos.x,
                        pivotY: pos.y,
                        pivotZ: pos.z,
                        ccw: false,
                    },
                });
                return updated;
            });

            (dom as HTMLElement).removeEventListener("click", clickHandler);
        };

        (dom as HTMLElement).addEventListener("click", clickHandler);
    }

    handleReselectRotationPivot = () => {
        const { selectedIndex } = this.state;
        const { timeline, setTimeline } = this.props;
        const { dom, camera } = this.getDomAndCamera();
        if (selectedIndex === null) return;
        if (!dom || !camera) {
            alert("Stage or camera not available");
            return;
        }

        const selectedItem = timeline[selectedIndex];
        if (!selectedItem || !selectedItem.values?.rotate) return;

        alert("Click new pivot point for rotation.");

        const clickHandler = (ev: MouseEvent) => {
            const pos = this.getWorldPositionFromEvent(ev);
            if (!pos) return;

            const confirm = window.confirm(
                `Set new pivot point to (${pos.x.toFixed(1)}, ${pos.y.toFixed(1)}, ${pos.z.toFixed(1)})?`
            );
            if (!confirm) return;

            setTimeline(prev => {
                const updated = [...prev];
                const item = { ...updated[selectedIndex] };
                item.values = {
                    ...(item.values ?? {}),
                    pivotX: pos.x,
                    pivotY: pos.y,
                    pivotZ: pos.z
                };
                item.action = `Rotate ${item.values.rotate}° around (${pos.x.toFixed(1)}, ${pos.y.toFixed(1)}, ${pos.z.toFixed(1)})`;
                updated[selectedIndex] = item;
                return updated;
            });

            (dom as HTMLElement).removeEventListener("click", clickHandler);
        };

        (dom as HTMLElement).addEventListener("click", clickHandler);
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
    };

    /** Reset all objects to initial state (Return button) */
    handleReset = () => {
        this.props.dag.forEach(shapeNode => {
            const node = (shapeNode as any).node as THREE.Object3D | undefined;
            if (!node) return;
            node.position.set(0, 0, 0);
            node.rotation.set(0, 0, 0);
            node.scale.set(1, 1, 1);
        });
        this.setState({ pointerTime: 0, isPlaying: false });
        if (this.state.playInterval) clearInterval(this.state.playInterval);
        console.log("🔄 Reset all animations to original state");
    };

    // -----------------------
    // Animation runner
    // Simple interpolator that animates position/rotation/scale over durationSec
    // -----------------------
    private animateObject(node: THREE.Object3D, from: any, to: any, durationSec: number) {
        const startTime = performance.now();
        const durationMs = Math.max(1, durationSec * 1000);

        const tick = (now: number) => {
            const t = Math.min(1, (now - startTime) / durationMs);
            // Lerp position
            if (to.position) {
                node.position.lerpVectors(from.position, to.position, t);
            }
            // Lerp scale
            if (to.scale) {
                node.scale.set(
                    from.scale.x + (to.scale.x - from.scale.x) * t,
                    from.scale.y + (to.scale.y - from.scale.y) * t,
                    from.scale.z + (to.scale.z - from.scale.z) * t
                );
            }
            // Lerp rotation (around Z for 2D-like) using quaternions
            if (to.quaternion) {
                node.quaternion.copy(from.quaternion).slerp(to.quaternion, t);
            }

            if (t < 1) {
                requestAnimationFrame(tick);
            }
        };

        requestAnimationFrame(tick);
    }

    // Rotate an object around a world point (pivot) by angleRad around Z axis
    private rotateAroundWorldPoint(object: THREE.Object3D, point: THREE.Vector3, angleRad: number) {
        // Move object so pivot is origin
        const pivotToObj = object.position.clone().sub(point);

        // Apply rotation around Z
        const cos = Math.cos(angleRad);
        const sin = Math.sin(angleRad);
        const rotated = new THREE.Vector3(
            pivotToObj.x * cos - pivotToObj.y * sin,
            pivotToObj.x * sin + pivotToObj.y * cos,
            pivotToObj.z
        );

        const newPos = point.clone().add(rotated);
        object.position.copy(newPos);

        // Apply rotation to object's quaternion (rotate around world Z)
        const q = new THREE.Quaternion();
        q.setFromAxisAngle(new THREE.Vector3(0, 0, 1), angleRad);
        object.quaternion.premultiply(q); // rotate in world space
    }

    applyValues(objectId: string, values: Record<string, any>, durationSec: number) {
        const shapeNode = this.props.dag.get(objectId) as any as ShapeNode3D | undefined;
        if (!shapeNode || !shapeNode.node) return;

        const node = shapeNode.node as THREE.Object3D;
        console.log("Animating (3D):", objectId, values);

        // Capture start state
        const from = {
            position: node.position.clone(),
            scale: node.scale.clone(),
            quaternion: node.quaternion.clone(),
        };

        const to: any = {};

        // --- Rotation (with pivot and ccw) ---
        if ("rotate" in values) {
            const angleDeg = Number(values.rotate ?? 0);
            const ccw = !!values.ccw;
            const angleRad = ((ccw ? -1 : 1) * angleDeg * Math.PI) / 180;
            const pivotX = values.pivotX ?? node.position.x;
            const pivotY = values.pivotY ?? node.position.y;
            const pivotZ = values.pivotZ ?? node.position.z ?? 0;
            const pivot = new THREE.Vector3(pivotX, pivotY, pivotZ);

            // Precompute target quaternion (apply rotation around world Z)
            const q = new THREE.Quaternion();
            q.setFromAxisAngle(new THREE.Vector3(0, 0, 1), angleRad);
            const targetQuat = node.quaternion.clone();
            targetQuat.premultiply(q); // rotate in world space

            // We will animate both quaternion and position (position changes due to pivot)
            // Compute rotated end position (apply rotation around pivot to start pos)
            const pivotToObj = node.position.clone().sub(pivot);
            const cos = Math.cos(angleRad);
            const sin = Math.sin(angleRad);
            const rotated = new THREE.Vector3(
                pivotToObj.x * cos - pivotToObj.y * sin,
                pivotToObj.x * sin + pivotToObj.y * cos,
                pivotToObj.z
            );
            const endPos = pivot.clone().add(rotated);

            to.position = endPos;
            to.quaternion = targetQuat;
        }

        // --- Scaling ---
        if ("scale" in values) {
            const factor = Number(values.scale ?? 1);
            to.scale = new THREE.Vector3(node.scale.x * factor, node.scale.y * factor, node.scale.z * factor);
        }

        // --- TranslateTo absolute (x,y,z) ---
        if ("translateTo" in values && values.translateTo) {
            const tx = Number(values.translateTo.x ?? node.position.x);
            const ty = Number(values.translateTo.y ?? node.position.y);
            const tz = Number(values.translateTo.z ?? node.position.z);
            to.position = new THREE.Vector3(tx, ty, tz);
        }

        // --- Relative translate ---
        if ("translateX" in values || "translateY" in values || "translateZ" in values) {
            const dx = Number(values.translateX ?? 0);
            const dy = Number(values.translateY ?? 0);
            const dz = Number(values.translateZ ?? 0);
            to.position = new THREE.Vector3(node.position.x + dx, node.position.y + dy, node.position.z + dz);
        }

        // If only rotation specified, ensure we animate quaternion and position (already filled)
        // If nothing to animate, return
        const hasAnim = to.position || to.scale || to.quaternion;
        if (!hasAnim) return;

        // Animate over durationSec
        this.animateObject(node, from, to, durationSec);
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
                    item.action = this.updateActionLabel(item.values); // auto rename
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

    updateActionLabel(values: Record<string, number>) {
        if ("translateX" in values || "translateY" in values || "translateZ" in values) {
            const dx = values.translateX ?? 0;
            const dy = values.translateY ?? 0;
            const dz = values.translateZ ?? 0;
            return `Translate (${dx}, ${dy}, ${dz})`;
        }

        if ("rotate" in values) {
            return `Rotate ${values.rotate}°`;
        }

        if ("scale" in values) {
            return `Scale ×${values.scale}`;
        }

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

    renderTimelineGrid() {
        const { timeline } = this.props;
        const { selectedIndex } = this.state;
        const selectedItem = selectedIndex !== null ? timeline[selectedIndex] : null;

        const maxEnd = timeline.length > 0 ? Math.max(...timeline.map(t => t.end)) : 0;
        const totalColumns = Math.max(6, maxEnd + 4);

        return (
            <div style={{ marginTop: "12px" }}>
                <div className="text-left mb-2 font-bold">Timeline</div>
                <div
                    style={{
                        position: "relative",
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
                            gridTemplateColumns: `80px repeat(${totalColumns}, 1fr)`,
                            minWidth: `${80 + totalColumns * 40}px`
                        }}
                        onClick={(e) => {
                            if (e.target === e.currentTarget) {
                                this.setState({ selectedIndex: null });
                            }
                        }}
                    >
                        <div style={{ fontWeight: "bold" }}>Second</div>
                        {Array.from({ length: totalColumns }).map((_, i) => (
                            <div key={i} style={{ textAlign: "left" }}>{i}</div>
                        ))}

                        {Object.entries(
                            timeline.reduce((acc, item) => {
                                if (!acc[item.object]) acc[item.object] = [];
                                acc[item.object].push(item);
                                return acc;
                            }, {} as Record<string, TimelineItem[]>)
                        ).map(([objectName, items], rowIndex) => (
                            <React.Fragment key={objectName}>
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
                                        onClick={() => this.setState({ selectedIndex: timeline.indexOf(item) })}
                                    >
                                        {item.action}
                                    </div>
                                ))}
                            </React.Fragment>
                        ))}

                    </div>
                </div>

                {selectedItem && (
                    <div className="d-flex flex-column">
                        <div style={{ width: "100%", padding: "4px", textAlign: "left", background: "#f7f7f7" }}>
                            {selectedItem.object}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "12px", marginBottom: "12px" }}>
                            <div style={{ width: "100px", padding: "4px", textAlign: "left", background: "#f7f7f7" }}>Basic</div>
                            <label>Start</label>
                            <div onClick={() => this.handleTimeEdit("start")} style={{
                                width: "60px", padding: "4px", border: "1px solid #ccc", borderRadius: "6px", textAlign: "center", cursor: "pointer", background: "#f7f7f7"
                            }}>{selectedItem.start}</div>

                            <label>End</label>
                            <div onClick={() => this.handleTimeEdit("end")} style={{
                                width: "60px", padding: "4px", border: "1px solid #ccc", borderRadius: "6px", textAlign: "center", cursor: "pointer", background: "#f7f7f7"
                            }}>{selectedItem.end}</div>

                            <button onClick={this.handleDeleteSelected} style={{ border: "1px solid black", background: "white", padding: "4px 8px" }}>Delete</button>
                        </div>
                    </div>
                )}

                {selectedItem && selectedItem.values && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
                        {
                            Object.entries(selectedItem.values).map(([key, val]) => {
                                if (key === "translateTo" && val && typeof val === "object") {
                                    const vx = val.x ?? val[0] ?? 0;
                                    const vy = val.y ?? val[1] ?? 0;
                                    const vz = val.z ?? val[2] ?? 0;
                                    return (
                                        <div key={key} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                            <div style={{ width: "100px" }}>Translate To</div>
                                            <div style={{ width: "160px", padding: "4px", border: "1px solid #ccc", borderRadius: "6px", textAlign: "center", background: "#f7f7f7" }}>
                                                ({vx.toFixed(1)}, {vy.toFixed(1)}, {vz.toFixed(1)})
                                            </div>
                                            <button onClick={this.handleReselectDestination} style={{ border: "1px solid black", background: "white", padding: "2px 6px", cursor: "pointer" }}>Re-select</button>
                                            <button onClick={() => this.handleDeleteTransform(key)} style={{ border: "1px solid black", background: "white", padding: "2px 6px", cursor: "pointer" }}>Delete</button>
                                        </div>
                                    );
                                } else if (key === "rotate") {
                                    const pivotX = selectedItem.values?.pivotX;
                                    const pivotY = selectedItem.values?.pivotY;
                                    const pivotZ = selectedItem.values?.pivotZ;
                                    const ccw = selectedItem.values?.ccw ?? false;

                                    return (
                                        <div key={`rot-block-${key}`}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                <div style={{ width: "100px" }}>Rotate</div>
                                                <div onClick={() => this.handleValueEdit(key)} style={{
                                                    width: "80px", padding: "4px", border: "1px solid #ccc", borderRadius: "6px",
                                                    textAlign: "center", cursor: "pointer", background: "#f7f7f7"
                                                }}>{val}°</div>

                                                {pivotX !== undefined && pivotY !== undefined && (
                                                    <div style={{ padding: "4px", border: "1px solid #ddd", background: "#fafafa" }}>
                                                        Pivot: ({pivotX.toFixed(1)}, {pivotY.toFixed(1)}, {(pivotZ ?? 0).toFixed(1)})
                                                    </div>
                                                )}

                                                <button onClick={this.handleReselectRotationPivot} style={{ border: "1px solid black", background: "white", padding: "2px 6px", cursor: "pointer" }}>Re-select Pivot</button>

                                                <button onClick={() => this.handleDeleteTransform(key)} style={{ border: "1px solid black", background: "white", padding: "2px 6px", cursor: "pointer" }}>Delete</button>
                                            </div>

                                            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px" }}>
                                                <label>CCW</label>
                                                <input type="checkbox" checked={ccw} onChange={(e) => {
                                                    const newCCW = e.target.checked;
                                                    this.props.setTimeline(prev => {
                                                        const updated = [...prev];
                                                        const idx = this.state.selectedIndex!;
                                                        const item = { ...updated[idx] };
                                                        item.values = { ...(item.values ?? {}), ccw: newCCW };
                                                        updated[idx] = item;
                                                        return updated;
                                                    });
                                                }} />
                                            </div>
                                        </div>
                                    );
                                } else if (key === "scale") {
                                    return (
                                        <div key={key} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                            <div style={{ width: "100px" }}>{this.capitalize(key)}</div>
                                            <div onClick={() => this.handleValueEdit(key)} style={{
                                                width: "80px", padding: "4px", border: "1px solid #ccc",
                                                borderRadius: "6px", textAlign: "center", cursor: "pointer", background: "#f7f7f7"
                                            }} title={`Edit ${this.capitalize(key)}`}>{val}</div>
                                            <button onClick={() => this.handleDeleteTransform(key)} style={{ border: "1px solid black", background: "white", padding: "2px 6px", cursor: "pointer" }}>Delete</button>
                                        </div>
                                    );
                                }
                                // default: render nothing for unrecognized or handled keys
                                return null;
                            })
                        }
                    </div>
                )}

            </div>
        );
    }

    render(): React.ReactNode {
        const tools = [
            { key: "translate", label: "Translate", title: "Move selected object or add new", onClick: () => this.setActiveTool("translate") },
            { key: "rotate", label: "Rotate", title: "...", onClick: () => this.setActiveTool("rotate") },
            { key: "scale", label: "Scale", title: "...", onClick: () => this.setActiveTool("scale") },
        ];

        return (
            <div className="customScrollBar" style={{
                position: "relative",
                width: this.props.width,
                height: this.props.height,
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#f9f9f9",
                overflow: "auto",
                padding: "8px 16px 14px 16px"
            }}>
                {this.renderTimelineGrid()}

                <div className="d-flex justify-content-evenly items-center mb-4" style={{ marginTop: "12px" }}>
                    <button onClick={this.handleReset} style={{ border: "1px solid black", background: "white", padding: "4px 8px" }}>⏪ Return</button>

                    {this.state.isPlaying ? (
                        <button onClick={this.handlePause} style={{ border: "1px solid black", background: "white", padding: "4px 8px" }}>⏸ Pause</button>
                    ) : (
                        <button onClick={this.handlePlay} style={{ border: "1px solid black", background: "white", padding: "4px 8px" }}>▶ Play</button>
                    )}

                    <button onClick={this.handleExport} style={{ border: "1px solid black", background: "white", padding: "4px 8px" }}>Export</button>
                </div>

                <div className="catLabel text-neutral-900 mb-2">Animation Tools</div>
                <div className="categoryPanel" style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                    {tools.map(tool => (
                        <button key={tool.key} type="button" className={`toolButton${this.state.activeButton === tool.key ? " selected" : ""}`} onClick={tool.onClick} title={tool.title}>
                            <div className="label">{tool.label}</div>
                        </button>
                    ))}
                </div>
            </div>
        );
    }
}
