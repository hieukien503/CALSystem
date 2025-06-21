import React from "react";
import KonvaCanvas from "./KonvaRender";
import { GeometryTool } from "./GeometryTool";
import Dialogbox from "./Dialogbox";
import { Point, GeometryState, Shape, ShapeNode, DrawingMode, HistoryEntry } from '../types/geometry'
import * as constants from '../types/constants'
import * as utils from '../utils/utilities'
import MenuItem from "./MenuItem";
import Konva from "konva";

type SharingMode = 'public' | 'private' | 'organization-wide';

interface ProjectProps {
    width: number;
    height: number;
    id: string;
    title: string;
    description: string;
    sharing: SharingMode;
    projectVersion: {
        versionName: string;
        versionNumber: string;
        createdAt: string;
        updatedAt: string;
        updatedBy: string;
    };
    collaborators: {id: string, role: string}[];
    ownedBy: string;
}

interface Project2DState {
    geometryState: GeometryState;
    dag: Map<string, ShapeNode>;
    selectedPoints: Point[];
    selectedShapes: Shape[];
    mode: DrawingMode;
    isSnapToGrid: boolean;
    /** Tool resizes or not */
    isResize: boolean;
    /** Tool width */
    toolWidth: number;
    /** Menu when right click */
    isMenuRightClick: {
        x: number
        y: number
    } | undefined
    /** Checked for SnapToGrid */
    snapToGridEnabled: boolean;
}

class Project2D extends React.Component<ProjectProps, Project2DState> {
    private labelUsed: string[];
    private historyStack: HistoryEntry[];
    private futureStack: HistoryEntry[];
    private lastFailedState: {
        selectedPoints: Point[];
        selectedShapes: Shape[];
    } | null;
    constructor(props: ProjectProps) {
        super(props);
        this.labelUsed = [];
        this.state = {
            geometryState: {
                numLoops: 0,
                axisTickInterval: 1,
                spacing: constants.BASE_SPACING,
                shapes: [],
                gridVisible: true,
                zoom_level: 1,
                axesVisible: true,
                panning: false,
                polygonIndex: 0
            },
            mode: 'edit',
            dag: new Map<string, ShapeNode>(),
            selectedPoints: new Array<Point>(),
            selectedShapes: new Array<Shape>(),
            snapToGridEnabled: false,
            isSnapToGrid: false,
            isResize: false,
            toolWidth: 280,
            isMenuRightClick: undefined
        }

        this.lastFailedState = null;
        this.historyStack = new Array<HistoryEntry>(utils.clone(
            this.state.geometryState,
            this.state.dag,
            this.state.selectedPoints,
            this.state.selectedShapes,
            this.labelUsed
        )); // Initialize history stack
        
        this.futureStack = new Array<HistoryEntry>();
    }

    private setRightMenuClick = (pos?: {x: number, y: number}): void => {
        this.setState({isMenuRightClick: pos});
    }

    private handleUndoClick = () => {
        if (this.lastFailedState) {
            const dag = utils.cloneDAG(this.state.dag);
            this.state.dag.forEach((node, key) => {
                if (this.lastFailedState?.selectedPoints.find(point => point.props.id === key) ||
                    this.lastFailedState?.selectedShapes.find(shape => shape.props.id === key)
                ) {
                    this.labelUsed = this.labelUsed.filter(label => label !== dag.get(key)!.type.props.label);
                    dag.get(key)!.node.destroy();
                    dag.delete(key);
                }
            });

            this.setState({
                dag: dag,
                selectedPoints: [],
                selectedShapes: [],
                isMenuRightClick: undefined
            });

            return;
        }

        let copyState: HistoryEntry | undefined = undefined;
        if (this.historyStack.length > 1) {
            this.futureStack.push(this.historyStack.pop()!);
            const prevState = this.historyStack[this.historyStack.length - 1];
            copyState = utils.clone(prevState.state, prevState.dag, prevState.selectedPoints, prevState.selectedShapes, prevState.label_used);
        }

        else {
            const prevState = this.historyStack[0];
            copyState = utils.clone(prevState.state, prevState.dag, prevState.selectedPoints, prevState.selectedShapes, prevState.label_used);
        }

        const DAG = utils.cloneDAG(copyState.dag);
        this.labelUsed = copyState.label_used

        this.setState({
            geometryState: copyState.state,
            selectedPoints: copyState.selectedPoints,
            selectedShapes: copyState.selectedShapes,
            mode: 'edit',
            dag: DAG,
            isMenuRightClick: undefined
        });
    }

    private handleRedoClick = () => {
        if (this.futureStack.length > 0) {
            const nextState = this.futureStack.pop()!;
            this.historyStack.push(nextState);
            if (this.historyStack.length > 100) {
                this.historyStack.splice(0, 1);
            }

            const copyState = utils.clone(nextState.state, nextState.dag, nextState.selectedPoints, nextState.selectedShapes, nextState.label_used);

            const DAG = utils.cloneDAG(copyState.dag);

            this.labelUsed = copyState.label_used

            this.setState({
                geometryState: copyState.state,
                selectedPoints: copyState.selectedPoints,
                selectedShapes: copyState.selectedShapes,
                mode: 'edit',
                dag: DAG,
                isMenuRightClick: undefined
            });
        }
    }

    private handleMouseDownResize = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        document.addEventListener("mousemove", this.handleMouseMoveResize);
        document.addEventListener("mouseup", this.handleMouseUpResize);
        this.setState({ isResize: true, isMenuRightClick: undefined });
    }

    private handleMouseMoveResize = (e: MouseEvent) => {
        if (!this.state.isResize) return;
        const newWidth = e.clientX + 4;
        if (newWidth > 150) {
            this.setState({ toolWidth: newWidth });
        }

        else {
            this.setState({ toolWidth: 0 });
        }
    }

    private handleMouseUpResize = () => {
        document.removeEventListener("mousemove", this.handleMouseMoveResize);
        document.removeEventListener("mouseup", this.handleMouseUpResize);
        this.setState({ isResize: false });
    };

    private pushHistory = (history: HistoryEntry) => {
        this.historyStack.push(history);
        if (this.historyStack.length > 100) {
            this.historyStack.splice(0, 1);
        }

        this.futureStack = [];
    }

    private handleClearCanvas = () => {
        this.labelUsed.length = 0;
        this.setState({
            geometryState: {...this.state.geometryState, shapes: []},
            selectedPoints: new Array<Point>(),
            selectedShapes: new Array<Shape>(),
            dag: new Map<string, ShapeNode>(),
            isMenuRightClick: undefined
        }, () => {
            this.pushHistory(utils.clone(
                this.state.geometryState,
                this.state.dag,
                this.state.selectedPoints,
                this.state.selectedShapes,
                this.labelUsed
            ))
        })
    }

    private updateAll = (state: {
        gs: GeometryState,
        dag: Map<string, ShapeNode>,
        selectedShapes: Shape[],
        selectedPoints: Point[]
    }) => {
        state.dag.forEach((node, key) => {
            if (!state.selectedPoints.find(value => value.props.id === key) && !state.selectedShapes.find(value => value.props.id === key)) {
                node.isSelected = false;
                if (node.id.includes('point-')) {
                    (node.node as Konva.Circle).shadowBlur(0);
                    (node.node as Konva.Circle).shadowOpacity(0);
                }
                
                else {
                    const strokeWidth = node.type.props.line_size / this.state.geometryState.zoom_level;
                    node.node.strokeWidth(strokeWidth);
                }
            }
        });

        this.setState({
            geometryState: {...state.gs},
            dag: state.dag,
            selectedPoints: [...state.selectedPoints],
            selectedShapes: [...state.selectedShapes]
        }, () => {
            if (!this.lastFailedState) {
                this.pushHistory(utils.clone(
                    this.state.geometryState,
                    this.state.dag,
                    this.state.selectedPoints,
                    this.state.selectedShapes,
                    this.labelUsed
                ))
            }
        });
    }

    private updateLastFailedState = (state?: {
        selectedPoints: Point[], selectedShapes: Shape[]
    }): void => {
        this.lastFailedState = state? {
            selectedPoints: [...state.selectedPoints],
            selectedShapes: [...state.selectedShapes]
        } : null;
    }

    private updateLabelUsed = (labelUsed: string[]): void => {
        this.labelUsed = [...labelUsed];
    }

    private onSelectedPointsChange = (selectedPoints: Point[]): void => {
        const DAG = utils.cloneDAG(this.state.dag);
        DAG.forEach((node, key) => {
            if (!selectedPoints.find(value => value.props.id === key)) {
                node.isSelected = false;
                if (node.id.includes('point-')) {
                    (node.node as Konva.Circle).shadowBlur(0);
                    (node.node as Konva.Circle).shadowOpacity(0);
                }
                
                else {
                    const strokeWidth = node.type.props.line_size / this.state.geometryState.zoom_level;
                    node.node.strokeWidth(strokeWidth);
                }
            }

            else {
                node.isSelected = true;
                (node.node as Konva.Circle).shadowColor('gray');
                (node.node as Konva.Circle).shadowBlur((node.node as Konva.Circle).radius() * 2.5);
                (node.node as Konva.Circle).shadowOpacity(1.5);
            }
        });

        this.setState({
            dag: DAG,
            selectedPoints: [...selectedPoints]
        })
    }

    private onSelectedShapesChange = (selectedShapes: Shape[]): void => {
        const DAG = utils.cloneDAG(this.state.dag);
        DAG.forEach((node, key) => {
            if (!selectedShapes.find(value => value.props.id === key)) {
                node.isSelected = false;
                if (node.id.includes('point-')) {
                    (node.node as Konva.Circle).shadowBlur(0);
                    (node.node as Konva.Circle).shadowOpacity(0);
                }
                
                else {
                    const strokeWidth = node.type.props.line_size / this.state.geometryState.zoom_level;
                    node.node.strokeWidth(strokeWidth);
                }
            }

            else {
                node.isSelected = true;
                if (node.id.includes('point-')) {
                    (node.node as Konva.Circle).shadowColor('gray');
                    (node.node as Konva.Circle).shadowBlur((node.node as Konva.Circle).radius() * 2.5);
                    (node.node as Konva.Circle).shadowOpacity(1.5);
                }
                
                else {
                    const strokeWidth = node.type.props.line_size / this.state.geometryState.zoom_level;
                    node.node.strokeWidth(strokeWidth * 2);
                }
            }
        });

        this.setState({
            dag: DAG,
            selectedShapes: [...selectedShapes]
        })
    }

    private onSelectedChange = (state: {selectedShapes: Shape[], selectedPoints: Point[]}): void => {
        const DAG = utils.cloneDAG(this.state.dag);
        DAG.forEach((node, key) => {
            if (!state.selectedPoints.find(value => value.props.id === key) && !state.selectedShapes.find(value => value.props.id === key)) {
                node.isSelected = false;
                if (node.id.includes('point-')) {
                    (node.node as Konva.Circle).shadowBlur(0);
                    (node.node as Konva.Circle).shadowOpacity(0);
                }
                
                else {
                    const strokeWidth = node.type.props.line_size / this.state.geometryState.zoom_level;
                    node.node.strokeWidth(strokeWidth);
                }
            }

            else {
                node.isSelected = true;
                if (node.id.includes('point-')) {
                    (node.node as Konva.Circle).shadowColor('gray');
                    (node.node as Konva.Circle).shadowBlur((node.node as Konva.Circle).radius() * 2.5);
                    (node.node as Konva.Circle).shadowOpacity(1.5);
                }
                
                else {
                    const strokeWidth = node.type.props.line_size / this.state.geometryState.zoom_level;
                    node.node.strokeWidth(strokeWidth * 2);
                }
            }
        });

        this.setState({
            dag: DAG,
            selectedPoints: [...state.selectedPoints],
            selectedShapes: [...state.selectedShapes]
        })
    }

    private removeNodeBatch = (id: string, visited: Set<string>, state: {
        shapes: string[],
        labelUsed: string[],
        dag: Map<string, ShapeNode>
    }) => {
        if (visited.has(id)) return;
        const node = state.dag.get(id);
        if (!node) return;

        visited.add(id);
        // 1. Find all dependent nodes and recursively remove them
        state.dag.forEach((value, key) => {
            if (value.dependsOn.includes(id)) {
                this.removeNodeBatch(key, visited, state);
            }
        });

        // 2. Clean up
        state.labelUsed = state.labelUsed.filter(
            label => label !== node.type.props.label
        );

        (node as ShapeNode).node.destroy();
        state.dag.delete(id);

        // 3. Remove from shapes
        state.shapes = state.shapes.filter(shapeId => shapeId !== id);
    };

    // Public method that does batch delete with single re-render
    private removeNode = (id: string): void => {
        const newShapes = [...this.state.geometryState.shapes];
        const dag = utils.cloneDAG(this.state.dag);
        const set = new Set<string>();

        this.removeNodeBatch(id, set, { shapes: newShapes, labelUsed: this.labelUsed, dag: dag });

        // Only one render here
        this.setState({
            geometryState: this.state.geometryState,
            dag: dag,
            selectedPoints: this.state.selectedPoints,
            selectedShapes: this.state.selectedShapes
        })
    };

    private setMode = (mode: DrawingMode) => {
        const DAG = utils.cloneDAG(this.state.dag);
        if (mode === 'delete') {
            let selected: string[] = [];
            DAG.forEach((node, key) => {
                if (node.isSelected) {
                    selected.push(key);
                }
            });

            selected.forEach(id => this.removeNode(id));
        }

        else {
            DAG.forEach((node, key) => {
                node.isSelected = false;
                if (node.id.includes('point-')) {
                    (node.node as Konva.Circle).shadowBlur(0);
                    (node.node as Konva.Circle).shadowOpacity(0);
                }
                
                else {
                    const strokeWidth = node.type.props.line_size / this.state.geometryState.zoom_level;
                    node.node.strokeWidth(strokeWidth);
                }
            });
        }
        
        this.setState({
            dag: DAG,
            mode: mode,
            selectedPoints: [],
            selectedShapes: [],
            isMenuRightClick: undefined
        })
    }

    render(): React.ReactNode {
        return (
            <div className="flex justify-start flex-row">
                <GeometryTool
                    width={this.state.toolWidth}
                    height={this.props.height}
                    onPointClick={() => this.setMode('point')}
                    onLineClick={() => this.setMode('line')}
                    onSegmentClick={() => this.setMode('segment')}
                    onVectorClick={() => this.setMode('vector')}
                    onPolygonClick={() => this.setMode('polygon')}
                    onCircleRadiusClick={() => this.setMode('circle')}
                    onRayClick={() => this.setMode('ray')}
                    onEditClick={() => this.setMode('edit')}
                    onDeleteClick={() => this.setMode('delete')}
                    onClearClick={this.handleClearCanvas}
                    onUndoClick={this.handleUndoClick}
                    onRedoClick={this.handleRedoClick}
                    onAngleClick={() => this.setMode('angle')}
                    onLengthClick={() => this.setMode('length')}
                    onAreaClick={() => this.setMode('area')}
                    onHideLabelClick={() => this.setMode('show_label')}
                    onHideObjectClick={() => this.setMode('show_object')}
                    onIntersectionClick={() => this.setMode('intersection')}
                    onCircle2PointClick={() => this.setMode('circle_2_points')}
                    onCentroidClick={() => this.setMode('centroid')}
                    onCircumcenterClick={() => this.setMode('circumcenter')}
                    onOrthocenterClick={() => this.setMode('orthocenter')}
                    onIncenterClick={() => this.setMode('incenter')}
                    onCircumcircleClick={() => this.setMode('circumcircle')}
                    onIncircleClick={() => this.setMode('incircle')}
                    onExcenterClick={() => this.setMode('excenter')}
                    onExcircleClick={() => this.setMode('excircle')}
                    onMidPointClick={() => this.setMode('midpoint')}
                />
                <div 
                    className="resizer flex justify-center items-center"
                    id="resizer"
                    onMouseDown={this.handleMouseDownResize}
                    onMouseUp={this.handleMouseUpResize}
                >
                    <div className="resizerPanel w-1 h-6 bg-gray-400 rounded"></div>
                </div>
                {this.state.toolWidth < this.props.width && <KonvaCanvas 
                    width={this.props.width - this.state.toolWidth}
                    height={this.props.height}
                    background_color="#ffffff"
                    dag={this.state.dag}
                    onChangeMode={(mode: DrawingMode) => this.setState({mode: mode})}
                    onClearCanvas={this.handleClearCanvas}
                    onSelectedShapesChange={this.onSelectedShapesChange}
                    onSelectedPointsChange={this.onSelectedPointsChange}
                    onGeometryStateChange={(s) => this.setState({geometryState: s})}
                    onSelectedChange = {this.onSelectedChange}
                    mode={this.state.mode}
                    isSnapToGrid={this.state.isSnapToGrid}
                    selectedPoints={this.state.selectedPoints}
                    selectedShapes={this.state.selectedShapes}
                    labelUsed={this.labelUsed}
                    onLabelUsed={this.updateLabelUsed}
                    geometryState={this.state.geometryState}
                    pushHistory={this.pushHistory}
                    onUpdateLastFailedState={this.updateLastFailedState}
                    isResize={this.state.isResize}
                    onUpdateAll={this.updateAll}
                    getSnapshot={() => {
                        return utils.clone(
                            this.state.geometryState,
                            this.state.dag,
                            this.state.selectedPoints,
                            this.state.selectedShapes,
                            this.labelUsed
                        )
                    }}
                    onRenderMenuRightClick={this.setRightMenuClick}
                    onRemoveNode={this.removeNode}
                />}
                {this.state.isMenuRightClick && <MenuItem 
                    isSnapToGrid={this.state.snapToGridEnabled}
                    gridVisible={this.state.geometryState.gridVisible}
                    axisVisible={this.state.geometryState.axesVisible}
                    left={this.state.isMenuRightClick.x}
                    top={this.state.isMenuRightClick.y}
                    onSetAxisVisible={() => this.setState({geometryState: {...this.state.geometryState, axesVisible: !this.state.geometryState.axesVisible}, isMenuRightClick: undefined})}
                    onSetGridVisible={() => this.setState({geometryState: {...this.state.geometryState, gridVisible: !this.state.geometryState.gridVisible}, isMenuRightClick: undefined})}
                    onIsSnapToGrid={() => this.setState((prevState) => {
                        const newSnapToGridEnabled = !prevState.snapToGridEnabled;
                        const newIsSnapToGrid = prevState.geometryState.gridVisible && newSnapToGridEnabled;
                        return {
                            snapToGridEnabled: newSnapToGridEnabled,
                            isSnapToGrid: newIsSnapToGrid,
                            isMenuRightClick: undefined
                        }
                    })}
                />}
            </div>
        )
    }
}

export default Project2D